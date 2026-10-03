var e=`---
title: "Localization, Over-The-Air"
description: ""
pubDatetime: "Oct 03, 2026 2:30 PM IST"
staticRes: "localization-ota"
---

This post goes over the older localization implementations Linkora replaced, and the OTA setup that runs it today.

# The Ugly

I've had some form of this since Linkora [v0.7.0](https://github.com/LinkoraApp/Linkora/releases/tag/release-v0.7.0),
back in Aug 2024. Since we needed
unique identifiers to represent a translation and its respective value, I had it like:

\`\`\`kotlin
object LocalizedStrings : ViewModel() {
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
}
\`\`\`

Now, as you can tell... it only gets worse with every line.

# The Bad

This _evolved_ in Dec 2024 into something like:

\`\`\`kotlin
object Localization {
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
}
\`\`\`

I had extensions based on the \`Key\` to use the key directly and get the localized string and use in the Compose code.

That dynamic value got replaced during runtime, which obviously isn't flexible enough. This whole enum thing
doesn't stay maintainable, now that I look back on this.

Essentially, this gets messy too. It got to a point where I got rid of this design and moved to something simpler, where
adding a key/value pair to \`default.json\` is the only manual step and everything else falls into place.

# The Good

Fast forward
to [September 12 2026 at around 1 AM](https://github.com/LinkoraApp/Linkora/commit/8d95c93f938f85d117101897ec68bf50a1778c3f),
I got rid of \`the bad\` and switched to an entirely new implementation which is what this section will focus on.

## Single Source of Truth

We need a single source of truth for both the [localization-server](https://github.com/LinkoraApp/localization-server)
and the app, and I don't want to maintain any type of
dataclass or anything manually. Previously I manually maintained \`default.json\` based on the enums. Now \`default.json\`
is the single source of truth:

\`\`\`json
[
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
  ...
\`\`\`

The \`key\` is the same as the enum entry name. The dynamic values are similar to Android string resource placeholders,
which we will get into later.

## Build-Time Code Generation

Now based on this json file, I have a Gradle task that generates the \`LocalizedStrings\` class and the enum
\`LocalizationKey\`:

\`\`\`kotlin
val localizationItems =
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
    }
\`\`\`

This task is wired to run before Kotlin compilation, so the generated files are always up to date when the project
builds.

If a downloaded language pack is missing a key or if the value itself is blank, the generated default value is used
automatically.

## Duplicate Verification

Now to avoid duplicate keys or values, I have another Gradle task:

\`\`\`kotlin
val localizationVerification = tasks.register("localizationVerification") {
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
}
\`\`\`

## Generated Output

This generates two files in the build folder, which look like this:

\`\`\`kotlin filename="LocalizedStrings.kt"
class LocalizedStrings(values: Map<String, String>) {
    companion object {
        val Default = LocalizedStrings(mapOf())
    }

    val Copy = values["Copy"].takeUnless { it.isNullOrBlank() } ?: "Copy"

    val AppLanguage = values["AppLanguage"].takeUnless { it.isNullOrBlank() } ?: "App Language"

    val CreateANewFolderIn =
        values["CreateANewFolderIn"].takeUnless { it.isNullOrBlank() } ?: "Create A New Folder In >{0}"
    ...
\`\`\`

\`\`\`kotlin filename="LocalizationKey.kt"
enum class LocalizationKey {
    Copy,
    Open,
    AttachTags,
    CreateANewTag,
    AppLanguage,
    ...
\`\`\`

Variable names and values are literal copy-paste from \`default.json\`. Whenever I load strings for a new language, I just
create a new instance from that language's values, and the UI reflects it.

## CompositionLocal

We can access the strings from composable code or regular Kotlin code. For regular Kotlin code, pass the instance
directly. For Compose, I used \`CompositionLocal\` to pass the instance down the Compose tree so it can be
accessed across composables.

\`\`\`kotlin filename="CompositionLocals.kt"
val LocalizedStrings =
    compositionLocalOf<LocalizedStrings> {
        error("LocalizedStrings isn't provided")
    }
\`\`\`

Which gets _provided_ in:

\`\`\`kotlin filename="MainActivity.kt"
val localizedStrings by mainVM.localizedStrings.collectAsStateWithLifecycle()
...
CompositionLocalProvider(
    LocalizedStrings provides localizedStrings
) {
    ...
    AppLang()
}
\`\`\`

Since \`localizedStrings\` is now passed down to the composables/Compose tree, it can be used as:

\`\`\`kotlin filename="Composable.kt"
@Composable
fun AppLang() {
    val localizedStrings = LocalizedStrings.current
    Text(text = localizedStrings.AppLanguage)
}
\`\`\`

## Dynamic Strings

\`localizedStrings.AppLanguage\` happens to be just static information, but we got a lot of cases where we need dynamic
values. Previously I replaced reserved placeholder strings of the app with dynamic values. That worked, but it gets
painful to
maintain since the list of reserved placeholder strings has to be maintained manually.

With \`The Good\` I got rid of those reserved placeholder strings
and
went with a similar approach on how Android manages it with their placeholders in the string resources. For this, I have
\`>{N}\` where \`N\` can be \`0\` or any other positive number which the app will replace with dynamic values during runtime.

Since placeholder positions can vary by language, numbering them lets translators reorder the placeholders without
breaking replacement.

The logic for this is straightforward:

1. Read the chars until \`>{\` is hit, then read the number in it/until \`}\` is found

- If \`}\` isn't found, it isn't valid syntax and the text should be used as literal chars and not the syntax.

2. Read the index of received arguments based on this number, i.e., for \`Never >{3} >{1} >{0} >{2}\` if the arguments
   are
   \`["you", "give", "up", "gonna"]\`, the final text will
   be [Never gonna give you up](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

- The position doesn't matter since we just replace things based on the provided \`N\`

3. And repeat from step 1 until we complete the chars of a string.

In code it will look like:

\`\`\`kotlin filename="Extensions.kt"
fun String.replaceActual(vararg actuals: String): String {
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
}
\`\`\`

The above implementation consumes every region it scans. If a closing bracket is found, the index jumps past it even
when the tag is invalid. If no closing bracket remains, the rest of the string is appended and the loop stops. Since the
scanned regions do not overlap, total lookup work is bounded by \`O(N)\`. Appending the output costs \`O(S)\`, where \`S\` is
the final output length. Time complexity is \`O(N + S)\`. Space complexity for the retained output is \`O(S)\`.

The \`substring\` calls add temporary allocations, but their total scanned content is still bounded by \`O(N)\`.

For comparison, a _simpler_ but _less_ efficient approach would be:

\`\`\`kotlin
fun String.replaceActual(vararg actuals: String): String {
    var result = this
    actuals.forEachIndexed { index, actual ->
        result = result.replace(">{$index}", actual)
    }
    return result
}
\`\`\`

This replacement is less efficient, isn't single pass, and would go through the replacement on each iteration while
creating a string object on each iteration regardless of whether it's used, but works.

Which can be used as:

\`\`\`kotlin
localizedStrings.AddANewLinkIn
    .replaceActual(currentFolder.name)
\`\`\`

### Why \`>{N}\`

There will be no combination of characters in normal text that means anything meaningful if it starts with \`>{\`. i.e.,
the syntax is dumber than the regular \`{N}\` so I just went with that.

## Previews

Since the strings are provided through \`CompositionLocal\`,
previews can provide the default instance or a custom instance.
![](/images/localization-ota/compose-preview-eng.png)
![alt|caption=Usually you'd pass the strings in externally, like from a ViewModel; this is hardcoded just as an example.](/images/localization-ota/compose-preview-spa.png)

## Localization Server

That sums up the app side of things, now yet another core part of this process is
the [localization-server](https://github.com/LinkoraApp/localization-server).

The localization-server reads \`default.json\` from the app repository and uses it to populate the translation editor. The
keys come from the JSON file, and contributors provide the translations. Since dynamic strings exist, contributors also
have to follow the \`>{N}\` syntax.

## Translation Editor

There is a GUI for contributors that shows the default English string, its respective key, and the dynamic placeholders.
Translations are then submitted to the [localization-server](https://github.com/LinkoraApp/localization-server)
repository. I'm thinking of changing this flow completely and integrating the GitHub API directly to push a PR, but for
now this is practical enough.

You can also add versioning/hashes so the client can check whether new translations exist. The server doesn't support
that yet, but the design is flexible enough to add later.

![](/images/localization-ota/editor.png)

## Offline-First Strings

Translations are saved as raw JSON files on the server, and the server responds with them based on app requests.
For
example, when a language pack for Spanish is downloaded, all the keys and their values are saved into the
\`localized_strings\` table
in the app. If the user picks a language to load from the downloaded strings, the app collects those rows from the table
and passes them as \`Map<String, String>\` to \`LocalizedStrings\`. That instance is then emitted by the localized strings
flow and provided to the Compose tree, as mentioned earlier.

Translations are pulled from the local tables on app launch or when updating the language within the app, so the keys
and values of the strings exist within the local database and are pulled only when necessary, instead of calling it
every time. Once we get all the strings from the table we
create
an instance of \`LocalizedStrings\` and use it everywhere via \`CompositionLocal\` or regular Kotlin calls. So strings
aren't
loaded from remote calls but completely local once we have key/value pairs of these translations.

New keys added to \`default.json\` will show the English default value until a contributor submits a translation for that
language.

# Zooming Out

So every time there is a new string in the app, I only have to add it to the \`default.json\` and the rest falls into
place.

Now if you zoom out and see how all these work together, it would be like this:
![](/images/localization-ota/arch.png)

\`The Good\` design works great without depending on third party SDKs/services while keeping things very simple. I'll be
using this design for my OSS projects going forward.`;export{e as default};