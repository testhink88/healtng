import React, { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';

import KPICard from '@/pages/professional-dashboard/components/KPICard';
import AppointmentsList from '@/pages/professional-dashboard/components/AppointmentsList';
import QuickActions from '@/pages/professional-dashboard/components/QuickActions';
import UpcomingSchedule from '@/pages/professional-dashboard/components/UpcomingSchedule';
import PatientManagementShortcuts from '@/pages/professional-dashboard/components/PatientManagementShortcuts';
import RevenueTracking from '@/pages/professional-dashboard/components/RevenueTracking';

import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';


const ProfessionalDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState('doctor');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Mock data for today's appointments
  const todaysAppointments = [
    {
      id: 1,
      patientName: 'María González',
      time: '09:00',
      duration: 30,
      type: 'in-person',
      status: 'confirmed',
      reason: 'Consulta de control cardiológico'
    },
    {
      id: 2,
      patientName: 'Carlos Rodríguez',
      time: '10:30',
      duration: 45,
      type: 'teleconsultation',
      status: 'confirmed',
      reason: 'Seguimiento diabetes tipo 2'
    },
    {
      id: 3,
      patientName: 'Ana Martínez',
      time: '11:30',
      duration: 30,
      type: 'in-person',
      status: 'pending',
      reason: 'Primera consulta dermatológica'
    },
    {
      id: 4,
      patientName: 'José Pérez',
      time: '14:00',
      duration: 60,
      type: 'in-person',
      status: 'confirmed',
      reason: 'Procedimiento menor'
    },
    {
      id: 5,
      patientName: 'Carmen Silva',
      time: '15:30',
      duration: 30,
      type: 'teleconsultation',
      status: 'pending',
      reason: 'Consulta de seguimiento'
    }
  ];

  // Mock data for upcoming schedule
  const upcomingSchedule = [
    {
      id: 6,
      patientName: 'Luis Morales',
      date: '2025-09-03',
      time: '09:00',
      type: 'in-person',
      status: 'confirmed',
      reason: 'Consulta neurológica'
    },
    {
      id: 7,
      patientName: 'Elena Vargas',
      date: '2025-09-03',
      time: '11:00',
      type: 'teleconsultation',
      status: 'confirmed',
      reason: 'Control post-operatorio'
    },
    {
      id: 8,
      patientName: 'Roberto Díaz',
      date: '2025-09-04',
      time: '10:00',
      type: 'in-person',
      status: 'pending',
      reason: 'Primera consulta'
    }
  ];

  // Calculate KPI values
  const todaysAppointmentCount = todaysAppointments?.length;
  const waitingRoomCount = todaysAppointments?.filter(apt => apt?.status === 'confirmed')?.length;
  const noShowPercentage = 8.5; // Mock percentage
  const dailyIncome = 450.00; // Mock daily income in USD
  const vesEquivalent = (dailyIncome * 36.5)?.toFixed(2); // Mock conversion rate

  const handleAppointmentAction = (appointmentId, action) => {
    console.log(`${action} appointment ${appointmentId}`);
    // Mock action handling - in real app would update state/API
  };

  const formatGreeting = () => {
    const hour = currentTime?.getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const formatCurrentTime = () => {
    return currentTime?.toLocaleTimeString('es-VE', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatCurrentDate = () => {
    return currentTime?.toLocaleDateString('es-VE', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole={userRole}
        isAuthenticated={true}
        onMenuToggle={() => setMobileSidebarOpen(true)}
      />
      <Sidebar
        userRole={userRole}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <main className={`pt-16 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                  {formatGreeting()}, Dr. María González
                </h1>
                <p className="text-muted-foreground">
                  {formatCurrentDate()} • {formatCurrentTime()}
                </p>
              </div>
              <div className="hidden lg:flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Estado del Sistema</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm font-medium text-success">Operativo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="Citas de Hoy"
              value={todaysAppointmentCount}
              subtitle="citas programadas"
              icon="Calendar"
              trend="up"
              trendValue="+2"
              color="primary"
            />
            <KPICard
              title="Sala de Espera"
              value={waitingRoomCount}
              subtitle="pacientes esperando"
              icon="Users"
              trend="up"
              trendValue="+1"
              color="success"
            />
            <KPICard
              title="Ausentismo"
              value={`${noShowPercentage}%`}
              subtitle="no se presentaron"
              icon="UserX"
              trend="down"
              trendValue="-2.1%"
              color="warning"
            />
            <KPICard
              title="Ingresos Diarios"
              value={dailyIncome?.toFixed(2)}
              subtitle="ingresos del día"
              icon="DollarSign"
              trend="up"
              trendValue="+18.4%"
              color="success"
              currency={true}
              vesValue={vesEquivalent}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - Appointments and Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              <AppointmentsList
                appointments={todaysAppointments}
                onCheckIn={(id) => handleAppointmentAction(id, 'checkin')}
                onReschedule={(id) => handleAppointmentAction(id, 'reschedule')}
                onCancel={(id) => handleAppointmentAction(id, 'cancel')}
              />
              
              <QuickActions userRole={userRole} />
            </div>

            {/* Right Column - Schedule and Patient Management */}
            <div className="space-y-6">
              <UpcomingSchedule schedule={upcomingSchedule} />
              <PatientManagementShortcuts />
            </div>
          </div>

          {/* Revenue Tracking */}
          <div className="mb-8">
            <RevenueTracking />
          </div>

          {/* Emergency Actions */}
          <div className="bg-error/5 border border-error/20 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-error" />
              </div>
              <div>
                <h3 className="font-semibold text-error">Acciones de Emergencia</h3>
                <p className="text-sm text-muted-foreground">Acceso rápido a funciones críticas</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                iconName="Phone"
                iconPosition="left"
                onClick={() => window.location.href = '/emergency-contacts'}
                fullWidth
              >
                Contactos de Emergencia
              </Button>
              <Button
                variant="outline"
                iconName="AlertCircle"
                iconPosition="left"
                onClick={() => window.location.href = '/emergency-protocols'}
                fullWidth
              >
                Protocolos de Emergencia
              </Button>
              <Button
                variant="outline"
                iconName="Ambulance"
                iconPosition="left"
                onClick={() => window.location.href = '/emergency-services'}
                fullWidth
              >
                Servicios de Emergencia
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalDashboard;