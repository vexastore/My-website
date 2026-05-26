import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Remove pre-rendered SEO elements once React mounts.
// Google crawler (no JS) indexes them for SEO; real users never see them.
function removeSeoPlaceholders() {
  document.getElementById('seo-preamble')?.remove();
  document.getElementById('seo-related')?.remove();
}

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Remove seo elements after first render frame — invisible to real users,
// but present in raw HTML for search engine crawlers.
requestAnimationFrame(removeSeoPlaceholders);
