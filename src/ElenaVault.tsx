"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  PERSONA,
  SHOWCASE,
  VAULT,
  type MemoryEntry,
  type ShowcaseQuestion,
} from "./elena-vault-data";

/**
 * The Marsh vault — an interactive, fully client-side memory-vault
 * showcase. All data is fictional and embedded in the bundle; every
 * query is answered by plain JavaScript in the visitor's browser.
 * No request leaves the page. That is the demonstration — and the
 * vault instruments it live: per-query timings, a network-request
 * count (always zero), and it notices when you go offline and keeps
 * answering anyway.
 */

// ——— Search (keyword/fuzzy, all local) ———

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "at", "for",
  "with", "about", "into", "from", "by", "as", "is", "was", "were",
  "are", "be", "been", "it", "its", "this", "that", "these", "those",
  "what", "who", "whom", "whose", "when", "where", "why", "how",
  "did", "do", "does", "done", "has", "have", "had", "can", "could",
  "would", "should", "will", "her", "hers", "she", "his", "he", "him",
  "they", "them", "their", "you", "your", "me", "my", "we", "us",
  "elena", "marsh", "ever", "any", "anything", "tell", "know",
]);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s&-]/g, " ")
    .split(/[\s-]+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

/** loose stem: strip common English suffixes so "decided" ~ "decide" */
function stem(w: string): string {
  return w
    .replace(/'s$/, "")
    .replace(/(ing|ed|es|s)$/, "")
    .replace(/(tion|sion)$/, "t");
}

function stems(words: string[]): Set<string> {
  return new Set(words.map(stem));
}

function overlap(qTokens: string[], target: Set<string>): number {
  if (qTokens.length === 0) return 0;
  const hits = qTokens.filter((w) => target.has(stem(w))).length;
  return hits / qTokens.length;
}

type EntryHit = { entry: MemoryEntry; score: number };

function searchEntries(query: string): EntryHit[] {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return [];
  return VAULT.map((entry) => {
    const textStems = stems(tokenize(entry.text));
    const tagStems = stems(entry.tags.flatMap((t) => tokenize(t)));
    const score =
      overlap(qTokens, textStems) + 1.4 * overlap(qTokens, tagStems);
    return { entry, score };
  })
    .filter((h) => h.score > 0.28)
    .sort((a, b) => b.score - a.score || (a.entry.date < b.entry.date ? 1 : -1))
    .slice(0, 5);
}

function matchShowcase(query: string): ShowcaseQuestion | null {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return null;
  let best: { sq: ShowcaseQuestion; score: number } | null = null;
  for (const sq of SHOWCASE) {
    const target = stems([...tokenize(sq.q), ...sq.keywords.flatMap(tokenize)]);
    const score = overlap(qTokens, target);
    if (!best || score > best.score) best = { sq, score };
  }
  return best && best.score >= 0.55 ? best.sq : null;
}

function byId(id: string): MemoryEntry | undefined {
  return VAULT.find((e) => e.id === id);
}

// ——— Live instrumentation (the proof, not a promise) ———

/** Total resources this document has requested, of any kind. */
function resourceCount(): number {
  try {
    return performance.getEntriesByType("resource").length;
  } catch {
    return 0;
  }
}

type QueryMeta = {
  ms: number;
  requests: number | null; // null = still sampling
  offline: boolean;
};

// ——— Rendering ———

const KIND_LABEL: Record<MemoryEntry["kind"], string> = {
  decision: "decision",
  meeting: "meeting",
  note: "note",
  contact: "contact",
  introduction: "introduction",
};

/** Underline the words in an entry that matched the visitor's question. */
function Highlighted({ text, tokens }: { text: string; tokens: string[] }) {
  const parts = useMemo(() => {
    const words = tokens
      .map(stem)
      .filter((w) => w.length > 2)
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, ""));
    if (words.length === 0) return [text];
    // capture the WHOLE word (stem + suffix): split() drops un-captured match text
    const re = new RegExp(`(\\b(?:${words.join("|")})[a-z]*)`, "gi");
    return text.split(re);
  }, [text, tokens]);
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="hl">
            {p}
          </mark>
        ) : (
          p
        ),
      )}
    </>
  );
}

function EntryCard({ entry, tokens }: { entry: MemoryEntry; tokens?: string[] }) {
  return (
    <div className="note-card">
      <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-0">
        <span className="amber">[{entry.id}]</span>
        <span className="dim">{entry.date}</span>
        <span className="green">{KIND_LABEL[entry.kind]}</span>
      </div>
      <div>
        {tokens && tokens.length > 0 ? (
          <Highlighted text={entry.text} tokens={tokens} />
        ) : (
          entry.text
        )}
      </div>
    </div>
  );
}

/** The instrument line: hard numbers under every answer. */
function MetaLine({ meta }: { meta: QueryMeta }) {
  return (
    <div className="amber mt-1 text-[13px]" aria-live="polite">
      [{VAULT.length} entries searched · {meta.ms < 1 ? "<1" : Math.round(meta.ms)} ms ·{" "}
      {meta.requests === null ? "…" : meta.requests} network requests
      {meta.offline ? " · offline" : ""}]
    </div>
  );
}

type Result =
  | { kind: "idle" }
  | { kind: "curated"; query: string; sq: ShowcaseQuestion; also: EntryHit[] }
  | { kind: "matches"; query: string; hits: EntryHit[] }
  | { kind: "empty"; query: string };

export default function ElenaVault() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Result>({ kind: "idle" });
  const [asked, setAsked] = useState(0);
  const [meta, setMeta] = useState<QueryMeta | null>(null);
  const [offline, setOffline] = useState(false);
  const [askedOffline, setAskedOffline] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const ledgerRef = useRef<HTMLDetailsElement>(null);
  const metaTimer = useRef<number | null>(null);

  // The vault notices airplane mode — that's the trick becoming a proof.
  useEffect(() => {
    // The measured zero must stay measurable: don't let the Resource Timing
    // buffer fill up and silently stop counting.
    try {
      performance.setResourceTimingBufferSize(2000);
    } catch {
      // older engines: counter degrades gracefully
    }
    setOffline(!navigator.onLine);
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  // The punchline should land only after genuine engagement: three real
  // queries in. Until then we don't breathe a word about "local" or
  // "nothing leaves the page" — the reveal is the magic trick, not a banner.
  // Going offline reveals immediately: the visitor is already testing us.
  const REVEAL_AT = 3;
  const revealed = asked >= REVEAL_AT || (offline && asked > 0);

  const years = useMemo(() => {
    const map = new Map<string, MemoryEntry[]>();
    for (const e of VAULT) {
      const y = e.date.slice(0, 4);
      map.set(y, [...(map.get(y) ?? []), e]);
    }
    return [...map.entries()];
  }, []);

  const queryTokens = useMemo(
    () =>
      result.kind === "matches" || result.kind === "curated"
        ? tokenize(result.query)
        : [],
    [result],
  );

  function ask(raw: string) {
    const query = raw.trim();
    if (!query) return;
    const reqs0 = resourceCount();
    const t0 = performance.now();
    const sq = matchShowcase(query);
    if (sq) {
      const sourceIds = new Set(sq.sources);
      const also = searchEntries(query).filter(
        (h) => !sourceIds.has(h.entry.id),
      );
      setResult({ kind: "curated", query, sq, also: also.slice(0, 2) });
    } else {
      const hits = searchEntries(query);
      setResult(
        hits.length > 0
          ? { kind: "matches", query, hits }
          : { kind: "empty", query },
      );
    }
    const ms = performance.now() - t0;
    const wasOffline = !navigator.onLine;
    setMeta({ ms, requests: null, offline: wasOffline });
    if (wasOffline) setAskedOffline(true);
    // Requests are asynchronous; sample the resource ledger a beat later so
    // the zero is measured, not asserted. Cancel any in-flight sample so a
    // rapid second query can't be overwritten by the first one's timer.
    if (metaTimer.current !== null) window.clearTimeout(metaTimer.current);
    metaTimer.current = window.setTimeout(() => {
      metaTimer.current = null;
      setMeta({ ms, requests: resourceCount() - reqs0, offline: wasOffline });
    }, 150);
    setAsked((n) => n + 1);
    // Keep the answer in view without scrolling the whole page (near-zero motion).
    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "auto", block: "nearest" });
    });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    ask(input);
  }

  function jumpToYear(year: string) {
    if (ledgerRef.current) ledgerRef.current.open = true;
    requestAnimationFrame(() => {
      document
        .getElementById(`vault-year-${year}`)
        ?.scrollIntoView({ behavior: "auto", block: "start" });
    });
  }

  const footerLine = offline
    ? "Answered with the network gone. Nothing to send, nothing to fetch — the vault was already here."
    : revealed
      ? "Answered locally, in your browser. Nothing left this page."
      : null;

  return (
    <div className="panel overflow-hidden">
      <div className="panel-titlebar">
        <span>The Marsh vault · fictional data</span>
        <span>
          {VAULT.length} memories
          {asked > 0 ? ` · ${asked} asked` : ""}
          {offline ? (
            <span className="green"> · offline — still answering</span>
          ) : revealed ? (
            " · local · zero requests"
          ) : (
            ""
          )}
        </span>
      </div>

      <div className="px-5 py-5 sm:px-6">
        {/* Query box */}
        <form onSubmit={onSubmit} className="flex items-stretch gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Ask the vault a question about Elena Marsh"
            placeholder="Ask the vault — e.g. what did Elena decide about the Portland office?"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="field min-w-0 flex-1"
            style={{ fontFamily: "var(--font-courier), monospace", fontSize: 14 }}
          />
          <button type="submit" className="btn-wax shrink-0 !px-5 !py-2">
            consult
          </button>
        </form>

        {/* Suggested questions */}
        <div className="mt-4">
          <span className="smallcaps text-[13px]">Questions the vault can answer</span>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
            {SHOWCASE.map((sq) => (
              <button
                key={sq.q}
                type="button"
                onClick={() => {
                  setInput(sq.q);
                  ask(sq.q);
                }}
                className="marginal cursor-pointer border-0 bg-transparent p-0 text-left text-[14px] underline decoration-dotted underline-offset-4 hover:text-green"
              >
                {sq.q}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <div ref={resultRef}>
          {result.kind === "curated" && (
            <div className="mt-6 border-t border-line pt-5">
              <div className="mb-1 dim">
                $ mnemo search &ldquo;{result.query}&rdquo;
              </div>
              {meta && <MetaLine meta={meta} />}
              <div className="mt-3 mb-3 font-serif text-[16px] leading-relaxed font-[family-name:var(--font-caslon)]">
                {result.sq.answer}
              </div>
              <div className="smallcaps mb-2 text-[13px]">
                From the ledger · {result.sq.sources.length} entries retrieved
              </div>
              <div className="space-y-2">
                {result.sq.sources.map((id) => {
                  const entry = byId(id);
                  return entry ? (
                    <EntryCard key={id} entry={entry} tokens={queryTokens} />
                  ) : null;
                })}
                {result.also.map((h) => (
                  <EntryCard key={h.entry.id} entry={h.entry} tokens={queryTokens} />
                ))}
              </div>
              {footerLine && <div className="dim mt-3">{footerLine}</div>}
              {!footerLine && (
                <div className="dim mt-3">Retrieved from the ledger.</div>
              )}
            </div>
          )}

          {result.kind === "matches" && (
            <div className="mt-6 border-t border-line pt-5">
              <div className="mb-1 dim">
                $ mnemo search &ldquo;{result.query}&rdquo;
              </div>
              {meta && <MetaLine meta={meta} />}
              <div className="smallcaps mt-3 mb-2 text-[13px]">
                {result.hits.length}{" "}
                {result.hits.length === 1 ? "entry" : "entries"} retrieved
              </div>
              <div className="space-y-2">
                {result.hits.map((h) => (
                  <EntryCard key={h.entry.id} entry={h.entry} tokens={queryTokens} />
                ))}
              </div>
              {footerLine ? (
                <div className="dim mt-3">{footerLine}</div>
              ) : (
                <div className="dim mt-3">Ranked by keyword match.</div>
              )}
            </div>
          )}

          {result.kind === "empty" && (
            <div className="mt-6 border-t border-line pt-5">
              <div className="mb-1 dim">
                $ mnemo search &ldquo;{result.query}&rdquo;
              </div>
              {meta && <MetaLine meta={meta} />}
              <div className="dim mt-3">
                Nothing in the vault matches that. Elena&rsquo;s fifteen years
                cover her clients (Tidegate, Copperline, Meridian), her people
                (Ruth, Priya, Dana, Marcus, Tom, Sofia), and her decisions —
                try one of the questions above, or a keyword like
                &ldquo;covenant&rdquo;, &ldquo;retainer&rdquo;, or
                &ldquo;Portland&rdquo;.
              </div>
            </div>
          )}
        </div>

        {/* ——— The reveal — earned after three queries, or instantly offline ——— */}
        {revealed && (
          <div
            className="mt-6 border-t-[3px] border-double border-brass-soft pt-5"
            role="note"
            aria-live="polite"
          >
            {askedOffline ? (
              <>
                <p className="smallcaps mb-2 text-[13px]">
                  Quod erat demonstrandum
                </p>
                <p className="font-[family-name:var(--font-caslon)] text-[17px] leading-relaxed text-ink">
                  <span className="swash">You went offline — and it answered anyway.</span>{" "}
                  Every word of Elena&rsquo;s fifteen years is in{" "}
                  <em className="text-green">your browser</em>. There was never
                  a server to ask. With a private library, there never is.
                  That&rsquo;s the whole product idea, proven — by you, just now.
                </p>
              </>
            ) : offline ? (
              <>
                <p className="smallcaps mb-2 text-[13px]">You&rsquo;re offline</p>
                <p className="font-[family-name:var(--font-caslon)] text-[17px] leading-relaxed text-ink">
                  The network is gone —{" "}
                  <span className="swash">ask the vault once more.</span>{" "}
                  It will still answer, because every word of Elena&rsquo;s life
                  is already in <em className="text-green">your browser</em>.
                  Nothing has left this page, and nothing needs to arrive.
                </p>
              </>
            ) : (
              <>
                <p className="smallcaps mb-2 text-[13px]">Here&rsquo;s the thing</p>
                <p className="font-[family-name:var(--font-caslon)] text-[17px] leading-relaxed text-ink">
                  You&rsquo;ve searched Elena&rsquo;s fifteen years three times
                  now.{" "}
                  <span className="swash">Disconnect your internet</span>{" "}
                  and do it again. It still works. Every word of Elena&rsquo;s life
                  is in{" "}
                  <em className="text-green">your browser</em>{" "}
                  — nothing has left this page, because with a private library,
                  nothing ever does. That&rsquo;s the whole idea.
                </p>
                <p className="marginal mt-3">
                  Go on — switch on airplane mode, kill the wifi, then ask the vault
                  once more. This page will notice, and the answers will keep
                  coming. That&rsquo;s not a promise on a banner; it&rsquo;s
                  something you can prove for yourself, right now.
                </p>
              </>
            )}
          </div>
        )}

        {/* ——— The shelf — fifteen years at a glance ——— */}
        <div className="mt-6 border-t border-line pt-4">
          <span className="smallcaps text-[13px]">The shelf · {PERSONA.span}</span>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
            {years.map(([year, entries]) => (
              <button
                key={year}
                type="button"
                onClick={() => jumpToYear(year)}
                title={`${entries.length} ${entries.length === 1 ? "entry" : "entries"} from ${year}`}
                className="shelf-year"
              >
                <span className="chapter-no text-[14px]">{year}</span>
                <span className="shelf-ticks" aria-hidden="true">
                  {"·".repeat(Math.min(entries.length, 8))}
                </span>
                <span className="sr-only">
                  , {entries.length} {entries.length === 1 ? "entry" : "entries"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Full ledger */}
        <details ref={ledgerRef} className="mt-4 border-t border-line pt-4">
          <summary className="smallcaps cursor-pointer list-none text-[13px] hover:text-green">
            Open the full ledger — all {VAULT.length} entries, {PERSONA.span} ›
          </summary>
          <div className="mt-3 space-y-4">
            {years.map(([year, entries]) => (
              <div key={year} id={`vault-year-${year}`}>
                <div className="chapter-no mb-1.5 text-[15px]">{year}</div>
                <div className="space-y-2">
                  {entries.map((e) => (
                    <EntryCard key={e.id} entry={e} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}
