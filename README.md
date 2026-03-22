# Scheme Remix Studio

A parametric component design system built with vanilla JavaScript. Mix five independent design axes — surface material, shape geometry, depth elevation, motion dynamics, and spatial density — and preview every combination across three simultaneous zoom lenses in real time.

> **No build step. No framework. No bundler.** Requires only a local dev server.

---

## Quick Start

The app uses ES modules and `fetch()` to load JSON config files. Opening `index.html` directly from the filesystem (`file://`) will fail. You must serve the project root over HTTP:

```bash
# Option A — Node (no install required)
npx serve .

# Option B — Python
python3 -m http.server 8080

# Option C — VS Code
Install the "Live Server" extension, then click "Go Live"
```

Then open `http://localhost:3000` (or whichever port your server reports) in your browser.

---

## What It Does

Use the sidebar selects to dial in a combination of the five design parameters. The component preview updates instantly across all three lenses. Hit **Randomize** to jump to a random combination, or **Run Demo** to trigger a live motion preview on the component.

### Design Parameters

| Axis | CSS Prefix | Options |
|---|---|---|
| Surface Material | `surf-` | velvet, console, glass, frutiger, memphis, artdeco, grunge, holo |
| Shape Geometry | `shape-` | pill, sharp, soft, chamfer, bauhaus, concentric, squircle |
| Depth Elevation | `depth-` | flat, raised, sunken, neumorphic, brutalist, glowing, concentric |
| Motion Dynamics | `mo-` | velvet, console, elastic, glitch, float, whip, spring |
| Spatial Density | `density-` | compact, normal, airy, wide |

### Lens System

Three viewports render the same component simultaneously at different zoom levels. The top lens is fixed (1× actual size) and supports a **1px toggle** to verify pixel-perfect rendering. The two bottom lenses are pannable and zoomable:

| Lens | Zoom | Type | Controls |
|---|---|---|---|
| Actual | 1× | Fixed | Hover for motion demo, toggle 1px view |
| Geometry | 2× | Pannable | Drag to pan, scroll to zoom, reset button |
| Surface | 0.75× | Pannable | Drag to pan, scroll to zoom, reset button |

All three lenses have a **maximize button** (⛶) that expands them to full viewport.

---

## Project Structure
