import{B as e,R as t,S as n,T as r,et as i,tt as a,w as o,z as s}from"./CXOUEYH_.js";import"./CFKVnMbq.js";import"./DCKuasBZ.js";import{t as c}from"./B2HDiynK.js";import"./N-6q-Igo.js";import{a as l,c as u,i as d,l as f,o as p,r as m,s as h}from"./DJSaBRCA.js";var g={title:`Building Webpage Capture in Linkora`,description:`Rust, JNI, file descriptors, and coroutines that don't know they've been cancelled.`,pubDatetime:`Jun 27, 2026 9:30 PM IST`,staticRes:`web-capture-in-linkora`},{title:_,description:v,pubDatetime:y,staticRes:b}=g,x=o(`<a href="https://crates.io/crates/monolith" rel="nofollow"><code>monolith</code></a> is an amazing library built in Rust to save any webpage as a single,
portable HTML page. The next version of Linkora, v0.18.0, will have this feature called <code>web-capture</code> which depends on
this library. The next few sections cover how this is currently being implemented, plus the technical
constraints shaping it (i.e. this is a log and not a tutorial nor any sort of guide).`,1),S=o(`<strong>TL;DR</strong> : Web capture in Linkora v0.18.0 currently boils down to passing a file descriptor to Rust so it can write
directly to disk. The rest of this log covers the why: how heap memory differs between Rust and ART, how JNI handles
data types and exceptions, what happens to coroutine cancellations when Rust takes over the thread, why the other three
approaches risk leaking or aren’t worth the hassle, and the current benchmarks on concurrent downloads.`,1),C=o(`If you have raw pointers that don’t point to whatever they’re supposed to when you access them, it leads to
runtime
problems. You can do pinning via <!>,
but <!>, and it
might
not always be flexible enough.`,1),w=o(`<!><ul><!></ul>`,1),T=o(`Thankfully, JNI does the heavy lifting here and we have to think about very few things that we’re supposed to handle.
With Linkora, we’re supposed to handle the HTML content returned by the <code>monolith</code> library and write it to the folder
it’s supposed to save into, based on the user’s preferences.`,1),E=o(`Kotlin has the <code>external</code> keyword, which can be used to access functions that aren’t implemented in Kotlin:`,1),D=o(`Similarly, Rust also has support which provides a way for Kotlin to use the target function that’s implemented in Rust
via the <code>#[no_mangle]</code> annotation:`,1),O=o(`The function name is weirder than usual, and that’s because that’s the naming convention JNI expects. <code>JVMAndAndroidWebCapture</code> is the object in which <code>saveHTMLPage</code> exists, whereas the prefix is the path to that object in
your project hierarchy.`,1),k=o(`The above function is a wrapper which calls the function from the <code>monolith</code> lib. If you’ve observed the parameters, we
have datatypes that aren’t native to Rust. <code>jint</code> , <code>JString</code> , and <code>jboolean</code> are meant for JNI binding and are used to
fetch values sent from Kotlin. You can have a helper function which gets strings that your normal Rust code can use,
like this:`,1),A=o(`You can also throw exceptions directly from Rust if things don’t go as you expect them to, so that Kotlin code can do
whatever it’s supposed to. Although it doesn’t throw instantly, when you do <code>env.throw_new()</code> , it doesn’t act like a <code>return</code> statement or <code>throw</code> . Rust keeps executing the rest of the block until it hits the bottom of the function. ART
holds onto that pending exception and throws it the moment Rust completes its operations and hands control back
over to Kotlin.`,1),ee=o(`Since Rust’s <!> has no idea how to resolve Android’s Storage Access Framework (SAF) <!> URIs, you
can’t
just pass a file path to Rust. Instead, create the file in Kotlin and make Rust write directly into it via a file
descriptor.`,1),te=o(`After any of these, we should end up with an HTML file that’s portable and fully self-contained. I’ve used the last
approach, which is simple, practical, and you don’t have to worry about either leaking memory or dangling pointers.
Before the fourth approach though, I went through the first three <em>on paper</em> , and these points sum them up:`,1),ne=o(`The problem with the first approach is that you’re doubling the memory used for the same data. The reason is simple,
as I mentioned before: Rust and ART handle heap memory differently. To access the data from Rust, you must make a
copy that ART can understand, since ART can’t interpret whatever Rust is saying, and vice versa. This is a fairly
good approach if you don’t have large data to transfer and have proper constraints on how big the data usually gets
when it’s copied. I did this in
an <!>.`,1),re=o(`With the second approach, you have to make sure Rust doesn’t drop the memory related to the pointer once it’s out of
scope. You can do this with <!>, which stops Rust from dropping that memory, making it essentially a
memory leak on purpose. That means it’s now on the calling side, in Kotlin, to manage it properly and close and free
the resources once all operations are done. Or, you could go with a background operation which doesn’t drop the
memory until the job is done on Kotlin’s side, but that is just too much for a simple operation like this.`,1),ie=o(`Closing the <!> after detaching the fd has no effect since <!> already detaches the fd
from the object itself, rust still continues to write as usual, if you want to force-close it, you must adopt the fd
and then close it:`,1),ae=o(`With this, Rust instantly loses access to the file. The write fails and surfaces back in Kotlin as a JNI exception (
if you have implemented it via <!>):`,1),oe=o(`<!><!><!><!><!><!>`,1),se=o(`<!> gives Rust exclusive ownership to automatically close the descriptor when it goes out of
scope. While you could tell Rust not to drop the memory when it goes out of scope and
manually close it from the Kotlin side once operations complete, letting Rust handle the cleanup natively is much
simpler, so I went with that.`,1),ce=o(`<!><!><!>`,1),le=o(`Now, things might go wrong here; Rust can panic and force crash the app, especially since we are out of boundary when
operating from Kotlin and we have no control over it. Thankfully, Rust has <code>catch_unwind</code> which helps in catching the
panics that can unwind, for which you must not have <code>panic = "abort"</code> in the release profile. This is what Linkora
does on the Rust side where it has the control, and if anything goes wrong, the process won’t be killed.`,1),ue=o(`where <code>PlatformIODispatcher</code> is:`,1),de=o(`<code>flattenMerge</code> uses <code>ChannelFlowMerge</code> which implements:`,1),fe=o(`<table><thead><tr><th>Link</th><th>Size</th></tr></thead><tbody><tr><td><!></td><td>119.01 MB</td></tr><tr><td><!></td><td>16.15 MB</td></tr><tr><td><!></td><td>13.53 MB</td></tr><tr><td><!></td><td>4.30 MB</td></tr><tr><td><!></td><td>3.77 MB</td></tr><tr><td><!></td><td>2.62 MB</td></tr><tr><td><!></td><td>2.20 MB</td></tr><tr><td><!></td><td>1.26 MB</td></tr><tr><td><!></td><td>536.37 KB</td></tr><tr><td><!></td><td>98.10 KB</td></tr></tbody></table>`),pe=o(`This hit a peak of 404 MB, by the time <code>write_all</code> gets called on the Rust side, the entire HTML doc, base64-embedded
media and all, already has to exist in Rust’s heap before a single byte hits disk. The issue here is of course memory,
hitting 404 MB (although it’s peak and not average) isn’t good and might nuke this process with an Out of Memory
exception, especially on low-end devices, while streaming the bytes might be a better solution than allocating
everything once, but it doesn’t exist yet within <code>monolith</code> .`,1),me=o(`Kotlin will only throw the <code>CancellationException</code> , or whatever you are manually throwing, when Rust finally completes
its
work and hands the thread back. If you are using <code>invokeOnCompletion</code> , this will only get triggered when Rust completes
the operation.
Consider the following code:`,1),he=o(`Now as you can see, <code>Linkora Log : web-capture(kotlin): Aborted by cancellation.</code> gets called only when all the Rust
calls are completed and the handling of whatever threads it was utilizing to run coroutines is handed back over to
Kotlin.`,1),ge=o(`Besides that, you can see that <code>emit</code> is being used within a scope that is a child of <code>testScope</code> . Since we are
cancelling the entire scope after 5 seconds, out of 10 links, only those links will be sent to the Rust side whichever
gets in those 5 seconds. For those links, their <code>onSuccess</code> , <code>onFailure</code> or whatever you have implemented respectively
will be called, and then the coroutine cancellation will be effective. In this case, since our root scope is cancelled, <code>emit</code> will throw the cancellation exception once Rust completes its work, and that is why the stacktrace is
printed 4 times for 4 Rust calls respectively.`,1),_e=o(`Kotlin does have <code>runInterruptible</code> for blocking calls that won’t respond to cancellation, which interrupts the
underlying thread. But that wouldn’t help here. Rust’s <code>std::fs::write</code> doesn’t poll Java’s interrupt flag. The
interrupt would get set, but nothing gets cancelled in Rust.`,1),ve=o(`This doesn’t mean you can’t cancel what is happening in Rust just because it has no idea what a Kotlin coroutine is. You
can make another JNI call to manually stop the operation, or pass down a shared <code>AtomicBoolean</code> (as a <code>JObject</code> to
Rust). The Rust code must then periodically check this boolean flag to see if a cancellation happened. This is exactly
what you would do manually by checking <code>isActive</code> in pure Kotlin.`,1),ye=o(`Here are some links I went through via search results while working on this <code>web-capture</code> feature so far:`,1),be=o(`This feature is currently on the <code>dev</code> branch since it is not yet completed for a release. If you want to see how this
works across Android and Desktop via Kotlin Multiplatform, check
out: <a href="https://github.com/LinkoraApp/Linkora/tree/dev" rel="nofollow">https://github.com/LinkoraApp/Linkora/tree/dev</a>`,1),xe=o(`<!> <!> <!> <!> <ul><!><!></ul> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <ol><!><!><!><!></ol> <!> <ol><!><!><!></ol> <!> <!> <ol><!><!><!></ol> <!> <!> <!> <p><!></p> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <video controls="" width="100%"><source src="https://59a32181-7426-4354.netlify.app/web-capture/Concurrent.mp4" type="video/mp4"/></video> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <hr/> <!> <ol><!><!><!><!><!><!><!><!></ol> <!>`,3);function j(o){var g=xe(),_=s(g);d(_,{children:(e,t)=>{var r=x();i(3),n(e,r)},$$slots:{default:!0}});var v=e(_,2);d(v,{children:(e,t)=>{var r=S();i(),n(e,r)},$$slots:{default:!0}});var y=e(v,2);u(y,{level:3,children:(e,t)=>{i(),n(e,r(`Heap`))},$$slots:{default:!0}});var b=e(y,2);d(b,{children:(e,t)=>{i(),n(e,r(`Before starting the actual implementation, we need to know how heap memory is managed by Android Runtime (ART) and Rust.
Since heap memory gets allocated dynamically during runtime, some things might not work the way we expect when
integrating things like this.`))},$$slots:{default:!0}});var j=e(b,2),M=t(j);l(M,{children:(o,c)=>{var u=w(),m=s(u);d(m,{children:(e,t)=>{i(),n(e,r(`ART has the capability to move around objects in memory to avoid empty spaces (which Dalvik didn’t have). This gets
handled by some internal logic that keeps track of actual data and any pointers required at any given moment. Because
of this, empty memory isn’t sitting unallocated for the process anymore. This is done by ART’s Garbage Collector.`))},$$slots:{default:!0}});var h=e(m);l(t(h),{children:(t,a)=>{d(t,{children:(t,a)=>{i();var o=C(),c=e(s(o));p(c,{text:`GetPrimitiveArrayCritical`}),f(e(c,2),{href:`https://stackoverflow.com/a/46608121`,children:(e,t)=>{i(),n(e,r(`it has its own set of problems that you have to take care of`))},$$slots:{default:!0}}),i(),n(t,o)},$$slots:{default:!0}})},$$slots:{default:!0}}),a(h),n(o,u)},$$slots:{default:!0}}),l(e(M),{children:(e,t)=>{d(e,{children:(e,t)=>{i(),n(e,r(`Rust has no such thing as a Garbage Collector. By default, it drops the memory the moment it’s out of scope.`))},$$slots:{default:!0}})},$$slots:{default:!0}}),a(j);var N=e(j,2);d(N,{children:(e,t)=>{i(),n(e,r(`Now with this integration, we’re supposed to respect these constraints and only access or share data that isn’t going to
crash at runtime, since there’s no way to verify the integration of these two at compile time.`))},$$slots:{default:!0}});var P=e(N,2);u(P,{level:3,children:(e,t)=>{i(),n(e,r(`JNI`))},$$slots:{default:!0}});var F=e(P,2);d(F,{children:(e,t)=>{i();var r=T();i(2),n(e,r)},$$slots:{default:!0}});var I=e(F,2);d(I,{children:(e,t)=>{i(),n(e,r(`So we need to be able to pass stuff to Rust from Kotlin and get back stuff from Rust to Kotlin.`))},$$slots:{default:!0}});var L=e(I,2);d(L,{children:(e,t)=>{i();var r=E();i(2),n(e,r)},$$slots:{default:!0}});var R=e(L,2);c(R,{text:`external fun saveHTMLPage(
    ...
    fileDescriptor: Int,
    filePath: String,
    allowInsecureProtocol: Boolean
    ...): Boolean`});var z=e(R,2);d(z,{children:(e,t)=>{i();var r=D();i(2),n(e,r)},$$slots:{default:!0}});var B=e(z,2);c(B,{text:`#[unsafe(no_mangle)]
pub extern "system" fn Java_com_sakethh_linkora_JVMAndAndroidWebCapture_saveHTMLPage(
    ...
    file_descriptor: jint,
    file_path: JString,
    allow_insecure_protocol: jboolean,
    ...
) -> jboolean`});var V=e(B,2);d(V,{children:(e,t)=>{i();var r=O();i(4),n(e,r)},$$slots:{default:!0}});var H=e(V,2);d(H,{children:(e,t)=>{i();var r=k();i(8),n(e,r)},$$slots:{default:!0}});var U=e(H,2);c(U,{text:`fn get_string_from_jni(env: &mut JNIEnv, string: JString) -> Option<String> {
    match env.get_string(&string) {
        Ok(str) => Some(str.into()),
        Err(err) => {
            let _ = env.throw_new("java/lang/RuntimeException", err.to_string());
            None
        }
    }
}`});var W=e(U,2);d(W,{children:(e,t)=>{i();var r=A();i(6),n(e,r)},$$slots:{default:!0}});var G=e(W,2);u(G,{level:3,children:(e,t)=>{i(),n(e,r(`Writing to file`))},$$slots:{default:!0}});var K=e(G,2);d(K,{children:(e,t)=>{i(),n(e,r(`Now that we have essentially everything we need, writing the HTML content to a file on disk is what remains. Things are
fun here, since doing it differently could just lead to dangling pointers. I’ve thought about this in a couple of ways:`))},$$slots:{default:!0}});var q=e(K,2),Se=t(q);l(Se,{children:(e,t)=>{d(e,{children:(e,t)=>{i(),n(e,r(`Return the HTML byte array to Kotlin. Easy, you don’t have to worry about any sort of dangling pointers and it just
works.`))},$$slots:{default:!0}})},$$slots:{default:!0}});var Ce=e(Se);l(Ce,{children:(e,t)=>{d(e,{children:(e,t)=>{i(),n(e,r(`Take a pointer of this HTML byte array from Rust and use it in Kotlin.`))},$$slots:{default:!0}})},$$slots:{default:!0}});var we=e(Ce);l(we,{children:(e,t)=>{d(e,{children:(e,t)=>{i(),n(e,r(`Create a byte array in Kotlin and let Rust add the bytes to it, then use the byte array on Kotlin’s side once Rust is
done adding them.`))},$$slots:{default:!0}})},$$slots:{default:!0}}),l(e(we),{children:(t,r)=>{d(t,{children:(t,r)=>{i();var a=ee(),o=e(s(a));p(o,{text:`std::fs`}),p(e(o,2),{text:`content://`}),i(),n(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}}),a(q);var Te=e(q,2);d(Te,{children:(e,t)=>{i();var r=te();i(2),n(e,r)},$$slots:{default:!0}});var J=e(Te,2),Ee=t(J);l(Ee,{children:(t,a)=>{d(t,{children:(t,a)=>{i();var o=ne();f(e(s(o)),{href:`https://github.com/LinkoraApp/Linkora/blob/aa41ac56bf02688d12e2f8e620fe58024b38cbab/hoarder/src/main/rust/hoarder.rs#L17`,children:(e,t)=>{i(),n(e,r(`earlier implementation`))},$$slots:{default:!0}}),i(),n(t,o)},$$slots:{default:!0}})},$$slots:{default:!0}});var De=e(Ee);l(De,{children:(t,r)=>{d(t,{children:(t,r)=>{i();var a=re();p(e(s(a)),{text:`Box::into_raw`}),i(),n(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}}),l(e(De),{children:(e,t)=>{d(e,{children:(e,t)=>{i(),n(e,r(`The third approach is more practical than either of these, with two caveats. You can never know the size of this byte
array ahead of time, since the size of the byte array is known to Rust and not Kotlin. You’d need two calls into
Rust, one which returns the size of the array, and then the rest of the implementation continues. The other issue is
quite obvious if you went through the stack overflow post I’ve referred to earlier in the heap section. This is more
practical than the ones above, but the fourth is the simplest way to do this that doesn’t suck.`))},$$slots:{default:!0}})},$$slots:{default:!0}}),a(J);var Oe=e(J,2);u(Oe,{level:3,children:(e,t)=>{i(),n(e,r(`File descriptors`))},$$slots:{default:!0}});var ke=e(Oe,2);d(ke,{children:(e,t)=>{i(),n(e,r(`You pass the file descriptor to Rust, and that is pretty much it:`))},$$slots:{default:!0}});var Y=e(ke,2),Ae=t(Y);l(Ae,{children:(e,t)=>{d(e,{children:(e,t)=>{i(),n(e,r(`Create the file via Kotlin.`))},$$slots:{default:!0}})},$$slots:{default:!0}});var je=e(Ae);l(je,{children:(t,a)=>{var o=oe(),l=s(o);d(l,{children:(e,t)=>{i(),n(e,r(`Get the file descriptor with write access and make sure to detach it:`))},$$slots:{default:!0}});var u=e(l);c(u,{text:`contentResolver.openFileDescriptor(<uri>, "w")?.detachFd()`});var f=e(u);d(f,{children:(t,r)=>{i();var a=ie(),o=e(s(a));p(o,{text:`ParcelFileDescriptor`}),p(e(o,2),{text:`detachFd()`}),i(),n(t,a)},$$slots:{default:!0}});var m=e(f);c(m,{text:`ParcelFileDescriptor.adoptFd(webCaptureFileDescriptor).close() // webCaptureFileDescriptor is an Int`});var h=e(m);d(h,{children:(t,r)=>{i();var a=ae();p(e(s(a)),{text:`throw_new`}),i(),n(t,a)},$$slots:{default:!0}}),c(e(h),{text:`Bad file descriptor (os error 9)`}),n(t,o)},$$slots:{default:!0}}),l(e(je),{children:(t,a)=>{var o=ce(),l=s(o);d(l,{children:(e,t)=>{i(),n(e,r(`Make Rust write the bytes directly into the file that this file descriptor refers to.
Something like:`))},$$slots:{default:!0}});var u=e(l);c(u,{text:`let mut web_capture_file = unsafe { File::from_raw_fd(file_descriptor) };
web_capture_file.write_all(<bytes>)`}),d(e(u),{children:(e,t)=>{var r=se();p(s(r),{text:`File::from_raw_fd`}),i(),n(e,r)},$$slots:{default:!0}}),n(t,o)},$$slots:{default:!0}}),a(Y);var Me=e(Y,2);d(Me,{children:(e,t)=>{i(),n(e,r(`Since the file descriptor works at the kernel level, this just works. Rust
doesn’t need to actually have any idea of how a URI on Android resolves, or anything like that.`))},$$slots:{default:!0}});var Ne=e(Me,2);d(Ne,{children:(e,t)=>{i();var r=le();i(4),n(e,r)},$$slots:{default:!0}});var Pe=e(Ne,2);c(Pe,{text:`pub extern "system" fn Java_com_sakethh_linkora_JVMAndAndroidWebCapture_saveHTMLPage(
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
}`});var X=e(Pe,2);h(t(X),{src:`/images/web-capture-in-linkora/panic-handle.png`}),a(X);var Fe=e(X,2);u(Fe,{level:3,children:(e,t)=>{i(),n(e,r(`Benchmarks & Profiling`))},$$slots:{default:!0}});var Ie=e(Fe,2);d(Ie,{children:(e,t)=>{i(),n(e,r(`I have it set up as follows just for manual testing:`))},$$slots:{default:!0}});var Le=e(Ie,2);c(Le,{text:`viewModelScope.launch(PlatformIODispatcher) {
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
}`});var Re=e(Le,2);d(Re,{children:(e,t)=>{i();var r=ue();i(2),n(e,r)},$$slots:{default:!0}});var ze=e(Re,2);c(ze,{text:`expect val PlatformIODispatcher: CoroutineDispatcher`});var Be=e(ze,2);d(Be,{children:(e,t)=>{i(),n(e,r(`This test starts against these pages:`))},$$slots:{default:!0}});var Ve=e(Be,2);c(Ve,{text:`listOf(
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
)`});var He=e(Ve,2);u(He,{level:4,children:(e,t)=>{i(),n(e,r(`Concurrent downloads`))},$$slots:{default:!0}});var Ue=e(He,2);d(Ue,{children:(e,t)=>{i(),n(e,r(`In this example, I have set it to 4 downloads at a time:`))},$$slots:{default:!0}});var We=e(Ue,2);c(We,{text:`listOf(
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
}`});var Ge=e(We,2);d(Ge,{children:(e,t)=>{var r=de();i(3),n(e,r)},$$slots:{default:!0}});var Ke=e(Ge,2);c(Ke,{text:`...
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
...`});var qe=e(Ke,2);d(qe,{children:(e,t)=>{i(),n(e,r(`This gives us strict concurrency, allowing us to throttle downloads manually.`))},$$slots:{default:!0}});var Je=e(qe,2);d(Je,{children:(e,t)=>{i(),n(e,r(`For sites with a lot of media, memory spikes are obvious. Since media can be stripped down from the app preferences if
not needed, memory usage will vary. For testing, I allowed embedding of all available CSS, fonts, media, metadata, and
JavaScript.`))},$$slots:{default:!0}});var Ye=e(Je,2);d(Ye,{children:(e,t)=>{i(),n(e,r(`For context, here are the final sizes of these self-contained files:`))},$$slots:{default:!0}});var Xe=e(Ye,2);m(Xe,{children:(o,s)=>{var c=fe(),l=e(t(c)),u=t(l),d=t(u);f(t(d),{href:`https://zed.dev/blog/crdts`,children:(e,t)=>{i(),n(e,r(`https://zed.dev/blog/crdts`))},$$slots:{default:!0}}),a(d),i(),a(u);var p=e(u),m=t(p);f(t(m),{href:`https://github.com/Y2Z/monolith`,children:(e,t)=>{i(),n(e,r(`https://github.com/Y2Z/monolith`))},$$slots:{default:!0}}),a(m),i(),a(p);var h=e(p),g=t(h);f(t(g),{href:`https://genius.com/artists/Fleetwood-mac`,children:(e,t)=>{i(),n(e,r(`https://genius.com/artists/Fleetwood-mac`))},$$slots:{default:!0}}),a(g),i(),a(h);var _=e(h),v=t(_);f(t(v),{href:`https://keepandroidopen.org/`,children:(e,t)=>{i(),n(e,r(`https://keepandroidopen.org/`))},$$slots:{default:!0}}),a(v),i(),a(_);var y=e(_),b=t(y);f(t(b),{href:`https://kotlinlang.org/docs/multiplatform/get-started.html`,children:(e,t)=>{i(),n(e,r(`https://kotlinlang.org/docs/multiplatform/get-started.html`))},$$slots:{default:!0}}),a(b),i(),a(y);var x=e(y),S=t(x);f(t(S),{href:`https://x.com/FallonTonight/status/2055143968711823639`,children:(e,t)=>{i(),n(e,r(`https://x.com/FallonTonight/status/2055143968711823639`))},$$slots:{default:!0}}),a(S),i(),a(x);var C=e(x),w=t(C);f(t(w),{href:`https://www.opensuse.org/`,children:(e,t)=>{i(),n(e,r(`https://www.opensuse.org/`))},$$slots:{default:!0}}),a(w),i(),a(C);var T=e(C),E=t(T);f(t(E),{href:`https://en.wikipedia.org/wiki/Cowboy_Bebop`,children:(e,t)=>{i(),n(e,r(`https://en.wikipedia.org/wiki/Cowboy_Bebop`))},$$slots:{default:!0}}),a(E),i(),a(T);var D=e(T),O=t(D);f(t(O),{href:`https://f-droid.org/`,children:(e,t)=>{i(),n(e,r(`https://f-droid.org/`))},$$slots:{default:!0}}),a(O),i(),a(D);var k=e(D),A=t(k);f(t(A),{href:`https://vimeo.com/676247342`,children:(e,t)=>{i(),n(e,r(`https://vimeo.com/676247342`))},$$slots:{default:!0}}),a(A),i(),a(k),a(l),a(c),n(o,c)},$$slots:{default:!0}});var Ze=e(Xe,2);d(Ze,{children:(e,t)=>{i(),n(e,r(`CPU and memory readings from the Android Profiler on a build that is the same as release:`))},$$slots:{default:!0}});var Qe=e(Ze,4);d(Qe,{children:(e,t)=>{i();var r=pe();i(4),n(e,r)},$$slots:{default:!0}});var $e=e(Qe,2);d($e,{children:(e,t)=>{i(),n(e,r(`CPU usage remained quite normal (the app’s usage is the green graph inside the Profiler’s CPU timeline).`))},$$slots:{default:!0}});var et=e($e,2);d(et,{children:(e,t)=>{i(),n(e,r(`Logs:`))},$$slots:{default:!0}});var tt=e(et,2);c(tt,{text:`13:27:07.395 web-capture: Starting downloads
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
13:27:50.630 web-capture: Completed downloading`});var nt=e(tt,2);d(nt,{children:(e,t)=>{i(),n(e,r(`10 downloads concurrently (4 at any given time) took 43 seconds.`))},$$slots:{default:!0}});var rt=e(nt,2);u(rt,{level:3,children:(e,t)=>{i(),n(e,r(`Coroutine Cancellation`))},$$slots:{default:!0}});var it=e(rt,2);d(it,{children:(e,t)=>{i(),n(e,r(`Coroutine cancellation affects children of a parent scope which might involve the calls to Rust, but Rust code will not
be affected by these cancellations. In fact, the Kotlin coroutine never truly gets cancelled or completed until the Rust
operations are completed.`))},$$slots:{default:!0}});var at=e(it,2);d(at,{children:(e,t)=>{i(),n(e,r(`Thread is the only subject that both Rust and Kotlin understand. Rust knows nothing about Kotlin coroutines. A coroutine
in Kotlin is a state machine that happens to be cooperative, managed via structured concurrency and dispatchers across
threads. Normally, when a Kotlin coroutine gets cancelled, its execution stops, it yields its resources back to the
thread pool, and the GC clears up the memory. It doesn’t cancel any thread because it is not a thread to begin with.`))},$$slots:{default:!0}});var ot=e(at,2);d(ot,{children:(e,t)=>{i(),n(e,r(`But when Kotlin calls Rust, Rust uses the physical OS thread which the coroutine was operating on. The thread is now in
control of Rust and not Kotlin. Since Kotlin cannot safely nuke an active OS thread without crashing the app, the thread
is not released back to the pool. Rust is still fetching and will eventually write to the files for the calls that have
been made.`))},$$slots:{default:!0}});var st=e(ot,2);d(st,{children:(e,t)=>{i(),n(e,r(`Of course, the calls which don’t reach Rust will never be downloaded. But the ones that got in before cancellation will
have no effect from this cancellation and continue to do whatever they are doing.`))},$$slots:{default:!0}});var ct=e(st,2);d(ct,{children:(e,t)=>{i();var r=me();i(4),n(e,r)},$$slots:{default:!0}});var lt=e(ct,2);c(lt,{text:`val testScope = CoroutineScope(PlatformIODispatcher)
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
                nativeFolderPath = preferencesRepository.getPreferences().webCapturesLocation,
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
}`});var ut=e(lt,2);d(ut,{children:(e,t)=>{i(),n(e,r(`On Rust I have (when targeted at desktop, the app will use the direct path and fd will be -1 when passed from desktop.
I’m using the desktop target here to print whatever Rust is printing, since those don’t get printed into the logcat):`))},$$slots:{default:!0}});var dt=e(ut,2);c(dt,{text:`...
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
...`});var ft=e(dt,2);d(ft,{children:(e,t)=>{i(),n(e,r(`Logs for the above operation:`))},$$slots:{default:!0}});var pt=e(ft,2);c(pt,{text:`Linkora Log : web-capture: Starting downloads
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
`});var mt=e(pt,2);d(mt,{children:(e,t)=>{i();var r=he();i(2),n(e,r)},$$slots:{default:!0}});var Z=e(mt,2);d(Z,{children:(e,t)=>{i();var r=ge();i(10),n(e,r)},$$slots:{default:!0}});var ht=e(Z,2);d(ht,{children:(e,t)=>{i();var r=_e();i(4),n(e,r)},$$slots:{default:!0}});var gt=e(ht,2);d(gt,{children:(e,t)=>{i();var r=ve();i(6),n(e,r)},$$slots:{default:!0}});var _t=e(gt,4);d(_t,{children:(e,t)=>{i();var r=ye();i(2),n(e,r)},$$slots:{default:!0}});var Q=e(_t,2),vt=t(Q);l(vt,{children:(e,t)=>{d(e,{children:(e,t)=>{f(e,{href:`https://www.reddit.com/r/rust/comments/38ka6i/how_to_close_a_file/`,children:(e,t)=>{i(),n(e,r(`https://www.reddit.com/r/rust/comments/38ka6i/how_to_close_a_file/`))},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var yt=e(vt);l(yt,{children:(e,t)=>{d(e,{children:(e,t)=>{f(e,{href:`https://www.reddit.com/r/rust/comments/1duc594/reading_granted_content_file_uris_on_android/`,children:(e,t)=>{i(),n(e,r(`https://www.reddit.com/r/rust/comments/1duc594/reading_granted_content_file_uris_on_android/`))},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var bt=e(yt);l(bt,{children:(e,t)=>{d(e,{children:(e,t)=>{f(e,{href:`https://source.android.com/docs/core/runtime#Improved_GC`,children:(e,t)=>{i(),n(e,r(`https://source.android.com/docs/core/runtime#Improved_GC`))},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var xt=e(bt);l(xt,{children:(e,t)=>{d(e,{children:(e,t)=>{f(e,{href:`https://stackoverflow.com/a/79665618`,children:(e,t)=>{i(),n(e,r(`https://stackoverflow.com/a/79665618`))},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var St=e(xt);l(St,{children:(e,t)=>{d(e,{children:(e,t)=>{f(e,{href:`https://stackoverflow.com/questions/75177508/interrupt-jni-method-execution-in-a-coroutine`,children:(e,t)=>{i(),n(e,r(`https://stackoverflow.com/questions/75177508/interrupt-jni-method-execution-in-a-coroutine`))},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var Ct=e(St);l(Ct,{children:(e,t)=>{d(e,{children:(e,t)=>{f(e,{href:`https://www.reddit.com/r/rust/comments/1cpjyib/to_catch_unwind_or_not_to_catch_unwind/`,children:(e,t)=>{i(),n(e,r(`https://www.reddit.com/r/rust/comments/1cpjyib/to_catch_unwind_or_not_to_catch_unwind/`))},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var $=e(Ct);l($,{children:(e,t)=>{d(e,{children:(e,t)=>{f(e,{href:`https://source.android.com/docs/setup/build/rust/building-rust-modules/android-rust-patterns#android-logging`,children:(e,t)=>{i(),n(e,r(`https://source.android.com/docs/setup/build/rust/building-rust-modules/android-rust-patterns#android-logging`))},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}}),l(e($),{children:(e,t)=>{d(e,{children:(e,t)=>{f(e,{href:`https://docs.rs/android_logger/0.10.1/android_logger/`,children:(e,t)=>{i(),n(e,r(`https://docs.rs/android_logger/0.10.1/android_logger/`))},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}}),a(Q),d(e(Q,2),{children:(e,t)=>{i();var r=be();i(3),n(e,r)},$$slots:{default:!0}}),n(o,g)}export{j as default,g as metadata};