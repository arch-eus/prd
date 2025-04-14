# Evolu.dev Integration

This document explains how Evolu.dev has been integrated into the Task Manager application to provide improved offline capabilities and data synchronization.

## Running the Application

To start the application with Evolu and PWA support:

```bash
npm install
npm run dev
```

Access the application at http://localhost:5173

## What is Evolu?

[Evolu](https://evolu.dev/) is a local-first database for TypeScript, designed for offline-first applications. It provides:

- SQL query builder with full TypeScript type-safety
- Local-first data storage with SQLite
- End-to-end encryption for data synchronization
- Schema validation using Effect Schema
- Automatic migration of data

## Implementation Details

The following key files were created or modified:

### New Files

- `src/lib/stores/evolu-db.ts` - Core Evolu database schema and query definitions
- `src/lib/utils/evolu-utils.ts` - Utility functions for converting between Evolu and app data models
- `src/lib/components/EvoluProvider.svelte` - Svelte context provider for Evolu

### Modified Files

- `src/lib/stores/task/store.ts` - Updated task store to use Evolu
- `src/routes/+layout.svelte` - Added EvoluProvider component

## Features Added

1. **Improved Data Persistence**
   - Data is now stored using Evolu's SQLite for improved reliability
   - Type-safe schema validation ensures data integrity
   - Offline-first approach with automatic syncing

2. **Offline-First Capabilities**
   - All data operations work offline
   - Changes are persisted locally and synced when connectivity is restored

## Implementation Approach

Our implementation follows the official Evolu documentation pattern, adapted for Svelte:

1. **Database Schema** (`evolu-db.ts`):
   - Define table schemas with proper type validation
   - Set up database with indexes for performance
   - Create typed queries for data access

2. **Svelte Integration**:
   - Create reactive Svelte stores from Evolu queries
   - Provide proper context for component access
   - Handle subscription cleanup

3. **Data Conversion** (`evolu-utils.ts`):
   - Convert between Evolu records and app data models
   - Handle schema validation for data integrity

## Data Schema

The Evolu database schema follows the existing Task type structure:

```typescript
// Define the task table schema
const TaskTable = table({
  id: TaskId,
  title: NonEmptyString1000,
  description: S.nullable(NonEmptyString1000),
  notes: S.nullable(NonEmptyString1000),
  status: S.string,
  labels: S.array(S.string),
  dueDate: S.nullable(S.Date),
  completedAt: S.nullable(S.Date),
  order: S.number,
  recurrence: S.nullable(S.string),
});
```

## Svelte Store Creation

We've implemented a custom store creation function that handles both loading initial data and setting up reactivity:

```typescript
// Create a Svelte store from an Evolu query
export function createStore<T>(query) {
  const store = writable({
    rows: [],
    loading: true,
    error: null
  });
  
  // Load initial data
  evolu.loadQuery(query)
    .then(data => {
      store.set({
        rows: data as T[],
        loading: false,
        error: null
      });
    });
  
  // Set up subscription for reactive updates
  const unsubscribe = evolu.subscribe(query, {
    onData: (data) => {
      store.set({
        rows: data as T[],
        loading: false,
        error: null
      });
    },
    onError: (error) => {
      console.error("Subscription error:", error);
      store.update(state => ({
        ...state,
        error
      }));
    }
  });
  
  return {
    subscribe: store.subscribe,
    unsubscribe
  };
}
```

## Usage

The integration maintains the existing API surface for task operations, making it transparent to the application components. Operations available include:

```typescript
// Add a new task
taskStore.addTask({
  title: "New task",
  status: "todo",
  labels: ["work"]
});

// Update a task
taskStore.updateTask(taskId, {
  title: "Updated task"
});

// Delete a task
taskStore.deleteTask(taskId);

// Complete a task
taskStore.completeTask(taskId);

// Reopen a completed task
taskStore.reopenTask(taskId);
```

## Remote Synchronization

Evolu provides built-in support for data synchronization across devices:

```typescript
// Get the mnemonic for backup
const mnemonic = evolu.getMnemonic();

// Restore data on another device
evolu.restoreOwner(mnemonic);

// Reset all data
evolu.resetOwner();
```

## Future Improvements

1. Add server-side sync support when a backend is available
2. Implement conflict resolution for concurrent modifications
3. Add offline usage indicators and sync status
4. Add data import/export capabilities