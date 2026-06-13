import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import { ThemeProvider, ToasterProvider, ToasterComponent, Toaster } from '@gravity-ui/uikit';

// Import global legacy scripts so Vite bundles them instead of 404ing
import "../../../config.local.js";
import "../../../shared/local-config-loader.js";
import "../../../shared/utils.js";
import "../../../shared/token-manager.js";
import "../../../shared/api-client.js";
import '../prompts_inquiry.js';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const toaster = new Toaster();
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ThemeProvider theme="light">
      <ToasterProvider toaster={toaster}>
        <App />
        <ToasterComponent />
      </ToasterProvider>
    </ThemeProvider>
  </React.StrictMode>
);
