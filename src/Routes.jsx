// src/routes/Routes.jsx
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

import { ProfessionalProvider } from "@/context/ProfessionalContext";

// --- Guard de perfil de negocio
const ProfileGate = lazy(() => import("@/features/provider/components/ProfileGate"));

// --- ✅ Router de Settings (scopes)
const SettingsRouter = lazy(() => import("@/pages/settings/SettingsRouter"));

// --- Loader de Suspense ---
const Fallback = () => (
  <div className="w-full h-[50vh] flex items-center justify-center text-sm text-gray-500">
    <div className="flex flex-col items-center gap-2">
      <span>Cargando Healtng...</span>
    </div>
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
const PaymentProcessing = lazy(() => import("@/pages/payment-processing"));

const NewPrescriptionForm = lazy(() => import("@/pages/new-prescription-form"));
const NewDiagnosisForm = lazy(() => import("@/pages/new-diagnosis-form"));
const NewReferralForm = lazy(() => import("@/pages/new-referral-form"));

const PatientList = lazy(() => import("@/pages/patient-list"));
const PatientProfile = lazy(() => import("@/pages/patient-profile"));
const CheckInActionsPanel = lazy(() => import("@/pages/check-in-actions-panel"));

// Asistente
const AssistantDashboard = lazy(() => import("@/pages/assistant/AssistantDashboard"));
const PatientIntake = lazy(() => import("@/pages/assistant/PatientIntake"));

// Paciente
const PatientAppointmentsHistory = lazy(() => import("@/pages/patient-appointments-history"));
const NewPatientAppointment = lazy(() => import("@/pages/patient-appointment-new"));
const PatientHealthProfilePage = lazy(() => import("@/pages/patient-health-profile"));

// Marketplace
const B2CMarketplace = lazy(() => import("@/pages/b2c-marketplace"));
const B2BMarketplace = lazy(() => import("@/pages/b2b-marketplace"));
const MarketplaceHub = lazy(() => import("@/pages/marketplace-hub"));
const VendorStoreProfile = lazy(() => import("@/features/marketplace/pages/VendorStoreProfile"));

// Clínica
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

// Capacidades
const RxIntake = lazy(() => import("@/pages/capabilities/RxIntake"));
const LabOrders = lazy(() => import("@/pages/capabilities/LabOrders"));
const OpticsOrders = lazy(() => import("@/pages/capabilities/OpticsOrders"));
const AppointmentsCap = lazy(() => import("@/pages/capabilities/Appointments"));
const B2BCap = lazy(() => import("@/pages/capabilities/B2B"));
const AnalyticsCap = lazy(() => import("@/pages/capabilities/Analytics"));
const AuthorizationsCap = lazy(() => import("@/pages/capabilities/Authorizations"));
const ClaimsCap = lazy(() => import("@/pages/capabilities/Claims"));

// Business Dashboards
const ProfessionalPublishingWorkflow = lazy(() => import("@/pages/professional-publishing-workflow"));
const BusinessTypeDashboardHub = lazy(() => import("@/pages/business-type-dashboard-hub"));

// Provider
const ProviderLayout = lazy(() => import("@/features/provider/pages/ProviderLayout"));
const ProviderDashboard = lazy(() => import("@/features/provider/pages/ProviderDashboard"));
const ProviderInventory = lazy(() => import("@/features/provider/pages/ProviderInventory"));
const ProviderServices = lazy(() => import("@/features/provider/pages/ProviderServices"));
const ProviderAnalytics = lazy(() => import("@/features/provider/pages/ProviderAnalytics"));
const ProviderB2B = lazy(() => import("@/features/provider/pages/ProviderB2B"));
const ProviderRxIntake = lazy(() => import("@/features/provider/pages/ProviderRxIntake"));
const ProviderAuthorizations = lazy(() => import("@/features/provider/pages/ProviderAuthorizations"));
const ProviderDispatchManagement = lazy(() =>
  import("@/features/provider/pages/ProviderDispatchManagement")
);
const ProviderBillingManagement = lazy(() =>
  import("@/features/provider/pages/ProviderBillingManagement")
);
const ProviderModuleConfiguration = lazy(() =>
  import("@/features/provider/pages/ProviderModuleConfiguration")
);
const ProviderProfileSetup = lazy(() => import("@/features/provider/pages/ProviderProfileSetup"));
const ProviderCatalog = lazy(() => import("@/features/provider/pages/ProviderCatalog"));
const ProviderLots = lazy(() => import("@/features/provider/pages/LotsPage"));
const ProviderLotsAndExpiry = lazy(() => import("@/features/provider/pages/LotsAndExpiry"));
const ProviderOrderManagement = lazy(() => import("@/features/provider/pages/ProviderOrderManagement"));
const BatchProcessor = lazy(() => import("@/pages/provider-order-management/components/BatchProcessor"));
const ShipmentTracker = lazy(() => import("@/pages/provider-order-management/components/ShipmentTracker"));
const AnalyticsDashboard = lazy(() => import("@/pages/provider-order-management/components/AnalyticsDashboard"));

// Indicadores Médicos
const MedicalIndicatorsPage = lazy(() => import("@/pages/medical-indicators"));

// 404
const NotFound = lazy(() => import("@/pages/NotFound"));

/**
 * Placeholder simple para Ayuda y Soporte (mientras los desarrollamos)
 */
const SimplePage = ({ title, subtitle }) => (
  <div className="min-h-screen bg-gray-50 pt-24 px-6 flex justify-center">
    <div className="max-w-2xl w-full bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
      <h1 className="text-3xl font-light text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-500 mb-8">{subtitle}</p>
      <button className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition">
        Volver al inicio
      </button>
    </div>
  </div>
);

export default function Routes() {
  return (
    <BrowserRouter>
      <ProfessionalProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <Suspense fallback={<Fallback />}>
            <RouterRoutes>
              {/* Home / Auth */}
              <Route path="/" element={<AppointmentBooking />} />
              <Route path="/appointment-booking" element={<AppointmentBooking />} />
              <Route path="/login" element={<Login />} />

              <Route path="/profile" element={<Navigate to="/patient-health-profile" replace />} />

              {/* ✅ SETTINGS (router por scopes) */}
              <Route
                path="/settings/*"
                element={
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
                }
              />

              {/* Ayuda y Soporte */}
              <Route
                path="/help"
                element={
                  <SimplePage
                    title="Centro de Ayuda"
                    subtitle="Estamos construyendo una base de conocimiento para ti. Próximamente disponible."
                  />
                }
              />
              <Route
                path="/support"
                element={
                  <SimplePage
                    title="Soporte Técnico"
                    subtitle="Contacta a soporte@healtng.com o escribe por WhatsApp al +58..."
                  />
                }
              />

              {/* --- RESTO DE RUTAS --- */}
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/professional-dashboard" element={<ProfessionalDashboard />} />

              {/* Asistente */}
              <Route
                path="/assistant"
                element={
                  <RoleGuard allowed={["assistant", "clinic_admin", "clinic", "professional", "doctor"]}>
                    <AssistantDashboard />
                  </RoleGuard>
                }
              />
              <Route
                path="/assistant/intake/:patientId"
                element={
                  <RoleGuard allowed={["assistant", "clinic_admin", "clinic", "professional", "doctor"]}>
                    <PatientIntake />
                  </RoleGuard>
                }
              />

              {/* Paciente */}
              <Route
                path="/patient-health-profile"
                element={
                  <RoleGuard allowed={["patient"]}>
                    <PatientHealthProfilePage />
                  </RoleGuard>
                }
              />
              <Route path="/patient-appointment-history" element={<PatientAppointmentsHistory />} />
              <Route path="/new-patient-appointment" element={<NewPatientAppointment />} />

              {/* Marketplace */}
              <Route path="/marketplace" element={<MarketplaceHub />} />
              <Route path="/marketplace-hub" element={<MarketplaceHub />} />
              <Route path="/marketplace/b2c" element={<B2CMarketplace />} />
              <Route path="/marketplace/b2b" element={<B2BMarketplace />} />
              <Route path="/marketplace/vendor/:id" element={<VendorStoreProfile />} />

              {/* Órdenes / pagos */}
              <Route path="/orders/:id" element={<PaymentProcessing />} />
              <Route path="/payment-processing" element={<PaymentProcessing />} />

              {/* Servicios varios */}
              <Route path="/space-reservation" element={<SpaceReservation />} />
              <Route path="/prescription-management" element={<PrescriptionManagement />} />
              <Route path="/medical-history" element={<MedicalHistory />} />
              <Route path="/doctor-discovery" element={<DoctorDiscovery />} />

              {/* Indicadores Médicos */}
              <Route
                path="/medical-indicators"
                element={
                  <RoleGuard allowed={["doctor", "specialist", "professional", "clinic", "clinic_admin"]}>
                    <MedicalIndicatorsPage />
                  </RoleGuard>
                }
              />
              <Route path="/indicadores-medicos" element={<Navigate to="/medical-indicators" replace />} />

              {/* Gestión de pacientes */}
              <Route path="/patients" element={<PatientList />} />
              <Route path="/patients/:id" element={<PatientProfile />} />

              {/* Rutas clínicas dinámicas */}
              <Route path="/patients/:patientId/diagnosis/new" element={<NewDiagnosisForm />} />
              <Route path="/patients/:patientId/prescriptions/new" element={<NewPrescriptionForm />} />
              <Route path="/patients/:patientId/referrals/new" element={<NewReferralForm />} />

              {/* Legacy */}
              <Route path="/prescriptions/new" element={<NewPrescriptionForm />} />
              <Route path="/diagnosis/new" element={<NewDiagnosisForm />} />
              <Route path="/referrals/new" element={<NewReferralForm />} />
              <Route path="/check-in-actions-panel" element={<CheckInActionsPanel />} />

              {/* Business Dashboard */}
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

              {/* ✅ Provider Profile Setup (ruta CANÓNICA + protegida) */}
              <Route
                path="/provider/profile-setup"
                element={
                  <RoleGuard allowed={["provider"]}>
                    <ProviderProfileSetup />
                  </RoleGuard>
                }
              />

              {/* ✅ Alias de compatibilidad (evita 404 por link viejo con guion) */}
              <Route
                path="/provider-profile-setup"
                element={<Navigate to="/provider/profile-setup" replace />}
              />

              {/* Provider (todo lo demás) */}
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
                <Route path="inventory/lots" element={<Navigate to="/provider/lots" replace />} />
                <Route path="orders" element={<ProviderOrderManagement />} />
                <Route path="orders/create" element={<ProviderOrderManagement />} />
                <Route path="orders/batch" element={<BatchProcessor />} />
                <Route path="orders/shipments" element={<ShipmentTracker />} />
                <Route path="orders/analytics" element={<AnalyticsDashboard />} />
                <Route path="dispatch" element={<ProviderDispatchManagement />} />
                <Route path="billing" element={<ProviderBillingManagement />} />
                <Route path="analytics" element={<ProviderAnalytics />} />
                <Route path="b2b" element={<ProviderB2B />} />
                <Route path="b2b/catalog" element={<ProviderCatalog />} />
                <Route path="rx-intake" element={<ProviderRxIntake />} />
                <Route path="authorizations" element={<ProviderAuthorizations />} />
                <Route path="module-configuration" element={<ProviderModuleConfiguration />} />
                <Route path="services" element={<ProviderServices />} />
              </Route>

              {/* CLÍNICA */}
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
              <Route
                path="/clinic/appointments"
                element={
                  <RoleGuard allowed={["clinic", "clinic_admin"]}>
                    <ClinicAppointmentsManagement />
                  </RoleGuard>
                }
              />
              <Route
                path="/clinic/inventory"
                element={
                  <RoleGuard allowed={["clinic", "clinic_admin"]}>
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
                path="/clinic/marketplace"
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
              <Route
                path="/clinic/spaces/booking/new"
                element={
                  <RoleGuard allowed={["clinic", "clinic_admin"]}>
                    <SpaceReservation />
                  </RoleGuard>
                }
              />

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
          </Suspense>
        </ErrorBoundary>
      </ProfessionalProvider>
    </BrowserRouter>
  );
}
