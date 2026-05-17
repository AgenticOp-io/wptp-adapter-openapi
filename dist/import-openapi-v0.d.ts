import { type IrDocumentV0 } from "@wptp/ir";
export interface OpenApiDocument {
    readonly openapi?: string;
    readonly swagger?: string;
    readonly info?: {
        readonly title?: string;
    };
    readonly paths?: Record<string, Record<string, unknown>>;
}
/** First 2xx status from OpenAPI `responses`, else method default (POST → 201, else 200). */
export declare function primarySuccessStatus(responses: unknown, method: string): number;
/** Lift OpenAPI 3 paths into IR v0 request nodes (bronze / structural). */
export declare function importOpenApiV0(doc: OpenApiDocument, sourceApp?: string): IrDocumentV0;
export declare function importOpenApiJson(json: unknown, sourceApp?: string): IrDocumentV0;
