export function resolveCssColor(value: string): string {
  if (!value.startsWith('var(')) return value;
  const token = value.slice(4, -1).trim(); // 'var(--chart-2)' -> '--chart-2'
  const resolved = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  return resolved || value;
}
