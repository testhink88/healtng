// src/utils/RoleGuard.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Normaliza y unifica sinónimos de rol
const canonicalRole = (r) => {
  const v = (r || '').toString().toLowerCase().trim();
  switch (v) {
    case 'professional':
    case 'doctor':
    case 'specialist':
      return 'doctor';
    case 'clinic_admin':
    case 'clinic':
      return 'clinic';
    case 'medical_provider':
    case 'provider':
      return 'provider';
    case 'super_admin':
    case 'admin':
      return 'admin';
    case 'insurance':
    case 'insurance_provider':
      return 'insurance_provider';
    case 'patient':
    default:
      return v || 'patient';
  }
};

// Expande la lista de permitidos para incluir sinónimos
const expandAllowed = (arr) => {
  const set = new Set();
  arr.forEach((r) => {
    const c = canonicalRole(r);
    set.add(c);
    switch (c) {
      case 'doctor':
        set.add('professional');
        set.add('specialist');
        break;
      case 'clinic':
        set.add('clinic_admin');
        break;
      case 'provider':
        set.add('medical_provider');
        break;
      case 'admin':
        set.add('super_admin');
        break;
      case 'insurance_provider':
        set.add('insurance');
        break;
      default:
        break;
    }
  });
  return set;
};

// Redirección por defecto según el rol actual
const fallbackByRole = (role) => {
  switch (canonicalRole(role)) {
    case 'patient':
      return '/patient-dashboard';
    case 'doctor':
      return '/professional-dashboard';
    case 'clinic':
      return '/clinic-dashboard';
    case 'provider':
      return '/provider-dashboard';
    case 'insurance_provider':
      return '/insurance-dashboard';
    case 'admin':
      return '/admin-dashboard';
    default:
      return '/';
  }
};

/**
 * RoleGuard
 * - allowed: string | string[] | "*"  (si "*" => cualquier usuario autenticado)
 * - redirectTo: ruta opcional a la que redirigir cuando no tiene permiso
 */
const RoleGuard = ({ children, allowed = [], redirectTo }) => {
  const location = useLocation();

  const rawRole = localStorage.getItem('userRole');
  const isAuthenticated = Boolean(rawRole);
  const role = canonicalRole(rawRole || 'patient');

  // Sin autenticación → login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Comodín: cualquier autenticado pasa
  if (allowed === '*' || (Array.isArray(allowed) && allowed.includes('*'))) {
    return children;
  }

  const allowedArr = Array.isArray(allowed) ? allowed : [allowed];
  const allowedSet = expandAllowed(allowedArr);

  // Acceso permitido
  if (allowedSet.has(role)) {
    return children;
  }

  // Denegado → redirige según rol o a redirectTo si se pasa
  const to = redirectTo || fallbackByRole(role);
  return <Navigate to={to} replace state={{ from: location }} />;
};

export default RoleGuard;
