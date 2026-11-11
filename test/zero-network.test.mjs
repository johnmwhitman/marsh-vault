import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

const SRC_DIR = path.resolve("src");

export const FORBIDDEN_NETWORK_PATTERNS = [
  { name: "fetch() call", regex: /\bfetch\s*\(/g },
  { name: "window.fetch", regex: /\bwindow\.fetch\b/g },
  { name: "globalThis.fetch", regex: /\bglobalThis\.fetch\b/g },
  { name: "XMLHttpRequest", regex: /\bXMLHttpRequest\b/g },
  { name: "WebSocket", regex: /\bWebSocket\b/g },
  { name: "EventSource", regex: /\bEventSource\b/g },
  { name: "sendBeacon", regex: /\b(navigator\.)?sendBeacon\b/g },
  {
    name: "dynamic import() of remote URL",
    regex: /\bimport\s*\(\s*[`"'](?:https?:|\/\/)/gi,
  },
];

export function findViolations(content, filename = "file") {
  const lines = content.split("\n");
  const violations = [];

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
          file: filename,
          lineNum: idx + 1,
          pattern: name,
          lineText: trimmed,
        });
      }
    }
  });

  return violations;
}

test("Zero-Network Leak Invariant across client src/", () => {
  const files = fs.readdirSync(SRC_DIR).filter((f) => /\.(tsx?|jsx?|css)$/.test(f));
  assert.ok(files.length > 0, "Source files must exist in src/");

  const violations = [];

  for (const file of files) {
    const filePath = path.join(SRC_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    violations.push(...findViolations(content, file));
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

test("Network patterns detection unit tests", () => {
  const forbiddenCases = [
    { code: "const socket = new WebSocket('wss://example.com');", expectedPattern: "WebSocket" },
    { code: "const es = new EventSource('/events');", expectedPattern: "EventSource" },
    { code: "const xhr = new XMLHttpRequest();", expectedPattern: "XMLHttpRequest" },
    { code: "navigator.sendBeacon('/log', data);", expectedPattern: "sendBeacon" },
    { code: "sendBeacon('/log', data);", expectedPattern: "sendBeacon" },
    { code: "const mod = await import('https://example.com/module.js');", expectedPattern: "dynamic import() of remote URL" },
    { code: "const mod = await import(\"http://example.com/module.js\");", expectedPattern: "dynamic import() of remote URL" },
    { code: "const mod = await import(`https://example.com/module.js`);", expectedPattern: "dynamic import() of remote URL" },
    { code: "const mod = await import('//cdn.example.com/module.js');", expectedPattern: "dynamic import() of remote URL" },
    { code: "fetch('/api')", expectedPattern: "fetch() call" },
    { code: "window.fetch('/api')", expectedPattern: "window.fetch" },
    { code: "globalThis.fetch('/api')", expectedPattern: "globalThis.fetch" },
  ];

  for (const { code, expectedPattern } of forbiddenCases) {
    const violations = findViolations(code, "test-case.js");
    assert.ok(
      violations.some((v) => v.pattern === expectedPattern),
      `Expected "${code}" to trigger pattern "${expectedPattern}"`
    );
  }

  const allowedCases = [
    "// new WebSocket('wss://example.com')",
    "/* const es = new EventSource('/events'); */",
    " * navigator.sendBeacon('/log', data);",
    "const mod = await import('./local-module.js');",
    "const mod = await import('../relative/module.js');",
    "const mod = await import('@scope/package');",
    "const mod = await import('package-name');",
    "const text = 'fetch and retrieve records';",
  ];

  for (const code of allowedCases) {
    const violations = findViolations(code, "test-case.js");
    assert.equal(
      violations.length,
      0,
      `Expected allowed code "${code}" to have 0 violations, but found: ${JSON.stringify(violations)}`
    );
  }
});
