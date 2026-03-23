# PROP-SETS

Authoritative per-prop registry. One table per `propSet`.

> "Each prop appears in exactly one `propSet` and has a single `cssType`,
> `initial` value, and `registerProperty` flag."

## surfaceMaterial

**PropSet ID:** `surfaceMaterial`
**PropSet index:** 0

| Property | cssType | initial | registerProperty |
|---|---|---|---|
| `--comp-bg` | string | `ffffff` | false |
| `--comp-bg-img` | string | `none` | false |
| `--comp-bg-size` | string | `auto` | false |
| `--comp-bg-pos` | string | `0 0` | false |
| `--comp-backdrop` | string | `none` | false |
| `--comp-color` | color | `000000` | **true** |
| `--comp-font` | string | `var(--sans)` | false |
| `--comp-font-weight` | number | `400` | false |
| `--comp-text-transform` | string | `none` | false |
| `--comp-letter-spacing` | string | `normal` | false |
| `--btn-bg` | string | `eeeeee` | false |
| `--btn-color` | string | `inherit` | false |

> CSS `@property` is registered for this prop to enable smooth transitions
> (applicable to `color`, `length`, and `number` cssTypes).

## shapeGeometry

**PropSet ID:** `shapeGeometry`
**PropSet index:** 1

| Property | cssType | initial | registerProperty |
|---|---|---|---|
| `--comp-radius` | length | `8px` | **true** |
| `--comp-clip` | string | `none` | false |
| `--btn-radius` | length | `4px` | **true** |
| `--btn-clip` | string | `none` | false |

> CSS `@property` is registered for this prop to enable smooth transitions
> (applicable to `color`, `length`, and `number` cssTypes).

## depthElevation

**PropSet ID:** `depthElevation`
**PropSet index:** 2

| Property | cssType | initial | registerProperty |
|---|---|---|---|
| `--comp-shadow` | string | `none` | false |
| `--comp-border` | string | `1px solid transparent` | false |
| `--btn-shadow` | string | `none` | false |
| `--btn-border` | string | `1px solid transparent` | false |

## motionDynamics

**PropSet ID:** `motionDynamics`
**PropSet index:** 3

| Property | cssType | initial | registerProperty |
|---|---|---|---|
| `--comp-motion` | string | `all 300ms ease` | false |

## spatialDensity

**PropSet ID:** `spatialDensity`
**PropSet index:** 4

| Property | cssType | initial | registerProperty |
|---|---|---|---|
| `--comp-padding` | length | `28px` | **true** |
| `--comp-gap` | length | `0px` | **true** |
| `--comp-font-size-base` | length | `1rem` | **true** |
| `--comp-line-height` | number | `1.6` | **true** |
| `--btn-padding` | string | `11px 20px` | false |

> CSS `@property` is registered for this prop to enable smooth transitions
> (applicable to `color`, `length`, and `number` cssTypes).

---

**Total props:** 26 (12 + 4 + 4 + 1 + 5)

Source: `data/design.config.json` `propSets[]`.
