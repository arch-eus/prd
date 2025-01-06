<script lang="ts">
  import { selectedTags } from '$lib/stores/filters';
  import { Calendar, CheckSquare, RotateCcw, Book } from 'lucide-svelte';
  import QuickTags from '../QuickTags.svelte';
  import { page } from '$app/stores';
</script>

<nav class="p-4 space-y-6 font-jetbrains-mono">
  <div class="space-y-2">
    <h3 class="px-4 text-sm font-medium text-navy-400">Tasks</h3>
    <a
      href="/"
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors
        {$page.url.pathname === '/' ? 'bg-navy-600 text-white' : 'text-navy-800 hover:bg-navy-50'}"
    >
      <Calendar class="w-4 h-4" />
      Overview
    </a>
    <a
      href="/recurring"
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors
        {$page.url.pathname === '/recurring' ? 'bg-navy-600 text-white' : 'text-navy-800 hover:bg-navy-50'}"
    >
      <RotateCcw class="w-4 h-4" />
      Recurring
    </a>
    <a
      href="/completed"
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors
        {$page.url.pathname === '/completed' ? 'bg-navy-600 text-white' : 'text-navy-800 hover:bg-navy-50'}"
    >
      <CheckSquare class="w-4 h-4" />
      Completed
    </a>
    <a
      href="/logbook"
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors
        {$page.url.pathname === '/logbook' ? 'bg-navy-600 text-white' : 'text-navy-800 hover:bg-navy-50'}"
    >
      <Book class="w-4 h-4" />
      Logbook
    </a>
  </div>

  <div class="space-y-2">
    <h3 class="px-4 text-sm font-medium text-navy-400">Tags</h3>
    <div class="px-4">
      <QuickTags bind:selectedTags={$selectedTags} vertical={true} />
    </div>
  </div>
</nav>

<!-- TODO: add a version number here, preferably the one from Vercel  -->