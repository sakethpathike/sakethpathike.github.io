import{$ as e,C as t,I as n,L as r,Q as i,R as a,S as o,b as s}from"./C5o3b5G5.js";import"./CFKVnMbq.js";import"./-ToDqmqz.js";import{t as c}from"./DgtPQTdQ.js";import{a as l,i as u,o as d,r as f,s as p}from"./CyA6SKKM.js";var m={title:`Synchronization in Linkora`,description:`Offline-First Two-Way Sync with Conflict Resolution That Just Works.`,pubDatetime:`Feb 16, 2025 01:05 PM IST`},{title:h,description:g,pubDatetime:ee}=m,te=o(`<a href="https://github.com/LinkoraApp/Linkora" rel="nofollow">Linkora App</a> uses multiple <em>techniques</em> to make sure the data is synced with the
remote database even when the <a href="https://github.com/LinkoraApp/sync-server" rel="nofollow">self-hostable sync-server</a> is
not up (i.e., Linkora will push changes once the server is up the next time). Most of the important parts of this
implementation happen in the app because it’s the source of the data, so we’ll have fine control over what’s supposed to
be pushed and what’s not.`,1),ne=o(`Linkora supports <code>Two-Way Sync</code> synchronization. It’s up to people who use the app to decide how to use the syncing
method.
Linkora supports:`,1),re=o(`By this, it is straightforward to understand that if the sync type is set to <code>Two-Way Sync</code> , both of these conditional
blocks will be true. Hence, we need to implement <code>Client-to-Server</code> and <code>Server-To-Client</code> .`,1),ie=o(`Pushing <!>-<!>-<!> operations that happen locally.
That’s all we care about. But there may be cases when the <!> might not be up. In that case, we need to
save what’s supposed to be pushed so that whenever the server and app are up, the app can send those changes. This
also makes it local-first, as irrespective of server changes; it will always update locally.`,1),ae=o(`Now, the first thing is to <strong>try saving locally and then pushing the changes</strong> . There are many operations where we need
to push changes to the server, so I made a generic function that works for all these cases where we need to perform
local operations and then push to the remote server:`,1),oe=o(`If pushing fails, <!> will be triggered if the sync type is set to <!> or <!>.`,1),se=o(`For that, I have a table called <code>PendingSyncQueue</code> :`,1),ce=o(`Now, the <code>operation</code> refers to the endpoint at which the operation needs to be performed, and the <code>payload</code> is the body
of the POST request.`,1),le=o(`Where <strong>every</strong> DTO contains <code>correlation</code> . Here, the <code>IDBasedDTO</code> looks like:`,1),ue=o(`<code>Correlation</code> helps in identifying the client which performs the operation, because we don’t want to perform locally
after reading remote updates if that update was performed by us. If done by a different client, it won’t match our <code>Correlation</code> , so we can perform that knowing we’re not the source.`,1),de=o(`Now, once the server and app are both online, we can send queued data from <code>PendingSyncQueue</code> . For the same example
considered earlier, here’s how it will be sent:`,1),fe=o(`This way, we can confirm the client will definitely send the data to the server <em>(if it gets uninstalled, we can’t do
anything about it)</em> .`,1),pe=o(`In conclusion, the following image should give you a clear idea of how all these components work together to ensure <code>Client-to-Server</code> sync works as expected:`,1),me=o(`To support this, every table contains a column called <code>lastModified</code> , which will also be sent in the POST request body
and is needed for the <code>sync-server</code> :`,1),he=o(`<code>Client-to-Server</code> focuses on pushing changes, while <code>Server-to-Client</code> focuses on reading changes that occurred on the remote database through the server.`,1),ge=o(`The app saves a <code>TIME_STAMP</code> in its preferences, updated at every successful remote request. The <code>TIME_STAMP</code> value is
sent from the server (since server operations happen there).`,1),_e=o(`<strong>Using sockets</strong> if both app and server are online.`,1),ve=o(`<strong>Custom implementations</strong> if the client is offline or disconnected from the server.`,1),ye=o(`Updating data after the last known <!>.`,1),be=o(`We track deleted items using a server-side <code>Tombstone</code> table structured as:`,1),xe=o(`As mentioned earlier, the local database in the app contains a column called <code>lastModified</code> . Similarly, tables in the
remote database also include this column. The app sends its last known <code>TIME_STAMP</code> to the server, which returns all
changes made after that timestamp:`,1),Se=o(`In conclusion, the following images should give you a clear idea of how all these components work together to make sure <code>Server-to-Client</code> sync operates as expected:`,1),Ce=o(`If both app and server are online. <!>`,1),we=o(`If the client is offline or disconnected from the server. <!>`,1),Te=o(`<!> <!> <!><!><!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!><!><!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <p><!></p> <!> <!> <!> <!> <!> <!> <!> <!> <!><!> <!> <!> <!> <!> <!> <!> <!><!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!><!> <div style="height: 6px"></div> <hr/> <!>`,1);function _(o){var m=Te(),h=r(m);f(h,{children:(e,t)=>{var n=te();i(5),s(e,n)},$$slots:{default:!0}});var g=a(h,2);f(g,{children:(e,t)=>{i();var n=ne();i(2),s(e,n)},$$slots:{default:!0}});var ee=a(g,2);u(ee,{children:(e,t)=>{l(e,{text:`Client To Server`})},$$slots:{default:!0}});var _=a(ee);u(_,{children:(e,t)=>{l(e,{text:`Server To Client`})},$$slots:{default:!0}});var v=a(_);u(v,{children:(e,t)=>{l(e,{text:`Two-Way Sync`})},$$slots:{default:!0}});var y=a(v,2);f(y,{children:(e,n)=>{i(),s(e,t(`Based on the selected option, Linkora will handle the respective implementations.`))},$$slots:{default:!0}});var b=a(y,2);f(b,{children:(e,n)=>{i(),s(e,t(`All this in a nutshell looks like:`))},$$slots:{default:!0}});var x=a(b,2);c(x,{text:`suspend fun syncData() {
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
}`});var S=a(x,2);f(S,{children:(e,t)=>{i();var n=re();i(6),s(e,n)},$$slots:{default:!0}});var C=a(S,2);p(C,{level:3,children:(e,n)=>{i(),s(e,t(`1. Client-to-Server`))},$$slots:{default:!0}});var w=a(C,2);f(w,{children:(e,n)=>{i(),s(e,t(`In this case, we only need to consider:`))},$$slots:{default:!0}});var T=a(w,2);u(T,{children:(e,t)=>{i();var n=ie(),o=a(r(n));l(o,{text:`CREATE`});var c=a(o,2);l(c,{text:`UPDATE`});var u=a(c,2);l(u,{text:`DELETE`}),l(a(u,2),{text:`sync-server`}),i(),s(e,n)},$$slots:{default:!0}});var E=a(T,2);f(E,{children:(e,t)=>{i();var n=ae();i(2),s(e,n)},$$slots:{default:!0}});var D=a(E,2);c(D,{text:`fun <LocalType, RemoteType> performLocalOperationWithRemoteSyncFlow(
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
}`});var O=a(D,2);f(O,{children:(e,n)=>{i(),s(e,t(`It may seem like a lot is happening, but it’s not. What this does is:`))},$$slots:{default:!0}});var k=a(O,2);u(k,{children:(e,n)=>{i(),s(e,t(`Perform local operation.`))},$$slots:{default:!0}});var A=a(k);u(A,{children:(e,n)=>{i(),s(e,t(`Try to push changes. If successful, the operation is successful.`))},$$slots:{default:!0}});var j=a(A);u(j,{children:(e,t)=>{i();var n=oe(),o=a(r(n));l(o,{text:`onRemoteOperationFailure()`});var c=a(o,2);l(c,{text:`Client-to-Server`}),l(a(c,2),{text:`Two-Way Sync`}),i(),s(e,n)},$$slots:{default:!0}});var M=a(j,2);f(M,{children:(e,n)=>{i(),s(e,t(`Now we need to figure out how to save the operations locally when there’s a failure on the remote server (mostly because
the server is down), so once the server is up, Linkora App can send those operations.`))},$$slots:{default:!0}});var N=a(M,2);f(N,{children:(e,t)=>{i();var n=se();i(2),s(e,n)},$$slots:{default:!0}});var P=a(N,2);c(P,{text:`@Entity("pending_sync_queue")
data class PendingSyncQueue(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val operation: String,
    val payload: String
)`});var F=a(P,2);f(F,{children:(e,t)=>{i();var n=ce();i(4),s(e,n)},$$slots:{default:!0}});var Ee=a(F,2);f(Ee,{children:(e,n)=>{i(),s(e,t(`A simple example of how this is done:`))},$$slots:{default:!0}});var I=a(Ee,2);c(I,{text:`onRemoteOperationFailure = {
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
}`});var L=a(I,2);f(L,{children:(e,t)=>{i();var n=le();i(6),s(e,n)},$$slots:{default:!0}});var R=a(L,2);c(R,{text:`@Serializable
data class IDBasedDTO(
    val id: Long,
    val eventTimestamp: Long,
    val correlation: Correlation
)

@Serializable
data class Correlation(
    val id: String, val clientName: String
)`});var z=a(R,2);f(z,{children:(e,t)=>{var n=ue();i(3),s(e,n)},$$slots:{default:!0}});var B=a(z,2);f(B,{children:(e,t)=>{i();var n=de();i(2),s(e,n)},$$slots:{default:!0}});var V=a(B,2);c(V,{text:`when (queue.operation) {
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
)`});var H=a(V,2);f(H,{children:(e,t)=>{i();var n=fe();i(2),s(e,n)},$$slots:{default:!0}});var U=a(H,2);f(U,{children:(e,t)=>{i();var n=pe();i(2),s(e,n)},$$slots:{default:!0}});var W=a(U,2);d(n(W),{src:`/images/linkora-sync/client-to-server.png`}),e(W);var G=a(W,2);f(G,{children:(e,n)=>{i(),s(e,t(`Now on the server-side, LWW (Last Write Wins) is implemented for some routes where updating is required. This makes sure
the server only updates newer values in case all clients and the server aren’t up at the same time:`))},$$slots:{default:!0}});var K=a(G,2);c(K,{text:`// on server-side
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
}`});var q=a(K,2);f(q,{children:(e,t)=>{i();var n=me();i(4),s(e,n)},$$slots:{default:!0}});var J=a(q,2);c(J,{text:`@Entity(tableName = "folders")
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
)`});var Y=a(J,2);p(Y,{level:3,children:(e,n)=>{i(),s(e,t(`2. Server-to-Client`))},$$slots:{default:!0}});var X=a(Y,2);f(X,{children:(e,t)=>{var n=he();i(3),s(e,n)},$$slots:{default:!0}});var Z=a(X,2);f(Z,{children:(e,t)=>{i();var n=ge();i(4),s(e,n)},$$slots:{default:!0}});var De=a(Z,2);f(De,{children:(e,n)=>{i(),s(e,t(`Changes can be read in two ways:`))},$$slots:{default:!0}});var Oe=a(De,2);u(Oe,{children:(e,t)=>{var n=_e();i(),s(e,n)},$$slots:{default:!0}});var ke=a(Oe);u(ke,{children:(e,t)=>{var n=ve();i(),s(e,n)},$$slots:{default:!0}});var Ae=a(ke,2);p(Ae,{level:3,children:(e,n)=>{i(),s(e,t(`1. Using sockets if both app and server are online`))},$$slots:{default:!0}});var je=a(Ae,2);f(je,{children:(e,n)=>{i(),s(e,t(`When both app and server are online, it’s simple: use sockets and update as required. Linkora App handles this as
follows:`))},$$slots:{default:!0}});var Me=a(je,2);c(Me,{text:`private suspend fun updateLocalDBAccordingToEvent(
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
}`});var Ne=a(Me,2);f(Ne,{children:(e,n)=>{i(),s(e,t(`Similarly handle for every possible operation.`))},$$slots:{default:!0}});var Pe=a(Ne,2);p(Pe,{level:3,children:(e,n)=>{i(),s(e,t(`2. Custom implementations if the client is offline or disconnected from the server`))},$$slots:{default:!0}});var Fe=a(Pe,2);f(Fe,{children:(e,n)=>{i(),s(e,t(`We need to handle two scenarios if the client is offline or disconnected from the server:`))},$$slots:{default:!0}});var Q=a(Fe,2);u(Q,{children:(e,n)=>{i(),s(e,t(`Handling deletions.`))},$$slots:{default:!0}});var Ie=a(Q);u(Ie,{children:(e,t)=>{i();var n=ye();l(a(r(n)),{text:`TIME_STAMP`}),i(),s(e,n)},$$slots:{default:!0}});var Le=a(Ie,2);p(Le,{level:3,children:(e,n)=>{i(),s(e,t(`2.1 Handling deletions when offline`))},$$slots:{default:!0}});var Re=a(Le,2);f(Re,{children:(e,t)=>{i();var n=be();i(2),s(e,n)},$$slots:{default:!0}});var ze=a(Re,2);c(ze,{text:`object TombstoneTable : LongIdTable("tombstone") {
    val deletedAt = long("deleted_at")
    val operation = text("operation")
    val payload = text("payload")
}`});var Be=a(ze,2);f(Be,{children:(e,n)=>{i(),s(e,t(`The following example should give a brief idea about how this table is used:`))},$$slots:{default:!0}});var Ve=a(Be,2);c(Ve,{text:`transaction {
    TombStoneHelper.insert(
        payload = Json.encodeToString(idBasedDTO),
        operation = LinkRoute.DELETE_A_LINK.name,
        deletedAt = eventTimestamp
    )
    LinksTable.deleteWhere {
        id.eq(idBasedDTO.id)
    }
}`});var He=a(Ve,2);f(He,{children:(e,n)=>{i(),s(e,t(`And now on the client side, when both the app and server are online, we pull these tombstone records and delete the
corresponding items locally.`))},$$slots:{default:!0}});var Ue=a(He,2);p(Ue,{level:3,children:(e,n)=>{i(),s(e,t(`2.2 Updating data after the last known TIME_STAMP`))},$$slots:{default:!0}});var We=a(Ue,2);f(We,{children:(e,t)=>{i();var n=xe();i(4),s(e,n)},$$slots:{default:!0}});var Ge=a(We,2);c(Ge,{text:`LinksTable.selectAll().where {
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
}`});var Ke=a(Ge,2);f(Ke,{children:(e,n)=>{i(),s(e,t(`Now the collected updates will be sent back to client, which it will update accordingly.`))},$$slots:{default:!0}});var qe=a(Ke,2);f(qe,{children:(e,t)=>{i();var n=Se();i(2),s(e,n)},$$slots:{default:!0}});var Je=a(qe,2);u(Je,{children:(e,t)=>{i();var n=Ce();d(a(r(n)),{src:`/images/linkora-sync/server-to-client-with-socket.png`}),s(e,n)},$$slots:{default:!0}});var $=a(Je);u($,{children:(e,t)=>{i();var n=we();d(a(r(n)),{src:`/images/linkora-sync/server-to-client-with-manual.png`}),s(e,n)},$$slots:{default:!0}}),f(a($,6),{children:(e,n)=>{i(),s(e,t(`Overall, this is how synchronization works in Linkora. These operations are also used when performing manual syncing or
importing data from external files, but that is outside the context of this topic, hence I didn’t include it.`))},$$slots:{default:!0}}),s(o,m)}export{_ as default,m as metadata};