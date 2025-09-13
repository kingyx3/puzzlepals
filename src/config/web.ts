// Web-specific configuration for PuzzlePals

export const webConfig = {
  // App metadata for web
  app: {
    name: 'PuzzlePals',
    description: 'A delightful jigsaw puzzle game for kids',
    shortName: 'PuzzlePals',
    startUrl: '/',
    display: 'standalone',
    orientation: 'portrait',
    backgroundColor: '#FFFDF7',
    themeColor: '#6B9EFF',
  },

  // PWA configuration
  pwa: {
    enabled: true,
    workbox: {
      // Cache strategies for different content types
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
        {
          urlPattern: /^https:\/\/.*\.(?:js|css)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-resources',
          },
        },
      ],
    },
  },

  // Analytics configuration
  analytics: {
    // Add analytics provider configuration here
    enabled: false, // Set to true when analytics is configured
  },

  // Performance monitoring
  performance: {
    enableMetrics: true,
    enableVitals: true,
  },

  // Feature flags for web
  features: {
    enableServiceWorker: true,
    enablePushNotifications: false, // Not typically needed for a puzzle game
    enableOfflineMode: true,
    enableWebShare: true, // For sharing completed puzzles
  },

  // Social sharing configuration
  sharing: {
    facebook: {
      appId: '', // Add Facebook App ID if needed
    },
    twitter: {
      site: '@puzzlepals', // Add Twitter handle if available
    },
  },

  // SEO configuration
  seo: {
    keywords: [
      'jigsaw puzzle',
      'kids games',
      'educational games',
      'puzzle game',
      'children',
      'family games',
      'learning',
    ],
    robots: 'index,follow',
    author: 'PuzzlePals Team',
  },
};

export default webConfig;