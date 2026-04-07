/**
 * Shared Utilities for Prompts Playground
 */
window.utils = {
  $: (id) => document.getElementById(id),
  
  nowMs: () => (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now(),
  
  fmtMs: (ms) => {
    if (!Number.isFinite(ms)) return "—";
    if (ms < 1000) return `${ms.toFixed(0)} ms`;
    return `${(ms / 1000).toFixed(2)} s`;
  },
  
  logLine: (logEl, line) => {
    if (!logEl) return;
    logEl.value += (logEl.value ? "\n" : "") + line;
    logEl.scrollTop = logEl.scrollHeight;
  },
  
  setStatus: (statusEl, msg) => {
    if (statusEl) statusEl.textContent = msg || "";
  },
  
  /**
   * Enhanced template substitution.
   * Supports {Var}, {{Var}}, {{{Var}}}, {{$Var}}, and nested keys like {{Prop.Field}}.
   */
  fillTemplate: (tpl, vars) => {
    if (!tpl) return "";
    // Regex matches: {Key}, {{Key}}, {{{Key}}}, [[Key]], {{$Key}}, etc.
    return tpl.replace(/(\{\{\{?|\{?|\[\[)([$A-Za-z0-9_.]+)(\}\}\}?|\}?|\]\])/g, (match, open, key, close) => {
      // Basic key lookup (Subject, $Subject, etc.)
      let val = vars[key];
      if (val === undefined && key.startsWith("$")) val = vars[key.slice(1)];
      if (val === undefined && !key.startsWith("$")) val = vars["$" + key];

      // Nested path support (only works if vars contains the object, not a JSON string)
      if (val === undefined && key.includes(".")) {
        const parts = key.split(".");
        let obj = vars;
        for (const p of parts) {
          if (obj && typeof obj === "object") {
            obj = obj[p] !== undefined ? obj[p] : obj["$" + p];
          } else {
            obj = undefined;
            break;
          }
        }
        val = obj;
      }

      if (val === undefined || val === null) return match;
      return String(val);
    });
  },

  /**
   * Helper to download a string as a file
   */
  downloadFile: (filename, content, type = "text/plain") => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },

  /**
   * Debounce helper
   */
  debounce: (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  }
};
