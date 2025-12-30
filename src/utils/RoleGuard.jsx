import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/** Normaliza y unifica sinónimos de rol */
const canonicalRole = (r) => {
  const v = (r || "").toString().toLowerCase().trim();
  switch (v) {
    case "professional":
    case "doctor":
    case "specialist":
      return "doctor";
    case "clinic_admin":
    case "clinic":
      return "clinic";
    case "medical_provider":
    case "provider":
      return "provider";
    case "super_admin":
    case "admin":
      return "admin";
    case "insurance":
    case "insurance_provider":
      return "insurance_provider";
    default:
      return v || "patient";
  }
};

/** Expande lista permitida para incluir sinónimos */
const expandAllowed = (arr) => {
  const set = new Set();
  arr.forEach((r) => {
    const c = canonicalRole(r);
    set.add(c);
    switch (c) {
      case "doctor":
        set.add("professional");
        set.add("specialist");
        break;
      case "clinic":
        set.add("clinic_admin");
        break;
      case "provider":
        set.add("medical_provider");
        break;
      case "admin":
        set.add("super_admin");
        break;
      case "insurance_provider":
        set.add("insurance");
        break;
      default:
        break;
    }
  });
  return set;
};

/** Redirección por defecto según rol */
const fallbackByRole = (role) => {
  switch (canonicalRole(role)) {
    case "patient":
      return "/patient-dashboard";
    case "doctor":
      return "/professional-dashboard";
    case "clinic":
      return "/clinic-dashboard";
    case "provider":
      return "/provider-dashboard";
    case "insurance_provider":
      return "/insurance-dashboard";
    case "admin":
      return "/admin-dashboard";
    default:
      return "/";
  }
};

/**
 * RoleGuard
 * - allowed: string | string[] | "*" | undefined
 *   Si allowed es undefined o [] => se comporta como "auth guard"
 */
const RoleGuard = ({ children, allowed, redirectTo }) => {
  const location = useLocation();
  const path = location?.pathname || "";

  const rawRole = localStorage.getItem("userRole");
  const isAuthenticated = Boolean(rawRole);
  const role = canonicalRole(rawRole || "patient");

  // Detectar rutas públicas de auth
  const isLoginRoute =
    path === "/login" ||
    path === "/" ||
    path.startsWith("/auth/login");

  // 1) No bloquees login si no hay auth
  if (!isAuthenticated && isLoginRoute) {
    return <>{children}</>;
  }

  // 2) Sin auth -> login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3) Si allowed no está definido o es [] => solo valida autenticación
  const isAllowedEmpty =
    allowed == null || (Array.isArray(allowed) && allowed.length === 0);

  if (isAllowedEmpty) {
    return <>{children}</>;
  }

  // 4) Comodín
  if (allowed === "*" || (Array.isArray(allowed) && allowed.includes("*"))) {
    return <>{children}</>;
  }

  const allowedArr = Array.isArray(allowed) ? allowed : [allowed];
  const allowedSet = expandAllowed(allowedArr);

  // 5) Acceso permitido
  if (allowedSet.has(role)) {
    return <>{children}</>;
  }

  // 6) Denegado -> redirige
  const to = redirectTo || fallbackByRole(role);

  // ✅ Anti-loop: si intenta mandarte a la misma ruta, rompe el ciclo
  if (to === path) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to={to} replace state={{ from: location }} />;
};

export default RoleGuard;

// exports opcionales útiles
export { canonicalRole, expandAllowed, fallbackByRole };
