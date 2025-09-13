# Web Deployment Configuration

This file contains configuration and instructions for deploying PuzzlePals to the web.

## Web Platform Configuration

The app is configured for web deployment using Expo Web with the following features:

### Current Web Support
- ✅ React Native Web for component rendering
- ✅ Expo Web for bundling and development
- ✅ Responsive design for mobile, tablet, and desktop
- ✅ Web-specific utilities and optimizations
- ✅ Progressive Web App (PWA) ready configuration

### Web-Specific Features
- **Responsive Design**: Adaptive layouts for different screen sizes
- **Touch and Mouse Support**: Optimized for both touch and cursor interactions
- **Web Performance**: Optimized animations and reduced motion support
- **Accessibility**: Web accessibility standards compliance
- **SEO Ready**: Meta tags and structured data support

## Quick Start - Web Development

```bash
# Start development server
npm run web

# Start with offline mode (no network requests)
npm run web:offline

# Build for production
npm run web:build

# Build and serve locally
npm run web:serve
```

## Deployment Options

### Option 1: Expo Web (Recommended)

The simplest approach using Expo's built-in web support:

```bash
# Build the web version
npm run web:build

# Deploy the 'dist' folder to any static hosting service
# - Netlify
# - Vercel  
# - GitHub Pages
# - Firebase Hosting
# - AWS S3 + CloudFront
```

### Option 2: Static Hosting Services

#### Netlify
1. Build: `npm run web:build`
2. Deploy `dist/` folder to Netlify
3. Set redirects for SPA routing in `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Vercel
1. Build: `npm run web:build`
2. Deploy `dist/` folder to Vercel
3. Configure in `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### GitHub Pages
1. Build: `npm run web:build`
2. Copy `dist/` contents to `gh-pages` branch
3. Enable GitHub Pages in repository settings

### Option 3: Hybrid Approach (Turborepo)

For larger projects wanting separate web and mobile codebases with shared components:

```
puzzlepals/
├── apps/
│   ├── mobile/          # Expo React Native app
│   └── web/             # Next.js web app
├── packages/
│   ├── ui/              # Shared UI components
│   ├── core/            # Shared business logic
│   └── types/           # Shared TypeScript types
└── turbo.json           # Turborepo configuration
```

## Web-Specific Optimizations

### Performance
- Lazy loading for images and components
- Code splitting for optimal bundle sizes
- Web Workers for heavy computations
- Service Worker for offline support

### Responsive Design
- Mobile-first responsive layouts
- Touch-friendly interactions on mobile web
- Mouse hover effects on desktop
- Keyboard navigation support

### Accessibility
- Screen reader support
- High contrast mode
- Reduced motion preferences
- Keyboard navigation
- Focus management

## Environment Configuration

### Development
```bash
# Local development with hot reload
npm run web

# Development with offline mode
npm run web:offline
```

### Production
```bash
# Build production bundle
npm run web:build

# Test production build locally
npm run web:serve
```

## Web-Specific Features

### Platform Detection
```typescript
import { isWeb, isMobileWeb, isDesktopWeb } from './src/utils/web';

if (isWeb()) {
  // Web-specific logic
}

if (isDesktopWeb()) {
  // Desktop web optimizations
}
```

### Responsive Styling
```typescript
import { getWebTheme, webStyles } from './src/theme/web';

const theme = getWebTheme();
const styles = {
  container: webStyles.container,
  card: webStyles.cardHover,
};
```

### Web Capabilities
```typescript
import { getWebCapabilities } from './src/utils/web';

const capabilities = getWebCapabilities();
if (capabilities.supportsTouch) {
  // Touch-specific features
}
```

## SEO and Meta Tags

The web build includes:
- Open Graph meta tags for social sharing
- Twitter Card support
- Structured data for search engines
- Favicon and app icons
- Web App Manifest for PWA features

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check React Native Web compatibility
   - Ensure all dependencies support web platform
   - Verify Expo SDK version compatibility

2. **Performance Issues**
   - Optimize images for web delivery
   - Enable code splitting
   - Use React.memo for expensive components

3. **Responsive Layout Issues**
   - Test on various screen sizes
   - Use web-specific utilities from `src/utils/web.ts`
   - Check CSS media queries

### Debug Commands
```bash
# Check for web compatibility issues
npx expo doctor

# Analyze bundle size
npx expo export --platform web --analyze

# Test production build locally
npm run web:serve
```

## Next Steps

1. **Basic Web Deployment**: Use Option 1 (Expo Web) for immediate deployment
2. **Advanced Setup**: Consider Option 3 (Turborepo) for complex projects
3. **PWA Features**: Add service worker and offline support
4. **Performance Optimization**: Implement code splitting and lazy loading
5. **Analytics**: Add web analytics for user behavior tracking

## Resources

- [Expo Web Documentation](https://docs.expo.dev/workflow/web/)
- [React Native Web Guide](https://necolas.github.io/react-native-web/)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Web Performance Best Practices](https://web.dev/performance/)