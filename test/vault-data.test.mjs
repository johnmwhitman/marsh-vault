import test from "node:test";
import assert from "node:assert/strict";
import { SHOWCASE, VAULT } from "../src/elena-vault-data.ts";

test("curated showcase questions reference existing vault entries and have non-empty sourced answers", () => {
  assert.equal(SHOWCASE.length, 10, "Vault must contain exactly 10 showcase questions");

  const vaultEntryIds = new Set(VAULT.map((entry) => entry.id));

  for (const [index, showcase] of SHOWCASE.entries()) {
    assert.ok(
      typeof showcase.q === "string" && showcase.q.trim().length > 0,
      `Showcase question at index ${index} must have a non-empty question string`
    );

    assert.ok(
      typeof showcase.answer === "string" && showcase.answer.trim().length > 0,
      `Showcase question "${showcase.q}" must have a non-empty answer`
    );

    assert.ok(
      Array.isArray(showcase.sources) && showcase.sources.length > 0,
      `Showcase question "${showcase.q}" must have at least one source entry`
    );

    for (const sourceId of showcase.sources) {
      assert.ok(
        typeof sourceId === "string" && sourceId.trim().length > 0,
        `Source ID "${sourceId}" for question "${showcase.q}" must be a non-empty string`
      );
      assert.ok(
        vaultEntryIds.has(sourceId),
        `Showcase question "${showcase.q}" references non-existent vault entry ID "${sourceId}"`
      );
    }
  }
});
