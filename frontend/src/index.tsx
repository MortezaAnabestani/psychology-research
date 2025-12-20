import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { registerServiceWorker } from "./utils/pwaSetup";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker immediately
registerServiceWorker();

// Push notifications will be subscribed after user logs in
// See: AuthContext.tsx
