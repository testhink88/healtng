import React, { lazy } from "react";

const RxIntake = lazy(() => import("@/pages/capabilities/RxIntake"));
const LabOrders = lazy(() => import("@/pages/capabilities/LabOrders"));
const OpticsOrders = lazy(() => import("@/pages/capabilities/OpticsOrders"));
const AppointmentsCap = lazy(() => import("@/pages/capabilities/Appointments"));
const B2BCap = lazy(() => import("@/pages/capabilities/B2B"));
const AnalyticsCap = lazy(() => import("@/pages/capabilities/Analytics"));
const AuthorizationsCap = lazy(() => import("@/pages/capabilities/Authorizations"));
const ClaimsCap = lazy(() => import("@/pages/capabilities/Claims"));

export const capabilitiesRoutes = [
  {
    path: "/cap/rx-intake",
    element: <RxIntake />,
  },
  {
    path: "/cap/lab-orders",
    element: <LabOrders />,
  },
  {
    path: "/cap/optics-orders",
    element: <OpticsOrders />,
  },
  {
    path: "/cap/appointments",
    element: <AppointmentsCap />,
  },
  {
    path: "/cap/b2b",
    element: <B2BCap />,
  },
  {
    path: "/cap/analytics",
    element: <AnalyticsCap />,
  },
  {
    path: "/cap/authorizations",
    element: <AuthorizationsCap />,
  },
  {
    path: "/cap/claims",
    element: <ClaimsCap />,
  },
];
