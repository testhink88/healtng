import React, { Suspense, lazy } from "react";
import {
  BrowserRouter,
  Routes as RouterRoutes,
  Route,
  Navigate,
} from "react-router-dom";

import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import RoleGuard from "./utils/RoleGuard";

// ⬇️ Layouts compartidos (rutas corregidas)
import DashboardLayout from "@/shared/layouts/DashboardLayout";
import OrgSidebar from "@/shared/layouts/DashboardLayout/OrgSidebar";

// === Guard de perfil de negocio (se asegura que el proveedor configuró su perfil)
const ProfileGate = lazy(() => import("@/features/provider/components/ProfileGate"));

// --- Loader de Suspense ---
const Fallback = () => (
  <div className="w-full h-[50vh] flex items-center justify-center text-sm text-gray-500">
    Cargando…
  </div>
);

// --- Páginas base (lazy) ---
const AppointmentBooking = lazy(() => import("@/pages/appointment-booking"));
const PatientDashboard = lazy(() => import("@/pages/patient-dashboard"));
const Login = lazy(() => import("@/pages/login"));
const SpaceReservation = lazy(() => import("@/pages/space-reservation"));
const ProfessionalDashboard = lazy(() => import("@/pages/professional-dashboard"));
const PrescriptionManagement = lazy(() => import("@/pages/prescription-management"));
const MedicalHistory = lazy(() => import("@/pages/medical-history"));
const DoctorDiscovery = lazy(() => import("@/pages/doctor-discovery"));
// 👇 fuerza recompilación del chunk
const PaymentProcessing = lazy(() => import("@/pages/payment-processing?ver=2"));
const NewPrescriptionForm = lazy(() => import("@/pages/new-prescription-form"));
const NewDiagnosisForm = lazy(() => import("@/pages/new-diagnosis-form"));
const NewReferralForm = lazy(() => import("@/pages/new-referral-form"));
const PatientList = lazy(() => import("@/pages/patient-list"));
const PatientProfile = lazy(() => import("@/pages/patient-profile"));
const CheckInActionsPanel = lazy(() => import("@/pages/check-in-actions-panel"));

// Paciente: citas
const PatientAppointmentsHistory = lazy(
  () => import("@/pages/patient-appointments-history")
);
const NewPatientAppointment = lazy(
  () => import("@/pages/patient-appointment-new")
);

// Perfil de salud del paciente
const PatientHealthProfilePage = lazy(
  () => import("@/pages/patient-health-profile")
);

// Marketplace
const B2CMarketplace = lazy(() => import("@/pages/b2c-marketplace"));
const B2BMarketplace = lazy(() => import("@/pages/b2b-marketplace"));
const MarketplaceHub = lazy(() => import("@/pages/marketplace-hub"));

// Clínica
const ClinicDashboard = lazy(() => import("@/pages/clinic-dashboard"));
const ClinicInventoryManagement = lazy(
  () => import("@/pages/clinic-inventory-management")
);

const ClinicLayout = lazy(() => import("@/pages/clinic-layout"));
const ClinicBilling = lazy(() => import("@/pages/clinic-billing"));
const ClinicAuthorizations = lazy(() => import("@/pages/clinic-authorizations"));

const ClinicPurchaseOrders = lazy(
  () => import("@/pages/clinic-purchase-orders")
);
const ClinicAppointmentsManagement = lazy(
  () => import("@/pages/clinic-appointments-management")
);
const ClinicMarketplaceHub = lazy(
  () => import("@/pages/clinic-marketplace-hub")
);
const ClinicSpacesManagement = lazy(
  () => import("@/pages/clinic-spaces-management")
);
const NewSpaceRegistration = lazy(() => import("@/pages/new-space-registration"));
const ClinicOperationsOverviewDashboard = lazy(
  () => import("@/pages/clinic-operations-overview-dashboard")
);
const ClinicManagementDashboard = lazy(
  () => import("@/pages/clinic-management-dashboard")
);


// Capacidades
const RxIntake = lazy(() => import("@/pages/capabilities/RxIntake"));
const LabOrders = lazy(() => import("@/pages/capabilities/LabOrders"));
const OpticsOrders = lazy(() => import("@/pages/capabilities/OpticsOrders"));
const AppointmentsCap = lazy(() => import("@/pages/capabilities/Appointments"));
const B2BCap = lazy(() => import("@/pages/capabilities/B2B"));
const AnalyticsCap = lazy(() => import("@/pages/capabilities/Analytics"));
const AuthorizationsCap = lazy(
  () => import("@/pages/capabilities/Authorizations")
);
const ClaimsCap = lazy(() => import("@/pages/capabilities/Claims"));

// New Business Dashboard
const ProfessionalPublishingWorkflow = lazy(
  () => import("@/pages/professional-publishing-workflow")
);
const BusinessTypeDashboardHub = lazy(
  () => import("@/pages/business-type-dashboard-hub")
);

// Provider (todas dentro de /features/provider)
const ProviderLayout = lazy(
  () => import("@/features/provider/pages/ProviderLayout")
);
const ProviderDashboard = lazy(
  () => import("@/features/provider/pages/ProviderDashboard")
);
const ProviderInventory = lazy(
  () => import("@/features/provider/pages/ProviderInventory")
);
const ProviderServices = lazy(
  () => import("@/features/provider/pages/ProviderServices")
);
const ProviderAnalytics = lazy(
  () => import("@/features/provider/pages/ProviderAnalytics")
);
const ProviderB2B = lazy(() => import("@/features/provider/pages/ProviderB2B"));
const ProviderRxIntake = lazy(
  () => import("@/features/provider/pages/ProviderRxIntake")
);
const ProviderAuthorizations = lazy(
  () => import("@/features/provider/pages/ProviderAuthorizations")
);
const ProviderDispatchManagement = lazy(
  () => import("@/features/provider/pages/ProviderDispatchManagement")
);
const ProviderBillingManagement = lazy(
  () => import("@/features/provider/pages/ProviderBillingManagement")
);
const ProviderModuleConfiguration = lazy(
  () => import("@/features/provider/pages/ProviderModuleConfiguration")
);
const ProviderProfileSetup = lazy(
  () => import("@/features/provider/pages/ProviderProfileSetup")
);

// 👇 NUEVO: Mi catálogo B2B (productos / servicios publicados)
const ProviderCatalog = lazy(
  () => import("@/features/provider/pages/ProviderCatalog")
);

// LOTES
const ProviderLots = lazy(() => import("@/features/provider/pages/LotsPage"));
const ProviderLotsAndExpiry = lazy(
  () => import("@/features/provider/pages/LotsAndExpiry")
);

// Order Management del proveedor
const ProviderOrderManagement = lazy(
  () => import("@/features/provider/pages/ProviderOrderManagement")
);
const BatchProcessor = lazy(
  () => import("@/pages/provider-order-management/components/BatchProcessor")
);
const ShipmentTracker = lazy(
  () => import("@/pages/provider-order-management/components/ShipmentTracker")
);
const AnalyticsDashboard = lazy(
  () => import("@/pages/provider-order-management/components/AnalyticsDashboard")
);

// === Indicadores Médicos (nuevo) ===
const MedicalIndicatorsPage = lazy(() => import("@/pages/medical-indicators"));

// 404
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function Routes() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Suspense fallback={<Fallback />}>
          <RouterRoutes>
            {/* Home / Auth */}
            <Route path="/" element={<AppointmentBooking />} />
            <Route path="/appointment-booking" element={<AppointmentBooking />} />
            <Route path="/login" element={<Login />} />

            {/* Dashboards base */}
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route
              path="/professional-dashboard"
              element={<ProfessionalDashboard />}
            />

            {/* Perfil de salud del paciente */}
            <Route
              path="/patient-health-profile"
              element={
                <RoleGuard allowed={["patient"]}>
                  <PatientHealthProfilePage />
                </RoleGuard>
              }
            />

            {/* Paciente: citas */}
            <Route
              path="/patient-appointment-history"
              element={<PatientAppointmentsHistory />}
            />
            <Route
              path="/new-patient-appointment"
              element={<NewPatientAppointment />}
            />

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
            <Route
              path="/prescription-management"
              element={<PrescriptionManagement />}
            />
            <Route path="/medical-history" element={<MedicalHistory />} />
            <Route path="/doctor-discovery" element={<DoctorDiscovery />} />

            {/* === Indicadores Médicos (nuevo) === */}
            <Route
              path="/medical-indicators"
              element={
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
              }
            />
            {/* Alias / compatibilidad */}
            <Route
              path="/indicadores-medicos"
              element={<Navigate to="/medical-indicators" replace />}
            />
            <Route
              path="/analytics/appointments"
              element={<Navigate to="/medical-indicators" replace />}
            />
            <Route
              path="/analytics/patients"
              element={<Navigate to="/medical-indicators" replace />}
            />

            {/* Gestión de pacientes (profesional) */}
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/:id" element={<PatientProfile />} />

            {/* Formularios clínicos */}
            <Route path="/prescriptions/new" element={<NewPrescriptionForm />} />
            <Route path="/diagnosis/new" element={<NewDiagnosisForm />} />
            <Route path="/referrals/new" element={<NewReferralForm />} />

            {/* Panel de check-in */}
            <Route
              path="/check-in-actions-panel"
              element={<CheckInActionsPanel />}
            />

            {/* New Business Dashboard Routes */}
            <Route
              path="/business-type-dashboard-hub"
              element={
                <RoleGuard allowed={["professional", "doctor"]}>
                  <BusinessTypeDashboardHub />
                </RoleGuard>
              }
            />
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

            {/* Provider + layout (con ProfileGate adentro) */}
            <Route
              path="/provider/*"
              element={
                <RoleGuard allowed={["provider"]}>
                  <ProfileGate>
                    <ProviderLayout />
                  </ProfileGate>
                </RoleGuard>
              }
            >
              <Route index element={<ProviderDashboard />} />
              <Route path="dashboard" element={<ProviderDashboard />} />
              <Route path="inventory" element={<ProviderInventory />} />
              <Route path="lots" element={<ProviderLots />} />
              <Route path="lots/expiring" element={<ProviderLotsAndExpiry />} />
              <Route
                path="inventory/lots"
                element={<Navigate to="/provider/lots" replace />}
              />
              <Route path="orders" element={<ProviderOrderManagement />} />
              <Route path="orders/create" element={<ProviderOrderManagement />} />
              <Route path="orders/batch" element={<BatchProcessor />} />
              <Route path="orders/shipments" element={<ShipmentTracker />} />
              <Route path="orders/analytics" element={<AnalyticsDashboard />} />
              <Route path="dispatch" element={<ProviderDispatchManagement />} />
              <Route path="billing" element={<ProviderBillingManagement />} />
              <Route path="analytics" element={<ProviderAnalytics />} />

              {/* Marketplace B2B del proveedor */}
              <Route path="b2b" element={<ProviderB2B />} />
              {/* 👇 Mi catálogo B2B */}
              <Route path="b2b/catalog" element={<ProviderCatalog />} />

              <Route path="rx-intake" element={<ProviderRxIntake />} />
              <Route
                path="authorizations"
                element={<ProviderAuthorizations />}
              />
              <Route
                path="module-configuration"
                element={<ProviderModuleConfiguration />}
              />
              {/* Ruta para servicios */}
              <Route path="services" element={<ProviderServices />} />
            </Route>

            {/* Setup inicial proveedor (alias) */}
            <Route
              path="/provider/profile-setup"
              element={<ProviderProfileSetup />}
            />
            <Route
              path="/provider-profile-setup"
              element={<Navigate to="/provider/profile-setup" replace />}
            />

            {/* Compatibilidad (redirecciones) */}
            <Route
              path="/provider-dashboard"
              element={<Navigate to="/provider/dashboard" replace />}
            />
            <Route
              path="/provider-inventory"
              element={<Navigate to="/provider/inventory" replace />}
            />
            <Route
              path="/provider-order-management"
              element={<Navigate to="/provider/orders" replace />}
            />
            <Route
              path="/provider-services-management"
              element={<Navigate to="/provider/services" replace />}
            />
            <Route
              path="/provider-analytics"
              element={<Navigate to="/provider/analytics" replace />}
            />
            <Route
              path="/provider-dispatch-management"
              element={<Navigate to="/provider/dispatch" replace />}
            />

            {/* ================== CLÍNICA ================== */}
            <Route
  path="/clinic-dashboard"
  element={
    <RoleGuard allowed={["clinic", "clinic_admin"]}>
      <ClinicDashboard />
    </RoleGuard>
  }
/>

<Route
  path="/clinic/operations"
  element={
    <RoleGuard allowed={["clinic", "clinic_admin"]}>
      <ClinicOperationsOverviewDashboard />
    </RoleGuard>
  }
/>

<Route
  path="/clinic/management"
  element={
    <RoleGuard allowed={["clinic", "clinic_admin"]}>
      <ClinicManagementDashboard />
    </RoleGuard>
  }
/>

<Route
  path="/clinic/billing"
  element={
    <RoleGuard allowed={["clinic", "clinic_admin"]}>
      <ClinicBilling />
    </RoleGuard>
  }
/>

<Route
  path="/clinic/authorizations"
  element={
    <RoleGuard allowed={["clinic", "clinic_admin"]}>
      <ClinicAuthorizations />
    </RoleGuard>
  }
/>


{/* Citas y agenda (nuevo path semántico) */}
<Route
  path="/clinic/appointments"
  element={
    <RoleGuard allowed={["clinic", "clinic_admin"]}>
      <ClinicAppointmentsManagement />
    </RoleGuard>
  }
/>
{/* Alias legacy */}
<Route
  path="/clinic-appointments-management"
  element={<Navigate to="/clinic/appointments" replace />}
/>

{/* Inventario */}
<Route
  path="/clinic/inventory"
  element={
    <RoleGuard allowed={["clinic", "clinic_admin"]}>
      <ClinicInventoryManagement />
    </RoleGuard>
  }
/>

{/* Órdenes de compra */}
<Route
  path="/clinic/purchase-orders"
  element={
    <RoleGuard allowed={["clinic", "clinic_admin"]}>
      <ClinicPurchaseOrders />
    </RoleGuard>
  }
/>
{/* Alias semántico para compras */}
<Route
  path="/clinic/purchases"
  element={<Navigate to="/clinic/purchase-orders" replace />}
/>

{/* Marketplace específico de clínica (hub propio) */}
<Route
  path="/clinic/marketplace"
  element={
    <RoleGuard allowed={["clinic", "clinic_admin"]}>
      <ClinicMarketplaceHub />
    </RoleGuard>
  }
/>
{/* Compatibilidad con ruta antigua */}
<Route
  path="/clinic-marketplace-hub"
  element={<Navigate to="/clinic/marketplace" replace />}
/>

{/* Espacios físicos */}
<Route
  path="/clinic/spaces"
  element={
    <RoleGuard allowed={["clinic", "clinic_admin"]}>
      <ClinicSpacesManagement />
    </RoleGuard>
  }
/>

{/* Publicar espacio */}
<Route
  path="/clinic/spaces/new"
  element={
    <RoleGuard allowed={["clinic", "clinic_admin"]}>
      <NewSpaceRegistration />
    </RoleGuard>
  }
/>

{/* ✅ Nueva Reserva (puerta de entrada operativa)
    Reusa el motor de reserva existente */}
<Route
  path="/clinic/spaces/booking/new"
  element={
    <RoleGuard allowed={["clinic", "clinic_admin"]}>
      <SpaceReservation />
    </RoleGuard>
  }
/>

{/* (Opcional) Alias si tienes una ruta vieja de reservas */}
{/* 
<Route
  path="/space-reservation"
  element={<Navigate to="/clinic/spaces/booking/new" replace />}
/>
*/}


            {/* Compatibilidad legacy */}
            <Route
              path="/profesional/recetas/nueva"
              element={<NewPrescriptionForm />}
            />
            <Route
              path="/profesional/diagnosticos/nuevo"
              element={<NewDiagnosisForm />}
            />
            <Route
              path="/profesional/derivaciones/nueva"
              element={<NewReferralForm />}
            />

            {/* Capacidades */}
            <Route path="/cap/rx-intake" element={<RxIntake />} />
            <Route path="/cap/lab-orders" element={<LabOrders />} />
            <Route path="/cap/optics-orders" element={<OpticsOrders />} />
            <Route path="/cap/appointments" element={<AppointmentsCap />} />
            <Route path="/cap/b2b" element={<B2BCap />} />
            <Route path="/cap/analytics" element={<AnalyticsCap />} />
            <Route
              path="/cap/authorizations"
              element={<AuthorizationsCap />}
            />
            <Route path="/cap/claims" element={<ClaimsCap />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
