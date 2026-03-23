# Docsify Modular Architecture Implementation Plan

## Overview
Transform the current `docsify.html` into a modular, zero-build architecture with three core files:
1. **Shell** (`docsify.html`) - Minimal HTML entry point
2. **Manifest** (`docsify.plugins.js`) - Configuration data module
3. **Engine** (`docsify.loader.js`) - Logic module for theme detection and plugin loading

## User Decisions
- ✅ Use Prism autoloader (loads languages on demand)
- ✅ Use existing docs/ directory structure for navigation
- ✅ Replace docsify.config.js entirely with plugins.js (cleaner architecture)

## Current State Analysis
- **docsify.html**: Simple HTML with hardcoded theme and docsify core
- **docsify.config.js**: Basic docsify configuration
- **_sidebar.md**: Empty file

## Implementation Steps

### Step 1: Create `plugins.js` (Manifest)
Central configuration database with three exports:

#### 1.1 docsConfig Object
```javascript
export const docsConfig = {
  name: 'Scheme Mixer',
  repo: 'https://github.com/closetgeekshow/scheme-mixer',
  loadSidebar: true,
  subMaxLevel: 3,
  auto2top: true,
  search: 'auto',
  copyCode: {
    buttonText: 'Copy to clipboard',
    errorText: 'Error',
    successText: 'Copied!'
  }
};
```

#### 1.2 themes Object
```javascript
export const themes = {
  light: 'https://cdn.jsdelivr.net/npm/docsify-themeable@0/dist/css/theme-simple.css',
  dark: 'https://cdn.jsdelivr.net/npm/docsify-themeable@0/dist/css/theme-simple-dark.css'
};
```

#### 1.3 pluginUrls Array (Order Critical)
**Core:**
- https://cdn.jsdelivr.net/npm/docsify@4

**Official Plugins:**
- https://cdn.jsdelivr.net/npm/docsify/lib/plugins/search.min.js
- https://cdn.jsdelivr.net/npm/docsify/lib/plugins/zoom-image.min.js

**Third-Party Docsify Plugins:**
- https://cdn.jsdelivr.net/npm/docsify-copy-code/dist/docsify-copy-code.min.js
- https://cdn.jsdelivr.net/npm/docsify-mermaid-zoom/dist/docsify-mermaid-zoom.min.js
- https://cdn.jsdelivr.net/npm/docsify-sidebar-collapse/dist/docsify-sidebar-collapse.min.js
- https://cdn.jsdelivr.net/npm/docsify-wikilink/dist/docsify-wikilink.min.js
- https://cdn.jsdelivr.net/npm/docsify-dark-switcher/dist/docsify-dark-switcher.min.js
- https://cdn.jsdelivr.net/npm/drawcsify/dist/drawcsify.min.js

**Prism.js Core:**
- https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-core.min.js
- https://cdn.jsdelivr.net/npm/prismjs@1/plugins/autoloader/prism-autoloader.min.js

**Prism Languages (loaded on demand by autoloader):**
- bash, javascript, python, typescript, docker, plant-uml, jsdoc, json, yaml

### Step 2: Create `docsify.loader.js` (Engine)
Logic module that:
1. Imports configuration from plugins.js
2. Sets window.$docsify = docsConfig
3. Detects system theme preference (prefers-color-scheme)
4. Injects appropriate theme CSS link tag
5. Sequentially loads all plugins via script tags with async=false

### Step 3: Modify `docsify.html` (Shell)
Minimal HTML with:
- Standard meta tags
- #app div
- Script tag loading docsify.loader.js as ES Module (type="module")
- NO hardcoded theme links or scripts

### Step 4: Update `_sidebar.md`
Add navigation structure based on existing docs/ directory:
- Home
- Architecture
- Extending
- Conventions
- Diagrams
- Schemas
- Token Map
- Prop Sets
- Layer Stack
- Component Contract
- Extend (submenu with 7 files)

## CDN URL Verification Required
Need to verify the following plugin CDN URLs exist:
- [ ] docsify-mermaid-zoom
- [ ] docsify-sidebar-collapse
- [ ] docsify-wikilink
- [ ] docsify-dark-switcher
- [ ] drawcsify

## Files to Delete
- `docsify.config.js` (replaced by plugins.js)

## Testing Requirements
- Test light/dark theme switching
- Test all plugins load correctly
- Test syntax highlighting for all specified languages
- Test mermaid diagram rendering and zoom
- Test copy code functionality
- Test sidebar collapse
- Test wikilink functionality
- Test dark mode switcher
- Test draw.io integration

## Files to Create/Modify
1. **CREATE**: `plugins.js`
2. **CREATE**: `docsify.loader.js`
3. **MODIFY**: `docsify.html`
4. **MODIFY**: `_sidebar.md`

## Dependencies
- docsify-themeable for light/dark themes
- All plugins loaded via CDN
- No build tools required
- No Node.js/npm required

## Critical Notes
- ES Modules require HTTP server (cannot use file://)
- Script order matters (core before plugins)
- async=false ensures synchronous execution
- Theme detection uses window.matchMedia
