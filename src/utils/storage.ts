export function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function load<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}