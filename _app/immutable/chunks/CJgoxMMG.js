import{B as e,R as t,S as n,T as r,et as i,tt as a,w as o,z as s}from"./CXOUEYH_.js";import"./CFKVnMbq.js";import"./DCKuasBZ.js";import{t as c}from"./B2HDiynK.js";import{t as l}from"./N-6q-Igo.js";import{a as u,c as d,i as f,o as p,s as m}from"./DJSaBRCA.js";var h={title:`Data Synchronization in Linkora`,description:``,pubDatetime:`Feb 16, 2025 01:05 PM IST`,staticRes:`linkora-sync`},{title:g,description:_,pubDatetime:v,staticRes:y}=h,ee=o(`Update (April 15, 2026)<br/><br/>This post goes over the custom sync setup that runs Linkora today, which
combines an
operation queue with basic Last-Write-Wins and tombstones. While this gets the job done for a single user, there are
more solid ways to handle offline data, and I am currently looking into proper CRDTs.`,1),te=o(`<a href="https://github.com/LinkoraApp/Linkora" rel="nofollow">Linkora App</a> uses multiple <em>techniques</em> to make sure the data is synced with the
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
changes made after that timestamp:`,1),Se=o(`In conclusion, the following images should give you a clear idea of how all these components work together to make sure <code>Server-to-Client</code> sync operates as expected:`,1),Ce=o(`If both app and server are online. <!>`,1),we=o(`If the client is offline or disconnected from the server. <!>`,1),Te=o(`<!> <!> <!> <ul><!><!><!></ul> <!> <!> <!> <!> <!> <!> <ol><!></ol> <!> <!> <!> <ol><!><!><!></ol> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <p><!></p> <!> <!> <!> <!> <!> <!> <!> <!> <ol><!><!></ol> <!> <!> <!> <!> <!> <!> <ol><!><!></ol> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <ol><!><!></ol> <div style="height: 6px"></div> <hr/> <!>`,1);function b(o){var h=Te(),g=s(h);l(g,{children:(e,t)=>{i();var r=ee();i(3),n(e,r)},$$slots:{default:!0}});var _=e(g,2);f(_,{children:(e,t)=>{var r=te();i(5),n(e,r)},$$slots:{default:!0}});var v=e(_,2);f(v,{children:(e,t)=>{i();var r=ne();i(2),n(e,r)},$$slots:{default:!0}});var y=e(v,2),b=t(y);u(b,{children:(e,t)=>{f(e,{children:(e,t)=>{p(e,{text:`Client To Server`})},$$slots:{default:!0}})},$$slots:{default:!0}});var x=e(b);u(x,{children:(e,t)=>{f(e,{children:(e,t)=>{p(e,{text:`Server To Client`})},$$slots:{default:!0}})},$$slots:{default:!0}}),u(e(x),{children:(e,t)=>{f(e,{children:(e,t)=>{p(e,{text:`Two-Way Sync`})},$$slots:{default:!0}})},$$slots:{default:!0}}),a(y);var S=e(y,2);f(S,{children:(e,t)=>{i(),n(e,r(`Based on the selected option, Linkora will handle the respective implementations.`))},$$slots:{default:!0}});var C=e(S,2);f(C,{children:(e,t)=>{i(),n(e,r(`All this in a nutshell looks like:`))},$$slots:{default:!0}});var w=e(C,2);c(w,{text:`suspend fun syncData() {
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
}`});var T=e(w,2);f(T,{children:(e,t)=>{i();var r=re();i(6),n(e,r)},$$slots:{default:!0}});var E=e(T,2);d(E,{level:3,children:(e,t)=>{i(),n(e,r(`1. Client-to-Server`))},$$slots:{default:!0}});var D=e(E,2);f(D,{children:(e,t)=>{i(),n(e,r(`In this case, we only need to consider:`))},$$slots:{default:!0}});var O=e(D,2);u(t(O),{children:(t,r)=>{f(t,{children:(t,r)=>{i();var a=ie(),o=e(s(a));p(o,{text:`CREATE`});var c=e(o,2);p(c,{text:`UPDATE`});var l=e(c,2);p(l,{text:`DELETE`}),p(e(l,2),{text:`sync-server`}),i(),n(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}}),a(O);var k=e(O,2);f(k,{children:(e,t)=>{i();var r=ae();i(2),n(e,r)},$$slots:{default:!0}});var A=e(k,2);c(A,{text:`fun <LocalType, RemoteType> performLocalOperationWithRemoteSyncFlow(
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
}`});var j=e(A,2);f(j,{children:(e,t)=>{i(),n(e,r(`It may seem like a lot is happening, but it’s not. What this does is:`))},$$slots:{default:!0}});var M=e(j,2),N=t(M);u(N,{children:(e,t)=>{f(e,{children:(e,t)=>{i(),n(e,r(`Perform local operation.`))},$$slots:{default:!0}})},$$slots:{default:!0}});var P=e(N);u(P,{children:(e,t)=>{f(e,{children:(e,t)=>{i(),n(e,r(`Try to push changes. If successful, the operation is successful.`))},$$slots:{default:!0}})},$$slots:{default:!0}}),u(e(P),{children:(t,r)=>{f(t,{children:(t,r)=>{i();var a=oe(),o=e(s(a));p(o,{text:`onRemoteOperationFailure()`});var c=e(o,2);p(c,{text:`Client-to-Server`}),p(e(c,2),{text:`Two-Way Sync`}),i(),n(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}}),a(M);var F=e(M,2);f(F,{children:(e,t)=>{i(),n(e,r(`Now we need to figure out how to save the operations locally when there’s a failure on the remote server (mostly because
the server is down), so once the server is up, Linkora App can send those operations.`))},$$slots:{default:!0}});var I=e(F,2);f(I,{children:(e,t)=>{i();var r=se();i(2),n(e,r)},$$slots:{default:!0}});var L=e(I,2);c(L,{text:`@Entity("pending_sync_queue")
data class PendingSyncQueue(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val operation: String,
    val payload: String
)`});var R=e(L,2);f(R,{children:(e,t)=>{i();var r=ce();i(4),n(e,r)},$$slots:{default:!0}});var z=e(R,2);f(z,{children:(e,t)=>{i(),n(e,r(`A simple example of how this is done:`))},$$slots:{default:!0}});var B=e(z,2);c(B,{text:`onRemoteOperationFailure = {
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
}`});var V=e(B,2);f(V,{children:(e,t)=>{i();var r=le();i(6),n(e,r)},$$slots:{default:!0}});var H=e(V,2);c(H,{text:`@Serializable
data class IDBasedDTO(
    val id: Long,
    val eventTimestamp: Long,
    val correlation: Correlation
)

@Serializable
data class Correlation(
    val id: String, val clientName: String
)`});var Ee=e(H,2);f(Ee,{children:(e,t)=>{var r=ue();i(3),n(e,r)},$$slots:{default:!0}});var U=e(Ee,2);f(U,{children:(e,t)=>{i();var r=de();i(2),n(e,r)},$$slots:{default:!0}});var W=e(U,2);c(W,{text:`when (queue.operation) {
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
)`});var G=e(W,2);f(G,{children:(e,t)=>{i();var r=fe();i(2),n(e,r)},$$slots:{default:!0}});var K=e(G,2);f(K,{children:(e,t)=>{i();var r=pe();i(2),n(e,r)},$$slots:{default:!0}});var q=e(K,2);m(t(q),{src:`/images/linkora-sync/client-to-server.png`}),a(q);var J=e(q,2);f(J,{children:(e,t)=>{i(),n(e,r(`Now on the server-side, LWW (Last Write Wins) is implemented for some routes where updating is required. This makes sure
the server only updates newer values in case all clients and the server aren’t up at the same time:`))},$$slots:{default:!0}});var De=e(J,2);c(De,{text:`// on server-side
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
}`});var Oe=e(De,2);f(Oe,{children:(e,t)=>{i();var r=me();i(4),n(e,r)},$$slots:{default:!0}});var ke=e(Oe,2);c(ke,{text:`@Entity(tableName = "folders")
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
)`});var Ae=e(ke,2);d(Ae,{level:3,children:(e,t)=>{i(),n(e,r(`2. Server-to-Client`))},$$slots:{default:!0}});var je=e(Ae,2);f(je,{children:(e,t)=>{var r=he();i(3),n(e,r)},$$slots:{default:!0}});var Me=e(je,2);f(Me,{children:(e,t)=>{i();var r=ge();i(4),n(e,r)},$$slots:{default:!0}});var Ne=e(Me,2);f(Ne,{children:(e,t)=>{i(),n(e,r(`Changes can be read in two ways:`))},$$slots:{default:!0}});var Y=e(Ne,2),Pe=t(Y);u(Pe,{children:(e,t)=>{f(e,{children:(e,t)=>{var r=_e();i(),n(e,r)},$$slots:{default:!0}})},$$slots:{default:!0}}),u(e(Pe),{children:(e,t)=>{f(e,{children:(e,t)=>{var r=ve();i(),n(e,r)},$$slots:{default:!0}})},$$slots:{default:!0}}),a(Y);var Fe=e(Y,2);d(Fe,{level:3,children:(e,t)=>{i(),n(e,r(`1. Using sockets if both app and server are online`))},$$slots:{default:!0}});var Ie=e(Fe,2);f(Ie,{children:(e,t)=>{i(),n(e,r(`When both app and server are online, it’s simple: use sockets and update as required. Linkora App handles this as
follows:`))},$$slots:{default:!0}});var Le=e(Ie,2);c(Le,{text:`private suspend fun updateLocalDBAccordingToEvent(
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
}`});var Re=e(Le,2);f(Re,{children:(e,t)=>{i(),n(e,r(`Similarly handle for every possible operation.`))},$$slots:{default:!0}});var ze=e(Re,2);d(ze,{level:3,children:(e,t)=>{i(),n(e,r(`2. Custom implementations if the client is offline or disconnected from the server`))},$$slots:{default:!0}});var Be=e(ze,2);f(Be,{children:(e,t)=>{i(),n(e,r(`We need to handle two scenarios if the client is offline or disconnected from the server:`))},$$slots:{default:!0}});var X=e(Be,2),Ve=t(X);u(Ve,{children:(e,t)=>{f(e,{children:(e,t)=>{i(),n(e,r(`Handling deletions.`))},$$slots:{default:!0}})},$$slots:{default:!0}}),u(e(Ve),{children:(t,r)=>{f(t,{children:(t,r)=>{i();var a=ye();p(e(s(a)),{text:`TIME_STAMP`}),i(),n(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}}),a(X);var He=e(X,2);d(He,{level:3,children:(e,t)=>{i(),n(e,r(`2.1 Handling deletions when offline`))},$$slots:{default:!0}});var Ue=e(He,2);f(Ue,{children:(e,t)=>{i();var r=be();i(2),n(e,r)},$$slots:{default:!0}});var We=e(Ue,2);c(We,{text:`object TombstoneTable : LongIdTable("tombstone") {
    val deletedAt = long("deleted_at")
    val operation = text("operation")
    val payload = text("payload")
}`});var Ge=e(We,2);f(Ge,{children:(e,t)=>{i(),n(e,r(`The following example should give a brief idea about how this table is used:`))},$$slots:{default:!0}});var Ke=e(Ge,2);c(Ke,{text:`transaction {
    TombStoneHelper.insert(
        payload = Json.encodeToString(idBasedDTO),
        operation = LinkRoute.DELETE_A_LINK.name,
        deletedAt = eventTimestamp
    )
    LinksTable.deleteWhere {
        id.eq(idBasedDTO.id)
    }
}`});var Z=e(Ke,2);f(Z,{children:(e,t)=>{i(),n(e,r(`And now on the client side, when both the app and server are online, we pull these tombstone records and delete the
corresponding items locally.`))},$$slots:{default:!0}});var qe=e(Z,2);d(qe,{level:3,children:(e,t)=>{i(),n(e,r(`2.2 Updating data after the last known TIME_STAMP`))},$$slots:{default:!0}});var Je=e(qe,2);f(Je,{children:(e,t)=>{i();var r=xe();i(4),n(e,r)},$$slots:{default:!0}});var Ye=e(Je,2);c(Ye,{text:`LinksTable.selectAll().where {
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
}`});var Xe=e(Ye,2);f(Xe,{children:(e,t)=>{i(),n(e,r(`Now the collected updates will be sent back to client, which it will update accordingly.`))},$$slots:{default:!0}});var Ze=e(Xe,2);f(Ze,{children:(e,t)=>{i();var r=Se();i(2),n(e,r)},$$slots:{default:!0}});var Q=e(Ze,2),$=t(Q);u($,{children:(t,r)=>{f(t,{children:(t,r)=>{i();var a=Ce();m(e(s(a)),{src:`/images/linkora-sync/server-to-client-with-socket.png`}),n(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}}),u(e($),{children:(t,r)=>{f(t,{children:(t,r)=>{i();var a=we();m(e(s(a)),{src:`/images/linkora-sync/server-to-client-with-manual.png`}),n(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}}),a(Q),f(e(Q,6),{children:(e,t)=>{i(),n(e,r(`Overall, this is how synchronization works in Linkora. These operations are also used when performing manual syncing or
importing data from external files, but that is outside the context of this topic, hence I didn’t include it.`))},$$slots:{default:!0}}),n(o,h)}export{b as default,h as metadata};