// src/shared/layouts/DashboardLayout/index.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import OrgSidebar from "./OrgSidebar";

const DashboardLayout = ({
  role = "patient",
  businessType = "mixto",
  badges = {},
  hideSidebar = false,
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* HEADER GLOBAL DEL DASHBOARD */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">Healtng • Panel</span>
        </div>

        {/* Botón para abrir sidebar en móvil */}
        <button
          className="lg:hidden text-xs font-medium border px-2 py-1 rounded"
          onClick={() => setIsMobileOpen(true)}
        >
          Menú
        </button>
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex flex-1">
        <OrgSidebar
          userRole={role}
          businessType={businessType}
          badges={badges}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((v) => !v)}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
          hideSidebar={hideSidebar}
        />

        <main className="flex-1 overflow-y-auto bg-background">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
