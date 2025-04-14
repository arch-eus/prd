<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { Mic, MicOff, X } from 'lucide-svelte';

  export let placeholder = 'Say something...';
  export let showInput = false;

  const dispatch = createEventDispatcher();
  
  let recognition: any = null;
  let isListening = false;
  let transcript = '';
  let finalTranscript = '';
  let interimTranscript = '';
  let errorMessage = '';
  
  onMount(() => {
    setupSpeechRecognition();
  });
  
  onDestroy(() => {
    if (recognition && isListening) {
      recognition.stop();
    }
  });
  
  function setupSpeechRecognition() {
    try {
      // @ts-ignore - TypeScript doesn't know about webkitSpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event: any) => {
          interimTranscript = '';
          finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          
          transcript = finalTranscript + ' ' + interimTranscript;
          transcript = transcript.trim();
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          errorMessage = `Error: ${event.error}`;
          isListening = false;
        };
        
        recognition.onend = () => {
          isListening = false;
          
          // If we have a final transcript when recording ends, submit it
          if (finalTranscript) {
            submitTranscript();
          }
        };
      } else {
        errorMessage = 'Speech recognition not supported in this browser';
      }
    } catch (error) {
      console.error('Error setting up speech recognition:', error);
      errorMessage = 'Failed to initialize speech recognition';
    }
  }
  
  function toggleRecording() {
    if (!recognition) {
      setupSpeechRecognition();
      
      if (!recognition) {
        alert('Speech recognition is not supported in your browser');
        return;
      }
    }
    
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  }
  
  function startRecording() {
    try {
      transcript = '';
      finalTranscript = '';
      interimTranscript = '';
      errorMessage = '';
      recognition.start();
      isListening = true;
      showInput = true;
    } catch (e) {
      console.error('Error starting speech recognition:', e);
      errorMessage = 'Failed to start recording';
    }
  }
  
  function stopRecording() {
    if (recognition && isListening) {
      recognition.stop();
      isListening = false;
    }
  }
  
  function cancelRecording() {
    if (recognition && isListening) {
      recognition.stop();
    }
    isListening = false;
    transcript = '';
    finalTranscript = '';
    interimTranscript = '';
    showInput = false;
  }
  
  function submitTranscript() {
    const text = finalTranscript || transcript;
    if (text) {
      dispatch('input', { text });
      showInput = false;
      transcript = '';
      finalTranscript = '';
      interimTranscript = '';
    }
  }
</script>

<div class="relative">
  <button
    type="button"
    class="flex items-center justify-center w-10 h-10 rounded-full {isListening ? 'bg-red-100 text-red-700' : 'bg-navy-50 text-navy-600'} hover:bg-navy-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
    on:click={toggleRecording}
    aria-label={isListening ? "Stop recording" : "Start voice input"}
    title={isListening ? "Stop recording" : "Create task with voice input"}
  >
    {#if isListening}
      <MicOff class="w-5 h-5" />
    {:else}
      <Mic class="w-5 h-5" />
    {/if}
  </button>
  
  {#if showInput}
    <div
      class="absolute z-10 top-12 right-0 w-80 bg-white rounded-lg shadow-lg p-4 border border-gray-200"
      transition:fade={{ duration: 150 }}
    >
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-medium text-gray-700">
          {isListening ? 'Listening...' : 'Voice Input'}
        </h3>
        <button
          type="button"
          class="text-gray-400 hover:text-gray-600"
          on:click={cancelRecording}
          aria-label="Close"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
      
      <div 
        class="bg-gray-50 border border-gray-200 rounded p-2 min-h-16 text-gray-700 mb-3 text-sm"
      >
        {#if transcript}
          <p>{transcript}</p>
        {:else}
          <p class="text-gray-400">{placeholder}</p>
        {/if}
        
        {#if errorMessage}
          <p class="text-red-500 text-xs mt-1">{errorMessage}</p>
        {/if}
      </div>
      
      <div class="flex justify-end gap-2">
        <button
          type="button"
          class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          on:click={cancelRecording}
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-3 py-1 text-sm bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
          on:click={submitTranscript}
          disabled={!transcript}
        >
          Add Task
        </button>
      </div>
    </div>
  {/if}
</div>