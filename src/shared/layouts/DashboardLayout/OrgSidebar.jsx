// src/shared/layouts/DashboardLayout/OrgSidebar.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "@/components/ui/Sidebar";

// Mapea la URL al "rol" que espera tu Sidebar
const getRoleFromPath = (pathname) => {
  // --- CLÍNICA ---
  if (
    pathname.startsWith("/clinic") ||     // /clinic/inventory, /clinic/spaces, etc.
    pathname.startsWith("/clinic-") ||    // /clinic-dashboard, /clinic-appointments-management...
    pathname.startsWith("/cap/")          // capacidades (rx-intake, lab, etc.)
  ) {
    return "clinic";
  }

  // --- PROVEEDOR (Seller Center) ---
  if (
    pathname.startsWith("/provider") ||   // /provider/*
    pathname.startsWith("/provider-")     // aliases legacy
  ) {
    return "provider";
  }

  // --- PROFESIONAL / DOCTOR ---
  if (
    pathname.startsWith("/professional-dashboard") ||
    pathname.startsWith("/professional-publishing-workflow") ||
    pathname.startsWith("/publish") ||
    pathname.startsWith("/medical-indicators") ||
    pathname.startsWith("/patients") ||
    pathname.startsWith("/prescriptions") ||
    pathname.startsWith("/diagnosis") ||
    pathname.startsWith("/referrals") ||
    pathname.startsWith("/check-in-actions-panel") ||
    pathname.startsWith("/business-type-dashboard-hub")
  ) {
    return "doctor";
  }

  // --- PACIENTE / USUARIO FINAL ---
  if (
    pathname.startsWith("/patient-") ||
    pathname.startsWith("/appointment-booking") ||
    pathname.startsWith("/medical-history") ||
    pathname.startsWith("/doctor-discovery") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/payment-processing") ||
    pathname.startsWith("/marketplace") ||
    pathname.startsWith("/space-reservation")
  ) {
    return "patient";
  }

  // --- COLEGIO (futuro) ---
  if (pathname.startsWith("/college")) {
    return "college";
  }

  // Fallback
  return "patient";
};

const OrgSidebar = ({
  // props que vienen del DashboardLayout
  userRole: roleProp,
  businessType = "mixto",
  badges = {},
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose,
  hideSidebar: hideSidebarProp,
}) => {
  const { pathname } = useLocation();

  // 1) rol derivado de la URL
  let resolvedRole = roleProp || getRoleFromPath(pathname);

  // 2) si hay rol en localStorage, tiene prioridad
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem("userRole");
    if (stored) resolvedRole = stored;
  }

  // En estas rutas NO queremos sidebar (login, etc.)
  const autoHideSidebar =
    pathname.startsWith("/login") ||
    pathname === "/";

  const hideSidebar = hideSidebarProp ?? autoHideSidebar;

  return (
    <Sidebar
      userRole={resolvedRole}
      businessType={businessType}
      badges={badges}
      isCollapsed={isCollapsed}
      onToggleCollapse={onToggleCollapse}
      isMobileOpen={isMobileOpen}
      onMobileClose={onMobileClose}
      hideSidebar={hideSidebar}
    />
  );
};

export default OrgSidebar;
