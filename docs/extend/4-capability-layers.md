# HOWTO: Add a New Capability Layer Effect

Capability layers are opt-in CSS features activated by adding a class to `:root`. They live in their own named `@layer` blocks and are registered in `app.config.json`. Examples: `fx-holo-pan` (animates holographic backgrounds), `fx-demo` (motion previews).

## Overview

A capability layer consists of three parts:
- A named `@layer` block in `app.css` with scoped CSS rules
- A `:root.fx-[name]` class that gates the styles
- A registry entry in `app.config.json` → `capabilityLayerRegistry`

JavaScript activates registered layers automatically at init (if `alwaysOn: true`) or on demand via `applyScheme()` (if `alwaysOn: false`).

## Step 1 — Add the `@layer` block to `app.css`

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

> Rule: All rules MUST be scoped under `:root.fx-[name]` so the effect
> is completely inert until its class is present on `<html>`.

## Step 2 — Register in `app.config.json`

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
| `id` | string | The `:root` class that activates the layer (e.g., `fx-scanlines`) |
| `layer` | string | The `@layer` name in `app.css` (for documentation; not used at runtime) |
| `alwaysOn` | boolean | `true` = activated on init; `false` = activated only by a Scheme |
| `description` | string | Human-readable description shown in config tooling |

## Step 3 — Activate via a Scheme (for `alwaysOn: false` effects)

Non-always-on effects are activated by Schemes. Open `data/library.json` and add or update a Scheme entry with your new capability layer:

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
- Apply all presets in `presetIds`
- Remove all non-`alwaysOn` capability layer classes from `:root`
- Add each id in `capabilityLayers` to `:root`

## Step 4 — Manual activation (for testing)

You can temporarily activate any capability layer from the browser console:

```javascript
document.documentElement.classList.add('fx-scanlines');
// To deactivate:
document.documentElement.classList.remove('fx-scanlines');
```

## Step 5 — Update `test.html`

Check 6.13 in `test.html` verifies that specific `:root` classes are present. If your new layer is `alwaysOn: true`, add it to the check:

```javascript
// 6.13 Capability layers
const hasDemo  = classes.includes('fx-demo');
const hasHolo  = classes.includes('fx-holo-pan');
const hasScan  = classes.includes('fx-scanlines'); // add if alwaysOn
const status   = hasDemo && hasHolo && hasScan ? 'PASS' : 'FAIL';
```

## Checklist

- [ ] New `@layer` name added to the `@layer` declaration in `app.css`
- [ ] `@layer effects.[name]` block added with all rules scoped under `:root.fx-[name]`
- [ ] Entry added to `app.config.json` → `capabilityLayerRegistry`
- [ ] If `alwaysOn: false`, a Scheme in `library.json` references the layer id
- [ ] Browser console test confirms the effect activates and deactivates correctly
- [ ] `test.html` check 6.13 updated if `alwaysOn: true`
