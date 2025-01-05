/**
 * Search result highlighting utilities
 */
export function highlightSearchTerms(text: string, searchTerms: string[]): string {
  if (!searchTerms.length) return text;
  
  const pattern = new RegExp(`(${searchTerms.join('|')})`, 'gi');
  return text.replace(pattern, '<mark>$1</mark>');
}