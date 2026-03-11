import React, { lazy } from "react";
import RoleGuard from "@/utils/RoleGuard";

const SettingsRouter = lazy(() => import("@/pages/settings/SettingsRouter"));

export const settingsRoutes = [
  {
    path: "/settings/*",
    element: (
      <RoleGuard
        allowed={[
          "doctor",
          "professional",
          "patient",
          "provider",
          "clinic",
          "clinic_admin",
          "system_admin",
        ]}
      >
        <SettingsRouter />
      </RoleGuard>
    ),
  },
];
