import React from "react";
// Importamos las dos vistas
import DoctorHistoryViewer from "./DoctorHistoryViewer";
import PatientHistoryRecord from "./PatientHistoryRecord";

const MedicalHistoryHub = () => {
  // 1. Detectamos el rol
  const role = localStorage.getItem("userRole") || "patient";
  const isProfessional = ["doctor", "specialist", "professional", "provider"].includes(role);

  // 2. Renderizado Condicional
  if (isProfessional) {
    return <DoctorHistoryViewer />;
  }

  // Vista por defecto (Paciente)
  return <PatientHistoryRecord />;
};

export default MedicalHistoryHub;