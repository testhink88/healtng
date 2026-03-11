import React, { lazy } from "react";
import RoleGuard from "@/utils/RoleGuard";

const PatientDashboard = lazy(() => import("@/pages/patient-dashboard"));
const PatientHealthProfilePage = lazy(() => import("@/pages/patient-health-profile"));
const PatientAppointmentsHistory = lazy(() =>
  import("@/pages/patient-appointments-history")
);
const NewPatientAppointment = lazy(() => import("@/pages/patient-appointment-new"));

export const patientRoutes = [
  {
    path: "/patient-dashboard",
    element: (
      <RoleGuard allowed={["patient"]}>
        <PatientDashboard />
      </RoleGuard>
    ),
  },
  {
    path: "/patient-health-profile",
    element: (
      <RoleGuard allowed={["patient"]}>
        <PatientHealthProfilePage />
      </RoleGuard>
    ),
  },
  {
    path: "/patient-appointment-history",
    element: (
      <RoleGuard allowed={["patient"]}>
        <PatientAppointmentsHistory />
      </RoleGuard>
    ),
  },
  {
    path: "/new-patient-appointment",
    element: (
      <RoleGuard allowed={["patient"]}>
        <NewPatientAppointment />
      </RoleGuard>
    ),
  },
];
