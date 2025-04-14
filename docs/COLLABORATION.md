# Multi-User Collaboration Guide

This application now supports real-time collaboration using SyncedStore/Yjs, allowing multiple users to work on the same task list simultaneously with automatic conflict resolution.

## Getting Started

### Starting the Collaboration Server

To enable collaboration between multiple users, you need to run the WebSocket server:

```bash
npm run collaboration-server
```

This will start a WebSocket server on port 1234 by default. You can change the port by setting the `PORT` environment variable:

```bash
PORT=8080 npm run collaboration-server
```

### Enabling Collaboration in the App

1. In the app's sidebar, click on "Collaboration Settings" under the sync status section.
2. Check "Enable collaboration".
3. Enter the WebSocket server URL (e.g., `ws://localhost:1234`).
4. Specify a room name (users in the same room will share data).
5. Enter your display name (shown to other collaborators).
6. Click "Apply Settings".

## How It Works

The collaboration feature uses a CRDT (Conflict-free Replicated Data Type) implementation called Yjs, which enables:

1. **Real-time Synchronization**: Changes made by one user are immediately visible to others.
2. **Offline Support**: You can work offline, and changes will sync when connectivity is restored.
3. **Automatic Conflict Resolution**: If multiple users edit the same task simultaneously, Yjs intelligently merges the changes without data loss.
4. **Persistence**: All data is stored locally in IndexedDB and synced when connections are available.

## Architecture

The collaboration system consists of three main components:

1. **Client CRDT Store**: Using SyncedStore (a wrapper around Yjs) for data management.
2. **IndexedDB Persistence**: Local storage ensuring offline functionality.
3. **WebSocket Provider**: Handles real-time synchronization between clients.

## Advanced Setup

### Running the Server on a Different Machine

To run the collaboration server on a different machine:

1. Make sure both machines are on the same network or the server is accessible over the internet.
2. Start the server:
   ```bash
   npm run collaboration-server
   ```
3. Find the server's IP address:
   ```bash
   ifconfig  # On Linux/Mac
   ipconfig  # On Windows
   ```
4. In the app's collaboration settings, use `ws://SERVER_IP:1234` as the WebSocket server URL.

### Multi-Room Support

You can create multiple collaboration rooms for different teams or projects:

1. Simply enter different room names in the collaboration settings.
2. Each room is isolated, and data is only synchronized between users in the same room.

### Security Considerations

The current implementation does not include authentication or encryption. For production use, consider:

1. Adding authentication to the WebSocket server.
2. Using TLS/SSL (wss:// instead of ws://) for encrypted communication.
3. Implementing access control for different rooms.

## Troubleshooting

### Connection Issues

If you're having trouble connecting:

1. Check that the WebSocket server is running.
2. Verify the server URL in the collaboration settings.
3. Ensure no firewall is blocking the WebSocket port.
4. Try the "Reset Database" option if you suspect data corruption.

### Peer Count Issues

If the peer count seems incorrect:

1. Refresh the page to re-establish the connection.
2. Check that all users are connected to the same room.

## Known Limitations

- Large datasets may cause performance issues.
- The WebSocket server does not persist data; if all clients disconnect, synchronization relies on at least one client having the complete dataset when reconnecting.
- No built-in user presence or cursor tracking (can be added with additional development).

## Future Enhancements

Possible enhancements for the collaboration feature:

1. User cursors and presence indicators.
2. Change history and undo/redo functionality.
3. Access control and permissions.
4. End-to-end encryption for sensitive data.
5. Server-side persistence for full data recovery.