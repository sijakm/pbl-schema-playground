/**
 * Shared API Client for Prompts Playground
 */
window.apiClient = {
  /**
   * Parse Server-Sent Events (SSE) from the response buffer
   */
  parseSseLines(buffer) {
    const events = [];
    const parts = buffer.split("\n");
    const rest = parts.pop() ?? "";

    for (const line of parts) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data) events.push(data);
    }

    return { events, rest };
  },

  /**
   * Execute a streaming prompt request
   * @param {Object} options { endpoint, apiKey, body, onDelta, onRefusal, onError, signal }
   */
  async stream(options) {
    const { 
      endpoint, apiKey, body, 
      onDelta, onRefusal, onError, 
      signal 
    } = options;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
        },
        signal,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status} ${response.statusText}\n\n${errText}`);
      }

      if (!response.body) {
        throw new Error("No response body (stream not available).");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let finalText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const { events, rest } = this.parseSseLines(buffer);
        buffer = rest;

        for (const raw of events) {
          if (raw === "[DONE]") break;

          let evt;
          try { evt = JSON.parse(raw); } catch { continue; }

          if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
            finalText += evt.delta;
            if (onDelta) onDelta(evt.delta, finalText);
            continue;
          }

          if (evt.type === "response.refusal.delta" && typeof evt.delta === "string") {
            if (onRefusal) onRefusal(evt.delta);
            continue;
          }

          if (evt.type === "error" || evt.type === "response.error") {
            const err = evt.error || evt;
            if (onError) onError(err);
            continue;
          }

          if (evt.type === "usage" && options.onUsage) {
            options.onUsage(evt.usage);
            continue;
          }

          if (evt.type === "response.completed" && evt.response?.usage && options.onUsage) {
            options.onUsage(evt.response.usage);
            continue;
          }
        }
      }

      return finalText;

    } catch (err) {
      if (err.name === "AbortError") {
        throw err;
      }
      throw err;
    }
  }
};
