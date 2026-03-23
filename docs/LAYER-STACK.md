# LAYER-STACK

Canonical CSS `@layer` ordering and per-layer responsibilities.

## Opening Diagram

```mermaid
flowchart TD
    A["reset"] --> B["tokens.primitives"]
    B --> C["tokens.semantic"]
    C --> D["tokens.component-defaults"]
    D --> E["shell.layout"]
    E --> F["shell.sidebar"]
    F --> G["shell.lens"]
    G --> H["shell.mobile"]
    H --> I["component.base"]
    I --> J["component.surface"]
    J --> K["component.shape"]
    K --> L["component.depth"]
    L --> M["component.motion"]
    M --> N["component.density"]
    N --> O["effects.holo-pan"]
    O --> P["effects.glitch"]
    P --> Q["effects.demo"]
    Q --> R["overrides"]

    style A fill:#4a6fa5,color:#e8e8e8
    style B fill:#4a6fa5,color:#e8e8e8
    style C fill:#4a6fa5,color:#e8e8e8
    style D fill:#4a6fa5,color:#e8e8e8
    style E fill:#6a6a6a,color:#e8e8e8
    style F fill:#6a6a6a,color:#e8e8e8
    style G fill:#6a6a6a,color:#e8e8e8
    style H fill:#6a6a6a,color:#e8e8e8
    style I fill:#4a8a4a,color:#e8e8e8
    style J fill:#4a8a4a,color:#e8e8e8
    style K fill:#4a8a4a,color:#e8e8e8
    style L fill:#4a8a4a,color:#e8e8e8
    style M fill:#4a8a4a,color:#e8e8e8
    style N fill:#4a8a4a,color:#e8e8e8
    style O fill:#8a6a4a,color:#e8e8e8
    style P fill:#8a6a4a,color:#e8e8e8
    style Q fill:#8a6a4a,color:#e8e8e8
    style R fill:#8a4a4a,color:#e8e8e8
```

**Color coding:**
- Blue: Token layers (1–4)
- Gray: Shell layers (5–8)
- Green: Component layers (9–14)
- Orange: Effects layers (15–17)
- Red: Overrides (18)

## Per-Layer Table

| Position | Layer name | Responsibility | Key selectors/rules |
|---|---|---|---|
| 1 | `reset` | Global resets and element normalization | `* { margin:0; padding:0; box-sizing:border-box }` |
| 2 | `tokens.primitives` | Raw palette, radius/spacing/z scales, layout primitives | `:root { --_bg-950: #0a0a0a; --sidebar-width: 280px }` |
| 3 | `tokens.semantic` | Intent aliases referencing Tier 1 values | `:root { --bg: var(--_bg-950); --accent: var(--_accent) }` |
| 4 | `tokens.component-defaults` | All `--comp-*` and `--btn-*` fallback values | `:root { --comp-bg: #ffffff; --comp-radius: 8px }` |
| 5 | `shell.layout` | Page shell and app grid layout | `#app { grid-template-rows: 2fr / 1.2fr }` |
| 6 | `shell.sidebar` | Sidebar, parameter list, actions, popover | `.sidebar`, `.param-list`, `.actions` |
| 7 | `shell.lens` | Lens containers, viewports, badges, nth-of-type placement | `.lens`, `.lens-viewport`, `.lens-badge` |
| 8 | `shell.mobile` | Mobile layout and overlay rules | `.mobile-overlay`, `.mobile-bar` |
| 9 | `component.base` | `.the-component`, `.comp-actions`, `.comp-btn` consume all tokens | `.the-component { background: var(--comp-bg) }` |
| 10 | `component.surface` | All `.surf-*` classes | `.surf-velvet { --comp-bg: #1a1a24 }` |
| 11 | `component.shape` | All `.shape-*` classes | `.shape-pill { --comp-radius: 32px }` |
| 12 | `component.depth` | All `.depth-*` classes | `.depth-raised { --comp-shadow: 0 18px 40px }` |
| 13 | `component.motion` | All `.mo-*` classes | `.mo-elastic { --comp-motion: 700ms cubic-bezier }` |
| 14 | `component.density` | All `.density-*` classes | `.density-airy { --comp-padding: 30px }` |
| 15 | `effects.holo-pan` | Holo animation and scoping | `:root.fx-holo-pan .surf-holo { animation: holo-pan 8s linear infinite }` |
| 16 | `effects.glitch` | Optional glitch effect layer | `:root.fx-glitch .the-component { animation: glitch 0.3s steps(3) }` |
| 17 | `effects.demo` | Demo-active and fixed-lens hover transforms | `:root.fx-demo .the-component.mo-*.demo-active { transform: translateY(-4px) }` |
| 18 | `overrides` | Highest-priority escape hatch | `.lens:not(.lens-fixed) .the-component { min-width: 280px }` |

## Extension Rule

New `component.*` layers MUST be inserted between `component.density` and `effects.holo-pan`, and MUST be registered in the `@layer` declaration at the top of `app.css`.

Source: `docs/extend/2-adding-a-parameter-type.md` step 6.
