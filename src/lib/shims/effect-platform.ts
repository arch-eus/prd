/**
 * Shim for @effect/platform
 * 
 * This provides minimal implementations of needed functionality
 * to avoid runtime errors when the actual platform module
 * is marked as external during the build.
 */

// Default export to satisfy imports
export default {};

// Http related
export const HttpClient = {
  make: () => ({})
};

// File system related
export const FileSystem = {
  make: () => ({})
};

// Common types and utilities
export const Error = {
  // Error constructors
  RuntimeException: (message: string) => new Error(message)
};

// Request/Response helpers
export const HttpRequest = {
  get: (url: string) => ({ url }),
  post: (url: string, body: any) => ({ url, body })
};

export const HttpResponse = {
  fromJson: (data: any) => ({ data })
};

// Other utilities
export const Platform = {
  layer: () => ({})
};

export const Runtime = {
  runPromise: async <T>(effect: Promise<T>) => effect
};