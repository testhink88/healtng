// src/features/provider/components/ProfileGate.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { hasProviderOnboarding } from "@/utils/providerProfile";

/**
 * Gate que asegura que el proveedor tenga su perfil básico configurado.
 * Si NO está configurado: envía a /provider/profile-setup.
 * Si SÍ está configurado: renderiza children normalmente.
 */
export default function ProfileGate({ children }) {
  const location = useLocation();
  const onboarded = hasProviderOnboarding();

  // Permite siempre entrar a la pantalla de setup
  if (location.pathname.startsWith("/provider/profile-setup")) {
    return children;
  }

  if (!onboarded) {
    return <Navigate to="/provider/profile-setup" replace />;
  }

  return children;
}
