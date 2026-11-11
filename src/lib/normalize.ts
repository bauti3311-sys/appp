/**
 * String normalization matching Kotlin LocalLanguage and Models.kt:
 * Lowercases and strips diacritics/accents.
 */
export function normalize(s: string): string {
  if (!s) return '';
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Levenshtein distance for fuzzy matching
 */
export function distance(a: string, b: string): number {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 0; i < a.length; i++) {
    const row = new Array(b.length + 1);
    row[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      row[j + 1] = Math.min(
        row[j] + 1,
        prev[j + 1] + 1,
        prev[j] + (a[i] === b[j] ? 0 : 1)
      );
    }
    prev = row;
  }
  return prev[b.length];
}

/**
 * Relevance scoring algorithm matching Kotlin Models.kt
 */
export function relevance(query: string, title: string): number {
  const q = normalize(query.trim());
  const t = normalize(title);
  if (!q) return 10;
  if (q === t) return 1000;
  if (t.startsWith(q)) return 800;
  if (t.split(/\s+/).some(word => word.startsWith(q))) return 650;
  if (t.includes(q)) return 500;
  if (q.length < 3 || q.length > 128 || t.length > 256) return 0;
  const d = distance(q, t);
  return d <= 2 ? 250 - d * 40 : 0;
}
