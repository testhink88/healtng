import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import RoleGuard from "@/utils/RoleGuard";

const ProfileGate = lazy(() => import("@/features/provider/components/ProfileGate"));
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
const ProviderLots = lazy(() => import("@/features/provider/pages/ProviderLotsPage"));
const ProviderLotsAndExpiry = lazy(() => import("@/features/provider/pages/ProviderLotsAndExpiry"));
const ProviderOrderManagement = lazy(() => import("@/features/provider/pages/ProviderOrderManagement"));
const BatchProcessor = lazy(() => import("@/pages/provider-order-management/components/BatchProcessor"));
const ShipmentTracker = lazy(() => import("@/pages/provider-order-management/components/ShipmentTracker"));
const AnalyticsDashboard = lazy(() => import("@/pages/provider-order-management/components/AnalyticsDashboard"));

export const providerRoutes = [
  {
    path: "/provider/profile-setup",
    element: (
      <RoleGuard allowed={["provider"]}>
        <ProviderProfileSetup />
      </RoleGuard>
    ),
  },
  {
    path: "/provider-profile-setup",
    element: <Navigate to="/provider/profile-setup" replace />,
  },
  {
    path: "/provider/*",
    element: (
      <RoleGuard allowed={["provider"]}>
        <ProfileGate>
          <ProviderLayout />
        </ProfileGate>
      </RoleGuard>
    ),
    children: [
      { index: true, element: <ProviderDashboard /> },
      { path: "dashboard", element: <ProviderDashboard /> },
      { path: "inventory", element: <ProviderInventory /> },
      { path: "lots", element: <ProviderLots /> },
      { path: "lots/expiring", element: <ProviderLotsAndExpiry /> },
      { path: "inventory/lots", element: <Navigate to="/provider/lots" replace /> },
      { path: "orders", element: <ProviderOrderManagement /> },
      { path: "orders/create", element: <ProviderOrderManagement /> },
      { path: "orders/batch", element: <BatchProcessor /> },
      { path: "orders/shipments", element: <ShipmentTracker /> },
      { path: "orders/analytics", element: <AnalyticsDashboard /> },
      { path: "dispatch", element: <ProviderDispatchManagement /> },
      { path: "billing", element: <ProviderBillingManagement /> },
      { path: "analytics", element: <ProviderAnalytics /> },
      { path: "b2b", element: <ProviderB2B /> },
      { path: "b2b/catalog", element: <ProviderCatalog /> },
      { path: "rx-intake", element: <ProviderRxIntake /> },
      { path: "authorizations", element: <ProviderAuthorizations /> },
      { path: "module-configuration", element: <ProviderModuleConfiguration /> },
      { path: "services", element: <ProviderServices /> },
    ],
  },
];
