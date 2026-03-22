// js/main.js
// Entry point: init, randomize, demo, scheme application.

import { APP_CONFIG, DESIGN_CONFIG, LIBRARY } from './config.js';
import { state, paramSelectMap, componentEls, applyDesign } from './state.js';
import { buildApp } from './ui.js';

// --- Actions ---

export function randomize() {
  for (const paramType of DESIGN_CONFIG.paramTypes) {
    const opts = paramType.options;
    if (!opts.length) continue;
    const pick = opts[Math.floor(Math.random() * opts.length)];
    state[paramType.id] = pick.value;

    const selects = paramSelectMap.get(paramType.id);
    if (selects) {
      for (const s of selects) {
        s.value = pick.value;
      }
    }
  }
  applyDesign();
}

export function triggerDemo() {
  const duration = APP_CONFIG.demoActiveDuration || 1800;
  const els = Array.from(componentEls);
  els.forEach((el, idx) => {
    setTimeout(() => {
      el.classList.add('demo-active');
      setTimeout(() => {
        el.classList.remove('demo-active');
      }, duration);
    }, idx * 100);
  });
}

export function applyScheme(schemeId) {
  const scheme = LIBRARY.schemes.find(s => s.id === schemeId);
  if (!scheme) return;

  // Apply selection from presets in order
  for (const presetId of scheme.presetIds) {
    const preset = LIBRARY.presets.find(p => p.id === presetId);
    if (!preset) continue;
    for (const [paramId, value] of Object.entries(preset.selection)) {
      if (!(paramId in state)) continue;
      state[paramId] = value;
      const selects = paramSelectMap.get(paramId);
      if (selects) {
        for (const s of selects) s.value = value;
      }
    }
  }

  // Toggle capability layers for this scheme
  const root = document.documentElement;
  for (const entry of APP_CONFIG.capabilityLayerRegistry || []) {
    if (entry.alwaysOn) continue;
    root.classList.remove(entry.id);
  }
  if (scheme.capabilityLayers) {
    for (const id of scheme.capabilityLayers) {
      root.classList.add(id);
    }
  }

  applyDesign();
}

// --- Init ---

function activateAlwaysOnCapabilities() {
  const root = document.documentElement;
  for (const entry of APP_CONFIG.capabilityLayerRegistry || []) {
    if (entry.alwaysOn) {
      root.classList.add(entry.id);
    }
  }
}

function wireGlobalButtons() {
  const btnRandomize = document.getElementById('btn-randomize');
  const btnDemo = document.getElementById('btn-demo');
  const mobileDemo = document.getElementById('mobile-btn-demo');
  const mobileBar = document.getElementById('mobile-bar');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileClose = document.getElementById('mobile-overlay-close');

  if (btnRandomize) btnRandomize.addEventListener('click', randomize);
  if (btnDemo) btnDemo.addEventListener('click', triggerDemo);
  if (mobileDemo) mobileDemo.addEventListener('click', triggerDemo);

  if (mobileClose && mobileOverlay) {
    mobileClose.addEventListener('click', () => {
      mobileOverlay.classList.add('hidden');
    });
  }

  if (mobileBar && mobileOverlay) {
    mobileBar.addEventListener('click', () => {
      mobileOverlay.classList.remove('hidden');
    });
  }
}

function init() {
  buildApp();
  activateAlwaysOnCapabilities();
  applyDesign();
  wireGlobalButtons();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}