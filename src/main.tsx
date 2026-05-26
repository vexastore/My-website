import { StrictMode } from "react";
  import { createRoot } from "react-dom/client";
  import "./index.css";
  import App from "./App";

  // Remove pre-rendered SEO elements from DOM once React is ready.
  // Google crawler (no JS) indexes them for SEO. Real users never see them.
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

  // Remove after first render is committed
  requestAnimationFrame(removeSeoPlaceholders);
  