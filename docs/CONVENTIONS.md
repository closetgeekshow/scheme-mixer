# CONVENTIONS

Canonical naming and structural conventions for Scheme Remix Studio. All code, config, and documentation MUST adhere to these invariants.

## 1.1 CSS Custom Property Naming

Three tiers of CSS custom properties, each with a distinct prefix and purpose.

| Tier | Prefix | Example | Where defined |
|---|---|---|---|
| 1 — Primitives | `--_` | `--_bg-950`, `--_accent`, `--r-xs` | `@layer tokens.primitives` in `app.css` |
| 2 — Semantic | none | `--bg`, `--panel`, `--accent` | `@layer tokens.semantic` in `app.css` |
| 3 — Component Defaults | `--comp-*` / `--btn-*` | `--comp-bg`, `--btn-bg` | `@layer tokens.component-defaults` in `app.css` |

**Rules:**
- Tier 1 primitives MUST use the `--_` prefix and are read-only at runtime.
- Tier 2 semantic tokens MUST have no prefix and express intent while referencing Tier 1 values.
- Tier 3 component tokens MUST use `--comp-*` or `--btn-*` prefixes.
- Fallbacks for component tokens MUST be defined only in `tokens.component-defaults`, never inline inside option classes.
- Any newly introduced Tier 1 primitive MUST also be registered in `app.config.json.primitiveRegistry`.

Source: `app.css` `@layer tokens.primitives`, `@layer tokens.semantic`, `@layer tokens.component-defaults`; `data/app.config.json` `primitiveRegistry`.

## 1.2 PropSet and ParamType IDs

All `propSet` and `paramType` IDs MUST use lowerCamelCase.

**Live propSet IDs** (source: `data/design.config.json` `propSets[*].id`):
- `surfaceMaterial`
- `shapeGeometry`
- `depthElevation`
- `motionDynamics`
- `spatialDensity`

**Live paramType IDs** (source: `data/design.config.json` `paramTypes[*].id`):
- `surface`
- `shape`
- `depth`
- `motion`
- `density`

## 1.3 CSS Option Class Pattern

All paramType option classes MUST follow the pattern `[cssPrefix]-[optionValue]`.

**Live cssPrefix values** (source: `data/design.config.json` `paramTypes[*].cssPrefix`):

| cssPrefix | paramType | Example class |
|---|---|---|
| `surf` | surface | `.surf-velvet` |
| `shape` | shape | `.shape-pill` |
| `depth` | depth | `.depth-raised` |
| `mo` | motion | `.mo-elastic` |
| `density` | density | `.density-normal` |

## 1.4 `@layer` Naming

All CSS layers MUST use the `group.sublayer` format. The full 18-layer sequence (source: `app.css` `@layer` declaration):

```
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
effects.holo-pan,
effects.glitch,
effects.demo,
overrides
```

## 1.5 Capability Layer Class IDs

Capability layers are activated via `:root.fx-[name]` classes.

**Live IDs** (source: `data/app.config.json` `capabilityLayerRegistry`):
- `fx-demo`
- `fx-holo-pan`

Activation site: `document.documentElement.classList.add(id)` in `main.js` `activateAlwaysOnCapabilities()`.

## 1.6 Fallback Token Placement

All `--comp-*` and `--btn-*` fallbacks MUST be defined only in `@layer tokens.component-defaults`, never inline inside option classes.

Source: `app.css` `@layer tokens.component-defaults` `:root` block; `docs/extend/2-adding-a-parameter-type.md` step 4.

## 1.7 Capability Layer Scoping

All rules inside an `effects.*` layer MUST be scoped under `:root.fx-[name]` so the effect is completely inert until activated.

Source: `app.css` `@layer effects.demo` and `@layer effects.holo-pan` patterns; `docs/extend/4-capability-layers.md` step 1.

## 1.8 Single PropSet Ownership

Each CSS custom property MUST appear in exactly one `propSet`.

Source: `docs/PROP-SETS.md` opening line.
