// src/Routes.jsx
import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";

import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import RoleGuard from "./utils/RoleGuard";

// Páginas base
import AppointmentBooking from "./pages/appointment-booking";
import PatientDashboard from "./pages/patient-dashboard";
import Login from "./pages/login";
import SpaceReservation from "./pages/space-reservation";
import ProfessionalDashboard from "./pages/professional-dashboard";
import PrescriptionManagement from "./pages/prescription-management";
import MedicalHistory from "./pages/medical-history";
import DoctorDiscovery from "./pages/doctor-discovery";
import PaymentProcessing from "./pages/payment-processing";
import NewPrescriptionForm from "./pages/new-prescription-form";
import NewDiagnosisForm from "./pages/new-diagnosis-form";
import NewReferralForm from "./pages/new-referral-form";
import PatientList from "./pages/patient-list";
import PatientProfile from "./pages/patient-profile";
import CheckInActionsPanel from "./pages/check-in-actions-panel";

// Paciente: Mis Citas
import PatientAppointmentsHistory from "./pages/patient-appointments-history";
import NewPatientAppointment from "./pages/patient-appointment-new";

// Marketplace
import B2CMarketplace from "./pages/b2c-marketplace";
import B2BMarketplace from "./pages/b2b-marketplace";
import MarketplaceHub from "./pages/marketplace-hub";

// Clínica
import ClinicDashboard from "./pages/clinic-dashboard";
import ClinicInventoryManagement from "./pages/clinic-inventory-management";
import ClinicPurchaseOrders from "./pages/clinic-purchase-orders";
import ClinicAppointmentsManagement from "./pages/clinic-appointments-management";
import ClinicMarketplaceHub from "./pages/clinic-marketplace-hub";
import ClinicSpacesManagement from "./pages/clinic-spaces-management";
import NewSpaceRegistration from "./pages/new-space-registration";

// Capacidades
import RxIntake from "./pages/capabilities/RxIntake";
import LabOrders from "./pages/capabilities/LabOrders";
import OpticsOrders from "./pages/capabilities/OpticsOrders";
import AppointmentsCap from "./pages/capabilities/Appointments";
import B2BCap from "./pages/capabilities/B2B";
import AnalyticsCap from "./pages/capabilities/Analytics";
import AuthorizationsCap from "./pages/capabilities/Authorizations";
import ClaimsCap from "./pages/capabilities/Claims";

// New Business Dashboard Routes
import ProfessionalPublishingWorkflow from "./pages/professional-publishing-workflow";
import BusinessTypeDashboardHub from "./pages/business-type-dashboard-hub";

// Provider
import ProviderLayout from "./pages/provider/ProviderLayout";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderInventory from "./pages/provider/ProviderInventory";
import ProviderServices from "./pages/provider/ProviderServices";
import ProviderAnalytics from "./pages/provider/ProviderAnalytics";
import ProviderB2B from "./pages/provider/ProviderB2B";
import ProviderRxIntake from "./pages/provider/ProviderRxIntake";
import ProviderAuthorizations from "./pages/provider/ProviderAuthorizations";
import ProviderDispatchManagement from "./pages/provider/ProviderDispatchManagement";
import ProviderBillingManagement from "./pages/provider/ProviderBillingManagement";
import ProviderModuleConfiguration from "./pages/provider/ProviderModuleConfiguration";

// Provider: Order Management (fuera de /provider)
import ProviderOrderManagement from "./pages/provider-order-management";
import BatchProcessor from "./pages/provider-order-management/components/BatchProcessor";
import ShipmentTracker from "./pages/provider-order-management/components/ShipmentTracker";
import AnalyticsDashboard from "./pages/provider-order-management/components/AnalyticsDashboard";

// Setup inicial proveedor
import ProviderProfileSetup from "./pages/provider/ProviderProfileSetup";

export default function Routes() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Home */}
          <Route path="/" element={<AppointmentBooking />} />
          <Route path="/appointment-booking" element={<AppointmentBooking />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* Dashboards base */}
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/professional-dashboard" element={<ProfessionalDashboard />} />

          {/* Paciente: citas */}
          <Route path="/patient-appointment-history" element={<PatientAppointmentsHistory />} />
          <Route path="/new-patient-appointment" element={<NewPatientAppointment />} />

          {/* Marketplace */}
          <Route path="/marketplace" element={<MarketplaceHub />} />
          <Route path="/marketplace-hub" element={<MarketplaceHub />} />
          <Route path="/marketplace/b2c" element={<B2CMarketplace />} />
          <Route path="/marketplace/b2b" element={<B2BMarketplace />} />
          <Route path="/marketplace/vendor/:id" element={<B2BMarketplace />} />

          {/* Órdenes / pagos */}
          <Route path="/orders/:id" element={<PaymentProcessing />} />
          <Route path="/payment-processing" element={<PaymentProcessing />} />

          {/* Servicios varios */}
          <Route path="/space-reservation" element={<SpaceReservation />} />
          <Route path="/prescription-management" element={<PrescriptionManagement />} />
          <Route path="/medical-history" element={<MedicalHistory />} />
          <Route path="/doctor-discovery" element={<DoctorDiscovery />} />

          {/* Gestión de pacientes (profesional) */}
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/:id" element={<PatientProfile />} />

          {/* Acciones profesionales */}
          <Route path="/prescriptions/new" element={<NewPrescriptionForm />} />
          <Route path="/diagnosis/new" element={<NewDiagnosisForm />} />
          <Route path="/referrals/new" element={<NewReferralForm />} />

          {/* Panel de check-in */}
          <Route path="/check-in-actions-panel" element={<CheckInActionsPanel />} />

          {/* New Business Dashboard Routes */}
          <Route
            path="/business-type-dashboard-hub"
            element={
              <RoleGuard allowed={["professional", "doctor"]}>
                <BusinessTypeDashboardHub />
              </RoleGuard>
            }
          />

          {/* Publishing Workflow */}
          <Route
            path="/professional-publishing-workflow"
            element={
              <RoleGuard allowed={["professional", "doctor"]}>
                <ProfessionalPublishingWorkflow />
              </RoleGuard>
            }
          />
          <Route
            path="/publish/new"
            element={
              <RoleGuard allowed={["professional", "doctor"]}>
                <ProfessionalPublishingWorkflow />
              </RoleGuard>
            }
          />
          <Route
            path="/publish/:id"
            element={
              <RoleGuard allowed={["professional", "doctor"]}>
                <ProfessionalPublishingWorkflow />
              </RoleGuard>
            }
          />

          {/* Provider + layout */}
          <Route path="/provider/*" element={<ProviderLayout />}>
            <Route index element={<ProviderDashboard />} />
            <Route path="dashboard" element={<ProviderDashboard />} />
            <Route path="inventory" element={<ProviderInventory />} />
            <Route path="services" element={<ProviderServices />} />

            {/* Orders */}
            <Route path="orders" element={<ProviderOrderManagement />} />
            {/* ✅ NUEVA ruta para botón "Crear Pedido" */}
            <Route path="orders/create" element={<ProviderOrderManagement />} />
            <Route path="orders/batch" element={<BatchProcessor />} />
            <Route path="orders/shipments" element={<ShipmentTracker />} />
            <Route path="orders/analytics" element={<AnalyticsDashboard />} />

            <Route path="dispatch" element={<ProviderDispatchManagement />} />
            <Route path="billing" element={<ProviderBillingManagement />} />
            <Route path="analytics" element={<ProviderAnalytics />} />
            <Route path="b2b" element={<ProviderB2B />} />
            <Route path="rx-intake" element={<ProviderRxIntake />} />
            <Route path="authorizations" element={<ProviderAuthorizations />} />
            <Route path="module-configuration" element={<ProviderModuleConfiguration />} />
          </Route>

          {/* Setup inicial proveedor */}
          <Route path="/provider-profile-setup" element={<ProviderProfileSetup />} />

          {/* Compatibilidad (redirecciones) */}
          <Route path="/provider-dashboard" element={<Navigate to="/provider/dashboard" replace />} />
          <Route path="/provider-inventory" element={<Navigate to="/provider/inventory" replace />} />
          <Route path="/provider-order-management" element={<Navigate to="/provider/orders" replace />} />
          <Route path="/provider-services-management" element={<Navigate to="/provider/services" replace />} />
          <Route path="/provider-analytics" element={<Navigate to="/provider/analytics" replace />} />
          <Route path="/provider-dispatch-management" element={<Navigate to="/provider/dispatch" replace />} />

          {/* Clínica */}
          <Route
            path="/clinic-dashboard"
            element={
              <RoleGuard allowed={["clinic"]}>
                <ClinicDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/clinic/inventory"
            element={
              <RoleGuard allowed={["clinic"]}>
                <ClinicInventoryManagement />
              </RoleGuard>
            }
          />
          <Route
            path="/clinic/purchase-orders"
            element={
              <RoleGuard allowed={["clinic", "clinic_admin"]}>
                <ClinicPurchaseOrders />
              </RoleGuard>
            }
          />
          <Route
            path="/clinic-appointments-management"
            element={
              <RoleGuard allowed={["clinic", "clinic_admin"]}>
                <ClinicAppointmentsManagement />
              </RoleGuard>
            }
          />
          <Route
            path="/clinic-marketplace-hub"
            element={
              <RoleGuard allowed={["clinic", "clinic_admin"]}>
                <ClinicMarketplaceHub />
              </RoleGuard>
            }
          />
          <Route
            path="/clinic/spaces"
            element={
              <RoleGuard allowed={["clinic", "clinic_admin"]}>
                <ClinicSpacesManagement />
              </RoleGuard>
            }
          />
          <Route
            path="/clinic/spaces/new"
            element={
              <RoleGuard allowed={["clinic", "clinic_admin"]}>
                <NewSpaceRegistration />
              </RoleGuard>
            }
          />

          {/* Compatibilidad legacy */}
          <Route path="/profesional/recetas/nueva" element={<NewPrescriptionForm />} />
          <Route path="/profesional/diagnosticos/nuevo" element={<NewDiagnosisForm />} />
          <Route path="/profesional/derivaciones/nueva" element={<NewReferralForm />} />

          {/* Capacidades */}
          <Route path="/cap/rx-intake" element={<RxIntake />} />
          <Route path="/cap/lab-orders" element={<LabOrders />} />
          <Route path="/cap/optics-orders" element={<OpticsOrders />} />
          <Route path="/cap/appointments" element={<AppointmentsCap />} />
          <Route path="/cap/b2b" element={<B2BCap />} />
          <Route path="/cap/analytics" element={<AnalyticsCap />} />
          <Route path="/cap/authorizations" element={<AuthorizationsCap />} />
          <Route path="/cap/claims" element={<ClaimsCap />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
