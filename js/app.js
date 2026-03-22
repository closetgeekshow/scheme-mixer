'use strict';

/* ═══════════════════════════════════════════════════════
   PARSE CONFIG + SCHEMA
   ═══════════════════════════════════════════════════════ */
const CONFIG = JSON.parse(document.getElementById('config-json').textContent);
const SCHEMA = JSON.parse(document.getElementById('schema-json').textContent);

/* ═══════════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════════ */
const state = { surface: 'velvet', geo: 'velvet', motion: 'velvet' };

// Camera per lens id  { zoom, x, y }
const cameras = {};

// Lens DOM elements per lens id
const lensEls = {};

/* ═══════════════════════════════════════════════════════
   COMPONENT TEMPLATE
   ═══════════════════════════════════════════════════════ */
function makeComponent() {
  const el = document.createElement('div');
  el.className = 'the-component';
  el.innerHTML = `
    <h2>Protocol Status</h2>
    <p>This module verifies the structural integrity of the active design paradigm. Adjust parameters to observe systemic cascading effects.</p>
    <div class="comp-actions">
      <button class="comp-btn">Acknowledge</button>
      <button class="comp-btn secondary">Halt</button>
    </div>
  `;
  return el;
}

function compClasses() {
  return `the-component surf-${state.surface} geo-${state.geo} mo-${state.motion}`;
}

function applyDesign() {
  const cls = compClasses();
  document.querySelectorAll('.the-component').forEach(el => el.className = cls);
  // Re-seat zoom lens cameras (component size can shift with new surface/geo)
  requestAnimationFrame(() => {
    CONFIG.lenses.forEach(lc => {
      if (!lc.fixed && lensEls[lc.id]) updateCamera(lensEls[lc.id], cameras[lc.id]);
    });
  });
}

/* ═══════════════════════════════════════════════════════
   PARAMETER ITEM  (reusable data-driven component)
   ═══════════════════════════════════════════════════════ */
function createParamItem(paramConfig) {
  const wrap = document.createElement('div');
  wrap.className = 'param-item';

  // Header row: label + ? help icon
  const header = document.createElement('div');
  header.className = 'param-header';

  const label = document.createElement('label');
  label.className = 'param-label';
  label.textContent = paramConfig.label;

  const helpBtn = document.createElement('button');
  helpBtn.className = 'param-help-btn';
  helpBtn.type = 'button';
  helpBtn.textContent = '?';
  helpBtn.addEventListener('click', e => {
    e.stopPropagation();
    showPopover(paramConfig.description || '', helpBtn);
  });

  header.append(label, helpBtn);

  // Select with optgroups
  const select = document.createElement('select');
  select.className = 'param-select';
  select.dataset.paramId = paramConfig.id;

  const groups = new Map();
  paramConfig.options.forEach(opt => {
    const g = opt.group || '';
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(opt);
  });

  groups.forEach((opts, groupName) => {
    const container = groupName
      ? (() => { const og = document.createElement('optgroup'); og.label = groupName; return og; })()
      : select;
    opts.forEach(opt => {
      const o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      if (opt.value === state[paramConfig.id]) o.selected = true;
      container.append(o);
    });
    if (groupName) select.append(container);
  });

  select.addEventListener('change', () => {
    state[paramConfig.id] = select.value;
    // Sync sibling selects (sidebar ↔ mobile overlay)
    document.querySelectorAll(`[data-param-id="${paramConfig.id}"]`).forEach(s => {
      if (s !== select) s.value = select.value;
    });
    applyDesign();
  });

  wrap.append(header, select);
  return wrap;
}

/* ═══════════════════════════════════════════════════════
   PARAMETER LIST  (reusable container)
   ═══════════════════════════════════════════════════════ */
function buildParamList(container) {
  container.innerHTML = '';
  CONFIG.paramTypes.forEach(p => container.append(createParamItem(p)));
}

/* ═══════════════════════════════════════════════════════
   LENS CAMERA
   ═══════════════════════════════════════════════════════ */
function updateCamera(lensEl, cam) {
  const viewport = lensEl.querySelector('.lens-viewport');
  const content  = lensEl.querySelector('.lens-content');
  const comp     = lensEl.querySelector('.the-component');
  if (!viewport || !content || !comp) return;

  const vW = viewport.offsetWidth;
  const vH = viewport.offsetHeight;
  const cW = comp.offsetWidth  || 340;
  const cH = comp.offsetHeight || 240;

  const tx = vW / 2 - cam.x * cW * cam.zoom;
  const ty = vH / 2 - cam.y * cH * cam.zoom;

  content.style.transform       = `translate(${tx}px, ${ty}px) scale(${cam.zoom})`;
  content.style.transformOrigin = '0 0';

  const coordsBadge = lensEl.querySelector('.lens-badge-bl');
  if (coordsBadge) coordsBadge.textContent = `${cam.x.toFixed(2)}, ${cam.y.toFixed(2)}`;
}

function setupLensInteraction(lensEl, cam, lensConfig) {
  const viewport = lensEl.querySelector('.lens-viewport');
  if (!viewport) return;

  viewport.classList.add('draggable');

  let dragging = false;
  let lx = 0, ly = 0;

  viewport.addEventListener('mousedown', e => {
    dragging = true;
    lx = e.clientX; ly = e.clientY;
    viewport.classList.add('dragging');
    e.preventDefault();
  });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    const comp = lensEl.querySelector('.the-component');
    const cW = comp ? comp.offsetWidth : 340;
    const cH = comp ? comp.offsetHeight : 240;
    cam.x -= (e.clientX - lx) / (cW * cam.zoom);
    cam.y -= (e.clientY - ly) / (cH * cam.zoom);
    cam.x  = Math.max(-0.6, Math.min(1.6, cam.x));
    cam.y  = Math.max(-0.6, Math.min(1.6, cam.y));
    lx = e.clientX; ly = e.clientY;
    updateCamera(lensEl, cam);
  });
  window.addEventListener('mouseup', () => {
    dragging = false;
    viewport.classList.remove('dragging');
  });

  // Scroll-wheel zoom
  viewport.addEventListener('wheel', e => {
    cam.zoom *= e.deltaY < 0 ? 1.12 : 0.9;
    cam.zoom  = Math.max(0.4, Math.min(14, cam.zoom));
    updateCamera(lensEl, cam);
    e.preventDefault();
  }, { passive: false });

  // Touch: one-finger pan, two-finger pinch
  let lt = null;
  viewport.addEventListener('touchstart', e => {
    lt = Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }));
    e.preventDefault();
  }, { passive: false });
  viewport.addEventListener('touchmove', e => {
    if (!lt) return;
    const ct = Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }));
    const comp = lensEl.querySelector('.the-component');
    const cW = comp ? comp.offsetWidth : 340;
    const cH = comp ? comp.offsetHeight : 240;

    if (ct.length === 1 && lt.length >= 1) {
      cam.x -= (ct[0].x - lt[0].x) / (cW * cam.zoom);
      cam.y -= (ct[0].y - lt[0].y) / (cH * cam.zoom);
      cam.x  = Math.max(-0.6, Math.min(1.6, cam.x));
      cam.y  = Math.max(-0.6, Math.min(1.6, cam.y));
    } else if (ct.length === 2 && lt.length >= 2) {
      const pd = Math.hypot(lt[0].x - lt[1].x, lt[0].y - lt[1].y);
      const nd = Math.hypot(ct[0].x - ct[1].x, ct[0].y - ct[1].y);
      if (pd > 0) { cam.zoom *= nd / pd; cam.zoom = Math.max(0.4, Math.min(14, cam.zoom)); }
    }
    lt = ct;
    updateCamera(lensEl, cam);
    e.preventDefault();
  }, { passive: false });
  viewport.addEventListener('touchend', e => {
    lt = Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }));
  });

  // Reset button
  const resetBtn = lensEl.querySelector('.lens-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', e => {
      e.stopPropagation();
      cam.zoom = lensConfig.zoom;
      cam.x    = lensConfig.x;
      cam.y    = lensConfig.y;
      updateCamera(lensEl, cam);
    });
  }
}

/* ═══════════════════════════════════════════════════════
   LENS  (reusable data-driven component)
   ═══════════════════════════════════════════════════════ */
function createLens(lensConfig) {
  const wrap = document.createElement('div');
  wrap.className = 'lens' + (lensConfig.fixed ? ' lens-fixed' : '');
  wrap.dataset.lensId = lensConfig.id;

  // ── Top-left badge ─────────────────────────────────────
  const badgeTL = document.createElement('div');
  badgeTL.className = 'lens-badge lens-badge-tl';
  const zoomStr = (lensConfig.zoom % 1 === 0)
    ? lensConfig.zoom.toFixed(0)
    : lensConfig.zoom.toFixed(1);
  badgeTL.innerHTML =
    `<span class="lens-zoom-num">${zoomStr}X</span>` +
    `<span class="lens-zoom-dot">·</span>` +
    `<span>${lensConfig.desc.toUpperCase()}</span>`;
  wrap.append(badgeTL);

  if (!lensConfig.fixed) {
    // ── Reset button ────────────────────────────────────
    const resetBtn = document.createElement('button');
    resetBtn.className = 'lens-reset-btn';
    resetBtn.title = 'Reset camera';
    resetBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M1.5 7a5.5 5.5 0 1 0 1.18-3.35" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M1.5 2.5V6.5h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    wrap.append(resetBtn);

    // ── Bottom-left coords ──────────────────────────────
    const badgeBL = document.createElement('div');
    badgeBL.className = 'lens-badge lens-badge-bl';
    badgeBL.textContent = `${lensConfig.x.toFixed(2)}, ${lensConfig.y.toFixed(2)}`;
    wrap.append(badgeBL);
  }

  // ── Viewport ───────────────────────────────────────────
  const viewport = document.createElement('div');
  viewport.className = 'lens-viewport' + (lensConfig.fixed ? ' centered' : '');

  const content = document.createElement('div');
  content.className = 'lens-content' + (lensConfig.fixed ? ' static' : '');

  content.append(makeComponent());
  viewport.append(content);
  wrap.append(viewport);

  // ── Camera init ────────────────────────────────────────
  cameras[lensConfig.id] = { zoom: lensConfig.zoom, x: lensConfig.x, y: lensConfig.y };
  lensEls[lensConfig.id] = wrap;

  if (!lensConfig.fixed) {
    requestAnimationFrame(() => {
      updateCamera(wrap, cameras[lensConfig.id]);
      setupLensInteraction(wrap, cameras[lensConfig.id], lensConfig);
    });
  }

  return wrap;
}

/* ═══════════════════════════════════════════════════════
   BUILD APP
   ═══════════════════════════════════════════════════════ */
function buildApp() {
  const appEl     = document.getElementById('app');
  const mobileBar = document.getElementById('mobile-bar');
  appEl.innerHTML = '';

  // ── Sidebar ─────────────────────────────────────────────
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';

  const sidebarHeader = document.createElement('div');
  sidebarHeader.className = 'sidebar-header';
  sidebarHeader.innerHTML = `
    <div class="sidebar-header-title">Scheme Remix Studio</div>
    <div class="sidebar-header-sub">Parametric Lens System</div>
  `;

  const paramList = document.createElement('div');
  paramList.className = 'param-list';
  buildParamList(paramList);

  const actions = document.createElement('div');
  actions.className = 'sidebar-actions';

  const btnRand = document.createElement('button');
  btnRand.className = 'btn-randomize';
  btnRand.textContent = 'Randomize';
  btnRand.addEventListener('click', randomize);

  const btnDemo = document.createElement('button');
  btnDemo.className = 'btn-demo';
  btnDemo.textContent = 'Trigger Demo';
  btnDemo.addEventListener('click', triggerDemo);

  actions.append(btnRand, btnDemo);
  sidebar.append(sidebarHeader, paramList, actions);

  // ── Primary workspace (1× lens) ─────────────────────────
  const primary = document.createElement('div');
  primary.className = 'workspace-primary';
  const fixedLens = CONFIG.lenses.find(l => l.fixed);
  if (fixedLens) primary.append(createLens(fixedLens));

  // ── Secondary workspace (zoom lenses) ───────────────────
  const secondary = document.createElement('div');
  secondary.className = 'workspace-secondary';
  CONFIG.lenses.filter(l => !l.fixed).forEach(lc => secondary.append(createLens(lc)));

  appEl.append(sidebar, primary, secondary);

  // ── Mobile bar ───────────────────────────────────────────
  mobileBar.innerHTML = '';

  const mRand = document.createElement('button');
  mRand.className = 'mobile-btn';
  mRand.innerHTML = `<svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6a4 4 0 1 0 .88-2.48" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M2 2.5V5.5h3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg> Randomize`;
  mRand.addEventListener('click', randomize);

  const mExpand = document.createElement('button');
  mExpand.className = 'mobile-btn';
  mExpand.innerHTML = `<svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M1 4V1h3M8 1h3v3M11 8v3H8M4 11H1V8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg> Parameters`;
  mExpand.addEventListener('click', () => document.getElementById('mobile-overlay').classList.add('open'));

  const mDemo = document.createElement('button');
  mDemo.className = 'mobile-btn-demo';
  mDemo.textContent = '▶ Demo';
  mDemo.addEventListener('click', triggerDemo);

  mobileBar.append(mRand, mExpand, mDemo);

  // ── Mobile overlay param list ────────────────────────────
  buildParamList(document.getElementById('mobile-param-list'));

  document.getElementById('overlay-close').addEventListener('click', () => {
    document.getElementById('mobile-overlay').classList.remove('open');
  });
  document.getElementById('mobile-apply-btn').addEventListener('click', () => {
    document.getElementById('mobile-overlay').classList.remove('open');
  });
}

/* ═══════════════════════════════════════════════════════
   ACTIONS
   ═══════════════════════════════════════════════════════ */
function randomize() {
  CONFIG.paramTypes.forEach(param => {
    const opts = param.options;
    const pick = opts[Math.floor(Math.random() * opts.length)];
    state[param.id] = pick.value;
    document.querySelectorAll(`[data-param-id="${param.id}"]`).forEach(s => s.value = pick.value);
  });
  applyDesign();
}

function triggerDemo() {
  document.querySelectorAll('.the-component').forEach(el => {
    el.classList.remove('demo-active');
    void el.offsetWidth;
    el.classList.add('demo-active');
  });
  setTimeout(() => {
    document.querySelectorAll('.the-component').forEach(el => el.classList.remove('demo-active'));
  }, 1800);
}

/* ═══════════════════════════════════════════════════════
   POPOVER
   ═══════════════════════════════════════════════════════ */
const popoverEl = document.getElementById('global-popover');
let popoverAnchor = null;

function showPopover(text, anchor) {
  if (popoverAnchor === anchor && !popoverEl.hidden) {
    popoverEl.hidden = true; popoverAnchor = null; return;
  }
  popoverAnchor = anchor;
  popoverEl.textContent = text;
  popoverEl.hidden = false;

  const r  = anchor.getBoundingClientRect();
  let left = r.left;
  let top  = r.bottom + 8;
  const pw = 255;
  if (left + pw > window.innerWidth - 10) left = window.innerWidth - pw - 10;
  if (top  + 130 > window.innerHeight)    top  = r.top - 136;
  popoverEl.style.left = `${left}px`;
  popoverEl.style.top  = `${top}px`;
}

document.addEventListener('click', e => {
  if (!e.target.closest('.param-help-btn') && !e.target.closest('#global-popover')) {
    popoverEl.hidden = true; popoverAnchor = null;
  }
});

/* ═══════════════════════════════════════════════════════
   RESIZE: re-seat cameras
   ═══════════════════════════════════════════════════════ */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    CONFIG.lenses.forEach(lc => {
      if (!lc.fixed && lensEls[lc.id]) updateCamera(lensEls[lc.id], cameras[lc.id]);
    });
  }, 80);
});

/* ═══════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════ */
buildApp();
applyDesign();

// Ensure cameras are seated after full paint
window.addEventListener('load', () => {
  setTimeout(() => {
    CONFIG.lenses.forEach(lc => {
      if (!lc.fixed && lensEls[lc.id]) updateCamera(lensEls[lc.id], cameras[lc.id]);
    });
  }, 120);
});
