import{B as e,E as t,R as n,S as r,et as i,tt as ee,w as a,z as te}from"./BaBxQz38.js";import"./CFKVnMbq.js";import"./nhBD7O9y.js";import{t as o}from"./pVs-nwdz.js";import"./DmcKyMCn.js";import{c as s,i as c,s as ne}from"./8pNw77d1.js";var l={title:`Kotlin Multiplatform, in practice`,description:`Multiplatform is fun, at least with Kotlin.`,pubDatetime:`Aug 03, 2025 07:30 PM IST`,staticRes:`kmp-in-practice`},{title:u,description:d,pubDatetime:f,staticRes:p}=l,re=a(`<a href="https://kotlinlang.org/" rel="nofollow">kotlinlang.org</a> used to say <code>A modern programming language that makes developers happier</code> and
they did make one which I think is <em>the one</em> .`,1),ie=a(`Kotlin decouples the platform-specific implementations with <code>actual</code> and <code>expect</code> , which makes you directly deal with
the platform-specific stuff.`,1),ae=a(`<code>expect</code> is the <em>skeleton</em> while the actual implementation of it lies in the usage of <code>actual</code> across targeted
platforms.`,1),oe=a(`If the project is targeting Android and desktop, then the respective implementation for these platforms must be
implemented based on this <em>expected</em> block.`,1),se=a(`Now <code>pushSnackbar()</code> is an extension function which exists in the common codebase; the platform codebase cannot be
accessed from the common codebase, but vice versa is possible with KMP.`,1),ce=a(`I used to use Dagger Hilt for DI in <a href="https://github.com/LinkoraApp/Linkora" rel="nofollow">Linkora</a> , when the codebase targeted Android
only. Now that I have migrated to KMP, I have switched to manual DI, which I think is fairly simple and the usual way I
prefer for my projects now (AS IT SHOULD BE).`,1),le=a(`Live preview sucked with Jetpack Compose in the initial days of my usage, as you had to rebuild for every newly updated
preview; which later picked it up and got good,
but <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-hot-reload.html" rel="nofollow">Compose Hot Reload</a> works just
fine for me, far better than what it used to be with Compose which only targeted Android back then.`,1),ue=a(`Coroutines and Flows play a major role in KMP. Now, when I mentioned “major role”, I mean <em>major role</em> .`,1),de=a(`The <code>expect</code> and <code>actual</code> usage is required in some cases, and it may require another component to be included to
complete the operation, as the expected implementation is supposed to be an individual block and not included wherever
in the codebase.`,1),fe=a(`If you are using Compose, you would typically use <code>rememberLauncherForActivityResult</code> , which is <code>ManagedActivityResultLauncher</code> with a contract to pick the directory. Now, <code>rememberLauncherForActivityResult</code> is a
composable function; you cannot call it randomly in the codebase. It needs to be a composable function to call it,
similar to suspend functions.`,1),pe=a(`<code>pickADirectory</code> isn’t a composable; in this case, using flows or channels to make the composable pick the directory
makes sense, and on picking it, send the directory URI back, which we can collect from the implementation of <code>pickADirectory</code> , which targets the Android platform.`,1),me=a(`And from the <code>MainActivity</code> or anywhere you are reading the emissions, you collect the events and send them back via <code>PickedDirectory</code> .`,1),he=a(`<code>pushUIEvent</code> is an extension function that exists in the Android codebase:`,1),ge=a(`I think KMP is great at what it does with the existing tooling support. I didn’t ship to iOS yet, so I’m not sure how it
impacts anything, but I’m certainly sure that
the <a href="https://x.com/ChrisKruegerDev/status/1950493507212148883" rel="nofollow">size of the app is massive on iOS</a> , but it seems it will
only get better.`,1),_e=a(`We really came a long
way ( <a href="https://web.archive.org/web/20140802140223/https://kotlinlang.org/" rel="nofollow">Captured on Aug 02 2014</a> ).`,1),ve=a(`<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <hr/> <!> <!> <p><!></p>`,1);function m(a){var l=ve(),u=te(l);c(u,{children:(e,t)=>{var n=re();i(5),r(e,n)},$$slots:{default:!0}});var d=e(u,2);c(d,{children:(e,n)=>{i(),r(e,t(`While I got to know about Kotlin from Android development, it has grown a lot since then. The first-party
library/frameworks/tools support from JetBrains and the Kotlin team, and the software related to development using
Kotlin, built and maintained by the community, made the language fun and interesting to work with, not specifically on
Android, but also in the backend.`))},$$slots:{default:!0}});var f=e(d,2);c(f,{children:(e,n)=>{i(),r(e,t(`Now that there is an official language server, I hope it will continue to evolve further. I’m kinda biased towards
Kotlin for a couple of reasons. Irrespective of that, I think Kotlin is great at what it does.`))},$$slots:{default:!0}});var p=e(f,2);s(p,{level:1,children:(e,n)=>{i(),r(e,t(`Multiplatform with Kotlin`))},$$slots:{default:!0}});var m=e(p,2);c(m,{children:(e,t)=>{i();var n=ie();i(4),r(e,n)},$$slots:{default:!0}});var h=e(m,2);c(h,{children:(e,n)=>{i(),r(e,t(`The core and common logic is separated from the respective platform stuff in a typical KMP project, so you end up
writing platform-specific stuff individually while the common code remains the same across the targeted platforms.`))},$$slots:{default:!0}});var g=e(h,2);c(g,{children:(e,t)=>{var n=ae();i(5),r(e,n)},$$slots:{default:!0}});var _=e(g,2);o(_,{text:`expect suspend fun deleteAutoBackups(
    backupLocation: String,
    threshold: Int, onCompletion: (deletionCount: Int) -> Unit
)`});var v=e(_,2);c(v,{children:(e,t)=>{i();var n=oe();i(2),r(e,n)},$$slots:{default:!0}});var y=e(v,2);c(y,{children:(e,n)=>{i(),r(e,t(`Now on Android, the implementation for this may look like:`))},$$slots:{default:!0}});var b=e(y,2);o(b,{text:`actual suspend fun deleteAutoBackups(
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
}`});var ye=e(b,2);c(ye,{children:(e,n)=>{i(),r(e,t(`But the same function’s implementation on a desktop target will look like:`))},$$slots:{default:!0}});var x=e(ye,2);o(x,{text:`actual suspend fun deleteAutoBackups(
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
}`});var S=e(x,2);c(S,{children:(e,n)=>{i(),r(e,t(`The platform-specific APIs or implementations get involved with this expect/actual mechanism, which makes things
straightforward and pretty clear.`))},$$slots:{default:!0}});var C=e(S,2);c(C,{children:(e,t)=>{i();var n=se();i(2),r(e,n)},$$slots:{default:!0}});var w=e(C,2);c(w,{children:(e,n)=>{i(),r(e,t(`If you are dealing with composables or classes or an interface implementation on specific platforms or anything that is
platform-specific, this mechanism remains the same.`))},$$slots:{default:!0}});var T=e(w,2);c(T,{children:(e,n)=>{i(),r(e,t(`I never tried other multiplatform frameworks/tools, but I think this is the simplest yet finest way to deal with
platform-level implementations, although most of the commonly used libraries like Coil, Ktor, koin, Room, and material
components (via Compose multiplatform) already support KMP, but there may be cases where you have to stick with
platform-level APIs, and I think KMP does it most finely.`))},$$slots:{default:!0}});var E=e(T,2);s(E,{level:2,children:(e,n)=>{i(),r(e,t(`The Nitpicks`))},$$slots:{default:!0}});var D=e(E,2);c(D,{children:(e,n)=>{i(),r(e,t(`Now the nitpick I have here has to do more with CMP than KMP: CMP is maintained by JetBrains, which is not on the latest
version regularly with respect to the upstream version, and some components like material expressive aren’t yet possible
to use directly in the common codebase, but again, this is just a nitpick.`))},$$slots:{default:!0}});var O=e(D,2);c(O,{children:(e,n)=>{i(),r(e,t(`This has nothing to do with KMP, but you also need to know that yep, this sort of thing exists where you might end up
not using the library you used to use when on a single targeted codebase, so you end up writing your own thing in the
common codebase or with expect/actual blocks, which is fine, at least for me.`))},$$slots:{default:!0}});var k=e(O,2);c(k,{children:(e,t)=>{i();var n=ce();i(2),r(e,n)},$$slots:{default:!0}});var A=e(k,2);c(A,{children:(e,t)=>{i();var n=le();i(2),r(e,n)},$$slots:{default:!0}});var j=e(A,2);s(j,{level:1,children:(e,n)=>{i(),r(e,t(`Coroutines and Flows in KMP`))},$$slots:{default:!0}});var M=e(j,2);c(M,{children:(e,t)=>{i();var n=ue();i(2),r(e,n)},$$slots:{default:!0}});var N=e(M,2);c(N,{children:(e,t)=>{i();var n=de();i(4),r(e,n)},$$slots:{default:!0}});var P=e(N,2);c(P,{children:(e,n)=>{i(),r(e,t(`We need the “Event-driven” style to complete the operation; this is, of course, your typical asynchronous use case,
which Kotlin coroutines and flows do excellently in my usage.`))},$$slots:{default:!0}});var F=e(P,2);c(F,{children:(e,n)=>{i(),r(e,t(`This function needs to use platform-specific APIs to pick a directory:`))},$$slots:{default:!0}});var I=e(F,2);o(I,{text:`expect suspend fun pickADirectory(): String?`});var L=e(I,2);c(L,{children:(e,n)=>{i(),r(e,t(`Now, you would call this typically from a ViewModel or any other class; when dealing with the desktop target, this is
straightforward, you implement something like:`))},$$slots:{default:!0}});var R=e(L,2);o(R,{text:`actual suspend fun pickADirectory(): String? {
    val fileDialog = FileDialog(
        Frame(),
        Localization.Key.SelectASourceDir.getLocalizedString(),
        FileDialog.LOAD
    )
    fileDialog.isVisible = true
    val sourceDirectory = File(fileDialog.directory)
    // rest of the implementation
}`});var z=e(R,2);c(z,{children:(e,n)=>{i(),r(e,t(`When targeting Android, the implementation will be based on Android-specific APIs.`))},$$slots:{default:!0}});var B=e(z,2);c(B,{children:(e,t)=>{i();var n=fe();i(6),r(e,n)},$$slots:{default:!0}});var V=e(B,2);c(V,{children:(e,t)=>{var n=pe();i(3),r(e,n)},$$slots:{default:!0}});var H=e(V,2);c(H,{children:(e,n)=>{i(),r(e,t(`The implementation would look like:`))},$$slots:{default:!0}});var U=e(H,2);o(U,{text:`actual suspend fun pickADirectory(): String? {
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
}`});var W=e(U,2);c(W,{children:(e,t)=>{i();var n=me();i(4),r(e,n)},$$slots:{default:!0}});var G=e(W,2);o(G,{text:`val activityResultLauncherForPickingADirectory =
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
}`});var K=e(G,2);c(K,{children:(e,t)=>{var n=he();i(),r(e,n)},$$slots:{default:!0}});var q=e(K,2);o(q,{text:` fun CoroutineScope.pushUIEvent(type: Type) {
    this.launch {
        _androidUIEventChannel.send(type)
    }
}`});var J=e(q,2);c(J,{children:(e,n)=>{i(),r(e,t(`So I think we are clear on the usage of coroutines in KMP. Similarly, I have also used shared flows in some cases, like:`))},$$slots:{default:!0}});var Y=e(J,2);o(Y,{text:`@Composable
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
}`});var X=e(Y,2);c(X,{children:(e,n)=>{i(),r(e,t(`Which is collected from the Android codebase to minimize the app.`))},$$slots:{default:!0}});var Z=e(X,2);c(Z,{children:(e,n)=>{i(),r(e,t(`I’m sure there are other ways to implement all of this, but I did it like this, and all this remains solid handling in
my use cases.`))},$$slots:{default:!0}});var Q=e(Z,4);c(Q,{children:(e,t)=>{i();var n=ge();i(2),r(e,n)},$$slots:{default:!0}});var $=e(Q,2);c($,{children:(e,t)=>{i();var n=_e();i(2),r(e,n)},$$slots:{default:!0}});var be=e($,2);ne(n(be),{src:`/images/kmp-in-practice/kotlin-site-archive-capture-2014.png`}),ee(be),r(a,l)}export{m as default,l as metadata};