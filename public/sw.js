/**
 * Healthcare Service Worker
 * Provides offline capabilities and performance optimization for HealthTriage AI platform
 */

const CACHE_VERSION = 'healthcare-v2.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGES_CACHE = `${CACHE_VERSION}-images`;

// Essential healthcare resources to cache for offline access
const ESSENTIAL_RESOURCES = [
  '/',
  '/triage',
  '/emergency',
  '/offline',
  '/manifest.json',
  '/favicon.svg',
  '/favicon.ico',
  // Critical CSS and JS will be added automatically by Next.js
];

// Healthcare-specific resources that should be available offline
const HEALTHCARE_ROUTES = [
  '/triage',
  '/emergency',
  '/vital-signs', 
  '/emergency-contacts',
  '/first-aid'
];

// Resources that should never be cached (sensitive healthcare data)
const NEVER_CACHE = [
  '/api/auth',
  '/api/patient-data',
  '/api/medical-records',
  '/api/hipaa-logs',
  '/api/emergency-calls'
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('[Healthcare SW] Installing service worker');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[Healthcare SW] Caching essential healthcare resources');
      return cache.addAll(ESSENTIAL_RESOURCES);
    }).catch((error) => {
      console.error('[Healthcare SW] Failed to cache essential resources:', error);
    })
  );
  
  // Skip waiting to activate immediately for healthcare emergencies
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Healthcare SW] Activating service worker');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.includes('healthcare-') && cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && cacheName !== IMAGES_CACHE) {
              console.log('[Healthcare SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients immediately for emergency features
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip caching for sensitive healthcare data
  if (NEVER_CACHE.some(path => url.pathname.startsWith(path))) {
    return fetch(request);
  }

  // Handle different types of requests
  if (request.method === 'GET') {
    // Emergency routes - Cache First (for offline access)
    if (url.pathname === '/emergency' || url.pathname.startsWith('/emergency/')) {
      event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    }
    // Static assets (CSS, JS, images) - Cache First
    else if (request.destination === 'style' || 
             request.destination === 'script' || 
             request.destination === 'font') {
      event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    }
    // Images - Cache First with separate cache
    else if (request.destination === 'image') {
      event.respondWith(cacheFirstStrategy(request, IMAGES_CACHE));
    }
    // Healthcare pages - Network First (for updated content)
    else if (HEALTHCARE_ROUTES.some(route => url.pathname.startsWith(route))) {
      event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
    }
    // API calls - Network Only (for real-time healthcare data)
    else if (url.pathname.startsWith('/api/')) {
      event.respondWith(networkOnlyStrategy(request));
    }
    // Other pages - Network First
    else {
      event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
    }
  }
});

// Cache First Strategy (for essential offline resources)
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Update cache in background for next time
      fetch(request).then(response => {
        if (response.status === 200) {
          cache.put(request, response.clone());
        }
      }).catch(() => {
        // Ignore network errors when updating cache
      });
      return cachedResponse;
    }
    
    // If not in cache, fetch and cache
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
    
  } catch (error) {
    console.error('[Healthcare SW] Cache First strategy failed:', error);
    
    // For essential healthcare routes, return offline page
    if (request.destination === 'document') {
      const cache = await caches.open(STATIC_CACHE);
      return cache.match('/offline') || new Response(
        '<h1>Healthcare Platform Offline</h1><p>For emergencies, call 911</p>',
        { headers: { 'Content-Type': 'text/html' } }
      );
    }
    
    throw error;
  }
}

// Network First Strategy (for dynamic healthcare content)
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    
    return response;
    
  } catch (error) {
    console.log('[Healthcare SW] Network failed, trying cache:', request.url);
    
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // For healthcare pages, return offline page with emergency info
    if (request.destination === 'document') {
      const offlineCache = await caches.open(STATIC_CACHE);
      return offlineCache.match('/offline') || new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>HealthTriage AI - Offline</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { 
                font-family: system-ui, -apple-system, sans-serif;
                max-width: 600px; margin: 2rem auto; padding: 1rem;
                text-align: center; color: #1f2937;
              }
              .emergency { 
                background: #fef2f2; border: 2px solid #fca5a5;
                border-radius: 12px; padding: 1.5rem; margin: 2rem 0;
              }
              .emergency h2 { color: #dc2626; margin: 0 0 1rem 0; }
              .phone { font-size: 2rem; font-weight: bold; color: #dc2626; }
            </style>
          </head>
          <body>
            <h1>🏥 HealthTriage AI</h1>
            <h2>You're currently offline</h2>
            <p>Some healthcare features are available offline, but for real-time medical assistance, please reconnect to the internet.</p>
            
            <div class="emergency">
              <h2>🚨 Medical Emergency?</h2>
              <p>For immediate medical emergencies:</p>
              <div class="phone">Call 911</div>
              <p>Or contact your local emergency services</p>
            </div>
            
            <p><strong>Available offline:</strong></p>
            <ul style="text-align: left; display: inline-block;">
              <li>Emergency contact information</li>
              <li>Basic first aid guidance</li>
              <li>Medication reminders</li>
              <li>Previously viewed health information</li>
            </ul>
            
            <p style="margin-top: 2rem;">
              <button onclick="window.location.reload()" 
                      style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer;">
                🔄 Try Again
              </button>
            </p>
          </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html' } });
    }
    
    throw error;
  }
}

// Network Only Strategy (for sensitive healthcare data)
async function networkOnlyStrategy(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.error('[Healthcare SW] Network only request failed:', error);
    return new Response(JSON.stringify({
      error: 'Healthcare service temporarily unavailable',
      message: 'For medical emergencies, call 911',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Background sync for healthcare data
self.addEventListener('sync', (event) => {
  console.log('[Healthcare SW] Background sync:', event.tag);
  
  if (event.tag === 'healthcare-data-sync') {
    event.waitUntil(syncHealthcareData());
  }
});

// Sync healthcare data when connection is restored
async function syncHealthcareData() {
  try {
    // Sync any pending healthcare data
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_HEALTHCARE_DATA',
        message: 'Syncing healthcare data...'
      });
    });
  } catch (error) {
    console.error('[Healthcare SW] Healthcare data sync failed:', error);
  }
}

// Push notifications for healthcare alerts
self.addEventListener('push', (event) => {
  console.log('[Healthcare SW] Push notification received');
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Healthcare notification',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: data.tag || 'healthcare-notification',
      requireInteraction: data.urgent || false,
      actions: data.actions || [
        { action: 'view', title: 'View' },
        { action: 'dismiss', title: 'Dismiss' }
      ],
      data: data
    };
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'HealthTriage AI',
        options
      )
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[Healthcare SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'view') {
    const url = event.notification.data?.url || '/';
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('[Healthcare SW] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(clearAllCaches());
  }
});

// Clear all caches (for development/testing)
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
  console.log('[Healthcare SW] All caches cleared');
}

console.log('[Healthcare SW] Service Worker loaded successfully');
console.log('[Healthcare SW] Cache version:', CACHE_VERSION);
console.log('[Healthcare SW] Essential resources cached:', ESSENTIAL_RESOURCES.length);
console.log('[Healthcare SW] Healthcare routes configured:', HEALTHCARE_ROUTES.length);