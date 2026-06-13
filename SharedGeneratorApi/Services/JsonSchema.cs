using System.Text.RegularExpressions;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace SharedGeneratorApi.Services;

/// <summary>
/// Represents a mutable JSON schema document with helpers for filtering properties,
/// applying schema constraints, and formatting generated JSON output.
/// </summary>
/// <remarks>
/// The instance wraps a <see cref="JObject"/> schema and mutates it in-place while
/// chaining configuration methods.
/// </remarks>
/// <remarks>
/// Initializes a new instance from an existing JSON schema object.
/// </remarks>
/// <param name="jsonSchema">The parsed JSON schema document to wrap.</param>
/// <remarks>
/// The schema is copied into the current instance and any <c>x-removablePaths</c>
/// metadata is captured for later path-based exclusions.
/// </remarks>
/// <exception cref="ArgumentNullException">Thrown when <paramref name="jsonSchema"/> is null.</exception>
public partial class JsonSchema(JObject jsonSchema) : JObject(jsonSchema)
{
    #region Internal fields

    private readonly HashSet<string> includeProperties = new(StringComparer.Ordinal);
    private readonly HashSet<string> excludeProperties = new(StringComparer.Ordinal);

    private Dictionary<string, string> _cache = [];

    private readonly Dictionary<string, List<string>> removablePaths = jsonSchema["x-removablePaths"]?.ToObject<Dictionary<string, List<string>>>() ?? [];
    private IStringLocalizer _stringLocalizer = null!;

    #endregion Internal fields
    #region Constructor

    /// <summary>
    /// Parses a JSON schema string and creates a new <see cref="JsonSchema"/> instance.
    /// </summary>
    /// <param name="jsonSchema">The JSON schema text to parse.</param>
    /// <remarks>
    /// This overload is a convenience wrapper for callers that start from raw JSON text
    /// instead of an already parsed <see cref="JObject"/>.
    /// </remarks>
    /// <returns>A mutable <see cref="JsonSchema"/> instance.</returns>
    /// <exception cref="ArgumentNullException">Thrown when <paramref name="jsonSchema"/> is null or empty.</exception>
    /// <exception cref="JsonReaderException">Thrown when <paramref name="jsonSchema"/> is not valid JSON.</exception>
    public JsonSchema(string jsonSchema) : this(Parse(jsonSchema))
    {
        if (string.IsNullOrEmpty(jsonSchema))
            throw new ArgumentNullException(nameof(jsonSchema));
    }

    #endregion Constructor

    #region Public methods

    /// <summary>
    /// Limits the schema to the specified top-level properties.
    /// </summary>
    /// <param name="propertyNames">The property names to keep in the schema.</param>
    /// <returns>The current <see cref="JsonSchema"/> instance.</returns>
    public JsonSchema IncludeOnly(params string[] propertyNames)
    {
        foreach (var property in propertyNames.Where(x => !string.IsNullOrEmpty(x)))
            includeProperties.Add(property);

        return this;
    }

    /// <summary>
    /// Excludes the specified top-level properties from the schema.
    /// </summary>
    /// <param name="propertyNames">The property names to remove from the schema.</param>
    /// <returns>The current <see cref="JsonSchema"/> instance.</returns>
    public JsonSchema Exclude(params string[] propertyNames)
    {
        foreach (var property in propertyNames.Where(x => !string.IsNullOrEmpty(x)))
            excludeProperties.Add(property);

        return this;
    }

    /// <summary>
    /// Sets the <c>maxLength</c> constraint for a string property.
    /// </summary>
    /// <param name="propertyPath">The dotted schema path to the target property.</param>
    /// <param name="maxLength">The maximum allowed string length.</param>
    /// <returns>The current <see cref="JsonSchema"/> instance.</returns>
    /// <exception cref="ArgumentException">Thrown when <paramref name="maxLength"/> is less than or equal to zero.</exception>
    public JsonSchema WriteStringMaxLength(string propertyPath, int maxLength)
    {
        if (maxLength <= 0)
            throw new ArgumentException(null, nameof(maxLength));

        var jObj = ResolvePropertPath(propertyPath);

        if (jObj != null)
            jObj["maxLength"] = maxLength;
        return this;
    }

    /// <summary>
    /// Excludes schema paths that are backed by the optional <c>x-removablePaths</c> metadata.
    /// </summary>
    /// <param name="propertykeys">The top-level keys that map to removable nested paths.</param>
    /// <returns>The current <see cref="JsonSchema"/> instance.</returns>
    public JsonSchema ExcludePathWithDefinitions(params string[] propertykeys)
    {
        try
        {
            foreach (var key in propertykeys.Where(x => !string.IsNullOrWhiteSpace(x)))
                if (removablePaths.TryGetValue(key, out var paths))
                    paths.ForEach(RemovePropertyAtPath);
        }
        catch { }
        return this;
    }

    /// <summary>
    /// Sets the <c>minItems</c> and <c>maxItems</c> constraints for an array property.
    /// </summary>
    /// <param name="propertyPath">The dotted schema path to the target array property.</param>
    /// <param name="minItems">The minimum number of items allowed.</param>
    /// <param name="maxItems">The maximum number of items allowed.</param>
    /// <returns>The current <see cref="JsonSchema"/> instance.</returns>
    /// <exception cref="ArgumentException">Thrown when <paramref name="maxItems"/> is less than <paramref name="minItems"/>.</exception>
    public JsonSchema WriteArrayLenth(string propertyPath, int? minItems = null, int? maxItems = null)
    {
        if (minItems.HasValue && maxItems.HasValue && maxItems < minItems)
            throw new ArgumentException("Max number of items must be greater of min number of items");

        var jObj = ResolvePropertPath(propertyPath);

        if (jObj != null)
        {
            if (minItems.HasValue)
                jObj["minItems"] = minItems;

            if (maxItems.HasValue)
                jObj["maxItems"] = maxItems;
        }

        return this;
    }

    /// <summary>
    /// Adds the specified properties to the schema's <c>required</c> list.
    /// </summary>
    /// <param name="propertyNames">The property names to mark as required.</param>
    /// <returns>The current <see cref="JsonSchema"/> instance.</returns>
    public JsonSchema WithRequired(params string[] propertyNames)
    {
        var required = this["required"] as JArray ?? [];

        foreach (var property in propertyNames.Where(x => !string.IsNullOrEmpty(x)))
        {
            if (!required.Contains(property))
                required.Add(property);
        }

        this["required"] = required;

        return this;
    }

    /// <summary>
    /// Applies include and exclude rules to the schema and returns the current document.
    /// </summary>
    /// <returns>The current <see cref="JsonSchema"/> instance.</returns>
    public JsonSchema Build()
    {
        var schemaProperties = this["properties"] as JObject;

        if (schemaProperties != null && includeProperties.Count > 0)
            foreach (var propertyKey in schemaProperties.Properties().Select(x => x.Name).ToList())
            {
                if (!includeProperties.Contains(propertyKey))
                    schemaProperties.Remove(propertyKey);
            }

        foreach (var ex in excludeProperties)
            schemaProperties!.Remove(ex);

        return this;
    }

    /// <summary>
    /// Produces a schema JSON string with custom <c>x-*</c> metadata removed.
    /// </summary>
    /// <param name="formatting">The JSON formatting to use for the output.</param>
    /// <returns>A JSON schema string suitable for response format APIs.</returns>
    public string BuildResponseSchema(Formatting formatting = Formatting.None)
    {
        var newSchema = DeepClone() as JObject;
        RemoveXRules(newSchema);
        return newSchema!.ToString(formatting);
    }

    #endregion Public methods

    #region Formatting

    /// <summary>
    /// Formats generated JSON into human-readable text using the schema's formatting rules.
    /// </summary>
    /// <param name="generatedJson">The JSON object to format.</param>
    /// <param name="stringLocalizer">Localizer used to resolve <c>{loc.*}</c> tokens.</param>
    /// <param name="cache">Cache values used to resolve <c>{cache.*}</c> tokens.</param>
    /// <returns>A formatted string representation of the JSON payload.</returns>
    public string FormatJson(JObject generatedJson, IStringLocalizer stringLocalizer, Dictionary<string, string> cache)
    {
        ArgumentNullException.ThrowIfNull(generatedJson);

        _cache = cache;
        _stringLocalizer = stringLocalizer;

        return FormatToken(
            value: generatedJson,
            schema: this,
            index: null
        ).Trim();
    }

    /// <summary>
    /// Formats a JToken according to the provided schema, dispatching to specific formatting methods based on the schema's type and structure.
    /// </summary>
    /// <param name="value">The JToken to format.</param>
    /// <param name="schema">The schema to use for formatting.</param>
    /// <param name="index">The index of the current item, if applicable.</param>
    /// <returns>The formatted string representation of the JToken.</returns>
    private string FormatToken(JToken? value, JToken? schema, int? index)
    {
        if (schema is not JObject schemaObject || value is null || value.Type == JTokenType.Null)
            return string.Empty;

        string? type = schemaObject["type"]?.Value<string>();

        return type switch
        {
            "object" => FormatObject(value as JObject, schemaObject, index),
            "array" => FormatArray(value as JArray, schemaObject),
            "string" or "integer" or "number" or "boolean" => FormatScalar(value, schemaObject, index),
            _ => FormatByTokenShape(value, schemaObject, index)
        };
    }

    /// <summary>
    /// Formats a JObject according to the schema's formatting rules, applying property-level formatting and object-level templates as needed.
    /// </summary>
    /// <param name="value">The JObject to format.</param>
    /// <param name="schema">The schema to use for formatting.</param>
    /// <param name="index">The index of the current item, if applicable.</param>
    /// <returns>The formatted string representation of the JObject.</returns>
    private string FormatObject(JObject? value, JObject schema, int? index)
    {
        if (value is null) return string.Empty;

        JObject? properties = schema["properties"] as JObject;

        JToken? formatRule = schema["x-format"];

        if (formatRule is { Type: JTokenType.Boolean, })
            return string.Empty;

        Dictionary<string, string> renderedProperties = [];

        if (properties is not null)
        {
            foreach (JProperty propertySchema in properties.Properties())
            {
                string propertyName = propertySchema.Name;

                JToken? propertyValue = value[propertyName];
                JToken? childSchema = propertySchema.Value;

                renderedProperties[propertyName] = FormatToken(
                    value: propertyValue,
                    schema: childSchema,
                    index: null
                );
            }
        }

        string? format = schema["x-format"]?.Value<string>();

        if (!string.IsNullOrWhiteSpace(format))
        {
            return ApplyFormat(format, value, renderedProperties, items: null, index);
        }

        return string.Join(
            "\n\n",
            renderedProperties.Values.Where(v => !string.IsNullOrWhiteSpace(v))
        );
    }

    /// <summary>
    /// Formats a JArray according to the schema's formatting rules, applying item-level formatting and array-level templates as needed.
    /// </summary>
    /// <param name="value">The JArray to format.</param>
    /// <param name="schema">The schema to use for formatting.</param>
    /// <returns>The formatted string representation of the JArray.</returns>
    private string FormatArray(JArray? value, JObject schema)
    {
        if (value is null || value.Count == 0)
            return string.Empty;

        JToken? itemSchema = schema["items"];

        List<string> renderedItems = [];

        for (int i = 0; i < value.Count; i++)
        {
            string renderedItem = FormatToken(
            value: value[i],
            schema: itemSchema,
            index: i + 1
        );

            if (!string.IsNullOrWhiteSpace(renderedItem))
                renderedItems.Add(renderedItem.TrimEnd());
        }

        string items = string.Join("\n", renderedItems);

        string? format = schema["x-format"]?.Value<string>();

        if (!string.IsNullOrWhiteSpace(format))
        {
            return ApplyFormat(
                format: format,
                value: value,
                renderedProperties: null,
                items: items,
                index: null
            );
        }

        return items;
    }

    /// <summary>
    /// Formats a scalar JToken (string, number, boolean) according to the schema's formatting rules.
    /// </summary>
    /// <param name="value">The JToken to format.</param>
    /// <param name="schema">The schema to use for formatting.</param>
    /// <param name="index">The index of the current item, if applicable.</param>
    /// <returns>The formatted string representation of the JToken.</returns>
    private string FormatScalar(JToken value, JObject schema, int? index)
    {
        string scalarValue = value.Type switch
        {
            JTokenType.String => value.Value<string>() ?? string.Empty,
            _ => value.ToString()
        };

        string? format = schema["x-format"]?.Value<string>();

        if (string.IsNullOrWhiteSpace(format))
            return scalarValue;

        return ApplyFormat(
            format: format,
            value: value,
            renderedProperties: null,
            items: null,
            index: index
        );
    }

    /// <summary>
    /// Formats a JToken based on its shape when the schema does not specify a type.
    /// </summary>
    /// <param name="value">The JToken to format.</param>
    /// <param name="schema">The schema to use for formatting.</param>
    /// <param name="index">The index of the current item, if applicable.</param>
    /// <returns>The formatted string representation of the JToken.</returns>
    private string FormatByTokenShape(JToken value, JObject schema, int? index)
    {
        return value switch
        {
            JObject obj => FormatObject(obj, schema, index),
            JArray arr => FormatArray(arr, schema),
            _ => FormatScalar(value, schema, index)
        };
    }

    /// <summary>
    /// Applies a formatting template to a value, replacing tokens with rendered content from the schema.
    /// </summary>
    /// <param name="format">The formatting template.</param>
    /// <param name="value">The value to format.</param>
    /// <param name="renderedProperties">The rendered properties from the schema.</param>
    /// <param name="items">The rendered items from an array schema.</param>
    /// <param name="index">The index of the current item, if applicable.</param>
    /// <returns></returns>
    private string ApplyFormat(
        string format,
        JToken value,
        Dictionary<string, string>? renderedProperties,
        string? items,
        int? index)
    {
        return FormattingRegex().Replace(format, match =>
        {
            string key = match.Groups[1].Value;

            if (key == "value")
                return TokenToString(value);

            if (key == "item")
                return TokenToString(value);

            if (key == "items")
                return items ?? string.Empty;

            if (key == "index")
                return index?.ToString() ?? string.Empty;

            if (key.StartsWith("value.", StringComparison.Ordinal))
            {
                string path = key["value.".Length..];

                if (renderedProperties is not null && renderedProperties.TryGetValue(path, out string? renderedProperty))
                    return renderedProperty;

                return ResolvePath(value, path);
            }

            if (key.StartsWith("loc", StringComparison.OrdinalIgnoreCase))
                return _stringLocalizer[key.Split('.')[1]];

            if (key.StartsWith("cache", StringComparison.OrdinalIgnoreCase))
                return _cache[key.Split('.')[1]];

            return match.Value;
        });
    }

    /// <summary>
    /// Resolves a dotted path within a JToken and returns the string representation of the target token.
    /// </summary>
    /// <param name="token">The JToken to search within.</param>
    /// <param name="path">The dotted path to resolve.</param>
    /// <returns>The string representation of the target token, or an empty string if not found.</returns>
    private static string ResolvePath(JToken token, string path)
    {
        JToken? current = token;

        foreach (string part in path.Split('.', StringSplitOptions.RemoveEmptyEntries))
        {
            current = current?[part];

            if (current is null)
                return string.Empty;
        }

        return TokenToString(current);
    }

    /// <summary>
    /// Converts a JToken to its string representation, handling different token types appropriately.
    /// </summary>
    /// <param name="token">The JToken to convert.</param>
    /// <returns>The string representation of the JToken.</returns>
    private static string TokenToString(JToken? token)
    {
        if (token is null || token.Type == JTokenType.Null)
            return string.Empty;

        return token switch
        {
            JValue value => value.Value?.ToString() ?? string.Empty,

            JArray array => string.Join(
                "\n",
                array.Select(item => TokenToString(item))
            ),

            JObject obj => obj.ToString(Newtonsoft.Json.Formatting.None),

            _ => token.ToString()
        };
    }

    #endregion

    #region Private methods

    private JObject? ResolvePropertPath(string propertyPath)
    {
        var segments = propertyPath.Split('.');

        JObject? current = this;

        foreach (var segment in segments)
        {
            current = current?["properties"]?[segment] as JObject;

            if (current == null)
                return null;

            // current type is 'array'
            if (current["type"] is JToken typeToken)
            {
#pragma warning disable CS1717
                if (typeToken.Type == JTokenType.String && typeToken.ToString() == "array")
                    current = current;
                //current = current["items"] as JObject;
#pragma warning restore CS1717
                else if (typeToken.Type == JTokenType.Array && typeToken.Any(x => x.ToString() == "array"))
                    current = current["items"] as JObject;
                //current = current;
            }
        }

        return current;
    }

    private static void RemoveXRules(JToken? token)
    {
        switch (token)
        {
            case JObject obj:
                {
                    List<JProperty> propertiesToRemove = [
                        .. obj.Properties().Where(p => p.Name.StartsWith("x-", StringComparison.OrdinalIgnoreCase))
                    ];

                    foreach (JProperty property in propertiesToRemove)
                        property.Remove();

                    // Recurse into remaining properties
                    foreach (JProperty property in obj.Properties().ToList())
                        RemoveXRules(property.Value);

                    break;
                }

            case JArray array:
                {
                    foreach (JToken item in array)
                        RemoveXRules(item);
                    break;
                }
        }

    }

    private void RemovePropertyAtPath(string path)
    {
        if (path.Split('.', StringSplitOptions.RemoveEmptyEntries) is not { Length: > 0 } segments)
            return;
        RemovePropertyAtPath(segments, this);
    }

    private static void RemovePropertyAtPath(string[] path, JObject? schema = null)
    {
        try
        {
            if (schema is not JObject current) // if the incoming schema is null then the path is wrong.
                throw new ArgumentException($"child object not found");

            if (current["type"]!.ToString() is "array") // if is an array recurse without slicing the path
            {
                RemovePropertyAtPath(path, current["items"] as JObject);
                return;
            }

            var leafName = path[0];

            var (childContainer, child) = (current["properties"] as JObject)?[leafName] is { } // finds the child
                ? (current["properties"] as JObject, current["properties"]![leafName] as JObject)
                : (current["definitions"] as JObject, current["definitions"]![leafName] as JObject);

            if (childContainer is null || child is null)
                throw new ArgumentException($"Exclusion path is too dep at {leafName}");

            if (path.Length > 1)
            {
                RemovePropertyAtPath(path[1..], child);
                return;
            }

            //The child is removed
            if (child is null)
                throw new ArgumentException("the property specified by the path does not exist");
            childContainer.Remove(leafName);
            (current["required"] as JArray)?.FirstOrDefault(rt => rt.ToString() == leafName)?.Remove();
        }
        catch { }
    }

    [GeneratedRegex(@"\{([^{}]+)\}")]
    private static partial Regex FormattingRegex();

    #endregion Private methods
}
