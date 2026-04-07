/**
 * SharedSchemaEditor
 * A unified component for editing JSON schemas and prompt templates.
 */
class SchemaEditor {
  constructor(config = {}) {
    this.container = config.container;
    this.tabs = config.tabs || []; // Array of { id, label, schema, template, requiredVariables }
    this.activeTabId = config.activeTabId || (this.tabs.length > 0 ? this.tabs[0].id : null);
    this.colorProvider = config.colorProvider || this.defaultColorProvider.bind(this);
    this.onUpdate = config.onUpdate;
    this.showToggles = config.showToggles !== false; // Whether to handle Hide/Show editor buttons
    
    // Internal state
    this.schemas = {};
    this.templates = {};
    this.initialized = false;

    console.log("SchemaEditor: Initializing with tabs:", this.tabs.map(t => t.id));

    if (this.tabs.length > 0) {
      this.init();
    }
  }

  init() {
    this.tabs.forEach(tab => {
      // Deep clone schema to avoid mutating originals
      try {
        if (tab.schema) {
          this.schemas[tab.id] = JSON.parse(JSON.stringify(tab.schema));
        } else {
          console.warn(`SchemaEditor: No schema provided for tab ${tab.id}`);
          this.schemas[tab.id] = { type: "object", properties: {} };
        }
      } catch (e) {
        console.error(`SchemaEditor: Failed to clone schema for tab ${tab.id}`, e);
        this.schemas[tab.id] = { type: "object", properties: {} };
      }
      this.templates[tab.id] = tab.template || "";
    });

    this.render();
    this.initialized = true;
  }

  updateData(tabs, activeTabId = null) {
      console.log("SchemaEditor: Updating data...");
      this.tabs = tabs;
      if (activeTabId) this.activeTabId = activeTabId;
      else if (!this.tabs.find(t => t.id === this.activeTabId)) {
          this.activeTabId = this.tabs.length > 0 ? this.tabs[0].id : null;
      }
      this.init();
  }

  render() {
    if (!this.container) {
      console.error("SchemaEditor: Container not found!");
      return;
    }

    let html = ``;

    // 1. Render Tabs if more than one
    if (this.tabs.length > 1) {
      html += `<div class="tab-container" style="margin-bottom: 20px;">`;
      this.tabs.forEach(tab => {
        const isActive = tab.id === this.activeTabId;
        html += `<button class="tab-btn ${isActive ? 'active-tab' : ''}" data-tab-id="${tab.id}">${tab.label}</button>`;
      });
      html += `</div>`;
    }

    // 2. Render Header with Copy buttons
    html += `
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-bottom: 12px;">
        <button class="btn btn-outline btn-pill" data-action="copy-schema">Copy Schema JSON</button>
        ${this.templates[this.activeTabId] ? `<button class="btn btn-outline btn-pill" data-action="copy-template">Copy Template</button>` : ""}
      </div>
    `;

    // 3. Render Active Tab Content
    const activeTab = this.tabs.find(t => t.id === this.activeTabId);
    if (activeTab) {
      html += `<div class="schema-pane" style="background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);">`;
      
      // Template Section (optional)
      if (this.templates[this.activeTabId] !== undefined && this.templates[this.activeTabId] !== null) {
        html += `
          <div class="schema-section">
            <div class="schema-section-header">
              <strong>Prompt Template</strong>
            </div>
            <textarea class="prompt-template-textarea" data-tab-id="${activeTab.id}">${this.templates[this.activeTabId]}</textarea>
          </div>
        `;
      }

      // Schema Section
      html += `
        <div class="schema-section" style="border-bottom: none;">
          <div class="schema-section-header">
            <strong>JSON Output Schema (Instructions)</strong>
            <button class="btn btn-success btn-pill" style="height: 24px; padding: 0 10px; font-size: 11px;" data-action="add-top-property">+ Add Property</button>
          </div>
          <div class="schema-tree-root">
            ${this.renderNode(this.schemas[this.activeTabId], "Root", [], "")}
          </div>
        </div>
      `;
      html += `</div>`;
    } else {
      html += `<div class="schema-pane"><p class="muted">No active tab selected or no schema found.</p></div>`;
    }

    this.container.innerHTML = html;
    this.bindTabEvents();
    this.bindEditorEvents();
    
    // Auto-resize all textareas
    setTimeout(() => {
      this.container.querySelectorAll("textarea").forEach(ta => this.autoResize(ta));
    }, 50);
  }

  renderNode(node, name, pathArr, inheritedColor) {
    if (!node) return "";

    const isRoot = pathArr.length === 0;
    
    // Use color provider for custom logic
    let colorClass = "color-gray";
    try {
      colorClass = this.colorProvider(node, name, pathArr, inheritedColor);
    } catch (e) {
      console.warn("SchemaEditor: colorProvider failed", e);
    }
    
    const label = isRoot ? "Root Object" : name;
    const nodeType = node.type || (node.properties ? "object" : "unknown");
    const isCollapsible = (node.properties && Object.keys(node.properties).length > 0) || (node.items && node.items.properties);

    let html = `<div class="schema-field-group">`;
    html += `
      <div class="node-header ${isCollapsible ? "collapsible" : ""}" data-path="${pathArr.join(".")}">
        <div class="field-header" style="flex: 1;">
          <div>
            <span class="schema-label">${this.formatLabel(label)}</span>
            <span class="schema-type-badge" style="font-size: 10px; opacity: 0.7; margin-left: 5px;">${nodeType}</span>
          </div>
          <div class="node-actions">
             ${nodeType === "object" ? `<button class="schema-action-btn btn-success" title="Add Child" data-action="add-property" data-path="${pathArr.join(".")}">+</button>` : ""}
             ${isRoot ? "" : `<button class="schema-action-btn btn-danger" title="Delete" data-action="remove-property" data-path="${pathArr.join(".")}">−</button>`}
          </div>
        </div>
      </div>
    `;

    html += `<div class="children-container ${isCollapsible ? "schema-tree-node" : ""} ${colorClass}">`;
    if (node.description !== undefined) {
      html += `<textarea class="schema-textarea" data-path="${pathArr.join(".")}">${node.description}</textarea>`;
    }
    
    // Properties recursion
    if (node.properties) {
      for (const key in node.properties) {
        html += this.renderNode(node.properties[key], key, [...pathArr, "properties", key], colorClass);
      }
    }
    
    // Items recursion (for arrays)
    if (node.items && typeof node.items === 'object') {
      if (node.items.properties || node.items.description !== undefined) {
        html += this.renderNode(node.items, name + " Item", [...pathArr, "items"], colorClass);
      }
    }
    
    html += `</div></div>`;
    return html;
  }

  bindTabEvents() {
    this.container.querySelectorAll(".tab-btn").forEach(btn => {
      btn.onclick = () => {
        this.activeTabId = btn.dataset.tabId;
        this.render();
      };
    });

    // Copy buttons
    const schemaCopy = this.container.querySelector('[data-action="copy-schema"]');
    if (schemaCopy) schemaCopy.onclick = () => this.copySchemaUI();

    const templateCopy = this.container.querySelector('[data-action="copy-template"]');
    if (templateCopy) templateCopy.onclick = () => this.copyTemplateUI();
  }

  bindEditorEvents() {
    const activeTabId = this.activeTabId;

    // Template changes
    const templateTa = this.container.querySelector(".prompt-template-textarea");
    if (templateTa) {
      templateTa.oninput = (e) => {
        this.templates[activeTabId] = e.target.value;
        this.autoResize(e.target);
        if (this.onUpdate) this.onUpdate();
      };
    }

    // Schema description changes
    this.container.querySelectorAll(".schema-textarea").forEach(ta => {
      ta.oninput = (e) => {
        this.updateDescription(e.target.dataset.path, e.target.value);
        this.autoResize(e.target);
        if (this.onUpdate) this.onUpdate();
      };
    });

    // Property buttons
    this.container.querySelectorAll('[data-action="add-top-property"]').forEach(btn => {
      btn.onclick = () => this.addPropertyUI("");
    });
    this.container.querySelectorAll('[data-action="add-property"]').forEach(btn => {
      btn.onclick = () => this.addPropertyUI(btn.dataset.path);
    });
    this.container.querySelectorAll('[data-action="remove-property"]').forEach(btn => {
      btn.onclick = () => this.removePropertyUI(btn.dataset.path);
    });

    // Toggle collapse
    this.container.querySelectorAll(".node-header.collapsible").forEach(header => {
      header.addEventListener("click", (e) => {
        if (e.target.closest("button")) return;
        header.classList.toggle("collapsed");
        const children = header.nextElementSibling;
        if (children) {
          children.classList.toggle("hidden");
          if (!children.classList.contains("hidden")) {
            children.querySelectorAll("textarea").forEach(ta => this.autoResize(ta));
          }
        }
      });
    });
  }

  updateDescription(path, val) {
    const parts = path.split(".");
    let curr = this.schemas[this.activeTabId];
    if (!curr) return;
    
    try {
      for (const p of parts) curr = curr[p];
      curr.description = val;
    } catch (e) {
      console.warn(`SchemaEditor: Failed to update description at ${path}`, e);
    }
  }

  addPropertyUI(parentPath) {
    const name = prompt("Name of the new property (e.g. LessonSummary):");
    if (!name) return;
    const t = prompt("Type (string / number / integer / object / array):", "string");
    if (!t) return;
    
    let parentObj = this.schemas[this.activeTabId];
    if (parentPath) {
      const parts = parentPath.split(".");
      for (const p of parts) parentObj = parentObj[p];
    }
    
    if (!parentObj.properties) parentObj.properties = {};
    if (!parentObj.required) parentObj.required = [];
    
    const newProp = { type: t, description: "" };
    if (t === "object") {
      newProp.properties = {};
      newProp.required = [];
      newProp.additionalProperties = false;
    } else if (t === "array") {
      newProp.items = { type: "string" };
    }
    
    parentObj.properties[name] = newProp;
    if (!parentObj.required.includes(name)) parentObj.required.push(name);
    if (parentObj.type === "object") parentObj.additionalProperties = false;
    
    this.render();
    if (this.onUpdate) this.onUpdate();
  }

  removePropertyUI(path) {
    if (confirm(`Are you sure you want to delete ${path}?`)) {
      const parts = path.split(".");
      const propName = parts.pop();
      let parentObj = this.schemas[this.activeTabId];
      for (const p of parts) parentObj = parentObj[p];
      
      if (parentObj.properties) delete parentObj.properties[propName];
      if (parentObj.required) parentObj.required = parentObj.required.filter(r => r !== propName);
      
      this.render();
      if (this.onUpdate) this.onUpdate();
    }
  }

  copySchemaUI() {
    const json = JSON.stringify(this.schemas[this.activeTabId], null, 2);
    navigator.clipboard.writeText(json).then(() => {
      alert("Schema JSON copied to clipboard!");
    });
  }

  copyTemplateUI() {
    const text = this.templates[this.activeTabId];
    const activeTab = this.tabs.find(t => t.id === this.activeTabId);
    if (!activeTab) return;

    const required = activeTab.requiredVariables || [];
    const missing = required.filter(key => {
      const regex = new RegExp(`\\\\{\\\\{\\\\{?\\\\$?${key}\\\\}\\\\}\\\\}?`, "i");
      return !regex.test(text);
    });

    if (missing.length > 0) {
      const msg = `WARNING: The following required variables are missing from your template: ${missing.join(", ")}.\n\nThis will likely break the generation process because the AI won't receive these parameters.\n\nDo you still want to copy to clipboard?`;
      if (!confirm(msg)) return;
    }

    navigator.clipboard.writeText(text).then(() => {
      alert("Template copied to clipboard!");
    });
  }

  getModifiedSchema(tabId = null) {
    const id = tabId || this.activeTabId;
    if (!this.schemas[id]) return null;
    return JSON.parse(JSON.stringify(this.schemas[id]));
  }

  getModifiedTemplate(tabId = null) {
    const id = tabId || this.activeTabId;
    return this.templates[id] || "";
  }

  autoResize(ta) {
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = (ta.scrollHeight + 2) + "px";
  }

  formatLabel(pathOrName) {
    if (!pathOrName) return "";
    const name = pathOrName.split(".").pop();
    return name.replace(/([A-Z])/g, " $1").trim();
  }

  defaultColorProvider(node, name, pathArr, inheritedColor) {
    const depth = pathArr.length;
    if (depth === 2 && pathArr[0] === "properties") {
        return "color-gray";
    }
    return inheritedColor || "color-gray";
  }
}
window.SchemaEditor = SchemaEditor;
