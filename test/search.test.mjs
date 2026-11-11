import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

function importTsModule(relativePath) {
  const filePath = path.resolve(relativePath);
  const code = fs.readFileSync(filePath, "utf-8");
  let transpiled = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filePath,
  }).outputText;

  const dir = path.dirname(filePath);
  const importRegex = /from\s+["'](\.[^"']+)["']/g;
  transpiled = transpiled.replace(importRegex, (_match, rel) => {
    let resolved = path.resolve(dir, rel);
    if (!fs.existsSync(resolved)) {
      if (fs.existsSync(resolved + ".ts")) resolved += ".ts";
      else if (fs.existsSync(resolved + ".tsx")) resolved += ".tsx";
      else if (fs.existsSync(resolved + ".js")) resolved += ".js";
    }
    const relCode = fs.readFileSync(resolved, "utf-8");
    const relTranspiled = ts.transpileModule(relCode, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
      fileName: resolved,
    }).outputText;
    const uri =
      "data:text/javascript;base64," +
      Buffer.from(relTranspiled).toString("base64");
    return `from "${uri}"`;
  });

  return import(
    "data:text/javascript;base64," + Buffer.from(transpiled).toString("base64")
  );
}

const {
  tokenize,
  stem,
  stems,
  overlap,
  searchEntries,
  matchShowcase,
} = await importTsModule("src/search.ts");

test("tokenize: punctuation and case normalisation", () => {
  // Test lowercasing and stripping punctuation while retaining alphanumeric words
  const tokens = tokenize("Hello, WORLD! Portland-Office & Partners... #2026?!");
  assert.deepEqual(tokens, ["hello", "world", "portland", "office", "partners", "2026"]);

  // Test stopwords and single characters are filtered out
  const filtered = tokenize("What did she ever tell you about the Portland office?");
  // stopwords removed: what, did, she, ever, tell, you, about, the
  assert.deepEqual(filtered, ["portland", "office"]);
});

test("stem & overlap: a known stem pair scores higher than an unrelated pair", () => {
  // Loose stemming strips common suffixes like 's, ing, ed, es, s and maps tion/sion to t
  // For example: "decided" -> "decid", "consulting" -> "consult", "consulted" -> "consult"
  assert.equal(stem("decided"), "decid");
  assert.equal(stem("consulting"), "consult");
  assert.equal(stem("consulted"), "consult");

  // A known stem pair like "consulting" and "consulted" stems to the same root ("consult")
  const targetStems = stems(["consult"]);
  const relatedTokens = ["consulting"];
  const unrelatedTokens = ["wandering"];

  const relatedScore = overlap(relatedTokens, targetStems);
  const unrelatedScore = overlap(unrelatedTokens, targetStems);

  assert.equal(relatedScore, 1.0);
  assert.equal(unrelatedScore, 0.0);
  assert.ok(
    relatedScore > unrelatedScore,
    `Related stem pair score (${relatedScore}) must be higher than unrelated (${unrelatedScore})`
  );

  // Another known stem pair matching against "decided"
  const decidedTarget = stems(["decided"]); // stems to "decid"
  const decidingTokens = ["deciding"]; // stems to "decid"
  assert.equal(overlap(decidingTokens, decidedTarget), 1.0);
  assert.equal(overlap(["unrelated"], decidedTarget), 0.0);
});

test("searchEntries: empty query returning no matches", () => {
  assert.deepEqual(searchEntries(""), []);
  assert.deepEqual(searchEntries("   "), []);
  // Stopword-only queries result in empty token list and return no matches
  assert.deepEqual(searchEntries("what did she do"), []);
  assert.deepEqual(searchEntries("??? !!!"), []);
});

test("matchShowcase: empty query returning no matches", () => {
  assert.equal(matchShowcase(""), null);
  assert.equal(matchShowcase("   "), null);
  assert.equal(matchShowcase("what who when"), null);
  assert.equal(matchShowcase("!@#$%^"), null);
});

test("searchEntries: matches relevant entries and ranks accurately", () => {
  const results = searchEntries("Portland office");
  assert.ok(results.length > 0);
  assert.ok(results[0].score > 0.28);
  // All results have entry and score
  for (const hit of results) {
    assert.ok(hit.entry && hit.entry.id);
    assert.ok(typeof hit.score === "number");
  }
});

test("matchShowcase: matches known showcase questions", () => {
  const matched = matchShowcase("What did Elena decide about the Portland office?");
  assert.ok(matched !== null);
  assert.deepEqual(matched.sources, ["9c35fa80", "c14d80b6", "17ab64f9"]);
});
