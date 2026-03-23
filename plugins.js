// plugins.js - Manifest: Configuration data module

// 1. Docsify Core Configuration
export const docsConfig = {
  name: 'Scheme Mixer',
  repo: 'https://github.com/closetgeekshow/scheme-mixer',
  loadSidebar: true,

  subMaxLevel: 2,
  auto2top: true,
  search: 'auto',
  copyCode: {
    buttonText: 'Copy to clipboard',
    errorText: 'Error',
    successText: 'Copied!'
  },
  mermaid: {
    // Mermaid configuration
    startOnLoad: false,
    theme: 'default'
  }
};

// 2. Theme Definitions (Using docsify-themeable)
export const themes = {
  light: 'https://cdn.jsdelivr.net/npm/docsify-themeable@0/dist/css/theme-simple.css',
  dark: 'https://cdn.jsdelivr.net/npm/docsify-themeable@0/dist/css/theme-simple-dark.css'
};

// 3. Plugin & Dependency Manifest (Order matters)
export const pluginUrls = [
  // Core Engine
  'https://cdn.jsdelivr.net/npm/docsify@4',
  
  // Official Plugins
  'https://cdn.jsdelivr.net/npm/docsify/lib/plugins/search.min.js',
  'https://cdn.jsdelivr.net/npm/docsify/lib/plugins/zoom-image.min.js',
  
  // Third-Party Docsify Plugins
  'https://cdn.jsdelivr.net/npm/docsify-copy-code/dist/docsify-copy-code.min.js',
  'https://unpkg.com/mermaid/dist/mermaid.min.js',
  'https://cdn.jsdelivr.net/npm/docsify-mermaid/dist/docsify-mermaid.min.js',
  'https://cdn.jsdelivr.net/npm/docsify-mermaid-zoom/dist/docsify-mermaid-zoom.min.js',
  'https://cdn.jsdelivr.net/npm/docsify-sidebar-collapse/dist/docsify-sidebar-collapse.min.js',
  'https://cdn.jsdelivr.net/npm/docsify-wikilink/dist/docsify-wikilink.min.js',
  'https://cdn.jsdelivr.net/npm/docsify-dark-switch@1.0.2/dist/docsify-dark-switch.min.js',
  'https://cdn.jsdelivr.net/npm/drawcsify@1.1.0/drawcsify.js',
  
  // Syntax Highlighting (Prism.js)
  'https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-core.min.js',
  'https://cdn.jsdelivr.net/npm/prismjs@1/plugins/autoloader/prism-autoloader.min.js'
];
