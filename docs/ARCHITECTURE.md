# ARCHITECTURE

High-level file structure, module graph, and data flow for Scheme Remix Studio.

## File Tree

```text
/
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

## Responsibilities

- `index.html` owns the shell structure, inline config blocks, template declarations, and module entry.
- `app.css` owns all styling using the full 18-layer stack.
- `js/config.js` parses `cfg-app`, `cfg-design`, and `cfg-library`.
- `js/state.js` owns derived state, caches, `compClasses()`, `ensureFontLoaded()`, and `applyDesign()`.
- `js/lens.js` owns lens DOM construction, camera math, maximize behavior, fit/1x toggle, and the single global pointer tracker.
- `js/ui.js` owns parameter UI construction and popover behavior.
- `js/main.js` owns orchestration, init, randomize, triggerDemo, and applyScheme.
- `data/app.config.json` contains app behavior.
- `data/design.config.json` contains propSets, paramTypes, and lenses.
- `data/library.json` contains presets and schemes.

## Data Flow

1. JSON is authored in `data/*.json`.
2. It is inlined into `index.html` as `cfg-app`, `cfg-design`, and `cfg-library`.
3. `config.js` parses and exports the three config objects.
4. `state.js` derives `state` from paramTypes and `cameras` from lenses.
5. `buildApp()` constructs the DOM and registers caches.
6. `applyDesign()` applies the generated classes and re-seats zoom lenses.
7. Lens interactions update `cameras`; param interactions update `state` and trigger `applyDesign()`.
