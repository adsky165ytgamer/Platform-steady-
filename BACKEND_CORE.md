# Platform Steady v3.0 — Dual-Engine Backend Core Architecture

## System Overview

Platform Steady v3.0 operates as an industrial-grade **Universal Engineering Interface** running a dual-engine architecture:

1. **Mode A: In-Browser Local Stack (`local-stack`)**
   - Runs 100% inside the browser sandbox using modern client-side storage technologies (IndexedDB & OPFS).
   - Zero-server cost and zero cloud egress fees: binary packages, documents, and system state are streamed and persisted directly in browser storage.
   - Microsecond latency local document operations with schema-less nested querying.
   - Built-in `EventBroker` with wildcard pub/sub.

2. **Mode B: External Remote Gateway (`remote-gateway`)**
   - Connects to external HTTP/REST/WebSocket infrastructure (VPS, Node.js, Ktor, Firebase, Supabase).
   - Unified dispatcher with automatic fallback and telemetry logging.

---

## Architectural Components

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PLATFORM STEADY WEB INTERFACE                        │
│                (Universal Client & Browser OS Shell)                    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
┌─────────────────────────────────┐     ┌─────────────────────────────────┐
│     MODE 1: REMOTE GATEWAY      │     │      MODE 2: IN-BROWSER         │
│        EXTERNAL BACKEND         │     │          LOCAL STACK            │
├─────────────────────────────────┤     ├─────────────────────────────────┤
│ • Connects to HTTP/WS APIs      │     │ • Runs entirely inside browser  │
│ • Custom VPS, Node.js, Ktor     │     │ • WebAssembly (Wasm) runtime    │
│ • Firebase, Supabase, Postgres  │     │ • IndexedDB & OPFS persistent   │
└────────────────┬────────────────┘     └────────────────┬────────────────┘
                 │                                       │
                 └───────────────────┬───────────────────┘
                                     ▼
                    ┌─────────────────────────────────┐
                    │       PLATFORM CORE ENGINE      │
                    │   • Storage Engine (IDB+Docs)   │
                    │   • Telemetry Bus (Latency/Size)│
                    │   • Dynamic Module Loader (SDK) │
                    │   • Zero-Server Asset Manager   │
                    └─────────────────────────────────┘
```

---

## Micro-Tool Modules

### 1. Zero-Server Asset Manager (`AssetManagerTool`)
- Implements `BaseMicroTool` SDK.
- Streams remote binary assets (kernel packages, firmware maps, JSON bundles, SQLite DBs) using `ReadableStream` chunked reader.
- Converts stream chunks into binary `Blob` instances stored directly in IndexedDB store `binary_assets`.
- Calculates cryptographic SHA-256 hash using Web Crypto `SubtleCrypto.digest`.
- Generates 128-byte hex & ASCII inspection dumps.
- Client-side one-click download/export via ephemeral `URL.createObjectURL(blob)`.

### 2. Dynamic Plugin & Module Loader (`DynamicModuleLoader`)
- Dynamically loads external micro-tools via URL at runtime.
- Executes scripts within an isolated evaluation sandbox conforming to `BaseMicroTool`.
- Lifecycle hooks: `init(engine)`, `render()`, `dispose()`.
- Hot-registers and unmounts tools in sidebar navigation without page refresh.

### 3. Live Network & Payload Inspector (`TelemetryBus` & `NetworkInspectorTool`)
- Monitors both local IndexedDB transactions (`IDB_WRITE`, `IDB_READ`, `IDB_PUT_BLOB`) and outbound Remote Gateway dispatches (`GET`, `POST`).
- Captures millisecond execution latency, status codes, payload byte sizes, headers, and traces in real time.
- Terminal-style inspector with source filters, pause/resume streaming, and raw packet inspection.

---

## File Structure

- `src/core/types.ts`: Core data types, `BaseMicroTool` interface, telemetry packets.
- `src/core/event-broker.ts`: Asynchronous typed event broker with wildcard subscriptions.
- `src/core/storage.ts`: Dual-store IndexedDB document and binary asset persistence.
- `src/core/telemetry.ts`: Reactive telemetry bus tracking execution latency and payload sizes.
- `src/core/module-loader.ts`: Dynamic script loader and BaseMicroTool sandbox validator.
- `src/core/tools/asset-manager.ts`: Zero-server chunked stream downloader and Blob manager.
- `src/core/platform-core.ts`: Central engine coordinator and unified dispatcher.
- `src/core/index.ts`: Public API exports.
