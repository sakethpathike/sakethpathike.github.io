import{$ as e,C as t,I as n,L as ee,Q as r,R as i,S as a,b as o}from"./C5o3b5G5.js";import"./CFKVnMbq.js";import"./-ToDqmqz.js";import{t as s}from"./DgtPQTdQ.js";import{c,i as l,s as te}from"./0ymMVGy1.js";var u={title:`Kotlin Multiplatform, in practice`,description:`Multiplatform is fun, at least with Kotlin.`,pubDatetime:`Aug 03, 2025 07:30 PM IST`},{title:d,description:f,pubDatetime:p}=u,ne=a(`<a href="https://kotlinlang.org/" rel="nofollow">kotlinlang.org</a> used to say <code>A modern programming language that makes developers happier</code> and
they did make one which I think is <em>the one</em> .`,1),re=a(`Kotlin decouples the platform-specific implementations with <code>actual</code> and <code>expect</code> , which makes you directly deal with
the platform-specific stuff.`,1),ie=a(`<code>expect</code> is the <em>skeleton</em> while the actual implementation of it lies in the usage of <code>actual</code> across targeted
platforms.`,1),ae=a(`If the project is targeting Android and desktop, then the respective implementation for these platforms must be
implemented based on this <em>expected</em> block.`,1),oe=a(`Now <code>pushSnackbar()</code> is an extension function which exists in the common codebase; the platform codebase cannot be
accessed from the common codebase, but vice versa is possible with KMP.`,1),se=a(`I used to use Dagger Hilt for DI in <a href="https://github.com/LinkoraApp/Linkora" rel="nofollow">Linkora</a> , when the codebase targeted Android
only. Now that I have migrated to KMP, I have switched to manual DI, which I think is fairly simple and the usual way I
prefer for my projects now (AS IT SHOULD BE).`,1),ce=a(`Live preview sucked with Jetpack Compose in the initial days of my usage, as you had to rebuild for every newly updated
preview; which later picked it up and got good,
but <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-hot-reload.html" rel="nofollow">Compose Hot Reload</a> works just
fine for me, far better than what it used to be with Compose which only targeted Android back then.`,1),le=a(`Coroutines and Flows play a major role in KMP. Now, when I mentioned “major role”, I mean <em>major role</em> .`,1),ue=a(`The <code>expect</code> and <code>actual</code> usage is required in some cases, and it may require another component to be included to
complete the operation, as the expected implementation is supposed to be an individual block and not included wherever
in the codebase.`,1),de=a(`If you are using Compose, you would typically use <code>rememberLauncherForActivityResult</code> , which is <code>ManagedActivityResultLauncher</code> with a contract to pick the directory. Now, <code>rememberLauncherForActivityResult</code> is a
composable function; you cannot call it randomly in the codebase. It needs to be a composable function to call it,
similar to suspend functions.`,1),fe=a(`<code>pickADirectory</code> isn’t a composable; in this case, using flows or channels to make the composable pick the directory
makes sense, and on picking it, send the directory URI back, which we can collect from the implementation of <code>pickADirectory</code> , which targets the Android platform.`,1),pe=a(`And from the <code>MainActivity</code> or anywhere you are reading the emissions, you collect the events and send them back via <code>PickedDirectory</code> .`,1),me=a(`<code>pushUIEvent</code> is an extension function that exists in the Android codebase:`,1),he=a(`I think KMP is great at what it does with the existing tooling support. I didn’t ship to iOS yet, so I’m not sure how it
impacts anything, but I’m certainly sure that
the <a href="https://x.com/ChrisKruegerDev/status/1950493507212148883" rel="nofollow">size of the app is massive on iOS</a> , but it seems it will
only get better.`,1),ge=a(`We really came a long
way ( <a href="https://web.archive.org/web/20140802140223/https://kotlinlang.org/" rel="nofollow">Captured on Aug 02 2014</a> ).`,1),_e=a(`<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <hr/> <!> <!> <p><!></p>`,1);function m(a){var u=_e(),d=ee(u);l(d,{children:(e,t)=>{var n=ne();r(5),o(e,n)},$$slots:{default:!0}});var f=i(d,2);l(f,{children:(e,n)=>{r(),o(e,t(`While I got to know about Kotlin from Android development, it has grown a lot since then. The first-party
library/frameworks/tools support from JetBrains and the Kotlin team, and the software related to development using
Kotlin, built and maintained by the community, made the language fun and interesting to work with, not specifically on
Android, but also in the backend.`))},$$slots:{default:!0}});var p=i(f,2);l(p,{children:(e,n)=>{r(),o(e,t(`Now that there is an official language server, I hope it will continue to evolve further. I’m kinda biased towards
Kotlin for a couple of reasons. Irrespective of that, I think Kotlin is great at what it does.`))},$$slots:{default:!0}});var m=i(p,2);c(m,{level:1,children:(e,n)=>{r(),o(e,t(`Multiplatform with Kotlin`))},$$slots:{default:!0}});var h=i(m,2);l(h,{children:(e,t)=>{r();var n=re();r(4),o(e,n)},$$slots:{default:!0}});var g=i(h,2);l(g,{children:(e,n)=>{r(),o(e,t(`The core and common logic is separated from the respective platform stuff in a typical KMP project, so you end up
writing platform-specific stuff individually while the common code remains the same across the targeted platforms.`))},$$slots:{default:!0}});var _=i(g,2);l(_,{children:(e,t)=>{var n=ie();r(5),o(e,n)},$$slots:{default:!0}});var v=i(_,2);s(v,{text:`expect suspend fun deleteAutoBackups(
    backupLocation: String,
    threshold: Int, onCompletion: (deletionCount: Int) -> Unit
)`});var y=i(v,2);l(y,{children:(e,t)=>{r();var n=ae();r(2),o(e,n)},$$slots:{default:!0}});var b=i(y,2);l(b,{children:(e,n)=>{r(),o(e,t(`Now on Android, the implementation for this may look like:`))},$$slots:{default:!0}});var x=i(b,2);s(x,{text:`actual suspend fun deleteAutoBackups(
    backupLocation: String, threshold: Int, onCompletion: (deletionCount: Int) -> Unit
) {
    try {
        withContext(Dispatchers.IO) {
            DocumentFile.fromTreeUri(LinkoraApp.getContext(), backupLocation.toUri())?.listFiles()
                ?.filter {
                    it.name?.startsWith("LinkoraSnapshot-") == true
                }?.let { snapshots ->
                    // delete the backups
                }
        }
    } catch (e: Exception) {
        e.printStackTrace()
        e.pushSnackbar()
    }
}`});var S=i(x,2);l(S,{children:(e,n)=>{r(),o(e,t(`But the same function’s implementation on a desktop target will look like:`))},$$slots:{default:!0}});var ve=i(S,2);s(ve,{text:`actual suspend fun deleteAutoBackups(
    backupLocation: String, threshold: Int, onCompletion: (deletionCount: Int) -> Unit
) {
    try {
        withContext(Dispatchers.IO) {
            File(backupLocation).listFiles {
                it.nameWithoutExtension.startsWith("LinkoraSnapshot-")
            }?.let { snapshots ->
                // delete the backups
            }
        }
    } catch (e: Exception) {
        e.printStackTrace()
        e.pushSnackbar()
    }
}`});var C=i(ve,2);l(C,{children:(e,n)=>{r(),o(e,t(`The platform-specific APIs or implementations get involved with this expect/actual mechanism, which makes things
straightforward and pretty clear.`))},$$slots:{default:!0}});var w=i(C,2);l(w,{children:(e,t)=>{r();var n=oe();r(2),o(e,n)},$$slots:{default:!0}});var T=i(w,2);l(T,{children:(e,n)=>{r(),o(e,t(`If you are dealing with composables or classes or an interface implementation on specific platforms or anything that is
platform-specific, this mechanism remains the same.`))},$$slots:{default:!0}});var E=i(T,2);l(E,{children:(e,n)=>{r(),o(e,t(`I never tried other multiplatform frameworks/tools, but I think this is the simplest yet finest way to deal with
platform-level implementations, although most of the commonly used libraries like Coil, Ktor, koin, Room, and material
components (via Compose multiplatform) already support KMP, but there may be cases where you have to stick with
platform-level APIs, and I think KMP does it most finely.`))},$$slots:{default:!0}});var D=i(E,2);c(D,{level:2,children:(e,n)=>{r(),o(e,t(`The Nitpicks`))},$$slots:{default:!0}});var O=i(D,2);l(O,{children:(e,n)=>{r(),o(e,t(`Now the nitpick I have here has to do more with CMP than KMP: CMP is maintained by JetBrains, which is not on the latest
version regularly with respect to the upstream version, and some components like material expressive aren’t yet possible
to use directly in the common codebase, but again, this is just a nitpick.`))},$$slots:{default:!0}});var k=i(O,2);l(k,{children:(e,n)=>{r(),o(e,t(`This has nothing to do with KMP, but you also need to know that yep, this sort of thing exists where you might end up
not using the library you used to use when on a single targeted codebase, so you end up writing your own thing in the
common codebase or with expect/actual blocks, which is fine, at least for me.`))},$$slots:{default:!0}});var A=i(k,2);l(A,{children:(e,t)=>{r();var n=se();r(2),o(e,n)},$$slots:{default:!0}});var j=i(A,2);l(j,{children:(e,t)=>{r();var n=ce();r(2),o(e,n)},$$slots:{default:!0}});var M=i(j,2);c(M,{level:1,children:(e,n)=>{r(),o(e,t(`Coroutines and Flows in KMP`))},$$slots:{default:!0}});var N=i(M,2);l(N,{children:(e,t)=>{r();var n=le();r(2),o(e,n)},$$slots:{default:!0}});var P=i(N,2);l(P,{children:(e,t)=>{r();var n=ue();r(4),o(e,n)},$$slots:{default:!0}});var F=i(P,2);l(F,{children:(e,n)=>{r(),o(e,t(`We need the “Event-driven” style to complete the operation; this is, of course, your typical asynchronous use case,
which Kotlin coroutines and flows do excellently in my usage.`))},$$slots:{default:!0}});var I=i(F,2);l(I,{children:(e,n)=>{r(),o(e,t(`This function needs to use platform-specific APIs to pick a directory:`))},$$slots:{default:!0}});var L=i(I,2);s(L,{text:`expect suspend fun pickADirectory(): String?`});var R=i(L,2);l(R,{children:(e,n)=>{r(),o(e,t(`Now, you would call this typically from a ViewModel or any other class; when dealing with the desktop target, this is
straightforward, you implement something like:`))},$$slots:{default:!0}});var z=i(R,2);s(z,{text:`actual suspend fun pickADirectory(): String? {
    val fileDialog = FileDialog(
        Frame(),
        Localization.Key.SelectASourceDir.getLocalizedString(),
        FileDialog.LOAD
    )
    fileDialog.isVisible = true
    val sourceDirectory = File(fileDialog.directory)
    // rest of the implementation
}`});var B=i(z,2);l(B,{children:(e,n)=>{r(),o(e,t(`When targeting Android, the implementation will be based on Android-specific APIs.`))},$$slots:{default:!0}});var V=i(B,2);l(V,{children:(e,t)=>{r();var n=de();r(6),o(e,n)},$$slots:{default:!0}});var H=i(V,2);l(H,{children:(e,t)=>{var n=fe();r(3),o(e,n)},$$slots:{default:!0}});var U=i(H,2);l(U,{children:(e,n)=>{r(),o(e,t(`The implementation would look like:`))},$$slots:{default:!0}});var W=i(U,2);s(W,{text:`actual suspend fun pickADirectory(): String? {
    AndroidUIEvent.pushUIEvent(AndroidUIEvent.Type.PickADirectory)
    return suspendCancellableCoroutine { continuation ->
        val listenerJob = CoroutineScope(continuation.context).launch {
            val eventDirectoryPick =
                AndroidUIEvent.androidUIEventChannel.first() as AndroidUIEvent.Type.PickedDirectory
            try {
                continuation.resume(eventDirectoryPick.uri?.toString())
            } catch (e: Exception) {
                e.printStackTrace()
                continuation.cancel()
            }
        }
        continuation.invokeOnCancellation {
            listenerJob.cancel()
        }
    }
}`});var G=i(W,2);l(G,{children:(e,t)=>{r();var n=pe();r(4),o(e,n)},$$slots:{default:!0}});var K=i(G,2);s(K,{text:`val activityResultLauncherForPickingADirectory =
    rememberLauncherForActivityResult(contract = OpenDocumentTreeWithPermissionsContract()) { uri: Uri? ->
        // persist the URI permissions and then send back the URI
        coroutineScope.pushUIEvent(
            AndroidUIEvent.Type.PickedDirectory(uri)
        )
    }

LaunchedEffect(Unit) {
    AndroidUIEvent.androidUIEventChannel.collectLatest {
        is AndroidUIEvent.Type.PickADirectory -> {
        activityResultLauncherForPickingADirectory.launch(null)
    }
    }
}`});var q=i(K,2);l(q,{children:(e,t)=>{var n=me();r(),o(e,n)},$$slots:{default:!0}});var J=i(q,2);s(J,{text:` fun CoroutineScope.pushUIEvent(type: Type) {
    this.launch {
        _androidUIEventChannel.send(type)
    }
}`});var Y=i(J,2);l(Y,{children:(e,n)=>{r(),o(e,t(`So I think we are clear on the usage of coroutines in KMP. Similarly, I have also used shared flows in some cases, like:`))},$$slots:{default:!0}});var X=i(Y,2);s(X,{text:`@Composable
actual fun PlatformSpecificBackHandler(init: () -> Unit) {
    val navController = LocalNavController.current
    val coroutineScope = rememberCoroutineScope()
    BackHandler(onBack = {
        if (navController.previousBackStackEntry == null) {
            coroutineScope.launch {
                UIEvent.pushUIEvent(UIEvent.Type.MinimizeTheApp)
            }
        }
    })
}`});var Z=i(X,2);l(Z,{children:(e,n)=>{r(),o(e,t(`Which is collected from the Android codebase to minimize the app.`))},$$slots:{default:!0}});var Q=i(Z,2);l(Q,{children:(e,n)=>{r(),o(e,t(`I’m sure there are other ways to implement all of this, but I did it like this, and all this remains solid handling in
my use cases.`))},$$slots:{default:!0}});var $=i(Q,4);l($,{children:(e,t)=>{r();var n=he();r(2),o(e,n)},$$slots:{default:!0}});var ye=i($,2);l(ye,{children:(e,t)=>{r();var n=ge();r(2),o(e,n)},$$slots:{default:!0}});var be=i(ye,2);te(n(be),{src:`/images/kmp-in-practice/kotlin-site-archive-capture-2014.png`}),e(be),o(a,u)}export{m as default,u as metadata};