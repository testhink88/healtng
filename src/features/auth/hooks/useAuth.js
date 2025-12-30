// src/features/auth/hooks/useAuth.js
import { useState, useEffect } from "react";

export const useAuth = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "guest";
    setUserRole(role);  // Este setState debe ejecutarse solo una vez al cargar
  }, []);  // Dependencias vacías para que solo se ejecute una vez al montar el componente

  return { userRole };
};
