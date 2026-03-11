import React, { lazy } from "react";
import RoleGuard from "@/utils/RoleGuard";

const ClinicDashboard = lazy(() => import("@/pages/clinic-dashboard"));
const ClinicInventoryManagement = lazy(() => import("@/pages/clinic-inventory-management"));
const ClinicBilling = lazy(() => import("@/pages/clinic-billing"));
const ClinicAuthorizations = lazy(() => import("@/pages/clinic-authorizations"));
const ClinicPurchaseOrders = lazy(() => import("@/pages/clinic-purchase-orders"));
const ClinicAppointmentsManagement = lazy(() => import("@/pages/clinic-appointments-management"));
const ClinicMarketplaceHub = lazy(() => import("@/pages/clinic-marketplace-hub"));
const ClinicSpacesManagement = lazy(() => import("@/pages/clinic-spaces-management"));
const NewSpaceRegistration = lazy(() => import("@/pages/new-space-registration"));
const ClinicOperationsOverviewDashboard = lazy(() =>
  import("@/pages/clinic-operations-overview-dashboard")
);
const ClinicManagementDashboard = lazy(() =>
  import("@/pages/clinic-management-dashboard")
);
const SpaceReservation = lazy(() => import("@/pages/space-reservation"));

const PatientList = lazy(() => import("@/pages/patient-list"));
const PatientProfile = lazy(() => import("@/pages/patient-profile"));
const NewDiagnosisForm = lazy(() => import("@/pages/new-diagnosis-form"));
const NewPrescriptionForm = lazy(() => import("@/pages/new-prescription-form"));
const NewReferralForm = lazy(() => import("@/pages/new-referral-form"));
const CheckInActionsPanel = lazy(() => import("@/pages/check-in-actions-panel"));

export const clinicRoutes = [
  {
    path: "/clinic-dashboard",
    element: (
      <RoleGuard allowed={["clinic"]}>
        <ClinicDashboard />
      </RoleGuard>
    ),
  },
  {
    path: "/clinic/operations",
    element: (
      <RoleGuard allowed={["clinic", "clinic_admin"]}>
        <ClinicOperationsOverviewDashboard />
      </RoleGuard>
    ),
  },
  {
    path: "/clinic/management",
    element: (
      <RoleGuard allowed={["clinic", "clinic_admin"]}>
        <ClinicManagementDashboard />
      </RoleGuard>
    ),
  },
  {
    path: "/clinic/billing",
    element: (
      <RoleGuard allowed={["clinic", "clinic_admin"]}>
        <ClinicBilling />
      </RoleGuard>
    ),
  },
  {
    path: "/clinic/authorizations",
    element: (
      <RoleGuard allowed={["clinic", "clinic_admin"]}>
        <ClinicAuthorizations />
      </RoleGuard>
    ),
  },
  {
    path: "/clinic/appointments",
    element: (
      <RoleGuard allowed={["clinic", "clinic_admin"]}>
        <ClinicAppointmentsManagement />
      </RoleGuard>
    ),
  },
  {
    path: "/clinic/inventory",
    element: (
      <RoleGuard allowed={["clinic", "clinic_admin"]}>
        <ClinicInventoryManagement />
      </RoleGuard>
    ),
  },
  {
    path: "/clinic/purchase-orders",
    element: (
      <RoleGuard allowed={["clinic", "clinic_admin"]}>
        <ClinicPurchaseOrders />
      </RoleGuard>
    ),
  },
  {
    path: "/clinic/marketplace",
    element: (
      <RoleGuard allowed={["clinic", "clinic_admin"]}>
        <ClinicMarketplaceHub />
      </RoleGuard>
    ),
  },
  {
    path: "/clinic/spaces",
    element: (
      <RoleGuard allowed={["clinic", "clinic_admin"]}>
        <ClinicSpacesManagement />
      </RoleGuard>
    ),
  },
  {
    path: "/clinic/spaces/new",
    element: (
      <RoleGuard allowed={["clinic", "clinic_admin"]}>
        <NewSpaceRegistration />
      </RoleGuard>
    ),
  },
  {
    path: "/clinic/spaces/booking/new",
    element: (
      <RoleGuard allowed={["clinic", "clinic_admin"]}>
        <SpaceReservation />
      </RoleGuard>
    ),
  },
  // Patient Management within Clinic Scope or generally
  {
    path: "/patients",
    element: (
      <RoleGuard allowed={["clinic", "doctor", "assistant"]}>
        <PatientList />
      </RoleGuard>
    ),
  },
  {
    path: "/patients/:id",
    element: (
      <RoleGuard allowed={["clinic", "doctor", "assistant"]}>
        <PatientProfile />
      </RoleGuard>
    ),
  },
  {
    path: "/patients/:patientId/diagnosis/new",
    element: (
      <RoleGuard allowed={["clinic", "doctor"]}>
        <NewDiagnosisForm />
      </RoleGuard>
    ),
  },
  {
    path: "/patients/:patientId/diagnosis/:diagnosisId/edit",
    element: (
      <RoleGuard allowed={["clinic", "doctor"]}>
        <NewDiagnosisForm />
      </RoleGuard>
    ),
  },
  {
    path: "/patients/:patientId/prescriptions/new",
    element: (
      <RoleGuard allowed={["clinic", "doctor"]}>
        <NewPrescriptionForm />
      </RoleGuard>
    ),
  },
  {
    path: "/patients/:patientId/referrals/new",
    element: (
      <RoleGuard allowed={["clinic", "doctor"]}>
        <NewReferralForm />
      </RoleGuard>
    ),
  },
  // Legacy / Direct access
  {
    path: "/prescriptions/new",
    element: (
      <RoleGuard allowed={["clinic", "doctor"]}>
        <NewPrescriptionForm />
      </RoleGuard>
    ),
  },
  {
    path: "/diagnosis/new",
    element: (
      <RoleGuard allowed={["clinic", "doctor"]}>
        <NewDiagnosisForm />
      </RoleGuard>
    ),
  },
  {
    path: "/referrals/new",
    element: (
      <RoleGuard allowed={["clinic", "doctor"]}>
        <NewReferralForm />
      </RoleGuard>
    ),
  },
  {
    path: "/check-in-actions-panel",
    element: (
      <RoleGuard allowed={["clinic", "doctor", "assistant"]}>
        <CheckInActionsPanel />
      </RoleGuard>
    ),
  },
];
