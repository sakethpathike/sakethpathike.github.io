import{C as e,D as t,H as n,T as r,U as i,V as a,it as o,rt as s}from"./BWc9umX3.js";import"./CFKVnMbq.js";import"./6OkQQOUT.js";import{t as c}from"./826G_Alq.js";import{t as l}from"./daMUoOmK.js";import{a as u,c as d,i as f,o as p,s as m}from"./PhjolevW.js";var h={title:`Data Synchronization in Linkora`,description:``,pubDatetime:`Feb 16, 2025 01:05 PM IST`,staticRes:`linkora-sync`},{title:g,description:_,pubDatetime:v,staticRes:y}=h,ee=r(`Update (April 15, 2026)<br/><br/>This post goes over the custom sync setup that runs Linkora today, which
combines an
operation queue with basic Last-Write-Wins and tombstones. While this gets the job done for a single user, there are
more solid ways to handle offline data, and I am currently looking into proper CRDTs.`,1),te=r(`<a href="https://github.com/LinkoraApp/Linkora" rel="nofollow">Linkora App</a> uses multiple <em>techniques</em> to make sure the data is synced with the
remote database even when the <a href="https://github.com/LinkoraApp/sync-server" rel="nofollow">self-hostable sync-server</a> is
not up (i.e., Linkora will push changes once the server is up the next time). Most of the important parts of this
implementation happen in the app because it’s the source of the data, so we’ll have fine control over what’s supposed to
be pushed and what’s not.`,1),ne=r(`Linkora supports <code>Two-Way Sync</code> synchronization. It’s up to people who use the app to decide how to use the syncing
method.
Linkora supports:`,1),re=r(`By this, it is straightforward to understand that if the sync type is set to <code>Two-Way Sync</code> , both of these conditional
blocks will be true. Hence, we need to implement <code>Client-to-Server</code> and <code>Server-To-Client</code> .`,1),ie=r(`Pushing <!>-<!>-<!> operations that happen locally.
That’s all we care about. But there may be cases when the <!> might not be up. In that case, we need to
save what’s supposed to be pushed so that whenever the server and app are up, the app can send those changes. This
also makes it local-first, as irrespective of server changes; it will always update locally.`,1),ae=r(`Now, the first thing is to <strong>try saving locally and then pushing the changes</strong> . There are many operations where we need
to push changes to the server, so I made a generic function that works for all these cases where we need to perform
local operations and then push to the remote server:`,1),oe=r(`If pushing fails, <!> will be triggered if the sync type is set to <!> or <!>.`,1),se=r(`For that, I have a table called <code>PendingSyncQueue</code> :`,1),ce=r(`Now, the <code>operation</code> refers to the endpoint at which the operation needs to be performed, and the <code>payload</code> is the body
of the POST request.`,1),le=r(`Where <strong>every</strong> DTO contains <code>correlation</code> . Here, the <code>IDBasedDTO</code> looks like:`,1),ue=r(`<code>Correlation</code> helps in identifying the client which performs the operation, because we don’t want to perform locally
after reading remote updates if that update was performed by us. If done by a different client, it won’t match our <code>Correlation</code> , so we can perform that knowing we’re not the source.`,1),de=r(`Now, once the server and app are both online, we can send queued data from <code>PendingSyncQueue</code> . For the same example
considered earlier, here’s how it will be sent:`,1),fe=r(`This way, we can confirm the client will definitely send the data to the server <em>(if it gets uninstalled, we can’t do
anything about it)</em> .`,1),pe=r(`In conclusion, the following image should give you a clear idea of how all these components work together to ensure <code>Client-to-Server</code> sync works as expected:`,1),me=r(`To support this, every table contains a column called <code>lastModified</code> , which will also be sent in the POST request body
and is needed for the <code>sync-server</code> :`,1),he=r(`<code>Client-to-Server</code> focuses on pushing changes, while <code>Server-to-Client</code> focuses on reading changes that occurred on the remote database through the server.`,1),ge=r(`The app saves a <code>TIME_STAMP</code> in its preferences, updated at every successful remote request. The <code>TIME_STAMP</code> value is
sent from the server (since server operations happen there).`,1),_e=r(`<strong>Using sockets</strong> if both app and server are online.`,1),ve=r(`<strong>Custom implementations</strong> if the client is offline or disconnected from the server.`,1),ye=r(`Updating data after the last known <!>.`,1),be=r(`We track deleted items using a server-side <code>Tombstone</code> table structured as:`,1),xe=r(`As mentioned earlier, the local database in the app contains a column called <code>lastModified</code> . Similarly, tables in the
remote database also include this column. The app sends its last known <code>TIME_STAMP</code> to the server, which returns all
changes made after that timestamp:`,1),Se=r(`In conclusion, the following images should give you a clear idea of how all these components work together to make sure <code>Server-to-Client</code> sync operates as expected:`,1),Ce=r(`If both app and server are online. <!>`,1),we=r(`If the client is offline or disconnected from the server. <!>`,1),Te=r(`<!> <!> <!> <ul><!><!><!></ul> <!> <!> <!> <!> <!> <!> <ol><!></ol> <!> <!> <!> <ol><!><!><!></ol> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <p><!></p> <!> <!> <!> <!> <!> <!> <!> <!> <ol><!><!></ol> <!> <!> <!> <!> <!> <!> <ol><!><!></ol> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <ol><!><!></ol> <div style="height: 6px"></div> <hr/> <!>`,1);function b(r){var h=Te(),g=n(h);l(g,{children:(t,n)=>{s();var r=ee();s(3),e(t,r)},$$slots:{default:!0}});var _=i(g,2);f(_,{children:(t,n)=>{var r=te();s(5),e(t,r)},$$slots:{default:!0}});var v=i(_,2);f(v,{children:(t,n)=>{s();var r=ne();s(2),e(t,r)},$$slots:{default:!0}});var y=i(v,2),b=a(y);u(b,{children:(e,t)=>{f(e,{children:(e,t)=>{p(e,{text:`Client To Server`})},$$slots:{default:!0}})},$$slots:{default:!0}});var x=i(b);u(x,{children:(e,t)=>{f(e,{children:(e,t)=>{p(e,{text:`Server To Client`})},$$slots:{default:!0}})},$$slots:{default:!0}}),u(i(x),{children:(e,t)=>{f(e,{children:(e,t)=>{p(e,{text:`Two-Way Sync`})},$$slots:{default:!0}})},$$slots:{default:!0}}),o(y);var S=i(y,2);f(S,{children:(n,r)=>{s(),e(n,t(`Based on the selected option, Linkora will handle the respective implementations.`))},$$slots:{default:!0}});var C=i(S,2);f(C,{children:(n,r)=>{s(),e(n,t(`All this in a nutshell looks like:`))},$$slots:{default:!0}});var w=i(C,2);c(w,{text:`suspend fun syncData() {
    if (canPushToServer()) {
        pushUnSyncedDataToServer()
    }

    if (canReadFromServer()) {
        establishSocketConnectionAndPerformOperations()

        getTombstonesInfoFromServer(after = TIME_STAMP).let {
            deleteFromLocalDataBasedOnTombstones(it)
        }

        getNewUpdatesFromServer(after = TIME_STAMP).let {
            updateLocalDataBasedOnRemoteUpdates(it)
        }
    }
}`});var T=i(w,2);f(T,{children:(t,n)=>{s();var r=re();s(6),e(t,r)},$$slots:{default:!0}});var E=i(T,2);d(E,{level:3,children:(n,r)=>{s(),e(n,t(`1. Client-to-Server`))},$$slots:{default:!0}});var D=i(E,2);f(D,{children:(n,r)=>{s(),e(n,t(`In this case, we only need to consider:`))},$$slots:{default:!0}});var O=i(D,2);u(a(O),{children:(t,r)=>{f(t,{children:(t,r)=>{s();var a=ie(),o=i(n(a));p(o,{text:`CREATE`});var c=i(o,2);p(c,{text:`UPDATE`});var l=i(c,2);p(l,{text:`DELETE`}),p(i(l,2),{text:`sync-server`}),s(),e(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}}),o(O);var k=i(O,2);f(k,{children:(t,n)=>{s();var r=ae();s(2),e(t,r)},$$slots:{default:!0}});var A=i(k,2);c(A,{text:`fun <LocalType, RemoteType> performLocalOperationWithRemoteSyncFlow(
    performRemoteOperation: Boolean,
    remoteOperation: suspend () -> Flow<Result<RemoteType>> = { emptyFlow() },
    remoteOperationOnSuccess: suspend (RemoteType) -> Unit = {},
    onRemoteOperationFailure: suspend () -> Unit = {},
    localOperation: suspend () -> LocalType
): Flow<Result<LocalType>> {
    return flow {
        emit(Result.Loading())
        val localResult = localOperation()
        Result.Success(localResult).let { success ->
            if (performRemoteOperation && canPushToServer()) {
                remoteOperation().collect { remoteResult ->
                    remoteResult.onFailure { failureMessage ->
                        success.isRemoteExecutionSuccessful = false
                        success.remoteFailureMessage = failureMessage
                        onRemoteOperationFailure()
                    }
                    remoteResult.onSuccess {
                        remoteOperationOnSuccess(it.data)
                    }
                }
            }
            emit(success)
        }
    }.catchAsThrowableAndEmitFailure(init = {
        if (performRemoteOperation && canPushToServer()) {
            onRemoteOperationFailure()
        }
    })
}`});var j=i(A,2);f(j,{children:(n,r)=>{s(),e(n,t(`It may seem like a lot is happening, but it’s not. What this does is:`))},$$slots:{default:!0}});var M=i(j,2),N=a(M);u(N,{children:(n,r)=>{f(n,{children:(n,r)=>{s(),e(n,t(`Perform local operation.`))},$$slots:{default:!0}})},$$slots:{default:!0}});var P=i(N);u(P,{children:(n,r)=>{f(n,{children:(n,r)=>{s(),e(n,t(`Try to push changes. If successful, the operation is successful.`))},$$slots:{default:!0}})},$$slots:{default:!0}}),u(i(P),{children:(t,r)=>{f(t,{children:(t,r)=>{s();var a=oe(),o=i(n(a));p(o,{text:`onRemoteOperationFailure()`});var c=i(o,2);p(c,{text:`Client-to-Server`}),p(i(c,2),{text:`Two-Way Sync`}),s(),e(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}}),o(M);var F=i(M,2);f(F,{children:(n,r)=>{s(),e(n,t(`Now we need to figure out how to save the operations locally when there’s a failure on the remote server (mostly because
the server is down), so once the server is up, Linkora App can send those operations.`))},$$slots:{default:!0}});var I=i(F,2);f(I,{children:(t,n)=>{s();var r=se();s(2),e(t,r)},$$slots:{default:!0}});var L=i(I,2);c(L,{text:`@Entity("pending_sync_queue")
data class PendingSyncQueue(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val operation: String,
    val payload: String
)`});var R=i(L,2);f(R,{children:(t,n)=>{s();var r=ce();s(4),e(t,r)},$$slots:{default:!0}});var z=i(R,2);f(z,{children:(n,r)=>{s(),e(n,t(`A simple example of how this is done:`))},$$slots:{default:!0}});var B=i(z,2);c(B,{text:`onRemoteOperationFailure = {
    pendingSyncQueueRepo.addInQueue(
        PendingSyncQueue(
            operation = RemoteRoute.Link.ARCHIVE_LINK.name,
            payload = Json.encodeToString(
                IDBasedDTO(
                    linkId, eventTimestamp
                )
            )
        )
    )
}`});var V=i(B,2);f(V,{children:(t,n)=>{s();var r=le();s(6),e(t,r)},$$slots:{default:!0}});var H=i(V,2);c(H,{text:`@Serializable
data class IDBasedDTO(
    val id: Long,
    val eventTimestamp: Long,
    val correlation: Correlation
)

@Serializable
data class Correlation(
    val id: String, val clientName: String
)`});var Ee=i(H,2);f(Ee,{children:(t,n)=>{var r=ue();s(3),e(t,r)},$$slots:{default:!0}});var U=i(Ee,2);f(U,{children:(t,n)=>{s();var r=de();s(2),e(t,r)},$$slots:{default:!0}});var W=i(U,2);c(W,{text:`when (queue.operation) {
    ARCHIVE_LINK.name -> {
        val idBasedDTO = Json.decodeFromString<IDBasedDTO>(queueItem.payload)
        val remoteLinkId = localLinksRepo.getRemoteLinkId(idBasedDTO.id)
        remoteLinksRepo.archiveALink(idBasedDTO.copy(id = remoteLinkId))
            .removeQueueItemAndSyncTimestamp(queueItem.id)
    }
}

private suspend inline fun Flow<Result<TimeStampBasedResponse>>.removeQueueItemAndSyncTimestamp(
    queueId: Long
) {
    this.collectLatest {
        it.onSuccess {
            pendingSyncQueueRepo.removeFromQueue(queueId)
            preferencesRepository.updateLastSyncedWithServerTimeStamp(it.data.eventTimestamp)
        }
    }
}

@Serializable
data class TimeStampBasedResponse(
    val eventTimestamp: Long,
    val message: String
)`});var G=i(W,2);f(G,{children:(t,n)=>{s();var r=fe();s(2),e(t,r)},$$slots:{default:!0}});var K=i(G,2);f(K,{children:(t,n)=>{s();var r=pe();s(2),e(t,r)},$$slots:{default:!0}});var q=i(K,2);m(a(q),{src:`/images/linkora-sync/client-to-server.png`}),o(q);var J=i(q,2);f(J,{children:(n,r)=>{s(),e(n,t(`Now on the server-side, LWW (Last Write Wins) is implemented for some routes where updating is required. This makes sure
the server only updates newer values in case all clients and the server aren’t up at the same time:`))},$$slots:{default:!0}});var De=i(J,2);c(De,{text:`// on server-side
private fun checkForLWWConflictAndThrow(id: Long, timeStamp: Long) {
    transaction {
        FoldersTable.select(FoldersTable.lastModified).where {
            FoldersTable.id.eq(id)
        }.let {
            if (it.single()[FoldersTable.lastModified] > timeStamp) {
                throw LWWConflictException()
            }
        }
    }
}
---
override suspend fun markAsArchive(idBasedDTO: IDBasedDTO): Result<TimeStampBasedResponse> {
    return try {
        checkForLWWConflictAndThrow(id = idBasedDTO.id, timeStamp = idBasedDTO.eventTimestamp)
        // further impl
    } catch (e: Exception) {
        Result.Failure(e)
    }
}`});var Oe=i(De,2);f(Oe,{children:(t,n)=>{s();var r=me();s(4),e(t,r)},$$slots:{default:!0}});var ke=i(Oe,2);c(ke,{text:`@Entity(tableName = "folders")
@Serializable
data class Folder(
    val name: String,
    val note: String,
    val parentFolderId: Long?,
    @PrimaryKey(autoGenerate = true)
    val localId: Long = 0,
    val remoteId: Long? = null,
    val isArchived: Boolean = false,
    val lastModified: Long
)`});var Ae=i(ke,2);d(Ae,{level:3,children:(n,r)=>{s(),e(n,t(`2. Server-to-Client`))},$$slots:{default:!0}});var je=i(Ae,2);f(je,{children:(t,n)=>{var r=he();s(3),e(t,r)},$$slots:{default:!0}});var Me=i(je,2);f(Me,{children:(t,n)=>{s();var r=ge();s(4),e(t,r)},$$slots:{default:!0}});var Ne=i(Me,2);f(Ne,{children:(n,r)=>{s(),e(n,t(`Changes can be read in two ways:`))},$$slots:{default:!0}});var Y=i(Ne,2),Pe=a(Y);u(Pe,{children:(t,n)=>{f(t,{children:(t,n)=>{var r=_e();s(),e(t,r)},$$slots:{default:!0}})},$$slots:{default:!0}}),u(i(Pe),{children:(t,n)=>{f(t,{children:(t,n)=>{var r=ve();s(),e(t,r)},$$slots:{default:!0}})},$$slots:{default:!0}}),o(Y);var Fe=i(Y,2);d(Fe,{level:3,children:(n,r)=>{s(),e(n,t(`1. Using sockets if both app and server are online`))},$$slots:{default:!0}});var Ie=i(Fe,2);f(Ie,{children:(n,r)=>{s(),e(n,t(`When both app and server are online, it’s simple: use sockets and update as required. Linkora App handles this as
follows:`))},$$slots:{default:!0}});var Le=i(Ie,2);c(Le,{text:`private suspend fun updateLocalDBAccordingToEvent(
    deserializedWebSocketEvent: WebSocketEvent
) {
    when (deserializedWebSocketEvent.operation) {
        MARK_FOLDER_AS_ARCHIVE.name -> {
            val idBasedDTO = json.decodeFromJsonElement<IDBasedDTO>(
                deserializedWebSocketEvent.payload
            )
            if (idBasedDTO.correlation.isSameAsCurrentClient()) {
                preferencesRepository.updateLastSyncedWithServerTimeStamp(idBasedDTO.eventTimestamp)
                return
            }

            val folderId = localFoldersRepo.getLocalIdOfAFolder(idBasedDTO.id)
            if (folderId != null) {
                localFoldersRepo.markFolderAsArchive(
                    folderId, viaSocket = true
                ).collectAndUpdateTimestamp(idBasedDTO.eventTimestamp)
            }
        }
    }
}`});var Re=i(Le,2);f(Re,{children:(n,r)=>{s(),e(n,t(`Similarly handle for every possible operation.`))},$$slots:{default:!0}});var ze=i(Re,2);d(ze,{level:3,children:(n,r)=>{s(),e(n,t(`2. Custom implementations if the client is offline or disconnected from the server`))},$$slots:{default:!0}});var Be=i(ze,2);f(Be,{children:(n,r)=>{s(),e(n,t(`We need to handle two scenarios if the client is offline or disconnected from the server:`))},$$slots:{default:!0}});var X=i(Be,2),Ve=a(X);u(Ve,{children:(n,r)=>{f(n,{children:(n,r)=>{s(),e(n,t(`Handling deletions.`))},$$slots:{default:!0}})},$$slots:{default:!0}}),u(i(Ve),{children:(t,r)=>{f(t,{children:(t,r)=>{s();var a=ye();p(i(n(a)),{text:`TIME_STAMP`}),s(),e(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}}),o(X);var He=i(X,2);d(He,{level:3,children:(n,r)=>{s(),e(n,t(`2.1 Handling deletions when offline`))},$$slots:{default:!0}});var Ue=i(He,2);f(Ue,{children:(t,n)=>{s();var r=be();s(2),e(t,r)},$$slots:{default:!0}});var We=i(Ue,2);c(We,{text:`object TombstoneTable : LongIdTable("tombstone") {
    val deletedAt = long("deleted_at")
    val operation = text("operation")
    val payload = text("payload")
}`});var Ge=i(We,2);f(Ge,{children:(n,r)=>{s(),e(n,t(`The following example should give a brief idea about how this table is used:`))},$$slots:{default:!0}});var Ke=i(Ge,2);c(Ke,{text:`transaction {
    TombStoneHelper.insert(
        payload = Json.encodeToString(idBasedDTO),
        operation = LinkRoute.DELETE_A_LINK.name,
        deletedAt = eventTimestamp
    )
    LinksTable.deleteWhere {
        id.eq(idBasedDTO.id)
    }
}`});var Z=i(Ke,2);f(Z,{children:(n,r)=>{s(),e(n,t(`And now on the client side, when both the app and server are online, we pull these tombstone records and delete the
corresponding items locally.`))},$$slots:{default:!0}});var qe=i(Z,2);d(qe,{level:3,children:(n,r)=>{s(),e(n,t(`2.2 Updating data after the last known TIME_STAMP`))},$$slots:{default:!0}});var Je=i(qe,2);f(Je,{children:(t,n)=>{s();var r=xe();s(4),e(t,r)},$$slots:{default:!0}});var Ye=i(Je,2);c(Ye,{text:`LinksTable.selectAll().where {
    LinksTable.lastModified.greater(TIME_STAMP)
}.toList().forEach {
    updatedLinks.add(
        Link(
            id = it[LinksTable.id].value,
            linkType = LinkType.valueOf(it[LinksTable.linkType]),
            title = it[LinksTable.linkTitle],
            url = it[LinksTable.url],
            baseURL = it[LinksTable.baseURL],
            imgURL = it[LinksTable.imgURL],
            note = it[LinksTable.note],
            idOfLinkedFolder = it[LinksTable.idOfLinkedFolder],
            userAgent = it[LinksTable.userAgent],
            markedAsImportant = it[LinksTable.markedAsImportant],
            mediaType = MediaType.valueOf(it[LinksTable.mediaType]),
            eventTimestamp = it[LinksTable.lastModified]
        )
    )
}`});var Xe=i(Ye,2);f(Xe,{children:(n,r)=>{s(),e(n,t(`Now the collected updates will be sent back to client, which it will update accordingly.`))},$$slots:{default:!0}});var Ze=i(Xe,2);f(Ze,{children:(t,n)=>{s();var r=Se();s(2),e(t,r)},$$slots:{default:!0}});var Q=i(Ze,2),$=a(Q);u($,{children:(t,r)=>{f(t,{children:(t,r)=>{s();var a=Ce();m(i(n(a)),{src:`/images/linkora-sync/server-to-client-with-socket.png`}),e(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}}),u(i($),{children:(t,r)=>{f(t,{children:(t,r)=>{s();var a=we();m(i(n(a)),{src:`/images/linkora-sync/server-to-client-with-manual.png`}),e(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}}),o(Q),f(i(Q,6),{children:(n,r)=>{s(),e(n,t(`Overall, this is how synchronization works in Linkora. These operations are also used when performing manual syncing or
importing data from external files, but that is outside the context of this topic, hence I didn’t include it.`))},$$slots:{default:!0}}),e(r,h)}export{b as default,h as metadata};