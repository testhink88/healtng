// src/index.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Importar el proveedor de contexto
import { PracticeProvider } from "@/context/PracticeContext";

// Estilos globales
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

// Aquí envolvemos la aplicación con el contexto
root.render(
  <React.StrictMode>
    <PracticeProvider>
      <App />
    </PracticeProvider>
  </React.StrictMode>
);
