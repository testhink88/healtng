import React, { lazy } from "react";

const B2CMarketplace = lazy(() => import("@/pages/b2c-marketplace"));
const B2BMarketplace = lazy(() => import("@/pages/b2b-marketplace"));
const MarketplaceHub = lazy(() => import("@/pages/marketplace-hub"));
const VendorStoreProfile = lazy(() =>
  import("@/features/marketplace/pages/VendorStoreProfile")
);

export const marketplaceRoutes = [
  {
    path: "/marketplace",
    element: <MarketplaceHub />,
  },
  {
    path: "/marketplace-hub",
    element: <MarketplaceHub />,
  },
  {
    path: "/marketplace/b2c",
    element: <B2CMarketplace />,
  },
  {
    path: "/marketplace/b2b",
    element: <B2BMarketplace />,
  },
  {
    path: "/marketplace/vendor/:id",
    element: <VendorStoreProfile />,
  },
];
