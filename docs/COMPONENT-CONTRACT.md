# COMPONENT-CONTRACT

Defines which propSets the primary component template consumes and why each axis exists.

## Template Overview

`tpl-component` renders a `.the-component` root with a heading, a paragraph, and a `.comp-actions` row containing two `.comp-btn` buttons.

## surfaceMaterial

- PropSet ID: `surfaceMaterial`
- Controls visual material, text color, typography, and button fills.
- Required props: `--comp-bg`, `--comp-bg-img`, `--comp-bg-size`, `--comp-bg-pos`, `--comp-backdrop`, `--comp-color`, `--comp-font`, `--comp-font-weight`, `--comp-text-transform`, `--comp-letter-spacing`, `--btn-bg`, `--btn-color`.

## shapeGeometry

- PropSet ID: `shapeGeometry`
- Controls the silhouette of the card and buttons.
- Required props: `--comp-radius`, `--comp-clip`, `--btn-radius`, `--btn-clip`.

## depthElevation

- PropSet ID: `depthElevation`
- Controls perceived Z-space via borders and shadows.
- Required props: `--comp-shadow`, `--comp-border`, `--btn-shadow`, `--btn-border`.

## motionDynamics

- PropSet ID: `motionDynamics`
- Controls transition timing and physical feel.
- Required props: `--comp-motion`.

## spatialDensity

- PropSet ID: `spatialDensity`
- Controls internal spacing and typography rhythm.
- Required props: `--comp-padding`, `--comp-gap`, `--comp-font-size-base`, `--comp-line-height`, `--btn-padding`.

## Consumption Summary

- `.the-component` consumes all `--comp-*` tokens from the five propSets.
- `.comp-btn` consumes the corresponding `--btn-*` tokens.
- Any future propSet addition requires a documented contract update and explicit CSS consumption.
