# JsonSchema

[<- back to readme](../README.md)

`JsonSchema` is a mutable JSON schema document wrapper with helpers for filtering properties, applying constraints, and formatting generated JSON output.

## Namespace

`CheckItLabs.CheckItLearning.AiCore.JsonSchema`

## Primary type

- `JsonSchema`

## What it does

The class wraps a JSON schema document and lets callers:

- include only selected properties
- exclude specific properties
- remove nested properties using schema paths
- write string length constraints
- write array size constraints
- add required properties
- emit the current schema or a response-ready JSON string
- format generated JSON with schema-aware placeholders

## Construction

Create a `JsonSchema` from a JSON schema string:

```csharp
var schema = new JsonSchema(jsonSchema);
```

If you already have a parsed schema object, use the `JObject` overload:

```csharp
var schema = new JsonSchema(JObject.Parse(jsonSchema));
```

The string overload requires valid JSON text and throws if the input is null, empty, or malformed.

## Common operations

- `new JsonSchema(string jsonSchema)`
    - Constructor from a JSON schema string
- `new JsonSchema(JObject jsonSchema)`
    - Constructor from a parsed `JObject` schema 
- `IncludeOnly(params string[] propertyNames)`
    - Include only the specified top-level properties in the schema 
- `Exclude(params string[] propertyNames)`
    - Exclude the specified top-level properties from the schema 
- `ExcludePathWithDefinitions(params string[] propertyKeys)`
    - Exclude properties by path, removing any related `definitions` entries
- `WriteStringMaxLength(string propertyPath, int maxLength)`
    - Write a `maxLength` constraint for a string property at the specified path
- `WriteArrayLength(string propertyPath, int? minItems = null, int? maxItems = null)`
    - Write `minItems` and/or `maxItems` constraints for an array property at the specified path
- `WithRequired(params string[] propertyNames)`
    - Add the specified top-level properties to the `required` array in the schema
- `Build()`
    - Apply the include/exclude rules and return the current schema as a JSON string
- `BuildResponseSchema(Formatting formatting = Formatting.None)`
    - Return a JSON string of the current schema with any custom `x-*` metadata removed, suitable for response validation
- `FormatJson(JObject generatedJson, IStringLocalizer stringLocalizer, Dictionary<string, string> cache)`
    - Format generated JSON by applying the format rules from the schema. Using the `stringLocalizer` for any constant strings and the cache for any values that are inherited from previous steps.

## Example

```csharp
using Microsoft.Extensions.Localization;
using Newtonsoft.Json.Linq;

var schema = new JsonSchema(schemaJson)
    .IncludeOnly("title", "summary")
    .WriteStringMaxLength("summary", 500)
    .WithRequired("title")
    .Build();

string responseSchema = schema.BuildResponseSchema(Newtonsoft.Json.Formatting.Indented);

var formatted = schema.FormatJson(
    generatedJson: JObject.Parse("""
    {
      "title": "Lesson plan",
      "summary": "A short summary"
    }
    """),
    stringLocalizer: localizer,
    cache: new Dictionary<string, string>());
```

## Notes

- `JsonSchema` mutates the underlying schema object as you chain methods.
- The string constructor is the most direct entry point when you start from raw JSON text.
- The `JObject` constructor is useful when the schema has already been parsed or transformed.
- Nested path handling supports property paths separated by dots.
- `Build()` applies include and exclude rules in place
- `BuildResponseSchema()` returns a cloned schema string with custom `x-*` metadata removed.
- Some exclusion helpers intentionally swallow path-related errors so a missing optional path does not break the build flow.
