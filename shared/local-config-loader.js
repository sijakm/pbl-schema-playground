(function() {
  /**
   * Automatically pre-fills the "Access Password" field if a local configuration
   * is found in window.LOCAL_CONFIG.
   */
  function prefillApiKey() {
    const apiKeyField = document.getElementById('apiKey');
    if (apiKeyField && window.LOCAL_CONFIG && window.LOCAL_CONFIG.apiKey) {
      // Only fill if it's currently empty to avoid overwriting user's manual input
      if (!apiKeyField.value) {
        apiKeyField.value = window.LOCAL_CONFIG.apiKey;
        
        // Trigger events so any listeners in the app can catch the update
        apiKeyField.dispatchEvent(new Event('input', { bubbles: true }));
        apiKeyField.dispatchEvent(new Event('change', { bubbles: true }));
        
        console.log('✅ Access Password pre-filled from config.local.js');
      }
    }
  }

  // Run on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', prefillApiKey);
  } else {
    prefillApiKey();
  }
})();
