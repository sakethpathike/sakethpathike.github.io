# sakethpathike.github.io

**Full-Page HTML Replacement** _client_ for [kamp](https://github.com/sakethpathike/kamp).

### Request Flow
```mermaid
sequenceDiagram
    Client->>kamp: GET /
    activate kamp
    kamp->>kapsule: Build HTML string
    kapsule-->>kamp: Raw HTML string
    kamp->>Client: Raw HTML string (Full HTML document)
    deactivate kamp
    Note over Client: Performs Full-Page Replacement
```

### Why
- 300ms fade.
- [kamp](https://github.com/sakethpathike/kamp) serves the full page; this plugs it in.