import React, { lazy } from "react";
import RoleGuard from "@/utils/RoleGuard";

const ProfessionalDashboard = lazy(() => import("@/pages/professional-dashboard"));
const ProfessionalPublishingWorkflow = lazy(() =>
  import("@/pages/professional-publishing-workflow")
);
const BusinessTypeDashboardHub = lazy(() =>
  import("@/pages/business-type-dashboard-hub")
);

export const professionalRoutes = [
  {
    path: "/professional-dashboard",
    element: (
      <RoleGuard allowed={["professional", "doctor", "specialist"]}>
        <ProfessionalDashboard />
      </RoleGuard>
    ),
  },
  {
    path: "/business-type-dashboard-hub",
    element: (
      <RoleGuard allowed={["professional", "doctor"]}>
        <BusinessTypeDashboardHub />
      </RoleGuard>
    ),
  },
  {
    path: "/professional-publishing-workflow",
    element: (
      <RoleGuard allowed={["professional", "doctor"]}>
        <ProfessionalPublishingWorkflow />
      </RoleGuard>
    ),
  },
  {
    path: "/publish/new",
    element: (
      <RoleGuard allowed={["professional", "doctor"]}>
        <ProfessionalPublishingWorkflow />
      </RoleGuard>
    ),
  },
  {
    path: "/publish/:id",
    element: (
      <RoleGuard allowed={["professional", "doctor"]}>
        <ProfessionalPublishingWorkflow />
      </RoleGuard>
    ),
  },
];
