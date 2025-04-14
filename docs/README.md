# Task Manager

A modern task management application built with SvelteKit, featuring a clean and intuitive interface with offline-first capability through Evolu.dev and Progressive Web App (PWA) support.

## Features

- ✅ Task Management
  - Create, edit, and delete tasks
  - Mark tasks as complete/incomplete
  - Add descriptions and notes
  - Tag-based organization
  - Due date scheduling

- 📅 Calendar Integration
  - Weekly view calendar
  - Date-based task filtering
  - Quick navigation to today

- 🔄 Recurring Tasks
  - Monthly, quarterly, and yearly recurring tasks
  - Automatic due date updates
  - Export recurring task lists

- 📊 Task Organization
  - Tag-based filtering
  - Search functionality
  - Completed tasks archive
  - Task logbook with export capability

- ⌨️ Keyboard Shortcuts
  - `?` - Show keyboard shortcuts
  - `n` - Create new task
  - `/` - Focus search
  - `t` - Go to today
  - `Esc` - Close modal / Clear search

## Technical Requirements

- Node.js 18+
- Modern browser with Service Worker and IndexedDB support

## Dependencies

Core:
- SvelteKit
- TypeScript
- Tailwind CSS

Offline & Data:
- Evolu: Local-first database with sync capability
- Effect Schema: Schema validation
- Service Worker: PWA offline support

Utilities:
- date-fns: Date manipulation
- idb-keyval: IndexedDB storage (legacy)
- lucide-svelte: Icons

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

For more information about the enhanced features:
- [Evolu & PWA Features](./FEATURES.md)
- [Evolu Implementation](./EVOLU.md)
- [PWA Implementation](./PWA.md)

## Project Structure

```
src/
├── lib/
│   ├── components/    # UI components
│   ├── stores/        # State management
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
├── routes/            # SvelteKit routes
└── app.css           # Global styles
```