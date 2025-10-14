import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";

import ScrollToTop from "@/components/ScrollToTop"; // Corregido: Removed extra slashes
import ErrorBoundary from "@/components/ErrorBoundary"; // Corregido: Removed extra slashes
import NotFound from "@/pages/NotFound"; // Corregido: Removed extra slashes
import RoleGuard from "./utils/RoleGuard";

// Páginas base
import AppointmentBooking from "@/pages/appointment-booking"; // Corregido: Removed extra slashes
import PatientDashboard from "@/pages/patient-dashboard"; // Corregido: Removed extra slashes
import Login from "@/pages/login"; // Corregido: Removed extra slashes
import SpaceReservation from "@/pages/space-reservation"; // Corregido: Removed extra slashes
import ProfessionalDashboard from "@/pages/professional-dashboard"; // Corregido: Removed extra slashes
import PrescriptionManagement from "@/pages/prescription-management"; // Corregido: Removed extra slashes
import MedicalHistory from "@/pages/medical-history"; // Corregido: Removed extra slashes
import DoctorDiscovery from "@/pages/doctor-discovery"; // Corregido: Removed extra slashes
import PaymentProcessing from "@/pages/payment-processing"; // Corregido: Removed extra slashes
import NewPrescriptionForm from "@/pages/new-prescription-form"; // Corregido: Removed extra slashes
import NewDiagnosisForm from "@/pages/new-diagnosis-form"; // Corregido: Removed extra slashes
import NewReferralForm from "@/pages/new-referral-form"; // Corregido: Removed extra slashes
import PatientList from "@/pages/patient-list"; // Corregido: Removed extra slashes
import PatientProfile from "@/pages/patient-profile"; // Corregido: Removed extra slashes
import CheckInActionsPanel from "@/pages/check-in-actions-panel"; // Corregido: Removed extra slashes

// Paciente: Mis Citas
import PatientAppointmentsHistory from "@/pages/patient-appointments-history"; // Corregido: Removed extra slashes
import NewPatientAppointment from "@/pages/patient-appointment-new"; // Corregido: Removed extra slashes

// Marketplace
import B2CMarketplace from "@/pages/b2c-marketplace"; // Corregido: Removed extra slashes
import B2BMarketplace from "@/pages/b2b-marketplace"; // Corregido: Removed extra slashes
import MarketplaceHub from "@/pages/marketplace-hub"; // Corregido: Removed extra slashes

// Clínica
import ClinicDashboard from "@/pages/clinic-dashboard"; // Corregido: Removed extra slashes
import ClinicInventoryManagement from "@/pages/clinic-inventory-management"; // Corregido: Removed extra slashes
import ClinicPurchaseOrders from "@/pages/clinic-purchase-orders"; // Corregido: Removed extra slashes
import ClinicAppointmentsManagement from "@/pages/clinic-appointments-management"; // Corregido: Removed extra slashes
import ClinicMarketplaceHub from "@/pages/clinic-marketplace-hub"; // Corregido: Removed extra slashes
import ClinicSpacesManagement from "@/pages/clinic-spaces-management"; // Corregido: Removed extra slashes
import NewSpaceRegistration from "@/pages/new-space-registration"; // Corregido: Removed extra slashes

// Capacidades
import RxIntake from "@/pages/capabilities/RxIntake"; // Corregido: Removed extra slashes
import LabOrders from "@/pages/capabilities/LabOrders"; // Corregido: Removed extra slashes
import OpticsOrders from "@/pages/capabilities/OpticsOrders"; // Corregido: Removed extra slashes
import AppointmentsCap from "@/pages/capabilities/Appointments"; // Corregido: Removed extra slashes
import B2BCap from "@/pages/capabilities/B2B"; // Corregido: Removed extra slashes
import AnalyticsCap from "@/pages/capabilities/Analytics"; // Corregido: Removed extra slashes
import AuthorizationsCap from "@/pages/capabilities/Authorizations"; // Corregido: Removed extra slashes
import ClaimsCap from "@/pages/capabilities/Claims"; // Corregido: Removed extra slashes

// New Business Dashboard Routes
import ProfessionalPublishingWorkflow from "@/pages/professional-publishing-workflow"; // Corregido: Removed extra slashes
import BusinessTypeDashboardHub from "@/pages/business-type-dashboard-hub"; // Corregido: Removed extra slashes

// Provider (usando alias limpio @)
import ProviderLayout from "@/features/provider/pages/ProviderLayout"; // Corregido: Removed extra slashes
import ProviderDashboard from "@/features/provider/pages/ProviderDashboard"; // Corregido: Removed extra slashes
import ProviderInventory from "@/features/provider/pages/ProviderInventory"; // Corregido: Removed extra slashes
import ProviderServices from "@/features/provider/pages/ProviderServices"; // Corregido: Removed extra slashes
import ProviderAnalytics from "@/features/provider/pages/ProviderAnalytics"; // Corregido: Removed extra slashes
import ProviderB2B from "@/features/provider/pages/ProviderB2B"; // Corregido: Removed extra slashes
import ProviderRxIntake from "@/features/provider/pages/ProviderRxIntake"; // Corregido: Removed extra slashes
import ProviderAuthorizations from "@/features/provider/pages/ProviderAuthorizations"; // Corregido: Removed extra slashes
import ProviderDispatchManagement from "@/features/provider/pages/ProviderDispatchManagement"; // Corregido: Removed extra slashes
import ProviderBillingManagement from "@/features/provider/pages/ProviderBillingManagement"; // Corregido: Removed extra slashes
import ProviderModuleConfiguration from "@/features/provider/pages/ProviderModuleConfiguration"; // Corregido: Removed extra slashes
import ProviderProfileSetup from "@/features/provider/pages/ProviderProfileSetup"; // Corregido: Removed extra slashes

// Provider: Order Management (fuera de /provider)
import ProviderOrderManagement from "@/pages/provider-order-management"; // Corregido: Removed extra slashes
import BatchProcessor from "@/pages/provider-order-management/components/BatchProcessor"; // Corregido: Removed extra slashes
import ShipmentTracker from "@/pages/provider-order-management/components/ShipmentTracker"; // Corregido: Removed extra slashes
import AnalyticsDashboard from "@/pages/provider-order-management/components/AnalyticsDashboard"; // Corregido: Removed extra slashes

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
