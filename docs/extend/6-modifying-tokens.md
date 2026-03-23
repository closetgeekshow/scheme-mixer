# HOWTO: Modify Design Tokens

Scheme Remix Studio uses a three-tier CSS custom property system. Modifications at each tier have different scopes and rules.

## Token Tiers

| Tier | Layer | Prefix | Scope | Runtime mutability |
|---|---|---|---|---|
| 1 — Primitives | `@layer tokens.primitives` | `--_` | Raw palette and scale values | Read-only at runtime |
| 2 — Semantic | `@layer tokens.semantic` | none | Intent aliases referencing Tier 1 | Mutable |
| 3 — Component Defaults | `@layer tokens.component-defaults` | `--comp-*`, `--btn-*` | Default values for all component axes | Mutable |

## Modifying Tier 1 Primitives

Tier 1 tokens define the raw color palette, spacing scale, radius scale, and z-index scale. Edit them in `@layer tokens.primitives` in `app.css`.

```css
@layer tokens.primitives {
  :root {
    --_accent: #ff6b6b;      /* was #6b8aff — change accent to red */
    --_green: #a3e635;       /* was #2dd4bf — change green to lime */
    --_bg-950: #050510;      /* was #0a0a0a — slightly blue-black background */
    --sidebar-width: 320px;  /* was 280px — wider sidebar */
  }
}
```

**MUST** rule: Any new `--_` token MUST be added to `app.config.json` `primitiveRegistry`:
```json
{ "name": "--_my-new-color", "cssType": "color" }
```

## Modifying Tier 2 Semantic Tokens

Tier 2 tokens map semantic names to Tier 1 values. Changing a semantic token updates every UI element that references it.

```css
@layer tokens.semantic {
  :root {
    --accent: #ff6b6b;                          /* point directly to a value */
    --panel: color-mix(in srgb, var(--_bg-950) 80%, #001122); /* or mix */
  }
}
```

### Common modifications

| Goal | Token to change |
|---|---|
| Change all accent highlights | `--accent` |
| Change sidebar/panel background | `--panel`, `--panel-2` |
| Change body background | `--bg` |
| Change default text color | `--text` |
| Change all borders | `--border`, `--border-2` |
| Change monospace font | `--mono` |
| Change sans-serif font | `--sans` |

## Modifying Tier 3 Component Defaults

Tier 3 tokens set the fallback values for `.the-component` and `.comp-btn` before any `paramType` option class overrides them. Changing these values affects the "default" appearance before any option is selected and provides the initial state for CSS transitions.

```css
@layer tokens.component-defaults {
  :root {
    --comp-bg: #f8f8f8;         /* lighter default background */
    --comp-radius: 12px;        /* larger default corner radius */
    --comp-padding: 32px;       /* more spacious default padding */
    --comp-motion: all 200ms ease-out; /* snappier default transition */
  }
}
```

**MUST** rule: Fallbacks for component tokens MUST be defined only here, never inline inside component option rules like `.surf-velvet { ... }`.

## Modifying Layout

To change the sidebar width, update the Tier 1 primitive:

```css
@layer tokens.primitives {
  :root {
    --sidebar-width: 320px; /* default: 280px */
  }
}
```

To change the lens grid ratio (how much vertical space the fixed lens takes):

```css
@layer shell.layout {
  #app {
    grid-template-rows: minmax(0, 3fr) minmax(0, 1fr); /* more space for main lens */
  }
}
```

## The `@layer overrides` Safety Valve

The final `@layer overrides` block in `app.css` is reserved for targeted fixes and one-off tweaks that must take precedence over all other layers. Use it sparingly:

```css
@layer overrides {
  /* Force minimum component width in zoom lenses */
  .lens:not(.lens-fixed) .the-component {
    min-width: 280px;
  }
}
```

**SHOULD** rule: `@layer overrides` SHOULD be used only for targeted bugfixes, never for general styling.

## Checklist

- [ ] Tier 1 changes: new primitives also added to `app.config.json` → `primitiveRegistry`
- [ ] Tier 3 changes: defaults only in `tokens.component-defaults`, never inline
- [ ] `--sidebar-width` change is consistent with any mobile breakpoint adjustments
- [ ] New semantic tokens reference Tier 1 primitives where possible
- [ ] `@layer overrides` used only for targeted bugfixes, not general styling
