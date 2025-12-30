import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// ✅ Estilos globales
import "@/styles/tailwind.css";
import "@/styles/index.css";

// (Opcional) Ajuste fino para 100dvh en móviles si no usas el script del index.html
const setAppHeightVar = () => {
  document.documentElement.style.setProperty("--app-dvh", `${window.innerHeight * 0.01}px`);
};
window.addEventListener("resize", setAppHeightVar);
setAppHeightVar();

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
