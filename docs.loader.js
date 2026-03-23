// docs.loader.js - Engine: Logic module for theme detection and plugin loading
import { docsConfig, themes, pluginUrls } from './plugins.js';

/**
 * Step 1: Initialize Docsify Configuration
 */
window.$docsify = docsConfig;

/**
 * Step 2: Inject Theme based on System Preference
 */
const injectTheme = () => {
  // Check if the user's OS is set to dark mode
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const themeLink = document.createElement('link');
  themeLink.rel = 'stylesheet';
  themeLink.href = prefersDark ? themes.dark : themes.light;
  themeLink.id = 'docsify-theme';
  
  document.head.appendChild(themeLink);
  
  // Listen for theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const existingTheme = document.getElementById('docsify-theme');
    if (existingTheme) {
      existingTheme.href = e.matches ? themes.dark : themes.light;
    }
  });
};

/**
 * Step 3: Inject Plugins Sequentially
 */
const injectPlugins = () => {
  pluginUrls.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    // Setting async to false ensures synchronous execution order
    // Docsify core will execute before the plugins attempt to attach to it
    script.async = false;
    document.body.appendChild(script);
  });
};

// Execute Loader
injectTheme();
injectPlugins();
