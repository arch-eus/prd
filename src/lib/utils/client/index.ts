// Client-side utilities
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function isBrowser(): boolean {
  return isClient();
}