// src/api/index.js

// Módulos raíz “clásicos”
export * from "./analytics";
export * from "./appointments";
export * from "./auth";
export * from "./cart";
export * from "./diagnostics";
export * from "./marketplace"; // puente legacy (ver paso 6)
export * from "./orders";
export * from "./notifications";
export * from "./support";

// Dominios como namespaces (útil para organización mental)
export * as clinicApi from "./clinic";
export * as providerApi from "./provider";
export * as patientApi from "./patient";
export * as marketplacesApi from "./marketplace";
