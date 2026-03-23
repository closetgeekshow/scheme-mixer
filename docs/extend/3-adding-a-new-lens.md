# HOWTO: Add a New Lens

Lenses are the viewport panels that display `.the-component` at different zoom levels and focal points. All lens configuration is data-driven via `data/design.config.json`. No JavaScript changes are required.

## Overview

Each entry in `design.config.json` → `lenses` produces one `.lens` panel in the `#app` grid. There are two lens modes:

| Mode | `fixed: true` | `fixed: false` |
|---|---|---|
| Interaction | Static (hover only in demo mode) | Draggable + zoomable |
| CSS class | `.lens.lens-fixed` | `.lens` |
| Grid placement | `grid-column: 1 / 3; grid-row: 1` (spans full top row) | Bottom row, left or right |
| Toggle | Fit / 1× button | Maximize button |
| Badge | Top-left zoom + desc | Top-left + bottom-left with pan coordinates |

Only one fixed lens is expected. Non-fixed lenses fill the bottom row in order.

## Step 1 — Add the lens to `design.config.json`

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
| `id` | string | Unique identifier; used as the key in `cameras` and `lensCache` |
| `zoom` | number (min 0.1) | Initial zoom level (1 = 100%) |
| `desc` | string | Short label shown in the lens badge |
| `x` | number 0–1 | Initial horizontal focus point (0 = left edge, 1 = right edge) |
| `y` | number 0–1 | Initial vertical focus point (0 = top edge, 1 = bottom edge) |
| `fixed` | boolean | `true` = non-interactive, `false` = draggable and zoomable |

### Zoom range

The global zoom limits come from `data/app.config.json` → `camera.zoomClamp`. The default is `[0.5, 3]`. Adjust if you need a wider range.

## Step 2 — Adjust the app grid (optional)

The `#app` grid in `app.css` currently allocates:
- Row 1 — `2fr` (top, fixed lens)
- Row 2 — `1.2fr` (bottom, zoom lenses)

With three or more zoom lenses, the bottom row still auto-splits into equal columns because `grid-template-columns: repeat(2, minmax(0, 1fr))` handles two lenses.

For three zoom lenses, update the grid in `@layer shell.layout`:

```css
@layer shell.layout {
  #app {
    grid-template-columns: repeat(3, minmax(0, 1fr)); /* was repeat(2, ...) */
  }
}
```

The CSS selectors in `@layer shell.lens` that place lenses by `nth-of-type` may also need extending if you add a fourth or fifth lens panel:

```css
/* Add to @layer shell.lens */
#app > .lens:not(.lens-fixed):nth-of-type(4) {
  grid-column: 3;
  grid-row: 2;
}
```

## Step 3 — Test the new lens

- Reload `index.html` — the new lens panel should appear immediately.
- Drag inside the new lens to pan; scroll to zoom.
- Click the ⤢ maximize button to confirm full-screen toggle works.
- Click the reset (↺) button to confirm the lens returns to its `originCamera`.

### Camera reset behavior

`originCamera` is populated in `createLens()` from the lens config:
```js
originCamera: { zoom: lensConfig.zoom, x: lensConfig.x, y: lensConfig.y }
```

The reset button always restores to these initial values without re-reading the JSON, so changes to `design.config.json` take effect only on next page load.

## Checklist

- [ ] New lens object added to `design.config.json` → `lenses` with unique id
- [ ] `zoom` is within `app.config.json` → `camera.zoomClamp` range (or clamp updated)
- [ ] `fixed: false` for interactive lenses
- [ ] `#app` grid updated in `app.css` if adding more than two zoom lenses
- [ ] `nth-of-type` selectors in `shell.lens` extended if adding a 4th+ lens
- [ ] Manual test: drag, zoom, maximize, reset all work correctly
