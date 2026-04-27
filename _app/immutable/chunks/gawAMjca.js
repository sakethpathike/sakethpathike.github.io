import{$ as e,C as t,I as n,L as r,Q as i,R as a,S as o,b as s}from"./C5o3b5G5.js";import"./CFKVnMbq.js";import{t as c}from"./Bkc47lp_.js";import"./CjxBab8z.js";import{t as l}from"./Dm8Fcjhe.js";import{a as u,i as d,o as f,r as p,s as m}from"./DZLfe_TQ.js";var h={title:`Data Synchronization in Linkora`,description:`Old skool synchronization methods still hold up.`,pubDatetime:`Feb 16, 2025 01:05 PM IST`},{title:g,description:_,pubDatetime:ee}=h,te=o(`Update (April 15, 2026)<br/><br/>This post goes over the custom sync setup that runs Linkora today, which
combines an
operation queue with basic Last-Write-Wins and tombstones. While this gets the job done for a single user, there are
more solid ways to handle offline data, and I am currently looking into proper CRDTs.`,1),ne=o(`<a href="https://github.com/LinkoraApp/Linkora" rel="nofollow">Linkora App</a> uses multiple <em>techniques</em> to make sure the data is synced with the
remote database even when the <a href="https://github.com/LinkoraApp/sync-server" rel="nofollow">self-hostable sync-server</a> is
not up (i.e., Linkora will push changes once the server is up the next time). Most of the important parts of this
implementation happen in the app because it’s the source of the data, so we’ll have fine control over what’s supposed to
be pushed and what’s not.`,1),re=o(`Linkora supports <code>Two-Way Sync</code> synchronization. It’s up to people who use the app to decide how to use the syncing
method.
Linkora supports:`,1),ie=o(`By this, it is straightforward to understand that if the sync type is set to <code>Two-Way Sync</code> , both of these conditional
blocks will be true. Hence, we need to implement <code>Client-to-Server</code> and <code>Server-To-Client</code> .`,1),ae=o(`Pushing <!>-<!>-<!> operations that happen locally.
That’s all we care about. But there may be cases when the <!> might not be up. In that case, we need to
save what’s supposed to be pushed so that whenever the server and app are up, the app can send those changes. This
also makes it local-first, as irrespective of server changes; it will always update locally.`,1),oe=o(`Now, the first thing is to <strong>try saving locally and then pushing the changes</strong> . There are many operations where we need
to push changes to the server, so I made a generic function that works for all these cases where we need to perform
local operations and then push to the remote server:`,1),se=o(`If pushing fails, <!> will be triggered if the sync type is set to <!> or <!>.`,1),ce=o(`For that, I have a table called <code>PendingSyncQueue</code> :`,1),le=o(`Now, the <code>operation</code> refers to the endpoint at which the operation needs to be performed, and the <code>payload</code> is the body
of the POST request.`,1),ue=o(`Where <strong>every</strong> DTO contains <code>correlation</code> . Here, the <code>IDBasedDTO</code> looks like:`,1),de=o(`<code>Correlation</code> helps in identifying the client which performs the operation, because we don’t want to perform locally
after reading remote updates if that update was performed by us. If done by a different client, it won’t match our <code>Correlation</code> , so we can perform that knowing we’re not the source.`,1),fe=o(`Now, once the server and app are both online, we can send queued data from <code>PendingSyncQueue</code> . For the same example
considered earlier, here’s how it will be sent:`,1),pe=o(`This way, we can confirm the client will definitely send the data to the server <em>(if it gets uninstalled, we can’t do
anything about it)</em> .`,1),me=o(`In conclusion, the following image should give you a clear idea of how all these components work together to ensure <code>Client-to-Server</code> sync works as expected:`,1),he=o(`To support this, every table contains a column called <code>lastModified</code> , which will also be sent in the POST request body
and is needed for the <code>sync-server</code> :`,1),ge=o(`<code>Client-to-Server</code> focuses on pushing changes, while <code>Server-to-Client</code> focuses on reading changes that occurred on the remote database through the server.`,1),_e=o(`The app saves a <code>TIME_STAMP</code> in its preferences, updated at every successful remote request. The <code>TIME_STAMP</code> value is
sent from the server (since server operations happen there).`,1),ve=o(`<strong>Using sockets</strong> if both app and server are online.`,1),ye=o(`<strong>Custom implementations</strong> if the client is offline or disconnected from the server.`,1),be=o(`Updating data after the last known <!>.`,1),xe=o(`We track deleted items using a server-side <code>Tombstone</code> table structured as:`,1),Se=o(`As mentioned earlier, the local database in the app contains a column called <code>lastModified</code> . Similarly, tables in the
remote database also include this column. The app sends its last known <code>TIME_STAMP</code> to the server, which returns all
changes made after that timestamp:`,1),Ce=o(`In conclusion, the following images should give you a clear idea of how all these components work together to make sure <code>Server-to-Client</code> sync operates as expected:`,1),we=o(`If both app and server are online. <!>`,1),Te=o(`If the client is offline or disconnected from the server. <!>`,1),Ee=o(`<!> <!> <!> <!><!><!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!><!><!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <p><!></p> <!> <!> <!> <!> <!> <!> <!> <!> <!><!> <!> <!> <!> <!> <!> <!> <!><!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!><!> <div style="height: 6px"></div> <hr/> <!>`,1);function v(o){var h=Ee(),g=r(h);c(g,{children:(e,t)=>{i();var n=te();i(3),s(e,n)},$$slots:{default:!0}});var _=a(g,2);p(_,{children:(e,t)=>{var n=ne();i(5),s(e,n)},$$slots:{default:!0}});var ee=a(_,2);p(ee,{children:(e,t)=>{i();var n=re();i(2),s(e,n)},$$slots:{default:!0}});var v=a(ee,2);d(v,{children:(e,t)=>{u(e,{text:`Client To Server`})},$$slots:{default:!0}});var y=a(v);d(y,{children:(e,t)=>{u(e,{text:`Server To Client`})},$$slots:{default:!0}});var b=a(y);d(b,{children:(e,t)=>{u(e,{text:`Two-Way Sync`})},$$slots:{default:!0}});var x=a(b,2);p(x,{children:(e,n)=>{i(),s(e,t(`Based on the selected option, Linkora will handle the respective implementations.`))},$$slots:{default:!0}});var S=a(x,2);p(S,{children:(e,n)=>{i(),s(e,t(`All this in a nutshell looks like:`))},$$slots:{default:!0}});var C=a(S,2);l(C,{text:`suspend fun syncData() {
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
}`});var w=a(C,2);p(w,{children:(e,t)=>{i();var n=ie();i(6),s(e,n)},$$slots:{default:!0}});var T=a(w,2);m(T,{level:3,children:(e,n)=>{i(),s(e,t(`1. Client-to-Server`))},$$slots:{default:!0}});var E=a(T,2);p(E,{children:(e,n)=>{i(),s(e,t(`In this case, we only need to consider:`))},$$slots:{default:!0}});var D=a(E,2);d(D,{children:(e,t)=>{i();var n=ae(),o=a(r(n));u(o,{text:`CREATE`});var c=a(o,2);u(c,{text:`UPDATE`});var l=a(c,2);u(l,{text:`DELETE`}),u(a(l,2),{text:`sync-server`}),i(),s(e,n)},$$slots:{default:!0}});var O=a(D,2);p(O,{children:(e,t)=>{i();var n=oe();i(2),s(e,n)},$$slots:{default:!0}});var k=a(O,2);l(k,{text:`fun <LocalType, RemoteType> performLocalOperationWithRemoteSyncFlow(
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
}`});var A=a(k,2);p(A,{children:(e,n)=>{i(),s(e,t(`It may seem like a lot is happening, but it’s not. What this does is:`))},$$slots:{default:!0}});var j=a(A,2);d(j,{children:(e,n)=>{i(),s(e,t(`Perform local operation.`))},$$slots:{default:!0}});var M=a(j);d(M,{children:(e,n)=>{i(),s(e,t(`Try to push changes. If successful, the operation is successful.`))},$$slots:{default:!0}});var N=a(M);d(N,{children:(e,t)=>{i();var n=se(),o=a(r(n));u(o,{text:`onRemoteOperationFailure()`});var c=a(o,2);u(c,{text:`Client-to-Server`}),u(a(c,2),{text:`Two-Way Sync`}),i(),s(e,n)},$$slots:{default:!0}});var P=a(N,2);p(P,{children:(e,n)=>{i(),s(e,t(`Now we need to figure out how to save the operations locally when there’s a failure on the remote server (mostly because
the server is down), so once the server is up, Linkora App can send those operations.`))},$$slots:{default:!0}});var F=a(P,2);p(F,{children:(e,t)=>{i();var n=ce();i(2),s(e,n)},$$slots:{default:!0}});var De=a(F,2);l(De,{text:`@Entity("pending_sync_queue")
data class PendingSyncQueue(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val operation: String,
    val payload: String
)`});var I=a(De,2);p(I,{children:(e,t)=>{i();var n=le();i(4),s(e,n)},$$slots:{default:!0}});var L=a(I,2);p(L,{children:(e,n)=>{i(),s(e,t(`A simple example of how this is done:`))},$$slots:{default:!0}});var R=a(L,2);l(R,{text:`onRemoteOperationFailure = {
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
}`});var z=a(R,2);p(z,{children:(e,t)=>{i();var n=ue();i(6),s(e,n)},$$slots:{default:!0}});var B=a(z,2);l(B,{text:`@Serializable
data class IDBasedDTO(
    val id: Long,
    val eventTimestamp: Long,
    val correlation: Correlation
)

@Serializable
data class Correlation(
    val id: String, val clientName: String
)`});var V=a(B,2);p(V,{children:(e,t)=>{var n=de();i(3),s(e,n)},$$slots:{default:!0}});var H=a(V,2);p(H,{children:(e,t)=>{i();var n=fe();i(2),s(e,n)},$$slots:{default:!0}});var U=a(H,2);l(U,{text:`when (queue.operation) {
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
)`});var W=a(U,2);p(W,{children:(e,t)=>{i();var n=pe();i(2),s(e,n)},$$slots:{default:!0}});var G=a(W,2);p(G,{children:(e,t)=>{i();var n=me();i(2),s(e,n)},$$slots:{default:!0}});var K=a(G,2);f(n(K),{src:`/images/linkora-sync/client-to-server.png`}),e(K);var q=a(K,2);p(q,{children:(e,n)=>{i(),s(e,t(`Now on the server-side, LWW (Last Write Wins) is implemented for some routes where updating is required. This makes sure
the server only updates newer values in case all clients and the server aren’t up at the same time:`))},$$slots:{default:!0}});var J=a(q,2);l(J,{text:`// on server-side
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
}`});var Y=a(J,2);p(Y,{children:(e,t)=>{i();var n=he();i(4),s(e,n)},$$slots:{default:!0}});var X=a(Y,2);l(X,{text:`@Entity(tableName = "folders")
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
)`});var Z=a(X,2);m(Z,{level:3,children:(e,n)=>{i(),s(e,t(`2. Server-to-Client`))},$$slots:{default:!0}});var Oe=a(Z,2);p(Oe,{children:(e,t)=>{var n=ge();i(3),s(e,n)},$$slots:{default:!0}});var ke=a(Oe,2);p(ke,{children:(e,t)=>{i();var n=_e();i(4),s(e,n)},$$slots:{default:!0}});var Ae=a(ke,2);p(Ae,{children:(e,n)=>{i(),s(e,t(`Changes can be read in two ways:`))},$$slots:{default:!0}});var je=a(Ae,2);d(je,{children:(e,t)=>{var n=ve();i(),s(e,n)},$$slots:{default:!0}});var Me=a(je);d(Me,{children:(e,t)=>{var n=ye();i(),s(e,n)},$$slots:{default:!0}});var Ne=a(Me,2);m(Ne,{level:3,children:(e,n)=>{i(),s(e,t(`1. Using sockets if both app and server are online`))},$$slots:{default:!0}});var Pe=a(Ne,2);p(Pe,{children:(e,n)=>{i(),s(e,t(`When both app and server are online, it’s simple: use sockets and update as required. Linkora App handles this as
follows:`))},$$slots:{default:!0}});var Fe=a(Pe,2);l(Fe,{text:`private suspend fun updateLocalDBAccordingToEvent(
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
}`});var Ie=a(Fe,2);p(Ie,{children:(e,n)=>{i(),s(e,t(`Similarly handle for every possible operation.`))},$$slots:{default:!0}});var Le=a(Ie,2);m(Le,{level:3,children:(e,n)=>{i(),s(e,t(`2. Custom implementations if the client is offline or disconnected from the server`))},$$slots:{default:!0}});var Re=a(Le,2);p(Re,{children:(e,n)=>{i(),s(e,t(`We need to handle two scenarios if the client is offline or disconnected from the server:`))},$$slots:{default:!0}});var ze=a(Re,2);d(ze,{children:(e,n)=>{i(),s(e,t(`Handling deletions.`))},$$slots:{default:!0}});var Be=a(ze);d(Be,{children:(e,t)=>{i();var n=be();u(a(r(n)),{text:`TIME_STAMP`}),i(),s(e,n)},$$slots:{default:!0}});var Ve=a(Be,2);m(Ve,{level:3,children:(e,n)=>{i(),s(e,t(`2.1 Handling deletions when offline`))},$$slots:{default:!0}});var He=a(Ve,2);p(He,{children:(e,t)=>{i();var n=xe();i(2),s(e,n)},$$slots:{default:!0}});var Q=a(He,2);l(Q,{text:`object TombstoneTable : LongIdTable("tombstone") {
    val deletedAt = long("deleted_at")
    val operation = text("operation")
    val payload = text("payload")
}`});var Ue=a(Q,2);p(Ue,{children:(e,n)=>{i(),s(e,t(`The following example should give a brief idea about how this table is used:`))},$$slots:{default:!0}});var We=a(Ue,2);l(We,{text:`transaction {
    TombStoneHelper.insert(
        payload = Json.encodeToString(idBasedDTO),
        operation = LinkRoute.DELETE_A_LINK.name,
        deletedAt = eventTimestamp
    )
    LinksTable.deleteWhere {
        id.eq(idBasedDTO.id)
    }
}`});var Ge=a(We,2);p(Ge,{children:(e,n)=>{i(),s(e,t(`And now on the client side, when both the app and server are online, we pull these tombstone records and delete the
corresponding items locally.`))},$$slots:{default:!0}});var Ke=a(Ge,2);m(Ke,{level:3,children:(e,n)=>{i(),s(e,t(`2.2 Updating data after the last known TIME_STAMP`))},$$slots:{default:!0}});var qe=a(Ke,2);p(qe,{children:(e,t)=>{i();var n=Se();i(4),s(e,n)},$$slots:{default:!0}});var Je=a(qe,2);l(Je,{text:`LinksTable.selectAll().where {
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
}`});var Ye=a(Je,2);p(Ye,{children:(e,n)=>{i(),s(e,t(`Now the collected updates will be sent back to client, which it will update accordingly.`))},$$slots:{default:!0}});var Xe=a(Ye,2);p(Xe,{children:(e,t)=>{i();var n=Ce();i(2),s(e,n)},$$slots:{default:!0}});var Ze=a(Xe,2);d(Ze,{children:(e,t)=>{i();var n=we();f(a(r(n)),{src:`/images/linkora-sync/server-to-client-with-socket.png`}),s(e,n)},$$slots:{default:!0}});var $=a(Ze);d($,{children:(e,t)=>{i();var n=Te();f(a(r(n)),{src:`/images/linkora-sync/server-to-client-with-manual.png`}),s(e,n)},$$slots:{default:!0}}),p(a($,6),{children:(e,n)=>{i(),s(e,t(`Overall, this is how synchronization works in Linkora. These operations are also used when performing manual syncing or
importing data from external files, but that is outside the context of this topic, hence I didn’t include it.`))},$$slots:{default:!0}}),s(o,h)}export{v as default,h as metadata};