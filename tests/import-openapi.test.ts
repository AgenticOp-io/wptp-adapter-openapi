import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { importOpenApiJson, primarySuccessStatus } from "../src/index.js";

describe("OpenAPI import", () => {
  it("primarySuccessStatus prefers explicit 2xx responses", () => {
    expect(primarySuccessStatus({ "201": { description: "created" } }, "POST")).toBe(201);
    expect(primarySuccessStatus({ "204": { description: "gone" } }, "DELETE")).toBe(204);
    expect(primarySuccessStatus(undefined, "POST")).toBe(201);
    expect(primarySuccessStatus(undefined, "GET")).toBe(200);
  });

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
