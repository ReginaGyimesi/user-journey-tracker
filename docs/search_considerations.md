# Search Considerations

The task specifies _“search functionality for individual users”_. This can be interpreted in multiple ways depending on the system’s requirements and user expectations. Below are the main approaches, with their pros, cons, and example implementations.

---

## Indexed lookup

For all search considerations below, I assume the use of **indexed lookups**.  
Without indexes, MongoDB performs a **collection scan**, checking every document in the collection (`O(n)` complexity). This is fine for small datasets but becomes slow when dealing with millions of records and events, as is common in user tracking systems.

With an index (e.g., on `userId`, `email`, or `sessionId`), MongoDB can use a **B-tree traversal** to locate documents much faster. This reduces query time from scanning millions of documents to following a short, predictable path through the index.

When creating a MongoDB index, it creates a separate data structure that points to the related document.

## 1. Search by userID

- **Description:** Lookup a user directly using a known unique key (`userId`).
- **Example query:**

```js
db.users.find({ userId: "12345" });
```

- **Proposed index:**

```js
db.users.createIndex();
```

- **Pros:**

  - Straightforward implementation
  - Ideal for backend integration

- **Cons:**
  - Not user friendly as it required the knowledge of the exact ID

## 2. Search by email or name with a partial search (Current implementation choice)

- **Description:** Search by partial name or email.
- **Example query:** (with regex)

```js
db.users.find({ email: { $regex: "alice", $options: "i" } });
```

- **Proposed indexes:**

```js
db.users.createIndex({ email: 1 });
db.users.createIndex({ fullName: "text" });
```

- **Pros:**

  - User friendly as it support partial search

- **Cons:**

  - Slight storage overhead for maintaining additional indexes

## 3. Search by session or event attributes

- **Description:** Filter by session or event data (e.g. date ranges).
- **Example query:**

```js
db.sessions.find({
  userId: "12345",
  sessionStart: { $gte: ISODate("2025-09-01") },
  purchaseCount: { $gt: 0 },
});
```

- **Proposed indexes:**

```js
db.sessions.createIndex({ userId: 1, sessionStart: -1 });
db.events.createIndex({ userId: 1, eventType: 1, timestamp: -1 });
```

- **Pros:**

  - User firendly as it support filtering, also great for analytics
  - Efficient filtering with compound indexes

- **Cons:**
  - Queries can become complex

## 4. Future consideration: OpenSearch

- **Description:** AWS OpenSearch alongside MongoDB.
- **Pros:**
  - Efficient, scalable, supports partial, and ranked search
- **Cons:**
  - More operational overhead

# Storage considerations for search

## 1. Database choice

- **Primary data store:** MongoDB
  - Stores all users, sessions, and events data
  - Acts as the source of truth
- **Search engine (at scale):** OpenSearch
  - Stores indexed copies of the data optimised for search
  - Allows full text, fuzzy and ranked searches

## 2. Data volume and retention

- User tracking platforms generate large volumes of event data quickly.
- **Retention policies:**
  - Keep raw events in MongoDB for long-term storage
  - Keep only recent or aggregated data in OpenSearch to reduce storage costs
- **TTL (Time To Live) indexes:** can automatically delete old session/event data

## 3. Further Considerations

- **Sync between platforms:**
  - Any changes or new data stored in MongoDB must also be indexed in OpenSearch to keep the search engine up to date
- **Latency:**
  - Since events are generated in real time, updates to OpenSearch should occur with minimal delay to ensure search results reflect the latest data
