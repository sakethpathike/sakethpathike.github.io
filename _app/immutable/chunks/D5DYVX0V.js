import{B as e,R as ee,S as t,T as n,et as r,tt as te,w as i,z as ne}from"./CXOUEYH_.js";import"./CFKVnMbq.js";import"./DCKuasBZ.js";import{t as a}from"./B2HDiynK.js";import"./N-6q-Igo.js";import{o as re,r as o,s}from"./D6jt0f-j.js";var c={title:`Kotlin Multiplatform, in practice`,description:`Multiplatform is fun, at least with Kotlin.`,pubDatetime:`Aug 03, 2025 07:30 PM IST`},{title:l,description:u,pubDatetime:d}=c,ie=i(`<a href="https://kotlinlang.org/" rel="nofollow">kotlinlang.org</a> used to say <code>A modern programming language that makes developers happier</code> and
they did make one which I think is <em>the one</em> .`,1),ae=i(`Kotlin decouples the platform-specific implementations with <code>actual</code> and <code>expect</code> , which makes you directly deal with
the platform-specific stuff.`,1),oe=i(`<code>expect</code> is the <em>skeleton</em> while the actual implementation of it lies in the usage of <code>actual</code> across targeted
platforms.`,1),se=i(`If the project is targeting Android and desktop, then the respective implementation for these platforms must be
implemented based on this <em>expected</em> block.`,1),ce=i(`Now <code>pushSnackbar()</code> is an extension function which exists in the common codebase; the platform codebase cannot be
accessed from the common codebase, but vice versa is possible with KMP.`,1),le=i(`I used to use Dagger Hilt for DI in <a href="https://github.com/LinkoraApp/Linkora" rel="nofollow">Linkora</a> , when the codebase targeted Android
only. Now that I have migrated to KMP, I have switched to manual DI, which I think is fairly simple and the usual way I
prefer for my projects now (AS IT SHOULD BE).`,1),ue=i(`Live preview sucked with Jetpack Compose in the initial days of my usage, as you had to rebuild for every newly updated
preview; which later picked it up and got good,
but <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-hot-reload.html" rel="nofollow">Compose Hot Reload</a> works just
fine for me, far better than what it used to be with Compose which only targeted Android back then.`,1),de=i(`Coroutines and Flows play a major role in KMP. Now, when I mentioned “major role”, I mean <em>major role</em> .`,1),fe=i(`The <code>expect</code> and <code>actual</code> usage is required in some cases, and it may require another component to be included to
complete the operation, as the expected implementation is supposed to be an individual block and not included wherever
in the codebase.`,1),pe=i(`If you are using Compose, you would typically use <code>rememberLauncherForActivityResult</code> , which is <code>ManagedActivityResultLauncher</code> with a contract to pick the directory. Now, <code>rememberLauncherForActivityResult</code> is a
composable function; you cannot call it randomly in the codebase. It needs to be a composable function to call it,
similar to suspend functions.`,1),me=i(`<code>pickADirectory</code> isn’t a composable; in this case, using flows or channels to make the composable pick the directory
makes sense, and on picking it, send the directory URI back, which we can collect from the implementation of <code>pickADirectory</code> , which targets the Android platform.`,1),he=i(`And from the <code>MainActivity</code> or anywhere you are reading the emissions, you collect the events and send them back via <code>PickedDirectory</code> .`,1),ge=i(`<code>pushUIEvent</code> is an extension function that exists in the Android codebase:`,1),_e=i(`I think KMP is great at what it does with the existing tooling support. I didn’t ship to iOS yet, so I’m not sure how it
impacts anything, but I’m certainly sure that
the <a href="https://x.com/ChrisKruegerDev/status/1950493507212148883" rel="nofollow">size of the app is massive on iOS</a> , but it seems it will
only get better.`,1),ve=i(`We really came a long
way ( <a href="https://web.archive.org/web/20140802140223/https://kotlinlang.org/" rel="nofollow">Captured on Aug 02 2014</a> ).`,1),ye=i(`<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <hr/> <!> <!> <p><!></p>`,1);function f(i){var c=ye(),l=ne(c);o(l,{children:(e,ee)=>{var n=ie();r(5),t(e,n)},$$slots:{default:!0}});var u=e(l,2);o(u,{children:(e,ee)=>{r(),t(e,n(`While I got to know about Kotlin from Android development, it has grown a lot since then. The first-party
library/frameworks/tools support from JetBrains and the Kotlin team, and the software related to development using
Kotlin, built and maintained by the community, made the language fun and interesting to work with, not specifically on
Android, but also in the backend.`))},$$slots:{default:!0}});var d=e(u,2);o(d,{children:(e,ee)=>{r(),t(e,n(`Now that there is an official language server, I hope it will continue to evolve further. I’m kinda biased towards
Kotlin for a couple of reasons. Irrespective of that, I think Kotlin is great at what it does.`))},$$slots:{default:!0}});var f=e(d,2);s(f,{level:1,children:(e,ee)=>{r(),t(e,n(`Multiplatform with Kotlin`))},$$slots:{default:!0}});var p=e(f,2);o(p,{children:(e,ee)=>{r();var n=ae();r(4),t(e,n)},$$slots:{default:!0}});var m=e(p,2);o(m,{children:(e,ee)=>{r(),t(e,n(`The core and common logic is separated from the respective platform stuff in a typical KMP project, so you end up
writing platform-specific stuff individually while the common code remains the same across the targeted platforms.`))},$$slots:{default:!0}});var h=e(m,2);o(h,{children:(e,ee)=>{var n=oe();r(5),t(e,n)},$$slots:{default:!0}});var g=e(h,2);a(g,{text:`expect suspend fun deleteAutoBackups(
    backupLocation: String,
    threshold: Int, onCompletion: (deletionCount: Int) -> Unit
)`});var _=e(g,2);o(_,{children:(e,ee)=>{r();var n=se();r(2),t(e,n)},$$slots:{default:!0}});var v=e(_,2);o(v,{children:(e,ee)=>{r(),t(e,n(`Now on Android, the implementation for this may look like:`))},$$slots:{default:!0}});var y=e(v,2);a(y,{text:`actual suspend fun deleteAutoBackups(
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
}`});var b=e(y,2);o(b,{children:(e,ee)=>{r(),t(e,n(`But the same function’s implementation on a desktop target will look like:`))},$$slots:{default:!0}});var x=e(b,2);a(x,{text:`actual suspend fun deleteAutoBackups(
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
}`});var S=e(x,2);o(S,{children:(e,ee)=>{r(),t(e,n(`The platform-specific APIs or implementations get involved with this expect/actual mechanism, which makes things
straightforward and pretty clear.`))},$$slots:{default:!0}});var C=e(S,2);o(C,{children:(e,ee)=>{r();var n=ce();r(2),t(e,n)},$$slots:{default:!0}});var w=e(C,2);o(w,{children:(e,ee)=>{r(),t(e,n(`If you are dealing with composables or classes or an interface implementation on specific platforms or anything that is
platform-specific, this mechanism remains the same.`))},$$slots:{default:!0}});var T=e(w,2);o(T,{children:(e,ee)=>{r(),t(e,n(`I never tried other multiplatform frameworks/tools, but I think this is the simplest yet finest way to deal with
platform-level implementations, although most of the commonly used libraries like Coil, Ktor, koin, Room, and material
components (via Compose multiplatform) already support KMP, but there may be cases where you have to stick with
platform-level APIs, and I think KMP does it most finely.`))},$$slots:{default:!0}});var E=e(T,2);s(E,{level:2,children:(e,ee)=>{r(),t(e,n(`The Nitpicks`))},$$slots:{default:!0}});var be=e(E,2);o(be,{children:(e,ee)=>{r(),t(e,n(`Now the nitpick I have here has to do more with CMP than KMP: CMP is maintained by JetBrains, which is not on the latest
version regularly with respect to the upstream version, and some components like material expressive aren’t yet possible
to use directly in the common codebase, but again, this is just a nitpick.`))},$$slots:{default:!0}});var D=e(be,2);o(D,{children:(e,ee)=>{r(),t(e,n(`This has nothing to do with KMP, but you also need to know that yep, this sort of thing exists where you might end up
not using the library you used to use when on a single targeted codebase, so you end up writing your own thing in the
common codebase or with expect/actual blocks, which is fine, at least for me.`))},$$slots:{default:!0}});var O=e(D,2);o(O,{children:(e,ee)=>{r();var n=le();r(2),t(e,n)},$$slots:{default:!0}});var k=e(O,2);o(k,{children:(e,ee)=>{r();var n=ue();r(2),t(e,n)},$$slots:{default:!0}});var A=e(k,2);s(A,{level:1,children:(e,ee)=>{r(),t(e,n(`Coroutines and Flows in KMP`))},$$slots:{default:!0}});var j=e(A,2);o(j,{children:(e,ee)=>{r();var n=de();r(2),t(e,n)},$$slots:{default:!0}});var M=e(j,2);o(M,{children:(e,ee)=>{r();var n=fe();r(4),t(e,n)},$$slots:{default:!0}});var N=e(M,2);o(N,{children:(e,ee)=>{r(),t(e,n(`We need the “Event-driven” style to complete the operation; this is, of course, your typical asynchronous use case,
which Kotlin coroutines and flows do excellently in my usage.`))},$$slots:{default:!0}});var P=e(N,2);o(P,{children:(e,ee)=>{r(),t(e,n(`This function needs to use platform-specific APIs to pick a directory:`))},$$slots:{default:!0}});var F=e(P,2);a(F,{text:`expect suspend fun pickADirectory(): String?`});var I=e(F,2);o(I,{children:(e,ee)=>{r(),t(e,n(`Now, you would call this typically from a ViewModel or any other class; when dealing with the desktop target, this is
straightforward, you implement something like:`))},$$slots:{default:!0}});var L=e(I,2);a(L,{text:`actual suspend fun pickADirectory(): String? {
    val fileDialog = FileDialog(
        Frame(),
        Localization.Key.SelectASourceDir.getLocalizedString(),
        FileDialog.LOAD
    )
    fileDialog.isVisible = true
    val sourceDirectory = File(fileDialog.directory)
    // rest of the implementation
}`});var R=e(L,2);o(R,{children:(e,ee)=>{r(),t(e,n(`When targeting Android, the implementation will be based on Android-specific APIs.`))},$$slots:{default:!0}});var z=e(R,2);o(z,{children:(e,ee)=>{r();var n=pe();r(6),t(e,n)},$$slots:{default:!0}});var B=e(z,2);o(B,{children:(e,ee)=>{var n=me();r(3),t(e,n)},$$slots:{default:!0}});var V=e(B,2);o(V,{children:(e,ee)=>{r(),t(e,n(`The implementation would look like:`))},$$slots:{default:!0}});var H=e(V,2);a(H,{text:`actual suspend fun pickADirectory(): String? {
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
}`});var U=e(H,2);o(U,{children:(e,ee)=>{r();var n=he();r(4),t(e,n)},$$slots:{default:!0}});var W=e(U,2);a(W,{text:`val activityResultLauncherForPickingADirectory =
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
}`});var G=e(W,2);o(G,{children:(e,ee)=>{var n=ge();r(),t(e,n)},$$slots:{default:!0}});var K=e(G,2);a(K,{text:` fun CoroutineScope.pushUIEvent(type: Type) {
    this.launch {
        _androidUIEventChannel.send(type)
    }
}`});var q=e(K,2);o(q,{children:(e,ee)=>{r(),t(e,n(`So I think we are clear on the usage of coroutines in KMP. Similarly, I have also used shared flows in some cases, like:`))},$$slots:{default:!0}});var J=e(q,2);a(J,{text:`@Composable
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
}`});var Y=e(J,2);o(Y,{children:(e,ee)=>{r(),t(e,n(`Which is collected from the Android codebase to minimize the app.`))},$$slots:{default:!0}});var X=e(Y,2);o(X,{children:(e,ee)=>{r(),t(e,n(`I’m sure there are other ways to implement all of this, but I did it like this, and all this remains solid handling in
my use cases.`))},$$slots:{default:!0}});var Z=e(X,4);o(Z,{children:(e,ee)=>{r();var n=_e();r(2),t(e,n)},$$slots:{default:!0}});var Q=e(Z,2);o(Q,{children:(e,ee)=>{r();var n=ve();r(2),t(e,n)},$$slots:{default:!0}});var $=e(Q,2);re(ee($),{src:`/images/kmp-in-practice/kotlin-site-archive-capture-2014.png`}),te($),t(i,c)}export{f as default,c as metadata};