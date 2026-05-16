/** Minimal IR v0 document shape (aligned with theorem6/wptp-ir). */
export const IR_V0_SCHEMA_VERSION = "0.1.0" as const;

export interface IrDocumentV0 {
  readonly schemaVersion: typeof IR_V0_SCHEMA_VERSION;
  readonly meta: {
    readonly sourceApp: string;
    readonly importedFrom: string;
    readonly openapiVersion?: string;
  };
  readonly roots: ReadonlyArray<string>;
  readonly nodes: ReadonlyArray<{
    readonly id: string;
    readonly layer: "request" | "effect" | "value";
    readonly op: string;
    readonly valueType: unknown;
    readonly effects: ReadonlyArray<unknown>;
    readonly operandIds: ReadonlyArray<string>;
    readonly attrs: Readonly<Record<string, unknown>>;
    readonly provenance: ReadonlyArray<{ readonly source: string; readonly reason: string; readonly locator: unknown }>;
    readonly openapi?: { readonly path: string; readonly method: string };
  }>;
  readonly losses: ReadonlyArray<{
    readonly webirNodeId: string;
    readonly dialect: string;
    readonly op: string;
    readonly category: string;
    readonly reason: string;
  }>;
}
