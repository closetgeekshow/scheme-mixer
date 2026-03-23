# HOWTO: Add Presets and Schemes to the Library

Presets are named snapshots of parameter selections. Schemes group presets
together with optional capability layer overrides to form a complete design story.
Both live exclusively in `data/library.json`. No JS or CSS changes are needed.

## Overview

`library.json`
├── `presets`   — named `{ paramId: optionValue }` maps
└── `schemes`   — ordered lists of preset IDs + optional capability layers

`applyScheme(schemeId)` in `main.js` processes schemes by:
 * Applying each referenced preset's selection map to state (later presets override earlier ones)
 * Resetting all non-`alwaysOn` capability layers from `:root`
 * Adding each `capabilityLayers` id to `:root`
 * Calling `applyDesign()` to reflect the new state

## Adding a Preset

A preset records one or more `paramId` → `optionValue` pairs. You do not need
to specify all `paramTypes` — unspecified axes keep their current values.

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
| `id` | string | ✅ | Unique identifier; referenced by Schemes |
| `label` | string | ✅ | Human-readable name |
| `description` | string | ❌ | Optional tooltip or docs text |
| `selection` | object | ✅ | `{ paramTypeId: optionValue }` map |

The selection keys must match `paramType.id` values in `design.config.json`.
The selection values must match valid `option.value` strings for that `paramType`.
Unknown keys are silently skipped by `applyScheme()`.

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
| `id` | string | ✅ | Unique identifier passed to `applyScheme()` |
| `label` | string | ✅ | Human-readable name |
| `description` | string | ❌ | Optional description |
| `presetIds` | string[] | ✅ | Ordered list of preset IDs to apply (min 1) |
| `capabilityLayers` | string[] | ❌ | Capability layer IDs to activate (overrides non-`alwaysOn` layers) |

## Invoking a Scheme

Call `applyScheme` from the browser console for testing:

```javascript
// The function is exported from main.js and attached to window during init
applyScheme('scheme-cyberpunk');
```

To wire it to a UI button, add a button in `index.html` and attach a listener
in `main.js`:

```javascript
// In main.js init block:
document.getElementById('btn-scheme-cyberpunk')
  ?.addEventListener('click', () => applyScheme('scheme-cyberpunk'));
```

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

## Checklist

 * [ ] Each preset has a unique id
 * [ ] Each preset's selection keys match valid `paramType.id` values
 * [ ] Each preset's selection values match valid `option.value` strings
 * [ ] Each scheme has a unique id
 * [ ] All `presetIds` in a scheme reference existing preset id values
 * [ ] All `capabilityLayers` ids are registered in `app.config.json` → `capabilityLayerRegistry`