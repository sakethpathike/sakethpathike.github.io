import{$ as e,C as t,I as n,L as r,Q as i,R as a,S as o,b as s}from"./D-7-RzVt.js";import"./D1hYfEew.js";import"./5uiB3pu9.js";import{a as c,c as l,i as u,l as d,o as ee,r as f,s as p,u as m}from"./shwkbwOB.js";var h={title:`Synchronization in Linkora`,description:`Offline-First Two-Way Sync with Conflict Resolution That Just Works.`,pubDatetime:`Feb 16, 2025 01:05 PM IST`},{title:te,description:g,pubDatetime:_}=h,ne=o(`<!> uses multiple <em>techniques</em> to make sure the data is synced with the
remote database even when the <!> is
not up (i.e., Linkora will push changes once the server is up the next time). Most of the important parts of this
implementation happen in the app because it’s the source of the data, so we’ll have fine control over what’s supposed to
be pushed and what’s not.`,1),re=o(`Linkora supports <!> synchronization. It’s up to people who use the app to decide how to use the syncing
method.
Linkora supports:`,1),ie=o(`By this, it is straightforward to understand that if the sync type is set to <!> , both of these conditional
blocks will be true. Hence, we need to implement <!> and <!> .`,1),ae=o(`Now, the first thing is to <em>try saving locally and then pushing the changes</em> . There are many operations where we need
to push changes to the server, so I made a generic function that works for all these cases where we need to perform
local operations and then push to the remote server:`,1),oe=o(`For that, I have a table called <!> :`,1),se=o(`Now, the <!> refers to the endpoint at which the operation needs to be performed, and the <!> is the body
of the POST request.`,1),ce=o(`Where <em>every</em> DTO contains <!> . Here, the <!> looks like:`,1),le=o(`<!> helps in identifying the client which performs the operation, because we don’t want to perform locally
after reading remote updates if that update was performed by us. If done by a different client, it won’t match our <!> , so we can perform that knowing we’re not the source.`,1),ue=o(`Now, once the server and app are both online, we can send queued data from <!> . For the same example
considered earlier, here’s how it will be sent:`,1),de=o(`In conclusion, the following image should give you a clear idea of how all these components work together to ensure <!> sync works as expected:`,1),fe=o(`To support this, every table contains a column called <!> , which will also be sent in the POST request body
and is needed for the <!> :`,1),pe=o(`<!> focuses on pushing changes, while <!> focuses on reading changes that occurred on the remote database through the server.`,1),me=o(`The app saves a <!> in its preferences, updated at every successful remote request. The <!> value is
sent from the server (since server operations happen there).`,1),he=o(`We track deleted items using a server-side <!> table structured as:`,1),ge=o(`As mentioned earlier, the local database in the app contains a column called <!> . Similarly, tables in the
remote database also include this column. The app sends its last known <!> to the server, which returns all
changes made after that timestamp:`,1),_e=o(`In conclusion, the following images should give you a clear idea of how all these components work together to make sure <!> sync operates as expected:`,1),ve=o(`<!> <!> <!><!><!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!><!><!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <p><!></p> <!> <!> <!> <!> <!> <!> <!> <!> <!><!> <!> <!> <!> <!> <!> <!> <!><!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!><!> <!> <!>`,1);function v(o){var h=ve(),te=r(h);f(te,{children:(e,n)=>{var o=ne(),c=r(o);d(c,{href:`https://github.com/LinkoraApp/Linkora`,children:(e,n)=>{i(),s(e,t(`Linkora App`))},$$slots:{default:!0}}),d(a(c,4),{href:`https://github.com/LinkoraApp/sync-server`,children:(e,n)=>{i(),s(e,t(`self-hostable sync-server`))},$$slots:{default:!0}}),i(),s(e,o)},$$slots:{default:!0}});var g=a(te,2);f(g,{children:(e,t)=>{i();var n=re();c(a(r(n)),{text:`Two-Way Sync`}),i(),s(e,n)},$$slots:{default:!0}});var _=a(g,2);u(_,{html:`<code>Client To Server</code>`});var v=a(_);u(v,{html:`<code>Server To Client</code>`});var y=a(v);u(y,{html:`<code>Two-Way Sync</code>`});var b=a(y,2);f(b,{children:(e,n)=>{i(),s(e,t(`Based on the selected option, Linkora will handle the respective implementations.`))},$$slots:{default:!0}});var x=a(b,2);f(x,{children:(e,n)=>{i(),s(e,t(`All this in a nutshell looks like:`))},$$slots:{default:!0}});var S=a(x,2);m(S,{text:`suspend fun syncData() {
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
}`});var C=a(S,2);f(C,{children:(e,t)=>{i();var n=ie(),o=a(r(n));c(o,{text:`Two-Way Sync`});var l=a(o,2);c(l,{text:`Client-to-Server`}),c(a(l,2),{text:`Server-To-Client`}),i(),s(e,n)},$$slots:{default:!0}});var w=a(C,2);p(w,{level:3,children:(e,n)=>{i(),s(e,t(`1. Client-to-Server`))},$$slots:{default:!0}});var T=a(w,2);f(T,{children:(e,n)=>{i(),s(e,t(`In this case, we only need to consider:`))},$$slots:{default:!0}});var E=a(T,2);u(E,{html:`Pushing <code>CREATE</code>-<code>UPDATE</code>-<code>DELETE</code> operations that happen locally.That’s all we care about. But there may be cases when the <code>sync-server</code> might not be up. In that case, we need to
save what’s supposed to be pushed so that whenever the server and app are up, the app can send those changes. This
also makes it local-first, as irrespective of server changes; it will always update locally.`});var D=a(E,2);f(D,{children:(e,t)=>{i();var n=ae();i(2),s(e,n)},$$slots:{default:!0}});var O=a(D,2);m(O,{text:`fun <LocalType, RemoteType> performLocalOperationWithRemoteSyncFlow(
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
}`});var k=a(O,2);f(k,{children:(e,n)=>{i(),s(e,t(`It may seem like a lot is happening, but it’s not. What this does is:`))},$$slots:{default:!0}});var A=a(k,2);u(A,{html:`Perform local operation.`});var j=a(A);u(j,{html:`Try to push changes. If successful, the operation is successful.`});var M=a(j);u(M,{html:`If pushing fails, <code>onRemoteOperationFailure()</code> will be triggered if the sync type is set to <code>Client-to-Server</code> or <code>Two-Way Sync</code>.`});var N=a(M,2);f(N,{children:(e,n)=>{i(),s(e,t(`Now we need to figure out how to save the operations locally when there’s a failure on the remote server (mostly because
the server is down), so once the server is up, Linkora App can send those operations.`))},$$slots:{default:!0}});var P=a(N,2);f(P,{children:(e,t)=>{i();var n=oe();c(a(r(n)),{text:`PendingSyncQueue`}),i(),s(e,n)},$$slots:{default:!0}});var F=a(P,2);m(F,{text:`@Entity("pending_sync_queue")
data class PendingSyncQueue(
   @PrimaryKey(autoGenerate = true) val id: Long = 0,
   val operation: String,
   val payload: String
)`});var I=a(F,2);f(I,{children:(e,t)=>{i();var n=se(),o=a(r(n));c(o,{text:`operation`}),c(a(o,2),{text:`payload`}),i(),s(e,n)},$$slots:{default:!0}});var L=a(I,2);f(L,{children:(e,n)=>{i(),s(e,t(`A simple example of how this is done:`))},$$slots:{default:!0}});var R=a(L,2);m(R,{text:`onRemoteOperationFailure = {
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
}`});var ye=a(R,2);f(ye,{children:(e,t)=>{i();var n=ce(),o=a(r(n),3);c(o,{text:`correlation`}),c(a(o,2),{text:`IDBasedDTO`}),i(),s(e,n)},$$slots:{default:!0}});var z=a(ye,2);m(z,{text:`@Serializable
data class IDBasedDTO(
   val id: Long,
   val eventTimestamp: Long,
   val correlation: Correlation = AppPreferences.getCorrelation(),
)

@Serializable
data class Correlation(
   val id: String, val clientName: String
)`});var B=a(z,2);f(B,{children:(e,t)=>{var n=le(),o=r(n);c(o,{text:`Correlation`}),c(a(o,2),{text:`Correlation`}),i(),s(e,n)},$$slots:{default:!0}});var V=a(B,2);f(V,{children:(e,t)=>{i();var n=ue();c(a(r(n)),{text:`PendingSyncQueue`}),i(),s(e,n)},$$slots:{default:!0}});var H=a(V,2);m(H,{text:`when (queue.operation) {
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
)`});var U=a(H,2);f(U,{children:(e,n)=>{i(),s(e,t(`This way, we can confirm the client will definitely send the data to the server (if it gets uninstalled, we can’t do
anything about it).`))},$$slots:{default:!0}});var W=a(U,2);f(W,{children:(e,t)=>{i();var n=de();c(a(r(n)),{text:`Client-to-Server`}),i(),s(e,n)},$$slots:{default:!0}});var G=a(W,2);ee(n(G),{src:`/src/content/images/linkora-sync--client-to-server.png`}),e(G);var K=a(G,2);f(K,{children:(e,n)=>{i(),s(e,t(`Now on the server-side, LWW (Last Write Wins) is implemented for some routes where updating is required. This makes sure
the server only updates newer values in case all clients and the server aren’t up at the same time:`))},$$slots:{default:!0}});var q=a(K,2);m(q,{text:`// on server-side
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
}`});var J=a(q,2);f(J,{children:(e,t)=>{i();var n=fe(),o=a(r(n));c(o,{text:`lastModified`}),c(a(o,2),{text:`sync-server`}),i(),s(e,n)},$$slots:{default:!0}});var Y=a(J,2);m(Y,{text:`@Entity(tableName = "folders")
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
)`});var X=a(Y,2);p(X,{level:3,children:(e,n)=>{i(),s(e,t(`2. Server-to-Client`))},$$slots:{default:!0}});var Z=a(X,2);f(Z,{children:(e,t)=>{var n=pe(),o=r(n);c(o,{text:`Client-to-Server`}),c(a(o,2),{text:`Server-to-Client`}),i(),s(e,n)},$$slots:{default:!0}});var Q=a(Z,2);f(Q,{children:(e,t)=>{i();var n=me(),o=a(r(n));c(o,{text:`TIME_STAMP`}),c(a(o,2),{text:`TIME_STAMP`}),i(),s(e,n)},$$slots:{default:!0}});var be=a(Q,2);f(be,{children:(e,n)=>{i(),s(e,t(`Changes can be read in two ways:`))},$$slots:{default:!0}});var xe=a(be,2);u(xe,{html:`<em>Using sockets</em> if both app and server are online.`});var Se=a(xe);u(Se,{html:`<em>Custom implementations</em> if the client is offline or disconnected from the server.`});var Ce=a(Se,2);p(Ce,{level:3,children:(e,n)=>{i(),s(e,t(`1. Using sockets if both app and server are online`))},$$slots:{default:!0}});var we=a(Ce,2);f(we,{children:(e,n)=>{i(),s(e,t(`When both app and server are online, it’s simple: use sockets and update as required. Linkora App handles this as
follows:`))},$$slots:{default:!0}});var Te=a(we,2);m(Te,{text:`private suspend fun updateLocalDBAccordingToEvent(
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
}`});var Ee=a(Te,2);f(Ee,{children:(e,n)=>{i(),s(e,t(`Similarly handle for every possible operation.`))},$$slots:{default:!0}});var De=a(Ee,2);p(De,{level:3,children:(e,n)=>{i(),s(e,t(`2. Custom implementations if the client is offline or disconnected from the server`))},$$slots:{default:!0}});var Oe=a(De,2);f(Oe,{children:(e,n)=>{i(),s(e,t(`We need to handle two scenarios if the client is offline or disconnected from the server:`))},$$slots:{default:!0}});var ke=a(Oe,2);u(ke,{html:`Handling deletions.`});var Ae=a(ke);u(Ae,{html:`Updating data after the last known <code>TIME_STAMP</code>.`});var je=a(Ae,2);p(je,{level:3,children:(e,n)=>{i(),s(e,t(`2.1 Handling deletions when offline`))},$$slots:{default:!0}});var Me=a(je,2);f(Me,{children:(e,t)=>{i();var n=he();c(a(r(n)),{text:`Tombstone`}),i(),s(e,n)},$$slots:{default:!0}});var Ne=a(Me,2);m(Ne,{text:`object TombstoneTable : LongIdTable("tombstone") {
   val deletedAt = long("deleted_at")
   val operation = text("operation")
   val payload = text("payload")
}`});var Pe=a(Ne,2);f(Pe,{children:(e,n)=>{i(),s(e,t(`The following example should give a brief idea about how this table is used:`))},$$slots:{default:!0}});var $=a(Pe,2);m($,{text:`transaction {
   TombStoneHelper.insert(
      payload = Json.encodeToString(idBasedDTO),
      operation = LinkRoute.DELETE_A_LINK.name,
      deletedAt = eventTimestamp
   )
   LinksTable.deleteWhere {
      id.eq(idBasedDTO.id)
   }
}`});var Fe=a($,2);f(Fe,{children:(e,n)=>{i(),s(e,t(`And now on the client side, when both the app and server are online, we pull these tombstone records and delete the
corresponding items locally.`))},$$slots:{default:!0}});var Ie=a(Fe,2);p(Ie,{level:3,children:(e,n)=>{i(),s(e,t(`2.2 Updating data after the last known TIME_STAMP`))},$$slots:{default:!0}});var Le=a(Ie,2);f(Le,{children:(e,t)=>{i();var n=ge(),o=a(r(n));c(o,{text:`lastModified`}),c(a(o,2),{text:`TIME_STAMP`}),i(),s(e,n)},$$slots:{default:!0}});var Re=a(Le,2);m(Re,{text:`LinksTable.selectAll().where {
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
}`});var ze=a(Re,2);f(ze,{children:(e,n)=>{i(),s(e,t(`Now the collected updates will be sent back to client, which it will update accordingly.`))},$$slots:{default:!0}});var Be=a(ze,2);f(Be,{children:(e,t)=>{i();var n=_e();c(a(r(n)),{text:`Server-to-Client`}),i(),s(e,n)},$$slots:{default:!0}});var Ve=a(Be,2);u(Ve,{html:`If both app and server are online.
<ImageBlock src={"/src/content/images/linkora-sync--server-to-client-with-socket.png"} />`});var He=a(Ve);u(He,{html:`If the client is offline or disconnected from the server.
<ImageBlock src={"/src/content/images/linkora-sync--server-to-client-with-manual.png"} />`});var Ue=a(He,2);l(Ue,{}),f(a(Ue,2),{children:(e,n)=>{i(),s(e,t(`Overall, this is how synchronization works in Linkora. These operations are also used when performing manual syncing or importing data from external files, but that is outside the context of this topic, hence I didn’t include it.`))},$$slots:{default:!0}}),s(o,h)}export{v as default,h as metadata};