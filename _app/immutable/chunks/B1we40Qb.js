import{F as e,I as ee,L as t,S as n,X as r,Z as te,x as i,y as a}from"./tUBdrsdG.js";import"./D1hYfEew.js";import"./GOykTMvN.js";import{c as o,o as ne,r as s,s as c}from"./BaMo009R.js";var l={title:`Kotlin Multiplatform, in practice`,description:`It Works, and It's Actually Good.`,pubDatetime:`Aug 03, 2025 07:30 PM IST`},{title:u,description:d,pubDatetime:f}=l,re=i(`<a href="https://kotlinlang.org/" rel="nofollow">kotlinlang.org</a> used to say <code>A modern programming language that makes developers happier</code> and
they did make one which I think is <em>the one</em> .`,1),ie=i(`Kotlin decouples the platform-specific implementations with <code>actual</code> and <code>expect</code> , which makes you directly deal with
the platform-specific stuff.`,1),ae=i(`<code>expect</code> is the <em>skeleton</em> while the actual implementation of it lies in the usage of <code>actual</code> across targeted
platforms.`,1),oe=i(`If the project is targeting Android and desktop, then the respective implementation for these platforms must be
implemented based on this <em>expected</em> block.`,1),se=i(`Now <code>pushSnackbar()</code> is an extension function which exists in the common codebase; the platform codebase cannot be
accessed from the common codebase, but vice versa is possible with KMP.`,1),ce=i(`I used to use Dagger Hilt for DI in <a href="https://github.com/LinkoraApp/Linkora" rel="nofollow">Linkora</a> , when the codebase targeted Android
only. Now that I have migrated to KMP, I have switched to manual DI, which I think is fairly simple and the usual way I
prefer for my projects now (AS IT SHOULD BE).`,1),le=i(`Live preview sucked with Jetpack Compose in the initial days of my usage, as you had to rebuild for every newly updated
preview; which later picked it up and got good,
but <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-hot-reload.html" rel="nofollow">Compose Hot Reload</a> works just
fine for me, far better than what it used to be with Compose which only targeted Android back then.`,1),ue=i(`Coroutines and Flows play a major role in KMP. Now, when I mentioned “major role”, I mean <em>major role</em> .`,1),de=i(`The <code>expect</code> and <code>actual</code> usage is required in some cases, and it may require another component to be included to
complete the operation, as the expected implementation is supposed to be an individual block and not included wherever
in the codebase.`,1),fe=i(`If you are using Compose, you would typically use <code>rememberLauncherForActivityResult</code> , which is <code>ManagedActivityResultLauncher</code> with a contract to pick the directory. Now, <code>rememberLauncherForActivityResult</code> is a
composable function; you cannot call it randomly in the codebase. It needs to be a composable function to call it,
similar to suspend functions.`,1),pe=i(`<code>pickADirectory</code> isn’t a composable; in this case, using flows or channels to make the composable pick the directory
makes sense, and on picking it, send the directory URI back, which we can collect from the implementation of <code>pickADirectory</code> , which targets the Android platform.`,1),me=i(`And from the <code>MainActivity</code> or anywhere you are reading the emissions, you collect the events and send them back via <code>PickedDirectory</code> .`,1),he=i(`<code>pushUIEvent</code> is an extension function that exists in the Android codebase:`,1),ge=i(`I think KMP is great at what it does with the existing tooling support. I didn’t ship to iOS yet, so I’m not sure how it
impacts anything, but I’m certainly sure that
the <a href="https://x.com/ChrisKruegerDev/status/1950493507212148883" rel="nofollow">size of the app is massive on iOS</a> , but it seems it will
only get better.`,1),_e=i(`We really came a long
way ( <a href="https://web.archive.org/web/20140802140223/https://kotlinlang.org/" rel="nofollow">Captured on Aug 02 2014</a> ).`,1),ve=i(`<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <hr/> <!> <!> <p><!></p>`,1);function p(i){var l=ve(),u=ee(l);s(u,{children:(e,ee)=>{var t=re();r(5),a(e,t)},$$slots:{default:!0}});var d=t(u,2);s(d,{children:(e,ee)=>{r(),a(e,n(`While I got to know about Kotlin from Android development, it has grown a lot since then. The first-party
library/frameworks/tools support from JetBrains and the Kotlin team, and the software related to development using
Kotlin, built and maintained by the community, made the language fun and interesting to work with, not specifically on
Android, but also in the backend.`))},$$slots:{default:!0}});var f=t(d,2);s(f,{children:(e,ee)=>{r(),a(e,n(`Now that there is an official language server, I hope it will continue to evolve further. I’m kinda biased towards
Kotlin for a couple of reasons. Irrespective of that, I think Kotlin is great at what it does.`))},$$slots:{default:!0}});var p=t(f,2);c(p,{level:1,children:(e,ee)=>{r(),a(e,n(`Multiplatform with Kotlin`))},$$slots:{default:!0}});var m=t(p,2);s(m,{children:(e,ee)=>{r();var t=ie();r(4),a(e,t)},$$slots:{default:!0}});var h=t(m,2);s(h,{children:(e,ee)=>{r(),a(e,n(`The core and common logic is separated from the respective platform stuff in a typical KMP project, so you end up
writing platform-specific stuff individually while the common code remains the same across the targeted platforms.`))},$$slots:{default:!0}});var g=t(h,2);s(g,{children:(e,ee)=>{var t=ae();r(5),a(e,t)},$$slots:{default:!0}});var _=t(g,2);o(_,{text:`expect suspend fun deleteAutoBackups(
    backupLocation: String,
    threshold: Int, onCompletion: (deletionCount: Int) -> Unit
)`});var v=t(_,2);s(v,{children:(e,ee)=>{r();var t=oe();r(2),a(e,t)},$$slots:{default:!0}});var y=t(v,2);s(y,{children:(e,ee)=>{r(),a(e,n(`Now on Android, the implementation for this may look like:`))},$$slots:{default:!0}});var b=t(y,2);o(b,{text:`actual suspend fun deleteAutoBackups(
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
}`});var ye=t(b,2);s(ye,{children:(e,ee)=>{r(),a(e,n(`But the same function’s implementation on a desktop target will look like:`))},$$slots:{default:!0}});var x=t(ye,2);o(x,{text:`actual suspend fun deleteAutoBackups(
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
}`});var S=t(x,2);s(S,{children:(e,ee)=>{r(),a(e,n(`The platform-specific APIs or implementations get involved with this expect/actual mechanism, which makes things
straightforward and pretty clear.`))},$$slots:{default:!0}});var C=t(S,2);s(C,{children:(e,ee)=>{r();var t=se();r(2),a(e,t)},$$slots:{default:!0}});var w=t(C,2);s(w,{children:(e,ee)=>{r(),a(e,n(`If you are dealing with composables or classes or an interface implementation on specific platforms or anything that is
platform-specific, this mechanism remains the same.`))},$$slots:{default:!0}});var T=t(w,2);s(T,{children:(e,ee)=>{r(),a(e,n(`I never tried other multiplatform frameworks/tools, but I think this is the simplest yet finest way to deal with
platform-level implementations, although most of the commonly used libraries like Coil, Ktor, koin, Room, and material
components (via Compose multiplatform) already support KMP, but there may be cases where you have to stick with
platform-level APIs, and I think KMP does it most finely.`))},$$slots:{default:!0}});var E=t(T,2);c(E,{level:2,children:(e,ee)=>{r(),a(e,n(`The Nitpicks`))},$$slots:{default:!0}});var D=t(E,2);s(D,{children:(e,ee)=>{r(),a(e,n(`Now the nitpick I have here has to do more with CMP than KMP: CMP is maintained by JetBrains, which is not on the latest
version regularly with respect to the upstream version, and some components like material expressive aren’t yet possible
to use directly in the common codebase, but again, this is just a nitpick.`))},$$slots:{default:!0}});var O=t(D,2);s(O,{children:(e,ee)=>{r(),a(e,n(`This has nothing to do with KMP, but you also need to know that yep, this sort of thing exists where you might end up
not using the library you used to use when on a single targeted codebase, so you end up writing your own thing in the
common codebase or with expect/actual blocks, which is fine, at least for me.`))},$$slots:{default:!0}});var k=t(O,2);s(k,{children:(e,ee)=>{r();var t=ce();r(2),a(e,t)},$$slots:{default:!0}});var A=t(k,2);s(A,{children:(e,ee)=>{r();var t=le();r(2),a(e,t)},$$slots:{default:!0}});var j=t(A,2);c(j,{level:1,children:(e,ee)=>{r(),a(e,n(`Coroutines and Flows in KMP`))},$$slots:{default:!0}});var M=t(j,2);s(M,{children:(e,ee)=>{r();var t=ue();r(2),a(e,t)},$$slots:{default:!0}});var N=t(M,2);s(N,{children:(e,ee)=>{r();var t=de();r(4),a(e,t)},$$slots:{default:!0}});var P=t(N,2);s(P,{children:(e,ee)=>{r(),a(e,n(`We need the “Event-driven” style to complete the operation; this is, of course, your typical asynchronous use case,
which Kotlin coroutines and flows do excellently in my usage.`))},$$slots:{default:!0}});var F=t(P,2);s(F,{children:(e,ee)=>{r(),a(e,n(`This function needs to use platform-specific APIs to pick a directory:`))},$$slots:{default:!0}});var I=t(F,2);o(I,{text:`expect suspend fun pickADirectory(): String?`});var L=t(I,2);s(L,{children:(e,ee)=>{r(),a(e,n(`Now, you would call this typically from a ViewModel or any other class; when dealing with the desktop target, this is
straightforward, you implement something like:`))},$$slots:{default:!0}});var R=t(L,2);o(R,{text:`actual suspend fun pickADirectory(): String? {
    val fileDialog = FileDialog(
        Frame(),
        Localization.Key.SelectASourceDir.getLocalizedString(),
        FileDialog.LOAD
    )
    fileDialog.isVisible = true
    val sourceDirectory = File(fileDialog.directory)
    // rest of the implementation
}`});var z=t(R,2);s(z,{children:(e,ee)=>{r(),a(e,n(`When targeting Android, the implementation will be based on Android-specific APIs.`))},$$slots:{default:!0}});var B=t(z,2);s(B,{children:(e,ee)=>{r();var t=fe();r(6),a(e,t)},$$slots:{default:!0}});var V=t(B,2);s(V,{children:(e,ee)=>{var t=pe();r(3),a(e,t)},$$slots:{default:!0}});var H=t(V,2);s(H,{children:(e,ee)=>{r(),a(e,n(`The implementation would look like:`))},$$slots:{default:!0}});var U=t(H,2);o(U,{text:`actual suspend fun pickADirectory(): String? {
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
}`});var W=t(U,2);s(W,{children:(e,ee)=>{r();var t=me();r(4),a(e,t)},$$slots:{default:!0}});var G=t(W,2);o(G,{text:`val activityResultLauncherForPickingADirectory =
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
}`});var K=t(G,2);s(K,{children:(e,ee)=>{var t=he();r(),a(e,t)},$$slots:{default:!0}});var q=t(K,2);o(q,{text:` fun CoroutineScope.pushUIEvent(type: Type) {
    this.launch {
        _androidUIEventChannel.send(type)
    }
}`});var J=t(q,2);s(J,{children:(e,ee)=>{r(),a(e,n(`So I think we are clear on the usage of coroutines in KMP. Similarly, I have also used shared flows in some cases, like:`))},$$slots:{default:!0}});var Y=t(J,2);o(Y,{text:`@Composable
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
}`});var X=t(Y,2);s(X,{children:(e,ee)=>{r(),a(e,n(`Which is collected from the Android codebase to minimize the app.`))},$$slots:{default:!0}});var Z=t(X,2);s(Z,{children:(e,ee)=>{r(),a(e,n(`I’m sure there are other ways to implement all of this, but I did it like this, and all this remains solid handling in
my use cases.`))},$$slots:{default:!0}});var Q=t(Z,4);s(Q,{children:(e,ee)=>{r();var t=ge();r(2),a(e,t)},$$slots:{default:!0}});var $=t(Q,2);s($,{children:(e,ee)=>{r();var t=_e();r(2),a(e,t)},$$slots:{default:!0}});var be=t($,2);ne(e(be),{src:`/images/kmp-in-practice/kotlin-site-archive-capture-2014.png`}),te(be),a(i,l)}export{p as default,l as metadata};