# wptp-adapter-openapi

## Purpose

**D3 source adapter (first profile):** lift **OpenAPI 3** path items into [WPTP IR v0](https://github.com/theorem6/wptp-ir) request nodes. **Bronze** grade in the [compatibility matrix](https://github.com/theorem6/wptp-matrix) — structural routes only, no replay yet.

## Public API

- `importOpenApiJson(openapiDocument)` → `IrDocumentV0`

## Invariants

- One IR **route** node per HTTP operation on each path.
- **Provenance** records OpenAPI path + method.
- Unsupported OpenAPI features are omitted (not silently upgraded to Gold).

## Non-goals

- Full JSON Schema request/response typing in v0.
- Emit to Hono/Fastify (see Chrysalis or future `wptp-emit-*`).

## Quick start

```bash
npm install
npm test
```

## Related

- [WPTP global scope](https://github.com/theorem6/chrysalis/blob/main/docs/WPTP-GLOBAL-SCOPE.md)
- [wptp-matrix edge `openapi-to-wptp-ir`](https://github.com/theorem6/wptp-matrix/blob/main/data/matrix.v0.json)
