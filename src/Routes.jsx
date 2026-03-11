// src/Routes.jsx
import React, { Suspense } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";

import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ProfessionalProvider } from "@/context/ProfessionalContext";
import { AuthProvider } from "@/context/AuthContext";

// Import modules
import { publicRoutes } from "@/routes/modules/publicRoutes";
import { settingsRoutes } from "@/routes/modules/settingsRoutes";
import { assistantRoutes } from "@/routes/modules/assistantRoutes";
import { patientRoutes } from "@/routes/modules/patientRoutes";
import { marketplaceRoutes } from "@/routes/modules/marketplaceRoutes";
import { commonRoutes } from "@/routes/modules/commonRoutes";
import { clinicRoutes } from "@/routes/modules/clinicRoutes";
import { professionalRoutes } from "@/routes/modules/professionalRoutes";
import { providerRoutes } from "@/routes/modules/providerRoutes";
import { capabilitiesRoutes } from "@/routes/modules/capabilitiesRoutes";

// --- Loader de Suspense ---
const Fallback = () => (
  <div className="w-full h-[50vh] flex items-center justify-center text-sm text-gray-500">
    <div className="flex flex-col items-center gap-2">
      <span>Cargando Healtng...</span>
    </div>
  </div>
);

const AppRoutes = () => {
  const routes = useRoutes([
    ...settingsRoutes,
    ...assistantRoutes,
    ...patientRoutes,
    ...marketplaceRoutes,
    ...commonRoutes,
    ...clinicRoutes,
    ...providerRoutes,
    ...professionalRoutes,
    ...capabilitiesRoutes,
    ...publicRoutes, 
  ]);
  return routes;
};

export default function Routes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProfessionalProvider>
          <ErrorBoundary>
            <ScrollToTop />
            <Suspense fallback={<Fallback />}>
              <AppRoutes />
            </Suspense>
          </ErrorBoundary>
        </ProfessionalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
