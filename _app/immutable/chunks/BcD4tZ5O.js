import{C as e,D as t,H as n,T as r,U as i,V as a,it as o,rt as s}from"./BZpmPeOn.js";import"./D1hYfEew.js";import"./CsQX8471.js";import{t as c}from"./DsZaJxEG.js";import{a as l,c as u,l as d,o as f,s as p,t as ee}from"./Dt5Jn2kq.js";var m={title:`Data Synchronization in Linkora`,description:``,pubDatetime:`Feb 16, 2025 01:05 PM IST`,staticRes:`linkora-sync`},{title:h,description:g,pubDatetime:_,staticRes:v}=m,te=r(`Update (April 15, 2026)<br/><br/>This post goes over the custom sync setup that runs Linkora today, which
combines an
operation queue with basic Last-Write-Wins and tombstones. While this gets the job done for a single user, there are
more solid ways to handle offline data, and I am currently looking into proper CRDTs.`,1),ne=r(`<a href="https://github.com/LinkoraApp/Linkora" rel="nofollow">Linkora App</a> uses multiple <em>techniques</em> to make sure the data is synced with the
remote database even when the <a href="https://github.com/LinkoraApp/sync-server" rel="nofollow">self-hostable sync-server</a> is
not up (i.e., Linkora will push changes once the server is up the next time). Most of the important parts of this
implementation happen in the app because it’s the source of the data, so we’ll have fine control over what’s supposed to
be pushed and what’s not.`,1),re=r(`Linkora supports <code>Two-Way Sync</code> synchronization. It’s up to people who use the app to decide how to use the syncing
method.
Linkora supports:`,1),ie=r(`By this, it is straightforward to understand that if the sync type is set to <code>Two-Way Sync</code> , both of these conditional
blocks will be true. Hence, we need to implement <code>Client-to-Server</code> and <code>Server-To-Client</code> .`,1),ae=r(`Pushing <!>-<!>-<!> operations that happen locally.
That’s all we care about. But there may be cases when the <!> might not be up. In that case, we need to
save what’s supposed to be pushed so that whenever the server and app are up, the app can send those changes. This
also makes it local-first, as irrespective of server changes; it will always update locally.`,1),oe=r(`Now, the first thing is to <strong>try saving locally and then pushing the changes</strong> . There are many operations where we need
to push changes to the server, so I made a generic function that works for all these cases where we need to perform
local operations and then push to the remote server:`,1),se=r(`If pushing fails, <!> will be triggered if the sync type is set to <!> or <!>.`,1),ce=r(`For that, I have a table called <code>PendingSyncQueue</code> :`,1),le=r(`Now, the <code>operation</code> refers to the endpoint at which the operation needs to be performed, and the <code>payload</code> is the body
of the POST request.`,1),ue=r(`Where <strong>every</strong> DTO contains <code>correlation</code> . Here, the <code>IDBasedDTO</code> looks like:`,1),de=r(`<code>Correlation</code> helps in identifying the client which performs the operation, because we don’t want to perform locally
after reading remote updates if that update was performed by us. If done by a different client, it won’t match our <code>Correlation</code> , so we can perform that knowing we’re not the source.`,1),fe=r(`Now, once the server and app are both online, we can send queued data from <code>PendingSyncQueue</code> . For the same example
considered earlier, here’s how it will be sent:`,1),pe=r(`This way, we can confirm the client will definitely send the data to the server <em>(if it gets uninstalled, we can’t do
anything about it)</em> .`,1),me=r(`In conclusion, the following image should give you a clear idea of how all these components work together to ensure <code>Client-to-Server</code> sync works as expected:`,1),he=r(`To support this, every table contains a column called <code>lastModified</code> , which will also be sent in the POST request body
and is needed for the <code>sync-server</code> :`,1),ge=r(`<code>Client-to-Server</code> focuses on pushing changes, while <code>Server-to-Client</code> focuses on reading changes that occurred on the remote database through the server.`,1),_e=r(`The app saves a <code>TIME_STAMP</code> in its preferences, updated at every successful remote request. The <code>TIME_STAMP</code> value is
sent from the server (since server operations happen there).`,1),ve=r(`<strong>Using sockets</strong> if both app and server are online.`,1),ye=r(`<strong>Custom implementations</strong> if the client is offline or disconnected from the server.`,1),be=r(`Updating data after the last known <!>.`,1),xe=r(`We track deleted items using a server-side <code>Tombstone</code> table structured as:`,1),Se=r(`As mentioned earlier, the local database in the app contains a column called <code>lastModified</code> . Similarly, tables in the
remote database also include this column. The app sends its last known <code>TIME_STAMP</code> to the server, which returns all
changes made after that timestamp:`,1),Ce=r(`In conclusion, the following images should give you a clear idea of how all these components work together to make sure <code>Server-to-Client</code> sync operates as expected:`,1),we=r(`If both app and server are online. <!>`,1),Te=r(`If the client is offline or disconnected from the server. <!>`,1),Ee=r(`<!> <!> <!> <ul><!><!><!></ul> <!> <!> <!> <!> <!> <!> <ol><!></ol> <!> <!> <!> <ol><!><!><!></ol> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <p><!></p> <!> <!> <!> <!> <!> <!> <!> <!> <ol><!><!></ol> <!> <!> <!> <!> <!> <!> <ol><!><!></ol> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <ol><!><!></ol> <div style="height: 6px"></div> <hr/> <!>`,1);function y(r){var m=Ee(),h=n(m);ee(h,{children:(t,n)=>{s();var r=te();s(3),e(t,r)},$$slots:{default:!0}});var g=i(h,2);l(g,{children:(t,n)=>{var r=ne();s(5),e(t,r)},$$slots:{default:!0}});var _=i(g,2);l(_,{children:(t,n)=>{s();var r=re();s(2),e(t,r)},$$slots:{default:!0}});var v=i(_,2),y=a(v);f(y,{children:(e,t)=>{l(e,{children:(e,t)=>{p(e,{text:`Client To Server`})},$$slots:{default:!0}})},$$slots:{default:!0}});var b=i(y);f(b,{children:(e,t)=>{l(e,{children:(e,t)=>{p(e,{text:`Server To Client`})},$$slots:{default:!0}})},$$slots:{default:!0}}),f(i(b),{children:(e,t)=>{l(e,{children:(e,t)=>{p(e,{text:`Two-Way Sync`})},$$slots:{default:!0}})},$$slots:{default:!0}}),o(v);var x=i(v,2);l(x,{children:(n,r)=>{s(),e(n,t(`Based on the selected option, Linkora will handle the respective implementations.`))},$$slots:{default:!0}});var S=i(x,2);l(S,{children:(n,r)=>{s(),e(n,t(`All this in a nutshell looks like:`))},$$slots:{default:!0}});var C=i(S,2);c(C,{text:`suspend fun syncData() {
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
}`});var w=i(C,2);l(w,{children:(t,n)=>{s();var r=ie();s(6),e(t,r)},$$slots:{default:!0}});var T=i(w,2);d(T,{level:3,children:(n,r)=>{s(),e(n,t(`1. Client-to-Server`))},$$slots:{default:!0}});var E=i(T,2);l(E,{children:(n,r)=>{s(),e(n,t(`In this case, we only need to consider:`))},$$slots:{default:!0}});var D=i(E,2);f(a(D),{children:(t,r)=>{l(t,{children:(t,r)=>{s();var a=ae(),o=i(n(a));p(o,{text:`CREATE`});var c=i(o,2);p(c,{text:`UPDATE`});var l=i(c,2);p(l,{text:`DELETE`}),p(i(l,2),{text:`sync-server`}),s(),e(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}}),o(D);var O=i(D,2);l(O,{children:(t,n)=>{s();var r=oe();s(2),e(t,r)},$$slots:{default:!0}});var k=i(O,2);c(k,{text:`fun <LocalType, RemoteType> performLocalOperationWithRemoteSyncFlow(
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
}`});var A=i(k,2);l(A,{children:(n,r)=>{s(),e(n,t(`It may seem like a lot is happening, but it’s not. What this does is:`))},$$slots:{default:!0}});var j=i(A,2),M=a(j);f(M,{children:(n,r)=>{l(n,{children:(n,r)=>{s(),e(n,t(`Perform local operation.`))},$$slots:{default:!0}})},$$slots:{default:!0}});var N=i(M);f(N,{children:(n,r)=>{l(n,{children:(n,r)=>{s(),e(n,t(`Try to push changes. If successful, the operation is successful.`))},$$slots:{default:!0}})},$$slots:{default:!0}}),f(i(N),{children:(t,r)=>{l(t,{children:(t,r)=>{s();var a=se(),o=i(n(a));p(o,{text:`onRemoteOperationFailure()`});var c=i(o,2);p(c,{text:`Client-to-Server`}),p(i(c,2),{text:`Two-Way Sync`}),s(),e(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}}),o(j);var P=i(j,2);l(P,{children:(n,r)=>{s(),e(n,t(`Now we need to figure out how to save the operations locally when there’s a failure on the remote server (mostly because
the server is down), so once the server is up, Linkora App can send those operations.`))},$$slots:{default:!0}});var F=i(P,2);l(F,{children:(t,n)=>{s();var r=ce();s(2),e(t,r)},$$slots:{default:!0}});var I=i(F,2);c(I,{text:`@Entity("pending_sync_queue")
data class PendingSyncQueue(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val operation: String,
    val payload: String
)`});var L=i(I,2);l(L,{children:(t,n)=>{s();var r=le();s(4),e(t,r)},$$slots:{default:!0}});var R=i(L,2);l(R,{children:(n,r)=>{s(),e(n,t(`A simple example of how this is done:`))},$$slots:{default:!0}});var z=i(R,2);c(z,{text:`onRemoteOperationFailure = {
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
}`});var B=i(z,2);l(B,{children:(t,n)=>{s();var r=ue();s(6),e(t,r)},$$slots:{default:!0}});var De=i(B,2);c(De,{text:`@Serializable
data class IDBasedDTO(
    val id: Long,
    val eventTimestamp: Long,
    val correlation: Correlation
)

@Serializable
data class Correlation(
    val id: String, val clientName: String
)`});var V=i(De,2);l(V,{children:(t,n)=>{var r=de();s(3),e(t,r)},$$slots:{default:!0}});var H=i(V,2);l(H,{children:(t,n)=>{s();var r=fe();s(2),e(t,r)},$$slots:{default:!0}});var U=i(H,2);c(U,{text:`when (queue.operation) {
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
)`});var W=i(U,2);l(W,{children:(t,n)=>{s();var r=pe();s(2),e(t,r)},$$slots:{default:!0}});var G=i(W,2);l(G,{children:(t,n)=>{s();var r=me();s(2),e(t,r)},$$slots:{default:!0}});var K=i(G,2);u(a(K),{src:`/images/linkora-sync/client-to-server.png`}),o(K);var q=i(K,2);l(q,{children:(n,r)=>{s(),e(n,t(`Now on the server-side, LWW (Last Write Wins) is implemented for some routes where updating is required. This makes sure
the server only updates newer values in case all clients and the server aren’t up at the same time:`))},$$slots:{default:!0}});var J=i(q,2);c(J,{text:`// on server-side
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
}`});var Oe=i(J,2);l(Oe,{children:(t,n)=>{s();var r=he();s(4),e(t,r)},$$slots:{default:!0}});var ke=i(Oe,2);c(ke,{text:`@Entity(tableName = "folders")
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
)`});var Ae=i(ke,2);d(Ae,{level:3,children:(n,r)=>{s(),e(n,t(`2. Server-to-Client`))},$$slots:{default:!0}});var je=i(Ae,2);l(je,{children:(t,n)=>{var r=ge();s(3),e(t,r)},$$slots:{default:!0}});var Me=i(je,2);l(Me,{children:(t,n)=>{s();var r=_e();s(4),e(t,r)},$$slots:{default:!0}});var Ne=i(Me,2);l(Ne,{children:(n,r)=>{s(),e(n,t(`Changes can be read in two ways:`))},$$slots:{default:!0}});var Y=i(Ne,2),Pe=a(Y);f(Pe,{children:(t,n)=>{l(t,{children:(t,n)=>{var r=ve();s(),e(t,r)},$$slots:{default:!0}})},$$slots:{default:!0}}),f(i(Pe),{children:(t,n)=>{l(t,{children:(t,n)=>{var r=ye();s(),e(t,r)},$$slots:{default:!0}})},$$slots:{default:!0}}),o(Y);var Fe=i(Y,2);d(Fe,{level:3,children:(n,r)=>{s(),e(n,t(`1. Using sockets if both app and server are online`))},$$slots:{default:!0}});var Ie=i(Fe,2);l(Ie,{children:(n,r)=>{s(),e(n,t(`When both app and server are online, it’s simple: use sockets and update as required. Linkora App handles this as
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
}`});var Re=i(Le,2);l(Re,{children:(n,r)=>{s(),e(n,t(`Similarly handle for every possible operation.`))},$$slots:{default:!0}});var ze=i(Re,2);d(ze,{level:3,children:(n,r)=>{s(),e(n,t(`2. Custom implementations if the client is offline or disconnected from the server`))},$$slots:{default:!0}});var Be=i(ze,2);l(Be,{children:(n,r)=>{s(),e(n,t(`We need to handle two scenarios if the client is offline or disconnected from the server:`))},$$slots:{default:!0}});var X=i(Be,2),Ve=a(X);f(Ve,{children:(n,r)=>{l(n,{children:(n,r)=>{s(),e(n,t(`Handling deletions.`))},$$slots:{default:!0}})},$$slots:{default:!0}}),f(i(Ve),{children:(t,r)=>{l(t,{children:(t,r)=>{s();var a=be();p(i(n(a)),{text:`TIME_STAMP`}),s(),e(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}}),o(X);var He=i(X,2);d(He,{level:3,children:(n,r)=>{s(),e(n,t(`2.1 Handling deletions when offline`))},$$slots:{default:!0}});var Ue=i(He,2);l(Ue,{children:(t,n)=>{s();var r=xe();s(2),e(t,r)},$$slots:{default:!0}});var We=i(Ue,2);c(We,{text:`object TombstoneTable : LongIdTable("tombstone") {
    val deletedAt = long("deleted_at")
    val operation = text("operation")
    val payload = text("payload")
}`});var Ge=i(We,2);l(Ge,{children:(n,r)=>{s(),e(n,t(`The following example should give a brief idea about how this table is used:`))},$$slots:{default:!0}});var Ke=i(Ge,2);c(Ke,{text:`transaction {
    TombStoneHelper.insert(
        payload = Json.encodeToString(idBasedDTO),
        operation = LinkRoute.DELETE_A_LINK.name,
        deletedAt = eventTimestamp
    )
    LinksTable.deleteWhere {
        id.eq(idBasedDTO.id)
    }
}`});var Z=i(Ke,2);l(Z,{children:(n,r)=>{s(),e(n,t(`And now on the client side, when both the app and server are online, we pull these tombstone records and delete the
corresponding items locally.`))},$$slots:{default:!0}});var qe=i(Z,2);d(qe,{level:3,children:(n,r)=>{s(),e(n,t(`2.2 Updating data after the last known TIME_STAMP`))},$$slots:{default:!0}});var Je=i(qe,2);l(Je,{children:(t,n)=>{s();var r=Se();s(4),e(t,r)},$$slots:{default:!0}});var Ye=i(Je,2);c(Ye,{text:`LinksTable.selectAll().where {
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
}`});var Xe=i(Ye,2);l(Xe,{children:(n,r)=>{s(),e(n,t(`Now the collected updates will be sent back to client, which it will update accordingly.`))},$$slots:{default:!0}});var Ze=i(Xe,2);l(Ze,{children:(t,n)=>{s();var r=Ce();s(2),e(t,r)},$$slots:{default:!0}});var Q=i(Ze,2),$=a(Q);f($,{children:(t,r)=>{l(t,{children:(t,r)=>{s();var a=we();u(i(n(a)),{src:`/images/linkora-sync/server-to-client-with-socket.png`}),e(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}}),f(i($),{children:(t,r)=>{l(t,{children:(t,r)=>{s();var a=Te();u(i(n(a)),{src:`/images/linkora-sync/server-to-client-with-manual.png`}),e(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}}),o(Q),l(i(Q,6),{children:(n,r)=>{s(),e(n,t(`Overall, this is how synchronization works in Linkora. These operations are also used when performing manual syncing or
importing data from external files, but that is outside the context of this topic, hence I didn’t include it.`))},$$slots:{default:!0}}),e(r,m)}export{y as default,m as metadata};