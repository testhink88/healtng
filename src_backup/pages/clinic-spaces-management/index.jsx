import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Icon from '@/components/AppIcon';
import SpaceCard from '@/components/SpaceCard';
import BookingDrawer from '@/components/BookingDrawer';
import { 
  mockSpaces, 
  mockBookings,
  spaceTypes,
  spaceStatuses,
  filterSpaces,
  getTodaysBookings,
  getSpaceUtilization,
  formatCurrency
} from '../../utils/spaces';

const ClinicSpacesManagement = () => {
  const navigate = useNavigate();
  const [userRole] = useState(localStorage.getItem('userRole') || 'clinic');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // State management
  const [spaces, setSpaces] = useState(mockSpaces);
  const [filteredSpaces, setFilteredSpaces] = useState(mockSpaces);
  const [activeTab, setActiveTab] = useState('Lista'); // 'Calendario' | 'Lista'
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // 👉 Asegurar que tras refresh el drawer quede cerrado
  useEffect(() => {
    setIsBookingDrawerOpen(false);
    setSelectedSpace(null);
  }, []);

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  });

  // KPIs state
  const [kpiData, setKpiData] = useState({
    activeSpaces: 0,
    todayBookings: 0,
    weeklyOccupancy: 0,
    monthlyRevenue: 0
  });

  // Calculate KPIs
  useEffect(() => {
    const activeSpaces = spaces?.filter(space => space?.status === 'Disponible')?.length || 0;
    const todayBookings = getTodaysBookings()?.length || 0;
    
    // Calculate weekly occupancy (mock calculation)
    const today = new Date();
    const weekStart = new Date(today);
    weekStart?.setDate(today?.getDate() - today?.getDay());
    const weekEnd = new Date(today);
    weekEnd?.setDate(today?.getDate() + (6 - today?.getDay()));
    
    const weeklyOccupancy = Math.round(
      spaces?.reduce((total, space) => {
        return total + getSpaceUtilization(space?.id, weekStart?.toISOString()?.split('T')?.[0], weekEnd?.toISOString()?.split('T')?.[0]);
      }, 0) / spaces?.length || 0
    );

    // Calculate monthly revenue (mock calculation)
    const monthlyRevenue = mockBookings
      ?.filter(booking => {
        const bookingDate = new Date(booking?.date);
        return bookingDate?.getMonth() === today?.getMonth() && 
               bookingDate?.getFullYear() === today?.getFullYear() &&
               booking?.status !== 'cancelada';
      })
      ?.reduce((total, booking) => total + (booking?.totalCost || 0), 0) || 0;

    setKpiData({
      activeSpaces,
      todayBookings,
      weeklyOccupancy,
      monthlyRevenue
    });
  }, [spaces]);

  // Apply filters
  useEffect(() => {
    const filtered = filterSpaces(spaces, filters);
    setFilteredSpaces(filtered);
    setCurrentPage(1);
  }, [spaces, filters]);

  // Filter handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      status: 'all',
      dateFrom: '',
      dateTo: ''
    });
  };

  // Booking handlers
  const handleBookSpace = (space) => {
    setSelectedSpace(space);
    setIsBookingDrawerOpen(true);
  };

  const handleCloseBookingDrawer = () => {
    setIsBookingDrawerOpen(false);
    setSelectedSpace(null);
  };

  // Pagination
  const totalPages = Math.ceil(filteredSpaces?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSpaces = filteredSpaces?.slice(startIndex, endIndex);

  // KPI Card Component
  const KPICard = ({ title, value, subtitle, icon, variant = 'default' }) => {
    const getVariantClasses = () => {
      switch (variant) {
        case 'success':
          return 'bg-green-50 border-green-200';
        case 'warning':
          return 'bg-yellow-50 border-yellow-200';
        case 'info':
          return 'bg-blue-50 border-blue-200';
        default:
          return 'bg-card border-border';
      }
    };

    return (
      <div className={`p-6 rounded-xl border transition-colors ${getVariantClasses()}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className="p-3 rounded-full bg-primary/10">
            <Icon name={icon} size={24} className="text-primary" />
          </div>
        </div>
      </div>
    );
  };

  // Calendar Week View Component (simplified)
  const CalendarWeekView = () => {
    const today = new Date();
    const weekDays = [];
    
    // Generate week days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date?.setDate(today?.getDate() - today?.getDay() + i);
      weekDays?.push(date);
    }

    const timeSlots = [];
    for (let hour = 8; hour <= 20; hour++) {
      timeSlots?.push(`${hour?.toString()?.padStart(2, '0')}:00`);
    }

    const getDayBookings = (date) => {
      const dateStr = date?.toISOString()?.split('T')?.[0];
      return mockBookings?.filter(booking => 
        booking?.date === dateStr && booking?.status !== 'cancelada'
      ) || [];
    };

    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Vista Semanal</h3>
          <p className="text-sm text-muted-foreground">Ocupación de espacios por día</p>
        </div>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-8 min-w-[800px]">
            {/* Header */}
            <div className="p-3 border-r border-border bg-muted/50">
              <span className="text-sm font-medium text-muted-foreground">Hora</span>
            </div>
            {weekDays?.map((date, index) => (
              <div key={index} className="p-3 border-r border-border bg-muted/50 text-center">
                <div className="text-sm font-medium text-foreground">
                  {date?.toLocaleDateString('es-ES', { weekday: 'short' })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {date?.getDate()}/{date?.getMonth() + 1}
                </div>
              </div>
            ))}
            
            {/* Time slots */}
            {timeSlots?.map((time, timeIndex) => (
              <React.Fragment key={timeIndex}>
                <div className="p-2 border-r border-b border-border bg-muted/30">
                  <span className="text-xs font-medium text-muted-foreground">{time}</span>
                </div>
                {weekDays?.map((date, dayIndex) => {
                  const dayBookings = getDayBookings(date);
                  const hourBookings = dayBookings?.filter(booking => {
                    const startHour = parseInt(booking?.startTime?.split(':')?.[0]);
                    const currentHour = parseInt(time?.split(':')?.[0]);
                    const endHour = parseInt(booking?.endTime?.split(':')?.[0]);
                    return currentHour >= startHour && currentHour < endHour;
                  });

                  return (
                    <div 
                      key={dayIndex} 
                      className="p-2 border-r border-b border-border min-h-[40px] relative"
                    >
                      {hourBookings?.map((booking, bookingIndex) => (
                        <div
                          key={bookingIndex}
                          className="absolute inset-1 bg-primary/20 border border-primary/40 rounded text-xs p-1 cursor-pointer hover:bg-primary/30"
                          title={`${booking?.spaceName} - ${booking?.professional}`}
                        >
                          <div className="truncate font-medium">{booking?.spaceName}</div>
                          <div className="truncate">{booking?.professional}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole={userRole}
        onMenuToggle={() => setIsMobileSidebarOpen(true)}
      />
      <Sidebar
        userRole={userRole}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-6">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/clinic-dashboard')}
                className="p-0 h-auto font-normal hover:text-foreground"
              >
                Panel Principal
              </Button>
              <Icon name="ChevronRight" size={16} />
              <span className="text-foreground font-medium">Gestión de Espacios</span>
            </div>
          </nav>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestión de Espacios</h1>
              <p className="text-muted-foreground mt-1">
                Administra espacios médicos y sus reservas
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/clinic/spaces/booking/new')}
                className="flex items-center gap-2"
              >
                <Icon name="CalendarPlus" size={16} />
                Nueva Reserva
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/clinic/spaces/new')}
                className="flex items-center gap-2"
              >
                <Icon name="Plus" size={16} />
                Publicar Espacio
              </Button>
            </div>
          </div>

          {/* KPIs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="Espacios Activos"
              value={kpiData?.activeSpaces}
              subtitle="Disponibles para reserva"
              icon="Building"
              variant="success"
            />
            <KPICard
              title="Reservas Hoy"
              value={kpiData?.todayBookings}
              subtitle="Confirmadas para hoy"
              icon="Calendar"
              variant="info"
            />
            <KPICard
              title="Ocupación Semanal"
              value={`${kpiData?.weeklyOccupancy}%`}
              subtitle="Promedio de la semana"
              icon="BarChart3"
              variant="warning"
            />
            <KPICard
              title="Ingresos del Mes"
              value={formatCurrency(kpiData?.monthlyRevenue)}
              subtitle="Por alquiler de espacios"
              icon="DollarSign"
              variant="success"
            />
          </div>

          {/* Filters */}
          <div className="bg-card rounded-xl border border-border p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div>
                <Input
                  placeholder="Buscar espacio o ID..."
                  value={filters?.search}
                  onChange={(e) => handleFilterChange('search', e?.target?.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <Select
                  value={filters?.type}
                  onValueChange={(value) => handleFilterChange('type', value)}
                >
                  <option value="all">Todos los tipos</option>
                  {spaceTypes?.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Select
                  value={filters?.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <option value="all">Todos los estados</option>
                  {spaceStatuses?.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Input
                  type="date"
                  placeholder="Desde"
                  value={filters?.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
                />
              </div>

              <div>
                <Input
                  type="date"
                  placeholder="Hasta"
                  value={filters?.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <Icon name="X" size={14} />
                Limpiar Filtros
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6 w-fit">
            <Button
              variant={activeTab === 'Calendario' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('Calendario')}
              className="flex items-center gap-2"
            >
              <Icon name="Calendar" size={16} />
              Calendario
            </Button>
            <Button
              variant={activeTab === 'Lista' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('Lista')}
              className="flex items-center gap-2"
            >
              <Icon name="List" size={16} />
              Lista
            </Button>
          </div>

          {/* Content */}
          {activeTab === 'Calendario' ? (
            <CalendarWeekView />
          ) : (
            <div>
              {/* Spaces List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {currentSpaces?.map(space => (
                  <SpaceCard
                    key={space?.id}
                    space={space}
                    onBook={() => handleBookSpace(space)}
                    onEdit={() => navigate(`/clinic/spaces/${space?.id}/edit`)}
                    onTogglePublish={() => {
                      // Mock toggle publish functionality
                      setSpaces(prev => prev?.map(s => 
                        s?.id === space?.id 
                          ? { ...s, isPublished: !s?.isPublished }
                          : s
                      ));
                    }}
                  />
                ))}
              </div>

              {/* Empty State */}
              {filteredSpaces?.length === 0 && (
                <div className="text-center py-12">
                  <Icon name="Building" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No se encontraron espacios
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    No hay espacios que coincidan con los filtros seleccionados.
                  </p>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="mr-3"
                  >
                    Limpiar Filtros
                  </Button>
                  <Button onClick={() => navigate('/clinic/spaces/new')}>
                    Publicar Nuevo Espacio
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <Icon name="ChevronLeft" size={16} />
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)?.map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <Icon name="ChevronRight" size={16} />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* 👉 Render condicional: si no está abierto, NO se monta nada */}
      {isBookingDrawerOpen && (
        <BookingDrawer
          isOpen
          onClose={handleCloseBookingDrawer}
          space={selectedSpace}
          existingBookings={mockBookings}
          onConfirm={(bookingData) => {
            console.log('Booking confirmed:', bookingData);
            handleCloseBookingDrawer();
          }}
        />
      )}
    </div>
  );
};

export default ClinicSpacesManagement;
