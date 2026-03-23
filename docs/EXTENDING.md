# EXTENDING

Index and decision guide for extending Scheme Remix Studio. All extension tasks are data-driven — adding options, lenses, presets, schemes, and capability layers never requires touching any JavaScript file.

## Decision Table

| What you want to do | Guide |
|---|---|
| Add a new surface, shape, depth, motion, or density option | [`extend/1-adding-a-new-option.md`](extend/1-adding-a-new-option.md) |
| Add an entirely new design axis | [`extend/2-adding-a-parameter-type.md`](extend/2-adding-a-parameter-type.md) |
| Add a new lens viewport | [`extend/3-adding-a-new-lens.md`](extend/3-adding-a-new-lens.md) |
| Add a new CSS effect (capability layer) | [`extend/4-capability-layers.md`](extend/4-capability-layers.md) |
| Author presets and schemes | [`extend/5-presets-and-schemes.md`](extend/5-presets-and-schemes.md) |
| Modify color, spacing, or component tokens | [`extend/6-modifying-tokens.md`](extend/6-modifying-tokens.md) |
| Change camera limits, demo timing, or the app title | [`extend/7-modifying-app-config.md`](extend/7-modifying-app-config.md) |

## The "No JS" Principle

Adding options, lenses, presets, schemes, and capability layers **never requires touching any JavaScript file**. The UI, class builder, and lens factory are fully data-driven — they read `design.config.json`, `app.config.json`, and `library.json` at runtime and construct everything from those shapes.

Even adding a new `paramType` (design axis) only touches CSS and JSON; no JS changes are needed because `compClasses()` in `state.js` auto-iterates `DESIGN_CONFIG.paramTypes`.

Source: each extension guide's Overview section.

## File Change Matrix

| Extension Task | `app.css` | `design.config.json` | `app.config.json` | `library.json` | Any JS file |
|---|---|---|---|---|---|
| Add a new option | ✅ | ✅ | — | — | — |
| Add a new parameter type | ✅ | ✅ | — | — | — |
| Add a new lens | — | ✅ | — | — | — |
| Add a capability layer | ✅ | — | ✅ | — | — |
| Author presets/schemes | — | — | — | ✅ | — |
| Modify tokens | ✅ | — | ✅* | — | — |
| Modify app config | — | — | ✅ | — | — |

\* Only if adding new Tier 1 primitives (must register in `primitiveRegistry`).
