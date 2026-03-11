import React, { lazy } from "react";
import RoleGuard from "@/utils/RoleGuard";

const AssistantDashboard = lazy(() => import("@/pages/assistant/AssistantDashboard"));
const PatientIntake = lazy(() => import("@/pages/assistant/PatientIntake"));

export const assistantRoutes = [
  {
    path: "/assistant",
    element: (
      <RoleGuard
        allowed={["assistant", "clinic_admin", "clinic", "professional", "doctor"]}
      >
        <AssistantDashboard />
      </RoleGuard>
    ),
  },
  {
    path: "/assistant/intake/:patientId",
    element: (
      <RoleGuard
        allowed={["assistant", "clinic_admin", "clinic", "professional", "doctor"]}
      >
        <PatientIntake />
      </RoleGuard>
    ),
  },
];
