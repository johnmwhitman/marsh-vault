import {
  SHOWCASE,
  VAULT,
  type MemoryEntry,
  type ShowcaseQuestion,
} from "./elena-vault-data";

export const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "at", "for",
  "with", "about", "into", "from", "by", "as", "is", "was", "were",
  "are", "be", "been", "it", "its", "this", "that", "these", "those",
  "what", "who", "whom", "whose", "when", "where", "why", "how",
  "did", "do", "does", "done", "has", "have", "had", "can", "could",
  "would", "should", "will", "her", "hers", "she", "his", "he", "him",
  "they", "them", "their", "you", "your", "me", "my", "we", "us",
  "elena", "marsh", "ever", "any", "anything", "tell", "know",
]);

export function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s&-]/g, " ")
    .split(/[\s-]+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

/** loose stem: strip common English suffixes so "decided" ~ "decide" */
export function stem(w: string): string {
  return w
    .replace(/'s$/, "")
    .replace(/(ing|ed|es|s)$/, "")
    .replace(/(tion|sion)$/, "t");
}

export function stems(words: string[]): Set<string> {
  return new Set(words.map(stem));
}

export function overlap(qTokens: string[], target: Set<string>): number {
  if (qTokens.length === 0) return 0;
  const hits = qTokens.filter((w) => target.has(stem(w))).length;
  return hits / qTokens.length;
}

export type EntryHit = { entry: MemoryEntry; score: number };

export function searchEntries(
  query: string,
  entries: MemoryEntry[] = VAULT,
): EntryHit[] {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return [];
  return entries
    .map((entry) => {
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

export function matchShowcase(
  query: string,
  showcase: ShowcaseQuestion[] = SHOWCASE,
): ShowcaseQuestion | null {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return null;
  let best: { sq: ShowcaseQuestion; score: number } | null = null;
  for (const sq of showcase) {
    const target = stems([...tokenize(sq.q), ...sq.keywords.flatMap(tokenize)]);
    const score = overlap(qTokens, target);
    if (!best || score > best.score) best = { sq, score };
  }
  return best && best.score >= 0.55 ? best.sq : null;
}
