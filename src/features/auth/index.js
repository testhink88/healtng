// src/features/auth/index.js

// Guards
export { default as RoleGuard } from "../../utils/RoleGuard";

// Hook local del feature
export { useAuth } from "./hooks/useAuth";

// Demo profiles
export {
  default as demoProfileStorage,
  saveDemoProfile,
  loadDemoProfile,
  clearDemoProfiles,
} from "../../utils/demoProfileStorage";

// Capabilities
export {
  default as capabilityMap,
  CAPABILITIES,
  BUSINESS_TYPES,
  capabilitiesByBusinessType,
  getproviderProfile,
  setproviderProfile,
  getCapabilitiesForCurrentprovider,
  resolveCapabilities,
  capabilitySidebarItems,
} from "../../utils/capabilities/capabilityMap";

// ⚠️ Si ya no tienes types/roles, NO lo exportes aquí.
// export * from "./types/roles";
