import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

const LoginForm = ({ onLogin, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [errors, setErrors] = useState({});

  const roleOptions = [
    { value: 'patient', label: 'Paciente' },
    { value: 'doctor', label: 'Médico/Profesional' },
    { value: 'clinic_admin', label: 'Administrador de Clínica' },
    { value: 'medical_provider', label: 'Proveedor Médico' },
    { value: 'insurance_provider', label: 'Aseguradora' },
    { value: 'admin', label: 'Administrador del Sistema' }
  ];

  const mockCredentials = {
    patient: { email: 'paciente@healtng.com', password: 'paciente123' },
    doctor: { email: 'doctor@healtng.com', password: 'doctor123' },
    clinic_admin: { email: 'admin@healtng.com', password: 'admin123' },
    medical_provider: { email: 'proveedor@healtng.com', password: 'proveedor123' },
    insurance_provider: { email: 'seguro@healtng.com', password: 'seguro123' },
    admin: { email: 'superadmin@healtng.com', password: 'super123' }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    if (!formData?.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData?.role) {
      newErrors.role = 'Debe seleccionar un tipo de usuario';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    const mockCreds = mockCredentials?.[formData?.role];
    
    if (formData?.email === mockCreds?.email && formData?.password === mockCreds?.password) {
      onLogin(formData?.role);
    } else {
      setErrors({
        general: `Credenciales incorrectas. Use: ${mockCreds?.email} / ${mockCreds?.password}`
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (errors?.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const fillMockCredentials = (role) => {
    const creds = mockCredentials?.[role];
    setFormData({
      email: creds?.email,
      password: creds?.password,
      role: role
    });
    setErrors({});
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Icon name="Heart" size={24} color="white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Bienvenido a Healtng</h1>
          <p className="text-muted-foreground">Ingresa a tu cuenta para continuar</p>
        </div>

        {/* General Error */}
        {errors?.general && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} color="var(--color-error)" />
              <p className="text-sm text-error">{errors?.general}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="ejemplo@correo.com"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.email}
            required
            className="mb-4"
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="Ingresa tu contraseña"
            value={formData?.password}
            onChange={(e) => handleInputChange('password', e?.target?.value)}
            error={errors?.password}
            required
            className="mb-4"
          />

          <Select
            label="Tipo de Usuario"
            placeholder="Selecciona tu rol"
            options={roleOptions}
            value={formData?.role}
            onChange={(value) => handleInputChange('role', value)}
            error={errors?.role}
            required
            className="mb-6"
          />

          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={isLoading}
            className="h-12"
          >
            Iniciar Sesión
          </Button>
        </form>

        {/* Quick Access */}
        <div className="mt-6">
          <p className="text-sm text-muted-foreground text-center mb-4">Acceso rápido para demostración:</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fillMockCredentials('patient')}
              className="text-xs"
            >
              <Icon name="User" size={14} className="mr-1" />
              Paciente
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fillMockCredentials('doctor')}
              className="text-xs"
            >
              <Icon name="Stethoscope" size={14} className="mr-1" />
              Médico
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fillMockCredentials('clinic_admin')}
              className="text-xs"
            >
              <Icon name="Building" size={14} className="mr-1" />
              Clínica
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fillMockCredentials('medical_provider')}
              className="text-xs"
            >
              <Icon name="Package" size={14} className="mr-1" />
              Proveedor
            </Button>
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col space-y-3">
            <Button variant="ghost" fullWidth className="text-sm">
              <Icon name="Key" size={16} className="mr-2" />
              ¿Olvidaste tu contraseña?
            </Button>
            <Button variant="ghost" fullWidth className="text-sm">
              <Icon name="UserPlus" size={16} className="mr-2" />
              Crear nueva cuenta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;