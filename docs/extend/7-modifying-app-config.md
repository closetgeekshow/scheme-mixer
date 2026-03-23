# HOWTO: Modify App Behavior via `app.config.json`

`data/app.config.json` controls runtime behavior: camera physics, demo timing, active capability layers, and the primitive token registry. It does not contain any design option data — that lives in `design.config.json`.

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

**MUST NOT** rule: `zoomClamp[0]` MUST NOT be set below `0.1` — zero zoom causes division errors in `updateCamera()` in `lens.js`.

### Pan range

`camera.panClamp` sets how far the focal point can travel as a fraction of the component's width/height. `[-1, 1]` means the center can move one full component-width in any direction.

```json
"camera": {
  "panClamp": [-2, 2]
}
```

Increase the clamp range if you want users to be able to inspect areas far outside the component boundary (e.g., examining overflow shadows).

## Demo Duration

`demoActiveDuration` controls how long (in milliseconds) the `.demo-active` class remains on each component during a Run Demo sequence.

```json
"demoActiveDuration": 2400
```

- Lower values (800–1200ms) give a quick, punchy preview.
- Higher values (2000–3000ms) let slow transitions (like `mo-float`) complete.
- Components are staggered by 100ms each, so the last component's animation ends at `demoActiveDuration + (componentCount - 1) * 100` ms.

Source: `main.js` `triggerDemo()`.

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

- `alwaysOn: true` — `main.js` adds the id class to `:root` during init via `activateAlwaysOnCapabilities()`.
- `alwaysOn: false` — the layer is only activated by a Scheme (via `applyScheme()`).

To disable an always-on effect (e.g., to stop the holo-pan animation):
```json
{ "id": "fx-holo-pan", "layer": "effects.holo-pan", "alwaysOn": false, ... }
```

## Primitive Registry

The `primitiveRegistry` array documents all Tier 1 CSS custom properties. It is used by future developer and validation tooling — it has no runtime effect on the app.

```json
"primitiveRegistry": [
  { "name": "--_my-color", "cssType": "color" },
  { "name": "--_my-size",  "cssType": "length" }
]
```

Every `--_` prefixed token you add to `@layer tokens.primitives` in `app.css` MUST have a matching entry here.

## App Title and Subtitle

The sidebar title and subtitle are read from `app.config.json` at init time by `buildApp()` in `ui.js`:

```json
{
  "title": "My Design System",
  "subtitle": "Custom component explorer"
}
```

## Checklist

- [ ] `demoActiveDuration` is at least 800ms to allow slow transitions to show
- [ ] `zoomClamp[0]` is ≥ 0.1 (zero zoom causes division errors in camera math)
- [ ] `panClamp` values are symmetric (e.g., `[-1, 1]`) unless an asymmetric viewport is intended
- [ ] New capability layer entries have a unique id matching the `:root` class in `app.css`
- [ ] New Tier 1 primitives are registered in `primitiveRegistry`
