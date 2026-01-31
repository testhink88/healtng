// src/pages/settings/SettingsRouter.jsx
import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Simulación del hook para obtener el rol del usuario. 
// Reemplázalo con tu lógica real de autenticación y rol (por ejemplo, contexto o store).
function useUserRole() {
  return localStorage.getItem('userRole') || "doctor"; // Cambia por la lógica real.
}

const DoctorSettings = lazy(() => import("./scopes/doctor/DoctorSettings"));
const PatientSettings = lazy(() => import("./scopes/patient/PatientSettings"));
const ProviderSettings = lazy(() => import("./scopes/provider/ProviderSettings"));
const ClinicSettings = lazy(() => import("./scopes/clinic/ClinicSettings"));
const SystemSettings = lazy(() => import("./scopes/system/SystemSettings"));

const LoadingFallback = () => (
  <div className="w-full h-[40vh] flex items-center justify-center text-sm text-gray-500">
    Cargando Configuración...
  </div>
);

export default function SettingsRouter() {
  const [role, setRole] = useState(null);

  // Obtener el rol del usuario (deberías reemplazarlo con la lógica real)
  useEffect(() => {
    const storedRole = useUserRole();
    setRole(storedRole); // Se actualiza el estado con el rol
  }, []);

  // No renderizar nada hasta que tengamos el rol
  if (role === null) {
    return <LoadingFallback />;
  }

  // Determinar la ruta predeterminada según el rol
  const defaultScope = {
    provider: "provider",
    patient: "patient",
    clinic: "clinic",
    clinic_admin: "clinic",
    system_admin: "system",
    doctor: "doctor",
  }[role] || "doctor"; // Default es "doctor"

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Redirigir a la ruta predeterminada basada en el rol */}
        <Route index element={<Navigate to={defaultScope} replace />} />

        {/* Rutas específicas por cada tipo de configuración */}
        <Route path="doctor" element={<DoctorSettings />} />
        <Route path="patient" element={<PatientSettings />} />
        <Route path="provider" element={<ProviderSettings />} />
        <Route path="clinic" element={<ClinicSettings />} />
        <Route path="system" element={<SystemSettings />} />

        {/* Fallback para rutas no reconocidas */}
        <Route path="*" element={<Navigate to={defaultScope} replace />} />
      </Routes>
    </Suspense>
  );
}
