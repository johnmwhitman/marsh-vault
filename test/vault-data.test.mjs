import test from "node:test";
import assert from "node:assert/strict";
import { VAULT } from "../src/elena-vault-data.ts";

test("Elena Marsh vault data invariants", async (t) => {
  await t.test("assert exactly 48 memory entries", () => {
    assert.equal(VAULT.length, 48, `Expected exactly 48 memory entries, found ${VAULT.length}`);
  });

  await t.test("assert unique IDs across all entries", () => {
    const ids = new Set();
    for (const entry of VAULT) {
      assert.ok(entry.id, "Entry must have an ID");
      assert.ok(!ids.has(entry.id), `Duplicate ID found: ${entry.id}`);
      ids.add(entry.id);
    }
    assert.equal(ids.size, 48, `Expected 48 unique IDs, found ${ids.size}`);
  });

  await t.test("assert every entry date is a valid ISO date with year within 2011-2026", () => {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

    for (const entry of VAULT) {
      assert.match(
        entry.date,
        isoDateRegex,
        `Entry ${entry.id} date "${entry.date}" must be formatted as YYYY-MM-DD`
      );

      const parsedDate = new Date(entry.date);
      assert.ok(
        !Number.isNaN(parsedDate.getTime()),
        `Entry ${entry.id} date "${entry.date}" must be a valid date`
      );

      // Verify that parsed UTC date matches the ISO components
      const [yearStr, monthStr, dayStr] = entry.date.split("-");
      const year = Number(yearStr);
      const month = Number(monthStr);
      const day = Number(dayStr);

      assert.ok(
        year >= 2011 && year <= 2026,
        `Entry ${entry.id} year ${year} must be within 2011-2026`
      );

      assert.equal(
        parsedDate.getUTCFullYear(),
        year,
        `Entry ${entry.id} date year mismatch`
      );
      assert.equal(
        parsedDate.getUTCMonth() + 1,
        month,
        `Entry ${entry.id} date month mismatch`
      );
      assert.equal(
        parsedDate.getUTCDate(),
        day,
        `Entry ${entry.id} date day mismatch`
      );
    }
  });

  await t.test("assert required fields are non-empty on every entry", () => {
    const validKinds = new Set(["decision", "meeting", "note", "contact", "introduction"]);

    for (const entry of VAULT) {
      // id
      assert.equal(typeof entry.id, "string", `Entry must have string id`);
      assert.ok(entry.id.trim().length > 0, `Entry id must not be empty`);

      // date
      assert.equal(typeof entry.date, "string", `Entry ${entry.id} date must be a string`);
      assert.ok(entry.date.trim().length > 0, `Entry ${entry.id} date must not be empty`);

      // kind
      assert.equal(typeof entry.kind, "string", `Entry ${entry.id} kind must be a string`);
      assert.ok(entry.kind.trim().length > 0, `Entry ${entry.id} kind must not be empty`);
      assert.ok(validKinds.has(entry.kind), `Entry ${entry.id} kind "${entry.kind}" is invalid`);

      // text
      assert.equal(typeof entry.text, "string", `Entry ${entry.id} text must be a string`);
      assert.ok(entry.text.trim().length > 0, `Entry ${entry.id} text must not be empty`);

      // tags
      assert.ok(Array.isArray(entry.tags), `Entry ${entry.id} tags must be an array`);
      assert.ok(entry.tags.length > 0, `Entry ${entry.id} tags array must not be empty`);
      for (const tag of entry.tags) {
        assert.equal(typeof tag, "string", `Entry ${entry.id} tag must be a string`);
        assert.ok(tag.trim().length > 0, `Entry ${entry.id} tag must not be empty`);
      }
    }
  });
});
