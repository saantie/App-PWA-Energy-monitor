# CLAUDE.md - Energy Monitor PWA

## Project Overview

**App-PWA-Energy-monitor** is a Progressive Web Application (PWA) for energy monitoring and solar analysis, designed for Thai-speaking users. This is a minimalist, zero-dependency PWA that wraps a Google Apps Script interface to provide a native app-like experience on mobile devices.

### Key Characteristics
- **Type**: Progressive Web Application (PWA)
- **Language**: Thai (Thailand)
- **Framework**: Vanilla JavaScript (no frameworks or libraries)
- **Architecture**: App Shell + iframe content model
- **Target Platform**: Mobile-first, installable web app
- **Backend**: Google Apps Script (external)

---

## Codebase Structure

```
/home/user/App-PWA-Energy-monitor/
├── .git/                    # Git repository
├── .gitignore              # Git ignore patterns
├── _headers                # HTTP headers for deployment (Netlify/CDN)
├── icons/                  # PWA icon assets
│   ├── icon-192.png       # 192x192 app icon
│   ├── icon-512.png       # 512x512 app icon
│   └── 00.png             # Placeholder file
├── index.html             # Main application entry point
├── manifest.json          # PWA manifest configuration
├── offline.html           # Offline fallback page
├── robots.txt             # SEO configuration
└── service-worker.js      # Service Worker for offline functionality
```

### File Count: 8 core files (no build system, no dependencies)

---

## Architecture & Design Patterns

### 1. App Shell Architecture
The application follows the **App Shell Model**:
- **Shell (PWA)**: Provides UI framework, offline capabilities, and installation features
- **Content (iframe)**: Google Apps Script delivers the actual application functionality
- **Separation**: Clear division between presentation layer and business logic

### 2. Caching Strategy (service-worker.js)

#### Cache Name: `energy-monitor-v2`

**Install Phase** (service-worker.js:13-23):
- Caches app shell assets: index.html, offline.html, manifest.json, icons
- Uses `skipWaiting()` to activate immediately

**Activate Phase** (service-worker.js:26-40):
- Removes old cache versions
- Uses `clients.claim()` to take control immediately

**Fetch Strategy** (service-worker.js:43-114):
1. **Google Apps Script requests** → Network-only with offline fallback
2. **Navigation requests** → Network-first, then cache, then offline.html
3. **Other resources** → Cache-first strategy

### 3. Progressive Enhancement
- Works as regular website without installation
- Enhanced with PWA features when supported
- Graceful offline degradation
- Mobile-first responsive design

---

## Core Files Explained

### index.html (116 lines)

**Primary responsibilities:**
1. **Loading Screen** (lines 56-59): Shows gradient splash with spinner
2. **Install Prompt** (lines 60-73): Custom PWA installation UI
3. **iframe Container** (lines 74-76): Embeds Google Apps Script
4. **Inline JavaScript** (lines 77-113): All application logic

**Key Features:**
- **Online/Offline Detection** (lines 82-84): Toast notifications with auto-reload
- **Pull-to-Refresh** (lines 86-94): Touch gesture with visual indicator
- **Service Worker Registration** (line 101): Registers SW on load
- **PWA Install Handler** (lines 104-112): Manages beforeinstallprompt event

**External Dependency:**
```
Google Apps Script URL: https://script.google.com/macros/s/AKfycbyiA_ifaXKxxC1o0lIUZh4EtJLAD_8kptWQNs_fWjs4um_DagwWiNGIrMat3p0HDytf/exec
```

### service-worker.js (115 lines)

**Cache Strategy Details:**

```javascript
// Google Apps Script: Network-only (lines 50-58)
if (event.request.url.includes('script.google.com')) {
  // Fetch from network, fallback to offline.html
}

// Navigation: Network-first (lines 61-76)
if (event.request.mode === 'navigate') {
  // Try network → cache → offline.html
}

// Other: Cache-first (lines 78-114)
// Try cache → network → store in cache
```

**Important Comments:**
- All comments in Thai language
- Service Worker logs prefixed with `[SW]`

### manifest.json (28 lines)

**PWA Configuration:**
- Display: `standalone` (full-screen, no browser UI)
- Orientation: `portrait-primary` (mobile-optimized)
- Theme: `#2196f3` (blue)
- Icons: 192x192 and 512x512 (maskable)
- Categories: utilities, productivity
- Language: Thai (`th`)

### offline.html (157 lines)

**Offline Experience:**
- Gradient background matching brand identity
- 📡 emoji icon with pulse animation
- Thai language messaging
- Auto-detects connectivity restoration (every 3 seconds)
- Auto-redirects when back online
- Retry button for manual refresh

### _headers (20 lines)

**Deployment Configuration:**
```
Global Headers:
- Cache-Control: public, max-age=0, must-revalidate
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

Specific Rules:
- service-worker.js: no-cache (always fresh)
- manifest.json: 1 hour cache
- icons/*: 1 year cache (immutable)
```

---

## Development Conventions

### 1. No Build System
- **Zero build tools** - no webpack, babel, npm, or package.json
- Files are deployed directly as-is
- All JavaScript is inline or in standalone files
- CSS is inline in HTML files

### 2. Code Style

**JavaScript:**
- Minified inline code in index.html (lines 78-113)
- Full-format code in service-worker.js
- Console logging with emoji prefixes:
  - ✅ Success
  - ❌ Error
  - 🟢 Online
  - 🔴 Offline
  - 📱 PWA events
  - `[SW]` Service Worker logs

**CSS:**
- Inline styles in `<style>` tags
- Mobile-first breakpoint at 480px
- CSS custom properties NOT used
- Animations: slideUp, slideDown, spin, fadeIn, pulse, blink

**HTML:**
- Semantic HTML5
- Thai language (`lang="th"`)
- iOS-specific meta tags for PWA support

### 3. Language Requirements

**All User-Facing Text:** Thai language
- UI labels and messages
- Install prompt text
- Offline messages
- Loading indicators

**Technical Content:** Can be English
- Console logs (mix of English and Thai)
- Code comments in Thai (service-worker.js)
- Variable names in English

### 4. Naming Conventions

**Files:**
- kebab-case: `service-worker.js`, `offline.html`
- No versioning in filenames (handled by cache names)

**Variables:**
- camelCase: `deferredPrompt`, `installBtn`, `wasOffline`
- Cache name: `CACHE_NAME` (uppercase constant)

**IDs:**
- camelCase: `#loading`, `#installPrompt`, `#mainFrame`

---

## Git Workflow

### Current Branch
```
Branch: claude/claude-md-mhze4aq7sx1toels-01Qir9uHSG1FwKY2DC3FAxE4
Status: Clean
```

### Recent Commits
```
9f27971 Rename index-modern.html to index.html
99d8d1d Add files via upload
1dda3ca Delete index.html
8ef2931 Update index.html
baa8da1 Update index.html
```

### Commit Conventions
- Descriptive messages
- Direct file operations mentioned
- No conventional commit format enforced

### Branch Requirements
- Always develop on branches starting with `claude/`
- Must push to designated branch with session ID
- Use `git push -u origin <branch-name>`
- Retry on network failures with exponential backoff

---

## Deployment Process

### Platform: Static File Hosting
Recommended platforms:
- Netlify (optimal - supports _headers file)
- Cloudflare Pages
- GitHub Pages (with headers plugin)
- Any CDN with custom header support

### Deployment Steps
1. **No build required** - files are production-ready
2. Push to git repository OR upload files directly
3. Configure custom headers from `_headers` file
4. Ensure HTTPS is enabled (required for Service Workers)
5. Service Worker activates on first user visit
6. App becomes installable when PWA criteria met

### Cache Versioning
When deploying updates:
1. Increment `CACHE_NAME` in service-worker.js (currently `v2`)
2. Old caches auto-deleted on activation
3. Users get updates on next visit

**Example:**
```javascript
// service-worker.js line 2
const CACHE_NAME = "energy-monitor-v3"; // Increment version
```

---

## Testing

### No Automated Testing
- No test framework
- No test files
- No CI/CD pipeline
- Testing is manual/browser-based

### Manual Testing Checklist
1. **PWA Installation**
   - Test install prompt appearance
   - Verify installation flow
   - Check standalone mode display
   - Test app icon on home screen

2. **Offline Functionality**
   - Disconnect network
   - Verify offline.html displays
   - Check service worker caching
   - Test auto-reconnect detection

3. **Pull-to-Refresh**
   - Scroll to top
   - Pull down gesture
   - Verify rotation animation
   - Confirm reload behavior

4. **Online/Offline Toasts**
   - Toggle network connection
   - Verify toast notifications
   - Check auto-reload on reconnect

5. **Google Apps Script**
   - Verify iframe loads
   - Test data fetching
   - Check error handling

6. **Responsive Design**
   - Test on mobile devices
   - Check tablet display
   - Verify desktop experience
   - Test iOS Safari specifically

### Testing URLs
- Local: `http://localhost:8000` (or any static server)
- PWA features require HTTPS in production

---

## Key Technical Details

### 1. Service Worker Lifecycle

**Registration** (index.html:101):
```javascript
navigator.serviceWorker.register('./service-worker.js')
```

**Update Mechanism:**
- Browser checks for SW updates every 24 hours
- Or when navigating to in-scope page
- `skipWaiting()` forces immediate activation
- `clients.claim()` takes control without refresh

### 2. PWA Installation Flow

**Event Flow:**
1. `beforeinstallprompt` fires → Capture event
2. Show custom install prompt
3. User clicks "ติดตั้งเลย" → Call `prompt()`
4. Browser shows native install dialog
5. `appinstalled` event fires on success

**Installation Criteria:**
- Served over HTTPS
- Has manifest.json with required fields
- Has service worker registered
- Has icons (192x192 minimum)
- User engagement signals met

### 3. Pull-to-Refresh Implementation

**Logic** (index.html:86-94):
```
1. touchstart → Capture startY (only if scrollY === 0)
2. touchmove → Calculate distance, show indicator
3. Distance >= 80px → Rotate icon 180°, show ↻
4. touchend → If >= 80px, trigger reload
5. Reset indicator position
```

**Visual States:**
- Hidden: top: -60px
- Visible: top: 0-20px
- Rotating: 0-180° based on pull distance
- Spinning: Full rotation animation on reload

### 4. iframe Integration

**Configuration** (index.html:75):
```html
<iframe
  id="mainFrame"
  src="https://script.google.com/macros/s/AKfycbyiA_ifaXKxxC1o0lIUZh4EtJLAD_8kptWQNs_fWjs4um_DagwWiNGIrMat3p0HDytf/exec"
  allow="accelerometer; gyroscope"
  loading="lazy">
</iframe>
```

**Security:**
- iframe allows accelerometer and gyroscope
- Google Apps Script URL is public (no authentication in PWA layer)
- SAMEORIGIN X-Frame-Options prevents embedding this PWA

---

## Security Considerations

### HTTP Headers (_headers file)
- **X-Content-Type-Options: nosniff** - Prevents MIME sniffing
- **X-Frame-Options: SAMEORIGIN** - Prevents clickjacking
- **X-XSS-Protection: 1; mode=block** - Enables XSS filter
- **Referrer-Policy: strict-origin-when-cross-origin** - Limits referrer data

### Known Security Notes
1. **Public Google Apps Script URL**: The script URL is hardcoded and public. Authentication must be handled within the Google Apps Script.
2. **No CORS restrictions**: Service worker bypasses CORS for cached resources.
3. **iframe permissions**: Accelerometer and gyroscope access granted to iframe content.
4. **No CSP headers**: Content Security Policy not implemented.

### Recommendations for Modifications
- Do NOT add sensitive data to the PWA shell
- Authentication should remain in Google Apps Script
- Consider adding CSP headers if hosting custom content
- Validate all user input in the Google Apps Script backend

---

## Common Modification Scenarios

### 1. Changing the Google Apps Script URL

**File:** index.html:75
```html
<iframe id="mainFrame" src="NEW_URL_HERE" ...>
```

**Impact:** None on PWA functionality, only changes content source

### 2. Updating App Theme Color

**Files to modify:**
- index.html:12 - `<meta name="theme-color" content="#2196f3">`
- index.html:16 - `<meta name="msapplication-TileColor" content="#2196f3">`
- manifest.json:11 - `"theme_color": "#2196f3"`

**Also consider updating:**
- Gradient colors in index.html:21 (loading screen)
- Gradient in offline.html:16 (offline page)
- Install prompt gradient in index.html:28

### 3. Adding New Cache Assets

**File:** service-worker.js:3-10

Add to `urlsToCache` array:
```javascript
const urlsToCache = [
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./new-asset.js"  // Add here
];
```

**Don't forget:** Increment CACHE_NAME version

### 4. Modifying Install Prompt Text

**File:** index.html:60-73

Update Thai text:
- Line 63: Title
- Line 66: Description
- Lines 68-70: Feature list
- Line 72: Button text

### 5. Changing App Name

**Files to update:**
- index.html:6 - `<title>`
- index.html:15 - `<meta name="apple-mobile-web-app-title">`
- manifest.json:2 - `"name"`
- manifest.json:3 - `"short_name"`

### 6. Updating Icons

**Steps:**
1. Replace icons/icon-192.png and icons/icon-512.png
2. Ensure sizes are exactly 192x192 and 512x512
3. PNG format required
4. Should be maskable-safe (important content in center 80%)
5. Update cache version in service-worker.js

---

## Performance Optimization

### Current Performance Characteristics
- **First Load**: ~1 second (loading screen minimum)
- **Cached Load**: Instant (from cache)
- **Google Apps Script**: Network dependent
- **Offline**: Immediate (cached app shell)

### Optimization Strategies Already Implemented
1. **Inline CSS/JS**: Reduces HTTP requests
2. **Cache-First for assets**: Fast repeat visits
3. **Lazy iframe loading**: `loading="lazy"` attribute
4. **Long-term icon caching**: 1 year (immutable)
5. **Service Worker skipWaiting**: No delay for updates
6. **Minified inline scripts**: Reduced HTML size

### Potential Optimizations
1. **Image optimization**: Compress icon PNG files
2. **Preconnect**: Add `<link rel="preconnect">` for Google Apps Script domain
3. **Resource hints**: Use `dns-prefetch` for external domains
4. **Inline critical CSS only**: Move animations to external file
5. **Add font-display**: If using web fonts (currently using system fonts)

---

## Browser Compatibility

### Supported Features
- Service Workers (Chrome 40+, Firefox 44+, Safari 11.1+)
- PWA Installation (Chrome 40+, Edge 79+, Samsung Internet)
- Touch Events (all modern mobile browsers)
- CSS Grid/Flexbox (all modern browsers)
- Async/Await (all modern browsers)

### Known Limitations
- **iOS Safari**: Limited PWA support (no background sync, limited notifications)
- **Firefox**: Install prompt behavior differs
- **Desktop**: Install supported but mobile-optimized experience
- **IE11**: Not supported (Service Workers unavailable)

### Fallback Behavior
- No Service Worker → App works but no offline functionality
- No Install Prompt → App still usable in browser
- No Touch → Pull-to-refresh doesn't work (desktop users)

---

## Troubleshooting Guide

### Service Worker Not Registering
1. Check HTTPS requirement (localhost exempt)
2. Verify service-worker.js path is correct
3. Check browser console for errors
4. Try hard refresh (Ctrl+Shift+R)
5. Unregister old SW in DevTools

### Install Prompt Not Showing
1. Check PWA installability criteria
2. Verify manifest.json is valid JSON
3. Ensure icons are accessible (192x192 minimum)
4. Check if already installed (won't show again)
5. May need user engagement (click/scroll)

### Offline Page Not Appearing
1. Verify service worker is active
2. Check offline.html is cached
3. Test actual offline mode (not throttling)
4. Clear cache and re-register SW

### Google Apps Script Not Loading
1. Check iframe src URL is correct
2. Verify network connectivity
3. Check Google Apps Script deployment status
4. Look for CORS errors in console
5. Ensure script is published (not in draft)

### Pull-to-Refresh Not Working
1. Ensure scrollY === 0 (must be at top)
2. Check touchstart/touchmove events fire
3. Verify indicator element is in DOM
4. Test on actual mobile device (not simulator)

---

## AI Assistant Guidelines

### When Working on This Codebase

1. **NO Build System**
   - Never suggest npm install, webpack, or build tools
   - Don't create package.json
   - Keep everything vanilla JavaScript
   - Maintain inline CSS/JS approach

2. **Preserve Language Requirements**
   - Keep all user-facing text in Thai
   - Maintain emoji prefixes in console logs
   - Don't translate existing Thai content
   - Code comments can remain in Thai

3. **Service Worker Changes**
   - ALWAYS increment CACHE_NAME version
   - Test cache invalidation thoroughly
   - Don't break offline functionality
   - Maintain network-only for Google Apps Script

4. **Maintain PWA Standards**
   - Keep manifest.json valid
   - Ensure icons meet requirements (192x192, 512x512)
   - Preserve HTTPS requirement
   - Don't break install prompt flow

5. **Mobile-First Approach**
   - Test responsive design changes
   - Maintain touch event handlers
   - Keep viewport meta tags intact
   - Preserve iOS-specific meta tags

6. **Security Awareness**
   - Don't add authentication to PWA shell
   - Maintain security headers
   - Be cautious with iframe permissions
   - Validate Google Apps Script URL changes

7. **Git Operations**
   - Always use branch starting with `claude/`
   - Push with `-u` flag: `git push -u origin <branch>`
   - Retry network failures with exponential backoff
   - Never force push to main/master

8. **Testing Requirements**
   - Manually test PWA installation
   - Verify offline functionality works
   - Check pull-to-refresh on mobile
   - Test network status detection
   - Validate Google Apps Script loading

9. **Code Style**
   - Maintain inline minified style for index.html JavaScript
   - Keep service-worker.js readable with comments
   - Preserve emoji logging convention
   - Don't add external dependencies

10. **Documentation Updates**
    - Update this CLAUDE.md when making structural changes
    - Document new features added
    - Keep deployment instructions current
    - Maintain troubleshooting guide

---

## External Dependencies

### Google Apps Script
**URL:** `https://script.google.com/macros/s/AKfycbyiA_ifaXKxxC1o0lIUZh4EtJLAD_8kptWQNs_fWjs4um_DagwWiNGIrMat3p0HDytf/exec`

**Relationship:** Content provider (embedded via iframe)

**Changes required if URL changes:**
1. Update index.html:75 iframe src
2. Test deployment thoroughly
3. Verify CORS/embedding permissions
4. No service worker changes needed

### Browser APIs Used
- Service Worker API
- Cache API
- Fetch API
- Touch Events API
- Online/Offline Events
- BeforeInstallPrompt Event
- Window.matchMedia (for standalone detection)

---

## File Change Impact Matrix

| File | Impact Level | Requires Cache Update | Affects Offline |
|------|--------------|----------------------|-----------------|
| index.html | High | Yes | Yes |
| service-worker.js | Critical | Yes (increment version) | Yes |
| manifest.json | Medium | Yes | No |
| offline.html | Low | Yes | Yes |
| _headers | Low | No | No |
| icons/* | Low | Yes | No |

**Cache Update Process:**
1. Modify file
2. Increment CACHE_NAME in service-worker.js
3. Deploy all files
4. Old cache auto-cleaned on next visit

---

## Project Metadata

**Created:** Based on git history, recent commits in 2024
**Current Version:** v2 (based on CACHE_NAME)
**Maintenance Status:** Active
**License:** Not specified in repository
**Target Users:** Thai-speaking energy monitoring users

---

## Additional Resources

### Testing Tools
- Lighthouse (PWA auditing)
- Chrome DevTools → Application tab (SW, Cache, Manifest)
- Firefox DevTools → Application → Manifest
- [PWA Builder](https://www.pwabuilder.com/) (validation)

### Documentation
- [MDN: Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [MDN: Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Google: PWA Checklist](https://web.dev/pwa-checklist/)
- [Can I Use: Service Workers](https://caniuse.com/serviceworkers)

### Deployment Platforms
- [Netlify](https://www.netlify.com/) - Recommended
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [GitHub Pages](https://pages.github.com/)
- [Vercel](https://vercel.com/)

---

## Summary

This PWA is a **minimalist, production-ready application** that demonstrates modern web capabilities without complex tooling. It's optimized for Thai-speaking users who need energy monitoring functionality, delivered through a native app-like experience.

**Key Strengths:**
- Zero dependencies
- Excellent offline support
- Fast, responsive mobile experience
- Easy to deploy and maintain
- Clear separation of concerns

**Ideal for:**
- Simple PWA wrappers
- Mobile-first applications
- Offline-capable web apps
- Projects requiring minimal maintenance overhead

**When modifying this codebase:**
- Respect the minimalist approach
- Maintain offline functionality
- Preserve Thai language UI
- Test thoroughly on mobile devices
- Keep the zero-dependency philosophy

---

*This documentation is maintained for AI assistants working with Claude Code.*
*Last Updated: 2025-11-14*
*CACHE_NAME Version: v2*
