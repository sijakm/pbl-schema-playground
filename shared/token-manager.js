/**
 * Shared Token Manager for Prompts Playground
 */
class TokenManager {
  constructor(config = {}) {
    this.containerId = config.containerId || "tokenSummary";
    this.pricing = config.pricing || {
      "gpt-5.4":       { input: 2.50,  output: 15.00 },
      "gpt-5.4-mini":  { input: 0.75,  output: 4.50  },
      "gpt-5.4-nano":  { input: 0.20,  output: 1.25  },
      "gpt-5-mini":    { input: 0.75,  output: 4.50  },
      "gpt-5.2":       { input: 2.50,  output: 15.00 }
    };
    this.reset();
  }

  reset() {
    this.usage = { input: 0, output: 0, total: 0, calls: 0 };
    const panel = document.getElementById(this.containerId);
    if (panel) panel.style.display = "none";
  }

  add(usage) {
    if (!usage) return;
    const inT = (usage.input_tokens || usage.prompt_tokens || 0);
    const outT = (usage.output_tokens || usage.completion_tokens || 0);
    this.usage.input += inT;
    this.usage.output += outT;
    this.usage.total += (usage.total_tokens || (inT + outT));
    this.usage.calls += 1;
  }

  updateUI(model) {
    const pricing = this.pricing[model] || { input: 0, output: 0 };
    const inputCost  = (this.usage.input  / 1_000_000) * pricing.input;
    const outputCost = (this.usage.output / 1_000_000) * pricing.output;
    const totalCost  = inputCost + outputCost;

    const fmt = n => n.toLocaleString("en-US");
    const fmtUSD = n => n < 0.01 ? `< $0.01` : `$${n.toFixed(4)}`;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    set("tsInput",        fmt(this.usage.input));
    set("tsInputCost",    fmtUSD(inputCost));
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
