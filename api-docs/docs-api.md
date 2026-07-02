<!-- Generator: Widdershins v4.0.1 -->

<h1 id="assetmgmt">AssetMgmt v1.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

# Authentication

- HTTP Authentication, scheme: bearer Enter the JWT access token (without the 'Bearer ' prefix).

<h1 id="assetmgmt-allocationrequests">AllocationRequests</h1>

## post__api_requests

> Code samples

```shell
# You can also use wget
curl -X POST /api/requests \
  -H 'Content-Type: application/json' \
  -H 'Accept: text/plain'

```

`POST /api/requests`

> Body parameter

```json
{
  "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
  "reason": "string",
  "expectedDurationMonths": 0,
  "idempotencyKey": "string"
}
```

<h3 id="post__api_requests-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CreateRequestDto](#schemacreaterequestdto)|false|none|

> Example responses

> 200 Response

```
{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","requesterId":"ba828041-f5bf-46f6-bf7c-22eccb01f2a4","requesterName":"string","assetInstanceId":"605efab6-99a7-4ea3-8f61-391429fbad2b","assetCode":"string","modelName":"string","status":0,"reason":"string","expectedDurationMonths":0,"approverId":"c4cb1502-f1f4-43be-8940-63247031d1fd","approverName":"string","approvedAt":"2019-08-24T14:15:22Z","rejectedReason":"string","lockExpiresAt":"2019-08-24T14:15:22Z","createdAt":"2019-08-24T14:15:22Z","updatedAt":"2019-08-24T14:15:22Z"}
```

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "requesterId": "ba828041-f5bf-46f6-bf7c-22eccb01f2a4",
  "requesterName": "string",
  "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
  "assetCode": "string",
  "modelName": "string",
  "status": 0,
  "reason": "string",
  "expectedDurationMonths": 0,
  "approverId": "c4cb1502-f1f4-43be-8940-63247031d1fd",
  "approverName": "string",
  "approvedAt": "2019-08-24T14:15:22Z",
  "rejectedReason": "string",
  "lockExpiresAt": "2019-08-24T14:15:22Z",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="post__api_requests-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[AllocationRequestDto](#schemaallocationrequestdto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## get__api_requests_pending

> Code samples

```shell
# You can also use wget
curl -X GET /api/requests/pending \
  -H 'Accept: text/plain'

```

`GET /api/requests/pending`

<h3 id="get__api_requests_pending-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|page|query|integer(int32)|false|none|
|pageSize|query|integer(int32)|false|none|

> Example responses

> 200 Response

```
{"items":[{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","requesterId":"ba828041-f5bf-46f6-bf7c-22eccb01f2a4","requesterName":"string","assetInstanceId":"605efab6-99a7-4ea3-8f61-391429fbad2b","assetCode":"string","modelName":"string","status":0,"expectedDurationMonths":0,"lockExpiresAt":"2019-08-24T14:15:22Z","createdAt":"2019-08-24T14:15:22Z"}],"total":0,"page":0,"pageSize":0,"totalPages":0}
```

```json
{
  "items": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "requesterId": "ba828041-f5bf-46f6-bf7c-22eccb01f2a4",
      "requesterName": "string",
      "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
      "assetCode": "string",
      "modelName": "string",
      "status": 0,
      "expectedDurationMonths": 0,
      "lockExpiresAt": "2019-08-24T14:15:22Z",
      "createdAt": "2019-08-24T14:15:22Z"
    }
  ],
  "total": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
```

<h3 id="get__api_requests_pending-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[RequestListItemPagedResult](#schemarequestlistitempagedresult)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## get__api_requests_mine

> Code samples

```shell
# You can also use wget
curl -X GET /api/requests/mine \
  -H 'Accept: text/plain'

```

`GET /api/requests/mine`

<h3 id="get__api_requests_mine-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|page|query|integer(int32)|false|none|
|pageSize|query|integer(int32)|false|none|

> Example responses

> 200 Response

```
{"items":[{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","requesterId":"ba828041-f5bf-46f6-bf7c-22eccb01f2a4","requesterName":"string","assetInstanceId":"605efab6-99a7-4ea3-8f61-391429fbad2b","assetCode":"string","modelName":"string","status":0,"expectedDurationMonths":0,"lockExpiresAt":"2019-08-24T14:15:22Z","createdAt":"2019-08-24T14:15:22Z"}],"total":0,"page":0,"pageSize":0,"totalPages":0}
```

```json
{
  "items": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "requesterId": "ba828041-f5bf-46f6-bf7c-22eccb01f2a4",
      "requesterName": "string",
      "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
      "assetCode": "string",
      "modelName": "string",
      "status": 0,
      "expectedDurationMonths": 0,
      "lockExpiresAt": "2019-08-24T14:15:22Z",
      "createdAt": "2019-08-24T14:15:22Z"
    }
  ],
  "total": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
```

<h3 id="get__api_requests_mine-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[RequestListItemPagedResult](#schemarequestlistitempagedresult)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## get__api_requests_{id}

> Code samples

```shell
# You can also use wget
curl -X GET /api/requests/{id} \
  -H 'Accept: text/plain'

```

`GET /api/requests/{id}`

<h3 id="get__api_requests_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|

> Example responses

> 200 Response

```
{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","requesterId":"ba828041-f5bf-46f6-bf7c-22eccb01f2a4","requesterName":"string","assetInstanceId":"605efab6-99a7-4ea3-8f61-391429fbad2b","assetCode":"string","modelName":"string","status":0,"reason":"string","expectedDurationMonths":0,"approverId":"c4cb1502-f1f4-43be-8940-63247031d1fd","approverName":"string","approvedAt":"2019-08-24T14:15:22Z","rejectedReason":"string","lockExpiresAt":"2019-08-24T14:15:22Z","createdAt":"2019-08-24T14:15:22Z","updatedAt":"2019-08-24T14:15:22Z"}
```

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "requesterId": "ba828041-f5bf-46f6-bf7c-22eccb01f2a4",
  "requesterName": "string",
  "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
  "assetCode": "string",
  "modelName": "string",
  "status": 0,
  "reason": "string",
  "expectedDurationMonths": 0,
  "approverId": "c4cb1502-f1f4-43be-8940-63247031d1fd",
  "approverName": "string",
  "approvedAt": "2019-08-24T14:15:22Z",
  "rejectedReason": "string",
  "lockExpiresAt": "2019-08-24T14:15:22Z",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="get__api_requests_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[AllocationRequestDto](#schemaallocationrequestdto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## post__api_requests_{id}_approve

> Code samples

```shell
# You can also use wget
curl -X POST /api/requests/{id}/approve \
  -H 'Accept: text/plain'

```

`POST /api/requests/{id}/approve`

<h3 id="post__api_requests_{id}_approve-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|

> Example responses

> 200 Response

```
{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","requesterId":"ba828041-f5bf-46f6-bf7c-22eccb01f2a4","requesterName":"string","assetInstanceId":"605efab6-99a7-4ea3-8f61-391429fbad2b","assetCode":"string","modelName":"string","status":0,"reason":"string","expectedDurationMonths":0,"approverId":"c4cb1502-f1f4-43be-8940-63247031d1fd","approverName":"string","approvedAt":"2019-08-24T14:15:22Z","rejectedReason":"string","lockExpiresAt":"2019-08-24T14:15:22Z","createdAt":"2019-08-24T14:15:22Z","updatedAt":"2019-08-24T14:15:22Z"}
```

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "requesterId": "ba828041-f5bf-46f6-bf7c-22eccb01f2a4",
  "requesterName": "string",
  "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
  "assetCode": "string",
  "modelName": "string",
  "status": 0,
  "reason": "string",
  "expectedDurationMonths": 0,
  "approverId": "c4cb1502-f1f4-43be-8940-63247031d1fd",
  "approverName": "string",
  "approvedAt": "2019-08-24T14:15:22Z",
  "rejectedReason": "string",
  "lockExpiresAt": "2019-08-24T14:15:22Z",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="post__api_requests_{id}_approve-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[AllocationRequestDto](#schemaallocationrequestdto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## post__api_requests_{id}_reject

> Code samples

```shell
# You can also use wget
curl -X POST /api/requests/{id}/reject \
  -H 'Content-Type: application/json' \
  -H 'Accept: text/plain'

```

`POST /api/requests/{id}/reject`

> Body parameter

```json
{
  "reason": "string"
}
```

<h3 id="post__api_requests_{id}_reject-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|
|body|body|[RejectRequestDto](#schemarejectrequestdto)|false|none|

> Example responses

> 200 Response

```
{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","requesterId":"ba828041-f5bf-46f6-bf7c-22eccb01f2a4","requesterName":"string","assetInstanceId":"605efab6-99a7-4ea3-8f61-391429fbad2b","assetCode":"string","modelName":"string","status":0,"reason":"string","expectedDurationMonths":0,"approverId":"c4cb1502-f1f4-43be-8940-63247031d1fd","approverName":"string","approvedAt":"2019-08-24T14:15:22Z","rejectedReason":"string","lockExpiresAt":"2019-08-24T14:15:22Z","createdAt":"2019-08-24T14:15:22Z","updatedAt":"2019-08-24T14:15:22Z"}
```

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "requesterId": "ba828041-f5bf-46f6-bf7c-22eccb01f2a4",
  "requesterName": "string",
  "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
  "assetCode": "string",
  "modelName": "string",
  "status": 0,
  "reason": "string",
  "expectedDurationMonths": 0,
  "approverId": "c4cb1502-f1f4-43be-8940-63247031d1fd",
  "approverName": "string",
  "approvedAt": "2019-08-24T14:15:22Z",
  "rejectedReason": "string",
  "lockExpiresAt": "2019-08-24T14:15:22Z",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="post__api_requests_{id}_reject-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[AllocationRequestDto](#schemaallocationrequestdto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## get__api_requests_{id}_handover

> Code samples

```shell
# You can also use wget
curl -X GET /api/requests/{id}/handover \
  -H 'Accept: text/plain'

```

`GET /api/requests/{id}/handover`

<h3 id="get__api_requests_{id}_handover-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|

> Example responses

> 200 Response

```
{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","documentNumber":"string","filePath":"string"}
```

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "documentNumber": "string",
  "filePath": "string"
}
```

<h3 id="get__api_requests_{id}_handover-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[HandoverResult](#schemahandoverresult)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="assetmgmt-allocations">Allocations</h1>

## get__api_allocations_history

> Code samples

```shell
# You can also use wget
curl -X GET /api/allocations/history \
  -H 'Accept: text/plain'

```

`GET /api/allocations/history`

<h3 id="get__api_allocations_history-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|assetId|query|string(uuid)|false|none|
|userId|query|string(uuid)|false|none|
|page|query|integer(int32)|false|none|
|pageSize|query|integer(int32)|false|none|

> Example responses

> 200 Response

```
{"items":[{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","assetInstanceId":"605efab6-99a7-4ea3-8f61-391429fbad2b","assetCode":"string","modelName":"string","userId":"2c4a230c-5085-4924-a3e1-25fb4fc5965b","userName":"string","eventType":0,"startDate":"2019-08-24T14:15:22Z","endDate":"2019-08-24T14:15:22Z","allocationRequestId":"e6691aef-d73d-4b59-bb6b-d154ce78d9c7","notes":"string","createdAt":"2019-08-24T14:15:22Z"}],"total":0,"page":0,"pageSize":0,"totalPages":0}
```

```json
{
  "items": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
      "assetCode": "string",
      "modelName": "string",
      "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
      "userName": "string",
      "eventType": 0,
      "startDate": "2019-08-24T14:15:22Z",
      "endDate": "2019-08-24T14:15:22Z",
      "allocationRequestId": "e6691aef-d73d-4b59-bb6b-d154ce78d9c7",
      "notes": "string",
      "createdAt": "2019-08-24T14:15:22Z"
    }
  ],
  "total": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
```

<h3 id="get__api_allocations_history-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[AllocationHistoryItemPagedResult](#schemaallocationhistoryitempagedresult)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## get__api_assets_{assetId}_history

> Code samples

```shell
# You can also use wget
curl -X GET /api/assets/{assetId}/history \
  -H 'Accept: text/plain'

```

`GET /api/assets/{assetId}/history`

<h3 id="get__api_assets_{assetid}_history-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|assetId|path|string(uuid)|true|none|
|page|query|integer(int32)|false|none|
|pageSize|query|integer(int32)|false|none|

> Example responses

> 200 Response

```
{"items":[{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","assetInstanceId":"605efab6-99a7-4ea3-8f61-391429fbad2b","assetCode":"string","modelName":"string","userId":"2c4a230c-5085-4924-a3e1-25fb4fc5965b","userName":"string","eventType":0,"startDate":"2019-08-24T14:15:22Z","endDate":"2019-08-24T14:15:22Z","allocationRequestId":"e6691aef-d73d-4b59-bb6b-d154ce78d9c7","notes":"string","createdAt":"2019-08-24T14:15:22Z"}],"total":0,"page":0,"pageSize":0,"totalPages":0}
```

```json
{
  "items": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
      "assetCode": "string",
      "modelName": "string",
      "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
      "userName": "string",
      "eventType": 0,
      "startDate": "2019-08-24T14:15:22Z",
      "endDate": "2019-08-24T14:15:22Z",
      "allocationRequestId": "e6691aef-d73d-4b59-bb6b-d154ce78d9c7",
      "notes": "string",
      "createdAt": "2019-08-24T14:15:22Z"
    }
  ],
  "total": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
```

<h3 id="get__api_assets_{assetid}_history-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[AllocationHistoryItemPagedResult](#schemaallocationhistoryitempagedresult)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## get__api_me_assets

> Code samples

```shell
# You can also use wget
curl -X GET /api/me/assets \
  -H 'Accept: text/plain'

```

`GET /api/me/assets`

> Example responses

> 200 Response

```
[{"assetInstanceId":"605efab6-99a7-4ea3-8f61-391429fbad2b","assetCode":"string","modelName":"string","status":0,"location":"string","startDate":"2019-08-24T14:15:22Z"}]
```

```json
[
  {
    "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
    "assetCode": "string",
    "modelName": "string",
    "status": 0,
    "location": "string",
    "startDate": "2019-08-24T14:15:22Z"
  }
]
```

<h3 id="get__api_me_assets-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="get__api_me_assets-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[MyAssetItem](#schemamyassetitem)]|false|none|none|
|» assetInstanceId|string(uuid)|false|none|none|
|» assetCode|string¦null|false|none|none|
|» modelName|string¦null|false|none|none|
|» status|[AssetStatus](#schemaassetstatus)(int32)|false|none|none|
|» location|string¦null|false|none|none|
|» startDate|string(date-time)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|0|
|status|1|
|status|2|
|status|3|
|status|4|
|status|5|
|status|6|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="assetmgmt-assetinstances">AssetInstances</h1>

## get__api_assets

> Code samples

```shell
# You can also use wget
curl -X GET /api/assets \
  -H 'Accept: text/plain'

```

`GET /api/assets`

<h3 id="get__api_assets-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|status|query|[AssetStatus](#schemaassetstatus)|false|none|
|modelId|query|string(uuid)|false|none|
|search|query|string|false|none|
|page|query|integer(int32)|false|none|
|pageSize|query|integer(int32)|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|status|0|
|status|1|
|status|2|
|status|3|
|status|4|
|status|5|
|status|6|

> Example responses

> 200 Response

```
{"items":[{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","assetCode":"string","serial":"string","modelId":"17563eeb-82d7-4210-ac9b-1a20c7d67278","modelName":"string","status":0,"currentHolderId":"7e755a82-bc10-4c7a-948f-df601c50d188","currentHolderName":"string","location":"string","qrCodePath":"string"}],"total":0,"page":0,"pageSize":0,"totalPages":0}
```

```json
{
  "items": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "assetCode": "string",
      "serial": "string",
      "modelId": "17563eeb-82d7-4210-ac9b-1a20c7d67278",
      "modelName": "string",
      "status": 0,
      "currentHolderId": "7e755a82-bc10-4c7a-948f-df601c50d188",
      "currentHolderName": "string",
      "location": "string",
      "qrCodePath": "string"
    }
  ],
  "total": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
```

<h3 id="get__api_assets-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[AssetInstanceListItemPagedResult](#schemaassetinstancelistitempagedresult)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## post__api_assets

> Code samples

```shell
# You can also use wget
curl -X POST /api/assets \
  -H 'Content-Type: application/json' \
  -H 'Accept: text/plain'

```

`POST /api/assets`

> Body parameter

```json
{
  "modelId": "17563eeb-82d7-4210-ac9b-1a20c7d67278",
  "serial": "string",
  "acquisitionCost": 0.1,
  "acquisitionDate": "2019-08-24T14:15:22Z",
  "salvageValue": 0.1,
  "location": "string",
  "warrantyExpiresAt": "2019-08-24T14:15:22Z",
  "notes": "string"
}
```

<h3 id="post__api_assets-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CreateAssetInstanceRequest](#schemacreateassetinstancerequest)|false|none|

> Example responses

> 200 Response

```
{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","assetCode":"string","serial":"string","modelId":"17563eeb-82d7-4210-ac9b-1a20c7d67278","modelName":"string","status":0,"currentHolderId":"7e755a82-bc10-4c7a-948f-df601c50d188","currentHolderName":"string","acquisitionCost":0.1,"acquisitionDate":"2019-08-24T14:15:22Z","salvageValue":0.1,"location":"string","warrantyExpiresAt":"2019-08-24T14:15:22Z","qrCodePath":"string","notes":"string","version":0,"createdAt":"2019-08-24T14:15:22Z","updatedAt":"2019-08-24T14:15:22Z"}
```

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "assetCode": "string",
  "serial": "string",
  "modelId": "17563eeb-82d7-4210-ac9b-1a20c7d67278",
  "modelName": "string",
  "status": 0,
  "currentHolderId": "7e755a82-bc10-4c7a-948f-df601c50d188",
  "currentHolderName": "string",
  "acquisitionCost": 0.1,
  "acquisitionDate": "2019-08-24T14:15:22Z",
  "salvageValue": 0.1,
  "location": "string",
  "warrantyExpiresAt": "2019-08-24T14:15:22Z",
  "qrCodePath": "string",
  "notes": "string",
  "version": 0,
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="post__api_assets-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[AssetInstanceDto](#schemaassetinstancedto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## get__api_assets_{id}

> Code samples

```shell
# You can also use wget
curl -X GET /api/assets/{id} \
  -H 'Accept: text/plain'

```

`GET /api/assets/{id}`

<h3 id="get__api_assets_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|

> Example responses

> 200 Response

```
{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","assetCode":"string","serial":"string","modelId":"17563eeb-82d7-4210-ac9b-1a20c7d67278","modelName":"string","status":0,"currentHolderId":"7e755a82-bc10-4c7a-948f-df601c50d188","currentHolderName":"string","acquisitionCost":0.1,"acquisitionDate":"2019-08-24T14:15:22Z","salvageValue":0.1,"location":"string","warrantyExpiresAt":"2019-08-24T14:15:22Z","qrCodePath":"string","notes":"string","version":0,"createdAt":"2019-08-24T14:15:22Z","updatedAt":"2019-08-24T14:15:22Z"}
```

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "assetCode": "string",
  "serial": "string",
  "modelId": "17563eeb-82d7-4210-ac9b-1a20c7d67278",
  "modelName": "string",
  "status": 0,
  "currentHolderId": "7e755a82-bc10-4c7a-948f-df601c50d188",
  "currentHolderName": "string",
  "acquisitionCost": 0.1,
  "acquisitionDate": "2019-08-24T14:15:22Z",
  "salvageValue": 0.1,
  "location": "string",
  "warrantyExpiresAt": "2019-08-24T14:15:22Z",
  "qrCodePath": "string",
  "notes": "string",
  "version": 0,
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="get__api_assets_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[AssetInstanceDto](#schemaassetinstancedto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## put__api_assets_{id}

> Code samples

```shell
# You can also use wget
curl -X PUT /api/assets/{id} \
  -H 'Content-Type: application/json' \
  -H 'Accept: text/plain'

```

`PUT /api/assets/{id}`

> Body parameter

```json
{
  "serial": "string",
  "acquisitionCost": 0.1,
  "acquisitionDate": "2019-08-24T14:15:22Z",
  "salvageValue": 0.1,
  "location": "string",
  "warrantyExpiresAt": "2019-08-24T14:15:22Z",
  "notes": "string"
}
```

<h3 id="put__api_assets_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|
|body|body|[UpdateAssetInstanceRequest](#schemaupdateassetinstancerequest)|false|none|

> Example responses

> 200 Response

```
{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","assetCode":"string","serial":"string","modelId":"17563eeb-82d7-4210-ac9b-1a20c7d67278","modelName":"string","status":0,"currentHolderId":"7e755a82-bc10-4c7a-948f-df601c50d188","currentHolderName":"string","acquisitionCost":0.1,"acquisitionDate":"2019-08-24T14:15:22Z","salvageValue":0.1,"location":"string","warrantyExpiresAt":"2019-08-24T14:15:22Z","qrCodePath":"string","notes":"string","version":0,"createdAt":"2019-08-24T14:15:22Z","updatedAt":"2019-08-24T14:15:22Z"}
```

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "assetCode": "string",
  "serial": "string",
  "modelId": "17563eeb-82d7-4210-ac9b-1a20c7d67278",
  "modelName": "string",
  "status": 0,
  "currentHolderId": "7e755a82-bc10-4c7a-948f-df601c50d188",
  "currentHolderName": "string",
  "acquisitionCost": 0.1,
  "acquisitionDate": "2019-08-24T14:15:22Z",
  "salvageValue": 0.1,
  "location": "string",
  "warrantyExpiresAt": "2019-08-24T14:15:22Z",
  "qrCodePath": "string",
  "notes": "string",
  "version": 0,
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="put__api_assets_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[AssetInstanceDto](#schemaassetinstancedto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## delete__api_assets_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE /api/assets/{id}

```

`DELETE /api/assets/{id}`

<h3 id="delete__api_assets_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|

<h3 id="delete__api_assets_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## post__api_assets_{id}_return

> Code samples

```shell
# You can also use wget
curl -X POST /api/assets/{id}/return \
  -H 'Content-Type: application/json'

```

`POST /api/assets/{id}/return`

> Body parameter

```json
{
  "notes": "string"
}
```

<h3 id="post__api_assets_{id}_return-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|
|body|body|[ReturnAssetDto](#schemareturnassetdto)|false|none|

<h3 id="post__api_assets_{id}_return-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## post__api_assets_{id}_transfer

> Code samples

```shell
# You can also use wget
curl -X POST /api/assets/{id}/transfer \
  -H 'Content-Type: application/json'

```

`POST /api/assets/{id}/transfer`

> Body parameter

```json
{
  "toUserId": "6b24f439-a350-415b-8542-30ae3827c522",
  "notes": "string"
}
```

<h3 id="post__api_assets_{id}_transfer-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|
|body|body|[TransferAssetDto](#schematransferassetdto)|false|none|

<h3 id="post__api_assets_{id}_transfer-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## post__api_assets_{id}_maintenance

> Code samples

```shell
# You can also use wget
curl -X POST /api/assets/{id}/maintenance \
  -H 'Content-Type: application/json' \
  -H 'Accept: text/plain'

```

`POST /api/assets/{id}/maintenance`

> Body parameter

```json
{
  "type": 0,
  "description": "string",
  "vendor": "string",
  "cost": 0.1
}
```

<h3 id="post__api_assets_{id}_maintenance-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|
|body|body|[StartMaintenanceDto](#schemastartmaintenancedto)|false|none|

> Example responses

> 200 Response

```
{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","assetInstanceId":"605efab6-99a7-4ea3-8f61-391429fbad2b","assetCode":"string","maintenanceType":0,"description":"string","cost":0.1,"vendor":"string","startDate":"2019-08-24T14:15:22Z","endDate":"2019-08-24T14:15:22Z","status":0,"notes":"string","createdAt":"2019-08-24T14:15:22Z"}
```

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
  "assetCode": "string",
  "maintenanceType": 0,
  "description": "string",
  "cost": 0.1,
  "vendor": "string",
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "status": 0,
  "notes": "string",
  "createdAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="post__api_assets_{id}_maintenance-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MaintenanceRecordDto](#schemamaintenancerecorddto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## get__api_assets_{id}_maintenance

> Code samples

```shell
# You can also use wget
curl -X GET /api/assets/{id}/maintenance \
  -H 'Accept: text/plain'

```

`GET /api/assets/{id}/maintenance`

<h3 id="get__api_assets_{id}_maintenance-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|
|page|query|integer(int32)|false|none|
|pageSize|query|integer(int32)|false|none|

> Example responses

> 200 Response

```
{"items":[{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","assetInstanceId":"605efab6-99a7-4ea3-8f61-391429fbad2b","assetCode":"string","maintenanceType":0,"description":"string","cost":0.1,"vendor":"string","startDate":"2019-08-24T14:15:22Z","endDate":"2019-08-24T14:15:22Z","status":0,"notes":"string","createdAt":"2019-08-24T14:15:22Z"}],"total":0,"page":0,"pageSize":0,"totalPages":0}
```

```json
{
  "items": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
      "assetCode": "string",
      "maintenanceType": 0,
      "description": "string",
      "cost": 0.1,
      "vendor": "string",
      "startDate": "2019-08-24T14:15:22Z",
      "endDate": "2019-08-24T14:15:22Z",
      "status": 0,
      "notes": "string",
      "createdAt": "2019-08-24T14:15:22Z"
    }
  ],
  "total": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
```

<h3 id="get__api_assets_{id}_maintenance-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MaintenanceRecordDtoPagedResult](#schemamaintenancerecorddtopagedresult)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## post__api_assets_{id}_maintenance_{recordId}_complete

> Code samples

```shell
# You can also use wget
curl -X POST /api/assets/{id}/maintenance/{recordId}/complete \
  -H 'Content-Type: application/json' \
  -H 'Accept: text/plain'

```

`POST /api/assets/{id}/maintenance/{recordId}/complete`

> Body parameter

```json
{
  "cost": 0.1,
  "notes": "string"
}
```

<h3 id="post__api_assets_{id}_maintenance_{recordid}_complete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|
|recordId|path|string(uuid)|true|none|
|body|body|[CompleteMaintenanceDto](#schemacompletemaintenancedto)|false|none|

> Example responses

> 200 Response

```
{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","assetInstanceId":"605efab6-99a7-4ea3-8f61-391429fbad2b","assetCode":"string","maintenanceType":0,"description":"string","cost":0.1,"vendor":"string","startDate":"2019-08-24T14:15:22Z","endDate":"2019-08-24T14:15:22Z","status":0,"notes":"string","createdAt":"2019-08-24T14:15:22Z"}
```

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
  "assetCode": "string",
  "maintenanceType": 0,
  "description": "string",
  "cost": 0.1,
  "vendor": "string",
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "status": 0,
  "notes": "string",
  "createdAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="post__api_assets_{id}_maintenance_{recordid}_complete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MaintenanceRecordDto](#schemamaintenancerecorddto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## post__api_assets_{id}_dispose

> Code samples

```shell
# You can also use wget
curl -X POST /api/assets/{id}/dispose \
  -H 'Content-Type: application/json' \
  -H 'Accept: text/plain'

```

`POST /api/assets/{id}/dispose`

> Body parameter

```json
{
  "type": 0,
  "soldToUserId": "37458171-1eb9-43ad-bd19-bf032d003230",
  "salePrice": 0.1,
  "reason": "string"
}
```

<h3 id="post__api_assets_{id}_dispose-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|
|body|body|[DisposeAssetDto](#schemadisposeassetdto)|false|none|

> Example responses

> 200 Response

```
{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","assetInstanceId":"605efab6-99a7-4ea3-8f61-391429fbad2b","assetCode":"string","disposalType":0,"soldToUserId":"37458171-1eb9-43ad-bd19-bf032d003230","soldToUserName":"string","salePrice":0.1,"reason":"string","disposedAt":"2019-08-24T14:15:22Z","createdAt":"2019-08-24T14:15:22Z"}
```

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
  "assetCode": "string",
  "disposalType": 0,
  "soldToUserId": "37458171-1eb9-43ad-bd19-bf032d003230",
  "soldToUserName": "string",
  "salePrice": 0.1,
  "reason": "string",
  "disposedAt": "2019-08-24T14:15:22Z",
  "createdAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="post__api_assets_{id}_dispose-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[DisposalDto](#schemadisposaldto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="assetmgmt-assetmodels">AssetModels</h1>

## get__api_asset-models

> Code samples

```shell
# You can also use wget
curl -X GET /api/asset-models \
  -H 'Accept: text/plain'

```

`GET /api/asset-models`

<h3 id="get__api_asset-models-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|category|query|[AssetCategory](#schemaassetcategory)|false|none|
|search|query|string|false|none|
|page|query|integer(int32)|false|none|
|pageSize|query|integer(int32)|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|category|0|
|category|1|
|category|2|
|category|3|
|category|4|
|category|5|
|category|6|
|category|7|

> Example responses

> 200 Response

```
{"items":[{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","name":"string","category":0,"manufacturer":"string","modelNumber":"string","defaultUsefulLifeMonths":0,"instanceCount":0}],"total":0,"page":0,"pageSize":0,"totalPages":0}
```

```json
{
  "items": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "name": "string",
      "category": 0,
      "manufacturer": "string",
      "modelNumber": "string",
      "defaultUsefulLifeMonths": 0,
      "instanceCount": 0
    }
  ],
  "total": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
```

<h3 id="get__api_asset-models-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[AssetModelListItemPagedResult](#schemaassetmodellistitempagedresult)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## post__api_asset-models

> Code samples

```shell
# You can also use wget
curl -X POST /api/asset-models \
  -H 'Content-Type: application/json' \
  -H 'Accept: text/plain'

```

`POST /api/asset-models`

> Body parameter

```json
{
  "name": "string",
  "category": 0,
  "manufacturer": "string",
  "modelNumber": "string",
  "specs": "string",
  "defaultUsefulLifeMonths": 0,
  "defaultDepreciationMethod": 0,
  "imageUrl": "string"
}
```

<h3 id="post__api_asset-models-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CreateAssetModelRequest](#schemacreateassetmodelrequest)|false|none|

> Example responses

> 200 Response

```
{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","name":"string","category":0,"manufacturer":"string","modelNumber":"string","specs":"string","defaultUsefulLifeMonths":0,"defaultDepreciationMethod":0,"imageUrl":"string","createdAt":"2019-08-24T14:15:22Z","updatedAt":"2019-08-24T14:15:22Z"}
```

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "name": "string",
  "category": 0,
  "manufacturer": "string",
  "modelNumber": "string",
  "specs": "string",
  "defaultUsefulLifeMonths": 0,
  "defaultDepreciationMethod": 0,
  "imageUrl": "string",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="post__api_asset-models-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[AssetModelDto](#schemaassetmodeldto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## get__api_asset-models_{id}

> Code samples

```shell
# You can also use wget
curl -X GET /api/asset-models/{id} \
  -H 'Accept: text/plain'

```

`GET /api/asset-models/{id}`

<h3 id="get__api_asset-models_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|

> Example responses

> 200 Response

```
{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","name":"string","category":0,"manufacturer":"string","modelNumber":"string","specs":"string","defaultUsefulLifeMonths":0,"defaultDepreciationMethod":0,"imageUrl":"string","createdAt":"2019-08-24T14:15:22Z","updatedAt":"2019-08-24T14:15:22Z"}
```

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "name": "string",
  "category": 0,
  "manufacturer": "string",
  "modelNumber": "string",
  "specs": "string",
  "defaultUsefulLifeMonths": 0,
  "defaultDepreciationMethod": 0,
  "imageUrl": "string",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="get__api_asset-models_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[AssetModelDto](#schemaassetmodeldto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## put__api_asset-models_{id}

> Code samples

```shell
# You can also use wget
curl -X PUT /api/asset-models/{id} \
  -H 'Content-Type: application/json' \
  -H 'Accept: text/plain'

```

`PUT /api/asset-models/{id}`

> Body parameter

```json
{
  "name": "string",
  "category": 0,
  "manufacturer": "string",
  "modelNumber": "string",
  "specs": "string",
  "defaultUsefulLifeMonths": 0,
  "defaultDepreciationMethod": 0,
  "imageUrl": "string"
}
```

<h3 id="put__api_asset-models_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|
|body|body|[UpdateAssetModelRequest](#schemaupdateassetmodelrequest)|false|none|

> Example responses

> 200 Response

```
{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","name":"string","category":0,"manufacturer":"string","modelNumber":"string","specs":"string","defaultUsefulLifeMonths":0,"defaultDepreciationMethod":0,"imageUrl":"string","createdAt":"2019-08-24T14:15:22Z","updatedAt":"2019-08-24T14:15:22Z"}
```

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "name": "string",
  "category": 0,
  "manufacturer": "string",
  "modelNumber": "string",
  "specs": "string",
  "defaultUsefulLifeMonths": 0,
  "defaultDepreciationMethod": 0,
  "imageUrl": "string",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="put__api_asset-models_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[AssetModelDto](#schemaassetmodeldto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## delete__api_asset-models_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE /api/asset-models/{id}

```

`DELETE /api/asset-models/{id}`

<h3 id="delete__api_asset-models_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|

<h3 id="delete__api_asset-models_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="assetmgmt-auth">Auth</h1>

## post__api_auth_login

> Code samples

```shell
# You can also use wget
curl -X POST /api/auth/login \
  -H 'Content-Type: application/json' \
  -H 'Accept: text/plain'

```

`POST /api/auth/login`

> Body parameter

```json
{
  "userName": "string",
  "password": "string"
}
```

<h3 id="post__api_auth_login-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[LoginRequest](#schemaloginrequest)|false|none|

> Example responses

> 200 Response

```
{"accessToken":"string","refreshToken":"string","accessTokenExpiresAt":"2019-08-24T14:15:22Z","tokenType":"string"}
```

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "accessTokenExpiresAt": "2019-08-24T14:15:22Z",
  "tokenType": "string"
}
```

<h3 id="post__api_auth_login-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[TokenResponse](#schematokenresponse)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## post__api_auth_refresh

> Code samples

```shell
# You can also use wget
curl -X POST /api/auth/refresh \
  -H 'Content-Type: application/json' \
  -H 'Accept: text/plain'

```

`POST /api/auth/refresh`

> Body parameter

```json
{
  "refreshToken": "string"
}
```

<h3 id="post__api_auth_refresh-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[RefreshRequest](#schemarefreshrequest)|false|none|

> Example responses

> 200 Response

```
{"accessToken":"string","refreshToken":"string","accessTokenExpiresAt":"2019-08-24T14:15:22Z","tokenType":"string"}
```

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "accessTokenExpiresAt": "2019-08-24T14:15:22Z",
  "tokenType": "string"
}
```

<h3 id="post__api_auth_refresh-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[TokenResponse](#schematokenresponse)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## get__api_auth_me

> Code samples

```shell
# You can also use wget
curl -X GET /api/auth/me \
  -H 'Accept: text/plain'

```

`GET /api/auth/me`

> Example responses

> 200 Response

```
{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","userName":"string","email":"string","fullName":"string","employeeCode":"string","role":"string","departmentId":"a3452d1e-b055-4677-aa66-858ddc0a1f59","departmentName":"string"}
```

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "userName": "string",
  "email": "string",
  "fullName": "string",
  "employeeCode": "string",
  "role": "string",
  "departmentId": "a3452d1e-b055-4677-aa66-858ddc0a1f59",
  "departmentName": "string"
}
```

<h3 id="get__api_auth_me-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MeResponse](#schemameresponse)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="assetmgmt-departments">Departments</h1>

## get__api_departments

> Code samples

```shell
# You can also use wget
curl -X GET /api/departments \
  -H 'Accept: text/plain'

```

`GET /api/departments`

<h3 id="get__api_departments-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|isActive|query|boolean|false|none|
|search|query|string|false|none|
|page|query|integer(int32)|false|none|
|pageSize|query|integer(int32)|false|none|

> Example responses

> 200 Response

```
{"items":[{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","code":"string","name":"string","managerId":"b2c2c359-55f3-4680-a660-901475c7a693","managerName":"string","isActive":true,"userCount":0}],"total":0,"page":0,"pageSize":0,"totalPages":0}
```

```json
{
  "items": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "code": "string",
      "name": "string",
      "managerId": "b2c2c359-55f3-4680-a660-901475c7a693",
      "managerName": "string",
      "isActive": true,
      "userCount": 0
    }
  ],
  "total": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
```

<h3 id="get__api_departments-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[DepartmentListItemPagedResult](#schemadepartmentlistitempagedresult)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## post__api_departments

> Code samples

```shell
# You can also use wget
curl -X POST /api/departments \
  -H 'Content-Type: application/json' \
  -H 'Accept: text/plain'

```

`POST /api/departments`

> Body parameter

```json
{
  "code": "string",
  "name": "string",
  "managerId": "b2c2c359-55f3-4680-a660-901475c7a693"
}
```

<h3 id="post__api_departments-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CreateDepartmentRequest](#schemacreatedepartmentrequest)|false|none|

> Example responses

> 200 Response

```
{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","code":"string","name":"string","managerId":"b2c2c359-55f3-4680-a660-901475c7a693","managerName":"string","isActive":true,"createdAt":"2019-08-24T14:15:22Z","updatedAt":"2019-08-24T14:15:22Z"}
```

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "code": "string",
  "name": "string",
  "managerId": "b2c2c359-55f3-4680-a660-901475c7a693",
  "managerName": "string",
  "isActive": true,
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="post__api_departments-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[DepartmentDto](#schemadepartmentdto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## get__api_departments_{id}

> Code samples

```shell
# You can also use wget
curl -X GET /api/departments/{id} \
  -H 'Accept: text/plain'

```

`GET /api/departments/{id}`

<h3 id="get__api_departments_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|

> Example responses

> 200 Response

```
{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","code":"string","name":"string","managerId":"b2c2c359-55f3-4680-a660-901475c7a693","managerName":"string","isActive":true,"createdAt":"2019-08-24T14:15:22Z","updatedAt":"2019-08-24T14:15:22Z"}
```

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "code": "string",
  "name": "string",
  "managerId": "b2c2c359-55f3-4680-a660-901475c7a693",
  "managerName": "string",
  "isActive": true,
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="get__api_departments_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[DepartmentDto](#schemadepartmentdto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## put__api_departments_{id}

> Code samples

```shell
# You can also use wget
curl -X PUT /api/departments/{id} \
  -H 'Content-Type: application/json' \
  -H 'Accept: text/plain'

```

`PUT /api/departments/{id}`

> Body parameter

```json
{
  "name": "string",
  "managerId": "b2c2c359-55f3-4680-a660-901475c7a693",
  "isActive": true
}
```

<h3 id="put__api_departments_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|
|body|body|[UpdateDepartmentRequest](#schemaupdatedepartmentrequest)|false|none|

> Example responses

> 200 Response

```
{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","code":"string","name":"string","managerId":"b2c2c359-55f3-4680-a660-901475c7a693","managerName":"string","isActive":true,"createdAt":"2019-08-24T14:15:22Z","updatedAt":"2019-08-24T14:15:22Z"}
```

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "code": "string",
  "name": "string",
  "managerId": "b2c2c359-55f3-4680-a660-901475c7a693",
  "managerName": "string",
  "isActive": true,
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="put__api_departments_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[DepartmentDto](#schemadepartmentdto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## delete__api_departments_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE /api/departments/{id}

```

`DELETE /api/departments/{id}`

<h3 id="delete__api_departments_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|

<h3 id="delete__api_departments_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## post__api_departments_{id}_manager

> Code samples

```shell
# You can also use wget
curl -X POST /api/departments/{id}/manager \
  -H 'Content-Type: application/json' \
  -H 'Accept: text/plain'

```

`POST /api/departments/{id}/manager`

> Body parameter

```json
{
  "managerId": "b2c2c359-55f3-4680-a660-901475c7a693"
}
```

<h3 id="post__api_departments_{id}_manager-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|
|body|body|[AssignManagerRequest](#schemaassignmanagerrequest)|false|none|

> Example responses

> 200 Response

```
{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","code":"string","name":"string","managerId":"b2c2c359-55f3-4680-a660-901475c7a693","managerName":"string","isActive":true,"createdAt":"2019-08-24T14:15:22Z","updatedAt":"2019-08-24T14:15:22Z"}
```

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "code": "string",
  "name": "string",
  "managerId": "b2c2c359-55f3-4680-a660-901475c7a693",
  "managerName": "string",
  "isActive": true,
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="post__api_departments_{id}_manager-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[DepartmentDto](#schemadepartmentdto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="assetmgmt-disposals">Disposals</h1>

## get__api_disposals

> Code samples

```shell
# You can also use wget
curl -X GET /api/disposals \
  -H 'Accept: text/plain'

```

`GET /api/disposals`

<h3 id="get__api_disposals-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|type|query|[DisposalType](#schemadisposaltype)|false|none|
|page|query|integer(int32)|false|none|
|pageSize|query|integer(int32)|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|type|0|
|type|1|
|type|2|
|type|3|

> Example responses

> 200 Response

```
{"items":[{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","assetInstanceId":"605efab6-99a7-4ea3-8f61-391429fbad2b","assetCode":"string","disposalType":0,"soldToUserId":"37458171-1eb9-43ad-bd19-bf032d003230","soldToUserName":"string","salePrice":0.1,"reason":"string","disposedAt":"2019-08-24T14:15:22Z","createdAt":"2019-08-24T14:15:22Z"}],"total":0,"page":0,"pageSize":0,"totalPages":0}
```

```json
{
  "items": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
      "assetCode": "string",
      "disposalType": 0,
      "soldToUserId": "37458171-1eb9-43ad-bd19-bf032d003230",
      "soldToUserName": "string",
      "salePrice": 0.1,
      "reason": "string",
      "disposedAt": "2019-08-24T14:15:22Z",
      "createdAt": "2019-08-24T14:15:22Z"
    }
  ],
  "total": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
```

<h3 id="get__api_disposals-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[DisposalDtoPagedResult](#schemadisposaldtopagedresult)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="assetmgmt-reports">Reports</h1>

## get__api_reports_dashboard

> Code samples

```shell
# You can also use wget
curl -X GET /api/reports/dashboard \
  -H 'Accept: text/plain'

```

`GET /api/reports/dashboard`

> Example responses

> 200 Response

```
{"totalAssets":0,"inStock":0,"allocated":0,"lockedTemp":0,"maintenance":0,"endOfLife":0,"pendingRequests":0,"totalAcquisitionCost":0.1,"byStatus":[{"status":0,"count":0}],"byCategory":[{"category":0,"count":0}]}
```

```json
{
  "totalAssets": 0,
  "inStock": 0,
  "allocated": 0,
  "lockedTemp": 0,
  "maintenance": 0,
  "endOfLife": 0,
  "pendingRequests": 0,
  "totalAcquisitionCost": 0.1,
  "byStatus": [
    {
      "status": 0,
      "count": 0
    }
  ],
  "byCategory": [
    {
      "category": 0,
      "count": 0
    }
  ]
}
```

<h3 id="get__api_reports_dashboard-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[DashboardStatsDto](#schemadashboardstatsdto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## get__api_reports_idle-assets

> Code samples

```shell
# You can also use wget
curl -X GET /api/reports/idle-assets \
  -H 'Accept: text/plain'

```

`GET /api/reports/idle-assets`

<h3 id="get__api_reports_idle-assets-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|idleMonths|query|integer(int32)|false|none|
|page|query|integer(int32)|false|none|
|pageSize|query|integer(int32)|false|none|

> Example responses

> 200 Response

```
{"items":[{"assetInstanceId":"605efab6-99a7-4ea3-8f61-391429fbad2b","assetCode":"string","modelName":"string","category":0,"status":0,"location":"string","acquisitionCost":0.1,"acquisitionDate":"2019-08-24T14:15:22Z","lastActivityAt":"2019-08-24T14:15:22Z","idleMonths":0}],"total":0,"page":0,"pageSize":0,"totalPages":0}
```

```json
{
  "items": [
    {
      "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
      "assetCode": "string",
      "modelName": "string",
      "category": 0,
      "status": 0,
      "location": "string",
      "acquisitionCost": 0.1,
      "acquisitionDate": "2019-08-24T14:15:22Z",
      "lastActivityAt": "2019-08-24T14:15:22Z",
      "idleMonths": 0
    }
  ],
  "total": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
```

<h3 id="get__api_reports_idle-assets-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[IdleAssetItemPagedResult](#schemaidleassetitempagedresult)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="assetmgmt-users">Users</h1>

## get__api_users

> Code samples

```shell
# You can also use wget
curl -X GET /api/users \
  -H 'Accept: text/plain'

```

`GET /api/users`

<h3 id="get__api_users-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|role|query|[UserRole](#schemauserrole)|false|none|
|departmentId|query|string(uuid)|false|none|
|isActive|query|boolean|false|none|
|search|query|string|false|none|
|page|query|integer(int32)|false|none|
|pageSize|query|integer(int32)|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|role|0|
|role|1|
|role|2|

> Example responses

> 200 Response

```
{"items":[{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","userName":"string","email":"string","fullName":"string","employeeCode":"string","role":0,"departmentId":"a3452d1e-b055-4677-aa66-858ddc0a1f59","departmentName":"string","isActive":true}],"total":0,"page":0,"pageSize":0,"totalPages":0}
```

```json
{
  "items": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "userName": "string",
      "email": "string",
      "fullName": "string",
      "employeeCode": "string",
      "role": 0,
      "departmentId": "a3452d1e-b055-4677-aa66-858ddc0a1f59",
      "departmentName": "string",
      "isActive": true
    }
  ],
  "total": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
```

<h3 id="get__api_users-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[UserListItemPagedResult](#schemauserlistitempagedresult)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## post__api_users

> Code samples

```shell
# You can also use wget
curl -X POST /api/users \
  -H 'Content-Type: application/json' \
  -H 'Accept: text/plain'

```

`POST /api/users`

> Body parameter

```json
{
  "userName": "string",
  "email": "string",
  "password": "string",
  "fullName": "string",
  "employeeCode": "string",
  "role": 0,
  "departmentId": "a3452d1e-b055-4677-aa66-858ddc0a1f59"
}
```

<h3 id="post__api_users-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CreateUserRequest](#schemacreateuserrequest)|false|none|

> Example responses

> 200 Response

```
{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","userName":"string","email":"string","fullName":"string","employeeCode":"string","role":0,"departmentId":"a3452d1e-b055-4677-aa66-858ddc0a1f59","departmentName":"string","isActive":true,"lastLoginAt":"2019-08-24T14:15:22Z","createdAt":"2019-08-24T14:15:22Z","updatedAt":"2019-08-24T14:15:22Z"}
```

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "userName": "string",
  "email": "string",
  "fullName": "string",
  "employeeCode": "string",
  "role": 0,
  "departmentId": "a3452d1e-b055-4677-aa66-858ddc0a1f59",
  "departmentName": "string",
  "isActive": true,
  "lastLoginAt": "2019-08-24T14:15:22Z",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="post__api_users-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[UserDto](#schemauserdto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## get__api_users_{id}

> Code samples

```shell
# You can also use wget
curl -X GET /api/users/{id} \
  -H 'Accept: text/plain'

```

`GET /api/users/{id}`

<h3 id="get__api_users_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|

> Example responses

> 200 Response

```
{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","userName":"string","email":"string","fullName":"string","employeeCode":"string","role":0,"departmentId":"a3452d1e-b055-4677-aa66-858ddc0a1f59","departmentName":"string","isActive":true,"lastLoginAt":"2019-08-24T14:15:22Z","createdAt":"2019-08-24T14:15:22Z","updatedAt":"2019-08-24T14:15:22Z"}
```

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "userName": "string",
  "email": "string",
  "fullName": "string",
  "employeeCode": "string",
  "role": 0,
  "departmentId": "a3452d1e-b055-4677-aa66-858ddc0a1f59",
  "departmentName": "string",
  "isActive": true,
  "lastLoginAt": "2019-08-24T14:15:22Z",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="get__api_users_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[UserDto](#schemauserdto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## put__api_users_{id}

> Code samples

```shell
# You can also use wget
curl -X PUT /api/users/{id} \
  -H 'Content-Type: application/json' \
  -H 'Accept: text/plain'

```

`PUT /api/users/{id}`

> Body parameter

```json
{
  "email": "string",
  "fullName": "string",
  "role": 0,
  "departmentId": "a3452d1e-b055-4677-aa66-858ddc0a1f59",
  "isActive": true
}
```

<h3 id="put__api_users_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|
|body|body|[UpdateUserRequest](#schemaupdateuserrequest)|false|none|

> Example responses

> 200 Response

```
{"id":"497f6eca-6276-4993-bfeb-53cbbbba6f08","userName":"string","email":"string","fullName":"string","employeeCode":"string","role":0,"departmentId":"a3452d1e-b055-4677-aa66-858ddc0a1f59","departmentName":"string","isActive":true,"lastLoginAt":"2019-08-24T14:15:22Z","createdAt":"2019-08-24T14:15:22Z","updatedAt":"2019-08-24T14:15:22Z"}
```

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "userName": "string",
  "email": "string",
  "fullName": "string",
  "employeeCode": "string",
  "role": 0,
  "departmentId": "a3452d1e-b055-4677-aa66-858ddc0a1f59",
  "departmentName": "string",
  "isActive": true,
  "lastLoginAt": "2019-08-24T14:15:22Z",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="put__api_users_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[UserDto](#schemauserdto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## delete__api_users_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE /api/users/{id}

```

`DELETE /api/users/{id}`

<h3 id="delete__api_users_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|

<h3 id="delete__api_users_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## post__api_users_{id}_reset-password

> Code samples

```shell
# You can also use wget
curl -X POST /api/users/{id}/reset-password \
  -H 'Content-Type: application/json'

```

`POST /api/users/{id}/reset-password`

> Body parameter

```json
{
  "newPassword": "string"
}
```

<h3 id="post__api_users_{id}_reset-password-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|
|body|body|[ResetPasswordRequest](#schemaresetpasswordrequest)|false|none|

<h3 id="post__api_users_{id}_reset-password-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

# Schemas

<h2 id="tocS_AllocationEventType">AllocationEventType</h2>
<!-- backwards compatibility -->
<a id="schemaallocationeventtype"></a>
<a id="schema_AllocationEventType"></a>
<a id="tocSallocationeventtype"></a>
<a id="tocsallocationeventtype"></a>

```json
0

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|integer(int32)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|*anonymous*|0|
|*anonymous*|1|
|*anonymous*|2|

<h2 id="tocS_AllocationHistoryItem">AllocationHistoryItem</h2>
<!-- backwards compatibility -->
<a id="schemaallocationhistoryitem"></a>
<a id="schema_AllocationHistoryItem"></a>
<a id="tocSallocationhistoryitem"></a>
<a id="tocsallocationhistoryitem"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
  "assetCode": "string",
  "modelName": "string",
  "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
  "userName": "string",
  "eventType": 0,
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "allocationRequestId": "e6691aef-d73d-4b59-bb6b-d154ce78d9c7",
  "notes": "string",
  "createdAt": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|none|
|assetInstanceId|string(uuid)|false|none|none|
|assetCode|string¦null|false|none|none|
|modelName|string¦null|false|none|none|
|userId|string(uuid)|false|none|none|
|userName|string¦null|false|none|none|
|eventType|[AllocationEventType](#schemaallocationeventtype)|false|none|none|
|startDate|string(date-time)|false|none|none|
|endDate|string(date-time)¦null|false|none|none|
|allocationRequestId|string(uuid)¦null|false|none|none|
|notes|string¦null|false|none|none|
|createdAt|string(date-time)|false|none|none|

<h2 id="tocS_AllocationHistoryItemPagedResult">AllocationHistoryItemPagedResult</h2>
<!-- backwards compatibility -->
<a id="schemaallocationhistoryitempagedresult"></a>
<a id="schema_AllocationHistoryItemPagedResult"></a>
<a id="tocSallocationhistoryitempagedresult"></a>
<a id="tocsallocationhistoryitempagedresult"></a>

```json
{
  "items": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
      "assetCode": "string",
      "modelName": "string",
      "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
      "userName": "string",
      "eventType": 0,
      "startDate": "2019-08-24T14:15:22Z",
      "endDate": "2019-08-24T14:15:22Z",
      "allocationRequestId": "e6691aef-d73d-4b59-bb6b-d154ce78d9c7",
      "notes": "string",
      "createdAt": "2019-08-24T14:15:22Z"
    }
  ],
  "total": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|items|[[AllocationHistoryItem](#schemaallocationhistoryitem)]¦null|false|none|none|
|total|integer(int32)|false|none|none|
|page|integer(int32)|false|none|none|
|pageSize|integer(int32)|false|none|none|
|totalPages|integer(int32)|false|read-only|none|

<h2 id="tocS_AllocationRequestDto">AllocationRequestDto</h2>
<!-- backwards compatibility -->
<a id="schemaallocationrequestdto"></a>
<a id="schema_AllocationRequestDto"></a>
<a id="tocSallocationrequestdto"></a>
<a id="tocsallocationrequestdto"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "requesterId": "ba828041-f5bf-46f6-bf7c-22eccb01f2a4",
  "requesterName": "string",
  "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
  "assetCode": "string",
  "modelName": "string",
  "status": 0,
  "reason": "string",
  "expectedDurationMonths": 0,
  "approverId": "c4cb1502-f1f4-43be-8940-63247031d1fd",
  "approverName": "string",
  "approvedAt": "2019-08-24T14:15:22Z",
  "rejectedReason": "string",
  "lockExpiresAt": "2019-08-24T14:15:22Z",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|none|
|requesterId|string(uuid)|false|none|none|
|requesterName|string¦null|false|none|none|
|assetInstanceId|string(uuid)|false|none|none|
|assetCode|string¦null|false|none|none|
|modelName|string¦null|false|none|none|
|status|[RequestStatus](#schemarequeststatus)|false|none|none|
|reason|string¦null|false|none|none|
|expectedDurationMonths|integer(int32)¦null|false|none|none|
|approverId|string(uuid)¦null|false|none|none|
|approverName|string¦null|false|none|none|
|approvedAt|string(date-time)¦null|false|none|none|
|rejectedReason|string¦null|false|none|none|
|lockExpiresAt|string(date-time)¦null|false|none|none|
|createdAt|string(date-time)|false|none|none|
|updatedAt|string(date-time)|false|none|none|

<h2 id="tocS_AssetCategory">AssetCategory</h2>
<!-- backwards compatibility -->
<a id="schemaassetcategory"></a>
<a id="schema_AssetCategory"></a>
<a id="tocSassetcategory"></a>
<a id="tocsassetcategory"></a>

```json
0

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|integer(int32)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|*anonymous*|0|
|*anonymous*|1|
|*anonymous*|2|
|*anonymous*|3|
|*anonymous*|4|
|*anonymous*|5|
|*anonymous*|6|
|*anonymous*|7|

<h2 id="tocS_AssetInstanceDto">AssetInstanceDto</h2>
<!-- backwards compatibility -->
<a id="schemaassetinstancedto"></a>
<a id="schema_AssetInstanceDto"></a>
<a id="tocSassetinstancedto"></a>
<a id="tocsassetinstancedto"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "assetCode": "string",
  "serial": "string",
  "modelId": "17563eeb-82d7-4210-ac9b-1a20c7d67278",
  "modelName": "string",
  "status": 0,
  "currentHolderId": "7e755a82-bc10-4c7a-948f-df601c50d188",
  "currentHolderName": "string",
  "acquisitionCost": 0.1,
  "acquisitionDate": "2019-08-24T14:15:22Z",
  "salvageValue": 0.1,
  "location": "string",
  "warrantyExpiresAt": "2019-08-24T14:15:22Z",
  "qrCodePath": "string",
  "notes": "string",
  "version": 0,
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|none|
|assetCode|string¦null|false|none|none|
|serial|string¦null|false|none|none|
|modelId|string(uuid)|false|none|none|
|modelName|string¦null|false|none|none|
|status|[AssetStatus](#schemaassetstatus)|false|none|none|
|currentHolderId|string(uuid)¦null|false|none|none|
|currentHolderName|string¦null|false|none|none|
|acquisitionCost|number(double)|false|none|none|
|acquisitionDate|string(date-time)|false|none|none|
|salvageValue|number(double)|false|none|none|
|location|string¦null|false|none|none|
|warrantyExpiresAt|string(date-time)¦null|false|none|none|
|qrCodePath|string¦null|false|none|none|
|notes|string¦null|false|none|none|
|version|integer(int32)|false|none|none|
|createdAt|string(date-time)|false|none|none|
|updatedAt|string(date-time)|false|none|none|

<h2 id="tocS_AssetInstanceListItem">AssetInstanceListItem</h2>
<!-- backwards compatibility -->
<a id="schemaassetinstancelistitem"></a>
<a id="schema_AssetInstanceListItem"></a>
<a id="tocSassetinstancelistitem"></a>
<a id="tocsassetinstancelistitem"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "assetCode": "string",
  "serial": "string",
  "modelId": "17563eeb-82d7-4210-ac9b-1a20c7d67278",
  "modelName": "string",
  "status": 0,
  "currentHolderId": "7e755a82-bc10-4c7a-948f-df601c50d188",
  "currentHolderName": "string",
  "location": "string",
  "qrCodePath": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|none|
|assetCode|string¦null|false|none|none|
|serial|string¦null|false|none|none|
|modelId|string(uuid)|false|none|none|
|modelName|string¦null|false|none|none|
|status|[AssetStatus](#schemaassetstatus)|false|none|none|
|currentHolderId|string(uuid)¦null|false|none|none|
|currentHolderName|string¦null|false|none|none|
|location|string¦null|false|none|none|
|qrCodePath|string¦null|false|none|none|

<h2 id="tocS_AssetInstanceListItemPagedResult">AssetInstanceListItemPagedResult</h2>
<!-- backwards compatibility -->
<a id="schemaassetinstancelistitempagedresult"></a>
<a id="schema_AssetInstanceListItemPagedResult"></a>
<a id="tocSassetinstancelistitempagedresult"></a>
<a id="tocsassetinstancelistitempagedresult"></a>

```json
{
  "items": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "assetCode": "string",
      "serial": "string",
      "modelId": "17563eeb-82d7-4210-ac9b-1a20c7d67278",
      "modelName": "string",
      "status": 0,
      "currentHolderId": "7e755a82-bc10-4c7a-948f-df601c50d188",
      "currentHolderName": "string",
      "location": "string",
      "qrCodePath": "string"
    }
  ],
  "total": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|items|[[AssetInstanceListItem](#schemaassetinstancelistitem)]¦null|false|none|none|
|total|integer(int32)|false|none|none|
|page|integer(int32)|false|none|none|
|pageSize|integer(int32)|false|none|none|
|totalPages|integer(int32)|false|read-only|none|

<h2 id="tocS_AssetModelDto">AssetModelDto</h2>
<!-- backwards compatibility -->
<a id="schemaassetmodeldto"></a>
<a id="schema_AssetModelDto"></a>
<a id="tocSassetmodeldto"></a>
<a id="tocsassetmodeldto"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "name": "string",
  "category": 0,
  "manufacturer": "string",
  "modelNumber": "string",
  "specs": "string",
  "defaultUsefulLifeMonths": 0,
  "defaultDepreciationMethod": 0,
  "imageUrl": "string",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|none|
|name|string¦null|false|none|none|
|category|[AssetCategory](#schemaassetcategory)|false|none|none|
|manufacturer|string¦null|false|none|none|
|modelNumber|string¦null|false|none|none|
|specs|string¦null|false|none|none|
|defaultUsefulLifeMonths|integer(int32)|false|none|none|
|defaultDepreciationMethod|[DepreciationMethod](#schemadepreciationmethod)|false|none|none|
|imageUrl|string¦null|false|none|none|
|createdAt|string(date-time)|false|none|none|
|updatedAt|string(date-time)|false|none|none|

<h2 id="tocS_AssetModelListItem">AssetModelListItem</h2>
<!-- backwards compatibility -->
<a id="schemaassetmodellistitem"></a>
<a id="schema_AssetModelListItem"></a>
<a id="tocSassetmodellistitem"></a>
<a id="tocsassetmodellistitem"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "name": "string",
  "category": 0,
  "manufacturer": "string",
  "modelNumber": "string",
  "defaultUsefulLifeMonths": 0,
  "instanceCount": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|none|
|name|string¦null|false|none|none|
|category|[AssetCategory](#schemaassetcategory)|false|none|none|
|manufacturer|string¦null|false|none|none|
|modelNumber|string¦null|false|none|none|
|defaultUsefulLifeMonths|integer(int32)|false|none|none|
|instanceCount|integer(int32)|false|none|none|

<h2 id="tocS_AssetModelListItemPagedResult">AssetModelListItemPagedResult</h2>
<!-- backwards compatibility -->
<a id="schemaassetmodellistitempagedresult"></a>
<a id="schema_AssetModelListItemPagedResult"></a>
<a id="tocSassetmodellistitempagedresult"></a>
<a id="tocsassetmodellistitempagedresult"></a>

```json
{
  "items": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "name": "string",
      "category": 0,
      "manufacturer": "string",
      "modelNumber": "string",
      "defaultUsefulLifeMonths": 0,
      "instanceCount": 0
    }
  ],
  "total": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|items|[[AssetModelListItem](#schemaassetmodellistitem)]¦null|false|none|none|
|total|integer(int32)|false|none|none|
|page|integer(int32)|false|none|none|
|pageSize|integer(int32)|false|none|none|
|totalPages|integer(int32)|false|read-only|none|

<h2 id="tocS_AssetStatus">AssetStatus</h2>
<!-- backwards compatibility -->
<a id="schemaassetstatus"></a>
<a id="schema_AssetStatus"></a>
<a id="tocSassetstatus"></a>
<a id="tocsassetstatus"></a>

```json
0

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|integer(int32)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|*anonymous*|0|
|*anonymous*|1|
|*anonymous*|2|
|*anonymous*|3|
|*anonymous*|4|
|*anonymous*|5|
|*anonymous*|6|

<h2 id="tocS_AssignManagerRequest">AssignManagerRequest</h2>
<!-- backwards compatibility -->
<a id="schemaassignmanagerrequest"></a>
<a id="schema_AssignManagerRequest"></a>
<a id="tocSassignmanagerrequest"></a>
<a id="tocsassignmanagerrequest"></a>

```json
{
  "managerId": "b2c2c359-55f3-4680-a660-901475c7a693"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|managerId|string(uuid)|false|none|none|

<h2 id="tocS_CategoryCount">CategoryCount</h2>
<!-- backwards compatibility -->
<a id="schemacategorycount"></a>
<a id="schema_CategoryCount"></a>
<a id="tocScategorycount"></a>
<a id="tocscategorycount"></a>

```json
{
  "category": 0,
  "count": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|category|[AssetCategory](#schemaassetcategory)|false|none|none|
|count|integer(int32)|false|none|none|

<h2 id="tocS_CompleteMaintenanceDto">CompleteMaintenanceDto</h2>
<!-- backwards compatibility -->
<a id="schemacompletemaintenancedto"></a>
<a id="schema_CompleteMaintenanceDto"></a>
<a id="tocScompletemaintenancedto"></a>
<a id="tocscompletemaintenancedto"></a>

```json
{
  "cost": 0.1,
  "notes": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|cost|number(double)¦null|false|none|none|
|notes|string¦null|false|none|none|

<h2 id="tocS_CreateAssetInstanceRequest">CreateAssetInstanceRequest</h2>
<!-- backwards compatibility -->
<a id="schemacreateassetinstancerequest"></a>
<a id="schema_CreateAssetInstanceRequest"></a>
<a id="tocScreateassetinstancerequest"></a>
<a id="tocscreateassetinstancerequest"></a>

```json
{
  "modelId": "17563eeb-82d7-4210-ac9b-1a20c7d67278",
  "serial": "string",
  "acquisitionCost": 0.1,
  "acquisitionDate": "2019-08-24T14:15:22Z",
  "salvageValue": 0.1,
  "location": "string",
  "warrantyExpiresAt": "2019-08-24T14:15:22Z",
  "notes": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|modelId|string(uuid)|false|none|none|
|serial|string¦null|false|none|none|
|acquisitionCost|number(double)|false|none|none|
|acquisitionDate|string(date-time)|false|none|none|
|salvageValue|number(double)¦null|false|none|none|
|location|string¦null|false|none|none|
|warrantyExpiresAt|string(date-time)¦null|false|none|none|
|notes|string¦null|false|none|none|

<h2 id="tocS_CreateAssetModelRequest">CreateAssetModelRequest</h2>
<!-- backwards compatibility -->
<a id="schemacreateassetmodelrequest"></a>
<a id="schema_CreateAssetModelRequest"></a>
<a id="tocScreateassetmodelrequest"></a>
<a id="tocscreateassetmodelrequest"></a>

```json
{
  "name": "string",
  "category": 0,
  "manufacturer": "string",
  "modelNumber": "string",
  "specs": "string",
  "defaultUsefulLifeMonths": 0,
  "defaultDepreciationMethod": 0,
  "imageUrl": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string¦null|false|none|none|
|category|[AssetCategory](#schemaassetcategory)|false|none|none|
|manufacturer|string¦null|false|none|none|
|modelNumber|string¦null|false|none|none|
|specs|string¦null|false|none|none|
|defaultUsefulLifeMonths|integer(int32)¦null|false|none|none|
|defaultDepreciationMethod|[DepreciationMethod](#schemadepreciationmethod)|false|none|none|
|imageUrl|string¦null|false|none|none|

<h2 id="tocS_CreateDepartmentRequest">CreateDepartmentRequest</h2>
<!-- backwards compatibility -->
<a id="schemacreatedepartmentrequest"></a>
<a id="schema_CreateDepartmentRequest"></a>
<a id="tocScreatedepartmentrequest"></a>
<a id="tocscreatedepartmentrequest"></a>

```json
{
  "code": "string",
  "name": "string",
  "managerId": "b2c2c359-55f3-4680-a660-901475c7a693"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|code|string¦null|false|none|none|
|name|string¦null|false|none|none|
|managerId|string(uuid)¦null|false|none|none|

<h2 id="tocS_CreateRequestDto">CreateRequestDto</h2>
<!-- backwards compatibility -->
<a id="schemacreaterequestdto"></a>
<a id="schema_CreateRequestDto"></a>
<a id="tocScreaterequestdto"></a>
<a id="tocscreaterequestdto"></a>

```json
{
  "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
  "reason": "string",
  "expectedDurationMonths": 0,
  "idempotencyKey": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|assetInstanceId|string(uuid)|false|none|none|
|reason|string¦null|false|none|none|
|expectedDurationMonths|integer(int32)¦null|false|none|none|
|idempotencyKey|string¦null|false|none|none|

<h2 id="tocS_CreateUserRequest">CreateUserRequest</h2>
<!-- backwards compatibility -->
<a id="schemacreateuserrequest"></a>
<a id="schema_CreateUserRequest"></a>
<a id="tocScreateuserrequest"></a>
<a id="tocscreateuserrequest"></a>

```json
{
  "userName": "string",
  "email": "string",
  "password": "string",
  "fullName": "string",
  "employeeCode": "string",
  "role": 0,
  "departmentId": "a3452d1e-b055-4677-aa66-858ddc0a1f59"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|userName|string¦null|false|none|none|
|email|string¦null|false|none|none|
|password|string¦null|false|none|none|
|fullName|string¦null|false|none|none|
|employeeCode|string¦null|false|none|none|
|role|[UserRole](#schemauserrole)|false|none|none|
|departmentId|string(uuid)¦null|false|none|none|

<h2 id="tocS_DashboardStatsDto">DashboardStatsDto</h2>
<!-- backwards compatibility -->
<a id="schemadashboardstatsdto"></a>
<a id="schema_DashboardStatsDto"></a>
<a id="tocSdashboardstatsdto"></a>
<a id="tocsdashboardstatsdto"></a>

```json
{
  "totalAssets": 0,
  "inStock": 0,
  "allocated": 0,
  "lockedTemp": 0,
  "maintenance": 0,
  "endOfLife": 0,
  "pendingRequests": 0,
  "totalAcquisitionCost": 0.1,
  "byStatus": [
    {
      "status": 0,
      "count": 0
    }
  ],
  "byCategory": [
    {
      "category": 0,
      "count": 0
    }
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|totalAssets|integer(int32)|false|none|none|
|inStock|integer(int32)|false|none|none|
|allocated|integer(int32)|false|none|none|
|lockedTemp|integer(int32)|false|none|none|
|maintenance|integer(int32)|false|none|none|
|endOfLife|integer(int32)|false|none|none|
|pendingRequests|integer(int32)|false|none|none|
|totalAcquisitionCost|number(double)|false|none|none|
|byStatus|[[StatusCount](#schemastatuscount)]¦null|false|none|none|
|byCategory|[[CategoryCount](#schemacategorycount)]¦null|false|none|none|

<h2 id="tocS_DepartmentDto">DepartmentDto</h2>
<!-- backwards compatibility -->
<a id="schemadepartmentdto"></a>
<a id="schema_DepartmentDto"></a>
<a id="tocSdepartmentdto"></a>
<a id="tocsdepartmentdto"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "code": "string",
  "name": "string",
  "managerId": "b2c2c359-55f3-4680-a660-901475c7a693",
  "managerName": "string",
  "isActive": true,
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|none|
|code|string¦null|false|none|none|
|name|string¦null|false|none|none|
|managerId|string(uuid)¦null|false|none|none|
|managerName|string¦null|false|none|none|
|isActive|boolean|false|none|none|
|createdAt|string(date-time)|false|none|none|
|updatedAt|string(date-time)|false|none|none|

<h2 id="tocS_DepartmentListItem">DepartmentListItem</h2>
<!-- backwards compatibility -->
<a id="schemadepartmentlistitem"></a>
<a id="schema_DepartmentListItem"></a>
<a id="tocSdepartmentlistitem"></a>
<a id="tocsdepartmentlistitem"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "code": "string",
  "name": "string",
  "managerId": "b2c2c359-55f3-4680-a660-901475c7a693",
  "managerName": "string",
  "isActive": true,
  "userCount": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|none|
|code|string¦null|false|none|none|
|name|string¦null|false|none|none|
|managerId|string(uuid)¦null|false|none|none|
|managerName|string¦null|false|none|none|
|isActive|boolean|false|none|none|
|userCount|integer(int32)|false|none|none|

<h2 id="tocS_DepartmentListItemPagedResult">DepartmentListItemPagedResult</h2>
<!-- backwards compatibility -->
<a id="schemadepartmentlistitempagedresult"></a>
<a id="schema_DepartmentListItemPagedResult"></a>
<a id="tocSdepartmentlistitempagedresult"></a>
<a id="tocsdepartmentlistitempagedresult"></a>

```json
{
  "items": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "code": "string",
      "name": "string",
      "managerId": "b2c2c359-55f3-4680-a660-901475c7a693",
      "managerName": "string",
      "isActive": true,
      "userCount": 0
    }
  ],
  "total": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|items|[[DepartmentListItem](#schemadepartmentlistitem)]¦null|false|none|none|
|total|integer(int32)|false|none|none|
|page|integer(int32)|false|none|none|
|pageSize|integer(int32)|false|none|none|
|totalPages|integer(int32)|false|read-only|none|

<h2 id="tocS_DepreciationMethod">DepreciationMethod</h2>
<!-- backwards compatibility -->
<a id="schemadepreciationmethod"></a>
<a id="schema_DepreciationMethod"></a>
<a id="tocSdepreciationmethod"></a>
<a id="tocsdepreciationmethod"></a>

```json
0

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|integer(int32)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|*anonymous*|0|
|*anonymous*|1|

<h2 id="tocS_DisposalDto">DisposalDto</h2>
<!-- backwards compatibility -->
<a id="schemadisposaldto"></a>
<a id="schema_DisposalDto"></a>
<a id="tocSdisposaldto"></a>
<a id="tocsdisposaldto"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
  "assetCode": "string",
  "disposalType": 0,
  "soldToUserId": "37458171-1eb9-43ad-bd19-bf032d003230",
  "soldToUserName": "string",
  "salePrice": 0.1,
  "reason": "string",
  "disposedAt": "2019-08-24T14:15:22Z",
  "createdAt": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|none|
|assetInstanceId|string(uuid)|false|none|none|
|assetCode|string¦null|false|none|none|
|disposalType|[DisposalType](#schemadisposaltype)|false|none|none|
|soldToUserId|string(uuid)¦null|false|none|none|
|soldToUserName|string¦null|false|none|none|
|salePrice|number(double)¦null|false|none|none|
|reason|string¦null|false|none|none|
|disposedAt|string(date-time)|false|none|none|
|createdAt|string(date-time)|false|none|none|

<h2 id="tocS_DisposalDtoPagedResult">DisposalDtoPagedResult</h2>
<!-- backwards compatibility -->
<a id="schemadisposaldtopagedresult"></a>
<a id="schema_DisposalDtoPagedResult"></a>
<a id="tocSdisposaldtopagedresult"></a>
<a id="tocsdisposaldtopagedresult"></a>

```json
{
  "items": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
      "assetCode": "string",
      "disposalType": 0,
      "soldToUserId": "37458171-1eb9-43ad-bd19-bf032d003230",
      "soldToUserName": "string",
      "salePrice": 0.1,
      "reason": "string",
      "disposedAt": "2019-08-24T14:15:22Z",
      "createdAt": "2019-08-24T14:15:22Z"
    }
  ],
  "total": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|items|[[DisposalDto](#schemadisposaldto)]¦null|false|none|none|
|total|integer(int32)|false|none|none|
|page|integer(int32)|false|none|none|
|pageSize|integer(int32)|false|none|none|
|totalPages|integer(int32)|false|read-only|none|

<h2 id="tocS_DisposalType">DisposalType</h2>
<!-- backwards compatibility -->
<a id="schemadisposaltype"></a>
<a id="schema_DisposalType"></a>
<a id="tocSdisposaltype"></a>
<a id="tocsdisposaltype"></a>

```json
0

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|integer(int32)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|*anonymous*|0|
|*anonymous*|1|
|*anonymous*|2|
|*anonymous*|3|

<h2 id="tocS_DisposeAssetDto">DisposeAssetDto</h2>
<!-- backwards compatibility -->
<a id="schemadisposeassetdto"></a>
<a id="schema_DisposeAssetDto"></a>
<a id="tocSdisposeassetdto"></a>
<a id="tocsdisposeassetdto"></a>

```json
{
  "type": 0,
  "soldToUserId": "37458171-1eb9-43ad-bd19-bf032d003230",
  "salePrice": 0.1,
  "reason": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|[DisposalType](#schemadisposaltype)|false|none|none|
|soldToUserId|string(uuid)¦null|false|none|none|
|salePrice|number(double)¦null|false|none|none|
|reason|string¦null|false|none|none|

<h2 id="tocS_HandoverResult">HandoverResult</h2>
<!-- backwards compatibility -->
<a id="schemahandoverresult"></a>
<a id="schema_HandoverResult"></a>
<a id="tocShandoverresult"></a>
<a id="tocshandoverresult"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "documentNumber": "string",
  "filePath": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|none|
|documentNumber|string¦null|false|none|none|
|filePath|string¦null|false|none|none|

<h2 id="tocS_IdleAssetItem">IdleAssetItem</h2>
<!-- backwards compatibility -->
<a id="schemaidleassetitem"></a>
<a id="schema_IdleAssetItem"></a>
<a id="tocSidleassetitem"></a>
<a id="tocsidleassetitem"></a>

```json
{
  "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
  "assetCode": "string",
  "modelName": "string",
  "category": 0,
  "status": 0,
  "location": "string",
  "acquisitionCost": 0.1,
  "acquisitionDate": "2019-08-24T14:15:22Z",
  "lastActivityAt": "2019-08-24T14:15:22Z",
  "idleMonths": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|assetInstanceId|string(uuid)|false|none|none|
|assetCode|string¦null|false|none|none|
|modelName|string¦null|false|none|none|
|category|[AssetCategory](#schemaassetcategory)|false|none|none|
|status|[AssetStatus](#schemaassetstatus)|false|none|none|
|location|string¦null|false|none|none|
|acquisitionCost|number(double)|false|none|none|
|acquisitionDate|string(date-time)|false|none|none|
|lastActivityAt|string(date-time)¦null|false|none|none|
|idleMonths|integer(int32)|false|none|none|

<h2 id="tocS_IdleAssetItemPagedResult">IdleAssetItemPagedResult</h2>
<!-- backwards compatibility -->
<a id="schemaidleassetitempagedresult"></a>
<a id="schema_IdleAssetItemPagedResult"></a>
<a id="tocSidleassetitempagedresult"></a>
<a id="tocsidleassetitempagedresult"></a>

```json
{
  "items": [
    {
      "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
      "assetCode": "string",
      "modelName": "string",
      "category": 0,
      "status": 0,
      "location": "string",
      "acquisitionCost": 0.1,
      "acquisitionDate": "2019-08-24T14:15:22Z",
      "lastActivityAt": "2019-08-24T14:15:22Z",
      "idleMonths": 0
    }
  ],
  "total": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|items|[[IdleAssetItem](#schemaidleassetitem)]¦null|false|none|none|
|total|integer(int32)|false|none|none|
|page|integer(int32)|false|none|none|
|pageSize|integer(int32)|false|none|none|
|totalPages|integer(int32)|false|read-only|none|

<h2 id="tocS_LoginRequest">LoginRequest</h2>
<!-- backwards compatibility -->
<a id="schemaloginrequest"></a>
<a id="schema_LoginRequest"></a>
<a id="tocSloginrequest"></a>
<a id="tocsloginrequest"></a>

```json
{
  "userName": "string",
  "password": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|userName|string¦null|false|none|none|
|password|string¦null|false|none|none|

<h2 id="tocS_MaintenanceRecordDto">MaintenanceRecordDto</h2>
<!-- backwards compatibility -->
<a id="schemamaintenancerecorddto"></a>
<a id="schema_MaintenanceRecordDto"></a>
<a id="tocSmaintenancerecorddto"></a>
<a id="tocsmaintenancerecorddto"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
  "assetCode": "string",
  "maintenanceType": 0,
  "description": "string",
  "cost": 0.1,
  "vendor": "string",
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "status": 0,
  "notes": "string",
  "createdAt": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|none|
|assetInstanceId|string(uuid)|false|none|none|
|assetCode|string¦null|false|none|none|
|maintenanceType|[MaintenanceType](#schemamaintenancetype)|false|none|none|
|description|string¦null|false|none|none|
|cost|number(double)|false|none|none|
|vendor|string¦null|false|none|none|
|startDate|string(date-time)|false|none|none|
|endDate|string(date-time)¦null|false|none|none|
|status|[MaintenanceStatus](#schemamaintenancestatus)|false|none|none|
|notes|string¦null|false|none|none|
|createdAt|string(date-time)|false|none|none|

<h2 id="tocS_MaintenanceRecordDtoPagedResult">MaintenanceRecordDtoPagedResult</h2>
<!-- backwards compatibility -->
<a id="schemamaintenancerecorddtopagedresult"></a>
<a id="schema_MaintenanceRecordDtoPagedResult"></a>
<a id="tocSmaintenancerecorddtopagedresult"></a>
<a id="tocsmaintenancerecorddtopagedresult"></a>

```json
{
  "items": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
      "assetCode": "string",
      "maintenanceType": 0,
      "description": "string",
      "cost": 0.1,
      "vendor": "string",
      "startDate": "2019-08-24T14:15:22Z",
      "endDate": "2019-08-24T14:15:22Z",
      "status": 0,
      "notes": "string",
      "createdAt": "2019-08-24T14:15:22Z"
    }
  ],
  "total": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|items|[[MaintenanceRecordDto](#schemamaintenancerecorddto)]¦null|false|none|none|
|total|integer(int32)|false|none|none|
|page|integer(int32)|false|none|none|
|pageSize|integer(int32)|false|none|none|
|totalPages|integer(int32)|false|read-only|none|

<h2 id="tocS_MaintenanceStatus">MaintenanceStatus</h2>
<!-- backwards compatibility -->
<a id="schemamaintenancestatus"></a>
<a id="schema_MaintenanceStatus"></a>
<a id="tocSmaintenancestatus"></a>
<a id="tocsmaintenancestatus"></a>

```json
0

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|integer(int32)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|*anonymous*|0|
|*anonymous*|1|
|*anonymous*|2|

<h2 id="tocS_MaintenanceType">MaintenanceType</h2>
<!-- backwards compatibility -->
<a id="schemamaintenancetype"></a>
<a id="schema_MaintenanceType"></a>
<a id="tocSmaintenancetype"></a>
<a id="tocsmaintenancetype"></a>

```json
0

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|integer(int32)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|*anonymous*|0|
|*anonymous*|1|
|*anonymous*|2|
|*anonymous*|3|
|*anonymous*|4|

<h2 id="tocS_MeResponse">MeResponse</h2>
<!-- backwards compatibility -->
<a id="schemameresponse"></a>
<a id="schema_MeResponse"></a>
<a id="tocSmeresponse"></a>
<a id="tocsmeresponse"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "userName": "string",
  "email": "string",
  "fullName": "string",
  "employeeCode": "string",
  "role": "string",
  "departmentId": "a3452d1e-b055-4677-aa66-858ddc0a1f59",
  "departmentName": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|none|
|userName|string¦null|false|none|none|
|email|string¦null|false|none|none|
|fullName|string¦null|false|none|none|
|employeeCode|string¦null|false|none|none|
|role|string¦null|false|none|none|
|departmentId|string(uuid)¦null|false|none|none|
|departmentName|string¦null|false|none|none|

<h2 id="tocS_MyAssetItem">MyAssetItem</h2>
<!-- backwards compatibility -->
<a id="schemamyassetitem"></a>
<a id="schema_MyAssetItem"></a>
<a id="tocSmyassetitem"></a>
<a id="tocsmyassetitem"></a>

```json
{
  "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
  "assetCode": "string",
  "modelName": "string",
  "status": 0,
  "location": "string",
  "startDate": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|assetInstanceId|string(uuid)|false|none|none|
|assetCode|string¦null|false|none|none|
|modelName|string¦null|false|none|none|
|status|[AssetStatus](#schemaassetstatus)|false|none|none|
|location|string¦null|false|none|none|
|startDate|string(date-time)|false|none|none|

<h2 id="tocS_RefreshRequest">RefreshRequest</h2>
<!-- backwards compatibility -->
<a id="schemarefreshrequest"></a>
<a id="schema_RefreshRequest"></a>
<a id="tocSrefreshrequest"></a>
<a id="tocsrefreshrequest"></a>

```json
{
  "refreshToken": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|refreshToken|string¦null|false|none|none|

<h2 id="tocS_RejectRequestDto">RejectRequestDto</h2>
<!-- backwards compatibility -->
<a id="schemarejectrequestdto"></a>
<a id="schema_RejectRequestDto"></a>
<a id="tocSrejectrequestdto"></a>
<a id="tocsrejectrequestdto"></a>

```json
{
  "reason": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|reason|string¦null|false|none|none|

<h2 id="tocS_RequestListItem">RequestListItem</h2>
<!-- backwards compatibility -->
<a id="schemarequestlistitem"></a>
<a id="schema_RequestListItem"></a>
<a id="tocSrequestlistitem"></a>
<a id="tocsrequestlistitem"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "requesterId": "ba828041-f5bf-46f6-bf7c-22eccb01f2a4",
  "requesterName": "string",
  "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
  "assetCode": "string",
  "modelName": "string",
  "status": 0,
  "expectedDurationMonths": 0,
  "lockExpiresAt": "2019-08-24T14:15:22Z",
  "createdAt": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|none|
|requesterId|string(uuid)|false|none|none|
|requesterName|string¦null|false|none|none|
|assetInstanceId|string(uuid)|false|none|none|
|assetCode|string¦null|false|none|none|
|modelName|string¦null|false|none|none|
|status|[RequestStatus](#schemarequeststatus)|false|none|none|
|expectedDurationMonths|integer(int32)¦null|false|none|none|
|lockExpiresAt|string(date-time)¦null|false|none|none|
|createdAt|string(date-time)|false|none|none|

<h2 id="tocS_RequestListItemPagedResult">RequestListItemPagedResult</h2>
<!-- backwards compatibility -->
<a id="schemarequestlistitempagedresult"></a>
<a id="schema_RequestListItemPagedResult"></a>
<a id="tocSrequestlistitempagedresult"></a>
<a id="tocsrequestlistitempagedresult"></a>

```json
{
  "items": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "requesterId": "ba828041-f5bf-46f6-bf7c-22eccb01f2a4",
      "requesterName": "string",
      "assetInstanceId": "605efab6-99a7-4ea3-8f61-391429fbad2b",
      "assetCode": "string",
      "modelName": "string",
      "status": 0,
      "expectedDurationMonths": 0,
      "lockExpiresAt": "2019-08-24T14:15:22Z",
      "createdAt": "2019-08-24T14:15:22Z"
    }
  ],
  "total": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|items|[[RequestListItem](#schemarequestlistitem)]¦null|false|none|none|
|total|integer(int32)|false|none|none|
|page|integer(int32)|false|none|none|
|pageSize|integer(int32)|false|none|none|
|totalPages|integer(int32)|false|read-only|none|

<h2 id="tocS_RequestStatus">RequestStatus</h2>
<!-- backwards compatibility -->
<a id="schemarequeststatus"></a>
<a id="schema_RequestStatus"></a>
<a id="tocSrequeststatus"></a>
<a id="tocsrequeststatus"></a>

```json
0

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|integer(int32)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|*anonymous*|0|
|*anonymous*|1|
|*anonymous*|2|
|*anonymous*|3|
|*anonymous*|4|
|*anonymous*|5|

<h2 id="tocS_ResetPasswordRequest">ResetPasswordRequest</h2>
<!-- backwards compatibility -->
<a id="schemaresetpasswordrequest"></a>
<a id="schema_ResetPasswordRequest"></a>
<a id="tocSresetpasswordrequest"></a>
<a id="tocsresetpasswordrequest"></a>

```json
{
  "newPassword": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|newPassword|string¦null|false|none|none|

<h2 id="tocS_ReturnAssetDto">ReturnAssetDto</h2>
<!-- backwards compatibility -->
<a id="schemareturnassetdto"></a>
<a id="schema_ReturnAssetDto"></a>
<a id="tocSreturnassetdto"></a>
<a id="tocsreturnassetdto"></a>

```json
{
  "notes": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|notes|string¦null|false|none|none|

<h2 id="tocS_StartMaintenanceDto">StartMaintenanceDto</h2>
<!-- backwards compatibility -->
<a id="schemastartmaintenancedto"></a>
<a id="schema_StartMaintenanceDto"></a>
<a id="tocSstartmaintenancedto"></a>
<a id="tocsstartmaintenancedto"></a>

```json
{
  "type": 0,
  "description": "string",
  "vendor": "string",
  "cost": 0.1
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|[MaintenanceType](#schemamaintenancetype)|false|none|none|
|description|string¦null|false|none|none|
|vendor|string¦null|false|none|none|
|cost|number(double)¦null|false|none|none|

<h2 id="tocS_StatusCount">StatusCount</h2>
<!-- backwards compatibility -->
<a id="schemastatuscount"></a>
<a id="schema_StatusCount"></a>
<a id="tocSstatuscount"></a>
<a id="tocsstatuscount"></a>

```json
{
  "status": 0,
  "count": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|status|[AssetStatus](#schemaassetstatus)|false|none|none|
|count|integer(int32)|false|none|none|

<h2 id="tocS_TokenResponse">TokenResponse</h2>
<!-- backwards compatibility -->
<a id="schematokenresponse"></a>
<a id="schema_TokenResponse"></a>
<a id="tocStokenresponse"></a>
<a id="tocstokenresponse"></a>

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "accessTokenExpiresAt": "2019-08-24T14:15:22Z",
  "tokenType": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|accessToken|string¦null|false|none|none|
|refreshToken|string¦null|false|none|none|
|accessTokenExpiresAt|string(date-time)|false|none|none|
|tokenType|string¦null|false|none|none|

<h2 id="tocS_TransferAssetDto">TransferAssetDto</h2>
<!-- backwards compatibility -->
<a id="schematransferassetdto"></a>
<a id="schema_TransferAssetDto"></a>
<a id="tocStransferassetdto"></a>
<a id="tocstransferassetdto"></a>

```json
{
  "toUserId": "6b24f439-a350-415b-8542-30ae3827c522",
  "notes": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|toUserId|string(uuid)|false|none|none|
|notes|string¦null|false|none|none|

<h2 id="tocS_UpdateAssetInstanceRequest">UpdateAssetInstanceRequest</h2>
<!-- backwards compatibility -->
<a id="schemaupdateassetinstancerequest"></a>
<a id="schema_UpdateAssetInstanceRequest"></a>
<a id="tocSupdateassetinstancerequest"></a>
<a id="tocsupdateassetinstancerequest"></a>

```json
{
  "serial": "string",
  "acquisitionCost": 0.1,
  "acquisitionDate": "2019-08-24T14:15:22Z",
  "salvageValue": 0.1,
  "location": "string",
  "warrantyExpiresAt": "2019-08-24T14:15:22Z",
  "notes": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|serial|string¦null|false|none|none|
|acquisitionCost|number(double)|false|none|none|
|acquisitionDate|string(date-time)|false|none|none|
|salvageValue|number(double)|false|none|none|
|location|string¦null|false|none|none|
|warrantyExpiresAt|string(date-time)¦null|false|none|none|
|notes|string¦null|false|none|none|

<h2 id="tocS_UpdateAssetModelRequest">UpdateAssetModelRequest</h2>
<!-- backwards compatibility -->
<a id="schemaupdateassetmodelrequest"></a>
<a id="schema_UpdateAssetModelRequest"></a>
<a id="tocSupdateassetmodelrequest"></a>
<a id="tocsupdateassetmodelrequest"></a>

```json
{
  "name": "string",
  "category": 0,
  "manufacturer": "string",
  "modelNumber": "string",
  "specs": "string",
  "defaultUsefulLifeMonths": 0,
  "defaultDepreciationMethod": 0,
  "imageUrl": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string¦null|false|none|none|
|category|[AssetCategory](#schemaassetcategory)|false|none|none|
|manufacturer|string¦null|false|none|none|
|modelNumber|string¦null|false|none|none|
|specs|string¦null|false|none|none|
|defaultUsefulLifeMonths|integer(int32)|false|none|none|
|defaultDepreciationMethod|[DepreciationMethod](#schemadepreciationmethod)|false|none|none|
|imageUrl|string¦null|false|none|none|

<h2 id="tocS_UpdateDepartmentRequest">UpdateDepartmentRequest</h2>
<!-- backwards compatibility -->
<a id="schemaupdatedepartmentrequest"></a>
<a id="schema_UpdateDepartmentRequest"></a>
<a id="tocSupdatedepartmentrequest"></a>
<a id="tocsupdatedepartmentrequest"></a>

```json
{
  "name": "string",
  "managerId": "b2c2c359-55f3-4680-a660-901475c7a693",
  "isActive": true
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string¦null|false|none|none|
|managerId|string(uuid)¦null|false|none|none|
|isActive|boolean|false|none|none|

<h2 id="tocS_UpdateUserRequest">UpdateUserRequest</h2>
<!-- backwards compatibility -->
<a id="schemaupdateuserrequest"></a>
<a id="schema_UpdateUserRequest"></a>
<a id="tocSupdateuserrequest"></a>
<a id="tocsupdateuserrequest"></a>

```json
{
  "email": "string",
  "fullName": "string",
  "role": 0,
  "departmentId": "a3452d1e-b055-4677-aa66-858ddc0a1f59",
  "isActive": true
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string¦null|false|none|none|
|fullName|string¦null|false|none|none|
|role|[UserRole](#schemauserrole)|false|none|none|
|departmentId|string(uuid)¦null|false|none|none|
|isActive|boolean|false|none|none|

<h2 id="tocS_UserDto">UserDto</h2>
<!-- backwards compatibility -->
<a id="schemauserdto"></a>
<a id="schema_UserDto"></a>
<a id="tocSuserdto"></a>
<a id="tocsuserdto"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "userName": "string",
  "email": "string",
  "fullName": "string",
  "employeeCode": "string",
  "role": 0,
  "departmentId": "a3452d1e-b055-4677-aa66-858ddc0a1f59",
  "departmentName": "string",
  "isActive": true,
  "lastLoginAt": "2019-08-24T14:15:22Z",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|none|
|userName|string¦null|false|none|none|
|email|string¦null|false|none|none|
|fullName|string¦null|false|none|none|
|employeeCode|string¦null|false|none|none|
|role|[UserRole](#schemauserrole)|false|none|none|
|departmentId|string(uuid)¦null|false|none|none|
|departmentName|string¦null|false|none|none|
|isActive|boolean|false|none|none|
|lastLoginAt|string(date-time)¦null|false|none|none|
|createdAt|string(date-time)|false|none|none|
|updatedAt|string(date-time)|false|none|none|

<h2 id="tocS_UserListItem">UserListItem</h2>
<!-- backwards compatibility -->
<a id="schemauserlistitem"></a>
<a id="schema_UserListItem"></a>
<a id="tocSuserlistitem"></a>
<a id="tocsuserlistitem"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "userName": "string",
  "email": "string",
  "fullName": "string",
  "employeeCode": "string",
  "role": 0,
  "departmentId": "a3452d1e-b055-4677-aa66-858ddc0a1f59",
  "departmentName": "string",
  "isActive": true
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|none|
|userName|string¦null|false|none|none|
|email|string¦null|false|none|none|
|fullName|string¦null|false|none|none|
|employeeCode|string¦null|false|none|none|
|role|[UserRole](#schemauserrole)|false|none|none|
|departmentId|string(uuid)¦null|false|none|none|
|departmentName|string¦null|false|none|none|
|isActive|boolean|false|none|none|

<h2 id="tocS_UserListItemPagedResult">UserListItemPagedResult</h2>
<!-- backwards compatibility -->
<a id="schemauserlistitempagedresult"></a>
<a id="schema_UserListItemPagedResult"></a>
<a id="tocSuserlistitempagedresult"></a>
<a id="tocsuserlistitempagedresult"></a>

```json
{
  "items": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "userName": "string",
      "email": "string",
      "fullName": "string",
      "employeeCode": "string",
      "role": 0,
      "departmentId": "a3452d1e-b055-4677-aa66-858ddc0a1f59",
      "departmentName": "string",
      "isActive": true
    }
  ],
  "total": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|items|[[UserListItem](#schemauserlistitem)]¦null|false|none|none|
|total|integer(int32)|false|none|none|
|page|integer(int32)|false|none|none|
|pageSize|integer(int32)|false|none|none|
|totalPages|integer(int32)|false|read-only|none|

<h2 id="tocS_UserRole">UserRole</h2>
<!-- backwards compatibility -->
<a id="schemauserrole"></a>
<a id="schema_UserRole"></a>
<a id="tocSuserrole"></a>
<a id="tocsuserrole"></a>

```json
0

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|integer(int32)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|*anonymous*|0|
|*anonymous*|1|
|*anonymous*|2|

