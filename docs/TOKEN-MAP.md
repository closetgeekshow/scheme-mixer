# TOKEN-MAP

Full mapping from Tier 1 primitives to semantic aliases and component defaults.

## Color and Panel Tokens

| Primitive       | Semantic       | Used by / feeds into |
|----------------|----------------|----------------------|
| `--_bg-950`    | `--bg`         | App shell background |
| `--_bg-900`    | `--panel`      | Sidebar and panels   |
| `--_bg-800`    | `--panel-2`    | Inputs, popovers, badges |
| `--_border-low`| `--border`     | Low-emphasis borders |
| `--_border-mid`| `--border-2`   | Higher-emphasis borders |
| `--_text-hi`   | `--text`       | Primary text |
| `--_text-mid`  | `--text-dim`   | Secondary text |
| `--_text-lo`   | `--text-muted` | Tertiary text |
| `--_accent`    | `--accent`     | Accent UI states |
| `--_green`     | `--green`      | Lens badge status |

Derived alpha tokens:

| Semantic      | Derived from | Used by |
|---------------|-------------|---------|
| `--accent-bg` | `color-mix(in srgb, var(--accent) 12%, transparent)` | Hover and action backgrounds |
| `--green-bg`  | `color-mix(in srgb, var(--green) 10%, transparent)`  | Lens badge background |
| `--green-bdr` | `color-mix(in srgb, var(--green) 28%, transparent)`  | Lens badge border |

## Typography Tokens

| Semantic  | Used by |
|-----------|---------|
| `--mono`  | Labels, badges, technical UI |
| `--sans`  | Base sans-serif stack |

## Layout and Scale Tokens

| Primitive          | Consumer | Used by |
|-------------------|----------|---------|
| `--r-xs`…`--r-2xl`| Radius consumers | Lens radii and shape classes |
| `--sp-xs`…`--sp-xl`| Density consumers | Component and sidebar spacing |
| `--z-lens-overlay`| Direct | Lens overlays |
| `--z-maximized`   | Direct | Maximized lens state |
| `--z-mobile-bar`  | Direct | Mobile bar |
| `--z-popover`     | Direct | Global popover |
| `--sidebar-width` | Direct | App grid column width |

## Component Defaults by PropSet

- `surfaceMaterial` feeds `--comp-bg`, `--comp-color`, `--comp-font`, `--btn-bg`, `--btn-color`.
- `shapeGeometry` feeds `--comp-radius`, `--comp-clip`, `--btn-radius`, `--btn-clip`.
- `depthElevation` feeds `--comp-border`, `--comp-shadow`, `--btn-border`, `--btn-shadow`.
- `motionDynamics` feeds `--comp-motion`.
- `spatialDensity` feeds `--comp-padding`, `--comp-gap`, `--comp-font-size-base`, `--comp-line-height`, `--btn-padding`.
