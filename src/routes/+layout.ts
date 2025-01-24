// Disable SSR since we're using client-side storage
export const ssr = false;
export const csr = true;

// Load function returns empty props
export const load = () => ({});
