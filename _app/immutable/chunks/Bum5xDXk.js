import{B as e,R as t,S as n,T as r,et as i,tt as a,w as o,z as s}from"./CXOUEYH_.js";import"./CFKVnMbq.js";import"./DCKuasBZ.js";import{t as c}from"./B2HDiynK.js";import"./N-6q-Igo.js";import{a as l,c as u,i as d,r as f,s as p}from"./CkcsRIrl.js";var m={title:`On-Device Webpage Capture in Linkora`,description:`Rust, JNI, and not leaking memory along the way.`,pubDatetime:`Jun 25, 2026 9:30 PM IST`,staticRes:`web-capture-in-linkora`},{title:h,description:g,pubDatetime:_,staticRes:v}=m,ee=o(`<a href="https://crates.io/crates/monolith" rel="nofollow"><code>monolith</code></a> is an amazing library built in Rust to save any webpage as a single, portable HTML page. The next version of
Linkora, v0.18.0, will have this feature called <code>web-capture</code> which completely depends on this library. The next few
sections cover how this is implemented, plus the technical stuff that makes it work.`,1),te=o(`<strong>TL;DR</strong> : Web capture in Linkora v0.18.0 boils down to one thing, pass a file descriptor to Rust and let it write
directly into the file. The rest of this is the why: how heap memory differs between Rust and ART, how JNI moves data
and exceptions across that boundary, why the other three approaches before this one risk leaking or just aren’t worth
it, and the
benchmarks on sequential vs concurrent downloads.`,1),ne=o(`ART has the capability to move around objects in memory to avoid empty spaces (which Dalvik didn’t have). This gets
handled by some internal logic that keeps track of actual data and any pointers required at any given moment. Because
of this, empty memory isn’t sitting unallocated for the process anymore. This is done by ART’s Garbage Collector. If
you have raw pointers that don’t point to whatever they’re supposed to when you access them, it leads to runtime
problems. You can do pinning via <!>,
but <!>, and it might
not always be flexible enough.`,1),re=o(`Thankfully, JNI does the heavy lifting here and we have to think about very few things that we’re supposed to handle.
With Linkora, we’re supposed to handle the HTML content returned by the <code>monolith</code> library and write it to the folder
it’s supposed to save into, based on the user’s preferences.`,1),ie=o(`Kotlin has the <code>external</code> keyword, which can be used to access functions that aren’t implemented in Kotlin:`,1),ae=o(`Similarly, Rust also has support which provides a way for Kotlin to use the target function that’s implemented in Rust
via the <code>#[no_mangle]</code> annotation:`,1),oe=o(`The function name is weirder than usual, and that’s because that’s the naming convention JNI expects. <code>JVMAndAndroidWebCapture</code> is the object in which <code>saveHTMLPage</code> exists, whereas the prefix is the path to that object in
your project hierarchy.`,1),se=o(`The above function is a wrapper which calls the function from the monolith lib. If you’ve observed the parameters, we
have datatypes that aren’t native to Rust. <code>jlong</code> , <code>JString</code> , and <code>jboolean</code> are meant for JNI binding and are used to
fetch values sent from Kotlin. You can have a helper function which gets strings that your normal Rust code can use,
like this:`,1),ce=o(`You can also throw exceptions directly from Rust if things don’t go as you expect them to, so that Kotlin code can do
whatever it’s supposed to. Although it doesn’t throw instantly, when you do <code>env.throw_new()</code> , it doesn’t act like a <code>return</code> statement or <code>throw</code> . Rust keeps executing the rest of the block until it hits the bottom of the function. ART
holds onto that pending exception and throws it the moment Rust completes its operations and hands control back
over to Kotlin.`,1),le=o(`After any of these, we should end up with an HTML file that’s portable and fully self-contained. I’ve used the last
approach, which is simple, practical, and you don’t have to worry about either leaking memory or dangling pointers.
Before the fourth approach though, I went through the first three <em>on paper</em> , and these points sum them up:`,1),ue=o(`The problem with the first approach is that you’re doubling the memory used for the same data. The reason is simple,
as I mentioned before: Rust and ART handle heap memory differently. To access the data from Rust, you must make a
copy that ART can understand, since ART can’t interpret whatever Rust is saying, and vice versa. This is a fairly
good approach if you don’t have large data to transfer and have proper constraints on how big the data usually gets
when it’s copied. I did this in
an <!>.`,1),de=o(`With the second approach, you have to make sure Rust doesn’t drop the memory related to the pointer once it’s out of
scope. You can do this with <!>, which stops Rust from dropping that memory, making it essentially a
memory leak on purpose. That means it’s now on the calling side, in Kotlin, to manage it properly and close and free
the resources once all operations are done. Or, you could go with a background operation which doesn’t drop the
memory until the job is done on Kotlin’s side, but that is just too much for a simple operation like this.`,1),fe=o(`Get the file descriptor and make sure to detach it. In pure Kotlin, you would manually close this, but <!> gives Rust exclusive ownership to automatically close the descriptor when it goes out of scope.
While you could tell Rust not to drop the memory when it goes out of scope and manually close it from the Kotlin side
once operations complete, letting Rust handle the cleanup natively is much simpler, so I went with that.`,1),pe=o(`where <code>PlatformIODispatcher</code> is:`,1),me=o(`Based on the logs, all operations sequentially took 132 seconds. This involves creating the file, calling
Rust to process everything via <code>monolith</code> , and writing it to the local file.`,1),he=o(`<code>flattenMerge</code> uses <code>ChannelFlowMerge</code> which implements:`,1),ge=o(`The sequential approach hit a peak of 470 MB, while this hit a peak of 404 MB. Although coroutines on <code>Dispatchers.IO</code> can
execute in true parallel across a thread pool (up to 64 threads at any given time), semaphore caps us at 4 active
tasks. Because each page takes a different amount of time to process, and coroutines still suspend and yield control
during execution, the 4 tasks running at any given moment constantly shift. This means peak memory allocations do not
perfectly overlap or compound. The 66 MB difference simply executed at different times within our timeline, happening
either before or after we hit the peak.`,1),_e=o(`This feature is currently on the <code>dev</code> branch since it is not yet completed for a release. If you want to see how this
works across Android and Desktop via Kotlin Multiplatform, check
out: <a href="https://github.com/LinkoraApp/Linkora/tree/dev" rel="nofollow">https://github.com/LinkoraApp/Linkora/tree/dev</a>`,1),ve=o(`<!> <!> <!> <!> <ul><!><!></ul> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <ol><!><!><!><!></ol> <!> <ol><!><!><!></ol> <!> <!> <ol><!><!><!></ol> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <video controls="" width="100%"><source src="https://59a32181-7426-4354.netlify.app/web-capture/Sequential.mp4" type="video/mp4"/></video> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <video controls="" width="100%"><source src="https://59a32181-7426-4354.netlify.app/web-capture/Concurrent.mp4" type="video/mp4"/></video> <!> <!> <!> <!> <!> <hr/> <!> <ol><!><!><!><!></ol> <!>`,3);function y(o){var m=ve(),h=s(m);f(h,{children:(e,t)=>{var r=ee();i(3),n(e,r)},$$slots:{default:!0}});var g=e(h,2);f(g,{children:(e,t)=>{var r=te();i(),n(e,r)},$$slots:{default:!0}});var _=e(g,2);p(_,{level:3,children:(e,t)=>{i(),n(e,r(`Heap`))},$$slots:{default:!0}});var v=e(_,2);f(v,{children:(e,t)=>{i(),n(e,r(`Before starting the actual implementation, we need to know how heap memory is managed by Android Runtime (ART) and Rust.
Since heap memory gets allocated dynamically during runtime, some things might not work the way we expect when
integrating things like this.`))},$$slots:{default:!0}});var y=e(v,2),b=t(y);d(b,{children:(t,a)=>{i();var o=ne(),c=e(s(o));l(c,{text:`GetPrimitiveArrayCritical`}),u(e(c,2),{href:`https://stackoverflow.com/a/46608121`,children:(e,t)=>{i(),n(e,r(`it has its own set of problems that you have to take care of`))},$$slots:{default:!0}}),i(),n(t,o)},$$slots:{default:!0}}),d(e(b),{children:(e,t)=>{i(),n(e,r(`Rust has no such thing as a Garbage Collector. By default, it drops the memory the moment you’re out of scope.`))},$$slots:{default:!0}}),a(y);var x=e(y,2);f(x,{children:(e,t)=>{i(),n(e,r(`Now with this integration, we’re supposed to respect these constraints and only access or share data that isn’t going to
crash at runtime, since there’s no way to verify the integration of these two at compile time.`))},$$slots:{default:!0}});var S=e(x,2);p(S,{level:3,children:(e,t)=>{i(),n(e,r(`JNI`))},$$slots:{default:!0}});var C=e(S,2);f(C,{children:(e,t)=>{i();var r=re();i(2),n(e,r)},$$slots:{default:!0}});var w=e(C,2);f(w,{children:(e,t)=>{i(),n(e,r(`So we need to be able to pass stuff to Rust from Kotlin and get back stuff from Rust to Kotlin.`))},$$slots:{default:!0}});var T=e(w,2);f(T,{children:(e,t)=>{i();var r=ie();i(2),n(e,r)},$$slots:{default:!0}});var E=e(T,2);c(E,{text:`external fun saveHTMLPage(
    ...
    fileDescriptor: Int,
    filePath: String,
    timeout: Long,
    allowInsecureProtocol: Boolean
    ...): Boolean`});var D=e(E,2);f(D,{children:(e,t)=>{i();var r=ae();i(2),n(e,r)},$$slots:{default:!0}});var O=e(D,2);c(O,{text:`#[unsafe(no_mangle)]
pub extern "system" fn Java_com_sakethh_linkora_JVMAndAndroidWebCapture_saveHTMLPage(
    ...
    file_descriptor: jint,
    file_path: JString,
    timeout: jlong,
    allow_insecure_protocol: jboolean,
    ...
) -> jboolean`});var k=e(O,2);f(k,{children:(e,t)=>{i();var r=oe();i(4),n(e,r)},$$slots:{default:!0}});var A=e(k,2);f(A,{children:(e,t)=>{i();var r=se();i(6),n(e,r)},$$slots:{default:!0}});var j=e(A,2);c(j,{text:`fn get_string_from_jni(env: &mut JNIEnv, string: JString) -> Option<String> {
    match env.get_string(&string) {
        Ok(str) => Some(str.into()),
        Err(err) => {
            let _ = env.throw_new("java/lang/RuntimeException", err.to_string());
            None
        }
    }
}`});var M=e(j,2);f(M,{children:(e,t)=>{i();var r=ce();i(6),n(e,r)},$$slots:{default:!0}});var N=e(M,2);p(N,{level:3,children:(e,t)=>{i(),n(e,r(`Writing to file`))},$$slots:{default:!0}});var P=e(N,2);f(P,{children:(e,t)=>{i(),n(e,r(`Now that we have essentially everything we need, writing the HTML content to a file on disk is what remains. Things are
fun here, since doing it differently could just lead to dangling pointers. I’ve thought about this in a couple of ways:`))},$$slots:{default:!0}});var F=e(P,2),I=t(F);d(I,{children:(e,t)=>{i(),n(e,r(`Return the HTML byte array to Kotlin. Easy, you don’t have to worry about any sort of dangling pointers and it just
works.`))},$$slots:{default:!0}});var L=e(I);d(L,{children:(e,t)=>{i(),n(e,r(`Take a pointer of this HTML byte array from Rust and use it in Kotlin.`))},$$slots:{default:!0}});var R=e(L);d(R,{children:(e,t)=>{i(),n(e,r(`Create a byte array in Kotlin and let Rust add the bytes to it, then use the byte array on Kotlin’s side once Rust is
done adding them.`))},$$slots:{default:!0}}),d(e(R),{children:(e,t)=>{i(),n(e,r(`Since you can’t directly create a file natively on Android via Rust, as the web capture file exists outside the
internal app directory (a user-picked location), create it in Kotlin and make Rust write into it.`))},$$slots:{default:!0}}),a(F);var z=e(F,2);f(z,{children:(e,t)=>{i();var r=le();i(2),n(e,r)},$$slots:{default:!0}});var B=e(z,2),V=t(B);d(V,{children:(t,a)=>{i();var o=ue();u(e(s(o)),{href:`https://github.com/LinkoraApp/Linkora/blob/aa41ac56bf02688d12e2f8e620fe58024b38cbab/hoarder/src/main/rust/hoarder.rs#L17`,children:(e,t)=>{i(),n(e,r(`earlier implementation`))},$$slots:{default:!0}}),i(),n(t,o)},$$slots:{default:!0}});var H=e(V);d(H,{children:(t,r)=>{i();var a=de();l(e(s(a)),{text:`Box::into_raw`}),i(),n(t,a)},$$slots:{default:!0}}),d(e(H),{children:(e,t)=>{i(),n(e,r(`The third approach is more practical than either of these, with two caveats. You can never know the size of this byte
array ahead of time, since the size of the byte array is known to Rust and not Kotlin. You’d need two calls into
Rust, one which returns the size of the array, and then the rest of the implementation continues. The other issue is
quite obvious if you went through the stack overflow post I’ve referred to earlier in the heap section. This is more
practical than the ones above, but the fourth is the simplest way to do this that doesn’t suck.`))},$$slots:{default:!0}}),a(B);var U=e(B,2);p(U,{level:3,children:(e,t)=>{i(),n(e,r(`File descriptors`))},$$slots:{default:!0}});var W=e(U,2);f(W,{children:(e,t)=>{i(),n(e,r(`You pass the file descriptor to Rust, and that is pretty much it:`))},$$slots:{default:!0}});var G=e(W,2),ye=t(G);d(ye,{children:(e,t)=>{i(),n(e,r(`Create the file via Kotlin.`))},$$slots:{default:!0}});var K=e(ye);d(K,{children:(t,r)=>{i();var a=fe();l(e(s(a)),{text:`File::from_raw_fd`}),i(),n(t,a)},$$slots:{default:!0}}),d(e(K),{children:(e,t)=>{i(),n(e,r(`Make Rust write the bytes directly into the file that this file descriptor refers to. Since the file descriptor is
already accessed for use by the user themselves, and since it works at the kernel level, this just works. Rust
doesn’t need to actually have any idea of how a URI on Android resolves, or anything like that.`))},$$slots:{default:!0}}),a(G);var q=e(G,2);f(q,{children:(e,t)=>{i(),n(e,r(`Something like:`))},$$slots:{default:!0}});var J=e(q,2);c(J,{text:`let mut web_capture_file = unsafe { File::from_raw_fd(file_descriptor) };
web_capture_file.write_all(<bytes>)`});var Y=e(J,2);p(Y,{level:3,children:(e,t)=>{i(),n(e,r(`Storage`))},$$slots:{default:!0}});var X=e(Y,2);f(X,{children:(e,t)=>{i(),n(e,r(`Linkora stores these saved pages in individual folders (to support multiple copies of the same link where content
might be different due to any changes on the actual web page). Each folder represents one link,
and the name of the folder is a UUID. That UUID maps back to the actual URL inside an independent database, which is
stored right alongside the folders wherever the user chose to save their web captures.`))},$$slots:{default:!0}});var be=e(X,2);f(be,{children:(e,t)=>{i(),n(e,r(`JSON is simple to set up, but you absolutely do not want to read
and rewrite an entire JSON file into memory just to look up a folder reference or delete a single entry. You can never
guess how much a user will scale their library, so it’s much better to set things up properly from the start using a
real database.`))},$$slots:{default:!0}});var xe=e(be,2);p(xe,{level:3,children:(e,t)=>{i(),n(e,r(`Benchmarks & Profiling`))},$$slots:{default:!0}});var Se=e(xe,2);f(Se,{children:(e,t)=>{i(),n(e,r(`I have it set up as follows just for manual testing:`))},$$slots:{default:!0}});var Ce=e(Se,2);c(Ce,{text:`viewModelScope.launch(PlatformIODispatcher) {
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
}`});var we=e(Ce,2);f(we,{children:(e,t)=>{i();var r=pe();i(2),n(e,r)},$$slots:{default:!0}});var Te=e(we,2);c(Te,{text:`expect val PlatformIODispatcher: CoroutineDispatcher`});var Ee=e(Te,2);f(Ee,{children:(e,t)=>{i(),n(e,r(`If you have read this far, I am fairly sure you know why downloading things sequentially when it is not needed is a bad
idea. I have tested sequentially and concurrently and profiled on both environments.`))},$$slots:{default:!0}});var De=e(Ee,2);f(De,{children:(e,t)=>{i(),n(e,r(`Both of these tests start against these pages:`))},$$slots:{default:!0}});var Oe=e(De,2);c(Oe,{text:`listOf(
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
)`});var ke=e(Oe,2);p(ke,{level:4,children:(e,t)=>{i(),n(e,r(`1. Sequential`))},$$slots:{default:!0}});var Ae=e(ke,2);f(Ae,{children:(e,t)=>{i(),n(e,r(`CPU and memory readings from the Android Profiler on a build that is the same as release:`))},$$slots:{default:!0}});var je=e(Ae,4);f(je,{children:(e,t)=>{i(),n(e,r(`Max memory hit is 470.8 MB, and it varies from 50-200 MB most of the time, occasionally spiking
into the 300-400 MB range.`))},$$slots:{default:!0}});var Me=e(je,2);f(Me,{children:(e,t)=>{i(),n(e,r(`Logs:`))},$$slots:{default:!0}});var Ne=e(Me,2);c(Ne,{text:`13:14:54.903 web-capture: Starting downloads
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
13:17:06.961 web-capture: Completed downloading`});var Pe=e(Ne,2);f(Pe,{children:(e,t)=>{i();var r=me();i(2),n(e,r)},$$slots:{default:!0}});var Fe=e(Pe,2);p(Fe,{level:4,children:(e,t)=>{i(),n(e,r(`2. Concurrent`))},$$slots:{default:!0}});var Ie=e(Fe,2);f(Ie,{children:(e,t)=>{i(),n(e,r(`In this example, I have set it to 4 downloads at a time:`))},$$slots:{default:!0}});var Le=e(Ie,2);c(Le,{text:`listOf(
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
}`});var Re=e(Le,2);f(Re,{children:(e,t)=>{var r=he();i(3),n(e,r)},$$slots:{default:!0}});var ze=e(Re,2);c(ze,{text:`...
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
...`});var Be=e(ze,2);f(Be,{children:(e,t)=>{i(),n(e,r(`This gives us strict concurrency, allowing us to throttle downloads manually.`))},$$slots:{default:!0}});var Ve=e(Be,2);f(Ve,{children:(e,t)=>{i(),n(e,r(`For sites with a lot of media, memory spikes are obvious. Since media can be stripped down from the app preferences if
not needed, memory usage will vary. For testing, I allowed embedding of all available CSS, fonts, media, metadata, and
JavaScript.`))},$$slots:{default:!0}});var He=e(Ve,2);f(He,{children:(e,t)=>{i(),n(e,r(`CPU and memory readings from the Android Profiler on a build that is the same as release:`))},$$slots:{default:!0}});var Ue=e(He,4);f(Ue,{children:(e,t)=>{i();var r=ge();i(2),n(e,r)},$$slots:{default:!0}});var Z=e(Ue,2);f(Z,{children:(e,t)=>{i(),n(e,r(`CPU usage remained quite normal (the app’s usage is the green graph inside the Profiler’s CPU timeline).`))},$$slots:{default:!0}});var We=e(Z,2);f(We,{children:(e,t)=>{i(),n(e,r(`Logs:`))},$$slots:{default:!0}});var Ge=e(We,2);c(Ge,{text:`13:27:07.395 web-capture: Starting downloads
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
13:27:50.630 web-capture: Completed downloading`});var Ke=e(Ge,2);f(Ke,{children:(e,t)=>{i(),n(e,r(`10 downloads concurrently (4 at any given time) took 43 seconds.`))},$$slots:{default:!0}});var qe=e(Ke,4);f(qe,{children:(e,t)=>{i(),n(e,r(`Here are some pages/references I went through via search results while working on this:`))},$$slots:{default:!0}});var Q=e(qe,2),Je=t(Q);d(Je,{children:(e,t)=>{u(e,{href:`https://www.reddit.com/r/rust/comments/38ka6i/how_to_close_a_file/`,children:(e,t)=>{i(),n(e,r(`https://www.reddit.com/r/rust/comments/38ka6i/how_to_close_a_file/`))},$$slots:{default:!0}})},$$slots:{default:!0}});var Ye=e(Je);d(Ye,{children:(e,t)=>{u(e,{href:`https://www.reddit.com/r/rust/comments/1duc594/reading_granted_content_file_uris_on_android/`,children:(e,t)=>{i(),n(e,r(`https://www.reddit.com/r/rust/comments/1duc594/reading_granted_content_file_uris_on_android/`))},$$slots:{default:!0}})},$$slots:{default:!0}});var $=e(Ye);d($,{children:(e,t)=>{u(e,{href:`https://source.android.com/docs/core/runtime#Improved_GC`,children:(e,t)=>{i(),n(e,r(`https://source.android.com/docs/core/runtime#Improved_GC`))},$$slots:{default:!0}})},$$slots:{default:!0}}),d(e($),{children:(e,t)=>{u(e,{href:`https://stackoverflow.com/a/79665618`,children:(e,t)=>{i(),n(e,r(`https://stackoverflow.com/a/79665618`))},$$slots:{default:!0}})},$$slots:{default:!0}}),a(Q),f(e(Q,2),{children:(e,t)=>{i();var r=_e();i(3),n(e,r)},$$slots:{default:!0}}),n(o,m)}export{y as default,m as metadata};