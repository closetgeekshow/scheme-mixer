# COMPONENT-CONTRACT

Defines which propSets `.the-component` consumes and why.

## Template Structure

The component template is cloned from `<template id="tpl-component">` in `index.html`:

```html
<div class="the-component">
  <h2>Design System</h2>
  <p>…</p>
  <div class="comp-actions">
    <button class="comp-btn">Primary</button>
    <button class="comp-btn secondary">Secondary</button>
  </div>
</div>
```

Clone site in code: `lens.js` `createLens()`:
```js
const compFragment = tplComponent.content.cloneNode(true);
const comp = compFragment.querySelector('.the-component');
comp.className = compClasses();
componentEls.add(comp);
```

## surfaceMaterial

**PropSet ID:** `surfaceMaterial`

Controls visual fill, typography, and button fills.

**Required props:**
- `--comp-bg`
- `--comp-bg-img`
- `--comp-bg-size`
- `--comp-bg-pos`
- `--comp-backdrop`
- `--comp-color`
- `--comp-font`
- `--comp-font-weight`
- `--comp-text-transform`
- `--comp-letter-spacing`
- `--btn-bg`
- `--btn-color`

**Font lazy-loading:** `ensureFontLoaded()` in `state.js` reads `fontsource` from `design.config.json` `paramTypes[0].options[*].fontsource` and injects a `<link rel="stylesheet">` into `<head>` when a surface with a custom font is first selected.

## shapeGeometry

**PropSet ID:** `shapeGeometry`

Controls the silhouette of the card and buttons.

**Required props:**
- `--comp-radius`
- `--comp-clip`
- `--btn-radius`
- `--btn-clip`

## depthElevation

**PropSet ID:** `depthElevation`

Controls perceived Z-space via borders and shadows.

**Required props:**
- `--comp-shadow`
- `--comp-border`
- `--btn-shadow`
- `--btn-border`

## motionDynamics

**PropSet ID:** `motionDynamics`

Controls transition timing and physical feel.

**Required props:**
- `--comp-motion`

**Demo interaction:** `effects.demo` layer scopes transforms under `:root.fx-demo .the-component.mo-[value].demo-active`. The `.demo-active` class is toggled by `triggerDemo()` in `main.js`.

## spatialDensity

**PropSet ID:** `spatialDensity`

Controls internal spacing and typography rhythm.

**Required props:**
- `--comp-padding`
- `--comp-gap`
- `--comp-font-size-base`
- `--comp-line-height`
- `--btn-padding`

## Class Application

`compClasses()` in `state.js` builds the class string:

```js
// Iterates DESIGN_CONFIG.paramTypes and concatenates cssPrefix + '-' + state[id]
// Example output:
"the-component surf-velvet shape-pill depth-raised mo-elastic density-normal"
```

`applyDesign()` stamps the result:
```js
for (const el of componentEls) el.className = cls;
```

## Invariant

Any future `propSet` addition MUST update this document and MUST add explicit CSS consumption in `@layer component.base`.

Source: `docs/extend/2-adding-a-parameter-type.md` step 5.
