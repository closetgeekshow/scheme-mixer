
## 1. Adding a New Parameter Option

````markdown
```markdown
# HOWTO: Add a New Option to an Existing Parameter Type

This guide explains how to extend an existing paramType (e.g., Surface, Shape, Depth,
Motion, or Density) with a brand-new option — without touching any JavaScript.

***

## Overview

All paramType options are data-driven. Adding a new option requires:
1. A CSS class in `app.css` that sets the correct `--comp-*` / `--btn-*` tokens.
2. A new entry in `design.config.json` under the appropriate `paramType.options` array.

No JavaScript changes are ever needed to add a new option to an existing paramType.

***

## Step 1 — Write the CSS class

Open `app.css`. Find the `@layer component.[axis]` block that matches the paramType
you are extending. Add your new class inside that block.

The class name MUST follow the pattern `[cssPrefix]-[optionValue]`.
The CSS properties you set MUST only use tokens belonging to that paramType's `propSetIds`.

### Example: Adding a new Surface called "neon"

```css
/* Inside @layer component.surface { ... } */

.surf-neon {
  --comp-bg: #0d0d0d;
  --comp-color: #ff00ff;
  --comp-font: "IBM Plex Mono", monospace;
  --btn-bg: transparent;
  --btn-color: #ff00ff;
  --btn-border: 1px solid #ff00ff;
}
```

### Example: Adding a new Shape called "diamond"

```css
/* Inside @layer component.shape { ... } */

.shape-diamond {
  --comp-radius: 0px;
  --comp-clip: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  --btn-radius: 0px;
}
```

### Example: Adding a new Depth called "pressed"

```css
/* Inside @layer component.depth { ... } */

.depth-pressed {
  --comp-shadow: inset 0 4px 8px rgba(0,0,0,0.6), inset 0 1px 2px rgba(0,0,0,0.4);
  --btn-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
  --comp-border: 1px solid rgba(0,0,0,0.5);
  --btn-border: 1px solid rgba(0,0,0,0.4);
}
```

### Example: Adding a new Motion called "snap"

```css
/* Inside @layer component.motion { ... } */

.mo-snap {
  --comp-motion: all 80ms cubic-bezier(0.0, 0.0, 0.2, 1);
}
```

### Example: Adding a new Density called "ultra"

```css
/* Inside @layer component.density { ... } */

.density-ultra {
  --comp-padding: 48px;
  --comp-gap: 24px;
  --comp-font-size-base: 1.1rem;
  --comp-line-height: 2;
  --btn-padding: 16px 36px;
}
```

***

## Step 2 — Register the option in design.config.json

Open `data/design.config.json`. Find the `paramTypes` array and locate the
`paramType` object whose `id` matches the axis you extended.

Add a new object to the `options` array:

```json
{ "value": "neon", "label": "Neon — Hot Pink Terminal" }
```

For Surface options that require a custom font, add a `fontsource` field:

```json
{
  "value": "neon",
  "label": "Neon — Hot Pink Terminal",
  "fontsource": "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&display=swap"
}
```

The `fontsource` URL is lazy-loaded via `ensureFontLoaded()` in `state.js`
when that surface is first selected. It is only applicable to the `surface` paramType.

***

## Step 3 — (Demo only) Add a demo transform

If you want the **Run Demo** button to animate your new Motion option, add a rule
inside `@layer effects.demo`:

```css
/* Inside @layer effects.demo { ... } */

:root.fx-demo .the-component.mo-snap.demo-active {
  transform: scale(0.97) translateX(3px);
}

:root.fx-demo .lens-fixed .the-component.mo-snap:hover {
  transform: scale(0.97) translateX(3px);
}
```

The `.demo-active` class is added/removed by `triggerDemo()` in `main.js`.

***

## Checklist

- [ ] CSS class added inside the correct `@layer component.[axis]` block
- [ ] Class name follows `[cssPrefix]-[optionValue]`
- [ ] Only props from the paramType's `propSetIds` are set
- [ ] `design.config.json` option entry added with `value` and `label`
- [ ] `fontsource` added if a new web font is required (Surface only)
- [ ] Demo transform added if extending the Motion paramType
```
````

***

## 2. Adding a New Parameter Type (Axis)

````markdown
```markdown
# HOWTO: Add a New Parameter Type (Design Axis)

This guide walks through adding a completely new design axis — a new dropdown in the
sidebar with its own set of CSS tokens that control a new visual dimension.

***

## Overview

A "parameter type" (paramType) is one independently-controllable design axis,
such as Surface Material, Shape Geometry, or Spatial Density. Each paramType maps
to one CSS class applied to `.the-component` and a set of CSS custom properties
(a propSet) those classes override.

Adding a new paramType touches three files:
1. `data/design.config.json` — declare the propSet and paramType
2. `app.css` — add `tokens.component-defaults` entries + a new `@layer` block
3. `docs/COMPONENT-CONTRACT.md` — update the contract (documentation)

No changes to any JavaScript file are required.

***

## Step 1 — Design your new tokens

Decide what CSS custom properties your new axis will control.
Token names MUST follow the `--comp-*` or `--btn-*` naming convention.

**Example axis: "Border Style"** — controls decorative border patterns.

New tokens:
- `--comp-border-style` — CSS `border-style` value (e.g., `solid`, `dashed`, `double`)
- `--comp-border-width` — CSS `border-width` value (e.g., `1px`, `3px`)

***

## Step 2 — Add a propSet to design.config.json

Open `data/design.config.json`. Add a new object to the top-level `propSets` array.

```json
{
  "id": "borderStyle",
  "label": "Border Style",
  "props": [
    {
      "name": "--comp-border-style",
      "cssType": "string",
      "initial": "solid",
      "registerProperty": false
    },
    {
      "name": "--comp-border-width",
      "cssType": "length",
      "initial": "1px",
      "registerProperty": true
    }
  ]
}
```

- `id` — lowerCamelCase unique identifier for the propSet.
- `initial` — the default value, declared in `tokens.component-defaults` (Step 4).
- `registerProperty: true` — use for interpolatable types (length, number, color)
  to enable CSS `@property` registration and smooth transitions.

***

## Step 3 — Add the paramType to design.config.json

In the same file, add a new object to the `paramTypes` array:

```json
{
  "id": "borderStyle",
  "cssPrefix": "bdr",
  "label": "Border Style",
  "description": "Controls the decorative border treatment of the component",
  "propSetIds": ["borderStyle"],
  "options": [
    { "value": "none",   "label": "None — Invisible Border" },
    { "value": "solid",  "label": "Solid — Clean Line" },
    { "value": "dashed", "label": "Dashed — Broken Line" },
    { "value": "double", "label": "Double — Classic Frame" },
    { "value": "groove", "label": "Groove — Engraved Effect" }
  ]
}
```

- `id` — must be unique across all paramTypes; used as the `state` key.
- `cssPrefix` — the prefix for all CSS option classes (`bdr-none`, `bdr-solid`, etc.).
- `propSetIds` — references one or more propSet `id` values from Step 2.
- `options[].value` — combined with `cssPrefix` to form the class name.

***

## Step 4 — Add default token values to app.css

Open `app.css`. Find `@layer tokens.component-defaults`. Add your new tokens'
default values inside the `:root` block:

```css
@layer tokens.component-defaults {
  :root {
    /* ... existing tokens ... */

    /* Border Style defaults */
    --comp-border-style: solid;
    --comp-border-width: 1px;
  }
}
```

> **Rule:** Fallback values for component tokens MUST be defined only here,
> never inline inside component or option rules.

***

## Step 5 — Consume the tokens in component.base

Open `app.css` and find `@layer component.base`. Add your new tokens to `.the-component`
and/or `.comp-btn` so they are actually applied:

```css
@layer component.base {
  .the-component {
    /* ... existing properties ... */
    border-style: var(--comp-border-style);
    border-width: var(--comp-border-width);
  }
}
```

Update `docs/COMPONENT-CONTRACT.md` to document this new consumption.

***

## Step 6 — Add the CSS option classes

Declare a new `@layer` block in `app.css`. It MUST be placed AFTER
`component.density` and BEFORE `effects.holo-pan` in the layer stack.
Register it in the `@layer` declaration at the top of the file first:

```css
/* At the top of app.css, update the @layer declaration: */
@layer
  reset,
  tokens.primitives,
  tokens.semantic,
  tokens.component-defaults,
  shell.layout,
  shell.sidebar,
  shell.lens,
  shell.mobile,
  component.base,
  component.surface,
  component.shape,
  component.depth,
  component.motion,
  component.density,
  component.border,        /* ← new layer */
  effects.holo-pan,
  effects.glitch,
  effects.demo,
  overrides;
```

Then add the layer block:

```css
/* ===========================
   Component — Border Style
   =========================== */
@layer component.border {
  .bdr-none {
    --comp-border-style: none;
    --comp-border-width: 0px;
  }

  .bdr-solid {
    --comp-border-style: solid;
    --comp-border-width: 1px;
  }

  .bdr-dashed {
    --comp-border-style: dashed;
    --comp-border-width: 2px;
  }

  .bdr-double {
    --comp-border-style: double;
    --comp-border-width: 4px;
  }

  .bdr-groove {
    --comp-border-style: groove;
    --comp-border-width: 3px;
  }
}
```

***

## Step 7 — Verify the class builder contract

`compClasses()` in `state.js` auto-generates one class per paramType by iterating
`DESIGN_CONFIG.paramTypes`. No JS changes are needed. After adding the new paramType,
`.the-component` will have one additional class: `bdr-[selectedValue]`.

Run `test.html` and verify check 6.5 ("Class builder") passes — the expected count
will now be 7 (one per paramType + `the-component`). Update the test if needed.

***

## Checklist

- [ ] `propSet` added to `design.config.json` with correct `id`, `label`, and `props`
- [ ] `paramType` added to `design.config.json` with `id`, `cssPrefix`, `propSetIds`, and `options`
- [ ] Default token values added to `tokens.component-defaults` in `app.css`
- [ ] Tokens consumed in `@layer component.base` on `.the-component` and/or `.comp-btn`
- [ ] New `@layer component.[name]` block added and registered in the `@layer` declaration
- [ ] One CSS class per option value following `[cssPrefix]-[value]`
- [ ] `docs/COMPONENT-CONTRACT.md` updated
- [ ] `test.html` check 6.5 class count updated
```
````

***

## 3. Adding a New Lens

````markdown
```markdown
# HOWTO: Add a New Lens

Lenses are the viewport panels that display `.the-component` at different zoom
levels and focal points. All lens configuration is data-driven via
`data/design.config.json`. No JavaScript changes are required.

***

## Overview

Each entry in `design.config.json → lenses` produces one `.lens` panel in the `#app`
grid. There are two lens modes:

| Mode | `fixed: true` | `fixed: false` |
|---|---|---|
| Interaction | Static (hover only in demo mode) | Draggable + zoomable |
| CSS class | `.lens.lens-fixed` | `.lens` |
| Grid placement | `grid-column: 1 / 3; grid-row: 1` (spans full top row) | Bottom row, left or right |
| Toggle | Fit / 1× button | Maximize button |
| Badge | Top-left zoom + desc | Top-left + bottom-left with pan coordinates |

Only **one** fixed lens is expected. Non-fixed lenses fill the bottom row in order.

***

## Step 1 — Add the lens to design.config.json

Open `data/design.config.json`. Add a new object to the `lenses` array.

```json
{
  "id": "detail",
  "zoom": 3,
  "desc": "Detail",
  "x": 0.75,
  "y": 0.25,
  "fixed": false
}
```

### Field Reference

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier; used as the key in `cameras` and `lensCache` |
| `zoom` | `number` (min 0.1) | Initial zoom level (1 = 100%) |
| `desc` | `string` | Short label shown in the lens badge |
| `x` | `number` 0–1 | Initial horizontal focus point (0 = left edge, 1 = right edge) |
| `y` | `number` 0–1 | Initial vertical focus point (0 = top edge, 1 = bottom edge) |
| `fixed` | `boolean` | `true` = non-interactive, `false` = draggable and zoomable |

### Zoom range

The global zoom limits come from `data/app.config.json → camera.zoomClamp`.
The default is `[0.5, 3]`. Adjust if you need a wider range.

***

## Step 2 — Adjust the app grid (optional)

The `#app` grid in `app.css` currently allocates:
- **Row 1** — 2fr (top, fixed lens)
- **Row 2** — 1.2fr (bottom, zoom lenses)

With three or more zoom lenses, the bottom row still auto-splits into equal columns
because `grid-template-columns: repeat(2, minmax(0, 1fr))` handles two lenses.

For three zoom lenses, update the grid in `@layer shell.layout`:

```css
@layer shell.layout {
  #app {
    grid-template-columns: repeat(3, minmax(0, 1fr)); /* was repeat(2, ...) */
  }
}
```

The CSS selectors in `@layer shell.lens` that place lenses by `nth-of-type` may also
need extending if you add a fourth or fifth lens panel:

```css
/* Add to @layer shell.lens */
#app > .lens:not(.lens-fixed):nth-of-type(4) {
  grid-column: 3;
  grid-row: 2;
}
```

***

## Step 3 — Test the new lens

1. Reload `index.html` — the new lens panel should appear immediately.
3. Drag inside the new lens to pan; scroll to zoom.
4. Click the ⤢ maximize button to confirm full-screen toggle works.
5. Click the reset (↺) button to confirm the lens returns to its `originCamera`.

***

## Camera reset behavior

`originCamera` is populated in `createLens()` from the lens config:

```js
originCamera: { zoom: lensConfig.zoom, x: lensConfig.x, y: lensConfig.y }
```

The reset button always restores to these initial values without re-reading the JSON,
so changes to `design.config.json` take effect only on next page load.

***

## Checklist

- [ ] New lens object added to `design.config.json → lenses` with unique `id`
- [ ] `zoom` is within `app.config.json → camera.zoomClamp` range (or clamp updated)
- [ ] `fixed: false` for interactive lenses
- [ ] `#app` grid updated in `app.css` if adding more than two zoom lenses
- [ ] `nth-of-type` selectors in `shell.lens` extended if adding a 4th+ lens
- [ ] Manual test: drag, zoom, maximize, reset all work correctly
```
````

***

## 4. Adding a New Capability Layer Effect

````markdown
```markdown
# HOWTO: Add a New Capability Layer Effect

Capability layers are opt-in CSS features activated by adding a class to `:root`.
They live in their own named `@layer` blocks and are registered in `app.config.json`.
Examples: `fx-holo-pan` (animates holographic backgrounds), `fx-demo` (motion previews).

***

## Overview

A capability layer consists of three parts:
1. A named `@layer` block in `app.css` with scoped CSS rules
2. A `:root.fx-[name]` class that gates the styles
3. A registry entry in `app.config.json → capabilityLayerRegistry`

JavaScript activates registered layers automatically at init (if `alwaysOn: true`)
or on demand via `applyScheme()` (if `alwaysOn: false`).

***

## Step 1 — Add the @layer block to app.css

Register your new layer name in the `@layer` declaration at the top of `app.css`:

```css
@layer
  /* ... existing layers ... */
  effects.holo-pan,
  effects.glitch,
  effects.demo,
  effects.scanlines,   /* ← new */
  overrides;
```

Then add the layer block with scoped CSS using `:root.fx-scanlines` as the gate:

```css
/* ===========================
   Effects — Scanlines
   =========================== */
@layer effects.scanlines {
  @keyframes scanline-scroll {
    from { background-position: 0 0; }
    to   { background-position: 0 4px; }
  }

  :root.fx-scanlines .the-component::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 2px,
      rgba(0, 0, 0, 0.08) 2px,
      rgba(0, 0, 0, 0.08) 4px
    );
    animation: scanline-scroll 0.5s linear infinite;
    pointer-events: none;
    border-radius: inherit;
  }
}
```

> **Rule:** All rules MUST be scoped under `:root.fx-[name]` so the effect
> is completely inert until its class is present on `<html>`.

***

## Step 2 — Register in app.config.json

Open `data/app.config.json`. Add an entry to `capabilityLayerRegistry`:

```json
{
  "id": "fx-scanlines",
  "layer": "effects.scanlines",
  "alwaysOn": false,
  "description": "Overlays an animated CRT scanline effect on all components."
}
```

### Field Reference

| Field | Type | Description |
|---|---|---|
| `id` | `string` | The `:root` class that activates the layer (e.g., `fx-scanlines`) |
| `layer` | `string` | The `@layer` name in `app.css` (for documentation; not used at runtime) |
| `alwaysOn` | `boolean` | `true` = activated on init; `false` = activated only by a Scheme |
| `description` | `string` | Human-readable description shown in config tooling |

***

## Step 3 — Activate via a Scheme (for alwaysOn: false effects)

Non-always-on effects are activated by Schemes. Open `data/library.json`
and add or update a Scheme entry with your new capability layer:

```json
{
  "id": "retro-terminal",
  "label": "Retro Terminal",
  "description": "Console surface with CRT scanlines",
  "presetIds": ["preset-console-sharp"],
  "capabilityLayers": ["fx-scanlines"]
}
```

When `applyScheme('retro-terminal')` is called from `main.js`, it will:
1. Apply all presets in `presetIds`
2. Remove all non-`alwaysOn` capability layer classes from `:root`
3. Add each id in `capabilityLayers` to `:root`

***

## Step 4 — Manual activation (for testing)

You can temporarily activate any capability layer from the browser console:

```js
document.documentElement.classList.add('fx-scanlines');
// To deactivate:
document.documentElement.classList.remove('fx-scanlines');
```

***

## Step 5 — Update test.html

Check 6.13 in `test.html` verifies that specific `:root` classes are present.
If your new layer is `alwaysOn: true`, add it to the check:

```js
// 6.13 Capability layers
const hasDemo  = classes.includes('fx-demo');
const hasHolo  = classes.includes('fx-holo-pan');
const hasScan  = classes.includes('fx-scanlines'); // add if alwaysOn
const status   = hasDemo && hasHolo && hasScan ? 'PASS' : 'FAIL';
```

***

## Checklist

- [ ] New `@layer` name added to the `@layer` declaration in `app.css`
- [ ] `@layer effects.[name]` block added with all rules scoped under `:root.fx-[name]`
- [ ] Entry added to `app.config.json → capabilityLayerRegistry`
- [ ] If `alwaysOn: false`, a Scheme in `library.json` references the layer id
- [ ] Browser console test confirms the effect activates and deactivates correctly
- [ ] `test.html` check 6.13 updated if `alwaysOn: true`
```
````

***

## 5. Adding Presets and Schemes to the Library

````markdown
```markdown
# HOWTO: Add Presets and Schemes to the Library

Presets are named snapshots of parameter selections. Schemes group presets
together with optional capability layer overrides to form a complete design story.

Both live exclusively in `data/library.json`. No JS or CSS changes are needed.

***

## Overview

```
library.json
├── presets   — named { paramId: optionValue } maps
└── schemes   — ordered lists of preset IDs + optional capability layers
```

`applyScheme(schemeId)` in `main.js` processes schemes by:
1. Applying each referenced preset's `selection` map to `state` (later presets override earlier ones)
2. Resetting all non-`alwaysOn` capability layers from `:root`
3. Adding each `capabilityLayers` id to `:root`
4. Calling `applyDesign()` to reflect the new state

***

## Adding a Preset

A preset records one or more `paramId → optionValue` pairs. You do not need
to specify all paramTypes — unspecified axes keep their current values.

```json
{
  "id": "preset-brutalist-wide",
  "label": "Brutalist Wide",
  "description": "Harsh borders, sharp edges, and spacious density",
  "selection": {
    "surface": "grunge",
    "shape":   "sharp",
    "depth":   "brutalist",
    "motion":  "glitch",
    "density": "wide"
  }
}
```

### Field Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✅ | Unique identifier; referenced by Schemes |
| `label` | `string` | ✅ | Human-readable name |
| `description` | `string` | ❌ | Optional tooltip or docs text |
| `selection` | `object` | ✅ | `{ paramTypeId: optionValue }` map |

The `selection` keys must match `paramType.id` values in `design.config.json`.
The `selection` values must match valid `option.value` strings for that paramType.
Unknown keys are silently skipped by `applyScheme()`.

***

## Adding a Scheme

A Scheme references one or more preset IDs. Multiple presets are merged in order —
properties from later presets override earlier ones.

```json
{
  "id": "scheme-cyberpunk",
  "label": "Cyberpunk",
  "description": "Neon-edged, glitch-motion, compact density",
  "presetIds": [
    "preset-console-base",
    "preset-glowing-depth"
  ],
  "capabilityLayers": ["fx-scanlines"]
}
```

### Field Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✅ | Unique identifier passed to `applyScheme()` |
| `label` | `string` | ✅ | Human-readable name |
| `description` | `string` | ❌ | Optional description |
| `presetIds` | `string[]` | ✅ | Ordered list of preset IDs to apply (min 1) |
| `capabilityLayers` | `string[]` | ❌ | Capability layer IDs to activate (overrides non-alwaysOn layers) |

***

## Invoking a Scheme

Call `applyScheme` from the browser console for testing:

```js
// The function is exported from main.js and attached to window during init
applyScheme('scheme-cyberpunk');
```

To wire it to a UI button, add a button in `index.html` and attach a listener
in `main.js`:

```js
// In main.js init block:
document.getElementById('btn-scheme-cyberpunk')
  ?.addEventListener('click', () => applyScheme('scheme-cyberpunk'));
```

***

## Complete library.json Example

```json
{
  "presets": [
    {
      "id": "preset-console-base",
      "label": "Console Base",
      "selection": {
        "surface": "console",
        "shape": "sharp",
        "motion": "console"
      }
    },
    {
      "id": "preset-glowing-depth",
      "label": "Glowing Depth",
      "selection": {
        "depth": "glowing",
        "density": "compact"
      }
    },
    {
      "id": "preset-brutalist-wide",
      "label": "Brutalist Wide",
      "description": "Harsh borders with spacious density",
      "selection": {
        "surface": "grunge",
        "shape": "sharp",
        "depth": "brutalist",
        "motion": "glitch",
        "density": "wide"
      }
    }
  ],
  "schemes": [
    {
      "id": "scheme-cyberpunk",
      "label": "Cyberpunk",
      "description": "Terminal aesthetic with scanlines and glowing edges",
      "presetIds": ["preset-console-base", "preset-glowing-depth"],
      "capabilityLayers": ["fx-scanlines"]
    },
    {
      "id": "scheme-brutalist",
      "label": "Brutalist",
      "presetIds": ["preset-brutalist-wide"]
    }
  ]
}
```

***

## Checklist

- [ ] Each preset has a unique `id`
- [ ] Each preset's `selection` keys match valid `paramType.id` values
- [ ] Each preset's `selection` values match valid `option.value` strings
- [ ] Each scheme has a unique `id`
- [ ] All `presetIds` in a scheme reference existing preset `id` values
- [ ] All `capabilityLayers` ids are registered in `app.config.json → capabilityLayerRegistry`
```
````

***

## 6. Modifying Design Tokens

````markdown
```markdown
# HOWTO: Modify Design Tokens

Scheme Remix Studio uses a three-tier CSS custom property system.
Modifications at each tier have different scopes and rules.

***

## Token Tiers

| Tier | Where | Prefix | Scope |
|---|---|---|---|
| 1 — Primitives | `@layer tokens.primitives` | `--_` | Raw palette and scale values; read-only at runtime |
| 2 — Semantic | `@layer tokens.semantic` | none | Intent aliases; reference Tier 1 values |
| 3 — Component Defaults | `@layer tokens.component-defaults` | `--comp-*`, `--btn-*` | Default values for all component axes |

***

## Modifying Tier 1 Primitives

Tier 1 tokens define the raw color palette, spacing scale, radius scale, and z-index scale.
Edit them in `@layer tokens.primitives` in `app.css`.

```css
@layer tokens.primitives {
  :root {
    --_accent: #ff6b6b;      /* was #6b8aff — change accent to red */
    --_green: #a3e635;       /* was #2dd4bf — change green to lime */
    --_bg-950: #050510;      /* was #0a0a0a — slightly blue-black background */
    --sidebar-width: 320px;  /* was 280px — wider sidebar */
  }
}
```

**Rule:** Any new Tier 1 primitive MUST also be added to `app.config.json → primitiveRegistry`:

```json
{ "name": "--_my-new-color", "cssType": "color" }
```

***

## Modifying Tier 2 Semantic Tokens

Tier 2 tokens map semantic names to Tier 1 values. Changing a semantic token
updates every UI element that references it.

```css
@layer tokens.semantic {
  :root {
    --accent: #ff6b6b;                          /* point directly to a value */
    --panel: color-mix(in srgb, var(--_bg-950) 80%, #001122); /* or mix */
  }
}
```

**Common modifications:**

| Goal | Token to change |
|---|---|
| Change all accent highlights | `--accent` |
| Change sidebar/panel background | `--panel`, `--panel-2` |
| Change body background | `--bg` |
| Change default text color | `--text` |
| Change all borders | `--border`, `--border-2` |
| Change monospace font | `--mono` |
| Change sans-serif font | `--sans` |

***

## Modifying Tier 3 Component Defaults

Tier 3 tokens set the fallback values for `.the-component` and `.comp-btn` before
any paramType option class overrides them.

Changing these values affects the "default" appearance before any option is selected
and provides the initial state for CSS transitions.

```css
@layer tokens.component-defaults {
  :root {
    --comp-bg: #f8f8f8;         /* lighter default background */
    --comp-radius: 12px;        /* larger default corner radius */
    --comp-padding: 32px;       /* more spacious default padding */
    --comp-motion: all 200ms ease-out; /* snappier default transition */
  }
}
```

**Rule:** Fallbacks for component tokens MUST be defined only here,
never inline inside component option rules like `.surf-velvet { ... }`.

***

## Modifying the Layout

To change the sidebar width, update the Tier 1 primitive:

```css
@layer tokens.primitives {
  :root {
    --sidebar-width: 320px; /* default: 280px */
  }
}
```

To change the lens grid ratio (how much vertical space the fixed lens takes):

```css
@layer shell.layout {
  #app {
    grid-template-rows: minmax(0, 3fr) minmax(0, 1fr); /* more space for main lens */
  }
}
```

***

## Adding a New Tier 1 Primitive

1. Add the value to `@layer tokens.primitives`:

```css
--_purple: #a855f7;
```

2. Optionally expose it as a semantic alias in `@layer tokens.semantic`:

```css
--highlight: var(--_purple);
```

3. Register it in `data/app.config.json → primitiveRegistry`:

```json
{ "name": "--_purple", "cssType": "color" }
```

***

## The @layer overrides Safety Valve

The final `@layer overrides` block in `app.css` is reserved for targeted
fixes and one-off tweaks that must take precedence over all other layers.
Use it sparingly:

```css
@layer overrides {
  /* Force minimum component width in zoom lenses */
  .lens:not(.lens-fixed) .the-component {
    min-width: 280px;
  }
}
```

***

## Checklist

- [ ] Tier 1 changes: new primitives also added to `app.config.json → primitiveRegistry`
- [ ] Tier 3 changes: defaults only in `tokens.component-defaults`, never inline
- [ ] `--sidebar-width` change is consistent with any mobile breakpoint adjustments
- [ ] New semantic tokens reference Tier 1 primitives where possible
- [ ] `@layer overrides` used only for targeted bugfixes, not general styling
```
````

***

## 7. Modifying App Behavior (app.config.json)

````markdown
```markdown
# HOWTO: Modify App Behavior via app.config.json

`data/app.config.json` controls runtime behavior: camera physics, demo timing,
active capability layers, and the primitive token registry.
It does not contain any design option data — that lives in `design.config.json`.

***

## Schema Reference

```json
{
  "title": "string",
  "subtitle": "string",
  "demoActiveDuration": 1800,
  "camera": {
    "panClamp": [-1, 1],
    "zoomClamp": [0.5, 3]
  },
  "capabilityLayerRegistry": [ /* ... */ ],
  "primitiveRegistry": [ /* ... */ ]
}
```

***

## Camera Physics

### Zoom range

`camera.zoomClamp` sets the minimum and maximum zoom for all draggable lenses.

```json
"camera": {
  "zoomClamp": [0.25, 6]
}
```

- `[0.5, 3]` — default; usable range for most components
- `[0.1, 10]` — extreme range for micro-detail inspection

### Pan range

`camera.panClamp` sets how far the focal point can travel as a fraction of
the component's width/height. `[-1, 1]` means the center can move one full
component-width in any direction.

```json
"camera": {
  "panClamp": [-2, 2]
}
```

Increase the clamp range if you want users to be able to inspect areas far
outside the component boundary (e.g., examining overflow shadows).

***

## Demo Duration

`demoActiveDuration` controls how long (in milliseconds) the `.demo-active`
class remains on each component during a Run Demo sequence.

```json
"demoActiveDuration": 2400
```

- Lower values (800–1200ms) give a quick, punchy preview.
- Higher values (2000–3000ms) let slow transitions (like `mo-float`) complete.
- Components are staggered by 100ms each, so the last component's animation
  ends at `demoActiveDuration + (componentCount - 1) * 100` ms.

***

## Capability Layer Registry

Each entry controls an opt-in CSS effect layer:

```json
{
  "id": "fx-scanlines",
  "layer": "effects.scanlines",
  "alwaysOn": false,
  "description": "CRT scanline overlay effect."
}
```

- `alwaysOn: true` — `main.js` adds the `id` class to `:root` during init.
- `alwaysOn: false` — the layer is only activated by a Scheme (via `applyScheme()`).

To disable an always-on effect (e.g., to stop the holo-pan animation):

```json
{ "id": "fx-holo-pan", "layer": "effects.holo-pan", "alwaysOn": false, ... }
```

***

## Primitive Registry

The `primitiveRegistry` array documents all Tier 1 CSS custom properties.
It will be used by future developer tooling — it has no runtime effect on the app.

```json
"primitiveRegistry": [
  { "name": "--_my-color", "cssType": "color" },
  { "name": "--_my-size",  "cssType": "length" }
]
```

Every `--_` prefixed token you add to `@layer tokens.primitives` in `app.css`
MUST have a matching entry here.

***

## App Title and Subtitle

The sidebar title and subtitle are read from `app.config.json` at init time
by `buildApp()` in `ui.js`:

```json
{
  "title": "My Design System",
  "subtitle": "Custom component explorer"
}
```

***

## Checklist

- [ ] `demoActiveDuration` is at least 800ms to allow slow transitions to show
- [ ] `zoomClamp[0]` is ≥ 0.1 (zero zoom causes division errors in camera math)
- [ ] `panClamp` values are symmetric (e.g., `[-1, 1]`) unless an asymmetric viewport is intended
- [ ] New capability layer entries have a unique `id` matching the `:root` class in `app.css`
- [ ] New Tier 1 primitives are registered in `primitiveRegistry`

