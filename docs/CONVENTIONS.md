# CONVENTIONS

Canonical naming and structural conventions for Scheme Remix Studio. All code, config, and documentation MUST adhere to these invariants.

## CSS Custom Properties

- All CSS custom properties use kebab-case, start with `--`, and never contain uppercase letters.
- Tier 1 (primitive) tokens use the `--_` prefix and are treated as read-only palette and scale values:
  - Colors: `--_bg-950`, `--_bg-900`, `--_bg-800`, `--_border-low`, `--_border-mid`, `--_text-hi`, `--_text-mid`, `--_text-lo`, `--_accent`, `--_green`.
  - Radius scale: `--r-xs`, `--r-sm`, `--r-md`, `--r-lg`, `--r-xl`, `--r-2xl`.
  - Spacing scale: `--sp-xs`, `--sp-sm`, `--sp-md`, `--sp-lg`, `--sp-xl`.
  - Z-index scale: `--z-lens-overlay`, `--z-maximized`, `--z-mobile-bar`, `--z-popover`.
  - Layout primitives: `--sidebar-width`.
- Tier 2 (semantic) tokens have no `--_` prefix and express intent while remaining global:
  - Colors and panels: `--bg`, `--panel`, `--panel-2`, `--border`, `--border-2`, `--text`, `--text-dim`, `--text-muted`, `--accent`, `--green`.
  - Derived alpha tokens: `--accent-bg`, `--green-bg`, `--green-bdr`.
  - Font stacks: `--mono`, `--sans`.
- Tier 3 (component defaults) are all `--comp-*` and `--btn-*` tokens, plus optional component-local noise tokens.
- Fallbacks for component tokens MUST be defined only in `tokens.component-defaults`, never inline inside component rules.
- Option-local aliases MUST follow `--_[cssPrefix]-[value]--[name]`.
- Any newly introduced Tier 1 primitive MUST also be registered in `app.config.json.primitiveRegistry`.

## CSS Class Names

- ParamType option classes always follow `[cssPrefix]-[optionValue]`.
- Examples:
  - Surface: `.surf-velvet`, `.surf-console`, `.surf-glass`, `.surf-frutiger`, `.surf-memphis`, `.surf-artdeco`, `.surf-grunge`, `.surf-holo`.
  - Shape: `.shape-pill`, `.shape-sharp`, `.shape-soft`, `.shape-chamfer`, `.shape-bauhaus`, `.shape-concentric`, `.shape-squircle`.
  - Depth: `.depth-flat`, `.depth-raised`, `.depth-sunken`, `.depth-neumorphic`, `.depth-brutalist`, `.depth-glowing`, `.depth-concentric`.
  - Motion: `.mo-velvet`, `.mo-console`, `.mo-elastic`, `.mo-glitch`, `.mo-float`, `.mo-whip`, `.mo-spring`.
  - Density: `.density-compact`, `.density-normal`, `.density-airy`, `.density-wide`.
- The core component root element always has class `.the-component`, with exactly one instance of each paramType option class applied via JS.
- Component sub-elements use the `comp-` prefix: `.comp-actions`, `.comp-btn`, `.comp-btn.secondary`.
- Lens shells and overlays use the `lens-` prefix: `.lens`, `.lens-fixed`, `.lens--maximized`, `.lens-viewport`, `.lens-content`, `.lens-badge`, `.lens-reset-btn`, `.lens-max-btn`, `.lens-view-toggle`.
- Sidebar and mobile UI use descriptive prefixes such as `.sidebar`, `.param-*`, `.mobile-*`, and `.popover`.
- Capability layers are activated via `:root` classes: `:root.fx-holo-pan`, `:root.fx-demo`, `:root.fx-glitch`.
- There MUST be no remaining `.geo-*` classes in the final stylesheet.

## JavaScript Identifiers

- All JS files are ES modules with strict mode implied.
- `config.js` exports `APP_CONFIG`, `DESIGN_CONFIG`, `LIBRARY`.
- `state.js` exports `state`, `cameras`, `componentEls`, `paramSelectMap`, `lensCache`, `compClasses`, `ensureFontLoaded`, `applyDesign`.
- `lens.js` exports `createLens`, `updateCamera`.
- `ui.js` exports `createParamItem`, `buildParamList`, `buildApp`, `showPopover`.
- `main.js` exports `randomize`, `triggerDemo`, `applyScheme` and runs init.
- Local variables and functions use lowerCamelCase and descriptive names.

## JSON Keys

- All JSON keys use lowerCamelCase.
- Root config split:
  - `data/app.config.json` contains AppConfig.
  - `data/design.config.json` contains `propSets`, `paramTypes`, `lenses` and MUST NOT contain `presets` or `schemes`.
  - `data/library.json` contains `presets`, `schemes` and MUST NOT contain `propSets` or `paramTypes`.

## File and Directory Names

- Top-level: `index.html`, `app.css`.
- JavaScript modules: `js/config.js`, `js/state.js`, `js/lens.js`, `js/ui.js`, `js/main.js`.
- Data files: `data/app.config.json`, `data/design.config.json`, `data/library.json`.
- Documentation files live in `docs/` and use the prescribed uppercase names.

## Cross-File Contracts

- Every `ParamType.cssPrefix` MUST match the class name prefix used in CSS.
- Every CSS property set inside a paramType option class MUST belong to one of that paramType's `propSetIds`.
- `compClasses()` MUST always generate `the-component` plus one class per paramType.
- Template IDs in `index.html` MUST match the IDs used by `document.getElementById()` in `lens.js` and `ui.js`.
- `config.js` MUST parse `cfg-app`, `cfg-design`, and `cfg-library` and export `APP_CONFIG`, `DESIGN_CONFIG`, and `LIBRARY`.
