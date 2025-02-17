<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Menu, Plus, Mic } from 'lucide-svelte';
  import SearchBar from '../search/SearchBar.svelte';
  
  export let searchInput: HTMLInputElement | null = null;
  let isListening = false;
  let recognition: SpeechRecognition | null = null;

  const dispatch = createEventDispatcher();
  
  function startSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser');
      return;
    }
    
    if (!recognition) {
      recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        dispatch('newTask', { title: text });
        isListening = false;
      };
      
      recognition.onerror = () => {
        isListening = false;
      };
      
      recognition.onend = () => {
        isListening = false;
      };
    }
    
    isListening = true;
    recognition.start();
  }
</script>

<header class="fixed inset-x-0 top-0 h-16 bg-surface border-b border-navy-100 z-30">
  <div class="h-full px-4 flex items-center justify-between gap-4">
    <div class="flex items-center gap-4">
      <button
        class="lg:hidden p-2 hover:bg-navy-50 rounded-md"
        on:click={() => dispatch('toggleSidebar')}
      >
        <Menu class="w-5 h-5" />
      </button>
    </div>

    <div class="flex-1 max-w-xl">
      <SearchBar bind:searchInput />
    </div>

    <div class="flex items-center gap-2">
      <button
        class="p-2 hover:bg-navy-50 rounded-md relative {isListening ? 'text-teal-600' : ''}"
        on:click={startSpeechRecognition}
        title="Add task by voice"
      >
        <Mic class="w-5 h-5" />
        {#if isListening}
          <span class="absolute top-0 right-0 w-2 h-2 bg-teal-500 rounded-full" />
        {/if}
        }
      </button>
      
      <button
        class="p-2 hover:bg-navy-50 rounded-md"
        on:click={() => dispatch('newTask')}
        title="Add new task"
      >
        <Plus class="w-5 h-5" />
      </button>
    </div>
  </div>
</header>