import{$ as e,C as t,I as n,L as r,Q as i,R as a,S as o,b as s}from"./D-7-RzVt.js";import"./D1hYfEew.js";import"./5uiB3pu9.js";import{a as c,c as l,l as u,o as ee,r as d,s as f,u as p}from"./shwkbwOB.js";var m={title:`Kotlin Multiplatform, in practice`,description:`It Works, and It's Actually Good.`,pubDatetime:`Aug 03, 2025 07:30 PM IST`},{title:h,description:g,pubDatetime:_}=m,te=o(`<!> used to say <!> and they did make one which I think is <em>the one</em> .`,1),ne=o(`Kotlin decouples the platform-specific implementations with <!> and <!> , which makes you directly deal with the platform-specific stuff.`,1),re=o(`<!> is the <em>skeleton</em> while the actual implementation of it lies in the usage of <!> across targeted platforms.`,1),ie=o(`If the project is targeting Android and desktop, then the respective implementation for these platforms must be implemented based on this <em>expected</em> block.`,1),ae=o(`Now <!> is an extension function which exists in the common codebase; the platform codebase cannot be accessed from the common codebase, but vice versa is possible with KMP.`,1),oe=o(`I used to use Dagger Hilt for DI in <!> , when the codebase targeted Android only. Now that I have migrated to KMP, I have switched to manual DI, which I think is fairly simple and the usual way I prefer for my projects now (AS IT SHOULD BE).`,1),se=o(`Live preview sucked with Jetpack Compose in the initial days of my usage, as you had to rebuild for every newly updated preview; which later picked it up and got good, but <!> works just fine for me, far better than what it used to be with Compose which only targeted Android back then.`,1),ce=o(`Coroutines and Flows play a major role in KMP. Now, when I mentioned “major role”, I mean <em>major role</em> .`,1),le=o(`The <!> and <!> usage is required in some cases, and it may require another component to be included to complete the operation, as the expected implementation is supposed to be an individual block and not included wherever in the codebase.`,1),ue=o(`If you are using Compose, you would typically use <!> , which is <!> with a contract to pick the directory. Now, <!> is a composable function; you cannot call it randomly in the codebase. It needs to be a composable function to call it, similar to suspend functions.`,1),de=o(`<!> isn’t a composable; in this case, using flows or channels to make the composable pick the directory makes sense, and on picking it, send the directory URI back, which we can collect from the implementation of <!> , which targets the Android platform.`,1),fe=o(`And from the <!> or anywhere you are reading the emissions, you collect the events and send them back via <!> .`,1),pe=o(`<!> is an extension function that exists in the Android codebase:`,1),me=o(`I think KMP is great at what it does with the existing tooling support. I didn’t ship to iOS yet, so I’m not sure how it impacts anything, but I’m certainly sure that the <!> , but it seems it will only get better.`,1),he=o(`We really came a long way ( <!> ).`,1),ge=o(`<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <p><!></p>`,1);function v(o){var m=ge(),h=r(m);d(h,{children:(e,n)=>{var o=te(),l=r(o);u(l,{href:`https://kotlinlang.org/`,children:(e,n)=>{i(),s(e,t(`kotlinlang.org`))},$$slots:{default:!0}}),c(a(l,2),{text:`A modern programming language that makes developers happier`}),i(3),s(e,o)},$$slots:{default:!0}});var g=a(h,2);d(g,{children:(e,n)=>{i(),s(e,t(`While I got to know about Kotlin from Android development, it has grown a lot since then. The first-party library/frameworks/tools support from JetBrains and the Kotlin team, and the software related to development using Kotlin, built and maintained by the community, made the language fun and interesting to work with, not specifically on Android, but also in the backend.`))},$$slots:{default:!0}});var _=a(g,2);d(_,{children:(e,n)=>{i(),s(e,t(`Now that there is an official language server, I hope it will continue to evolve further. I’m kinda biased towards Kotlin for a couple of reasons. Irrespective of that, I think Kotlin is great at what it does.`))},$$slots:{default:!0}});var v=a(_,2);f(v,{level:1,children:(e,n)=>{i(),s(e,t(`Multiplatform with Kotlin`))},$$slots:{default:!0}});var y=a(v,2);d(y,{children:(e,t)=>{i();var n=ne(),o=a(r(n));c(o,{text:`actual`}),c(a(o,2),{text:`expect`}),i(),s(e,n)},$$slots:{default:!0}});var b=a(y,2);d(b,{children:(e,n)=>{i(),s(e,t(`The core and common logic is separated from the respective platform stuff in a typical KMP project, so you end up writing platform-specific stuff individually while the common code remains the same across the targeted platforms.`))},$$slots:{default:!0}});var x=a(b,2);d(x,{children:(e,t)=>{var n=re(),o=r(n);c(o,{text:`expect`}),c(a(o,4),{text:`actual`}),i(),s(e,n)},$$slots:{default:!0}});var S=a(x,2);p(S,{text:`expect suspend fun deleteAutoBackups(
    backupLocation: String,
    threshold: Int, onCompletion: (deletionCount: Int) -> Unit
)`});var C=a(S,2);d(C,{children:(e,t)=>{i();var n=ie();i(2),s(e,n)},$$slots:{default:!0}});var w=a(C,2);d(w,{children:(e,n)=>{i(),s(e,t(`Now on Android, the implementation for this may look like:`))},$$slots:{default:!0}});var T=a(w,2);p(T,{text:`actual suspend fun deleteAutoBackups(
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
}`});var E=a(T,2);d(E,{children:(e,n)=>{i(),s(e,t(`But the same function’s implementation on a desktop target will look like:`))},$$slots:{default:!0}});var D=a(E,2);p(D,{text:`actual suspend fun deleteAutoBackups(
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
}`});var _e=a(D,2);d(_e,{children:(e,n)=>{i(),s(e,t(`The platform-specific APIs or implementations get involved with this expect/actual mechanism, which makes things straightforward and pretty clear.`))},$$slots:{default:!0}});var O=a(_e,2);d(O,{children:(e,t)=>{i();var n=ae();c(a(r(n)),{text:`pushSnackbar()`}),i(),s(e,n)},$$slots:{default:!0}});var k=a(O,2);d(k,{children:(e,n)=>{i(),s(e,t(`If you are dealing with composables or classes or an interface implementation on specific platforms or anything that is platform-specific, this mechanism remains the same.`))},$$slots:{default:!0}});var A=a(k,2);d(A,{children:(e,n)=>{i(),s(e,t(`I never tried other multiplatform frameworks/tools, but I think this is the simplest yet finest way to deal with platform-level implementations, although most of the commonly used libraries like Coil, Ktor, koin, Room, and material components (via Compose multiplatform) already support KMP, but there may be cases where you have to stick with platform-level APIs, and I think KMP does it most finely.`))},$$slots:{default:!0}});var j=a(A,2);f(j,{level:2,children:(e,n)=>{i(),s(e,t(`The Nitpicks`))},$$slots:{default:!0}});var M=a(j,2);d(M,{children:(e,n)=>{i(),s(e,t(`Now the nitpick I have here has to do more with CMP than KMP: CMP is maintained by JetBrains, which is not on the latest version regularly with respect to the upstream version, and some components like material expressive aren’t yet possible to use directly in the common codebase, but again, this is just a nitpick.`))},$$slots:{default:!0}});var N=a(M,2);d(N,{children:(e,n)=>{i(),s(e,t(`This has nothing to do with KMP, but you also need to know that yep, this sort of thing exists where you might end up not using the library you used to use when on a single targeted codebase, so you end up writing your own thing in the common codebase or with expect/actual blocks, which is fine, at least for me.`))},$$slots:{default:!0}});var P=a(N,2);d(P,{children:(e,n)=>{i();var o=oe();u(a(r(o)),{href:`https://github.com/LinkoraApp/Linkora`,children:(e,n)=>{i(),s(e,t(`Linkora`))},$$slots:{default:!0}}),i(),s(e,o)},$$slots:{default:!0}});var F=a(P,2);d(F,{children:(e,n)=>{i();var o=se();u(a(r(o)),{href:`https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-hot-reload.html`,children:(e,n)=>{i(),s(e,t(`Compose Hot Reload`))},$$slots:{default:!0}}),i(),s(e,o)},$$slots:{default:!0}});var I=a(F,2);f(I,{level:1,children:(e,n)=>{i(),s(e,t(`Coroutines and Flows in KMP`))},$$slots:{default:!0}});var L=a(I,2);d(L,{children:(e,t)=>{i();var n=ce();i(2),s(e,n)},$$slots:{default:!0}});var R=a(L,2);d(R,{children:(e,t)=>{i();var n=le(),o=a(r(n));c(o,{text:`expect`}),c(a(o,2),{text:`actual`}),i(),s(e,n)},$$slots:{default:!0}});var z=a(R,2);d(z,{children:(e,n)=>{i(),s(e,t(`We need the “Event-driven” style to complete the operation; this is, of course, your typical asynchronous use case, which Kotlin coroutines and flows do excellently in my usage.`))},$$slots:{default:!0}});var B=a(z,2);d(B,{children:(e,n)=>{i(),s(e,t(`This function needs to use platform-specific APIs to pick a directory:`))},$$slots:{default:!0}});var V=a(B,2);p(V,{text:`expect suspend fun pickADirectory(): String?`});var H=a(V,2);d(H,{children:(e,n)=>{i(),s(e,t(`Now, you would call this typically from a ViewModel or any other class; when dealing with the desktop target, this is straightforward, you implement something like:`))},$$slots:{default:!0}});var U=a(H,2);p(U,{text:`actual suspend fun pickADirectory(): String? {
   val fileDialog = FileDialog(
        Frame(),
        Localization.Key.SelectASourceDir.getLocalizedString(),
        FileDialog.LOAD
    )
    fileDialog.isVisible = true
    val sourceDirectory = File(fileDialog.directory)
    // rest of the implementation
}`});var W=a(U,2);d(W,{children:(e,n)=>{i(),s(e,t(`When targeting Android, the implementation will be based on Android-specific APIs.`))},$$slots:{default:!0}});var G=a(W,2);d(G,{children:(e,t)=>{i();var n=ue(),o=a(r(n));c(o,{text:`rememberLauncherForActivityResult`});var l=a(o,2);c(l,{text:`ManagedActivityResultLauncher`}),c(a(l,2),{text:`rememberLauncherForActivityResult`}),i(),s(e,n)},$$slots:{default:!0}});var K=a(G,2);d(K,{children:(e,t)=>{var n=de(),o=r(n);c(o,{text:`pickADirectory`}),c(a(o,2),{text:`pickADirectory`}),i(),s(e,n)},$$slots:{default:!0}});var q=a(K,2);d(q,{children:(e,n)=>{i(),s(e,t(`The implementation would look like:`))},$$slots:{default:!0}});var J=a(q,2);p(J,{text:`actual suspend fun pickADirectory(): String? {
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
}`});var Y=a(J,2);d(Y,{children:(e,t)=>{i();var n=fe(),o=a(r(n));c(o,{text:`MainActivity`}),c(a(o,2),{text:`PickedDirectory`}),i(),s(e,n)},$$slots:{default:!0}});var X=a(Y,2);p(X,{text:`val activityResultLauncherForPickingADirectory =
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
}`});var Z=a(X,2);d(Z,{children:(e,t)=>{var n=pe();c(r(n),{text:`pushUIEvent`}),i(),s(e,n)},$$slots:{default:!0}});var Q=a(Z,2);p(Q,{text:` fun CoroutineScope.pushUIEvent(type: Type) {
      this.launch {
         _androidUIEventChannel.send(type)
      }
}`});var $=a(Q,2);d($,{children:(e,n)=>{i(),s(e,t(`So I think we are clear on the usage of coroutines in KMP. Similarly, I have also used shared flows in some cases, like:`))},$$slots:{default:!0}});var ve=a($,2);p(ve,{text:`@Composable
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
}`});var ye=a(ve,2);d(ye,{children:(e,n)=>{i(),s(e,t(`Which is collected from the Android codebase to minimize the app.`))},$$slots:{default:!0}});var be=a(ye,2);d(be,{children:(e,n)=>{i(),s(e,t(`I’m sure there are other ways to implement all of this, but I did it like this, and all this remains solid handling in my use cases.`))},$$slots:{default:!0}});var xe=a(be,2);l(xe,{});var Se=a(xe,2);d(Se,{children:(e,n)=>{i();var o=me();u(a(r(o)),{href:`https://x.com/ChrisKruegerDev/status/1950493507212148883`,children:(e,n)=>{i(),s(e,t(`size of the app is massive on iOS`))},$$slots:{default:!0}}),i(),s(e,o)},$$slots:{default:!0}});var Ce=a(Se,2);d(Ce,{children:(e,n)=>{i();var o=he();u(a(r(o)),{href:`https://web.archive.org/web/20140802140223/https://kotlinlang.org/`,children:(e,n)=>{i(),s(e,t(`Captured on Aug 02 2014`))},$$slots:{default:!0}}),i(),s(e,o)},$$slots:{default:!0}});var we=a(Ce,2);ee(n(we),{src:`/src/content/images/kotlin-site-archive-capture-2014.png`}),e(we),s(o,m)}export{v as default,m as metadata};