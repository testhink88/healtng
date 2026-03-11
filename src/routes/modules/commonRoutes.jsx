import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import RoleGuard from "@/utils/RoleGuard";

const PaymentProcessing = lazy(() => import("@/pages/payment-processing"));
const SpaceReservation = lazy(() => import("@/pages/space-reservation"));
const PrescriptionManagement = lazy(() => import("@/pages/prescription-management"));
const MedicalHistory = lazy(() => import("@/pages/medical-history"));
const DoctorDiscovery = lazy(() => import("@/pages/doctor-discovery"));
const MedicalIndicatorsPage = lazy(() => import("@/pages/medical-indicators"));

export const commonRoutes = [
  {
    path: "/orders/:id",
    element: <PaymentProcessing />,
  },
  {
    path: "/payment-processing",
    element: (
      <RoleGuard allowed={["*"]}>
        <PaymentProcessing />
      </RoleGuard>
    ),
  },
  {
    path: "/space-reservation",
    element: (
      <RoleGuard allowed={["*"]}>
        <SpaceReservation />
      </RoleGuard>
    ),
  },
  {
    path: "/prescription-management",
    element: (
      <RoleGuard allowed={["patient", "doctor", "specialist", "professional", "assistant"]}>
        <PrescriptionManagement />
      </RoleGuard>
    ),
  },
  {
    path: "/medical-history",
    element: (
      <RoleGuard allowed={["patient", "doctor", "specialist", "professional", "assistant"]}>
        <MedicalHistory />
      </RoleGuard>
    ),
  },
  {
    path: "/doctor-discovery",
    element: (
      <RoleGuard allowed={["patient", "assistant", "clinic", "clinic_admin"]}>
        <DoctorDiscovery />
      </RoleGuard>
    ),
  },
  {
    path: "/medical-indicators",
    element: (
      <RoleGuard
        allowed={[
          "doctor",
          "specialist",
          "professional",
          "clinic",
          "clinic_admin",
        ]}
      >
        <MedicalIndicatorsPage />
      </RoleGuard>
    ),
  },
  {
    path: "/indicadores-medicos",
    element: <Navigate to="/medical-indicators" replace />,
  },
];
