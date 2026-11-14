import { describe, expect, it } from 'vitest';
import {
  createRateLimiter,
  fitToBudget,
  originAllowed,
  splitIntoChunks,
  trimHistory,
} from './limits';

describe('rate limiter', () => {
  it('blocks the 11th request in a minute, then recovers', () => {
    let t = 0;
    const rl = createRateLimiter({ perMinute: 10, perDay: 100, now: () => t });
    for (let i = 0; i < 10; i++) expect(rl.check('a').ok).toBe(true);
    const blocked = rl.check('a');
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) expect(blocked.window).toBe('minute');
    expect(rl.check('b').ok).toBe(true);
    t = 61_000;
    expect(rl.check('a').ok).toBe(true);
  });

  it('enforces the daily cap', () => {
    let t = 0;
    const rl = createRateLimiter({ perMinute: 10, perDay: 15, now: () => t });
    for (let i = 0; i < 15; i++) {
      t += 61_000;
      expect(rl.check('a').ok).toBe(true);
    }
    t += 61_000;
    const r = rl.check('a');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.window).toBe('day');
  });
});

describe('context trimming', () => {
  it('keeps the last 6 messages', () => {
    expect(trimHistory([1, 2, 3, 4, 5, 6, 7, 8], 6)).toEqual([3, 4, 5, 6, 7, 8]);
    expect(trimHistory([1, 2], 6)).toEqual([1, 2]);
  });

  it('splits by heading and caps chunk size', () => {
    const text = '# A\nfoo\n## B\n' + 'x'.repeat(40);
    const chunks = splitIntoChunks({ url: '/docs/a', title: 'A', text }, 20);
    expect(chunks.length).toBeGreaterThanOrEqual(3);
    expect(chunks.every((c) => c.text.length <= 20 && c.url === '/docs/a')).toBe(true);
  });

  it('fits chunks to the budget', () => {
    const mk = (n: number) => ({ url: '/u', title: 't', text: 'y'.repeat(n) });
    expect(fitToBudget([mk(40), mk(40), mk(40)], 100)).toHaveLength(2);
    expect(fitToBudget([mk(500)], 100)[0]!.text).toHaveLength(100);
  });
});

describe('origin check', () => {
  it('accepts same host and allow-list, rejects others', () => {
    expect(originAllowed('https://docs.example.test', 'docs.example.test')).toBe(true);
    expect(originAllowed('https://evil.example', 'docs.example.test')).toBe(false);
    expect(originAllowed(null, 'docs.example.test')).toBe(false);
    expect(originAllowed('https://other.app', 'h', ['https://other.app'])).toBe(true);
  });
});
