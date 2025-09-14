# PuzzlePals Vercel Deployment Guide

This guide covers deploying the PuzzlePals React Native Expo web app to Vercel for fast, global distribution.

## 🚀 Quick Start

### Prerequisites

- **Vercel Account**: [Sign up at vercel.com](https://vercel.com)
- **Node.js 20+**: Required for building the app
- **Git**: For version control and deployment

### Automated Deployment (Recommended)

The simplest way to deploy PuzzlePals to Vercel:

1. **Fork/Clone** this repository
2. **Connect to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

3. **Configure Build Settings** (auto-detected from `vercel.json`):
   - **Framework Preset**: Other
   - **Build Command**: `npm run web:build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Deploy**: Click "Deploy" and your app will be live in minutes!

## 🛠️ Manual Setup

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy from Project Root

```bash
# Navigate to project directory
cd /path/to/puzzlepals

# Deploy to preview environment
vercel

# Deploy to production
vercel --prod
```

## ⚙️ Configuration

### vercel.json Configuration

The project includes a pre-configured `vercel.json` file optimized for Expo web apps:

```json
{
  "version": 2,
  "name": "puzzlepals",
  "buildCommand": "npm run web:build",
  "outputDirectory": "dist",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Build Scripts

The following npm scripts are available for Vercel deployment:

```bash
# Build for production
npm run web:build

# Local development with Vercel
npm run vercel:dev

# Build specifically for Vercel
npm run vercel:build

# Deploy to production
npm run vercel:deploy
```

## 🔄 CI/CD with GitHub Actions

### Automated Deployment

The repository includes GitHub Actions workflow (`.github/workflows/deploy-web.yml`) that automatically deploys to Vercel when code is pushed to the main branch.

### Required Secrets

Add these secrets to your GitHub repository settings:

1. **VERCEL_TOKEN**: Your Vercel account token
   - Get from: [Vercel Account Settings > Tokens](https://vercel.com/account/tokens)

2. **VERCEL_ORG_ID**: Your Vercel organization ID
   - Get from: `vercel --debug` or [Vercel Team Settings](https://vercel.com/teams)

3. **VERCEL_PROJECT_ID**: Your project ID
   - Get from: Project Settings in Vercel dashboard

### Setting Up Secrets

```bash
# Get your organization ID and project ID
vercel --debug

# Output will show:
# Vercel CLI [version]
# > ORG_ID: team_xxxxxxxxxxxxx
# > PROJECT_ID: prj_xxxxxxxxxxxxx
```

## 🌐 Custom Domains

### Adding a Custom Domain

1. **In Vercel Dashboard**:
   - Go to your project
   - Navigate to "Settings" > "Domains"
   - Add your custom domain

2. **DNS Configuration**:
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or use Vercel's nameservers for full DNS management

### Example DNS Setup

For domain `puzzlepals.com`:

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

For subdomain `app.puzzlepals.com`:

```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

## 📊 Performance Optimization

### Built-in Optimizations

Vercel automatically provides:

- **Global CDN**: Fast content delivery worldwide
- **Image Optimization**: Automatic WebP/AVIF conversion
- **Brotli Compression**: Smaller bundle sizes
- **HTTP/2 & HTTP/3**: Modern protocol support
- **Edge Functions**: Server-side logic at the edge

### Bundle Analysis

Monitor your app's performance:

```bash
# Analyze bundle size
npm run web:build
npx expo export --dump-assetmap

# Check build output
ls -la dist/
```

### Cache Configuration

The `vercel.json` includes optimized caching:

- **Static assets**: 1 year cache with immutable header
- **HTML files**: No cache for dynamic content
- **Security headers**: XSS protection, content type sniffing prevention

## 🔒 Environment Variables

### Setting Environment Variables

1. **In Vercel Dashboard**:
   - Go to Project Settings > Environment Variables
   - Add variables for different environments

2. **Via CLI**:
   ```bash
   vercel env add EXPO_PUBLIC_API_URL production
   ```

3. **In Code**:
   ```javascript
   // Access environment variables
   const apiUrl = process.env.EXPO_PUBLIC_API_URL;
   ```

### Common Environment Variables

```bash
# API Configuration
EXPO_PUBLIC_API_URL=https://api.puzzlepals.com

# Analytics
EXPO_PUBLIC_ANALYTICS_ID=your-analytics-id

# Feature Flags
EXPO_PUBLIC_ENABLE_BETA_FEATURES=false
```

## 🐛 Troubleshooting

### Common Issues

#### Build Failures

**Issue**: Build fails with dependency errors

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for incompatible dependencies
npx expo doctor
```

#### Routing Issues

**Issue**: Direct URLs return 404

**Solution**: Ensure `vercel.json` includes SPA routing:
```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### Performance Issues

**Issue**: Slow loading times

**Solutions**:
- Enable Vercel's image optimization
- Use dynamic imports for code splitting
- Optimize bundle size with tree shaking

### Debug Commands

```bash
# Check build locally
npm run web:build
npx serve dist

# Debug Vercel deployment
vercel --debug

# Check deployment logs
vercel logs [deployment-url]
```

## 📈 Monitoring & Analytics

### Vercel Analytics

Enable built-in analytics:

1. Go to your project dashboard
2. Navigate to "Analytics" tab
3. Enable "Vercel Analytics"

### Custom Analytics

Integrate third-party analytics:

```javascript
// src/utils/analytics.ts
import { Analytics } from '@vercel/analytics/react';

export function AnalyticsProvider({ children }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
```

## 🚀 Deployment Strategies

### Preview Deployments

Every push to a branch creates a preview deployment:

- **Automatic URL**: `puzzlepals-git-[branch]-[username].vercel.app`
- **PR Integration**: Automatic comments with preview links
- **Testing**: Safe environment for testing changes

### Production Deployments

Production deployments happen when:

- Code is pushed to `main` branch
- Manual deployment via `vercel --prod`
- GitHub Actions workflow completes

### Rollback Strategy

Quickly rollback if issues arise:

```bash
# List deployments
vercel list

# Promote previous deployment
vercel promote [deployment-url]
```

## 🎯 Optimizations for PuzzlePals

### Expo Web Optimizations

The configuration is specifically optimized for Expo web apps:

- **Static Export**: Pre-built HTML/CSS/JS files
- **Asset Optimization**: Automatic image and font optimization
- **Service Worker**: Offline support and caching
- **Progressive Web App**: Install-able on mobile devices

### Game-Specific Optimizations

For the puzzle game functionality:

- **Asset Preloading**: Puzzle images cached aggressively
- **Gesture Handling**: Optimized touch/mouse interactions
- **Animation Performance**: Hardware-accelerated animations
- **Memory Management**: Efficient puzzle piece handling

## 📱 Mobile Optimization

### Progressive Web App

The app automatically works as a PWA:

- **Install Prompt**: Native app-like installation
- **Offline Support**: Basic functionality without internet
- **App Icons**: Native home screen icons
- **Splash Screen**: Custom loading experience

### Touch Optimization

Optimized for mobile browsers:

- **Touch Targets**: Large, finger-friendly puzzle pieces
- **Gesture Support**: Pinch-to-zoom, drag-and-drop
- **Viewport Handling**: Proper mobile viewport configuration
- **Performance**: 60fps animations on mobile devices

## 🔗 Useful Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Expo Web Guide**: [docs.expo.dev/workflow/web](https://docs.expo.dev/workflow/web/)
- **Performance Best Practices**: [web.dev/vitals](https://web.dev/vitals/)
- **PWA Guide**: [web.dev/progressive-web-apps](https://web.dev/progressive-web-apps/)

## 🆘 Support

If you encounter issues:

1. **Check Logs**: Use `vercel logs` for deployment errors
2. **Community**: [Vercel Community](https://github.com/vercel/vercel/discussions)
3. **Expo Forums**: [expo.dev/community](https://expo.dev/community)
4. **GitHub Issues**: Report bugs in this repository

---

**Happy Deploying! 🧩✨**

Your PuzzlePals app will be live on Vercel with global CDN, automatic HTTPS, and lightning-fast performance!