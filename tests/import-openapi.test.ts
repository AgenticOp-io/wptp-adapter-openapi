import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { importOpenApiJson } from "../src/index.js";

describe("OpenAPI import", () => {
  it("imports petstore-mini paths to IR v0 routes", () => {
    const openapi = JSON.parse(
      readFileSync(join(import.meta.dirname, "..", "fixtures", "petstore-mini.openapi.json"), "utf8"),
    );
    const expected = JSON.parse(
      readFileSync(join(import.meta.dirname, "..", "fixtures", "ir-v0", "petstore-mini.json"), "utf8"),
    );
    const doc = importOpenApiJson(openapi, "petstore-mini");
    expect(doc).toEqual(expected);
  });
});
