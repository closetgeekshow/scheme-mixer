// js/lens.js
// Lens construction, camera math, interactions, maximize, and fit/1x.

import { APP_CONFIG, DESIGN_CONFIG } from '/js/config.js';
import { cameras, componentEls, lensCache, compClasses } from '/js/state.js';

// --- Template references ---

const tplComponent = document.getElementById('tpl-component');
const tplBadgeTL = document.getElementById('tpl-lens-badge-tl');
const tplBadgeBL = document.getElementById('tpl-lens-badge-bl');

// --- Global pointer tracker ---

let activeDrag = null; // { lensId, lastX, lastY }

window.addEventListener('pointermove', e => {
  if (!activeDrag) return;
  const { lensId, lastX, lastY } = activeDrag;
  const cache = lensCache.get(lensId);
  if (!cache) return;

  const cam = cameras[lensId];
  const comp = cache.comp;
  const cW = (comp && comp.offsetWidth) || 340;
  const cH = (comp && comp.offsetHeight) || 240;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  const [pMin, pMax] = APP_CONFIG.camera.panClamp;

  cam.x = Math.max(pMin, Math.min(pMax, cam.x - dx / (cW * cam.zoom)));
  cam.y = Math.max(pMin, Math.min(pMax, cam.y - dy / (cH * cam.zoom)));

  activeDrag.lastX = e.clientX;
  activeDrag.lastY = e.clientY;

  updateCamera(lensId);
});

window.addEventListener('pointerup', () => {
  if (!activeDrag) return;
  const cache = lensCache.get(activeDrag.lensId);
  if (cache && cache.viewport) {
    cache.viewport.classList.remove('dragging');
  }
  activeDrag = null;
});

// --- Camera math ---

export function updateCamera(lensId) {
  const cache = lensCache.get(lensId);
  if (!cache) return;

  const cam = cameras[lensId];
  const { viewport, content, comp, badgeTL, badgeBL } = cache;
  if (!viewport || !content) return;

  // Clamp zoom
  const [zMin, zMax] = APP_CONFIG.camera.zoomClamp;
  cam.zoom = Math.max(zMin, Math.min(zMax, cam.zoom));

  const vW = viewport.clientWidth;
  const vH = viewport.clientHeight;
  const cW = (comp && comp.offsetWidth) || 340;
  const cH = (comp && comp.offsetHeight) || 240;

  const tx = vW / 2 - cam.x * cW * cam.zoom;
  const ty = vH / 2 - cam.y * cH * cam.zoom;

  content.style.transform = `translate(${tx}px, ${ty}px) scale(${cam.zoom})`;
  content.style.transformOrigin = '0 0';

  if (badgeTL) {
    const zoomNum = cam.zoom % 1 === 0 ? cam.zoom.toFixed(0) : cam.zoom.toFixed(2);
    const zoomNumEl = badgeTL.querySelector('.lens-zoom-num');
    if (zoomNumEl) zoomNumEl.textContent = `${zoomNum}×`;
  }

  if (badgeBL) {
    const zoomNumEl = badgeBL.querySelector('.lens-zoom-num');
    const coordsEl = badgeBL.querySelector('.lens-coords');
    if (zoomNumEl) zoomNumEl.textContent = `${cam.zoom.toFixed(2)}×`;
    if (coordsEl) coordsEl.textContent = `(${(cam.x * 100).toFixed(0)}, ${(cam.y * 100).toFixed(0)})`;
  }
}

// --- Per-lens interaction ---

function setupLensInteraction(lensId, lensConfig) {
  const cache = lensCache.get(lensId);
  if (!cache) return;

  const { viewport } = cache;
  if (!viewport || lensConfig.fixed) return;

  const cam = cameras[lensId];
  const [zMin, zMax] = APP_CONFIG.camera.zoomClamp;
  const [pMin, pMax] = APP_CONFIG.camera.panClamp;

  viewport.classList.add('draggable');

  viewport.addEventListener('pointerdown', e => {
    activeDrag = { lensId, lastX: e.clientX, lastY: e.clientY };
    viewport.classList.add('dragging');
    e.preventDefault();
  });

  viewport.addEventListener('wheel', e => {
    const factor = e.deltaY < 0 ? 1.12 : 0.9;
    cam.zoom = Math.max(zMin, Math.min(zMax, cam.zoom * factor));
    updateCamera(lensId);
    e.preventDefault();
  }, { passive: false });

  // Basic touch support: one-finger pan, two-finger pinch
  let lastTouches = null;

  viewport.addEventListener('touchstart', e => {
    lastTouches = Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }));
    e.preventDefault();
  }, { passive: false });

  viewport.addEventListener('touchmove', e => {
    if (!lastTouches) return;
    const current = Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }));
    const cacheNow = lensCache.get(lensId);
    const comp = cacheNow && cacheNow.comp;
    const cW = (comp && comp.offsetWidth) || 340;
    const cH = (comp && comp.offsetHeight) || 240;

    if (current.length === 1 && lastTouches.length >= 1) {
      const dx = current[0].x - lastTouches[0].x;
      const dy = current[0].y - lastTouches[0].y;
      cam.x = Math.max(pMin, Math.min(pMax, cam.x - dx / (cW * cam.zoom)));
      cam.y = Math.max(pMin, Math.min(pMax, cam.y - dy / (cH * cam.zoom)));
    } else if (current.length === 2 && lastTouches.length >= 2) {
      const pd = Math.hypot(
        lastTouches[0].x - lastTouches[1].x,
        lastTouches[0].y - lastTouches[1].y
      );
      const nd = Math.hypot(
        current[0].x - current[1].x,
        current[0].y - current[1].y
      );
      if (pd > 0) {
        cam.zoom = cam.zoom * (nd / pd);
        cam.zoom = Math.max(zMin, Math.min(zMax, cam.zoom));
      }
    }

    lastTouches = current;
    updateCamera(lensId);
    e.preventDefault();
  }, { passive: false });

  viewport.addEventListener('touchend', e => {
    lastTouches = Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }));
  });
}

// --- Maximize helpers ---

function toggleMaximize(lensId) {
  for (const [id, cache] of lensCache.entries()) {
    if (!cache.wrap) continue;
    if (id === lensId) {
      cache.wrap.classList.toggle('lens--maximized');
    } else {
      cache.wrap.classList.remove('lens--maximized');
    }
  }
}

// --- Lens factory ---

export function createLens(lensConfig) {
  const wrap = document.createElement('div');
  wrap.className = 'lens' + (lensConfig.fixed ? ' lens-fixed' : '');
  wrap.dataset.lensId = lensConfig.id;

  // Viewport and content
  const viewport = document.createElement('div');
  viewport.className = 'lens-viewport' + (lensConfig.fixed ? ' centered' : '');

  const content = document.createElement('div');
  content.className = 'lens-content' + (lensConfig.fixed ? ' static' : '');

  // Component from template
  const compFragment = tplComponent.content.cloneNode(true);
  const comp = compFragment.querySelector('.the-component');
  if (comp) {
    comp.className = compClasses();
    componentEls.add(comp);
    content.appendChild(compFragment);
  }

  viewport.appendChild(content);
  wrap.appendChild(viewport);

  // Top-left zoom + desc badge from template
  let badgeTL = null;
  if (tplBadgeTL) {
    const frag = tplBadgeTL.content.cloneNode(true);
    badgeTL = frag.querySelector('.lens-badge-tl');
    const descEl = badgeTL && badgeTL.querySelector('.lens-desc');
    if (descEl) descEl.textContent = lensConfig.desc.toUpperCase();
    wrap.appendChild(frag);
  }

  // Bottom-left zoom + coords badge for zoom lenses
  let badgeBL = null;
  if (!lensConfig.fixed && tplBadgeBL) {
    const frag = tplBadgeBL.content.cloneNode(true);
    badgeBL = frag.querySelector('.lens-badge-bl');
    wrap.appendChild(frag);
  }

  // Reset button for zoom lenses
  if (!lensConfig.fixed) {
    const resetBtn = document.createElement('button');
    resetBtn.className = 'lens-reset-btn';
    resetBtn.textContent = '⟲';
    resetBtn.addEventListener('click', e => {
      e.stopPropagation();
      cameras[lensConfig.id].zoom = lensConfig.zoom;
      cameras[lensConfig.id].x = lensConfig.x;
      cameras[lensConfig.id].y = lensConfig.y;
      updateCamera(lensConfig.id);
    });
    wrap.appendChild(resetBtn);
  }

  // Maximize button (all lenses)
  const maxBtn = document.createElement('button');
  maxBtn.className = 'lens-max-btn';
  maxBtn.type = 'button';
  maxBtn.textContent = '⤢';
  maxBtn.title = 'Maximize / restore lens';
  maxBtn.addEventListener('click', e => {
    e.stopPropagation();
    toggleMaximize(lensConfig.id);
  });
  wrap.appendChild(maxBtn);

  // Fit / 1x toggle for fixed lens
  let viewToggleBtn = null;
  if (lensConfig.fixed) {
    viewToggleBtn = document.createElement('button');
    viewToggleBtn.className = 'lens-view-toggle';
    viewToggleBtn.type = 'button';
    viewToggleBtn.textContent = '1×';
    viewToggleBtn.title = 'Toggle fit / 1×';
  }

  // Initialize camera state and cache
  cameras[lensConfig.id] = {
    zoom: lensConfig.zoom,
    x: lensConfig.x,
    y: lensConfig.y
  };

  lensCache.set(lensConfig.id, {
    wrap,
    viewport,
    content,
    comp: content.querySelector('.the-component') || null,
    badgeTL,
    badgeBL,
    originCamera: { zoom: lensConfig.zoom, x: lensConfig.x, y: lensConfig.y },
    mode1x: false,
    resizeObserver: null
  });

  // Wire view toggle after cache set so handlers can read state
  if (viewToggleBtn) {
    viewToggleBtn.addEventListener('click', e => {
      e.stopPropagation();
      const cache = lensCache.get(lensConfig.id);
      if (!cache) return;
      const cam = cameras[lensConfig.id];
      if (!cache.mode1x) {
        // Switch to 1× centered
        cam.zoom = 1;
        cam.x = 0.5;
        cam.y = 0.5;
        cache.mode1x = true;
        viewport.classList.add('view-1x');
        viewToggleBtn.textContent = 'Fit';
      } else {
        // Restore original camera
        cam.zoom = cache.originCamera.zoom;
        cam.x = cache.originCamera.x;
        cam.y = cache.originCamera.y;
        cache.mode1x = false;
        viewport.classList.remove('view-1x');
        viewToggleBtn.textContent = '1×';
      }
      updateCamera(lensConfig.id);
    });
    wrap.appendChild(viewToggleBtn);
  }

  // ResizeObserver for zoom lenses to re-seat cameras on resize
  if (!lensConfig.fixed && 'ResizeObserver' in window) {
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(() => updateCamera(lensConfig.id));
    });
    ro.observe(viewport);
    const cache = lensCache.get(lensConfig.id);
    if (cache) cache.resizeObserver = ro;
  }

  // Initial seat & interactions
  requestAnimationFrame(() => {
    updateCamera(lensConfig.id);
    setupLensInteraction(lensConfig.id, lensConfig);
  });

  return wrap;
}