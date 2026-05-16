import { IR_V0_SCHEMA_VERSION } from "@wptp/ir";
function methodOps(pathItem) {
    const methods = ["get", "post", "put", "patch", "delete", "head", "options", "trace"];
    const out = [];
    for (const m of methods) {
        const op = pathItem[m];
        if (op && typeof op === "object")
            out.push({ method: m.toUpperCase(), op: op });
    }
    return out;
}
/** Lift OpenAPI 3 paths into IR v0 request nodes (bronze / structural). */
export function importOpenApiV0(doc, sourceApp = "openapi") {
    const paths = doc.paths ?? {};
    const nodes = [];
    const roots = [];
    let n = 0;
    for (const [path, pathItem] of Object.entries(paths)) {
        if (!pathItem || typeof pathItem !== "object")
            continue;
        for (const { method, op } of methodOps(pathItem)) {
            const id = `route-${n++}`;
            roots.push(id);
            nodes.push({
                id,
                layer: "request",
                op: "route",
                valueType: { kind: "void" },
                effects: [],
                operandIds: [],
                attrs: {
                    path,
                    method,
                    operationId: typeof op.operationId === "string" ? op.operationId : undefined,
                    summary: typeof op.summary === "string" ? op.summary : undefined,
                },
                provenance: [
                    {
                        source: "openapi-contract",
                        reason: `${method} ${path}`,
                        locator: { kind: "openapi", path, method },
                    },
                ],
                openapi: { path, method },
            });
        }
    }
    return {
        schemaVersion: IR_V0_SCHEMA_VERSION,
        meta: {
            sourceApp,
            importedFrom: "openapi@3",
            openapiVersion: doc.openapi ?? doc.swagger,
        },
        roots,
        nodes,
        losses: [],
    };
}
export function importOpenApiJson(json, sourceApp) {
    if (!json || typeof json !== "object")
        throw new Error("OpenAPI: expected object");
    return importOpenApiV0(json, sourceApp);
}
