<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  // Create stores for PWA status
  const updateAvailable = writable(false);
  const offlineReady = writable(false);
  const installedPWA = writable(false);
  const registration = writable<ServiceWorkerRegistration | null>(null);
  
  let wb: any = null;

  onMount(async () => {
    try {
      if ('serviceWorker' in navigator) {
        try {
          // Import workbox-window dynamically
          const { Workbox } = await import('workbox-window');
          
          // Create Workbox instance
          wb = new Workbox('/sw.js');
          
          // Track registration
          wb.register()
            .then((reg: ServiceWorkerRegistration) => {
              console.log('Service worker registered successfully');
              registration.set(reg);
            })
            .catch((error: Error) => {
              console.error('Service worker registration failed:', error);
            });
          
          // Listen for update events
          wb.addEventListener('installed', (event: any) => {
            console.log('Service worker installed');
            if (event.isUpdate) {
              console.log('New content is available, please refresh.');
              updateAvailable.set(true);
            } else {
              console.log('App is ready for offline use.');
              offlineReady.set(true);
            }
          });
          
          wb.addEventListener('controlling', () => {
            window.location.reload();
          });
        } catch (error) {
          console.error('Error initializing workbox:', error);
        }
        
        // Check if app was installed
        window.addEventListener('appinstalled', () => {
          installedPWA.set(true);
        });
        
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
          installedPWA.set(true);
        }
      }
    } catch (err) {
      console.error('Error in PWA handler:', err);
    }
  });
  
  function updateServiceWorker() {
    if (wb) {
      try {
        wb.messageSkipWaiting();
      } catch (error) {
        console.error('Failed to update service worker:', error);
      }
    }
  }
</script>

{#if $updateAvailable}
  <div class="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
    <p>New version available!</p>
    <button 
      class="mt-2 px-4 py-1 bg-white text-blue-500 rounded-md"
      on:click={updateServiceWorker}
    >
      Update Now
    </button>
  </div>
{/if}

{#if $offlineReady}
  <div class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50" role="alert">
    <p>App ready for offline use!</p>
  </div>
{/if}