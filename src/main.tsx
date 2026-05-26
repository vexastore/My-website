import { StrictMode } from "react";
  import { createRoot } from "react-dom/client";
  import "./index.css";
  import App from "./App";

  // Remove pre-rendered SEO elements once React mounts.
  // Google's crawler (no JS) indexes them; real users never see them.
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

  requestAnimationFrame(removeSeoPlaceholders);
  