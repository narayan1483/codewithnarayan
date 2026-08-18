/**
 * cache.js — Simple in-memory cache with TTL
 * Notes ko har request pe MySQL se nahi laana padega — cache se milega fast
 */

const store = new Map();

/**
 * Get cached value or fetch fresh data
 * @param {string} key - Cache key
 * @param {Function} fetcher - Async function to get fresh data
 * @param {number} ttlMs - Time-to-live in milliseconds (default 30 sec)
 */
export async function cached(key, fetcher, ttlMs = 30000) {
  const entry = store.get(key);
  if (entry && Date.now() - entry.time < ttlMs) {
    return entry.data;
  }

  const data = await fetcher();
  store.set(key, { data, time: Date.now() });
  return data;
}

/**
 * Invalidate a specific cache key (jab data change ho — create/update/delete)
 */
export function invalidate(key) {
  store.delete(key);
}

/**
 * Clear entire cache
 */
export function clearCache() {
  store.clear();
}
