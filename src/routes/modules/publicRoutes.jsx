import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import SimplePage from "@/components/SimplePage";
import { useAuth } from "@/context/AuthContext";

const AppointmentBooking = lazy(() => import("@/pages/appointment-booking"));
const Login = lazy(() => import("@/pages/login"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const PrescriptionIntakePortal = lazy(() => import("@/pages/prescription-intake-portal"));

const ProfileRedirect = () => {
  const { profile, loading } = useAuth();
  if (loading) return null;
  const role = profile?.role || localStorage.getItem("userRole") || "patient";
  
  switch (role) {
    case "patient": return <Navigate to="/patient-health-profile" replace />;
    case "doctor":
    case "professional":
    case "specialist": return <Navigate to="/professional/settings" replace />;
    case "clinic": return <Navigate to="/clinic/management" replace />;
    case "provider": return <Navigate to="/provider/profile-setup" replace />;
    default: return <Navigate to="/patient-health-profile" replace />;
  }
};

export const publicRoutes = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/appointment-booking",
    element: <AppointmentBooking />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profile",
    element: <ProfileRedirect />,
  },
  {
    path: "/help",
    element: (
      <SimplePage
        title="Centro de Ayuda"
        subtitle="Estamos construyendo una base de conocimiento para ti. Próximamente disponible."
      />
    ),
  },
  {
    path: "/support",
    element: (
      <SimplePage
        title="Soporte Técnico"
        subtitle="Contacta a soporte@healtng.com o escribe por WhatsApp al +58..."
      />
    ),
  },
  {
    path: "/prescription-intake-portal",
    element: <PrescriptionIntakePortal />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
