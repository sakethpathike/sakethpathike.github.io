var e=`---
title: "On-Device Webpage Capture in Linkora"
description: "Rust, JNI, and not leaking memory along the way."
pubDatetime: "Jun 25, 2026 9:30 PM IST"
staticRes: "web-capture-in-linkora"
---

[\`monolith\`](https://crates.io/crates/monolith) is an amazing library built in Rust to save any webpage as a single, portable HTML page. The next version of
Linkora, v0.18.0, will have this feature called \`web-capture\` which completely depends on this library. The next few
sections cover how this is implemented, plus the technical stuff that makes it work.

**TL;DR**: Web capture in Linkora v0.18.0 boils down to one thing, pass a file descriptor to Rust and let it write
directly into the file. The rest of this is the why: how heap memory differs between Rust and ART, how JNI moves data
and exceptions across that boundary, why the other three approaches before this one risk leaking or just aren't worth
it, and the
benchmarks on sequential vs concurrent downloads.

### Heap

Before starting the actual implementation, we need to know how heap memory is managed by Android Runtime (ART) and Rust.
Since heap memory gets allocated dynamically during runtime, some things might not work the way we expect when
integrating things like this.

* ART has the capability to move around objects in memory to avoid empty spaces (which Dalvik didn't have). This gets
  handled by some internal logic that keeps track of actual data and any pointers required at any given moment. Because
  of this, empty memory isn't sitting unallocated for the process anymore. This is done by ART's Garbage Collector. If
  you have raw pointers that don't point to whatever they're supposed to when you access them, it leads to runtime
  problems. You can do pinning via \`GetPrimitiveArrayCritical\`,
  but [it has its own set of problems that you have to take care of](https://stackoverflow.com/a/46608121), and it might
  not always be flexible enough.
* Rust has no such thing as a Garbage Collector. By default, it drops the memory the moment you're out of scope.

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
    timeout: Long,
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
    timeout: jlong,
    allow_insecure_protocol: jboolean,
    ...
) -> jboolean
\`\`\`

The function name is weirder than usual, and that's because that's the naming convention JNI expects.
\`JVMAndAndroidWebCapture\` is the object in which \`saveHTMLPage\` exists, whereas the prefix is the path to that object in
your project hierarchy.

The above function is a wrapper which calls the function from the monolith lib. If you've observed the parameters, we
have datatypes that aren't native to Rust. \`jlong\`, \`JString\`, and \`jboolean\` are meant for JNI binding and are used to
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
4. Since you can't directly create a file natively on Android via Rust, as the web capture file exists outside the
   internal app directory (a user-picked location), create it in Kotlin and make Rust write into it.

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
2. Get the file descriptor and make sure to detach it. In pure Kotlin, you would manually close this, but
   \`File::from_raw_fd\` gives Rust exclusive ownership to automatically close the descriptor when it goes out of scope.
   While you could tell Rust not to drop the memory when it goes out of scope and manually close it from the Kotlin side
   once operations complete, letting Rust handle the cleanup natively is much simpler, so I went with that.
3. Make Rust write the bytes directly into the file that this file descriptor refers to. Since the file descriptor is
   already accessed for use by the user themselves, and since it works at the kernel level, this just works. Rust
   doesn't need to actually have any idea of how a URI on Android resolves, or anything like that.

Something like:

\`\`\`
let mut web_capture_file = unsafe { File::from_raw_fd(file_descriptor) };
web_capture_file.write_all(<bytes>)
\`\`\`

### Storage

Linkora stores these saved pages in individual folders (to support multiple copies of the same link where content
might be different due to any changes on the actual web page). Each folder represents one link,
and the name of the folder is a UUID. That UUID maps back to the actual URL inside an independent database, which is
stored right alongside the folders wherever the user chose to save their web captures.

JSON is simple to set up, but you absolutely do not want to read
and rewrite an entire JSON file into memory just to look up a folder reference or delete a single entry. You can never
guess how much a user will scale their library, so it's much better to set things up properly from the start using a
real database.

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

If you have read this far, I am fairly sure you know why downloading things sequentially when it is not needed is a bad
idea. I have tested sequentially and concurrently and profiled on both environments.

Both of these tests start against these pages:

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

#### 1. Sequential

CPU and memory readings from the Android Profiler on a build that is the same as release:

<video controls width="100%">
    <source src="https://59a32181-7426-4354.netlify.app/web-capture/Sequential.mp4" type="video/mp4">
</video>

Max memory hit is 470.8 MB, and it varies from 50-200 MB most of the time, occasionally spiking
into the 300-400 MB range.

Logs:

\`\`\`
13:14:54.903 web-capture: Starting downloads
13:14:54.903 web-capture: Downloading https://github.com/Y2Z/monolith
13:15:08.430 web-capture: Downloaded https://github.com/Y2Z/monolith
13:15:08.431 web-capture: Downloading https://keepandroidopen.org/
13:15:38.824 web-capture: Downloaded https://keepandroidopen.org/
13:15:38.825 web-capture: Downloading https://zed.dev/blog/crdts
13:16:12.343 web-capture: Downloaded https://zed.dev/blog/crdts
13:16:12.343 web-capture: Downloading https://genius.com/artists/Fleetwood-mac
13:16:21.066 web-capture: Downloaded https://genius.com/artists/Fleetwood-mac
13:16:21.066 web-capture: Downloading https://kotlinlang.org/docs/multiplatform/get-started.html
13:16:28.701 web-capture: Downloaded https://kotlinlang.org/docs/multiplatform/get-started.html
13:16:28.701 web-capture: Downloading https://x.com/FallonTonight/status/2055143968711823639
13:16:35.671 web-capture: Downloaded https://x.com/FallonTonight/status/2055143968711823639
13:16:35.671 web-capture: Downloading https://vimeo.com/676247342
13:16:37.593 web-capture: Downloaded https://vimeo.com/676247342
13:16:37.593 web-capture: Downloading https://www.opensuse.org/
13:16:44.778 web-capture: Downloaded https://www.opensuse.org/
13:16:44.779 web-capture: Downloading https://f-droid.org/
13:16:51.662 web-capture: Downloaded https://f-droid.org/
13:16:51.662 web-capture: Downloading https://en.wikipedia.org/wiki/Cowboy_Bebop
13:17:06.950 web-capture: Downloaded https://en.wikipedia.org/wiki/Cowboy_Bebop
13:17:06.961 web-capture: Completed downloading
\`\`\`

Based on the logs, all operations sequentially took 132 seconds. This involves creating the file, calling
Rust to process everything via \`monolith\`, and writing it to the local file.

#### 2. Concurrent

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

CPU and memory readings from the Android Profiler on a build that is the same as release:

<video controls width="100%">
    <source src="https://59a32181-7426-4354.netlify.app/web-capture/Concurrent.mp4" type="video/mp4">
</video>

The sequential approach hit a peak of 470 MB, while this hit a peak of 404 MB. Although coroutines on \`Dispatchers.IO\`
can
execute in true parallel across a thread pool (up to 64 threads at any given time), semaphore caps us at 4 active
tasks. Because each page takes a different amount of time to process, and coroutines still suspend and yield control
during execution, the 4 tasks running at any given moment constantly shift. This means peak memory allocations do not
perfectly overlap or compound. The 66 MB difference simply executed at different times within our timeline, happening
either before or after we hit the peak.

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

---

Here are some pages/references I went through via search results while working on this:

1. https://www.reddit.com/r/rust/comments/38ka6i/how_to_close_a_file/
2. https://www.reddit.com/r/rust/comments/1duc594/reading_granted_content_file_uris_on_android/
3. https://source.android.com/docs/core/runtime#Improved_GC
4. https://stackoverflow.com/a/79665618

This feature is currently on the \`dev\` branch since it is not yet completed for a release. If you want to see how this
works across Android and Desktop via Kotlin Multiplatform, check
out: https://github.com/LinkoraApp/Linkora/tree/dev
`;export{e as default};