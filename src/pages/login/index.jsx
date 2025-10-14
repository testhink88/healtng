// src/@/@/@/@/pages/login/index.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Icon from '@/components/AppIcon';

const roleHome = (role) => {
  switch (role) {
    case 'patient':
      return '/patient-dashboard';
    case 'doctor':
    case 'specialist':
      return '/professional-dashboard';
    case 'clinic':
    case 'clinic_admin':
      return '/clinic-dashboard';
    case 'provider':
      // 🚀 Siempre al setup primero
      return '/provider-profile-setup';
    default:
      return '/';
  }
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@healtng.com');
  const [password, setPassword] = useState('********');
  const [userType, setUserType] = useState('clinic_admin');

  const signIn = (role) => {
    localStorage.setItem('auth-token', 'demo-token');
    localStorage.setItem('userRole', role);
    navigate(roleHome(role)); // redirige según rol
  };

  const onSubmit = (e) => {
    e?.preventDefault();
    signIn(userType);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-center mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Heart" size={20} color="white" />
            </div>
          </div>

          <h1 className="text-center text-xl font-bold text-foreground mb-1">
            Bienvenido a Healtng
          </h1>
          <p className="text-center text-sm text-muted-foreground mb-6">
            Ingresa a tu cuenta para continuar
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Correo Electrónico *</label>
              <input
                className="w-full px-3 py-2 rounded-md border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                value={email}
                onChange={(e) => setEmail(e?.target?.value)}
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contraseña *</label>
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

          {/* Acceso rápido de demostración */}
          <div className="mt-6">
            <p className="text-center text-sm text-muted-foreground mb-2">
              Acceso rápido para demostración:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => signIn('patient')}>
                <Icon name="User" size={16} className="mr-2" />
                Paciente
              </Button>
              <Button variant="outline" onClick={() => signIn('doctor')}>
                <Icon name="Stethoscope" size={16} className="mr-2" />
                Médico
              </Button>
              <Button variant="outline" onClick={() => signIn('clinic')}>
                <Icon name="Building2" size={16} className="mr-2" />
                Clínica
              </Button>
              <Button variant="outline" onClick={() => signIn('provider')}>
                <Icon name="Package" size={16} className="mr-2" />
                Proveedor
              </Button>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center py-8 border-t border-border">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm text-muted-foreground mb-4">
            © {new Date()?.getFullYear()} Healtng. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
