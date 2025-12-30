// src/pages/login/index.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";

// Onboardings por rol
import PatientOnboardingStep from "./components/PatientOnboardingStep";
import DoctorOnboardingStep from "./components/DoctorOnboardingStep";
import ClinicOnboardingStep from "./components/ClinicOnboardingStep";

// Utilidad para guardar perfiles demo en localStorage
import { saveDemoProfile } from "@/utils/demoProfileStorage";

// 👇 IMPORTA EL LOGO DESDE PUBLIC
import logo from "/assets/brand/logo-dark.svg";

const roleHome = (role) => {
  switch (role) {
    case "patient":
      return "/patient-dashboard";
    case "doctor":
    case "specialist":
      return "/professional-dashboard";
    case "clinic":
    case "clinic_admin":
      return "/clinic-dashboard";
    case "provider":
      return "/provider-profile-setup";
    default:
      return "/";
  }
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@healtng.com");
  const [password, setPassword] = useState("********");
  const [userType, setUserType] = useState("patient"); // si luego agregas selector de tipo de usuario

  // 'login' | 'patient-onboarding' | 'doctor-onboarding' | 'clinic-onboarding'
  const [step, setStep] = useState("login");
  const [currentRole, setCurrentRole] = useState(null);

  const startSession = (role) => {
    const finalRole = role || userType;

    // Mock de autenticación (demo)
    localStorage.setItem("auth-token", "demo-token");
    localStorage.setItem("userRole", finalRole);
    setCurrentRole(finalRole);

    // Redirección a onboarding según rol
    if (finalRole === "patient") {
      setStep("patient-onboarding");
    } else if (finalRole === "doctor" || finalRole === "specialist") {
      setStep("doctor-onboarding");
    } else if (finalRole === "clinic" || finalRole === "clinic_admin") {
      setStep("clinic-onboarding");
    } else {
      // Otros roles van directo a su home
      navigate(roleHome(finalRole));
    }
  };

  const onSubmit = (e) => {
    e?.preventDefault();
    startSession(userType);
  };

  // 👇 HANDLERS: cada onboarding devuelve sus datos de perfil
  const handleFinishPatientOnboarding = (profileData) => {
    saveDemoProfile("patient", profileData);
    navigate(roleHome("patient"));
  };

  const handleFinishDoctorOnboarding = (profileData) => {
    saveDemoProfile("doctor", profileData);
    navigate(roleHome("doctor"));
  };

  const handleFinishClinicOnboarding = (profileData) => {
    saveDemoProfile("clinic", profileData);
    navigate(roleHome("clinic"));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-sm">
          {/* HEADER: AHORA SOLO TU LOGO */}
          <div className="flex flex-col items-center justify-center mb-6">
            <img
              src={logo}
              alt="Healtng"
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* ================== STEP: LOGIN ================== */}
          {step === "login" && (
            <>
             
              <p className="text-center text-sm text-muted-foreground mb-6">
                Ingresa a tu cuenta o usa el modo demo 
                para probar la plataforma.
              </p>

              {/* FORMULARIO LOGIN */}
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded-md border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                    value={email}
                    onChange={(e) => setEmail(e?.target?.value)}
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 rounded-md border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                    value={password}
                    onChange={(e) => setPassword(e?.target?.value)}
                    placeholder="••••••••"
                  />
                </div>

                <Button type="submit" variant="default" className="w-full py-3">
                  Iniciar Sesión
                </Button>
              </form>

              {/* ACCESO RÁPIDO DEMO */}
              <div className="mt-6">
                <p className="text-center text-sm text-muted-foreground mb-2">
                  Acceso rápido para demostración:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => startSession("patient")}>
                    <Icon name="User" size={16} className="mr-2" />
                    Paciente
                  </Button>
                  <Button variant="outline" onClick={() => startSession("doctor")}>
                    <Icon name="Stethoscope" size={16} className="mr-2" />
                    Médico
                  </Button>
                  <Button variant="outline" onClick={() => startSession("clinic")}>
                    <Icon name="Building2" size={16} className="mr-2" />
                    Clínica
                  </Button>
                  <Button variant="outline" onClick={() => startSession("provider")}>
                    <Icon name="Package" size={16} className="mr-2" />
                    Proveedor
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* ================== STEP: ONBOARDING PACIENTE ================== */}
          {step === "patient-onboarding" && (
            <PatientOnboardingStep
              onComplete={handleFinishPatientOnboarding}
              onBack={() => setStep("login")}
            />
          )}

          {/* ================== STEP: ONBOARDING MÉDICO ================== */}
          {step === "doctor-onboarding" && (
            <DoctorOnboardingStep
              onComplete={handleFinishDoctorOnboarding}
              onBack={() => setStep("login")}
            />
          )}

          {/* ================== STEP: ONBOARDING CLÍNICA ================== */}
          {step === "clinic-onboarding" && (
            <ClinicOnboardingStep
              onComplete={handleFinishClinicOnboarding}
              onBack={() => setStep("login")}
            />
          )}
        </div>
      </div>

      <footer className="text-center py-8 border-t border-border">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Healtng. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default Login;
