// js/state.js
// Derived state, caches, and core design application helpers.

import { APP_CONFIG, DESIGN_CONFIG } from '/js/config.js';

// --- Derived state ---

// state: { [paramType.id]: optionValue }
export const state = Object.fromEntries(
  DESIGN_CONFIG.paramTypes.map(p => [p.id, p.options[0].value])
);

// cameras: { [lens.id]: { zoom, x, y } }
export const cameras = Object.fromEntries(
  DESIGN_CONFIG.lenses.map(l => [l.id, { zoom: l.zoom, x: l.x, y: l.y }])
);

// --- Caches ---

// All .the-component instances
export const componentEls = new Set();

// Map paramType.id -> Set<select>
export const paramSelectMap = new Map();

// Map lensId -> { wrap, viewport, content, comp, badgeTL, badgeBL }
export const lensCache = new Map();

// --- Class builder ---

export function compClasses() {
  const base = ['the-component'];
  for (const param of DESIGN_CONFIG.paramTypes) {
    const value = state[param.id];
    if (!value) continue;
    base.push(`${param.cssPrefix}-${value}`);
  }
  return base.join(' ');
}

// --- Font loader for surfaces ---

const surfaceParam = DESIGN_CONFIG.paramTypes.find(p => p.id === 'surface');
const SURFACE_FONT_SOURCES = surfaceParam
  ? Object.fromEntries(
      surfaceParam.options
        .filter(o => o.fontsource)
        .map(o => [o.value, o.fontsource])
    )
  : {};

const loadedFonts = new Set();

export function ensureFontLoaded(surfaceValue) {
  const href = SURFACE_FONT_SOURCES[surfaceValue];
  if (!href || loadedFonts.has(surfaceValue)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
  loadedFonts.add(surfaceValue);
}

// --- Apply design to all components ---
// Also re-seats zoom-lens cameras after potential size changes.

export function applyDesign() {
  ensureFontLoaded(state.surface);

  const cls = compClasses();
  for (const el of componentEls) {
    el.className = cls;
  }

  // Re-seat cameras for non-fixed lenses after class changes may affect size.
  // Use dynamic import to avoid static circular dependency with lens.js.
  import('./lens.js').then(({ updateCamera }) => {
    requestAnimationFrame(() => {
      for (const lens of DESIGN_CONFIG.lenses) {
        if (lens.fixed) continue;
        if (!lensCache.has(lens.id)) continue;
        updateCamera(lens.id);
      }
    });
  }).catch(() => {
    // Swallow errors silently; camera will be corrected on next interaction.
  });
}