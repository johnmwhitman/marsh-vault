import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

const SRC_DIR = path.resolve("src");

const FORBIDDEN_NETWORK_PATTERNS = [
  { name: "fetch() call", regex: /\bfetch\s*\(/g },
  { name: "window.fetch", regex: /\bwindow\.fetch\b/g },
  { name: "globalThis.fetch", regex: /\bglobalThis\.fetch\b/g },
  { name: "XMLHttpRequest", regex: /\bXMLHttpRequest\b/g },
  { name: "WebSocket", regex: /\bWebSocket\b/g },
  { name: "EventSource", regex: /\bEventSource\b/g },
  { name: "sendBeacon", regex: /\b(navigator\.)?sendBeacon\b/g },
];

test("Zero-Network Leak Invariant across client src/", () => {
  const files = fs.readdirSync(SRC_DIR).filter((f) => /\.(tsx?|jsx?|css)$/.test(f));
  assert.ok(files.length > 0, "Source files must exist in src/");

  const violations = [];

  for (const file of files) {
    const filePath = path.join(SRC_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      // Skip pure comment lines
      if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
        return;
      }

      for (const { name, regex } of FORBIDDEN_NETWORK_PATTERNS) {
        regex.lastIndex = 0;
        if (regex.test(line)) {
          violations.push({
            file,
            lineNum: idx + 1,
            pattern: name,
            lineText: trimmed,
          });
        }
      }
    });
  }

  if (violations.length > 0) {
    console.error("Zero-Network Leak Violations detected:");
    for (const v of violations) {
      console.error(`  ${v.file}:${v.lineNum} [${v.pattern}] -> ${v.lineText}`);
    }
  }

  assert.equal(
    violations.length,
    0,
    `Found ${violations.length} network call violations in src/`
  );
});
