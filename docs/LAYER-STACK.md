# LAYER-STACK

Canonical CSS @layer ordering and responsibilities.

1. `reset` — global resets and element normalization.
2. `tokens.primitives` — raw palette, scales, and layout primitives.
3. `tokens.semantic` — semantic aliases and derived alpha tokens.
4. `tokens.component-defaults` — all `--comp-*` and `--btn-*` defaults.
5. `shell.layout` — page shell and app grid layout.
6. `shell.sidebar` — sidebar, parameter list, actions, and popover.
7. `shell.lens` — lens containers, viewports, badges, and controls.
8. `shell.mobile` — mobile layout and overlay rules.
9. `component.base` — `.the-component`, `.comp-actions`, `.comp-btn`.
10. `component.surface` — all `.surf-*` classes.
11. `component.shape` — all `.shape-*` classes.
12. `component.depth` — all `.depth-*` classes.
13. `component.motion` — all `.mo-*` classes.
14. `component.density` — all `.density-*` classes.
15. `effects.holo-pan` — holo animation and scoping.
16. `effects.glitch` — optional glitch effect layer.
17. `effects.demo` — demo-active and fixed-lens hover transforms.
18. `overrides` — highest-priority escape hatch layer.
