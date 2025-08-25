/**
 * PROJECTDES AI ACADEMY - SERVICE WORKER
 * Performance optimization and offline capability
 * Version: 1.0.0
 */

const CACHE_NAME = 'projectdes-academy-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/programs.html',
  '/about.html',
  '/contacts.html',
  '/css/styles.css',
  '/css/responsive.css',
  '/css/animations.css',
  '/js/main.js',
  '/js/language-switcher.js',
  '/js/forms.js',
  '/js/integrations.js',
  '/locales/ru.json',
  '/locales/he.json',
  '/assets/icons/logo.svg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Open+Sans:wght@400;600&display=swap'
];

// Assets to cache dynamically
const DYNAMIC_ASSETS = [
  '/assets/images/',
  '/assets/icons/',
  'https://cdn.jsdelivr.net/',
  'https://js.stripe.com/',
  'https://www.paypal.com/'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
  
  // Force activation
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
  
  // Take control of all clients
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external APIs (except fonts and CDNs)
  if (url.origin !== location.origin && !isDynamicAsset(request.url)) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          // Update cache in background for dynamic assets
          if (isDynamicAsset(request.url)) {
            updateCache(request);
          }
          return cachedResponse;
        }
        
        // Fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache error responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone response for caching
            const responseToCache = response.clone();
            
            // Cache dynamic assets
            if (isDynamicAsset(request.url) || isStaticAsset(request.url)) {
              const cacheName = isStaticAsset(request.url) ? STATIC_CACHE : DYNAMIC_CACHE;
              
              caches.open(cacheName)
                .then((cache) => {
                  cache.put(request, responseToCache);
                })
                .catch((error) => {
                  console.error('[SW] Failed to cache response:', error);
                });
            }
            
            return response;
          })
          .catch((error) => {
            console.error('[SW] Fetch failed:', error);
            
            // Return offline fallback for HTML pages
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
            
            throw error;
          });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      syncFormData()
    );
  }
});

// Push notifications (if needed)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: data.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // Focus existing window if available
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Message handler for cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    event.waitUntil(
      updateAllCaches()
    );
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    getCacheStatus()
      .then((status) => {
        event.ports[0].postMessage(status);
      });
  }
});

// Helper functions
function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.includes(asset));
}

function isDynamicAsset(url) {
  return DYNAMIC_ASSETS.some(asset => url.includes(asset));
}

function updateCache(request) {
  fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        caches.open(DYNAMIC_CACHE)
          .then((cache) => {
            cache.put(request, response);
          });
      }
    })
    .catch((error) => {
      console.error('[SW] Background cache update failed:', error);
    });
}

async function updateAllCaches() {
  try {
    const staticCache = await caches.open(STATIC_CACHE);
    const dynamicCache = await caches.open(DYNAMIC_CACHE);
    
    // Update static assets
    await Promise.allSettled(
      STATIC_ASSETS.map(async (asset) => {
        try {
          const response = await fetch(asset);
          if (response.status === 200) {
            await staticCache.put(asset, response);
          }
        } catch (error) {
          console.error(`[SW] Failed to update ${asset}:`, error);
        }
      })
    );
    
    console.log('[SW] Cache update completed');
  } catch (error) {
    console.error('[SW] Cache update failed:', error);
  }
}

async function syncFormData() {
  try {
    // Get stored form data from IndexedDB
    const formData = await getStoredFormData();
    
    if (formData.length > 0) {
      for (const data of formData) {
        try {
          const response = await fetch(data.endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data.data)
          });
          
          if (response.ok) {
            // Remove successfully synced data
            await removeStoredFormData(data.id);
          }
        } catch (error) {
          console.error('[SW] Form sync failed:', error);
        }
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

async function getCacheStatus() {
  try {
    const cacheNames = await caches.keys();
    const staticCache = await caches.open(STATIC_CACHE);
    const dynamicCache = await caches.open(DYNAMIC_CACHE);
    
    const staticKeys = await staticCache.keys();
    const dynamicKeys = await dynamicCache.keys();
    
    return {
      caches: cacheNames,
      staticAssets: staticKeys.length,
      dynamicAssets: dynamicKeys.length,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('[SW] Failed to get cache status:', error);
    return null;
  }
}

// Placeholder functions for IndexedDB operations
async function getStoredFormData() {
  // In a real implementation, this would use IndexedDB
  return [];
}

async function removeStoredFormData(id) {
  // In a real implementation, this would remove data from IndexedDB
  console.log('[SW] Removing stored form data:', id);
}