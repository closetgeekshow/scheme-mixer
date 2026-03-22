# Scheme Remix Studio

A parametric component design system built with vanilla JavaScript. Mix five independent design axes — surface material, shape geometry, depth elevation, motion dynamics, and spatial density — and preview every combination across three simultaneous zoom lenses in real time.

> **No build step. No framework. No bundler.** Requires only a local dev server.

---

## Quick Start

The app uses ES modules and `fetch()` to load JSON config files. Opening `index.html` directly from the filesystem (`file://`) will fail. You must serve the project root over HTTP:

```bash
# Option A — Node (no install required)
npx serve .

# Option B — Python
python3 -m http.server 8080

# Option C — VS Code
Install the "Live Server" extension, then click "Go Live"
```

Then open `http://localhost:3000` (or whichever port your server reports) in your browser.

---

## What It Does

Use the sidebar selects to dial in a combination of the five design parameters. The component preview updates instantly across all three lenses. Hit **Randomize** to jump to a random combination, or **Run Demo** to trigger a live motion preview on the component.

### Design Parameters

| Axis | CSS Prefix | Options |
|---|---|---|
| Surface Material | `surf-` | velvet, console, glass, frutiger, memphis, artdeco, grunge, holo |
| Shape Geometry | `shape-` | pill, sharp, soft, chamfer, bauhaus, concentric, squircle |
| Depth Elevation | `depth-` | flat, raised, sunken, neumorphic, brutalist, glowing, concentric |
| Motion Dynamics | `mo-` | velvet, console, elastic, glitch, float, whip, spring |
| Spatial Density | `density-` | compact, normal, airy, wide |

### Lens System

Three viewports render the same component simultaneously at different zoom levels. The top lens is fixed (1× actual size) and supports a **1px toggle** to verify pixel-perfect rendering. The two bottom lenses are pannable and zoomable:

| Lens | Zoom | Type | Controls |
|---|---|---|---|
| Actual | 1× | Fixed | Hover for motion demo, toggle 1px view |
| Geometry | 2× | Pannable | Drag to pan, scroll to zoom, reset button |
| Surface | 0.75× | Pannable | Drag to pan, scroll to zoom, reset button |

All three lenses have a **maximize button** (⛶) that expands them to full viewport.

---

## Project Structure

```
closetgeekshow-scheme-mixer/
├── index.html               # App shell, <template> declarations, module entry
├── app.css                  # Full 18-layer CSS architecture
├── config-data-files.html   # Dev utility: in-browser JSON config editor
├── test.html                # Dev utility: Phase 6 automated test harness
│
├── js/
│   ├── config.js            # Parallel-fetches all three data files; top-level await
│   ├── state.js             # Derived state, caches, compClasses, applyDesign
│   ├── lens.js              # Lens construction, camera math, pointer tracker
│   ├── ui.js                # Parameter UI, buildParamList, popover
│   └── main.js              # Orchestration: init, randomize, triggerDemo, applyScheme
│
├── data/
│   ├── app.config.json      # App behaviour, camera clamps, capability layer registry
│   ├── design.config.json   # propSets, paramTypes, lenses — the design system schema
│   └── library.json         # Presets and schemes (currently empty, ready to author)
│
└── docs/
    ├── ARCHITECTURE.md
    ├── COMPONENT-CONTRACT.md
    ├── CONVENTIONS.md
    ├── DIAGRAMS.md
    ├── LAYER-STACK.md
    ├── PROP-SETS.md
    ├── SCHEMAS.md
    └── TOKEN-MAP.md
```

---

## CSS Architecture

`app.css` uses a strict 18-layer `@layer` cascade, declared in this order:

```
reset → tokens.primitives → tokens.semantic → tokens.component-defaults →
shell.layout → shell.sidebar → shell.lens → shell.mobile →
component.base → component.surface → component.shape → component.depth →
component.motion → component.density →
effects.holo-pan → effects.glitch → effects.demo → overrides
```

Token tiers:
- **Tier 1 Primitives** (`--bg-*`, `--r-*`, `--sp-*`, `--z-*`) — raw palette and scale, read-only
- **Tier 2 Semantic** (`--bg`, `--panel`, `--text`, `--accent`) — intent-expressive aliases
- **Tier 3 Component** (`--comp-*`, `--btn-*`) — consumed directly by `.the-component`

---

## How Design Is Applied

Selecting a parameter value adds a single CSS class to `.the-component`. The full class string always looks like:

```
the-component  surf-velvet  shape-pill  depth-raised  mo-elastic  density-normal
```

`applyDesign()` in `state.js` rebuilds this class string from the current state and stamps it onto every `.the-component` instance across all three lenses simultaneously. Fonts are lazy-loaded on demand via a `<link rel="stylesheet">` injected into `<head>`, deduplicated by a `loadedFonts` Set.

---

## Extending the Design System

### Add a new surface, shape, depth, motion, or density option

1. Add an entry to the relevant `paramTypes[].options` array in `data/design.config.json`:
   ```json
   { "value": "clay", "label": "Clay Muted Earthy" }
   ```
2. Add the corresponding CSS class in `app.css` inside the matching component layer:
   ```css
   /* inside @layer component.surface */
   .surf-clay {
     --comp-bg: #c4a882;
     --comp-color: #2b1f14;
   }
   ```
3. No JavaScript changes required. The UI and class builder are fully data-driven.

### Add a new parameter axis

1. Define a new `propSet` in `data/design.config.json`.
2. Add a new entry to `paramTypes` referencing that `propSet`.
3. Author CSS classes following the `cssPrefix-value` naming convention.
4. Update `docs/COMPONENT-CONTRACT.md` to document which CSS tokens the axis consumes.

### Author presets and schemes

Add entries to `data/library.json`. A **preset** is a partial selection (one or more paramType values). A **scheme** composes multiple presets and can activate optional capability layers. No JS or CSS changes are needed — `applyScheme()` in `main.js` reads `library.json` at runtime.

---

## Dev Utilities

### Config Editor — `config-data-files.html`

An in-browser JSON editor for all three data files. Load, edit, validate, and download updated configs without leaving the browser. **Requires a dev server** (same reason as the main app).

### Test Harness — `test.html`

Loads `index.html` in an iframe and runs automated checks against the live DOM. Outputs a JSON audit log you can copy and share. Automated checks cover: CSS class integrity, lens maximize/restore, fit-1px toggle, and capability layer activation. Manual checks are pre-logged with instructions for DevTools validation.

---

## Documentation

All architecture decisions, naming conventions, JSON schemas, and cross-file contracts live in the `/docs` directory. Start with:

- **`ARCHITECTURE.md`** — module graph, data flow, and runtime cache contracts
- **`CONVENTIONS.md`** — mandatory naming rules for CSS, JS, and JSON
- **`COMPONENT-CONTRACT.md`** — which propSets each component template axis consumes
- **`SCHEMAS.md`** — JSON Schema definitions for every config shape
- **`DIAGRAMS.md`** — Mermaid flowcharts for every major runtime path
