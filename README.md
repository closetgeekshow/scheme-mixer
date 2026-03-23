# Scheme Remix Studio

A zero-build, data-driven parametric component explorer built with vanilla ES modules and a strict CSS `@layer` architecture.

> **No build step. No framework. No bundler.** Requires only a local dev server.

## What It Is

- **Zero-build, vanilla ES modules** — serve with any static server, no bundler required
- **5 parametric design axes** — surface material (8 options), shape geometry (7 options), depth elevation (7 options), motion dynamics (7 options), spatial density (4 options)
- **3-lens viewport** — pan, zoom, maximize, and 1:1 pixel verification
- **Data-driven** — add options, lenses, presets, and schemes without touching any JavaScript

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

## How It Works

Selecting a parameter value adds a single CSS class to `.the-component`. The full class string always looks like:

```
the-component  surf-velvet  shape-pill  depth-raised  mo-elastic  density-normal
```

`compClasses()` in `state.js` builds this class string by iterating `DESIGN_CONFIG.paramTypes` and concatenating `cssPrefix + '-' + state[id]` for each axis. `applyDesign()` stamps the result onto every `.the-component` instance across all three lenses simultaneously.

## Design Parameters

| Axis | CSS Prefix | Options |
|---|---|---|
| Surface Material | `surf-` | velvet, console, glass, frutiger, memphis, artdeco, grunge, holo |
| Shape Geometry | `shape-` | pill, sharp, soft, chamfer, bauhaus, concentric, squircle |
| Depth Elevation | `depth-` | flat, raised, sunken, neumorphic, brutalist, glowing, concentric |
| Motion Dynamics | `mo-` | velvet, console, elastic, glitch, float, whip, spring |
| Spatial Density | `density-` | compact, normal, airy, wide |

## Lens System

Three viewports render the same component simultaneously at different zoom levels:

| Lens | Zoom | Type | Controls |
|---|---|---|---|
| Actual | 1× | Fixed | Hover for motion demo, toggle 1px view |
| Geometry | 2× | Pannable | Drag to pan, scroll to zoom, reset button |
| Surface | 0.75× | Pannable | Drag to pan, scroll to zoom, reset button |

All three lenses have a **maximize button** (⛶) that expands them to full viewport.

## CSS Architecture

`app.css` uses a strict 18-layer `@layer` cascade:

```
reset → tokens.primitives → tokens.semantic → tokens.component-defaults →
shell.layout → shell.sidebar → shell.lens → shell.mobile →
component.base → component.surface → component.shape → component.depth →
component.motion → component.density →
effects.holo-pan → effects.glitch → effects.demo → overrides
```

Token tiers:
- **Tier 1 Primitives** (`--_bg-*`, `--r-*`, `--sp-*`, `--z-*`) — raw palette and scale, read-only
- **Tier 2 Semantic** (`--bg`, `--panel`, `--text`, `--accent`) — intent-expressive aliases
- **Tier 3 Component** (`--comp-*`, `--btn-*`) — consumed directly by `.the-component`

## Extending

All extension tasks are data-driven — adding options, lenses, presets, schemes, and capability layers never requires touching any JavaScript file.

- **Add a new option** → [`docs/extend/1-adding-a-new-option.md`](docs/extend/1-adding-a-new-option.md)
- **Add a new design axis** → [`docs/extend/2-adding-a-parameter-type.md`](docs/extend/2-adding-a-parameter-type.md)
- **Add a new lens** → [`docs/extend/3-adding-a-new-lens.md`](docs/extend/3-adding-a-new-lens.md)
- **Add a capability layer** → [`docs/extend/4-capability-layers.md`](docs/extend/4-capability-layers.md)
- **Author presets/schemes** → [`docs/extend/5-presets-and-schemes.md`](docs/extend/5-presets-and-schemes.md)
- **Modify tokens** → [`docs/extend/6-modifying-tokens.md`](docs/extend/6-modifying-tokens.md)
- **Modify app config** → [`docs/extend/7-modifying-app-config.md`](docs/extend/7-modifying-app-config.md)

See [`docs/EXTENDING.md`](docs/EXTENDING.md) for a decision guide and file change matrix.

## Documentation

All architecture decisions, naming conventions, JSON schemas, and cross-file contracts live in the `/docs` directory:

| Document | Purpose |
|---|---|
| [`CONVENTIONS.md`](docs/CONVENTIONS.md) | Canonical naming and structural rules |
| [`SCHEMAS.md`](docs/SCHEMAS.md) | JSON Schema definitions for every config shape |
| [`TOKEN-MAP.md`](docs/TOKEN-MAP.md) | Complete token lineage mapping |
| [`PROP-SETS.md`](docs/PROP-SETS.md) | Authoritative per-prop registry |
| [`LAYER-STACK.md`](docs/LAYER-STACK.md) | `@layer` ordering and responsibilities |
| [`COMPONENT-CONTRACT.md`](docs/COMPONENT-CONTRACT.md) | Which propSets `.the-component` consumes |
| [`ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Module graph, data flow, and runtime cache contracts |
| [`DIAGRAMS.md`](docs/DIAGRAMS.md) | Mermaid flowcharts for every major runtime path |
| [`EXTENDING.md`](docs/EXTENDING.md) | Index and decision guide for extend/ guides |
