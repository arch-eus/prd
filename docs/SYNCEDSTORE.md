# SyncedStore Implementation

This project has been modified to use SyncedStore, a CRDT library built on Yjs, to replace the original Evolu implementation.

## What is SyncedStore?

SyncedStore is a library that makes it easy to use Yjs (a CRDT implementation) with various frontend frameworks, including Svelte. It provides conflict-free data synchronization with the following features:

- Automatic conflict resolution
- Offline support
- IndexedDB persistence
- Multi-user collaboration
- Real-time synchronization

## Implementation Details

The integration of SyncedStore in this project involves:

1. **Data Structure**:
   - Tasks are serialized to handle Date objects properly
   - A custom store interface maintains compatibility with the original API

2. **Components**:
   - `SyncedStoreProvider.svelte`: Provides context for store access
   - `SyncStatus.svelte`: Shows current sync status

3. **Store Integration**:
   - `synced-store.ts`: Main implementation of the SyncedStore
   - Integration with Svelte's reactive system

## How It Works

SyncedStore uses Yjs under the hood, which implements the CRDT (Conflict-free Replicated Data Type) algorithm to ensure that data remains consistent when multiple clients make changes simultaneously, even when offline.

1. Each update is recorded as an operation in a log
2. When devices synchronize, they merge their operation logs
3. The CRDT algorithm ensures that all devices converge to the same state

## Potential Extensions

To enable multi-user collaboration, you would need to:

1. Add a server component using y-websocket or y-websocket-server
2. Set up authentication and access control
3. Configure WebSocket connections in the client

## Resources

- [SyncedStore Documentation](https://syncedstore.org/docs/)
- [Yjs Documentation](https://docs.yjs.dev/)
- [IndexedDB Persistence](https://docs.yjs.dev/ecosystem/database-provider/y-indexeddb)