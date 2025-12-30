import React, { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import { RoleGuard } from "@/features/auth";

const safeJsonParse = (raw, fallback = null) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export default function ClinicLayout({ children, pageClassName = "" }) {
  // ✅ Garantiza rol clinic para Sidebar + rutas
  useEffect(() => {
    if (typeof window === "undefined") return;
    const current = window.localStorage.getItem("userRole");
    if (current !== "clinic") window.localStorage.setItem("userRole", "clinic");
  }, []);

  const userRole = "clinic";

  // ✅ UI state igual al dashboard
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // ✅ Perfil para que Sidebar tome flags (actsAsProvider/actsAsBuyer) si aplica
  const clinicProfile = useMemo(() => {
    if (typeof window === "undefined") return null;
    return safeJsonParse(window.localStorage.getItem("clinicProfile"), null);
  }, []);

  return (
    <RoleGuard allowedRoles={["clinic", "clinic_admin"]}>
      <div className="min-h-screen bg-background">
        <Header
          userRole={userRole}
          onMenuToggle={() => setIsMobileSidebarOpen(true)}
        />

        <Sidebar
          userRole={userRole}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((v) => !v)}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
          // 👇 si tu Sidebar usa clinicProfile internamente por localStorage ya estás,
          // pero lo dejamos por claridad si luego lo conectas por props.
          clinicProfile={clinicProfile}
        />

        <main
          className={`pt-16 transition-all duration-300 ${
            isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
          } ${pageClassName}`}
        >
          {children ?? <Outlet />}
        </main>
      </div>
    </RoleGuard>
  );
}
