/** Cost-protection helpers for the public Ask AI endpoint. Pure, no I/O. */

export const MAX_MESSAGE_CHARS = 1000;
export const MAX_HISTORY = 6;
export const MAX_OUTPUT_TOKENS = 600;
export const CONTEXT_BUDGET_CHARS = 9000;
export const MAX_CHUNK_CHARS = 1500;

export interface RateLimitOptions {
  perMinute: number;
  perDay: number;
  now?: () => number;
}

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number; window: 'minute' | 'day' };

/** In-memory sliding-window limiter, per key (IP). Resets on server restart. */
export function createRateLimiter(opts: RateLimitOptions) {
  const now = opts.now ?? Date.now;
  const hits = new Map<string, number[]>();
  const MINUTE = 60_000;
  const DAY = 86_400_000;

  return {
    check(key: string): RateLimitResult {
      const t = now();
      const list = (hits.get(key) ?? []).filter((x) => t - x < DAY);
      const inMinute = list.filter((x) => t - x < MINUTE);

      if (inMinute.length >= opts.perMinute) {
        hits.set(key, list);
        return { ok: false, window: 'minute', retryAfterSeconds: Math.ceil((inMinute[0] + MINUTE - t) / 1000) };
      }
      if (list.length >= opts.perDay) {
        hits.set(key, list);
        return { ok: false, window: 'day', retryAfterSeconds: Math.ceil((list[0] + DAY - t) / 1000) };
      }
      list.push(t);
      hits.set(key, list);
      // opportunistic cleanup so the map cannot grow forever
      if (hits.size > 5000) {
        for (const [k, v] of hits) if (v.every((x) => t - x >= DAY)) hits.delete(k);
      }
      return { ok: true };
    },
  };
}

/** Keep only the last `max` messages. */
export function trimHistory<T>(messages: T[], max = MAX_HISTORY): T[] {
  return messages.length > max ? messages.slice(messages.length - max) : messages;
}

export interface Chunk {
  url: string;
  title: string;
  text: string;
}

/** Split a page into heading-based chunks of at most `maxChars`. */
export function splitIntoChunks(page: { url: string; title: string; text: string }, maxChars = MAX_CHUNK_CHARS): Chunk[] {
  const sections = page.text.split(/\n(?=#{1,3} )/);
  const out: Chunk[] = [];
  for (const section of sections) {
    const s = section.trim();
    if (!s) continue;
    for (let i = 0; i < s.length; i += maxChars) {
      out.push({ url: page.url, title: page.title, text: s.slice(i, i + maxChars) });
    }
  }
  return out;
}

/** Take chunks in order until the character budget is used up. */
export function fitToBudget(chunks: Chunk[], budget = CONTEXT_BUDGET_CHARS): Chunk[] {
  const out: Chunk[] = [];
  let used = 0;
  for (const c of chunks) {
    if (used + c.text.length > budget) {
      if (out.length === 0) out.push({ ...c, text: c.text.slice(0, budget) });
      break;
    }
    out.push(c);
    used += c.text.length;
  }
  return out;
}

export function clientIp(headers: { get(name: string): string | null }): string {
  const fwd = headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim() || 'unknown';
  return headers.get('x-real-ip') ?? 'unknown';
}

/** Browser POSTs always carry Origin. Accept same host or an allow-listed origin. */
export function originAllowed(
  origin: string | null,
  host: string | null,
  allowList: string[] = [],
): boolean {
  if (!origin) return false;
  if (allowList.includes(origin)) return true;
  try {
    return host !== null && new URL(origin).host === host;
  } catch {
    return false;
  }
}
