import{C as e,D as t,H as n,T as r,U as i,V as a,it as o,rt as s}from"./BZpmPeOn.js";import"./D1hYfEew.js";import{t as c}from"./CPN26mfg.js";import{a as l,c as u,l as d,o as f,s as p,u as ee}from"./DQKdroeW.js";var m={title:`Localization, Over-The-Air`,description:``,pubDatetime:`Oct 03, 2026 2:30 PM IST`,staticRes:`localization-ota`},{title:te,description:ne,pubDatetime:re,staticRes:ie}=m,ae=r(`<a href="https://github.com/LinkoraApp/Linkora" rel="nofollow">Linkora</a> has shipped three different OTA localization setups to skip app releases for translation updates, without
relying on third-party SDKs. This post goes over the first two client-side implementations I replaced, and details the
third one that runs the app today.`,1),oe=r(`I’ve had some form of this since Linkora <a href="https://github.com/LinkoraApp/Linkora/releases/tag/release-v0.7.0" rel="nofollow">v0.7.0</a> ,
back in Aug 2024. Since I needed unique identifiers to represent a translation and its respective value, I had it like:`,1),se=r(`This <em>evolved</em> in Dec 2024 into something like:`,1),ce=r(`I had extensions based on the <code>Key</code> to use the key directly and get the localized string and use in the Compose code.`,1),le=r(`The placeholder tokens in those default values, like <code>$&#123;LinkoraPlaceHolder.First.value&#125;</code> , got replaced by the actual
values at runtime, which obviously isn’t flexible enough. Looking back, I have no idea why I wrapped it in <code>derivedStateOf</code> or used <code>runBlocking</code> to load
strings individually instead of just pulling all the rows at once.`,1),ue=r(`Those are easy fixes, but the underlying design gets messy. It got to a point where I got rid of it and moved to
something simpler, where adding a key/value pair to <code>default.json</code> is the only manual step and everything else falls into place.`,1),de=r(`Fast forward
to <a href="https://github.com/LinkoraApp/Linkora/commit/8d95c93f938f85d117101897ec68bf50a1778c3f" rel="nofollow">September 12 2026 at around 1 AM</a> ,
I got rid of <code>the bad</code> and switched to an entirely new implementation which is what this section will focus on.`,1),fe=r(`I need a single source of truth for both the <a href="https://github.com/LinkoraApp/localization-server" rel="nofollow">localization-server</a> and the app, and I don’t want to maintain any type of
dataclass or anything manually. Previously I manually maintained <code>default.json</code> based on the enums. Now <code>default.json</code> is the single source of truth:`,1),pe=r(`The <code>key</code> is the same as the enum entry name. The dynamic values are similar to Android string resource placeholders,
which I will get into later.`,1),me=r(`Now based on this json file, I have a Gradle task that generates the <code>LocalizedStrings</code> class and the enum <code>LocalizationKey</code> :`,1),he=r(`Variable names and values are literal copy-paste from <code>default.json</code> . Whenever I load strings for a new language, I just
create a new instance from that language’s values, and the UI reflects it.`,1),ge=r(`You can access the strings from composable code or regular Kotlin code. For regular Kotlin code, pass the instance
directly. For Compose, I used <code>CompositionLocal</code> to pass the instance down the Compose tree so it can be
accessed across composables.`,1),_e=r(`Which gets <em>provided</em> in:`,1),ve=r(`Since <code>localizedStrings</code> is now passed down the Compose tree, it can be used as:`,1),ye=r(`<code>localizedStrings.AppLanguage</code> happens to be just static information, but I have a lot of cases where I need dynamic
values. Previously I replaced reserved placeholder strings of the app with dynamic values. That worked, but it gets
painful to
maintain since the list of reserved placeholder strings has to be maintained manually.`,1),be=r(`With <code>The Good</code> , I got rid of those reserved placeholder strings and went with a similar approach to how Android manages
them in string resources. For this, I have <code>&gt;&#123;N&#125;</code> where <code>N</code> can be <code>0</code> or any other positive number which the app will replace with dynamic values during runtime.`,1),xe=r(`Read the chars until <!> is hit, then read the number in it/until <!> is found`,1),Se=r(`If <!> isn’t found, it isn’t valid syntax and the text should be used as literal chars and not the syntax.`,1),Ce=r(`Look up the argument at that index. For example, for <!> if the arguments
are <!>, the final text will
be <!>`,1),we=r(`The position doesn’t matter since it just replaces things based on the provided <!>`,1),Te=r(`The above implementation consumes every region it scans. If a closing bracket is found, the index jumps past it even
when the tag is invalid. If no closing bracket remains, the rest of the string is appended and the loop stops. Since the
scanned regions do not overlap, total lookup work is bounded by <code>O(N)</code> . Appending the output costs <code>O(S)</code> , where <code>S</code> is
the final output length. Time complexity is <code>O(N + S)</code> . Space complexity for the retained output is <code>O(S)</code> .`,1),Ee=r(`The <code>substring</code> calls add temporary allocations, but their total scanned content is still bounded by <code>O(N)</code> .`,1),De=r(`For comparison, a <em>simpler</em> but <em>less</em> efficient approach would be:`,1),Oe=r(`Why <code>&gt;&#123;N&#125;</code>`,1),ke=r(`There is no combination of characters in normal text that means anything meaningful when starting with <code>&gt;&#123;</code> . i.e.,
the syntax is dumber than the regular <code>&#123;N&#125;</code> so I just went with that.`,1),Ae=r(`Since the strings are provided through <code>CompositionLocal</code> ,
previews can provide the default instance or a custom instance. <!> <!>`,1),je=r(`That sums up the app side of things, now yet another core part of this process is
the <a href="https://github.com/LinkoraApp/localization-server" rel="nofollow">localization-server</a> .`,1),Me=r(`The localization-server reads <code>default.json</code> from the app repository and uses it to populate the translation editor. The
keys come from the JSON file, and contributors provide the translations. Since dynamic strings exist, contributors also
have to follow the <code>&gt;&#123;N&#125;</code> syntax.`,1),Ne=r(`There is a GUI for contributors that shows the default English string, its respective key, and the dynamic placeholders.
Translations are then submitted to the <a href="https://github.com/LinkoraApp/localization-server" rel="nofollow">localization-server</a> repository. I’m thinking of changing this flow completely and integrating the GitHub API directly to push a PR, but for
now this is practical enough.`,1),Pe=r(`Translations are saved as raw JSON files on the server, and the server responds with them based on app requests.
For
example, when a language pack for Spanish is downloaded, all the keys and their values are saved into the <code>localized_strings</code> table
in the app. If the user picks a language to load from the downloaded strings, the app collects those rows from the table
and passes them as <code>Map&lt;String, String&gt;</code> to <code>LocalizedStrings</code> . That instance is then emitted by the localized strings
flow and provided to the Compose tree, as mentioned earlier.`,1),Fe=r(`Translations are pulled from the local tables on app launch or when updating the language within the app, so the keys
and values of the strings exist within the local database and are pulled only when necessary, instead of calling it
every time. Once I get all the strings from the table, I create an instance of <code>LocalizedStrings</code> and use it everywhere
via <code>CompositionLocal</code> or regular Kotlin calls. So strings aren’t loaded from remote calls, but are completely local
once
those key/value pairs exist in the database.`,1),Ie=r(`New keys added to <code>default.json</code> will show the English default value until a contributor submits a translation for that
language.`,1),Le=r(`So every time there is a new string in the app, I only have to add it to <code>default.json</code> and the rest falls into
place.`,1),Re=r(`Now if you zoom out and see how all these work together, it would be like this: <!>`,1),ze=r(`<code>The Good</code> design works great without depending on third party SDKs/services while keeping things very simple. I’ll be
using this design for my OSS projects going forward.`,1),Be=r(`<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <ol><!></ol> <ul><!></ul> <ol start="2"><!></ol> <ul><!></ul> <ol start="3"><!></ol> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <p><!></p> <!> <!> <!> <!> <!> <!> <!> <!>`,1);function h(r){var m=Be(),te=n(m);l(te,{children:(t,n)=>{var r=ae();s(),e(t,r)},$$slots:{default:!0}});var ne=i(te,2);d(ne,{level:1,children:(n,r)=>{s(),e(n,t(`The Ugly`))},$$slots:{default:!0}});var re=i(ne,2);l(re,{children:(t,n)=>{s();var r=oe();s(2),e(t,r)},$$slots:{default:!0}});var ie=i(re,2);c(ie,{text:`object LocalizedStrings : ViewModel() {
    ...
    private val _general = mutableStateOf("")
    val general = _general
    ...
    fun loadStrings(context: Context) {
        ...
        if (SettingsPreference.useLanguageStringsBasedOnFetchedValuesFromServer.value) {
            _showAssociatedImageInLinkMenu.value =
                (translationsRepo.getLocalizedStringValueFor(
                    "show_associated_image_in_link_menu",
                    SettingsPreference.preferredAppLanguageCode.value
                ).let {
                    it.ifNullOrBlank {
                        context.getString(R.string.show_associated_image_in_link_menu)
                    }
                })
        } else {
            _showAssociatedImageInLinkMenu.value =
                context.getString(R.string.show_associated_image_in_link_menu)
        }
        ...
    }
}`});var h=i(ie,2);l(h,{children:(n,r)=>{s(),e(n,t(`Now, as you can tell… it only gets worse with every line.`))},$$slots:{default:!0}});var g=i(h,2);d(g,{level:1,children:(n,r)=>{s(),e(n,t(`The Bad`))},$$slots:{default:!0}});var _=i(g,2);l(_,{children:(t,n)=>{s();var r=se();s(2),e(t,r)},$$slots:{default:!0}});var v=i(_,2);c(v,{text:`object Localization {
    private val localizedStrings = mutableStateMapOf<String, String>()

    fun loadLocalizedStrings(
        languageCode: String,
        forceLoadDefaultValues: Boolean = false
    ) = runBlocking {
        ...
        Key.entries.forEach { key ->
            localizedStrings[key.name] =
                if (languageCode == DEFAULT_APP_LANGUAGE_CODE || forceLoadDefaultValues) {
                    key.defaultValue
                } else {
                    getLocalizedStringValueFor(key.name, languageCode) ?: key.defaultValue
                }
        }
        ...
    }

    @Composable
    fun rememberLocalizedString(key: Key): String {
        return remember {
            derivedStateOf {
                localizedStrings[key.name] ?: key.defaultValue
            }
        }.value
    }

    enum class Key(val defaultValue: String) {
        Settings(defaultValue = "Settings"),
        ...
        StartingImportingProcess(
        defaultValue = "Starting data import from JSON file: \${LinkoraPlaceHolder.First.value }"
        )
        ...
    }
}`});var y=i(v,2);l(y,{children:(t,n)=>{s();var r=ce();s(2),e(t,r)},$$slots:{default:!0}});var b=i(y,2);l(b,{children:(t,n)=>{s();var r=le();s(6),e(t,r)},$$slots:{default:!0}});var x=i(b,2);l(x,{children:(t,n)=>{s();var r=ue();s(2),e(t,r)},$$slots:{default:!0}});var S=i(x,2);d(S,{level:1,children:(n,r)=>{s(),e(n,t(`The Good`))},$$slots:{default:!0}});var C=i(S,2);l(C,{children:(t,n)=>{s();var r=de();s(4),e(t,r)},$$slots:{default:!0}});var w=i(C,2);d(w,{level:2,children:(n,r)=>{s(),e(n,t(`Single Source of Truth`))},$$slots:{default:!0}});var T=i(w,2);l(T,{children:(t,n)=>{s();var r=fe();s(6),e(t,r)},$$slots:{default:!0}});var E=i(T,2);c(E,{text:`[
  {
    "key": "Copy",
    "defaultValue": "Copy"
  },
  {
    "key": "AppLanguage",
    "defaultValue": "App Language"
  },
  ...
  {
    "key": "FileTypeNotSupportedOnDesktopImport",
    "defaultValue": ">{0} files are not supported for importing, pick valid >{1} file."
  },
  ...`});var D=i(E,2);l(D,{children:(t,n)=>{s();var r=pe();s(2),e(t,r)},$$slots:{default:!0}});var O=i(D,2);d(O,{level:2,children:(n,r)=>{s(),e(n,t(`Build-Time Code Generation`))},$$slots:{default:!0}});var k=i(O,2);l(k,{children:(t,n)=>{s();var r=me();s(4),e(t,r)},$$slots:{default:!0}});var A=i(k,2);c(A,{text:`val localizationItems =
    (JsonSlurper().parse(localizationJsonFile.asFile) as List<*>)
        .map {
            (it as Map<*, *>).run {
                LocalizationItem(
                    key = get("key").toString(),
                    defaultValue = get("defaultValue").toString(),
                )
            }
        }

val localizationGeneration =
    tasks.register("localizationGeneration") {
        doLast {
            ...
            val generatedKeysFile = File(localizationBuildDir.get().asFile, "LocalizationKey.kt")
            val generatedStringsFile = File(localizationBuildDir.get().asFile, "LocalizedStrings.kt")

            val enumBuilder = StringBuilder()
            val classBuilder = StringBuilder()

            enumBuilder.append("enum class LocalizationKey {")
            classBuilder.append(
                """
                class LocalizedStrings(values: Map<String, String>) {

                    companion object {
                        val Default = LocalizedStrings(mapOf())
                    }
                """.trimIndent(),
            )

            localizationItems.forEach { (enumName, defaultValue) ->
                enumBuilder.append("\\n\\t$enumName,")
                val escapedDefaultValue = defaultValue.replace("\\n", "\\\\n").replace("\\"", "\\\\\\"")
                classBuilder.append(
                    "\\n\\n\\tval $enumName = values[\\"$enumName\\"].takeUnless { it.isNullOrBlank() } ?: \\"$escapedDefaultValue\\"",
                )
            }

            enumBuilder.append("\\n}")
            generatedKeysFile.writeText(enumBuilder.toString())

            classBuilder.append("\\n}")
            generatedStringsFile.writeText(classBuilder.toString())
        }
    }`});var j=i(A,2);l(j,{children:(n,r)=>{s(),e(n,t(`This task is wired to run before Kotlin compilation, so the generated files are always up to date when the project
builds.`))},$$slots:{default:!0}});var M=i(j,2);l(M,{children:(n,r)=>{s(),e(n,t(`If a downloaded language pack is missing a key or if the value itself is blank, the generated default value is used
automatically.`))},$$slots:{default:!0}});var N=i(M,2);d(N,{level:2,children:(n,r)=>{s(),e(n,t(`Duplicate Verification`))},$$slots:{default:!0}});var Ve=i(N,2);l(Ve,{children:(n,r)=>{s(),e(n,t(`Now to avoid duplicate keys or values, I have another Gradle task:`))},$$slots:{default:!0}});var P=i(Ve,2);c(P,{text:`val localizationVerification = tasks.register("localizationVerification") {
    doLast {
        val tempSet = mutableSetOf<String>()
        localizationItems.forEach { (enumKey, defaultValue) ->
            if (!tempSet.add(enumKey)) {
                error("Duplicate localization key: \\"$enumKey\\". Localization keys must be unique.")
            }
            if (enumKey != defaultValue && !tempSet.add(defaultValue)) {
                error(
                    "Duplicate localization default value: \\"$defaultValue\\" for key \\"$enumKey\\". " +
                            "Default values must be unique. Reuse the existing key that already contains this text.",
                )
            }
        }
    }
}`});var F=i(P,2);d(F,{level:2,children:(n,r)=>{s(),e(n,t(`Generated Output`))},$$slots:{default:!0}});var I=i(F,2);l(I,{children:(n,r)=>{s(),e(n,t(`This generates two files in the build folder, which look like this:`))},$$slots:{default:!0}});var L=i(I,2);c(L,{text:`class LocalizedStrings(values: Map<String, String>) {
    companion object {
        val Default = LocalizedStrings(mapOf())
    }

    val Copy = values["Copy"].takeUnless { it.isNullOrBlank() } ?: "Copy"

    val AppLanguage = values["AppLanguage"].takeUnless { it.isNullOrBlank() } ?: "App Language"

    val CreateANewFolderIn =
        values["CreateANewFolderIn"].takeUnless { it.isNullOrBlank() } ?: "Create A New Folder In >{0}"
    ...`,filename:`LocalizedStrings.kt`});var R=i(L,2);c(R,{text:`enum class LocalizationKey {
    Copy,
    Open,
    AttachTags,
    CreateANewTag,
    AppLanguage,
    ...`,filename:`LocalizationKey.kt`});var z=i(R,2);l(z,{children:(t,n)=>{s();var r=he();s(2),e(t,r)},$$slots:{default:!0}});var B=i(z,2);d(B,{level:2,children:(n,r)=>{s(),e(n,t(`CompositionLocal`))},$$slots:{default:!0}});var V=i(B,2);l(V,{children:(t,n)=>{s();var r=ge();s(2),e(t,r)},$$slots:{default:!0}});var H=i(V,2);c(H,{text:`val LocalizedStrings =
    compositionLocalOf<LocalizedStrings> {
        error("LocalizedStrings isn't provided")
    }`,filename:`CompositionLocals.kt`});var U=i(H,2);l(U,{children:(t,n)=>{s();var r=_e();s(2),e(t,r)},$$slots:{default:!0}});var W=i(U,2);c(W,{text:`val localizedStrings by mainVM.localizedStrings.collectAsStateWithLifecycle()
...
CompositionLocalProvider(
    LocalizedStrings provides localizedStrings
) {
    ...
    AppLang()
}`,filename:`MainActivity.kt`});var G=i(W,2);l(G,{children:(t,n)=>{s();var r=ve();s(2),e(t,r)},$$slots:{default:!0}});var He=i(G,2);c(He,{text:`@Composable
fun AppLang() {
    val localizedStrings = LocalizedStrings.current
    Text(text = localizedStrings.AppLanguage)
}`,filename:`Composable.kt`});var Ue=i(He,2);d(Ue,{level:2,children:(n,r)=>{s(),e(n,t(`Dynamic Strings`))},$$slots:{default:!0}});var We=i(Ue,2);l(We,{children:(t,n)=>{var r=ye();s(),e(t,r)},$$slots:{default:!0}});var Ge=i(We,2);l(Ge,{children:(t,n)=>{s();var r=be();s(8),e(t,r)},$$slots:{default:!0}});var Ke=i(Ge,2);l(Ke,{children:(n,r)=>{s(),e(n,t(`Since placeholder positions can vary by language, numbering them lets translators reorder the placeholders without
breaking replacement.`))},$$slots:{default:!0}});var qe=i(Ke,2);l(qe,{children:(n,r)=>{s(),e(n,t(`The logic for this is straightforward:`))},$$slots:{default:!0}});var K=i(qe,2);f(a(K),{children:(t,r)=>{l(t,{children:(t,r)=>{s();var a=xe(),o=i(n(a));p(o,{text:`>{`}),p(i(o,2),{text:`}`}),s(),e(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}}),o(K);var q=i(K,2);f(a(q),{children:(t,r)=>{l(t,{children:(t,r)=>{s();var a=Se();p(i(n(a)),{text:`}`}),s(),e(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}}),o(q);var J=i(q,2);f(a(J),{children:(r,a)=>{l(r,{children:(r,a)=>{s();var o=Ce(),c=i(n(o));p(c,{text:`Never >{3} >{1} >{0} >{2}`});var l=i(c,2);p(l,{text:`["you", "give", "up", "gonna"]`}),ee(i(l,2),{href:`https://www.youtube.com/watch?v=dQw4w9WgXcQ`,children:(n,r)=>{s(),e(n,t(`Never gonna give you up`))},$$slots:{default:!0}}),e(r,o)},$$slots:{default:!0}})},$$slots:{default:!0}}),o(J);var Y=i(J,2);f(a(Y),{children:(t,r)=>{l(t,{children:(t,r)=>{s();var a=we();p(i(n(a)),{text:`N`}),e(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}}),o(Y);var X=i(Y,2);f(a(X),{children:(n,r)=>{l(n,{children:(n,r)=>{s(),e(n,t(`Repeat from step 1 until reaching the end of the string.`))},$$slots:{default:!0}})},$$slots:{default:!0}}),o(X);var Je=i(X,2);l(Je,{children:(n,r)=>{s(),e(n,t(`In code it will look like:`))},$$slots:{default:!0}});var Ye=i(Je,2);c(Ye,{text:`fun String.replaceActual(vararg actuals: String): String {
    val finalStr = StringBuilder()
    var currIteration = 0
    while (currIteration < length) {
        if (currIteration + 1 < length && this[currIteration] == '>' && this[currIteration + 1] == '{') {
            val closeTagIndex = indexOf('}', startIndex = currIteration)
            if (closeTagIndex != -1) {
                val indexValue =
                    this.substring(startIndex = currIteration + 2, endIndex = closeTagIndex)
                        .toIntOrNull()

                if (indexValue != null && indexValue >= 0 && indexValue <= actuals.lastIndex) {
                    finalStr.append(actuals[indexValue])
                } else {
                    finalStr.append(
                        this,
                        currIteration,
                        closeTagIndex + 1
                    ) // '}' is also appended with the rest of the invalid value
                }
                currIteration = closeTagIndex + 1
            } else {
                // at this point we don't have the closing tag at all,
                // so append the rest of the string
                finalStr.append(this, currIteration, length)
                currIteration = length
            }
        } else {
            finalStr.append(this[currIteration])
            ++currIteration
        }
    }
    return finalStr.toString()
}`,filename:`Extensions.kt`});var Xe=i(Ye,2);l(Xe,{children:(t,n)=>{s();var r=Te();s(10),e(t,r)},$$slots:{default:!0}});var Ze=i(Xe,2);l(Ze,{children:(t,n)=>{s();var r=Ee();s(4),e(t,r)},$$slots:{default:!0}});var Qe=i(Ze,2);l(Qe,{children:(t,n)=>{s();var r=De();s(4),e(t,r)},$$slots:{default:!0}});var $e=i(Qe,2);c($e,{text:`fun String.replaceActual(vararg actuals: String): String {
    var result = this
    actuals.forEachIndexed { index, actual ->
        result = result.replace(">{$index}", actual)
    }
    return result
}`});var et=i($e,2);l(et,{children:(n,r)=>{s(),e(n,t(`This replacement is less efficient, isn’t single pass, and rescans the entire string on each iteration while creating a
new string object regardless of whether the placeholder actually exists, but it works.`))},$$slots:{default:!0}});var tt=i(et,2);l(tt,{children:(n,r)=>{s(),e(n,t(`Which can be used as:`))},$$slots:{default:!0}});var nt=i(tt,2);c(nt,{text:`localizedStrings.AddANewLinkIn
    .replaceActual(currentFolder.name)`});var rt=i(nt,2);d(rt,{level:3,children:(t,n)=>{s();var r=Oe();s(),e(t,r)},$$slots:{default:!0}});var Z=i(rt,2);l(Z,{children:(t,n)=>{s();var r=ke();s(4),e(t,r)},$$slots:{default:!0}});var it=i(Z,2);d(it,{level:2,children:(n,r)=>{s(),e(n,t(`Previews`))},$$slots:{default:!0}});var at=i(it,2);l(at,{children:(t,r)=>{s();var a=Ae(),o=i(n(a),3);u(o,{src:`/images/localization-ota/compose-preview-eng.png`}),u(i(o,2),{src:`/images/localization-ota/compose-preview-spa.png`,caption:`Usually you'd pass the strings in externally, like from a ViewModel; this is hardcoded just as an example.`}),e(t,a)},$$slots:{default:!0}});var ot=i(at,2);d(ot,{level:2,children:(n,r)=>{s(),e(n,t(`Localization Server`))},$$slots:{default:!0}});var st=i(ot,2);l(st,{children:(t,n)=>{s();var r=je();s(2),e(t,r)},$$slots:{default:!0}});var ct=i(st,2);l(ct,{children:(t,n)=>{s();var r=Me();s(4),e(t,r)},$$slots:{default:!0}});var lt=i(ct,2);d(lt,{level:2,children:(n,r)=>{s(),e(n,t(`Translation Editor`))},$$slots:{default:!0}});var ut=i(lt,2);l(ut,{children:(t,n)=>{s();var r=Ne();s(2),e(t,r)},$$slots:{default:!0}});var dt=i(ut,2);l(dt,{children:(n,r)=>{s(),e(n,t(`You can also add versioning/hashes so the client can check whether new translations exist. The server doesn’t support
that yet, but the design is flexible enough to add later.`))},$$slots:{default:!0}});var Q=i(dt,2);u(a(Q),{src:`/images/localization-ota/editor.png`}),o(Q);var ft=i(Q,2);d(ft,{level:2,children:(n,r)=>{s(),e(n,t(`Offline-First Strings`))},$$slots:{default:!0}});var pt=i(ft,2);l(pt,{children:(t,n)=>{s();var r=Pe();s(6),e(t,r)},$$slots:{default:!0}});var mt=i(pt,2);l(mt,{children:(t,n)=>{s();var r=Fe();s(4),e(t,r)},$$slots:{default:!0}});var ht=i(mt,2);l(ht,{children:(t,n)=>{s();var r=Ie();s(2),e(t,r)},$$slots:{default:!0}});var gt=i(ht,2);d(gt,{level:1,children:(n,r)=>{s(),e(n,t(`Zooming Out`))},$$slots:{default:!0}});var _t=i(gt,2);l(_t,{children:(t,n)=>{s();var r=Le();s(2),e(t,r)},$$slots:{default:!0}});var $=i(_t,2);l($,{children:(t,r)=>{s();var a=Re();u(i(n(a)),{src:`/images/localization-ota/arch.png`}),e(t,a)},$$slots:{default:!0}}),l(i($,2),{children:(t,n)=>{var r=ze();s(),e(t,r)},$$slots:{default:!0}}),e(r,m)}export{h as default,m as metadata};