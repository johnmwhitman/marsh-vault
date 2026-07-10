# The Marsh vault

**A memory vault you can interrogate — fifteen years of a fictional executive's
working memory, searched entirely in your browser. Nothing leaves the page.**

**Live demo: [withmnemo.com/demo](https://withmnemo.com/demo)**

Ask it who mentored Elena Marsh, what she decided about the Portland office, or
why she caps her practice at three clients. Then open your network tab, or just
switch on airplane mode, and ask again. It keeps answering — and the page
notices you went offline and says so.

That's the demonstration: a personal memory archive small enough to live
entirely on the client, useful enough to answer real questions, and private by
construction rather than by policy. There is no server to trust because there
is no server.

## What's in here

| File | What it is |
|---|---|
| [`src/ElenaVault.tsx`](src/ElenaVault.tsx) | The vault component (React). Tokenizer, loose stemmer, keyword/tag scorer, curated-answer matcher, offline detection, and the live instrumentation. |
| [`src/elena-vault-data.ts`](src/elena-vault-data.ts) | The synthetic vault: 48 memory entries spanning 2011–2026, plus 10 curated questions with sourced answers. **Every person, company, and number is fiction**, written for this demo and labeled as such on-page. |
| [`src/vault.css`](src/vault.css) | Reference styles — the "private library" world (ivory, racing green, brass, Caslon small caps) extracted from the live site. |

No build system, no dependencies, no telemetry. This is the exact source
running on the live page, published so the claim is inspectable: search the
files for `fetch(`, `XMLHttpRequest`, or `WebSocket` — there isn't a single
network call. (The one place the word "fetch" appears is a sentence.)

## How the proof works

The component instruments its own thesis instead of asserting it:

- **Per-query metrics** — every answer prints
  `[48 entries searched · <1 ms · 0 network requests]`. The request count is a
  before/after delta on the browser's Resource Timing ledger
  (`performance.getEntriesByType("resource")`), sampled a beat after the
  search — measured, not hardcoded.
- **Offline awareness** — the page listens for the browser's `offline` event
  (the one airplane mode fires). Go offline and the vault's titlebar flips to
  *"offline — still answering."* Get an answer with no network and it shows
  its QED: *you went offline and it answered anyway.*
- **Local search** — hybrid keyword + tag matching with a loose suffix
  stemmer, ranked by overlap, over data that ships inside the page bundle.
  It's deliberately simple: the point isn't the ranking algorithm, it's where
  the ranking happens.

## Colophon

Built as the technology showcase for [Mnemo](https://withmnemo.com) — a local,
private memory kit for Claude (ChromaDB + local embeddings + MCP server) that
is now out of print. The library remains open.

MIT © John Whitman
