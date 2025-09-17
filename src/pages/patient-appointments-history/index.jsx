import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';


import Icon from '../../components/AppIcon';
import SearchFilters from './components/SearchFilters';
import AppointmentCard from './components/AppointmentCard';
import ExportModal from './components/ExportModal';
import AppointmentDetailsModal from './components/AppointmentDetailsModal';

const PatientAppointmentsHistory = () => {
  const navigate = useNavigate();
  
  // UI State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data State
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  
  // Filter State
  const [filters, setFilters] = useState({
    searchTerm: '',
    dateRange: { start: '', end: '' },
    specialty: '',
    appointmentType: '',
    status: '',
    doctor: ''
  });
  
  // Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Mock appointment data
  useEffect(() => {
    const mockAppointments = [
      {
        id: 'apt-001',
        date: '2024-01-15',
        time: '10:00',
        doctor: {
          id: 'dr-001',
          name: 'Dr. Carlos Mendoza',
          photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
          specialty: 'Cardiología'
        },
        type: 'in-person',
        status: 'completed',
        fee: 85,
        location: 'Clínica Santa María',
        reason: 'Control cardiológico rutinario',
        visitSummary: 'Paciente presenta mejoría en presión arterial. Se recomienda continuar con medicación actual.',
        medications: ['Losartán 50mg', 'Atorvastatina 20mg'],
        followUpInstructions: 'Control en 3 meses. Mantener dieta baja en sodio.',
        documents: [
          { name: 'Electrocardiograma.pdf', url: '#', type: 'pdf' },
          { name: 'Resultados_laboratorio.pdf', url: '#', type: 'pdf' }
        ]
      },
      {
        id: 'apt-002',
        date: '2024-01-08',
        time: '14:30',
        doctor: {
          id: 'dr-002',
          name: 'Dra. Elena Rodríguez',
          photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
          specialty: 'Dermatología'
        },
        type: 'teleconsultation',
        status: 'completed',
        fee: 60,
        location: 'Teleconsulta',
        reason: 'Revisión de tratamiento dermatológico',
        visitSummary: 'Buena respuesta al tratamiento. Lesiones cutáneas han mejorado significativamente.',
        medications: ['Tretinina 0.025%', 'Hidrocortisona tópica'],
        followUpInstructions: 'Aplicar cremas según indicaciones. Próxima cita en 6 semanas.',
        documents: [
          { name: 'Fotos_seguimiento.jpg', url: '#', type: 'image' }
        ]
      },
      {
        id: 'apt-003',
        date: '2023-12-20',
        time: '09:15',
        doctor: {
          id: 'dr-003',
          name: 'Dr. Miguel Torres',
          photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
          specialty: 'Neurología'
        },
        type: 'in-person',
        status: 'cancelled',
        fee: 90,
        location: 'Hospital Universitario',
        reason: 'Consulta por cefaleas frecuentes',
        visitSummary: null,
        medications: [],
        followUpInstructions: null,
        documents: []
      },
      {
        id: 'apt-004',
        date: '2023-12-15',
        time: '16:00',
        doctor: {
          id: 'dr-004',
          name: 'Dra. Ana Morales',
          photo: 'https://images.unsplash.com/photo-1594824154-6de435d10aba?w=400&h=400&fit=crop&crop=face',
          specialty: 'Ginecología'
        },
        type: 'in-person',
        status: 'no-show',
        fee: 75,
        location: 'Centro Médico Integral',
        reason: 'Control ginecológico anual',
        visitSummary: null,
        medications: [],
        followUpInstructions: null,
        documents: []
      }
    ];

    setTimeout(() => {
      setAppointments(mockAppointments);
      setFilteredAppointments(mockAppointments);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter appointments based on current filters
  useEffect(() => {
    let filtered = [...appointments];

    // Search term filter
    if (filters?.searchTerm) {
      const searchLower = filters?.searchTerm?.toLowerCase();
      filtered = filtered?.filter(apt => 
        apt?.doctor?.name?.toLowerCase()?.includes(searchLower) ||
        apt?.reason?.toLowerCase()?.includes(searchLower) ||
        apt?.location?.toLowerCase()?.includes(searchLower)
      );
    }

    // Date range filter
    if (filters?.dateRange?.start) {
      filtered = filtered?.filter(apt => apt?.date >= filters?.dateRange?.start);
    }
    if (filters?.dateRange?.end) {
      filtered = filtered?.filter(apt => apt?.date <= filters?.dateRange?.end);
    }

    // Specialty filter
    if (filters?.specialty) {
      filtered = filtered?.filter(apt => apt?.doctor?.specialty === filters?.specialty);
    }

    // Appointment type filter
    if (filters?.appointmentType) {
      filtered = filtered?.filter(apt => apt?.type === filters?.appointmentType);
    }

    // Status filter
    if (filters?.status) {
      filtered = filtered?.filter(apt => apt?.status === filters?.status);
    }

    // Sort by date (newest first)
    filtered?.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredAppointments(filtered);
  }, [appointments, filters]);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: '',
      dateRange: { start: '', end: '' },
      specialty: '',
      appointmentType: '',
      status: '',
      doctor: ''
    });
  };

  const handleAppointmentAction = (action, appointmentId) => {
    const appointment = appointments?.find(apt => apt?.id === appointmentId);
    
    switch (action) {
      case 'view':
        setSelectedAppointment(appointment);
        setIsDetailsModalOpen(true);
        break;
      case 'reschedule': navigate('/new-patient-appointment', { 
          state: { 
            reschedule: true, 
            originalAppointment: appointment 
          } 
        });
        break;
      case 'message':
        // Implement messaging functionality
        console.log('Message doctor for appointment:', appointmentId);
        break;
      case 'refill':
        // Navigate to prescription refill
        console.log('Request prescription refill for appointment:', appointmentId);
        break;
      default:
        break;
    }
  };

  const handleExport = (format, data) => {
    console.log(`Exporting ${data?.length} appointments as ${format}`);
    // Implement actual export functionality here
    setIsExportModalOpen(false);
  };

  const getAppointmentStats = () => {
    const total = appointments?.length;
    const completed = appointments?.filter(apt => apt?.status === 'completed')?.length;
    const cancelled = appointments?.filter(apt => apt?.status === 'cancelled')?.length;
    const noShow = appointments?.filter(apt => apt?.status === 'no-show')?.length;
    const totalSpent = appointments?.filter(apt => apt?.status === 'completed')?.reduce((sum, apt) => sum + apt?.fee, 0);

    return { total, completed, cancelled, noShow, totalSpent };
  };

  const stats = getAppointmentStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <div className="w-16 h-16 bg-primary rounded-full mx-auto flex items-center justify-center">
              <Icon name="Calendar" size={32} className="text-primary-foreground" />
            </div>
          </div>
          <p className="text-muted-foreground">Cargando historial de citas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        userRole="patient"
        isAuthenticated={true}
        onMenuToggle={handleMobileSidebarToggle}
      />
      {/* Sidebar */}
      <Sidebar
        userRole="patient"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleSidebarToggle}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={handleMobileSidebarClose}
      />
      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Historial de Citas
              </h1>
              <p className="text-muted-foreground">
                Accede a tu historial completo de citas médicas
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => setIsExportModalOpen(true)}
                iconName="Download"
                className="flex-1 lg:flex-none"
              >
                Exportar
              </Button>
              <Button
                onClick={() => navigate('/new-patient-appointment')}
                iconName="Plus"
                className="flex-1 lg:flex-none"
              >
                Nueva Cita
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Calendar" size={16} className="text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Total</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats?.total}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-sm font-medium text-muted-foreground">Completadas</span>
              </div>
              <p className="text-2xl font-bold text-success">{stats?.completed}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="XCircle" size={16} className="text-error" />
                <span className="text-sm font-medium text-muted-foreground">Canceladas</span>
              </div>
              <p className="text-2xl font-bold text-error">{stats?.cancelled}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="AlertCircle" size={16} className="text-warning" />
                <span className="text-sm font-medium text-muted-foreground">No asistió</span>
              </div>
              <p className="text-2xl font-bold text-warning">{stats?.noShow}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="DollarSign" size={16} className="text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Total gastado</span>
              </div>
              <p className="text-2xl font-bold text-foreground">${stats?.totalSpent}</p>
            </div>
          </div>

          {/* Search and Filters */}
          <SearchFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            className="mb-6"
          />

          {/* Results Section */}
          <div className="bg-card rounded-xl border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Resultados ({filteredAppointments?.length})
                </h2>
                {filteredAppointments?.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Filter" size={16} />
                    Ordenado por fecha (más reciente primero)
                  </div>
                )}
              </div>
            </div>

            {/* Appointments List */}
            <div className="divide-y divide-border">
              {filteredAppointments?.length === 0 ? (
                <div className="p-12 text-center">
                  <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No se encontraron citas
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {filters?.searchTerm || filters?.specialty || filters?.status
                      ? 'Intenta ajustar los filtros para ver más resultados.'
                      : 'Aún no tienes citas médicas registradas.'}
                  </p>
                  {!filters?.searchTerm && !filters?.specialty && !filters?.status && (
                    <Button
                      onClick={() => navigate('/new-patient-appointment')}
                      iconName="Plus"
                    >
                      Agendar primera cita
                    </Button>
                  )}
                </div>
              ) : (
                filteredAppointments?.map((appointment) => (
                  <AppointmentCard
                    key={appointment?.id}
                    appointment={appointment}
                    onAction={handleAppointmentAction}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        appointments={filteredAppointments}
        onExport={handleExport}
      />
      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        appointment={selectedAppointment}
        onAction={handleAppointmentAction}
      />
    </div>
  );
};

export default PatientAppointmentsHistory;