/**
 * Svelte hooks for client-side initialization and error handling
 * Using a try-catch pattern to prevent any startup errors
 */

// Handle errors during rendering
export const handleError = ({ error }: { error: Error }) => {
  console.error('An error occurred during rendering:', error);
  
  // Return false to prevent the default error page
  return false;
};

// Setup global polyfills if needed
const setupPolyfills = () => {
  // Ensure globalThis is defined
  if (typeof window !== 'undefined' && typeof globalThis === 'undefined') {
    (window as any).globalThis = window;
  }
};

// Client-side initialization
export const init = () => {
  try {
    // Set up any required polyfills
    setupPolyfills();
    
    console.info('Task Manager initialized');
    
    // Register a global error handler as a safety measure
    window.addEventListener('error', (event) => {
      console.error('Uncaught error:', event.error);
      // Prevent the error from bubbling up in non-critical cases
      if (event.error?.message?.includes('@effect')) {
        console.warn('Suppressing non-critical dependency error');
        event.preventDefault();
      }
    });
    
    // Register unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      // Prevent the error from bubbling up in non-critical cases
      if (event.reason?.message?.includes('@effect')) {
        console.warn('Suppressing non-critical dependency error');
        event.preventDefault();
      }
    });
  } catch (error) {
    console.error('Error during initialization:', error);
  }
};