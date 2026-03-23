# HOWTO: Add a New Option to an Existing Parameter Type

This guide explains how to extend an existing `paramType` (e.g., `Surface`, `Shape`, `Depth`,
`Motion`, or `Density`) with a brand-new option — without touching any JavaScript.

***

## Overview

All `paramType` options are data-driven. Adding a new option requires:
1. A CSS class in `app.css` that sets the correct `--comp-*` / `--btn-*` tokens.
2. A new entry in `design.config.json` under the appropriate `paramType.options` array.

No JavaScript changes are ever needed to add a new option to an existing `paramType`.

***

## Step 1 — Write the CSS class

Open `app.css`. Find the `@layer component.[axis]` block that matches the `paramType`
you are extending. Add your new class inside that block.

The class name MUST follow the pattern `[cssPrefix]-[optionValue]`.
The CSS properties you set MUST only use tokens belonging to that `paramType`'s `propSetIds`.

### Example: Adding a new Surface called "neon"

```css
/* Inside @layer component.surface { ... */

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
/* Inside @layer component.shape { ... */

.shape-diamond {
  --comp-radius: 0px;
  --comp-clip: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  --btn-radius: 0px;
}
```

### Example: Adding a new Depth called "pressed"

```css
/* Inside @layer component.depth { ... */

.depth-pressed {
  --comp-shadow: inset 0 4px 8px rgba(0,0,0,0.6), inset 0 1px 2px rgba(0,0,0,0.4);
  --btn-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
  --comp-border: 1px solid rgba(0,0,0,0.5);
  --btn-border: 1px solid rgba(0,0,0,0.4);
}
```

### Example: Adding a new Motion called "snap"

```css
/* Inside @layer component.motion { ... */

.mo-snap {
  --comp-motion: all 80ms cubic-bezier(0.0, 0.0, 0.2, 1);
}
```

### Example: Adding a new Density called "ultra"

```css
/* Inside @layer component.density { ... */

.density-ultra {
  --comp-padding: 48px;
  --comp-gap: 24px;
  --comp-font-size-base: 1.1rem;
  --comp-line-height: 2;
  --btn-padding: 16px 36px;
}
```

## Step 2 — Register the option in design.config.json

Open `data/design.config.json`. Find the `paramTypes` array and locate the `paramType` object whose id matches the axis you extended.

Add a new object to the `options` array:
```json
{ "value": "neon", "label": "Neon — Hot Pink Terminal" }
```

For `Surface` options that require a custom font, add a `fontsource` field:

```json
{
  "value": "neon",
  "label": "Neon — Hot Pink Terminal",
  "fontsource": "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&display=swap"
}
```

The `fontsource` URL is lazy-loaded via `ensureFontLoaded()` in `state.js`
when that surface is first selected. It is only applicable to the `surface` `paramType`.

## Step 3 — (Demo only) Add a demo transform

If you want the Run Demo button to animate your new `Motion` option, add a rule inside `@layer effects.demo`:

```css
/* Inside @layer effects.demo { ... */

:root.fx-demo .the-component.mo-snap.demo-active {
  transform: scale(0.97) translateX(3px);
}

:root.fx-demo .lens-fixed .the-component.mo-snap:hover {
  transform: scale(0.97) translateX(3px);
}
```

The `.demo-active` class is added/removed by `triggerDemo()` in `main.js`.

## Checklist

 * [ ] CSS class added inside the correct `@layer component.[axis]` block
 * [ ] Class name follows `[cssPrefix]-[optionValue]`
 * [ ] Only props from the `paramType`'s `propSetIds` are set
 * [ ] `design.config.json` option entry added with value and label
 * [ ] `fontsource` added if a new web font is required (`Surface` only)
 * [ ] Demo transform added if extending the `Motion` `paramType`