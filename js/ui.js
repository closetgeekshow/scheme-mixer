// js/ui.js
// UI construction: params, sidebar, lenses, popover.

import { APP_CONFIG, DESIGN_CONFIG } from './config.js';
import { state, componentEls, paramSelectMap, applyDesign } from './state.js';
import { createLens } from './lens.js';

// --- Template references ---

const tplParamItem = document.getElementById('tpl-param-item');

// --- Param controls ---

export function createParamItem(paramType) {
  if (!tplParamItem) {
    throw new Error('tpl-param-item template is missing');
  }

  const frag = tplParamItem.content.cloneNode(true);
  const item = frag.querySelector('.param-item');
  const label = item.querySelector('.param-label');
  const helpBtn = item.querySelector('.param-help-btn');
  const select = item.querySelector('.param-select');

  label.textContent = paramType.label;

  // Populate options
  for (const opt of paramType.options) {
    const o = document.createElement('option');
    o.value = opt.value;
    o.textContent = opt.label;
    select.appendChild(o);
  }

  select.value = state[paramType.id];

  // Track selects per paramType
  if (!paramSelectMap.has(paramType.id)) {
    paramSelectMap.set(paramType.id, new Set());
  }
  paramSelectMap.get(paramType.id).add(select);

  select.addEventListener('change', e => {
    state[paramType.id] = e.target.value;
    // Sync sibling selects (desktop + mobile)
    const set = paramSelectMap.get(paramType.id);
    if (set) {
      for (const s of set) {
        if (s !== select) s.value = e.target.value;
      }
    }
    applyDesign();
  });

  // Help popover
  if (paramType.description) {
    helpBtn.addEventListener('click', e => {
      e.stopPropagation();
      showPopover(paramType.description, helpBtn);
    });
  } else {
    helpBtn.classList.add('hidden');
  }

  return item;
}

export function buildParamList(container) {
  container.innerHTML = '';
  for (const paramType of DESIGN_CONFIG.paramTypes) {
    const item = createParamItem(paramType);
    container.appendChild(item);
  }
}

// --- Popover ---

const popoverEl = document.getElementById('global-popover');
const popoverContentEl = popoverEl.querySelector('.popover-content');
let popoverAnchor = null;

export function showPopover(text, anchorEl) {
  if (popoverAnchor === anchorEl && !popoverEl.classList.contains('hidden')) {
    popoverEl.classList.add('hidden');
    popoverAnchor = null;
    return;
  }

  popoverAnchor = anchorEl;
  popoverContentEl.textContent = text;
  popoverEl.classList.remove('hidden');

  const rect = anchorEl.getBoundingClientRect();
  let left = rect.right + 8;
  let top = rect.top;
  const width = 260;

  if (left + width > window.innerWidth - 10) {
    left = window.innerWidth - width - 10;
  }
  if (top + 130 > window.innerHeight) {
    top = rect.top - 136;
  }

  popoverEl.style.left = `${left}px`;
  popoverEl.style.top = `${top}px`;
}

// Hide popover on outside click
window.addEventListener('click', e => {
  if (!e.target.closest('.param-help-btn') && !e.target.closest('#global-popover')) {
    popoverEl.classList.add('hidden');
    popoverAnchor = null;
  }
});

// --- App shell ---

export function buildApp() {
  const sidebarTitleEl = document.querySelector('.sidebar-header-title');
  const sidebarSubEl = document.querySelector('.sidebar-header-sub');

  if (sidebarTitleEl) sidebarTitleEl.textContent = APP_CONFIG.title;
  if (sidebarSubEl) sidebarSubEl.textContent = APP_CONFIG.subtitle;

  const sidebarList = document.getElementById('param-list');
  buildParamList(sidebarList);

  const mobileParamList = document.getElementById('mobile-param-list');
  if (mobileParamList) {
    buildParamList(mobileParamList);
  }

  const mobileStrip = document.getElementById('mobile-param-strip');
  if (mobileStrip) {
    buildParamList(mobileStrip);
  }

  const appContainer = document.getElementById('app');
  appContainer.innerHTML = '';

  for (const lensConfig of DESIGN_CONFIG.lenses) {
    const lensEl = createLens(lensConfig);
    appContainer.appendChild(lensEl);
  }
}