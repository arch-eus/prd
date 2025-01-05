# Task Manager

A modern task management application built with SvelteKit, featuring a clean and intuitive interface.

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
- Modern browser with IndexedDB support

## Dependencies

Core:
- SvelteKit
- TypeScript
- Tailwind CSS

Utilities:
- date-fns: Date manipulation
- idb-keyval: IndexedDB storage
- lucide-svelte: Icons

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