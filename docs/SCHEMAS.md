# SCHEMAS

All schemas are JSON Schema Draft-07 and describe authored configuration entities.

## AppConfig

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://scheme-remix.studio/schema/AppConfig.json",
  "title": "AppConfig",
  "type": "object",
  "additionalProperties": false,
  "required": ["title", "subtitle", "demoActiveDuration", "camera", "capabilityLayerRegistry", "primitiveRegistry"],
  "properties": {
    "title": { "type": "string" },
    "subtitle": { "type": "string" },
    "demoActiveDuration": { "type": "integer", "minimum": 0 },
    "camera": {
      "type": "object",
      "additionalProperties": false,
      "required": ["panClamp", "zoomClamp"],
      "properties": {
        "panClamp": { "type": "array", "minItems": 2, "maxItems": 2, "items": { "type": "number" } },
        "zoomClamp": { "type": "array", "minItems": 2, "maxItems": 2, "items": { "type": "number" } }
      }
    },
    "capabilityLayerRegistry": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["id", "layer", "alwaysOn", "description"],
        "properties": {
          "id": { "type": "string" },
          "layer": { "type": "string" },
          "alwaysOn": { "type": "boolean" },
          "description": { "type": "string" }
        }
      }
    },
    "primitiveRegistry": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["name", "cssType"],
        "properties": {
          "name": { "type": "string", "pattern": "^--[a-z0-9-]+$" },
          "cssType": { "type": "string" }
        }
      }
    }
  }
}
```

**Live instance:** `data/app.config.json`
- `title`: `"Scheme Remix Studio"`
- `subtitle`: `"Parametric component design system"`
- `demoActiveDuration`: `1800`
- `camera.panClamp`: `[-1, 1]`
- `camera.zoomClamp`: `[0.5, 3]`

## PropSetProp

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://scheme-remix.studio/schema/PropSetProp.json",
  "title": "PropSetProp",
  "type": "object",
  "additionalProperties": false,
  "required": ["name", "cssType", "initial"],
  "properties": {
    "name": { "type": "string", "pattern": "^--[a-z0-9-]+$" },
    "cssType": { "type": "string" },
    "initial": { "oneOf": [{ "type": "string" }, { "type": "number" }] },
    "registerProperty": { "type": "boolean", "default": false }
  }
}
```

**Live instances:** `data/design.config.json` `propSets[*].props[*]`
- Example: `{"name":"--comp-color","cssType":"color","initial":"000000","registerProperty":true}`

## PropSet

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://scheme-remix.studio/schema/PropSet.json",
  "title": "PropSet",
  "type": "object",
  "additionalProperties": false,
  "required": ["id", "label", "props"],
  "properties": {
    "id": { "type": "string" },
    "label": { "type": "string" },
    "props": {
      "type": "array",
      "minItems": 1,
      "items": { "$ref": "PropSetProp.json" }
    }
  }
}
```

**Live instances:** `data/design.config.json` `propSets[]`
- 5 entries: `surfaceMaterial` (12 props), `shapeGeometry` (4 props), `depthElevation` (4 props), `motionDynamics` (1 prop), `spatialDensity` (5 props)

## ParamTypeOption

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://scheme-remix.studio/schema/ParamTypeOption.json",
  "title": "ParamTypeOption",
  "type": "object",
  "additionalProperties": false,
  "required": ["value", "label"],
  "properties": {
    "value": { "type": "string" },
    "label": { "type": "string" },
    "group": { "type": "string" },
    "fontsource": { "type": "string", "format": "uri" }
  }
}
```

**Live instances:** `data/design.config.json` `paramTypes[*].options[*]`
- Example: `{"value":"velvet","label":"Velvet — Matte Solid","fontsource":"https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap"}`

## ParamType

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://scheme-remix.studio/schema/ParamType.json",
  "title": "ParamType",
  "type": "object",
  "additionalProperties": false,
  "required": ["id", "cssPrefix", "label", "description", "propSetIds", "options"],
  "properties": {
    "id": { "type": "string" },
    "cssPrefix": { "type": "string" },
    "label": { "type": "string" },
    "description": { "type": "string" },
    "propSetIds": { "type": "array", "minItems": 1, "items": { "type": "string" } },
    "options": { "type": "array", "minItems": 1, "items": { "$ref": "ParamTypeOption.json" } }
  }
}
```

**Live instances:** `data/design.config.json` `paramTypes[]`
- 5 entries: `surface`, `shape`, `depth`, `motion`, `density`

## Lens

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://scheme-remix.studio/schema/Lens.json",
  "title": "Lens",
  "type": "object",
  "additionalProperties": false,
  "required": ["id", "zoom", "desc", "x", "y"],
  "properties": {
    "id": { "type": "string" },
    "zoom": { "type": "number", "minimum": 0.1 },
    "desc": { "type": "string" },
    "x": { "type": "number", "minimum": 0, "maximum": 1 },
    "y": { "type": "number", "minimum": 0, "maximum": 1 },
    "fixed": { "type": "boolean", "default": false }
  }
}
```

**Live instances:** `data/design.config.json` `lenses[]`
- `[{"id":"actual","zoom":1,"fixed":true}, {"id":"geometry","zoom":2}, {"id":"surface","zoom":0.75}]`

## Preset

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://scheme-remix.studio/schema/Preset.json",
  "title": "Preset",
  "type": "object",
  "additionalProperties": false,
  "required": ["id", "label", "selection"],
  "properties": {
    "id": { "type": "string" },
    "label": { "type": "string" },
    "description": { "type": "string" },
    "selection": {
      "type": "object",
      "additionalProperties": { "type": "string" }
    }
  }
}
```

**Live file:** `data/library.json` — `presets:[]` (empty at v0.2)

## Scheme

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://scheme-remix.studio/schema/Scheme.json",
  "title": "Scheme",
  "type": "object",
  "additionalProperties": false,
  "required": ["id", "label", "presetIds"],
  "properties": {
    "id": { "type": "string" },
    "label": { "type": "string" },
    "description": { "type": "string" },
    "presetIds": { "type": "array", "minItems": 1, "items": { "type": "string" } },
    "capabilityLayers": { "type": "array", "items": { "type": "string" } }
  }
}
```

**Live file:** `data/library.json` — `schemes:[]` (empty at v0.2)

## Library

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://scheme-remix.studio/schema/Library.json",
  "title": "Library",
  "type": "object",
  "additionalProperties": false,
  "required": ["presets", "schemes"],
  "properties": {
    "presets": { "type": "array", "items": { "$ref": "Preset.json" } },
    "schemes": { "type": "array", "items": { "$ref": "Scheme.json" } }
  }
}
```

**Live file:** `data/library.json` — `{"presets":[],"schemes":[]}` (empty at v0.2)
