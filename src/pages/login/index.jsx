// src/pages/login/index.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { canonicalRole } from "@/utils/RoleGuard";

import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import Input from "@/components/ui/Input";

// Onboardings por rol (se mantienen por ahora, pero se conectarán a Supabase)
import PatientOnboardingStep from "./components/PatientOnboardingStep";
import DoctorOnboardingStep from "./components/DoctorOnboardingStep";
import ClinicOnboardingStep from "./components/ClinicOnboardingStep";

// 👇 IMPORTA EL LOGO DESDE PUBLIC
import logo from "/assets/brand/logo-dark.svg";

const roleHome = (role) => {
  switch (role) {
    case "patient": return "/patient-dashboard";
    case "doctor":
    case "professional":
    case "specialist": return "/professional-dashboard";
    case "clinic":
    case "clinic_admin": return "/clinic-dashboard";
    case "provider": return "/provider-dashboard";
    case "assistant": return "/assistant";
    default: return "/";
  }
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  
  // Login/Signup Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState("patient");

  // Step management
  const [step, setStep] = useState("auth"); 
  const [authError, setAuthError] = useState(null);

  // Redireccionar si ya hay sesión (opcional)
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          const role = profile.role || "patient";
          // Pequeña espera para asegurar que las rutas se registren
          setTimeout(() => navigate(roleHome(role)), 0);
        }
      }
    });
  }, [navigate]);

  const handleAuth = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      if (isRegister) {
        // 1. REGISTRO
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, role: selectedRole }
          }
        });

        if (error) throw error;

        if (data.user) {
          // 2. CREAR PERFIL EN TABLA 'profiles'
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              email: data.user.email,
              full_name: fullName,
              role: selectedRole,
              onboarding_completed: false,
              metadata: {}
            });

          if (profileError) {
            console.error("Error creating profile:", profileError);
            throw new Error("Cuenta creada pero hubo un problema con tu perfil. Por favor intenta iniciar sesión.");
          }

          alert("¡Registro exitoso! Por favor inicia sesión.");
          setIsRegister(false);
          setLoading(false);
        }
      } else {
        // 1. LOGIN
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        if (data.user) {
            // Intentar obtener el perfil con un pequeño reintento interno o auto-creación
            let profile = null;
            let retryCount = 0;

            while (!profile && retryCount < 2) {
                const { data: p } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', data.user.id)
                    .maybeSingle();
                
                if (p) {
                    profile = p;
                } else {
                    // Intento de auto-creación si falla el trigger o no existe
                    const { data: recovery, error: recoveryError } = await supabase
                        .from('profiles')
                        .upsert({
                            id: data.user.id,
                            email: data.user.email,
                            full_name: data.user.user_metadata?.full_name || "Usuario",
                            role: data.user.user_metadata?.role || "patient",
                            onboarding_completed: false,
                            metadata: {}
                        })
                        .select()
                        .maybeSingle();
                    
                    if (recovery) profile = recovery;
                }
                retryCount++;
            }

            if (profile) {
               const role = profile.role || "patient";
               const cRole = canonicalRole(role);
               
               localStorage.setItem("userRole", role);
               localStorage.setItem("auth-token", "active");

               if (!profile.onboarding_completed) {
                 if (cRole === "patient") setStep("patient-onboarding");
                 else if (cRole === "doctor") setStep("doctor-onboarding");
                 else if (cRole === "clinic") setStep("clinic-onboarding");
                 else navigate(roleHome(role));
               } else {
                 navigate(roleHome(role));
               }
            } else {
              throw new Error("No pudimos conectar con tu perfil. Por favor refresca la página e intenta de nuevo.");
            }
        }
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startSessionDemo = (role) => {
    // Modo Demo heredado: mantiene la funcionalidad rápida sin Supabase real 
    // pero guarda en Supabase si quieres (lo dejamos como acceso rápido por ahora)
    localStorage.setItem("auth-token", "demo-token");
    localStorage.setItem("userRole", role);
    navigate(roleHome(role));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-xl">
          
          <div className="flex flex-col items-center justify-center mb-8">
            <img src={logo} alt="Healtng" className="h-10 w-auto" />
            <h2 className="mt-4 text-xl font-bold text-foreground">
              {isRegister ? "Crea tu cuenta" : "Bienvenido de nuevo"}
            </h2>
            <p className="text-sm text-muted-foreground text-center mt-1">
              {isRegister 
                ? "Únete a la mayor red de salud digital" 
                : "Ingresa tus credenciales para continuar"}
            </p>
          </div>

          {step === "auth" && (
            <>
              {authError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                {isRegister && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 ml-1">Nombre Completo</label>
                      <Input 
                        placeholder="Juan Pérez" 
                        value={fullName} 
                        onChange={e => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 ml-1">¿Quién eres?</label>
                      <select 
                        className="w-full px-3 py-2 rounded-lg border border-border bg-input text-sm"
                        value={selectedRole}
                        onChange={e => setSelectedRole(e.target.value)}
                      >
                        <option value="patient">Paciente</option>
                        <option value="doctor">Médico</option>
                        <option value="assistant">Asistente médico</option>
                        <option value="provider">Proveedor / Farmacia</option>
                        <option value="clinic">Clínica</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1.5 ml-1">Correo Electrónico</label>
                  <Input 
                    type="email" 
                    placeholder="tu@email.com" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 ml-1">Contraseña</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" variant="default" className="w-full py-6 mt-2 shadow-lg shadow-primary/20" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Procesando...
                    </div>
                  ) : (
                    isRegister ? "Registrarse" : "Iniciar Sesión"
                  )}
                </Button>
              </form>

              <div className="mt-6 flex flex-col items-center gap-4">
                <button 
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  {isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate aquí"}
                </button>

                <div className="w-full flex items-center gap-4 text-xs text-muted-foreground uppercase tracking-widest">
                  <div className="flex-1 h-px bg-border"></div>
                  <span>O</span>
                  <div className="flex-1 h-px bg-border"></div>
                </div>

                <div className="w-full space-y-2">
                   <p className="text-center text-xs text-muted-foreground mb-2">Acceso rápido Demo (Bypass)</p>
                   <div className="grid grid-cols-2 gap-2">
                      <Button variant="ghost" size="sm" className="text-[10px]" onClick={() => startSessionDemo("patient")}>Paciente</Button>
                      <Button variant="ghost" size="sm" className="text-[10px]" onClick={() => startSessionDemo("doctor")}>Médico</Button>
                      <Button variant="ghost" size="sm" className="text-[10px]" onClick={() => startSessionDemo("provider")}>Proveedor</Button>
                      <Button variant="ghost" size="sm" className="text-[10px]" onClick={() => startSessionDemo("assistant")}>Asistente</Button>
                   </div>
                </div>
              </div>
            </>
          )}

          {/* ONBOARDINGS (Se mantienen integrados en el mismo flujo) */}
          {step === "patient-onboarding" && (
            <PatientOnboardingStep
              onComplete={() => navigate(roleHome("patient"))}
              onBack={() => setStep("auth")}
            />
          )}

          {step === "doctor-onboarding" && (
            <DoctorOnboardingStep
              onComplete={() => navigate(roleHome("doctor"))}
              onBack={() => setStep("auth")}
            />
          )}

          {step === "clinic-onboarding" && (
            <ClinicOnboardingStep
              onComplete={() => navigate(roleHome("clinic"))}
              onBack={() => setStep("auth")}
            />
          )}

        </div>
      </div>

      <footer className="text-center py-8 border-t border-border opacity-50">
        <p className="text-sm">
          © {new Date().getFullYear()} Healtng. Plataforma Integral de Salud.
        </p>
      </footer>
    </div>
  );
};

export default Login;
