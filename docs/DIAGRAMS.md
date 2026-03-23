# DIAGRAMS

Standalone Mermaid diagram library. Each diagram is numbered, titled, and 100% accurate to source behaviour.

## 1 — Boot & Init Sequence

This diagram shows the full boot sequence from browser load to `init()` execution. It runs once when the page first loads.

```mermaid
flowchart TD
    A(["Browser loads index.html"]) --> B["app.css parsed — 18 @layers resolved"]
    B --> C["script type=module src=js/main.js"]
    C --> D["config.js top-level await<br/>Promise.all — 3 fetches"]
    D --> E["state.js evaluates<br/>state + cameras derived"]
    E --> F["lens.js evaluates<br/>global pointer handlers registered"]
    F --> G["ui.js evaluates<br/>template refs + popover captured"]
    G --> H{"document.readyState?"}
    H -->|"loading"| I["addEventListener DOMContentLoaded → init"]
    H -->|"interactive / complete"| J["init called immediately"]
    I --> K(["init()"])
    J --> K
    K --> L["buildApp()"]
    K --> M["activateAlwaysOnCapabilities()"]
    K --> N["applyDesign()"]
    K --> O["wireGlobalButtons()"]

    style A fill:#1e3a5f,color:#e8e8e8
    style K fill:#2a4a2a,color:#e8e8e8
    style L fill:#3a2a4a,color:#e8e8e8
    style M fill:#3a2a4a,color:#e8e8e8
    style N fill:#3a2a4a,color:#e8e8e8
    style O fill:#3a2a4a,color:#e8e8e8
```

## 2 — Config Fetch (`config.js`)

This diagram shows how `config.js` fetches all three JSON config files in parallel and exports them. It runs once at module evaluation time.

```mermaid
flowchart TD
    A(["config.js module evaluates"]) --> B["Promise.all — 3 parallel fetches"]
    B --> C["fetch ./data/app.config.json"]
    B --> D["fetch ./data/design.config.json"]
    B --> E["fetch ./data/library.json"]
    C --> F{"r.ok?"}
    D --> G{"r.ok?"}
    E --> H{"r.ok?"}
    F -->|"yes"| I["r.json → APP_CONFIG"]
    F -->|"no"| J["throw Error — HTTP status"]
    G -->|"yes"| K["r.json → DESIGN_CONFIG"]
    G -->|"no"| L["throw Error — HTTP status"]
    H -->|"yes"| M["r.json → LIBRARY"]
    H -->|"no"| N["throw Error — HTTP status"]
    I & K & M --> O["export APP_CONFIG<br/>DESIGN_CONFIG<br/>LIBRARY"]
    O --> P(["Downstream importers auto-await<br/>state.js · ui.js · main.js"])

    style J fill:#5f1e1e,color:#e8e8e8
    style L fill:#5f1e1e,color:#e8e8e8
    style N fill:#5f1e1e,color:#e8e8e8
    style O fill:#2a4a2a,color:#e8e8e8
    style P fill:#2a4a2a,color:#e8e8e8
```

## 3 — State Derivation (`state.js`)

This diagram shows how `state.js` derives its module-level state and caches from `DESIGN_CONFIG`. It runs once at module evaluation time.

```mermaid
flowchart LR
    A(["state.js module evaluates"]) --> B["DESIGN_CONFIG.paramTypes.map<br/>p → p.id, p.options[0].value"]
    B --> C["state = Object.fromEntries<br/>e.g. surface:'velvet', shape:'pill' …"]
    A --> D["DESIGN_CONFIG.lenses.map<br/>l → l.id, zoom, x, y"]
    D --> E["cameras = Object.fromEntries<br/>e.g. actual:{zoom:1, x:0.5, y:0.5}"]
    A --> F["componentEls = new Set()"]
    A --> G["paramSelectMap = new Map()"]
    A --> H["lensCache = new Map()"]
    A --> I["SURFACE_FONT_SOURCES built from<br/>surface options with fontsource key"]
    A --> J["loadedFonts = new Set()"]

    style A fill:#1e3a5f,color:#e8e8e8
    style C fill:#2a4a2a,color:#e8e8e8
    style E fill:#2a4a2a,color:#e8e8e8
```

## 4 — `buildApp()` DOM Construction (`ui.js`)

This diagram shows how `buildApp()` constructs the entire app DOM from templates and config. It runs once during `init()`.

```mermaid
flowchart TD
    A(["buildApp()"]) --> B["Set sidebar title + subtitle<br/>from APP_CONFIG"]
    A --> C["buildParamList(#param-list)"]
    A --> D["buildParamList(#mobile-param-list)"]
    A --> E["buildParamList(#mobile-param-strip)"]
    A --> F["appContainer.innerHTML = ''"]

    C & D & E --> G["for each paramType in DESIGN_CONFIG.paramTypes"]
    G --> H["createParamItem(paramType)"]
    H --> I["Clone tpl-param-item fragment"]
    I --> J["Set label.textContent = paramType.label"]
    I --> K["Populate option elements"]
    I --> L["select.value = state[paramType.id]"]
    I --> M["paramSelectMap.get(id).add(select)"]
    I --> N["select: addEventListener change"]
    I --> O{"paramType.description?"}
    O -->|"yes"| P["helpBtn: addEventListener click → showPopover"]
    O -->|"no"| Q["helpBtn.classList.add hidden"]

    F --> R["for each lensConfig in DESIGN_CONFIG.lenses"]
    R --> S["createLens(lensConfig)"]
    S --> T["appContainer.appendChild(lensEl)"]

    style A fill:#1e3a5f,color:#e8e8e8
    style H fill:#3a2a4a,color:#e8e8e8
    style S fill:#3a2a4a,color:#e8e8e8
```

## 5 — `createLens()` Factory (`lens.js`)

This diagram shows how `createLens()` builds a single lens panel from a lens config object. It runs once per lens during `buildApp()`.

```mermaid
flowchart TD
    A(["createLens(lensConfig)"]) --> B["Create wrap div.lens<br/>add .lens-fixed if lensConfig.fixed"]
    B --> C["Create viewport div.lens-viewport<br/>add .centered if fixed"]
    C --> D["Create content div.lens-content<br/>add .static if fixed"]
    D --> E["Clone tpl-component fragment"]
    E --> F["comp.className = compClasses()<br/>componentEls.add(comp)"]
    F --> G["content → viewport → wrap"]

    B --> H{"tplBadgeTL exists?"}
    H -->|"yes"| I["Clone badge-tl fragment<br/>Set desc text to lensConfig.desc<br/>wrap.appendChild"]
    H -->|"no"| J["skip"]

    B --> K{"!fixed AND tplBadgeBL?"}
    K -->|"yes"| L["Clone badge-bl fragment<br/>wrap.appendChild"]
    K -->|"no"| M["skip"]

    B --> N{"!lensConfig.fixed?"}
    N -->|"yes"| O["Create resetBtn<br/>click: restore originCamera → updateCamera"]

    B --> P["Create maxBtn<br/>click: toggleMaximize(lensId)"]

    B --> Q{"lensConfig.fixed?"}
    Q -->|"yes"| R["Create viewToggleBtn '1×'<br/>wired after cache is set"]

    B --> S["cameras[lensId] = zoom, x, y<br/>lensCache.set(lensId, wrap, viewport,<br/>content, comp, badgeTL, badgeBL,<br/>originCamera, mode1x:false, resizeObserver:null)"]

    N -->|"yes"| T{"ResizeObserver in window?"}
    T -->|"yes"| U["new ResizeObserver → observe viewport<br/>cache.resizeObserver = ro"]

    B --> V["requestAnimationFrame:<br/>updateCamera + setupLensInteraction"]

    style A fill:#1e3a5f,color:#e8e8e8
    style S fill:#2a4a2a,color:#e8e8e8
```

## 6 — `applyDesign()` (`state.js`)

This diagram shows the full `applyDesign()` flow from font loading to class stamping. It runs on every parameter change and during `init()`.

```mermaid
flowchart TD
    A(["applyDesign()"]) --> B["ensureFontLoaded(state.surface)"]
    B --> C{"fontsource href exists<br/>for this surface value?"}
    C -->|"no"| D["return — nothing to inject"]
    C -->|"yes"| E{"loadedFonts.has(surfaceValue)?"}
    E -->|"yes"| F["return — skip duplicate link"]
    E -->|"no"| G["Create link rel=stylesheet<br/>href = fontsource URL<br/>document.head.appendChild<br/>loadedFonts.add(surfaceValue)"]

    B --> H["compClasses()"]
    H --> I["base = 'the-component'<br/>for each paramType push<br/>cssPrefix + '-' + state[id]<br/>return base.join(' ')"]
    I --> J["e.g. 'the-component surf-velvet<br/>shape-pill depth-raised mo-elastic density-normal'"]

    J --> K["for el of componentEls:<br/>el.className = cls"]
    K --> L["dynamic import('./lens.js')"]
    L --> M{"import resolves?"}
    M -->|"yes"| N["requestAnimationFrame:<br/>for each non-fixed lens → updateCamera(lensId)"]
    M -->|"no"| O["catch — swallow silently<br/>camera corrected on next interaction"]

    style A fill:#1e3a5f,color:#e8e8e8
    style J fill:#2a4a2a,color:#e8e8e8
    style K fill:#2a4a2a,color:#e8e8e8
```

## 7 — `updateCamera()` Math (`lens.js`)

This diagram shows the camera transform math that positions the component inside a lens viewport. It runs on every pan, zoom, or resize event.

```mermaid
flowchart TD
    A(["updateCamera(lensId)"]) --> B["lensCache.get(lensId)"]
    B --> C{"cache exists?"}
    C -->|"no"| D["return"]
    C -->|"yes"| E["cam = cameras[lensId]"]
    E --> F["Clamp cam.zoom to zoomClamp<br/>Math.max(zMin, Math.min(zMax, cam.zoom))"]
    F --> G["vW = viewport.clientWidth<br/>vH = viewport.clientHeight<br/>cW = comp.offsetWidth || 340<br/>cH = comp.offsetHeight || 240"]
    G --> H["tx = vW/2 − cam.x × cW × cam.zoom<br/>ty = vH/2 − cam.y × cH × cam.zoom"]
    H --> I["content.style.transform =<br/>translate(txpx, typx) scale(cam.zoom)<br/>content.style.transformOrigin = '0 0'"]
    I --> J{"badgeTL exists?"}
    J -->|"yes"| K["Update .lens-zoom-num textContent<br/>e.g. '2×'"]
    I --> L{"badgeBL exists?"}
    L -->|"yes"| M["Update zoom-num + coords text<br/>e.g. '2.00× (50, 50)'"]

    style A fill:#1e3a5f,color:#e8e8e8
    style I fill:#2a4a2a,color:#e8e8e8
```

**Transform formula:**
```
tx = vW/2 − cam.x × cW × cam.zoom
ty = vH/2 − cam.y × cH × cam.zoom
content.style.transform = translate(tx px, ty px) scale(cam.zoom)
```

Source: `lens.js` `updateCamera()`.

## 8 — Lens Pointer / Wheel / Touch Interactions

This diagram shows the per-lens and global pointer handlers that enable pan, zoom, and touch interactions. The per-lens handlers run on each lens viewport; the global handlers run once on `window`.

```mermaid
flowchart TD
    subgraph PerLens ["Per-lens viewport listeners — setupLensInteraction"]
        PD["pointerdown"] --> AD["activeDrag = lensId, lastX, lastY<br/>viewport.classList.add 'dragging'"]
        WH["wheel"] --> WZ["factor = deltaY < 0 ? 1.12 : 0.9<br/>cam.zoom = clamp(cam.zoom × factor)<br/>updateCamera(lensId)"]
        TS["touchstart"] --> LT["lastTouches = Array.from(e.touches)"]
        TM["touchmove"] --> TC{"touch count?"}
        TC -->|"1 finger"| PAN["cam.x -= dx / cW×zoom — clamped<br/>cam.y -= dy / cH×zoom — clamped<br/>updateCamera(lensId)"]
        TC -->|"2 fingers"| PINCH["cam.zoom *= newDist / prevDist — clamped<br/>updateCamera(lensId)"]
        TE["touchend"] --> UT["lastTouches = Array.from(e.touches)"]
    end

    subgraph Global ["Global window listeners — registered once at module eval"]
        PM["window pointermove"] --> AI{"activeDrag?"}
        AI -->|"null"| SK["return"]
        AI -->|"set"| CALC["dx = e.clientX - lastX<br/>dy = e.clientY - lastY<br/>cam.x/y adjusted + clamped<br/>activeDrag.lastX/Y = e.clientX/Y<br/>updateCamera(lensId)"]
        PU["window pointerup"] --> AU{"activeDrag?"}
        AU -->|"null"| SK2["return"]
        AU -->|"set"| CLR["viewport.classList.remove 'dragging'<br/>activeDrag = null"]
    end

    style PerLens fill:#1a2e1a
    style Global fill:#1a1a2e
```

## 9 — Param `<select>` Change Flow

This diagram shows the full flow from a user changing a parameter select to the component updating. It runs on every parameter change.

```mermaid
flowchart TD
    A(["User changes a param select"]) --> B["state[paramType.id] = e.target.value"]
    B --> C["paramSelectMap.get(paramType.id)"]
    C --> D["for each sibling select s where s !== this:<br/>s.value = e.target.value"]
    D --> E["applyDesign()"]
    E --> F["ensureFontLoaded — inject font link if needed"]
    E --> G["compClasses() → new class string"]
    G --> H["for el of componentEls:<br/>el.className = cls"]
    H --> I["dynamic import lens.js<br/>rAF → updateCamera all non-fixed lenses"]

    style A fill:#1e3a5f,color:#e8e8e8
    style H fill:#2a4a2a,color:#e8e8e8
```

## 10 — `randomize()` (`main.js`)

This diagram shows how `randomize()` picks a random option for each parameter and applies it. It runs when the user clicks the Randomize button.

```mermaid
flowchart TD
    A(["randomize()"]) --> B["for each paramType in DESIGN_CONFIG.paramTypes"]
    B --> C["pick = opts[Math.floor(Math.random() × opts.length)]"]
    C --> D["state[paramType.id] = pick.value"]
    D --> E["paramSelectMap.get(paramType.id)"]
    E --> F["for each select s:<br/>s.value = pick.value"]
    F --> B
    B --> G["applyDesign()"]

    style A fill:#1e3a5f,color:#e8e8e8
    style G fill:#2a4a2a,color:#e8e8e8
```

## 11 — `triggerDemo()` (`main.js`)

This diagram shows how `triggerDemo()` staggers the `.demo-active` class across all component instances. It runs when the user clicks the Run Demo button.

```mermaid
flowchart TD
    A(["triggerDemo()"]) --> B["duration = APP_CONFIG.demoActiveDuration || 1800"]
    B --> C["els = Array.from(componentEls)"]
    C --> D["els.forEach(el, idx)"]
    D --> E["setTimeout delay = idx × 100ms"]
    E --> F["el.classList.add('demo-active')"]
    F --> G["setTimeout delay = duration"]
    G --> H["el.classList.remove('demo-active')"]
    H -.->|"CSS cascade"| I[":root.fx-demo .the-component.mo-*.demo-active<br/>applies motion-specific transform / filter<br/>e.g. translateY scale skew drop-shadow"]

    style A fill:#1e3a5f,color:#e8e8e8
    style I fill:#1a1a2e,color:#e8e8e8
```

**Stagger formula:**
```
delay per component = idx × 100ms
total animation end = demoActiveDuration + (componentCount − 1) × 100ms
```

Source: `main.js` `triggerDemo()`.

## 12 — `applyScheme()` (`main.js`)

This diagram shows how `applyScheme()` merges presets and activates capability layers. It runs when a scheme is invoked via `applyScheme('scheme-id')`.

```mermaid
flowchart TD
    A(["applyScheme(schemeId)"]) --> B["LIBRARY.schemes.find(s.id === schemeId)"]
    B --> C{"scheme found?"}
    C -->|"no"| D["return"]
    C -->|"yes"| E["for each presetId in scheme.presetIds"]
    E --> F["LIBRARY.presets.find(p.id === presetId)"]
    F --> G{"preset found?"}
    G -->|"no"| H["continue to next presetId"]
    G -->|"yes"| I["for each [paramId, value] in preset.selection"]
    I --> J{"paramId in state?"}
    J -->|"no"| K["skip"]
    J -->|"yes"| L["state[paramId] = value<br/>paramSelectMap selects synced"]
    L --> E

    E --> M["for each entry in capabilityLayerRegistry<br/>where !entry.alwaysOn:<br/>root.classList.remove(entry.id)"]
    M --> N{"scheme.capabilityLayers?"}
    N -->|"yes"| O["for each id:<br/>root.classList.add(id)"]
    N -->|"no"| P["skip"]
    O & P --> Q["applyDesign()"]

    style A fill:#1e3a5f,color:#e8e8e8
    style Q fill:#2a4a2a,color:#e8e8e8
```

## 13 — Maximize / Restore (`lens.js`)

This diagram shows how `toggleMaximize()` expands a lens to full viewport or restores it. It runs when the user clicks the maximize button.

```mermaid
flowchart TD
    A(["User clicks lens-max-btn"]) --> B["toggleMaximize(lensId)"]
    B --> C["for each id, cache of lensCache.entries()"]
    C --> D{"id === lensId?"}
    D -->|"yes"| E["cache.wrap.classList.toggle('lens--maximized')"]
    D -->|"no"| F["cache.wrap.classList.remove('lens--maximized')"]
    E & F --> C
    E --> G{"Was it maximized?"}
    G -->|"now maximized"| H["CSS: position fixed, inset 0<br/>z-index 100 — covers full viewport"]
    G -->|"now restored"| I["CSS: returns to #app grid placement"]

    style A fill:#1e3a5f,color:#e8e8e8
    style H fill:#2a4a2a,color:#e8e8e8
    style I fill:#2a4a2a,color:#e8e8e8
```

## 14 — Fit / 1× Toggle (fixed lens, `lens.js`)

This diagram shows how the fixed lens toggles between fit-to-viewport and 1:1 pixel rendering. It runs when the user clicks the 1×/Fit button.

```mermaid
flowchart TD
    A(["User clicks lens-view-toggle"]) --> B["cache = lensCache.get(lensId)<br/>cam = cameras[lensId]"]
    B --> C{"cache.mode1x?"}

    C -->|"false — currently Fit"| D["cam.zoom = 1<br/>cam.x = 0.5, cam.y = 0.5<br/>cache.mode1x = true<br/>viewport.classList.add('view-1x')<br/>btn.textContent = 'Fit'"]
    D --> E["updateCamera(lensId)"]
    E --> F["Component renders at true 1:1 pixel size<br/>viewport background darkens via .view-1x"]

    C -->|"true — currently 1×"| G["cam.zoom = originCamera.zoom<br/>cam.x = originCamera.x<br/>cam.y = originCamera.y<br/>cache.mode1x = false<br/>viewport.classList.remove('view-1x')<br/>btn.textContent = '1×'"]
    G --> H["updateCamera(lensId)"]
    H --> I["Component restored to design-config<br/>zoom and position"]

    style A fill:#1e3a5f,color:#e8e8e8
    style F fill:#2a4a2a,color:#e8e8e8
    style I fill:#2a4a2a,color:#e8e8e8
```

## 15 — Popover Show / Hide (`ui.js`)

This diagram shows how `showPopover()` positions the global popover and how it's dismissed. It runs when the user clicks a help button.

```mermaid
flowchart TD
    A(["User clicks param-help-btn"]) --> B["showPopover(text, anchorEl)"]
    B --> C{"popoverAnchor === anchorEl<br/>AND popover not hidden?"}
    C -->|"yes — toggle off"| D["popoverEl.classList.add('hidden')<br/>popoverAnchor = null<br/>return"]
    C -->|"no — show"| E["popoverAnchor = anchorEl<br/>popoverContentEl.textContent = text<br/>popoverEl.classList.remove('hidden')"]
    E --> F["rect = anchorEl.getBoundingClientRect()<br/>left = rect.right + 8<br/>top = rect.top"]
    F --> G{"left + 260 > innerWidth - 10?"}
    G -->|"yes"| H["left = innerWidth - 270"]
    G -->|"no"| I["keep left"]
    H & I --> J{"top + 130 > innerHeight?"}
    J -->|"yes"| K["top = rect.top - 136"]
    J -->|"no"| L["keep top"]
    K & L --> M["popoverEl.style.left = left px<br/>popoverEl.style.top = top px"]

    N(["window click — not .param-help-btn<br/>and not #global-popover"]) --> O["popoverEl.classList.add('hidden')<br/>popoverAnchor = null"]

    style A fill:#1e3a5f,color:#e8e8e8
    style M fill:#2a4a2a,color:#e8e8e8
```

## 16 — Mobile Overlay Flow (`main.js`)

This diagram shows how the mobile overlay is shown and hidden. It runs when the user interacts with mobile UI buttons.

```mermaid
flowchart LR
    A(["mobile-maximize clicked"]) --> B["mobileOverlay.classList.remove('hidden')"]
    C(["mobile-overlay-close clicked"]) --> D["mobileOverlay.classList.add('hidden')"]
    E(["mobile-apply clicked"]) --> F["mobileOverlay.classList.add('hidden')"]
    E --> G["State already current — all selects in<br/>mobile-param-list share paramSelectMap<br/>so state updated on each change event"]
    B --> H(["Overlay visible: full-screen modal<br/>5 param selects + Apply button"])
    D & F --> I(["Overlay hidden"])
    G --> I

    style A fill:#1e3a5f,color:#e8e8e8
    style H fill:#2a4a2a,color:#e8e8e8
```

## 17 — CSS Token Resolution Cascade (`app.css`)

This diagram shows how CSS custom properties cascade from Tier 1 primitives through semantic aliases to component defaults and finally to the component. It runs on every paint.

```mermaid
flowchart TD
    A["@layer tokens.primitives<br/>--_accent: #6b8aff<br/>--_green: #2dd4bf<br/>--r-sm: 4px"] --> B["@layer tokens.semantic<br/>--accent: var(--_accent)<br/>--accent-bg: color-mix(in srgb, var(--accent) 12%, transparent)"]
    B --> C["@layer tokens.component-defaults<br/>--comp-bg: #ffffff<br/>--comp-radius: 8px<br/>--comp-motion: all 300ms ease"]
    C --> D["@layer component.base<br/>.the-component consumes all<br/>var(--comp-*) and var(--btn-*) tokens"]

    F["@layer component.surface<br/>.surf-velvet { --comp-bg:#1a1a24 }<br/>.surf-holo { --comp-bg: linear-gradient }"] -->|"overrides Tier 3 surface props"| D
    G["@layer component.shape<br/>.shape-pill { --comp-radius:32px }<br/>.shape-chamfer { --comp-clip:polygon }"] -->|"overrides Tier 3 shape props"| D
    H["@layer component.depth<br/>.depth-raised { --comp-shadow:0 18px 40px }<br/>.depth-brutalist { --comp-border:4px solid }"] -->|"overrides Tier 3 depth props"| D
    I["@layer component.motion<br/>.mo-elastic { --comp-motion:700ms cubic-bezier }<br/>.mo-glitch { --comp-motion:120ms steps(3) }"] -->|"overrides Tier 3 motion props"| D
    J["@layer component.density<br/>.density-airy { --comp-padding:30px }<br/>.density-compact { --comp-padding:20px }"] -->|"overrides Tier 3 density props"| D

    K["@layer effects.holo-pan<br/>:root.fx-holo-pan .surf-holo<br/>animation: holo-pan 8s linear infinite"] -->|"highest-priority — always on"| D
    L["@layer effects.demo<br/>:root.fx-demo .the-component.mo-*.demo-active<br/>transform + filter overrides"] -->|"highest-priority — always on"| D

    D --> M(["Browser paints .the-component<br/>with fully resolved custom property values"])

    style A fill:#1e2a3a,color:#e8e8e8
    style M fill:#2a4a2a,color:#e8e8e8
```

## 18 — JS Module DAG

This diagram shows the import relationships between all JS modules. The dashed arrow indicates a dynamic import used to break a circular dependency.

```mermaid
flowchart LR
    A["config.js<br/>exports APP_CONFIG<br/>DESIGN_CONFIG · LIBRARY"] --> B
    A --> C
    B["state.js<br/>exports state · cameras<br/>componentEls · paramSelectMap<br/>lensCache · compClasses<br/>ensureFontLoaded · applyDesign"] --> D
    B --> E
    C["lens.js<br/>exports createLens<br/>updateCamera"] --> D
    E["ui.js<br/>exports createParamItem<br/>buildParamList · buildApp<br/>showPopover"] --> D
    D["main.js<br/>exports randomize<br/>triggerDemo · applyScheme<br/>runs init()"]

    B -. "dynamic import<br/>avoids circular" .-> C

    style A fill:#1e3a5f,color:#e8e8e8
    style D fill:#2a4a2a,color:#e8e8e8
    linkStyle 6 stroke:#f5a623,stroke-dasharray:5 5
```
