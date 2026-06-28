var e=`---
title: "Building Webpage Capture in Linkora"
description: "Rust, JNI, file descriptors, and coroutines that don't know they've been cancelled."
pubDatetime: "Jun 27, 2026 9:30 PM IST"
staticRes: "web-capture-in-linkora"
---

[\`monolith\`](https://crates.io/crates/monolith) is an amazing library built in Rust to save any webpage as a single,
portable HTML page. The next version of Linkora, v0.18.0, will have this feature called \`web-capture\` which depends on
this library. The next few sections cover how this is currently being implemented, plus the technical
constraints shaping it (i.e. this is a log and not a tutorial nor any sort of guide).

**TL;DR**: Web capture in Linkora v0.18.0 currently boils down to passing a file descriptor to Rust so it can write
directly to disk. The rest of this log covers the why: how heap memory differs between Rust and ART, how JNI handles
data types and exceptions, what happens to coroutine cancellations when Rust takes over the thread, why the other three
approaches risk leaking or aren't worth the hassle, and the current benchmarks on concurrent downloads.

### Heap

Before starting the actual implementation, we need to know how heap memory is managed by Android Runtime (ART) and Rust.
Since heap memory gets allocated dynamically during runtime, some things might not work the way we expect when
integrating things like this.

* ART has the capability to move around objects in memory to avoid empty spaces (which Dalvik didn't have). This gets
  handled by some internal logic that keeps track of actual data and any pointers required at any given moment. Because
  of this, empty memory isn't sitting unallocated for the process anymore. This is done by ART's Garbage Collector.
    * If you have raw pointers that don't point to whatever they're supposed to when you access them, it leads to
      runtime
      problems. You can do pinning via \`GetPrimitiveArrayCritical\`,
      but [it has its own set of problems that you have to take care of](https://stackoverflow.com/a/46608121), and it
      might
      not always be flexible enough.
* Rust has no such thing as a Garbage Collector. By default, it drops the memory the moment it's out of scope.

Now with this integration, we're supposed to respect these constraints and only access or share data that isn't going to
crash at runtime, since there's no way to verify the integration of these two at compile time.

### JNI

Thankfully, JNI does the heavy lifting here and we have to think about very few things that we're supposed to handle.
With Linkora, we're supposed to handle the HTML content returned by the \`monolith\` library and write it to the folder
it's supposed to save into, based on the user's preferences.

So we need to be able to pass stuff to Rust from Kotlin and get back stuff from Rust to Kotlin.

Kotlin has the \`external\` keyword, which can be used to access functions that aren't implemented in Kotlin:

\`\`\`
external fun saveHTMLPage(
    ...
    fileDescriptor: Int,
    filePath: String,
    allowInsecureProtocol: Boolean
    ...): Boolean
\`\`\`

Similarly, Rust also has support which provides a way for Kotlin to use the target function that's implemented in Rust
via the \`#[no_mangle]\` annotation:

\`\`\`
#[unsafe(no_mangle)]
pub extern "system" fn Java_com_sakethh_linkora_JVMAndAndroidWebCapture_saveHTMLPage(
    ...
    file_descriptor: jint,
    file_path: JString,
    allow_insecure_protocol: jboolean,
    ...
) -> jboolean
\`\`\`

The function name is weirder than usual, and that's because that's the naming convention JNI expects.
\`JVMAndAndroidWebCapture\` is the object in which \`saveHTMLPage\` exists, whereas the prefix is the path to that object in
your project hierarchy.

The above function is a wrapper which calls the function from the \`monolith\` lib. If you've observed the parameters, we
have datatypes that aren't native to Rust. \`jint\`, \`JString\`, and \`jboolean\` are meant for JNI binding and are used to
fetch values sent from Kotlin. You can have a helper function which gets strings that your normal Rust code can use,
like this:

\`\`\`
fn get_string_from_jni(env: &mut JNIEnv, string: JString) -> Option<String> {
    match env.get_string(&string) {
        Ok(str) => Some(str.into()),
        Err(err) => {
            let _ = env.throw_new("java/lang/RuntimeException", err.to_string());
            None
        }
    }
}
\`\`\`

You can also throw exceptions directly from Rust if things don't go as you expect them to, so that Kotlin code can do
whatever it's supposed to. Although it doesn't throw instantly, when you do \`env.throw_new()\`, it doesn't act like a
\`return\` statement or \`throw\`. Rust keeps executing the rest of the block until it hits the bottom of the function. ART
holds onto that pending exception and throws it the moment Rust completes its operations and hands control back
over to Kotlin.

### Writing to file

Now that we have essentially everything we need, writing the HTML content to a file on disk is what remains. Things are
fun here, since doing it differently could just lead to dangling pointers. I've thought about this in a couple of ways:

1. Return the HTML byte array to Kotlin. Easy, you don't have to worry about any sort of dangling pointers and it just
   works.
2. Take a pointer of this HTML byte array from Rust and use it in Kotlin.
3. Create a byte array in Kotlin and let Rust add the bytes to it, then use the byte array on Kotlin's side once Rust is
   done adding them.
4. Since Rust's \`std::fs\` has no idea how to resolve Android's Storage Access Framework (SAF) \`content://\` URIs, you
   can't
   just pass a file path to Rust. Instead, create the file in Kotlin and make Rust write directly into it via a file
   descriptor.

After any of these, we should end up with an HTML file that's portable and fully self-contained. I've used the last
approach, which is simple, practical, and you don't have to worry about either leaking memory or dangling pointers.
Before the fourth approach though, I went through the first three *on paper*, and these points sum them up:

1. The problem with the first approach is that you're doubling the memory used for the same data. The reason is simple,
   as I mentioned before: Rust and ART handle heap memory differently. To access the data from Rust, you must make a
   copy that ART can understand, since ART can't interpret whatever Rust is saying, and vice versa. This is a fairly
   good approach if you don't have large data to transfer and have proper constraints on how big the data usually gets
   when it's copied. I did this in
   an [earlier implementation](https://github.com/LinkoraApp/Linkora/blob/aa41ac56bf02688d12e2f8e620fe58024b38cbab/hoarder/src/main/rust/hoarder.rs#L17).
2. With the second approach, you have to make sure Rust doesn't drop the memory related to the pointer once it's out of
   scope. You can do this with \`Box::into_raw\`, which stops Rust from dropping that memory, making it essentially a
   memory leak on purpose. That means it's now on the calling side, in Kotlin, to manage it properly and close and free
   the resources once all operations are done. Or, you could go with a background operation which doesn't drop the
   memory until the job is done on Kotlin's side, but that is just too much for a simple operation like this.
3. The third approach is more practical than either of these, with two caveats. You can never know the size of this byte
   array ahead of time, since the size of the byte array is known to Rust and not Kotlin. You'd need two calls into
   Rust, one which returns the size of the array, and then the rest of the implementation continues. The other issue is
   quite obvious if you went through the stack overflow post I've referred to earlier in the heap section. This is more
   practical than the ones above, but the fourth is the simplest way to do this that doesn't suck.

### File descriptors

You pass the file descriptor to Rust, and that is pretty much it:

1. Create the file via Kotlin.
2. Get the file descriptor with write access and make sure to detach it:
    \`\`\`
    contentResolver.openFileDescriptor(<uri>, "w")?.detachFd()
    \`\`\`
   Closing the \`ParcelFileDescriptor\` after detaching the fd has no effect since \`detachFd()\` already detaches the fd
   from the object itself, rust still continues to write as usual, if you want to force-close it, you must adopt the fd
   and then close it:
   \`\`\`
   ParcelFileDescriptor.adoptFd(webCaptureFileDescriptor).close() // webCaptureFileDescriptor is an Int
   \`\`\`
   With this, Rust instantly loses access to the file. The write fails and surfaces back in Kotlin as a JNI exception (
   if you have implemented it via \`throw_new\`):
   \`\`\`
   Bad file descriptor (os error 9)
   \`\`\`
3. Make Rust write the bytes directly into the file that this file descriptor refers to.
   Something like:
   \`\`\`
   let mut web_capture_file = unsafe { File::from_raw_fd(file_descriptor) };
   web_capture_file.write_all(<bytes>)
   \`\`\`
   \`File::from_raw_fd\` gives Rust exclusive ownership to automatically close the descriptor when it goes out of
   scope. While you could tell Rust not to drop the memory when it goes out of scope and
   manually close it from the Kotlin side once operations complete, letting Rust handle the cleanup natively is much
   simpler, so I went with that.

Since the file descriptor works at the kernel level, this just works. Rust
doesn't need to actually have any idea of how a URI on Android resolves, or anything like that.

Now, things might go wrong here; Rust can panic and force crash the app, especially since we are out of boundary when
operating from Kotlin and we have no control over it. Thankfully, Rust has \`catch_unwind\` which helps in catching the
panics that can unwind, for which you must not have \`panic = "abort"\` in the release profile. This is what Linkora
does on the Rust side where it has the control, and if anything goes wrong, the process won't be killed.

\`\`\`
pub extern "system" fn Java_com_sakethh_linkora_JVMAndAndroidWebCapture_saveHTMLPage(
...
) -> jboolean {
 let web_capture_result = catch_unwind(AssertUnwindSafe(|| {
     let Some(url) = get_string_from_jni(&mut env, url) else {
     ...
 ...
 }
  
 match web_capture_result {
    Ok(result) => result,
    Err(panic_payload) => {
        let _ = env.throw_new(
            "java/lang/RuntimeException",
            get_string_from_panic_payload(panic_payload),
        );
        jboolean::from(false)
    }
 }
}
\`\`\`

![panic-handle](/images/web-capture-in-linkora/panic-handle.png)

### Benchmarks & Profiling

I have it set up as follows just for manual testing:

\`\`\`
viewModelScope.launch(PlatformIODispatcher) {
    ...
    webCapture.saveHTMLPage(
    nativeFolderPath = webCapturesLocation,
    ...
    useCss = true,
    embedFonts = true,
    embedImages = true,
    ...
    includeAudioElements = true,
    includeVideoElements = true,
    includeMetadata = true
    )
    ...
}
\`\`\`

where \`PlatformIODispatcher\` is:

\`\`\`
expect val PlatformIODispatcher: CoroutineDispatcher
\`\`\`

This test starts against these pages:

\`\`\`
listOf(
    "https://github.com/Y2Z/monolith",
    "https://keepandroidopen.org/",
    "https://zed.dev/blog/crdts",
    "https://genius.com/artists/Fleetwood-mac",
    "https://kotlinlang.org/docs/multiplatform/get-started.html",
    "https://x.com/FallonTonight/status/2055143968711823639",
    "https://vimeo.com/676247342",
    "https://www.opensuse.org/",
    "https://f-droid.org/",
    "https://en.wikipedia.org/wiki/Cowboy_Bebop"
)
\`\`\`

#### Concurrent downloads

In this example, I have set it to 4 downloads at a time:

\`\`\`
listOf(
    "https://github.com/Y2Z/monolith",
    "https://keepandroidopen.org/",
    ...
    "https://f-droid.org/",
    "https://en.wikipedia.org/wiki/Cowboy_Bebop"
).map { url ->
    flow {
        try {
            ...
            webCapture.saveHTMLPage(
                nativeFolderPath = webCapturesLocation,
                url = url,
                ...
            ).onSuccess {
                ...
            }.onFailure {
                ...
            }
        } catch (e: ...) {
            ...
        }
    }
}.asFlow().flattenMerge(concurrency = 4).collect { result ->
    ...
}
\`\`\`

\`flattenMerge\` uses \`ChannelFlowMerge\` which implements:

\`\`\`
...
override suspend fun collectTo(scope: ProducerScope<T>) {
    val semaphore = Semaphore(concurrency)
    ...
    flow.collect { inner ->
        job?.ensureActive()
        semaphore.acquire()
        scope.launch {
            try {
                inner.collect(collector)
            } finally {
                semaphore.release()
            }
        }
    }
}
...
\`\`\`

This gives us strict concurrency, allowing us to throttle downloads manually.

For sites with a lot of media, memory spikes are obvious. Since media can be stripped down from the app preferences if
not needed, memory usage will vary. For testing, I allowed embedding of all available CSS, fonts, media, metadata, and
JavaScript.

For context, here are the final sizes of these self-contained files:

| Link                                                       | Size      |
|:-----------------------------------------------------------|:----------|
| https://zed.dev/blog/crdts                                 | 119.01 MB |
| https://github.com/Y2Z/monolith                            | 16.15 MB  |
| https://genius.com/artists/Fleetwood-mac                   | 13.53 MB  |
| https://keepandroidopen.org/                               | 4.30 MB   |
| https://kotlinlang.org/docs/multiplatform/get-started.html | 3.77 MB   |
| https://x.com/FallonTonight/status/2055143968711823639     | 2.62 MB   |
| https://www.opensuse.org/                                  | 2.20 MB   |
| https://en.wikipedia.org/wiki/Cowboy_Bebop                 | 1.26 MB   |
| https://f-droid.org/                                       | 536.37 KB |
| https://vimeo.com/676247342                                | 98.10 KB  |

CPU and memory readings from the Android Profiler on a build that is the same as release:

<video controls width="100%">
    <source src="https://59a32181-7426-4354.netlify.app/web-capture/Concurrent.mp4" type="video/mp4">
</video>

This hit a peak of 404 MB, by the time \`write_all\` gets called on the Rust side, the entire HTML doc, base64-embedded
media and all, already has to exist in Rust's heap before a single byte hits disk. The issue here is of course memory,
hitting 404 MB (although it's peak and not average) isn't good and might nuke this process with an Out of Memory
exception, especially on low-end devices, while streaming the bytes might be a better solution than allocating
everything once, but it doesn't exist yet within \`monolith\`.

CPU usage remained quite normal (the app's usage is the green graph inside the Profiler's CPU timeline).

Logs:

\`\`\`
13:27:07.395 web-capture: Starting downloads
13:27:07.402 web-capture: Downloading https://github.com/Y2Z/monolith
13:27:07.402 web-capture: Downloading https://keepandroidopen.org/
13:27:07.405 web-capture: Downloading https://zed.dev/blog/crdts
13:27:07.405 web-capture: Downloading https://genius.com/artists/Fleetwood-mac
13:27:13.232 web-capture: Downloaded https://keepandroidopen.org/
13:27:13.233 web-capture: Downloading https://kotlinlang.org/docs/multiplatform/get-started.html
13:27:19.692 web-capture: Downloaded https://kotlinlang.org/docs/multiplatform/get-started.html
13:27:19.693 web-capture: Downloading https://x.com/FallonTonight/status/2055143968711823639
13:27:20.247 web-capture: Downloaded https://genius.com/artists/Fleetwood-mac
13:27:20.248 web-capture: Downloading https://vimeo.com/676247342
13:27:22.399 web-capture: Downloaded https://vimeo.com/676247342
13:27:22.399 web-capture: Downloading https://www.opensuse.org/
13:27:35.401 web-capture: Downloaded https://github.com/Y2Z/monolith
13:27:35.401 web-capture: Downloading https://f-droid.org/
13:27:35.434 web-capture: Downloaded https://x.com/FallonTonight/status/2055143968711823639
13:27:35.435 web-capture: Downloading https://en.wikipedia.org/wiki/Cowboy_Bebop
13:27:39.432 web-capture: Downloaded https://zed.dev/blog/crdts
13:27:41.942 web-capture: Downloaded https://f-droid.org/
13:27:44.334 web-capture: Downloaded https://www.opensuse.org/
13:27:50.629 web-capture: Downloaded https://en.wikipedia.org/wiki/Cowboy_Bebop
13:27:50.630 web-capture: Completed downloading
\`\`\`

10 downloads concurrently (4 at any given time) took 43 seconds.

### Coroutine Cancellation

Coroutine cancellation affects children of a parent scope which might involve the calls to Rust, but Rust code will not
be affected by these cancellations. In fact, the Kotlin coroutine never truly gets cancelled or completed until the Rust
operations are completed.

The thread is the only subject that both Rust and Kotlin understand. Rust knows nothing
about Kotlin coroutines. A coroutine in Kotlin is a heap-allocated state object managed by
Dispatchers and Structured Concurrency. It relies on sequential invocations of \`resumeWith\`
to drive its compiled \`invokeSuspend\` state machine (\`suspend\` functions), yielding control
back to the executing thread whenever it hits a suspension point so other tasks can be
resumed or started.

Normally, when a Kotlin coroutine gets cancelled, its cancellation status is
flagged. A \`CancellationException\` is then thrown the next time the coroutine enters or is
resumed at a suspension point that checks for cancellation status. This means cancellation
is cooperative and not instantaneous, as the exception is only triggered when the coroutine
enters or is resumed at a suspension point that actively validates the cancellation state.
It doesn't cancel or interrupt any thread during this process because it is not a thread to
begin with.

This cooperative model only applies where suspension points exist. A blocking JNI call into
native code falls into the same category, such as a Rust function invoked synchronously with
no \`delay\`, \`yield\`, or other suspend call anywhere inside it:

\`\`\`kotlin
val job = launch(PlatformIODispatcher) {
    val result = webCapture.saveHTMLPage(...) // blocking JNI call, no suspension point inside
}
job.cancel() // native call keeps running regardless
\`\`\`

Wrapping the call in a coroutine doesn't make it interruptible on its own. There's nothing
inside the native call for the runtime to intercept, so the coroutine only notices the
cancellation once the call returns and execution reaches a suspension point that actually
checks for it. Making a call like this cancellable means wrapping it with
\`suspendCancellableCoroutine\` instead, which gives a hook to signal the native side to abort,
if the native API supports that.

For cleanup tied directly to cancellation, \`CancellableContinuation\` provides \`invokeOnCancellation\`, a handler
registered on the continuation itself. It acts as an anchor inside \`suspendCancellableCoroutine\` to run cleanup the
moment the cancellation signal hits while the coroutine is still paused. This allows us to trigger our cleanup code to
abort the Rust function, because if we waited for the coroutine to resume, the Rust function would have
already finished and there would be nothing left to nuke.

If you're using \`invokeOnCompletion\`, the same applies: it only fires once Rust completes
the operation and hands the thread back.

Consider the following code:

\`\`\`
val testScope = CoroutineScope(PlatformIODispatcher)
testScope.launch {
    linkoraLog("web-capture: Starting downloads")
    launch {
        delay(5000)
        testScope.cancel("web-capture: Cancelling after 5sec delay")
    }
    listOf(
        "https://github.com/Y2Z/monolith",
        "https://keepandroidopen.org/",
        ...
        "https://en.wikipedia.org/wiki/Cowboy_Bebop"
    ).map { url ->
    flow {
        try {
            emit(Result.Loading("web-capture: Downloading $url"))
            webCapture.saveHTMLPage(
                nativeFolderPath = webCapturesLocation,
                url = url,
                ...
            ).onSuccess {
                emit(Result.Success("web-capture: Downloaded $url"))
            }.onFailure {
                emit(Result.Failure("web-capture: Failed to download $url: $it"))
            }
        } catch (e: Exception) {
            if (e is CancellationException) throw e
            emit(Result.Failure("web-capture: Failed to download $url: \${e.message}"))
        }
    }
}.asFlow().flattenMerge(concurrency = 4).collect { result ->
    ...
}
}.invokeOnCompletion { throwable ->
    if (throwable is CancellationException) {
        linkoraLog("web-capture(kotlin): Aborted by cancellation.")
    } else {
        ...
    }
}
\`\`\`

On Rust I have (when targeted at desktop, the app will use the direct path and fd will be -1 when passed from desktop.
I'm using the desktop target here to print whatever Rust is printing, since those don't get printed into the logcat):

\`\`\`
...
let web_capture_file_creation = if file_descriptor == -1 {
    println!("web-capture(rust): Writing: {}", url.to_string());
    let file_path = get_string_from_jni(&mut env, file_path);
    let web_capture_result = std::fs::write(file_path, html_doc);
    println!("web-capture(rust): Written: {}", url);
    web_capture_result
...
match web_capture_file_creation {
    Ok(_) => {
        println!("noice");
    }
    Err(err) => {
...
\`\`\`

Logs for the above operation:

\`\`\`
Linkora Log : web-capture: Starting downloads
Linkora Log : web-capture: Downloading https://genius.com/artists/Fleetwood-mac
Linkora Log : web-capture: Downloading https://keepandroidopen.org/
Linkora Log : web-capture: Downloading https://github.com/Y2Z/monolith
Linkora Log : web-capture: Downloading https://zed.dev/blog/crdts
web-capture(rust): Writing: https://genius.com/artists/Fleetwood-mac
web-capture(rust): Written: https://genius.com/artists/Fleetwood-mac
noice
java.util.concurrent.CancellationException: web-capture: Cancelling after 5sec delay
        at kotlinx.coroutines.ExceptionsKt.CancellationException(Exceptions.kt:17)
        at kotlinx.coroutines.CoroutineScopeKt.cancel(CoroutineScope.kt:1215)
        ...
        at kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.run(CoroutineScheduler.kt:704)
web-capture(rust): Writing: https://github.com/Y2Z/monolith
web-capture(rust): Written: https://github.com/Y2Z/monolith
noice
java.util.concurrent.CancellationException: web-capture: Cancelling after 5sec delay
        at kotlinx.coroutines.ExceptionsKt.CancellationException(Exceptions.kt:17)
        ...
web-capture(rust): Writing: https://keepandroidopen.org/
web-capture(rust): Written: https://keepandroidopen.org/
java.util.concurrent.CancellationException: web-capture: Cancelling after 5sec delay
noice
        at kotlinx.coroutines.ExceptionsKt.CancellationException(Exceptions.kt:17)
        ...
web-capture(rust): Writing: https://zed.dev/blog/crdts
web-capture(rust): Written: https://zed.dev/blog/crdts
noice
java.util.concurrent.CancellationException: web-capture: Cancelling after 5sec delay
        at kotlinx.coroutines.ExceptionsKt.CancellationException(Exceptions.kt:17)
        ...
Linkora Log : web-capture(kotlin): Aborted by cancellation.

\`\`\`

Now as you can see, \`Linkora Log : web-capture(kotlin): Aborted by cancellation.\` gets called only when all the Rust
calls are completed and the handling of whatever threads it was utilizing to run coroutines is handed back over to
Kotlin.

Besides that, you can see that \`emit\` is being used within a scope that is a child of \`testScope\`. Since we are
cancelling the entire scope after 5 seconds, out of 10 links, only those links will be sent to the Rust side whichever
gets in those 5 seconds. For those links, their \`onSuccess\`, \`onFailure\` or whatever you have implemented respectively
will be called, and then the coroutine cancellation will be effective. In this case, since our root scope is cancelled,
\`emit\` will throw the cancellation exception once Rust completes its work, and that is why the stacktrace is
printed 4 times for 4 Rust calls respectively.

Kotlin does have \`runInterruptible\` for blocking calls that won't respond to cancellation, which interrupts the
underlying thread. But that wouldn't help here. Rust's \`std::fs::write\` doesn't poll Java's interrupt flag. The
interrupt would get set, but nothing gets cancelled in Rust.

This doesn't mean you can't cancel what is happening in Rust just because it has no idea what a Kotlin coroutine is. You
can make another JNI call to manually stop the operation, or pass down a shared \`AtomicBoolean\` (as a \`JObject\` to
Rust). The Rust code must then periodically check this boolean flag to see if a cancellation happened. This is exactly
what you would do manually by checking \`isActive\` in pure Kotlin.

---

Here are some links I went through via search results while working on this \`web-capture\` feature so far:

1. https://www.reddit.com/r/rust/comments/38ka6i/how_to_close_a_file/
2. https://www.reddit.com/r/rust/comments/1duc594/reading_granted_content_file_uris_on_android/
3. https://source.android.com/docs/core/runtime#Improved_GC
4. https://stackoverflow.com/a/79665618
5. https://stackoverflow.com/questions/75177508/interrupt-jni-method-execution-in-a-coroutine
6. https://www.reddit.com/r/rust/comments/1cpjyib/to_catch_unwind_or_not_to_catch_unwind/
7. https://source.android.com/docs/setup/build/rust/building-rust-modules/android-rust-patterns#android-logging
8. https://docs.rs/android_logger/0.10.1/android_logger/
9. https://kotlinlang.org/spec/asynchronous-programming-with-coroutines.html

This feature is currently on the \`dev\` branch since it is not yet completed for a release. If you want to see how this
works across Android and Desktop via Kotlin Multiplatform, check
out: https://github.com/LinkoraApp/Linkora/tree/dev`;export{e as default};