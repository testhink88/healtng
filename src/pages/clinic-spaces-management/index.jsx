import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Icon from '@/components/AppIcon';

// Mantenemos tus importaciones originales de componentes
import SpaceCard from "./components/SpaceCard";
import BookingDrawer from "./components/BookingDrawer";
import WeeklyCalendar from '@/pages/clinic-spaces-management/components/WeeklyCalendar';

import { 
  mockSpaces, 
  mockBookings as initialBookings, // Lo usamos como semilla inicial
  spaceTypes,
  spaceStatuses,
  filterSpaces,
  getTodaysBookings,
  getSpaceUtilization,
  formatCurrency,
  calculateBookingCost
} from '../../utils/spaces';

const ClinicSpacesManagement = () => {
  const navigate = useNavigate();
  const [userRole] = useState(localStorage.getItem('userRole') || 'clinic');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // ✅ Estado de datos sincronizado
  const [spaces, setSpaces] = useState(mockSpaces);
  const [filteredSpaces, setFilteredSpaces] = useState(mockSpaces);
  const [bookings, setBookings] = useState(initialBookings); // Estado dinámico para el calendario
  
  const [activeTab, setActiveTab] = useState('Lista'); 
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    setIsBookingDrawerOpen(false);
    setSelectedSpace(null);
  }, []);

  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  });

  const [kpiData, setKpiData] = useState({
    activeSpaces: 0,
    todayBookings: 0,
    weeklyOccupancy: 0,
    monthlyRevenue: 0
  });

  // Re-calculamos KPIs basándonos en el estado dinámico de 'bookings'
  useEffect(() => {
    const activeSpaces = spaces?.filter(space => space?.status === 'Disponible')?.length || 0;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayBookings = bookings?.filter(b => b.date === todayStr).length || 0;
    
    const today = new Date();
    const monthlyRevenue = bookings
      ?.filter(booking => {
        const bookingDate = new Date(booking?.date);
        return bookingDate?.getMonth() === today?.getMonth() && 
               bookingDate?.getFullYear() === today?.getFullYear() &&
               booking?.status !== 'cancelada';
      })
      ?.reduce((total, booking) => total + (booking?.totalCost || booking?.cost || 0), 0) || 0;

    setKpiData({
      activeSpaces,
      todayBookings,
      weeklyOccupancy: 72,
      monthlyRevenue
    });
  }, [spaces, bookings]);

  useEffect(() => {
    const filtered = filterSpaces(spaces, filters);
    setFilteredSpaces(filtered);
    setCurrentPage(1);
  }, [spaces, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', type: 'all', status: 'all', dateFrom: '', dateTo: '' });
  };

  // ✅ Handlers de reserva: Ahora abren el Drawer correctamente
  const handleBookSpace = (space) => {
    setSelectedSpace(space || spaces[0]);
    setIsBookingDrawerOpen(true);
  };

  const handleCloseBookingDrawer = () => {
    setIsBookingDrawerOpen(false);
    setSelectedSpace(null);
  };

  // ✅ Sincronización Real: Esta función conecta el Drawer con el Calendario
  const handleConfirmBooking = (bookingData) => {
    // Calculamos el costo usando la utilidad de spaces
    const cost = calculateBookingCost(selectedSpace.hourlyRate, bookingData.startTime, bookingData.endTime);
    
    const newBooking = {
      ...bookingData,
      id: `BK-${Date.now()}`,
      spaceId: selectedSpace.id,
      spaceName: selectedSpace.name,
      totalCost: cost,
      status: 'confirmada'
    };
    
    // Actualizamos el estado para que el calendario se re-renderice
    setBookings(prev => [...prev, newBooking]);
    handleCloseBookingDrawer();
  };

  const totalPages = Math.ceil(filteredSpaces?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSpaces = filteredSpaces?.slice(startIndex, startIndex + itemsPerPage);

  const KPICard = ({ title, value, subtitle, icon, variant = 'default' }) => {
    const tones = {
      success: 'bg-green-50 border-green-200',
      warning: 'bg-yellow-50 border-yellow-200',
      info: 'bg-blue-50 border-blue-200',
      default: 'bg-card border-border'
    };
    return (
      <div className={`p-6 rounded-xl border transition-colors ${tones[variant]}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Icon name={icon} size={24} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} onMenuToggle={() => setIsMobileSidebarOpen(true)} />
      <Sidebar
        userRole={userRole}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      
      <main className={`pt-16 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="p-6">
          <nav className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Button variant="ghost" size="sm" onClick={() => navigate('/clinic-dashboard')} className="p-0 h-auto font-normal">
                Panel Principal
              </Button>
              <Icon name="ChevronRight" size={16} />
              <span className="text-foreground font-medium">Gestión de Espacios</span>
            </div>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestión de Espacios</h1>
              <p className="text-muted-foreground mt-1">Administra espacios médicos y sus reservas</p>
            </div>
            <div className="flex items-center gap-3">
              {/* ✅ CORREGIDO: Abre el Drawer */}
              <Button onClick={() => handleBookSpace()} className="flex items-center gap-2">
                <Icon name="CalendarPlus" size={16} /> Nueva Reserva
              </Button>
              {/* ✅ Mantenemos tu botón de Publicar original */}
              <Button
                variant="outline"
                onClick={() => navigate('/clinic/spaces/new')}
                className="flex items-center gap-2"
              >
                <Icon name="Plus" size={16} /> Publicar Espacio
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard title="Espacios Activos" value={kpiData.activeSpaces} icon="Building" variant="success" />
            <KPICard title="Reservas Hoy" value={kpiData.todayBookings} icon="Calendar" variant="info" />
            <KPICard title="Ocupación Semanal" value={`${kpiData.weeklyOccupancy}%`} icon="BarChart3" variant="warning" />
            <KPICard title="Ingresos del Mes" value={formatCurrency(kpiData.monthlyRevenue)} icon="DollarSign" variant="success" />
          </div>

          {/* Filtros */}
          <div className="bg-card rounded-xl border border-border p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Input placeholder="Buscar espacio..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} className="lg:col-span-1" />
              <Select value={filters.type} onValueChange={(v) => handleFilterChange('type', v)}>
                <option value="all">Todos los tipos</option>
                {spaceTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </Select>
              <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
                <option value="all">Todos los estados</option>
                {spaceStatuses.map(status => <option key={status} value={status}>{status}</option>)}
              </Select>
              <Input type="date" value={filters.dateFrom} onChange={(e) => handleFilterChange('dateFrom', e.target.value)} />
              <Button variant="outline" onClick={clearFilters} className="gap-2">
                <Icon name="X" size={14} /> Limpiar
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6 w-fit">
            <Button variant={activeTab === 'Calendario' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveTab('Calendario')} className="gap-2">
              <Icon name="Calendar" size={16} /> Calendario
            </Button>
            <Button variant={activeTab === 'Lista' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveTab('Lista')} className="gap-2">
              <Icon name="List" size={16} /> Lista
            </Button>
          </div>

          {/* Content Dinámico */}
          {activeTab === 'Calendario' ? (
            <WeeklyCalendar 
              spaces={spaces} 
              bookings={bookings} 
              onSpaceReserve={handleBookSpace} 
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {currentSpaces.map(space => (
                <SpaceCard
                  key={space.id}
                  space={space}
                  onBook={() => handleBookSpace(space)}
                  onEdit={() => navigate(`/clinic/spaces/${space.id}/edit`)}
                  onTogglePublish={() => {
                    setSpaces(prev => prev.map(s => s.id === space.id ? { ...s, isPublished: !s.isPublished } : s));
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Drawer Sincronizado */}
      {isBookingDrawerOpen && (
        <BookingDrawer
          isOpen
          onClose={handleCloseBookingDrawer}
          space={selectedSpace}
          existingBookings={bookings}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};

export default ClinicSpacesManagement;