export const handleError = ({ error }: { error: Error }) => {
  console.error('An error occurred:', error);
};

export const init = () => {
  // Initialize IndexedDB and other client-side functionality
  return Promise.resolve();
};