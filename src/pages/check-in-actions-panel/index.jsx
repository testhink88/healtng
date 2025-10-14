import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import PatientContext from '@/pages/check-in-actions-panel/components/PatientContext';
import QuickActionsGrid from '@/pages/check-in-actions-panel/components/QuickActionsGrid';
import AppointmentStatus from '@/pages/check-in-actions-panel/components/AppointmentStatus';
import ProgressTracker from '@/pages/check-in-actions-panel/components/ProgressTracker';

const CheckInActionsPanel = () => {
  const location = useLocation();
  const [activePatient, setActivePatient] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const [panelPosition, setPanelPosition] = useState('bottom'); // 'bottom' | 'sidebar'
  const [isVisible, setIsVisible] = useState(true);
  const [consultationTime, setConsultationTime] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  // Simulación de datos del paciente activo tras check-in
  useEffect(() => {
    const urlParams = new URLSearchParams(location?.search);
    const patientId = urlParams?.get('patientId');
    const appointmentId = urlParams?.get('appointmentId');
    
    if (patientId && appointmentId) {
      // Simular carga de datos del paciente
      setActivePatient({
        id: patientId,
        fullName: 'María Elena Rodríguez',
        dni: 'V-12.345.678',
        age: 45,
        bloodType: 'O+',
        allergies: ['Penicilina', 'Aspirina'],
        chronicConditions: ['Hipertensión', 'Diabetes Tipo 2'],
        avatarUrl: null
      });

      setAppointmentData({
        id: appointmentId,
        time: '10:30 AM',
        reason: 'Control de rutina - Cardiología',
        duration: 30,
        status: 'checked-in',
        checkedInAt: new Date()?.toISOString()
      });

      // Iniciar contador de tiempo de consulta
      const startTime = Date.now();
      const timer = setInterval(() => {
        setConsultationTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [location]);

  // Detectar tamaño de pantalla para posición del panel
  useEffect(() => {
    const handleResize = () => {
      setPanelPosition(window.innerWidth >= 1024 ? 'sidebar' : 'bottom');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleActionClick = (actionType) => {
    const baseUrl = {
      'prescription': '/prescriptions/new',
      'diagnosis': '/diagnosis/new',
      'referral': '/referrals/new'
    }?.[actionType];

    if (baseUrl && activePatient) {
      const url = `${baseUrl}?patientId=${activePatient?.id}&appointmentId=${appointmentData?.id}`;
      window.location.href = url;
    }
  };

  const handleClosePanel = () => {
    setIsVisible(false);
    // Opcional: redirigir a dashboard o agenda
    setTimeout(() => {
      window.location.href = '/professional-dashboard';
    }, 300);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  if (!activePatient || !appointmentData || !isVisible) {
    return null;
  }

  const panelClasses = `
    fixed z-50 bg-card border border-border shadow-lg transition-all duration-300
    ${panelPosition === 'sidebar' ?'top-20 right-4 w-80 rounded-lg' :'bottom-0 left-0 right-0 rounded-t-lg border-l-0 border-r-0 border-b-0'
    }
    ${isMinimized ? 'opacity-75' : 'opacity-100'}
  `;

  return (
    <div className={panelClasses}>
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-primary/5">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Activity" size={16} color="white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">
              Consulta Activa
            </h3>
            <p className="text-xs text-muted-foreground">
              {formatTime(consultationTime)} • {appointmentData?.reason}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMinimize}
            className="w-8 h-8"
            title={isMinimized ? "Expandir" : "Minimizar"}
          >
            <Icon name={isMinimized ? "ChevronUp" : "ChevronDown"} size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClosePanel}
            className="w-8 h-8"
            title="Cerrar panel"
          >
            <Icon name="X" size={14} />
          </Button>
        </div>
      </div>

      {/* Panel Content */}
      <div className={`transition-all duration-300 ${
        isMinimized ? 'h-0 overflow-hidden' : 'h-auto'
      }`}>
        <div className="p-4 space-y-4">
          {/* Patient Context */}
          <PatientContext patient={activePatient} appointment={appointmentData} />

          {/* Quick Actions Grid */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Acciones Rápidas</h4>
            <QuickActionsGrid onActionClick={handleActionClick} />
          </div>

          {/* Appointment Status */}
          <AppointmentStatus 
            appointment={appointmentData}
            consultationTime={consultationTime}
          />

          {/* Progress Tracker */}
          <ProgressTracker 
            appointment={appointmentData}
            consultationTime={consultationTime}
          />

          {/* Additional Actions */}
          <div className="pt-3 border-t border-border">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = `/patients/${activePatient?.id}`}
                className="flex items-center space-x-2 text-xs"
              >
                <Icon name="User" size={12} />
                <span>Ver Ficha</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = `/medical-history?patientId=${activePatient?.id}`}
                className="flex items-center space-x-2 text-xs"
              >
                <Icon name="History" size={12} />
                <span>Historial</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = `/appointment-booking?patientId=${activePatient?.id}`}
                className="flex items-center space-x-2 text-xs"
              >
                <Icon name="Calendar" size={12} />
                <span>Nueva Cita</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile optimization */}
      {panelPosition === 'bottom' && (
        <div className="safe-area-inset-bottom" />
      )}
    </div>
  );
};

export default CheckInActionsPanel;