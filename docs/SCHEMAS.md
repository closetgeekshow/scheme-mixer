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
