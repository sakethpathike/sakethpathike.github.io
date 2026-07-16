import{C as e,D as t,H as n,T as r,U as i,V as a,it as o,rt as s}from"./BWc9umX3.js";import"./CFKVnMbq.js";import"./6OkQQOUT.js";import{t as c}from"./826G_Alq.js";import{t as l}from"./daMUoOmK.js";import{a as u,c as d,i as f,l as p,o as m,r as h,s as g}from"./PhjolevW.js";var _={title:`Building Webpage Capture in Linkora`,description:`Rust, JNI, file descriptors, and forking monolith to support coroutines that don't know they've been cancelled.`,pubDatetime:`Jun 27, 2026 9:30 PM IST`,staticRes:`web-capture-in-linkora`},{title:v,description:y,pubDatetime:b,staticRes:x}=_,S=r(`<a href="https://crates.io/crates/monolith" rel="nofollow"><code>monolith</code></a> is an amazing library built in Rust to save any webpage as a single,
portable HTML page. The next version of Linkora, v0.18.0, will have this feature called <code>web-capture</code> which depends on
this library. The next few sections cover how this is currently being implemented, plus the technical
constraints shaping it (i.e. this is a log and not a tutorial nor any sort of guide).`,1),C=r(`<strong>TL;DR</strong> : Web capture in Linkora v0.18.0 currently boils down to passing a file descriptor to Rust so it can write
directly to disk. The rest of this log covers the why: how heap memory differs between Rust and ART, how JNI handles
data types and exceptions, what happens to coroutine cancellations when Rust takes over the thread, why the other three
approaches risk leaking or aren’t worth the hassle, why cancellation needed a <code>monolith</code> fork ( <code>capture-core</code> ) to
actually
reach Rust, how callbacks replace JNI exceptions for error reporting, how results get routed back to Kotlin from
whatever thread <code>tokio</code> hands the work to, and the current benchmarks on concurrent
downloads.`,1),w=r(`If you have raw pointers that don’t point to whatever they’re supposed to when you access them, it leads to
runtime
problems. You can do pinning via <!>,
but <!>, and it
might
not always be flexible enough.`,1),T=r(`<!><ul><!></ul>`,1),E=r(`Thankfully, JNI does the heavy lifting here and we have to think about very few things that we’re supposed to handle.
With Linkora, we’re supposed to handle the HTML content returned by the <code>monolith</code> library and write it to the folder
it’s supposed to save into, based on the user’s preferences.`,1),D=r(`Kotlin has the <code>external</code> keyword, which can be used to access functions that aren’t implemented in Kotlin:`,1),O=r(`Similarly, Rust also has support which provides a way for Kotlin to use the target function that’s implemented in Rust
via the <code>#[no_mangle]</code> annotation:`,1),k=r(`The function name is weirder than usual, and that’s because that’s the naming convention JNI expects. <code>JVMAndAndroidWebCapture</code> is the object in which <code>saveHTMLPage</code> exists, whereas the prefix is the path to that object in
your project hierarchy.`,1),A=r(`The above function is a wrapper which calls the function from the <code>monolith</code> lib. If you’ve observed the parameters, we
have datatypes that aren’t native to Rust. <code>jint</code> , <code>JString</code> , and <code>jboolean</code> are meant for JNI binding and are used to
fetch values sent from Kotlin. You can have a helper function which gets strings that your normal Rust code can use,
like this:`,1),ee=r(`You can also throw exceptions directly from Rust if things don’t go as you expect them to, so that Kotlin code can do
whatever it’s supposed to. Although it doesn’t throw instantly, when you do <code>env.throw_new()</code> , it doesn’t act like a <code>return</code> statement or <code>throw</code> . Rust keeps executing the rest of the block until it hits the bottom of the function. ART
holds onto that pending exception and throws it the moment Rust completes its operations and hands control back
over to Kotlin.`,1),te=r(`Since Rust’s <!> has no idea how to resolve Android’s Storage Access Framework (SAF) <!> URIs, you
can’t
just pass a file path to Rust. Instead, create the file in Kotlin and make Rust write directly into it via a file
descriptor.`,1),ne=r(`After any of these, we should end up with an HTML file that’s portable and fully self-contained. I’ve used the last
approach, which is simple, practical, and you don’t have to worry about either leaking memory or dangling pointers.
Before the fourth approach though, I went through the first three <em>on paper</em> , and these points sum them up:`,1),re=r(`The problem with the first approach is that you’re doubling the memory used for the same data. The reason is simple,
as I mentioned before: Rust and ART handle heap memory differently. To access the data from Rust, you must make a
copy that ART can understand, since ART can’t interpret whatever Rust is saying, and vice versa. This is a fairly
good approach if you don’t have large data to transfer and have proper constraints on how big the data usually gets
when it’s copied. I did this in
an <!>.`,1),ie=r(`With the second approach, you have to make sure Rust doesn’t drop the memory related to the pointer once it’s out of
scope. You can do this with <!>, which stops Rust from dropping that memory, making it essentially a
memory leak on purpose. That means it’s now on the calling side, in Kotlin, to manage it properly and close and free
the resources once all operations are done. Or, you could go with a background operation which doesn’t drop the
memory until the job is done on Kotlin’s side, but that is just too much for a simple operation like this.`,1),ae=r(`Closing the <!> after detaching the fd has no effect since <!> already detaches the fd
from the object itself, rust still continues to write as usual, if you want to force-close it, you must adopt the fd
and then close it:`,1),oe=r(`With this, Rust instantly loses access to the file. The write fails and surfaces back in Kotlin as a JNI exception (
if you have implemented it via <!>):`,1),se=r(`<!><!><!><!><!><!>`,1),ce=r(`<!> gives Rust exclusive ownership to automatically close the descriptor when it goes out of
scope. While you could tell Rust not to drop the memory when it goes out of scope and
manually close it from the Kotlin side once operations complete, letting Rust handle the cleanup natively is much
simpler, so I went with that.`,1),le=r(`<!><!><!>`,1),ue=r(`Now, things might go wrong here; Rust can panic and force crash the app, especially since we are out of boundary when
operating from Kotlin and we have no control over it. Thankfully, Rust has <code>catch_unwind</code> which helps in catching the
panics that can unwind, for which you must not have <code>panic = "abort"</code> in the release profile. This is what Linkora
does on the Rust side where it has the control, and if anything goes wrong, the process won’t be killed.`,1),de=r(`where <code>PlatformIODispatcher</code> is:`,1),fe=r(`<code>flattenMerge</code> uses <code>ChannelFlowMerge</code> which implements:`,1),pe=r(`<table><thead><tr><th>Link</th><th>Size</th></tr></thead><tbody><tr><td><!></td><td>119.01 MB</td></tr><tr><td><!></td><td>16.15 MB</td></tr><tr><td><!></td><td>13.53 MB</td></tr><tr><td><!></td><td>4.30 MB</td></tr><tr><td><!></td><td>3.77 MB</td></tr><tr><td><!></td><td>2.62 MB</td></tr><tr><td><!></td><td>2.20 MB</td></tr><tr><td><!></td><td>1.26 MB</td></tr><tr><td><!></td><td>536.37 KB</td></tr><tr><td><!></td><td>98.10 KB</td></tr></tbody></table>`),me=r(`This hit a peak of 404 MB, by the time <code>write_all</code> gets called on the Rust side, the entire HTML doc, base64-embedded
media and all, already has to exist in Rust’s heap before a single byte hits disk. The issue here is of course memory,
hitting 404 MB (although it’s peak and not average) isn’t good and might nuke this process with an Out of Memory
exception, especially on low-end devices, while streaming the bytes might be a better solution than allocating
everything once, but it doesn’t exist yet within <code>monolith</code> .`,1),he=r(`The thread is the only subject that both Rust and Kotlin understand. Rust knows nothing
about Kotlin coroutines. A coroutine in Kotlin is a heap-allocated state object managed by
Dispatchers and Structured Concurrency. It relies on sequential invocations of <code>resumeWith</code> to drive its compiled <code>invokeSuspend</code> state machine ( <code>suspend</code> functions), yielding control
back to the executing thread whenever it hits a suspension point so other tasks can be
resumed or started.`,1),ge=r(`Normally, when a Kotlin coroutine gets cancelled, its cancellation status is
flagged. A <code>CancellationException</code> is then thrown the next time the coroutine enters or is
resumed at a suspension point that checks for cancellation status. This means cancellation
is cooperative and not instantaneous, as the exception is only triggered when the coroutine
enters or is resumed at a suspension point that actively validates the cancellation state.
It doesn’t cancel or interrupt any thread during this process because it is not a thread to
begin with.`,1),_e=r(`This cooperative model only applies where suspension points exist. A blocking JNI call into
native code falls into the same category, such as a Rust function invoked synchronously with
no <code>delay</code> , <code>yield</code> , or other suspend call anywhere inside it:`,1),ve=r(`Wrapping the call in a coroutine doesn’t make it interruptible on its own. There’s nothing
inside the native call for the runtime to intercept, so the coroutine only notices the
cancellation once the call returns and execution reaches a suspension point that actually
checks for it. Making a call like this cancellable means wrapping it with <code>suspendCancellableCoroutine</code> instead, which gives a hook to signal the native side to abort,
if the native API supports that.`,1),ye=r(`For cleanup tied directly to cancellation, <code>CancellableContinuation</code> provides <code>invokeOnCancellation</code> , a handler
registered on the continuation itself. It acts as an anchor inside <code>suspendCancellableCoroutine</code> to run cleanup the
moment the cancellation signal hits while the coroutine is still paused. This allows us to trigger our cleanup code to
abort the Rust function, because if we waited for the coroutine to resume, the Rust function would have
already finished and there would be nothing left to nuke.`,1),be=r(`If you’re using <code>invokeOnCompletion</code> , the same applies: it only fires once Rust completes
the operation and hands the thread back.`,1),xe=r(`Now as you can see, <code>Linkora Log : web-capture(kotlin): Aborted by cancellation.</code> gets called only when all the Rust
calls are completed and the handling of whatever threads it was utilizing to run coroutines is handed back over to
Kotlin.`,1),Se=r(`Besides that, you can see that <code>emit</code> is being used within a scope that is a child of <code>testScope</code> . Since we are
cancelling the entire scope after 5 seconds, out of 10 links, only those links will be sent to the Rust side whichever
gets in those 5 seconds. For those links, their <code>onSuccess</code> , <code>onFailure</code> or whatever you have implemented respectively
will be called, and then the coroutine cancellation will be effective. In this case, since our root scope is cancelled, <code>emit</code> will throw the cancellation exception once Rust completes its work, and that is why the stacktrace is
printed 4 times for 4 Rust calls respectively.`,1),Ce=r(`Kotlin does have <code>runInterruptible</code> for blocking calls that won’t respond to cancellation, which interrupts the
underlying thread. But that wouldn’t help here. Rust’s <code>std::fs::write</code> doesn’t poll Java’s interrupt flag. The
interrupt would get set, but nothing gets cancelled in Rust.`,1),we=r(`This doesn’t mean you can’t cancel what is happening in Rust just because it has no idea what a Kotlin coroutine is. You
can make another JNI call to manually stop the operation, or pass down a shared <code>AtomicBoolean</code> (as a <code>JObject</code> to
Rust). The Rust code must then periodically check this boolean flag to see if a cancellation happened. This is exactly
what you would do manually by checking <code>isActive</code> in pure Kotlin.`,1),Te=r(`You can make another JNI call to manually stop the operation, if it supports it. The problem is, well… it doesn’t. <code>monolith</code> itself doesn’t support external cancellation. So I ended up forking it and adding that support myself. It now
lives as <code>capture-core</code> in the <code>LinkoraApp</code> org on GitHub.`,1),Ee=r(`Now, the function <code>create_monolithic_document</code> accepts a <code>CancelToken</code> , which takes an <code>AtomicBoolean</code> . Blocking
operations
inside <code>monolith</code> itself, recursive walks, loops, and so on, get checked periodically since I control that code.
External
library calls like <code>reqwest</code> , <code>regex</code> , and <code>html5ever</code> only get checked before the call starts, since I don’t control
what
happens inside them. Once the flag trips, it forces a panic ( <code>EXTERNAL_CANCELLATION_PANIC</code> ) to instantly halt execution.
You can read more about how this works in the capture-core README <a href="https://github.com/LinkoraApp/capture-core" rel="nofollow">here</a> .`,1),De=r(`Now it does respect our cancellation. Whenever a coroutine cancellation is triggered from Kotlin, <code>capture-core</code> checks
it periodically and will cancel the operation. Setting this up is quite simple:`,1),Oe=r(`This, of course, cancels the work of the coroutine, but <code>webCapture.saveHTMLPage</code> ’s native code will still be running.
So we have to hook a trigger for Rust cancellation whenever the Kotlin coroutine gets cancelled, which takes us back to <code>suspendCancellableCoroutine</code> .`,1),ke=r(`The implementation of <code>saveHTMLPage</code> should now look like:`,1),Ae=r(`<!><video controls="" width="100%"><source src="https://59a32181-7426-4354.netlify.app/web-capture/debug-cancellation-trigger.mp4" type="video/mp4"/></video>`,3),je=r(`<!><video controls="" width="100%"><source src="https://59a32181-7426-4354.netlify.app/web-capture/debug-sequence.mp4" type="video/mp4"/></video>`,3),Me=r(`Debugging Rust
code <a href="https://slack-chats.kotlinlang.org/t/27171780/anyone-interested-in-using-rust-with-kotlin-multiplatform-cr#01828127-07f8-40ba-9b43-15da36eb8237" rel="nofollow">requires workarounds and isn’t quite straightforward</a> .`,1),Ne=r(`<!> <!>`,1),Pe=r(`The obvious solution is callbacks, but you can’t just pass <code>onThrown: () -&gt; Unit</code> , since this gets compiled to <code>Function0&lt;Unit&gt;</code> . <code>Unit</code> isn’t <code>void</code> . It is still an object living on the Kotlin heap, so you would have to explicitly
handle it with <code>()Ljava/lang/Object;</code> instead of the <em>true void</em> <code>()V</code> . If not, Rust will panic, and the rabbit hole for
type handling goes on…`,1),Fe=r(`Now that cancellation is properly handled, we still need some way to reach back to Kotlin once the work finishes, since
these web-capture operations happen on a random thread that <code>tokio</code> chooses during runtime.`,1),Ie=r(`In our case, there can be multiple senders sending messages asynchronously, but
processing happens synchronously (mailbox). This is exactly
how <a href="https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/actor.html" rel="nofollow">Kotlin actors</a> (
now obsolete) worked.`,1),Le=r(`where <code>RouterMessage</code> is similar to how you would represent your events in a <code>sealed</code> interface:`,1),Re=r(`That <code>EXTERNAL_CANCELLATION_PANIC</code> panic gets caught by the same <code>catch_unwind</code> from earlier, and ends up on this same
background thread. Since it’s just a cancellation acknowledgment and not an actual result, it just gets logged there, no
call back to <code>onCaptureResult</code> , since Kotlin’s coroutine is already cancelled by that point anyway.`,1),ze=r(`<code>on_capture_result</code> is a helper function which will send the results back to Kotlin, i.e., Rust has to call the function
that belongs to Kotlin:`,1),Be=r(`Here are some resources I have gone through so far while working on this <code>web-capture</code> feature:`,1),Ve=r(`If you want to see how this works across Android and Desktop via Kotlin Multiplatform, check
out: <a href="https://github.com/LinkoraApp/Linkora/tree/dev" rel="nofollow">https://github.com/LinkoraApp/Linkora/tree/dev</a>`,1),He=r(`<!> <!> <!> <!> <ul><!><!></ul> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <ol><!><!><!><!></ol> <!> <ol><!><!><!></ol> <!> <!> <ol><!><!><!></ol> <!> <!> <p><!></p> <!> <!> <p><!></p> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <video controls="" width="100%"><source src="https://59a32181-7426-4354.netlify.app/web-capture/concurrent-profile.mp4" type="video/mp4"/></video> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <p><!></p> <!> <p><!></p> <!> <ol><!><!></ol> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <p><!></p> <!> <!> <!> <!> <p><!></p> <!> <hr/> <!> <ol><!><!><!><!><!><!><!><!><!><!><!></ol> <!>`,3);function j(r){var _=He(),v=n(_);f(v,{children:(t,n)=>{var r=S();s(3),e(t,r)},$$slots:{default:!0}});var y=i(v,2);f(y,{children:(t,n)=>{var r=C();s(7),e(t,r)},$$slots:{default:!0}});var b=i(y,2);d(b,{level:1,children:(n,r)=>{s(),e(n,t(`Heap`))},$$slots:{default:!0}});var x=i(b,2);f(x,{children:(n,r)=>{s(),e(n,t(`Before starting the actual implementation, we need to know how heap memory is managed by Android Runtime (ART) and Rust.
Since heap memory gets allocated dynamically during runtime, some things might not work the way we expect when
integrating things like this.`))},$$slots:{default:!0}});var j=i(x,2),M=a(j);u(M,{children:(r,c)=>{var l=T(),d=n(l);f(d,{children:(n,r)=>{s(),e(n,t(`ART has the capability to move around objects in memory to avoid empty spaces (which Dalvik didn’t have). This gets
handled by some internal logic that keeps track of actual data and any pointers required at any given moment. Because
of this, empty memory isn’t sitting unallocated for the process anymore. This is done by ART’s Garbage Collector.`))},$$slots:{default:!0}});var h=i(d);u(a(h),{children:(r,a)=>{f(r,{children:(r,a)=>{s();var o=w(),c=i(n(o));m(c,{text:`GetPrimitiveArrayCritical`}),p(i(c,2),{href:`https://stackoverflow.com/a/46608121`,children:(n,r)=>{s(),e(n,t(`it has its own set of problems that you have to take care of`))},$$slots:{default:!0}}),s(),e(r,o)},$$slots:{default:!0}})},$$slots:{default:!0}}),o(h),e(r,l)},$$slots:{default:!0}}),u(i(M),{children:(n,r)=>{f(n,{children:(n,r)=>{s(),e(n,t(`Rust has no such thing as a Garbage Collector. By default, it drops the memory the moment it’s out of scope.`))},$$slots:{default:!0}})},$$slots:{default:!0}}),o(j);var N=i(j,2);f(N,{children:(n,r)=>{s(),e(n,t(`Now with this integration, we’re supposed to respect these constraints and only access or share data that isn’t going to
crash at runtime, since there’s no way to verify the integration of these two at compile time.`))},$$slots:{default:!0}});var P=i(N,2);d(P,{level:1,children:(n,r)=>{s(),e(n,t(`JNI`))},$$slots:{default:!0}});var F=i(P,2);f(F,{children:(t,n)=>{s();var r=E();s(2),e(t,r)},$$slots:{default:!0}});var I=i(F,2);f(I,{children:(n,r)=>{s(),e(n,t(`So we need to be able to pass stuff to Rust from Kotlin and get back stuff from Rust to Kotlin.`))},$$slots:{default:!0}});var L=i(I,2);f(L,{children:(t,n)=>{s();var r=D();s(2),e(t,r)},$$slots:{default:!0}});var R=i(L,2);c(R,{text:`external fun saveHTMLPage(
    ...
    fileDescriptor: Int,
    filePath: String,
    allowInsecureProtocol: Boolean
    ...): Boolean`});var z=i(R,2);f(z,{children:(t,n)=>{s();var r=O();s(2),e(t,r)},$$slots:{default:!0}});var B=i(z,2);c(B,{text:`#[unsafe(no_mangle)]
pub extern "system" fn Java_com_sakethh_linkora_JVMAndAndroidWebCapture_saveHTMLPage(
    ...
    file_descriptor: jint,
    file_path: JString,
    allow_insecure_protocol: jboolean,
    ...
) -> jboolean`});var Ue=i(B,2);f(Ue,{children:(t,n)=>{s();var r=k();s(4),e(t,r)},$$slots:{default:!0}});var We=i(Ue,2);f(We,{children:(t,n)=>{s();var r=A();s(8),e(t,r)},$$slots:{default:!0}});var Ge=i(We,2);c(Ge,{text:`fn get_string_from_jni(env: &mut JNIEnv, string: JString) -> Option<String> {
    match env.get_string(&string) {
        Ok(str) => Some(str.into()),
        Err(err) => {
            let _ = env.throw_new("java/lang/RuntimeException", err.to_string());
            None
        }
    }
}`});var Ke=i(Ge,2);f(Ke,{children:(t,n)=>{s();var r=ee();s(6),e(t,r)},$$slots:{default:!0}});var qe=i(Ke,2);d(qe,{level:1,children:(n,r)=>{s(),e(n,t(`Writing to file`))},$$slots:{default:!0}});var Je=i(qe,2);f(Je,{children:(n,r)=>{s(),e(n,t(`Now that we have essentially everything we need, writing the HTML content to a file on disk is what remains. Things are
fun here, since doing it differently could just lead to dangling pointers. I’ve thought about this in a couple of ways:`))},$$slots:{default:!0}});var V=i(Je,2),Ye=a(V);u(Ye,{children:(n,r)=>{f(n,{children:(n,r)=>{s(),e(n,t(`Return the HTML byte array to Kotlin. Easy, you don’t have to worry about any sort of dangling pointers and it just
works.`))},$$slots:{default:!0}})},$$slots:{default:!0}});var Xe=i(Ye);u(Xe,{children:(n,r)=>{f(n,{children:(n,r)=>{s(),e(n,t(`Take a pointer of this HTML byte array from Rust and use it in Kotlin.`))},$$slots:{default:!0}})},$$slots:{default:!0}});var Ze=i(Xe);u(Ze,{children:(n,r)=>{f(n,{children:(n,r)=>{s(),e(n,t(`Create a byte array in Kotlin and let Rust add the bytes to it, then use the byte array on Kotlin’s side once Rust is
done adding them.`))},$$slots:{default:!0}})},$$slots:{default:!0}}),u(i(Ze),{children:(t,r)=>{f(t,{children:(t,r)=>{s();var a=te(),o=i(n(a));m(o,{text:`std::fs`}),m(i(o,2),{text:`content://`}),s(),e(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}}),o(V);var Qe=i(V,2);f(Qe,{children:(t,n)=>{s();var r=ne();s(2),e(t,r)},$$slots:{default:!0}});var H=i(Qe,2),$e=a(H);u($e,{children:(r,a)=>{f(r,{children:(r,a)=>{s();var o=re();p(i(n(o)),{href:`https://github.com/LinkoraApp/Linkora/blob/aa41ac56bf02688d12e2f8e620fe58024b38cbab/hoarder/src/main/rust/hoarder.rs#L17`,children:(n,r)=>{s(),e(n,t(`earlier implementation`))},$$slots:{default:!0}}),s(),e(r,o)},$$slots:{default:!0}})},$$slots:{default:!0}});var et=i($e);u(et,{children:(t,r)=>{f(t,{children:(t,r)=>{s();var a=ie();m(i(n(a)),{text:`Box::into_raw`}),s(),e(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}}),u(i(et),{children:(n,r)=>{f(n,{children:(n,r)=>{s(),e(n,t(`The third approach is more practical than either of these, with two caveats. You can never know the size of this byte
array ahead of time, since the size of the byte array is known to Rust and not Kotlin. You’d need two calls into
Rust, one which returns the size of the array, and then the rest of the implementation continues. The other issue is
obvious if you went through the stack overflow post I’ve referred to earlier in the heap section. This is more
practical than the ones above, but the fourth is the simplest way to do this that doesn’t suck.`))},$$slots:{default:!0}})},$$slots:{default:!0}}),o(H);var tt=i(H,2);d(tt,{level:1,children:(n,r)=>{s(),e(n,t(`File descriptors`))},$$slots:{default:!0}});var nt=i(tt,2);f(nt,{children:(n,r)=>{s(),e(n,t(`You pass the file descriptor to Rust, and that is pretty much it:`))},$$slots:{default:!0}});var U=i(nt,2),rt=a(U);u(rt,{children:(n,r)=>{f(n,{children:(n,r)=>{s(),e(n,t(`Create the file via Kotlin.`))},$$slots:{default:!0}})},$$slots:{default:!0}});var it=i(rt);u(it,{children:(r,a)=>{var o=se(),l=n(o);f(l,{children:(n,r)=>{s(),e(n,t(`Get the file descriptor with write access and make sure to detach it:`))},$$slots:{default:!0}});var u=i(l);c(u,{text:`contentResolver.openFileDescriptor(<uri>, "w")?.detachFd()`});var d=i(u);f(d,{children:(t,r)=>{s();var a=ae(),o=i(n(a));m(o,{text:`ParcelFileDescriptor`}),m(i(o,2),{text:`detachFd()`}),s(),e(t,a)},$$slots:{default:!0}});var p=i(d);c(p,{text:`ParcelFileDescriptor.adoptFd(webCaptureFileDescriptor).close() // webCaptureFileDescriptor is an Int`});var h=i(p);f(h,{children:(t,r)=>{s();var a=oe();m(i(n(a)),{text:`throw_new`}),s(),e(t,a)},$$slots:{default:!0}}),c(i(h),{text:`Bad file descriptor (os error 9)`}),e(r,o)},$$slots:{default:!0}}),u(i(it),{children:(r,a)=>{var o=le(),l=n(o);f(l,{children:(n,r)=>{s(),e(n,t(`Make Rust write the bytes directly into the file that this file descriptor refers to.
Something like:`))},$$slots:{default:!0}});var u=i(l);c(u,{text:`let mut web_capture_file = unsafe { File::from_raw_fd(file_descriptor) };
web_capture_file.write_all(<bytes>)`}),f(i(u),{children:(t,r)=>{var i=ce();m(n(i),{text:`File::from_raw_fd`}),s(),e(t,i)},$$slots:{default:!0}}),e(r,o)},$$slots:{default:!0}}),o(U);var at=i(U,2);f(at,{children:(n,r)=>{s(),e(n,t(`Since the file descriptor works at the kernel level, this just works. Rust
doesn’t need to actually have any idea of how a URI on Android resolves, or anything like that.`))},$$slots:{default:!0}});var ot=i(at,2);f(ot,{children:(n,r)=>{s(),e(n,t(`Putting it all together, here is how Kotlin and Rust interact to make this possible:`))},$$slots:{default:!0}});var W=i(ot,2);g(a(W),{src:`/images/web-capture-in-linkora/kt-rs-file-write.png`}),o(W);var st=i(W,2);f(st,{children:(t,n)=>{s();var r=ue();s(4),e(t,r)},$$slots:{default:!0}});var ct=i(st,2);c(ct,{text:`pub extern "system" fn Java_com_sakethh_linkora_JVMAndAndroidWebCapture_saveHTMLPage(
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
}`});var G=i(ct,2);g(a(G),{src:`/images/web-capture-in-linkora/panic-handle.png`}),o(G);var lt=i(G,2);d(lt,{level:1,children:(n,r)=>{s(),e(n,t(`Benchmarks & Profiling`))},$$slots:{default:!0}});var ut=i(lt,2);f(ut,{children:(n,r)=>{s(),e(n,t(`I have it set up as follows just for manual testing:`))},$$slots:{default:!0}});var dt=i(ut,2);c(dt,{text:`viewModelScope.launch(PlatformIODispatcher) {
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
}`});var ft=i(dt,2);f(ft,{children:(t,n)=>{s();var r=de();s(2),e(t,r)},$$slots:{default:!0}});var pt=i(ft,2);c(pt,{text:`expect val PlatformIODispatcher: CoroutineDispatcher`});var mt=i(pt,2);f(mt,{children:(n,r)=>{s(),e(n,t(`This test starts against these pages:`))},$$slots:{default:!0}});var ht=i(mt,2);c(ht,{text:`listOf(
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
)`});var gt=i(ht,2);d(gt,{level:2,children:(n,r)=>{s(),e(n,t(`Concurrent downloads`))},$$slots:{default:!0}});var _t=i(gt,2);f(_t,{children:(n,r)=>{s(),e(n,t(`In this example, I have set it to 4 downloads at a time:`))},$$slots:{default:!0}});var vt=i(_t,2);c(vt,{text:`listOf(
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
}`});var yt=i(vt,2);f(yt,{children:(t,n)=>{var r=fe();s(3),e(t,r)},$$slots:{default:!0}});var bt=i(yt,2);c(bt,{text:`...
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
...`});var xt=i(bt,2);f(xt,{children:(n,r)=>{s(),e(n,t(`This gives us strict concurrency, allowing us to throttle downloads manually.`))},$$slots:{default:!0}});var St=i(xt,2);f(St,{children:(n,r)=>{s(),e(n,t(`For sites with a lot of media, memory spikes are obvious. Since media can be stripped down from the app preferences if
not needed, memory usage will vary. For testing, I allowed embedding of all available CSS, fonts, media, metadata, and
JavaScript.`))},$$slots:{default:!0}});var Ct=i(St,2);f(Ct,{children:(n,r)=>{s(),e(n,t(`For context, here are the final sizes of these self-contained files:`))},$$slots:{default:!0}});var wt=i(Ct,2);h(wt,{children:(n,r)=>{var c=pe(),l=i(a(c)),u=a(l),d=a(u);p(a(d),{href:`https://zed.dev/blog/crdts`,children:(n,r)=>{s(),e(n,t(`https://zed.dev/blog/crdts`))},$$slots:{default:!0}}),o(d),s(),o(u);var f=i(u),m=a(f);p(a(m),{href:`https://github.com/Y2Z/monolith`,children:(n,r)=>{s(),e(n,t(`https://github.com/Y2Z/monolith`))},$$slots:{default:!0}}),o(m),s(),o(f);var h=i(f),g=a(h);p(a(g),{href:`https://genius.com/artists/Fleetwood-mac`,children:(n,r)=>{s(),e(n,t(`https://genius.com/artists/Fleetwood-mac`))},$$slots:{default:!0}}),o(g),s(),o(h);var _=i(h),v=a(_);p(a(v),{href:`https://keepandroidopen.org/`,children:(n,r)=>{s(),e(n,t(`https://keepandroidopen.org/`))},$$slots:{default:!0}}),o(v),s(),o(_);var y=i(_),b=a(y);p(a(b),{href:`https://kotlinlang.org/docs/multiplatform/get-started.html`,children:(n,r)=>{s(),e(n,t(`https://kotlinlang.org/docs/multiplatform/get-started.html`))},$$slots:{default:!0}}),o(b),s(),o(y);var x=i(y),S=a(x);p(a(S),{href:`https://x.com/FallonTonight/status/2055143968711823639`,children:(n,r)=>{s(),e(n,t(`https://x.com/FallonTonight/status/2055143968711823639`))},$$slots:{default:!0}}),o(S),s(),o(x);var C=i(x),w=a(C);p(a(w),{href:`https://www.opensuse.org/`,children:(n,r)=>{s(),e(n,t(`https://www.opensuse.org/`))},$$slots:{default:!0}}),o(w),s(),o(C);var T=i(C),E=a(T);p(a(E),{href:`https://en.wikipedia.org/wiki/Cowboy_Bebop`,children:(n,r)=>{s(),e(n,t(`https://en.wikipedia.org/wiki/Cowboy_Bebop`))},$$slots:{default:!0}}),o(E),s(),o(T);var D=i(T),O=a(D);p(a(O),{href:`https://f-droid.org/`,children:(n,r)=>{s(),e(n,t(`https://f-droid.org/`))},$$slots:{default:!0}}),o(O),s(),o(D);var k=i(D),A=a(k);p(a(A),{href:`https://vimeo.com/676247342`,children:(n,r)=>{s(),e(n,t(`https://vimeo.com/676247342`))},$$slots:{default:!0}}),o(A),s(),o(k),o(l),o(c),e(n,c)},$$slots:{default:!0}});var Tt=i(wt,2);f(Tt,{children:(n,r)=>{s(),e(n,t(`CPU and memory readings from the Android Profiler on a build that is the same as release:`))},$$slots:{default:!0}});var Et=i(Tt,4);f(Et,{children:(t,n)=>{s();var r=me();s(4),e(t,r)},$$slots:{default:!0}});var Dt=i(Et,2);f(Dt,{children:(n,r)=>{s(),e(n,t(`CPU usage remained normal (the app’s usage is the green graph inside the Profiler’s CPU timeline).`))},$$slots:{default:!0}});var Ot=i(Dt,2);f(Ot,{children:(n,r)=>{s(),e(n,t(`Logs:`))},$$slots:{default:!0}});var kt=i(Ot,2);c(kt,{text:`13:27:07.395 web-capture: Starting downloads
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
13:27:50.630 web-capture: Completed downloading`});var At=i(kt,2);f(At,{children:(n,r)=>{s(),e(n,t(`10 downloads concurrently (4 at any given time) took 43 seconds.`))},$$slots:{default:!0}});var jt=i(At,2);d(jt,{level:1,children:(n,r)=>{s(),e(n,t(`Cancellation`))},$$slots:{default:!0}});var Mt=i(jt,2);f(Mt,{children:(n,r)=>{s(),e(n,t(`Coroutine cancellation affects children of a parent scope which might involve the calls to Rust, but Rust code will not
be affected by these cancellations. In fact, the Kotlin coroutine never truly gets cancelled or completed until the Rust
operations are completed.`))},$$slots:{default:!0}});var Nt=i(Mt,2);f(Nt,{children:(t,n)=>{s();var r=he();s(6),e(t,r)},$$slots:{default:!0}});var Pt=i(Nt,2);f(Pt,{children:(t,n)=>{s();var r=ge();s(2),e(t,r)},$$slots:{default:!0}});var Ft=i(Pt,2);f(Ft,{children:(t,n)=>{s();var r=_e();s(4),e(t,r)},$$slots:{default:!0}});var It=i(Ft,2);c(It,{text:`val job = launch(PlatformIODispatcher) {
    val result = webCapture.saveHTMLPage(...) // blocking JNI call, no suspension point inside
}
job.cancel() // native call keeps running regardless`});var Lt=i(It,2);f(Lt,{children:(t,n)=>{s();var r=ve();s(2),e(t,r)},$$slots:{default:!0}});var Rt=i(Lt,2);f(Rt,{children:(t,n)=>{s();var r=ye();s(6),e(t,r)},$$slots:{default:!0}});var zt=i(Rt,2);f(zt,{children:(t,n)=>{s();var r=be();s(2),e(t,r)},$$slots:{default:!0}});var Bt=i(zt,2);f(Bt,{children:(n,r)=>{s(),e(n,t(`Consider the following code:`))},$$slots:{default:!0}});var Vt=i(Bt,2);c(Vt,{text:`val testScope = CoroutineScope(PlatformIODispatcher)
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
}`});var Ht=i(Vt,2);f(Ht,{children:(n,r)=>{s(),e(n,t(`On Rust I have (when targeted at desktop, the app will use the direct path and fd will be -1 when passed from desktop.
I’m using the desktop target here to print whatever Rust is printing, since those don’t get printed into the logcat):`))},$$slots:{default:!0}});var Ut=i(Ht,2);c(Ut,{text:`...
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
...`});var Wt=i(Ut,2);f(Wt,{children:(n,r)=>{s(),e(n,t(`Logs for the above operation:`))},$$slots:{default:!0}});var Gt=i(Wt,2);c(Gt,{text:`Linkora Log : web-capture: Starting downloads
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
`});var Kt=i(Gt,2);f(Kt,{children:(t,n)=>{s();var r=xe();s(2),e(t,r)},$$slots:{default:!0}});var qt=i(Kt,2);f(qt,{children:(t,n)=>{s();var r=Se();s(10),e(t,r)},$$slots:{default:!0}});var Jt=i(qt,2);f(Jt,{children:(t,n)=>{s();var r=Ce();s(4),e(t,r)},$$slots:{default:!0}});var Yt=i(Jt,2);f(Yt,{children:(t,n)=>{s();var r=we();s(6),e(t,r)},$$slots:{default:!0}});var Xt=i(Yt,2);l(Xt,{children:(n,r)=>{s(),e(n,t(`The following has been added on July 14, 2026`))},$$slots:{default:!0}});var Zt=i(Xt,2);f(Zt,{children:(t,n)=>{s();var r=Te();s(6),e(t,r)},$$slots:{default:!0}});var Qt=i(Zt,2);f(Qt,{children:(t,n)=>{s();var r=Ee();s(18),e(t,r)},$$slots:{default:!0}});var $t=i(Qt,2);f($t,{children:(t,n)=>{s();var r=De();s(2),e(t,r)},$$slots:{default:!0}});var en=i($t,2);c(en,{text:`var captureJob: Job? = null
...
captureJob = viewModelScope.launch(PlatformIODispatcher) {
    launch {
        delay(5.seconds)
        captureJob?.cancel()
    }
    webCapture.saveHTMLPage(...)
}
`});var tn=i(en,2);f(tn,{children:(t,n)=>{s();var r=Oe();s(4),e(t,r)},$$slots:{default:!0}});var nn=i(tn,2);f(nn,{children:(t,n)=>{s();var r=ke();s(2),e(t,r)},$$slots:{default:!0}});var rn=i(nn,2);c(rn,{text:`suspend fun saveHTMLPage(
    ...
): Boolean = suspendCancellableCoroutine { continuation ->
    ...
    continuation.invokeOnCancellation {
        // JNI function
        cancelWebCapture(
            key = opKey,
            ...
        )
    }
    ...
}
`});var an=i(rn,2);f(an,{children:(n,r)=>{s(),e(n,t(`Now on Rust, we can have something like:`))},$$slots:{default:!0}});var on=i(an,2);c(on,{text:`#[unsafe(no_mangle)]
pub extern "system" fn Java_com_sakethh_linkora_JVMAndAndroidWebCapture_cancelWebCapture(
    mut env: JNIEnv,
    _class: JClass,
    ...
) {
    ...
        cancel_token.trigger_cancellation(); // will trigger the cancellation of the monolith (capture-core) lib
    ...
}
`});var sn=i(on,2);f(sn,{children:(n,r)=>{s(),e(n,t(`When put together, the complete cooperative cancellation system between Kotlin and Rust looks exactly like this:`))},$$slots:{default:!0}});var K=i(sn,2);g(a(K),{src:`/images/web-capture-in-linkora/kt-rs-cancellation.png`}),o(K);var cn=i(K,2);f(cn,{children:(n,r)=>{s(),e(n,t(`Which in the console would look like:`))},$$slots:{default:!0}});var q=i(cn,2);g(a(q),{src:`/images/web-capture-in-linkora/kt-rs-cancellation-console.png`}),o(q);var ln=i(q,2);f(ln,{children:(n,r)=>{s(),e(n,t(`We can go further and add breakpoints for debugging:`))},$$slots:{default:!0}});var J=i(ln,2),un=a(J);u(un,{children:(r,i)=>{var a=Ae();f(n(a),{children:(n,r)=>{s(),e(n,t(`Cancelling triggers the external function that stops native work.`))},$$slots:{default:!0}}),s(),e(r,a)},$$slots:{default:!0}}),u(i(un),{children:(r,i)=>{var a=je();f(n(a),{children:(n,r)=>{s(),e(n,t(`Sequence on how the cancellation works.`))},$$slots:{default:!0}}),s(),e(r,a)},$$slots:{default:!0}}),o(J);var dn=i(J,2);f(dn,{children:(t,n)=>{s();var r=Me();s(2),e(t,r)},$$slots:{default:!0}});var fn=i(dn,2);d(fn,{level:1,children:(n,r)=>{s(),e(n,t(`Handling Panics without Exceptions`))},$$slots:{default:!0}});var pn=i(fn,2);f(pn,{children:(n,r)=>{s(),e(n,t(`Now, how do we report when things go wrong in Rust? As mentioned, you can always throw exceptions,
but dealing with JNI exceptions is a nightmare. The public documentation doesn’t mention anything about exception
clearance or its limits. I ended up deadlocking some tests for several minutes, when they should have been completed
within a minute.`))},$$slots:{default:!0}});var mn=i(pn,2);f(mn,{children:(t,r)=>{var a=Ne(),o=n(a);g(o,{src:`/images/web-capture-in-linkora/test-exception-deadlock.png`,caption:`Test deadlock due to exception clearance`}),g(i(o,2),{src:`/images/web-capture-in-linkora/test-exception-deadlock-free.png`,caption:`Tests work as expected`}),e(t,a)},$$slots:{default:!0}});var hn=i(mn,2);f(hn,{children:(t,n)=>{s();var r=Pe();s(14),e(t,r)},$$slots:{default:!0}});var gn=i(hn,2);f(gn,{children:(n,r)=>{s(),e(n,t(`Alternatively, we can use functional interfaces (SAM conversions). Instead of throwing exceptions, we can send
information about this unusual behavior safely via callbacks. With SAM conversions, although the lambda syntax is just
for styling, the compilation generates a regular, concrete object that JNI and Rust can work with.`))},$$slots:{default:!0}});var _n=i(gn,2);c(_n,{text:`object JVMAndAndroidWebCapture {
    fun interface OnThrown {
        fun onThrown(message: String)
    }
    ...

    private external fun cancelWebCapture(
        key: String,
        onThrown: OnThrown,
    )
    ...

    saveHTMLPage(
    ...
    onThrown = { message ->
        val cont = pendingCaptures.remove(opKey)
        if (cont?.isActive == true) {
            cont.resumeWithException(IllegalStateException(message))
        }
    }
    ...
}`});var vn=i(_n,2);f(vn,{children:(n,r)=>{s(),e(n,t(`You could use anonymous objects instead of SAM conversions here. However, SAM conversions work especially well with a
non-capturing lambda. In that case, they refer to the same instance throughout the application’s lifecycle and avoid
memory allocation on each call. While that’s not the case here (since we capture state), the memory allocation will be
the same as with anonymous objects.`))},$$slots:{default:!0}});var yn=i(vn,2);d(yn,{level:1,children:(n,r)=>{s(),e(n,t(`Result Handling`))},$$slots:{default:!0}});var bn=i(yn,2);f(bn,{children:(t,n)=>{s();var r=Fe();s(2),e(t,r)},$$slots:{default:!0}});var xn=i(bn,2);f(xn,{children:(t,n)=>{s();var r=Ie();s(2),e(t,r)},$$slots:{default:!0}});var Sn=i(xn,2);c(Sn,{text:`let (capture_status_sender, capture_status_receiver) = mpsc::channel::<RouterMessage>();`});var Cn=i(Sn,2);f(Cn,{children:(n,r)=>{s(),e(n,t(`For senders, I have a function which handles sending the events to the channel, which is implemented as:`))},$$slots:{default:!0}});var wn=i(Cn,2);c(wn,{text:`fn send_router_message(message: RouterMessage) {
    let capture_sender_guard = CAPTURE_RESULT_SENDER
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner());

    if let Some(sender) = capture_sender_guard.as_ref() {
        let _ = sender.send(message);
    }
}`});var Tn=i(wn,2);f(Tn,{children:(t,n)=>{s();var r=Le();s(4),e(t,r)},$$slots:{default:!0}});var En=i(Tn,2);c(En,{text:`enum RouterMessage {
    CaptureResult {
        op_key: String,
        is_success: bool,
    },
    CaptureError {
        op_key: String,
        error_message: String,
    },
    Shutdown,
}`});var Dn=i(En,2);f(Dn,{children:(n,r)=>{s(),e(n,t(`And it is received in a background thread:`))},$$slots:{default:!0}});var On=i(Dn,2);c(On,{text:`...
std::thread::spawn(move || {
    ...
    while let Ok(message) = capture_status_receiver.recv() {
        match message {
            RouterMessage::CaptureResult { op_key, is_success } => {
                on_capture_result(...);
            }
            RouterMessage::CaptureError { op_key, error_message } => {
                on_capture_result(...);
            }
            RouterMessage::Shutdown => {
                ...
            }
        }
    }
});`});var kn=i(On,2);f(kn,{children:(t,n)=>{s();var r=Re();s(6),e(t,r)},$$slots:{default:!0}});var An=i(kn,2);f(An,{children:(t,n)=>{var r=ze();s(),e(t,r)},$$slots:{default:!0}});var jn=i(An,2);c(jn,{text:`fn on_capture_result(env: &mut JNIEnv, global_ref: &GlobalRef, op_key: JString, is_success: bool) {
    let _ = env.call_method(
        global_ref,
        "onCaptureResult",
        "(Ljava/lang/String;Z)V",
        &[JValue::Object(&*op_key), JValue::Bool(is_success.into())],
    );
}`});var Mn=i(jn,2);f(Mn,{children:(n,r)=>{s(),e(n,t(`From Kotlin, you would receive it like:`))},$$slots:{default:!0}});var Nn=i(Mn,2);c(Nn,{text:`private val pendingCaptures = ConcurrentHashMap<String, CancellableContinuation<Boolean>>()
...
private fun onCaptureResult(
    opKey: String,
    success: Boolean,
) {
    val continuation = pendingCaptures.remove(opKey)
    if (continuation?.isActive == true) {
        continuation.resume(success)
    }
}
...`});var Pn=i(Nn,2);f(Pn,{children:(n,r)=>{s(),e(n,t(`Putting it all together, the result handling system looks like this:`))},$$slots:{default:!0}});var Y=i(Pn,2);g(a(Y),{src:`/images/web-capture-in-linkora/kt-rs-result.png`}),o(Y);var Fn=i(Y,2);f(Fn,{children:(n,r)=>{s(),e(n,t(`Collecting results only works while that background thread is alive. I have separate functions, triggered from Kotlin,
to spin it up and shut it down from the Rust side.`))},$$slots:{default:!0}});var In=i(Fn,2);d(In,{level:1,children:(n,r)=>{s(),e(n,t(`Conclusion`))},$$slots:{default:!0}});var X=i(In,2);f(X,{children:(n,r)=>{s(),e(n,t(`This entire asynchronous working of things on both sides gave me the foundation I needed for this feature. Now as the
core
implementation works, I gotta build a couple of things on top of this, so user-facing things will be much more flexible
and can be used practically.`))},$$slots:{default:!0}});var Ln=i(X,2);f(Ln,{children:(n,r)=>{s(),e(n,t(`If you zoom out to see how everything works together, this is what it looks like:`))},$$slots:{default:!0}});var Z=i(Ln,2);g(a(Z),{src:`/images/web-capture-in-linkora/overview.png`}),o(Z);var Rn=i(Z,2);f(Rn,{children:(n,r)=>{s(),e(n,t(`Native interop is fun, especially if Kotlin and Rust are working together, until you have to deal with JNI limitations.
It didn’t really affect a lot except that deadlock with JNI exceptions, which was solvable pretty simply.`))},$$slots:{default:!0}});var zn=i(Rn,4);f(zn,{children:(t,n)=>{s();var r=Be();s(2),e(t,r)},$$slots:{default:!0}});var Q=i(zn,2),Bn=a(Q);u(Bn,{children:(n,r)=>{f(n,{children:(n,r)=>{p(n,{href:`https://www.reddit.com/r/rust/comments/38ka6i/how_to_close_a_file/`,children:(n,r)=>{s(),e(n,t(`https://www.reddit.com/r/rust/comments/38ka6i/how_to_close_a_file/`))},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var Vn=i(Bn);u(Vn,{children:(n,r)=>{f(n,{children:(n,r)=>{p(n,{href:`https://www.reddit.com/r/rust/comments/1duc594/reading_granted_content_file_uris_on_android/`,children:(n,r)=>{s(),e(n,t(`https://www.reddit.com/r/rust/comments/1duc594/reading_granted_content_file_uris_on_android/`))},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var Hn=i(Vn);u(Hn,{children:(n,r)=>{f(n,{children:(n,r)=>{p(n,{href:`https://source.android.com/docs/core/runtime#Improved_GC`,children:(n,r)=>{s(),e(n,t(`https://source.android.com/docs/core/runtime#Improved_GC`))},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var Un=i(Hn);u(Un,{children:(n,r)=>{f(n,{children:(n,r)=>{p(n,{href:`https://stackoverflow.com/a/79665618`,children:(n,r)=>{s(),e(n,t(`https://stackoverflow.com/a/79665618`))},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var Wn=i(Un);u(Wn,{children:(n,r)=>{f(n,{children:(n,r)=>{p(n,{href:`https://stackoverflow.com/questions/75177508/interrupt-jni-method-execution-in-a-coroutine`,children:(n,r)=>{s(),e(n,t(`https://stackoverflow.com/questions/75177508/interrupt-jni-method-execution-in-a-coroutine`))},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var Gn=i(Wn);u(Gn,{children:(n,r)=>{f(n,{children:(n,r)=>{p(n,{href:`https://www.reddit.com/r/rust/comments/1cpjyib/to_catch_unwind_or_not_to_catch_unwind/`,children:(n,r)=>{s(),e(n,t(`https://www.reddit.com/r/rust/comments/1cpjyib/to_catch_unwind_or_not_to_catch_unwind/`))},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var Kn=i(Gn);u(Kn,{children:(n,r)=>{f(n,{children:(n,r)=>{p(n,{href:`https://source.android.com/docs/setup/build/rust/building-rust-modules/android-rust-patterns#android-logging`,children:(n,r)=>{s(),e(n,t(`https://source.android.com/docs/setup/build/rust/building-rust-modules/android-rust-patterns#android-logging`))},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var qn=i(Kn);u(qn,{children:(n,r)=>{f(n,{children:(n,r)=>{p(n,{href:`https://docs.rs/android_logger/0.10.1/android_logger/`,children:(n,r)=>{s(),e(n,t(`https://docs.rs/android_logger/0.10.1/android_logger/`))},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var Jn=i(qn);u(Jn,{children:(n,r)=>{f(n,{children:(n,r)=>{p(n,{href:`https://kotlinlang.org/spec/asynchronous-programming-with-coroutines.html`,children:(n,r)=>{s(),e(n,t(`https://kotlinlang.org/spec/asynchronous-programming-with-coroutines.html`))},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var $=i(Jn);u($,{children:(n,r)=>{f(n,{children:(n,r)=>{p(n,{href:`https://kotlinlang.org/docs/fun-interfaces.html`,children:(n,r)=>{s(),e(n,t(`https://kotlinlang.org/docs/fun-interfaces.html`))},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}}),u(i($),{children:(n,r)=>{f(n,{children:(n,r)=>{p(n,{href:`https://verdagon.dev/blog/exploring-seamless-rust-interop-part-2`,children:(n,r)=>{s(),e(n,t(`https://verdagon.dev/blog/exploring-seamless-rust-interop-part-2`))},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}}),o(Q),f(i(Q,2),{children:(t,n)=>{s();var r=Ve();s(),e(t,r)},$$slots:{default:!0}}),e(r,_)}export{j as default,_ as metadata};