# PROP-SETS

Authoritative registry of all propSets and their CSS custom properties. Each prop appears in exactly one propSet and has a single `cssType`, `initial` value, and `registerProperty` flag.

## surfaceMaterial

| Name                    | cssType | initial       | registerProperty |
|-------------------------|---------|---------------|------------------|
| `--comp-bg`             | string  | `ffffff`      | false            |
| `--comp-bg-img`         | string  | `none`        | false            |
| `--comp-bg-size`        | string  | `auto`        | false            |
| `--comp-bg-pos`         | string  | `0 0`         | false            |
| `--comp-backdrop`       | string  | `none`        | false            |
| `--comp-color`          | color   | `000000`      | true             |
| `--comp-font`           | string  | `var(--sans)` | false            |
| `--comp-font-weight`    | number  | `400`         | false            |
| `--comp-text-transform` | string  | `none`        | false            |
| `--comp-letter-spacing` | string  | `normal`      | false            |
| `--btn-bg`              | string  | `eeeeee`      | false            |
| `--btn-color`           | string  | `inherit`     | false            |

## shapeGeometry

| Name            | cssType | initial | registerProperty |
|-----------------|---------|---------|------------------|
| `--comp-radius` | length  | `8px`   | true             |
| `--comp-clip`   | string  | `none`  | false            |
| `--btn-radius`  | length  | `4px`   | true             |
| `--btn-clip`    | string  | `none`  | false            |

## depthElevation

| Name            | cssType | initial                 | registerProperty |
|-----------------|---------|-------------------------|------------------|
| `--comp-shadow` | string  | `none`                  | false            |
| `--comp-border` | string  | `1px solid transparent` | false            |
| `--btn-shadow`  | string  | `none`                  | false            |
| `--btn-border`  | string  | `1px solid transparent` | false            |

## motionDynamics

| Name           | cssType | initial          | registerProperty |
|----------------|---------|------------------|------------------|
| `--comp-motion`| string  | `all 300ms ease` | false            |

## spatialDensity

| Name                    | cssType | initial       | registerProperty |
|-------------------------|---------|---------------|------------------|
| `--comp-padding`        | length  | `28px`        | true             |
| `--comp-gap`            | length  | `0px`         | true             |
| `--comp-font-size-base` | length  | `1rem`        | true             |
| `--comp-line-height`    | number  | `1.6`         | true             |
| `--btn-padding`         | string  | `11px 20px`   | false            |
