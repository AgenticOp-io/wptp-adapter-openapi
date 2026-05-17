import { IR_V0_SCHEMA_VERSION, type IrDocumentV0 } from "@wptp/ir";

export interface OpenApiDocument {
  readonly openapi?: string;
  readonly swagger?: string;
  readonly info?: { readonly title?: string };
  readonly paths?: Record<string, Record<string, unknown>>;
}

/** First 2xx status from OpenAPI `responses`, else method default (POST → 201, else 200). */
export function primarySuccessStatus(
  responses: unknown,
  method: string,
): number {
  if (responses && typeof responses === "object") {
    const codes = Object.keys(responses)
      .map((k) => Number(k))
      .filter((c) => Number.isFinite(c) && c >= 200 && c < 300)
      .sort((a, b) => a - b);
    if (codes.length > 0) return codes[0]!;
  }
  return method.toUpperCase() === "POST" ? 201 : 200;
}

function methodOps(pathItem: Record<string, unknown>): Array<{ method: string; op: Record<string, unknown> }> {
  const methods = ["get", "post", "put", "patch", "delete", "head", "options", "trace"];
  const out: Array<{ method: string; op: Record<string, unknown> }> = [];
  for (const m of methods) {
    const op = pathItem[m];
    if (op && typeof op === "object") out.push({ method: m.toUpperCase(), op: op as Record<string, unknown> });
  }
  return out;
}

/** Lift OpenAPI 3 paths into IR v0 request nodes (bronze / structural). */
export function importOpenApiV0(doc: OpenApiDocument, sourceApp = "openapi"): IrDocumentV0 {
  const paths = doc.paths ?? {};
  const nodes: IrDocumentV0["nodes"][number][] = [];
  const roots: string[] = [];
  let n = 0;

  for (const [path, pathItem] of Object.entries(paths)) {
    if (!pathItem || typeof pathItem !== "object") continue;
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
          responseStatus: primarySuccessStatus(op.responses, method),
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

export function importOpenApiJson(json: unknown, sourceApp?: string): IrDocumentV0 {
  if (!json || typeof json !== "object") throw new Error("OpenAPI: expected object");
  return importOpenApiV0(json as OpenApiDocument, sourceApp);
}
