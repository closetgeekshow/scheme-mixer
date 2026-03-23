# ARCHITECTURE

High-level file structure, module graph, and data flow for Scheme Remix Studio.

## File Tree

```text
/
├── README.md
├── index.html
├── app.css
├── js/
│   ├── config.js
│   ├── state.js
│   ├── lens.js
│   ├── ui.js
│   └── main.js
├── data/
│   ├── app.config.json
│   ├── design.config.json
│   └── library.json
└── docs/
    ├── CONVENTIONS.md
    ├── SCHEMAS.md
    ├── PROP-SETS.md
    ├── LAYER-STACK.md
    ├── TOKEN-MAP.md
    ├── ARCHITECTURE.md
    └── COMPONENT-CONTRACT.md
```

## Module Dependency Graph

```text
config.js
    ↓
state.js
    ↓         ↓
lens.js     ui.js
    ↓         ↓
        main.js
```

> **Exception:** `applyDesign()` in `state.js` uses `dynamic import('./lens.js')`
> to call `updateCamera()` at runtime, avoiding a static circular dependency.

## Responsibilities

- `index.html` owns the shell structure, template declarations, and module entry point.
- `app.css` owns all styling using the full 18-layer stack.
- `js/config.js` fetches `data/app.config.json`, `data/design.config.json`, and
  `data/library.json` in parallel using `Promise.all()` with top-level `await`,
  then exports `APP_CONFIG`, `DESIGN_CONFIG`, and `LIBRARY`.
- `js/state.js` owns derived state, caches, `compClasses()`, `ensureFontLoaded()`, and `applyDesign()`.
- `js/lens.js` owns lens DOM construction, camera math, maximize behavior, fit/1x toggle, and the single global pointer tracker.
- `js/ui.js` owns parameter UI construction and popover behavior.
- `js/main.js` owns orchestration, init, randomize, triggerDemo, and applyScheme.
- `data/app.config.json` contains app behavior.
- `data/design.config.json` contains propSets, paramTypes, and lenses.
- `data/library.json` contains presets and schemes.

## Data Flow

1. JSON is authored in `data/*.json`.
2. `config.js` fetches all three files in parallel using `Promise.all()` with
   top-level `await` and exports `APP_CONFIG`, `DESIGN_CONFIG`, and `LIBRARY`.
   Requires a dev server — `fetch()` does not work on `file://`.
3. `state.js` derives `state` from paramTypes and `cameras` from lenses.
4. `buildApp()` constructs the DOM and registers caches.
5. `applyDesign()` applies the generated classes and re-seats zoom lenses.
6. Lens interactions update `cameras`; param interactions update `state` and trigger `applyDesign()`.

## JS Runtime Contracts

### State derivation

```js
state   = Object.fromEntries(DESIGN_CONFIG.paramTypes.map(p => [p.id, p.options.value]))
cameras = Object.fromEntries(DESIGN_CONFIG.lenses.map(l => [l.id, { zoom: l.zoom, x: l.x, y: l.y }]))
```

### Module-level caches

Populated at creation time; never queried in hot paths (no `querySelectorAll` inside
event handlers or animation frames).

| Cache | Type | Description |
|---|---|---|
| `componentEls` | `Set<HTMLElement>` | All `.the-component` instances |
| `paramSelectMap` | `Map<paramId, Set<HTMLSelectElement>>` | All `<select>` elements per paramType |
| `lensCache` | `Map<lensId, LensCacheEntry>` | Lens DOM nodes and per-lens runtime state |

`LensCacheEntry` shape:

```ts
{
  wrap:           HTMLElement,
  viewport:       HTMLElement,
  content:        HTMLElement,
  comp:           HTMLElement | null,
  badgeTL:        HTMLElement,
  badgeBL:        HTMLElement,
  originCamera:   { zoom: number, x: number, y: number },
  mode1x:         boolean,
  resizeObserver: ResizeObserver | null
}
```

`originCamera` stores the initial camera position from the lens config so that
the reset button can restore it without re-reading `DESIGN_CONFIG`.
`mode1x` tracks the fit/1x toggle state for the fixed lens.
`resizeObserver` holds the per-viewport `ResizeObserver` instance (zoom lenses only).

### Pointer tracking

One `pointermove` and one `pointerup` listener on `window` — global total.
No additional per-lens pointer listeners are registered.

```js
// activeDrag is null when no drag is in progress
activeDrag = { lensId: string, lastX: number, lastY: number } | null
```
