/**
 * Shared Token Manager for Prompts Playground
 */
class TokenManager {
  constructor(config = {}) {
    this.containerId = config.containerId || "tokenSummary";
    this.pricing = config.pricing || {
      "gpt-5.4":       { input: 2.50,  output: 15.00, cached: 0.25   },
      "gpt-5.4-mini":  { input: 0.75,  output: 4.50,  cached: 0.075  },
      "gpt-5.4-nano":  { input: 0.20,  output: 1.25,  cached: 0.02   },
      "gpt-5-mini":    { input: 0.75,  output: 4.50,  cached: 0.075  },
      "gpt-5.2":       { input: 2.50,  output: 15.00, cached: 0.25   }
    };
    this.reset();
  }

  reset() {
    this.usage = { input: 0, output: 0, total: 0, calls: 0, cached: 0 };
    const panel = document.getElementById(this.containerId);
    if (panel) panel.style.display = "none";
  }

  add(usage) {
    if (!usage) return;
    const inT  = (usage.input_tokens || usage.prompt_tokens || 0);
    const outT = (usage.output_tokens || usage.completion_tokens || 0);
    const cT   = (usage.input_tokens_details?.cached_tokens || usage.prompt_tokens_details?.cached_tokens || 0);

    this.usage.input  += inT;
    this.usage.output += outT;
    this.usage.cached += cT;
    this.usage.total  += (usage.total_tokens || (inT + outT));
    this.usage.calls  += 1;
  }

  formatUsage(usage) {
    if (!usage) return "";
    const inT  = (usage.input_tokens || usage.prompt_tokens || 0);
    const outT = (usage.output_tokens || usage.completion_tokens || 0);
    const cT   = (usage.input_tokens_details?.cached_tokens || usage.prompt_tokens_details?.cached_tokens || 0);
    return `(Tokens: ${inT - cT} in, ${cT} cached, ${outT} out)`;
  }

  updateUI(model) {
    const p = this.pricing[model] || { input: 0, output: 0, cached: 0 };
    
    // Normal input is input tokens minus cached
    const inputCost  = ((this.usage.input - this.usage.cached) / 1_000_000) * p.input;
    const cachedCost = (this.usage.cached / 1_000_000) * (p.cached || p.input * 0.5);
    const outputCost = (this.usage.output / 1_000_000) * p.output;
    const totalCost  = inputCost + cachedCost + outputCost;

    const fmt = n => n.toLocaleString("en-US");
    const fmtUSD = n => n < 0.01 && n > 0 ? `< $0.01` : `$${n.toFixed(4)}`;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    set("tsInput",        fmt(this.usage.input - this.usage.cached));
    set("tsInputCost",    fmtUSD(inputCost));
    set("tsCached",       fmt(this.usage.cached));
    set("tsCachedCost",   fmtUSD(cachedCost));
    set("tsOutput",       fmt(this.usage.output));
    set("tsOutputCost",   fmtUSD(outputCost));
    set("tsTotal",        fmt(this.usage.total));
    set("tsTotalCost",    `${this.usage.calls} call${this.usage.calls !== 1 ? "s" : ""}`);
    set("tsTotalCostValue", `$${totalCost.toFixed(4)}`);
    set("tsCallCount",    String(this.usage.calls));
    set("tsModel",        model);

    const panel = document.getElementById(this.containerId);
    if (panel) panel.style.display = "block";
  }
}

window.TokenManager = TokenManager;
