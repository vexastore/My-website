import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

function removeSeoPlaceholders() {
  document.getElementById('seo-preamble')?.remove();
  document.getElementById('seo-related')?.remove();
}

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

requestAnimationFrame(removeSeoPlaceholders);
