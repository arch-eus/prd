<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  
  // Create stores
  const deferredPrompt = writable<any>(null);
  const showInstallBanner = writable(false);
  
  onMount(() => {
    // Check if already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      // Already installed, don't show banner
      return;
    }
    
    // Handle the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event so it can be triggered later
      deferredPrompt.set(e);
      // Show the install banner
      showInstallBanner.set(true);
    });
    
    // Hide banner when app is installed
    window.addEventListener('appinstalled', () => {
      showInstallBanner.set(false);
      deferredPrompt.set(null);
      console.log('PWA was installed');
    });
  });
  
  // Function to install the app
  async function installApp() {
    const promptEvent = $deferredPrompt;
    if (!promptEvent) {
      return;
    }
    
    // Show the install prompt
    promptEvent.prompt();
    
    // Wait for the user to respond to the prompt
    const userChoice = await promptEvent.userChoice;
    
    // Reset the deferred prompt variable
    deferredPrompt.set(null);
    showInstallBanner.set(false);
    
    console.log('User response to the install prompt:', userChoice.outcome);
  }
  
  // Function to dismiss the banner
  function dismissBanner() {
    showInstallBanner.set(false);
    // Remember the user's choice in localStorage
    localStorage.setItem('pwa-install-dismissed', 'true');
  }
</script>

{#if $showInstallBanner}
<div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex items-center justify-between shadow-lg z-50">
  <div>
    <h3 class="font-semibold">Install Task Manager</h3>
    <p class="text-sm text-gray-600">Add to your home screen for offline use</p>
  </div>
  <div class="flex space-x-2">
    <button 
      class="px-3 py-1 text-sm bg-gray-200 rounded-md"
      on:click={dismissBanner}
    >
      Not Now
    </button>
    <button 
      class="px-3 py-1 text-sm bg-navy-600 text-white rounded-md"
      on:click={installApp}
    >
      Install
    </button>
  </div>
</div>
{/if}