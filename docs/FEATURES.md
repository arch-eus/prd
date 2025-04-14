# Task Manager - Enhanced Features

The Task Manager application has been enhanced with two major features that work together to provide an excellent offline-first user experience: Evolu.dev for data management and Progressive Web App (PWA) capabilities.

## Running the Application

To start the application with all features:

```bash
npm run dev
```

Then access it at http://localhost:5173

## 1. Evolu.dev Integration

[Evolu](https://evolu.dev/) is a local-first database for TypeScript that provides:

- SQL query builder with full TypeScript type-safety
- Local-first data storage with SQLite
- End-to-end encryption for data synchronization
- Schema validation using Effect Schema
- Automatic migration of data

### Key Features

- **Improved Data Persistence**: Data is stored in SQLite for improved reliability
- **Offline-First Capabilities**: All data operations work offline
- **Data Synchronization**: Encrypted data sync between devices using mnemonic phrases
- **Migration Path**: Automatic migration from existing storage

### Implementation

Core Evolu implementation files:
- `src/lib/stores/evolu.ts` - Database schema and store definitions
- `src/lib/utils/evolu.ts` - Utility functions for components
- `src/lib/components/EvoluProvider.svelte` - Context provider
- `src/lib/components/EvoluSync.svelte` - Sync UI component

## 2. Progressive Web App (PWA)

The PWA implementation enhances the application with:

- **Offline Functionality**: Works without an internet connection
- **Installable**: Can be added to home screens on mobile and desktop
- **App-like Experience**: Full-screen mode and smoother navigation
- **Auto Updates**: Detects and notifies about updates
- **Performance Optimization**: Caching for faster loading

### Key Components

- **PWAHandler.svelte**: Manages service worker and updates
- **PWAInstallBanner.svelte**: Provides installation prompt
- **manifest.webmanifest**: Defines app characteristics for browsers

### Implementation

The PWA is implemented using:
- Vite PWA Plugin for service worker generation
- Workbox for caching strategies and offline support
- Web App Manifest for installation capabilities

## How They Work Together

These features complement each other to create a truly offline-first application:

1. **Data Storage**:
   - Evolu stores application data in a local SQLite database
   - PWA service worker caches application assets (HTML, CSS, JS)

2. **Offline Experience**:
   - Evolu enables data manipulation while offline
   - PWA ensures the application shell works without a connection

3. **Updates and Sync**:
   - Evolu provides data synchronization between devices
   - PWA handles application code updates

## Testing the Features

### Testing Evolu

1. Create tasks in the application
2. View your mnemonic phrase in the sidebar
3. Open the app in another browser/device
4. Use "Restore Data" with your mnemonic phrase
5. Verify your tasks appear

### Testing PWA

1. Install the app using the install banner or browser UI
2. Use the app offline by turning off network connection
3. Refresh to verify it still works
4. Make changes while offline
5. Reconnect to see changes sync

## Future Improvements

1. **Background Sync**: Queue changes made offline
2. **Push Notifications**: Alert users about important tasks
3. **Conflict Resolution**: Handle concurrent edits better
4. **UI Enhancements**: Add offline status indicators