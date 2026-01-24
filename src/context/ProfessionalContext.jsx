import React, { createContext, useState, useContext } from "react";

// Crea el contexto para el profesional
const ProfessionalContext = createContext();

export const useProfessional = () => useContext(ProfessionalContext);

export const ProfessionalProvider = ({ children }) => {
  const [currentProfessional, setCurrentProfessional] = useState(null);

  const login = (professionalData) => {
    setCurrentProfessional(professionalData);  // Guarda los datos del médico en el contexto global
  };

  const logout = () => {
    setCurrentProfessional(null);  // Elimina los datos del médico
  };

  return (
    <ProfessionalContext.Provider value={{ currentProfessional, login, logout }}>
      {children}
    </ProfessionalContext.Provider>
  );
};
