import React from "react";
import { useProfessional } from "@/context/ProfessionalContext"; // O tu hook de autenticación
// Importamos las dos vistas separadas (crearemos estos archivos abajo)
import DoctorPrescriptionManager from "./DoctorPrescriptionManager";
import PatientPrescriptionWallet from "./PatientPrescriptionWallet";

const PrescriptionManagementHub = () => {
  // 1. Detectar Rol (Usamos localStorage como fallback si no hay contexto)
  const role = localStorage.getItem("userRole") || "patient";
  const isDoctor = role === "doctor" || role === "specialist" || role === "professional";

  // 2. Renderizado Condicional Estricto
  // Si es médico, carga el GESTOR. Si es paciente, carga la BILLETERA.
  if (isDoctor) {
    return <DoctorPrescriptionManager />;
  }

  return <PatientPrescriptionWallet />;
};

export default PrescriptionManagementHub;