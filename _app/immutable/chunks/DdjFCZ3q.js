import{C as e,D as t,H as n,T as r,U as i,V as ee,it as te,rt as a}from"./BZpmPeOn.js";import"./D1hYfEew.js";import"./CsQX8471.js";import{t as o}from"./DsZaJxEG.js";import{a as s,c as ne,l as c}from"./Dt5Jn2kq.js";var l={title:`Kotlin Multiplatform, in practice`,description:`Multiplatform is fun, at least with Kotlin.`,pubDatetime:`Aug 03, 2025 07:30 PM IST`,staticRes:`kmp-in-practice`},{title:u,description:d,pubDatetime:f,staticRes:p}=l,re=r(`<a href="https://kotlinlang.org/" rel="nofollow">kotlinlang.org</a> used to say <code>A modern programming language that makes developers happier</code> and
they did make one which I think is <em>the one</em> .`,1),ie=r(`Kotlin decouples the platform-specific implementations with <code>actual</code> and <code>expect</code> , which makes you directly deal with
the platform-specific stuff.`,1),ae=r(`<code>expect</code> is the <em>skeleton</em> while the actual implementation of it lies in the usage of <code>actual</code> across targeted
platforms.`,1),oe=r(`If the project is targeting Android and desktop, then the respective implementation for these platforms must be
implemented based on this <em>expected</em> block.`,1),se=r(`Now <code>pushSnackbar()</code> is an extension function which exists in the common codebase; the platform codebase cannot be
accessed from the common codebase, but vice versa is possible with KMP.`,1),ce=r(`I used to use Dagger Hilt for DI in <a href="https://github.com/LinkoraApp/Linkora" rel="nofollow">Linkora</a> , when the codebase targeted Android
only. Now that I have migrated to KMP, I have switched to manual DI, which I think is fairly simple and the usual way I
prefer for my projects now (AS IT SHOULD BE).`,1),le=r(`Live preview sucked with Jetpack Compose in the initial days of my usage, as you had to rebuild for every newly updated
preview; which later picked it up and got good,
but <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-hot-reload.html" rel="nofollow">Compose Hot Reload</a> works just
fine for me, far better than what it used to be with Compose which only targeted Android back then.`,1),ue=r(`Coroutines and Flows play a major role in KMP. Now, when I mentioned “major role”, I mean <em>major role</em> .`,1),de=r(`The <code>expect</code> and <code>actual</code> usage is required in some cases, and it may require another component to be included to
complete the operation, as the expected implementation is supposed to be an individual block and not included wherever
in the codebase.`,1),fe=r(`If you are using Compose, you would typically use <code>rememberLauncherForActivityResult</code> , which is <code>ManagedActivityResultLauncher</code> with a contract to pick the directory. Now, <code>rememberLauncherForActivityResult</code> is a
composable function; you cannot call it randomly in the codebase. It needs to be a composable function to call it,
similar to suspend functions.`,1),pe=r(`<code>pickADirectory</code> isn’t a composable; in this case, using flows or channels to make the composable pick the directory
makes sense, and on picking it, send the directory URI back, which we can collect from the implementation of <code>pickADirectory</code> , which targets the Android platform.`,1),me=r(`And from the <code>MainActivity</code> or anywhere you are reading the emissions, you collect the events and send them back via <code>PickedDirectory</code> .`,1),he=r(`<code>pushUIEvent</code> is an extension function that exists in the Android codebase:`,1),ge=r(`I think KMP is great at what it does with the existing tooling support. I didn’t ship to iOS yet, so I’m not sure how it
impacts anything, but I’m certainly sure that
the <a href="https://x.com/ChrisKruegerDev/status/1950493507212148883" rel="nofollow">size of the app is massive on iOS</a> , but it seems it will
only get better.`,1),_e=r(`We really came a long
way ( <a href="https://web.archive.org/web/20140802140223/https://kotlinlang.org/" rel="nofollow">Captured on Aug 02 2014</a> ).`,1),ve=r(`<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <hr/> <!> <!> <p><!></p>`,1);function m(r){var l=ve(),u=n(l);s(u,{children:(t,n)=>{var r=re();a(5),e(t,r)},$$slots:{default:!0}});var d=i(u,2);s(d,{children:(n,r)=>{a(),e(n,t(`While I got to know about Kotlin from Android development, it has grown a lot since then. The first-party
library/frameworks/tools support from JetBrains and the Kotlin team, and the software related to development using
Kotlin, built and maintained by the community, made the language fun and interesting to work with, not specifically on
Android, but also in the backend.`))},$$slots:{default:!0}});var f=i(d,2);s(f,{children:(n,r)=>{a(),e(n,t(`Now that there is an official language server, I hope it will continue to evolve further. I’m kinda biased towards
Kotlin for a couple of reasons. Irrespective of that, I think Kotlin is great at what it does.`))},$$slots:{default:!0}});var p=i(f,2);c(p,{level:1,children:(n,r)=>{a(),e(n,t(`Multiplatform with Kotlin`))},$$slots:{default:!0}});var m=i(p,2);s(m,{children:(t,n)=>{a();var r=ie();a(4),e(t,r)},$$slots:{default:!0}});var h=i(m,2);s(h,{children:(n,r)=>{a(),e(n,t(`The core and common logic is separated from the respective platform stuff in a typical KMP project, so you end up
writing platform-specific stuff individually while the common code remains the same across the targeted platforms.`))},$$slots:{default:!0}});var g=i(h,2);s(g,{children:(t,n)=>{var r=ae();a(5),e(t,r)},$$slots:{default:!0}});var _=i(g,2);o(_,{text:`expect suspend fun deleteAutoBackups(
    backupLocation: String,
    threshold: Int, onCompletion: (deletionCount: Int) -> Unit
)`});var v=i(_,2);s(v,{children:(t,n)=>{a();var r=oe();a(2),e(t,r)},$$slots:{default:!0}});var y=i(v,2);s(y,{children:(n,r)=>{a(),e(n,t(`Now on Android, the implementation for this may look like:`))},$$slots:{default:!0}});var b=i(y,2);o(b,{text:`actual suspend fun deleteAutoBackups(
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
}`});var ye=i(b,2);s(ye,{children:(n,r)=>{a(),e(n,t(`But the same function’s implementation on a desktop target will look like:`))},$$slots:{default:!0}});var x=i(ye,2);o(x,{text:`actual suspend fun deleteAutoBackups(
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
}`});var S=i(x,2);s(S,{children:(n,r)=>{a(),e(n,t(`The platform-specific APIs or implementations get involved with this expect/actual mechanism, which makes things
straightforward and pretty clear.`))},$$slots:{default:!0}});var C=i(S,2);s(C,{children:(t,n)=>{a();var r=se();a(2),e(t,r)},$$slots:{default:!0}});var w=i(C,2);s(w,{children:(n,r)=>{a(),e(n,t(`If you are dealing with composables or classes or an interface implementation on specific platforms or anything that is
platform-specific, this mechanism remains the same.`))},$$slots:{default:!0}});var T=i(w,2);s(T,{children:(n,r)=>{a(),e(n,t(`I never tried other multiplatform frameworks/tools, but I think this is the simplest yet finest way to deal with
platform-level implementations, although most of the commonly used libraries like Coil, Ktor, koin, Room, and material
components (via Compose multiplatform) already support KMP, but there may be cases where you have to stick with
platform-level APIs, and I think KMP does it most finely.`))},$$slots:{default:!0}});var E=i(T,2);c(E,{level:2,children:(n,r)=>{a(),e(n,t(`The Nitpicks`))},$$slots:{default:!0}});var D=i(E,2);s(D,{children:(n,r)=>{a(),e(n,t(`Now the nitpick I have here has to do more with CMP than KMP: CMP is maintained by JetBrains, which is not on the latest
version regularly with respect to the upstream version, and some components like material expressive aren’t yet possible
to use directly in the common codebase, but again, this is just a nitpick.`))},$$slots:{default:!0}});var O=i(D,2);s(O,{children:(n,r)=>{a(),e(n,t(`This has nothing to do with KMP, but you also need to know that yep, this sort of thing exists where you might end up
not using the library you used to use when on a single targeted codebase, so you end up writing your own thing in the
common codebase or with expect/actual blocks, which is fine, at least for me.`))},$$slots:{default:!0}});var k=i(O,2);s(k,{children:(t,n)=>{a();var r=ce();a(2),e(t,r)},$$slots:{default:!0}});var A=i(k,2);s(A,{children:(t,n)=>{a();var r=le();a(2),e(t,r)},$$slots:{default:!0}});var j=i(A,2);c(j,{level:1,children:(n,r)=>{a(),e(n,t(`Coroutines and Flows in KMP`))},$$slots:{default:!0}});var M=i(j,2);s(M,{children:(t,n)=>{a();var r=ue();a(2),e(t,r)},$$slots:{default:!0}});var N=i(M,2);s(N,{children:(t,n)=>{a();var r=de();a(4),e(t,r)},$$slots:{default:!0}});var P=i(N,2);s(P,{children:(n,r)=>{a(),e(n,t(`We need the “Event-driven” style to complete the operation; this is, of course, your typical asynchronous use case,
which Kotlin coroutines and flows do excellently in my usage.`))},$$slots:{default:!0}});var F=i(P,2);s(F,{children:(n,r)=>{a(),e(n,t(`This function needs to use platform-specific APIs to pick a directory:`))},$$slots:{default:!0}});var I=i(F,2);o(I,{text:`expect suspend fun pickADirectory(): String?`});var L=i(I,2);s(L,{children:(n,r)=>{a(),e(n,t(`Now, you would call this typically from a ViewModel or any other class; when dealing with the desktop target, this is
straightforward, you implement something like:`))},$$slots:{default:!0}});var R=i(L,2);o(R,{text:`actual suspend fun pickADirectory(): String? {
    val fileDialog = FileDialog(
        Frame(),
        Localization.Key.SelectASourceDir.getLocalizedString(),
        FileDialog.LOAD
    )
    fileDialog.isVisible = true
    val sourceDirectory = File(fileDialog.directory)
    // rest of the implementation
}`});var z=i(R,2);s(z,{children:(n,r)=>{a(),e(n,t(`When targeting Android, the implementation will be based on Android-specific APIs.`))},$$slots:{default:!0}});var B=i(z,2);s(B,{children:(t,n)=>{a();var r=fe();a(6),e(t,r)},$$slots:{default:!0}});var V=i(B,2);s(V,{children:(t,n)=>{var r=pe();a(3),e(t,r)},$$slots:{default:!0}});var H=i(V,2);s(H,{children:(n,r)=>{a(),e(n,t(`The implementation would look like:`))},$$slots:{default:!0}});var U=i(H,2);o(U,{text:`actual suspend fun pickADirectory(): String? {
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
}`});var W=i(U,2);s(W,{children:(t,n)=>{a();var r=me();a(4),e(t,r)},$$slots:{default:!0}});var G=i(W,2);o(G,{text:`val activityResultLauncherForPickingADirectory =
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
}`});var K=i(G,2);s(K,{children:(t,n)=>{var r=he();a(),e(t,r)},$$slots:{default:!0}});var q=i(K,2);o(q,{text:` fun CoroutineScope.pushUIEvent(type: Type) {
    this.launch {
        _androidUIEventChannel.send(type)
    }
}`});var J=i(q,2);s(J,{children:(n,r)=>{a(),e(n,t(`So I think we are clear on the usage of coroutines in KMP. Similarly, I have also used shared flows in some cases, like:`))},$$slots:{default:!0}});var Y=i(J,2);o(Y,{text:`@Composable
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
}`});var X=i(Y,2);s(X,{children:(n,r)=>{a(),e(n,t(`Which is collected from the Android codebase to minimize the app.`))},$$slots:{default:!0}});var Z=i(X,2);s(Z,{children:(n,r)=>{a(),e(n,t(`I’m sure there are other ways to implement all of this, but I did it like this, and all this remains solid handling in
my use cases.`))},$$slots:{default:!0}});var Q=i(Z,4);s(Q,{children:(t,n)=>{a();var r=ge();a(2),e(t,r)},$$slots:{default:!0}});var $=i(Q,2);s($,{children:(t,n)=>{a();var r=_e();a(2),e(t,r)},$$slots:{default:!0}});var be=i($,2);ne(ee(be),{src:`/images/kmp-in-practice/kotlin-site-archive-capture-2014.png`}),te(be),e(r,l)}export{m as default,l as metadata};