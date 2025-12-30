import React, { useState, useEffect } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';

import BookingModal from '@/pages/space-reservation/components/BookingModal';
import CalendarView from '@/pages/space-reservation/components/CalendarView';
import SpaceCard from '@/pages/space-reservation/components/SpaceCard';
import SpaceDetailsModal from '@/pages/space-reservation/components/SpaceDetailsModal';
import SpaceFilters from '@/pages/space-reservation/components/SpaceFilters';

const SpaceReservation = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('spaces'); // 'spaces' | 'calendar'
  const [calendarView, setCalendarView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filters, setFilters] = useState({});
  const [spaces, setSpaces] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ------- Mock data: Spaces -------
  const mockSpaces = [
    {
      id: 1,
      name: "Consultorio Cardiología A",
      type: "Consultorio Especializado",
      capacity: 4,
      area: 25,
      pricePerHour: 45,
      minDuration: 1,
      status: "AVAILABLE",
      rating: 4.8,
      reviewCount: 24,
      clinic: {
        name: "Clínica Caracas",
        address: "Av. Francisco de Miranda, Caracas",
        phone: "+58 212 123 4567",
        rating: 4.7,
        reviewCount: 156
      },
      images: [
        "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=500",
        "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=500",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500"
      ],
      equipment: [
        "Electrocardiógrafo",
        "Monitor de Presión Arterial",
        "Estetoscopio Electrónico",
        "Desfibrilador",
        "Mesa de Examen",
        "Silla Médica"
      ],
      features: ["WiFi", "Aire Acondicionado", "Estacionamiento"],
      policies: {
        cancellation: "Cancelación gratuita hasta 24 horas antes",
        approval: "Aprobación automática"
      },
      nextAvailable: { date: "2025-09-03", time: "14:00" }
    },
    {
      id: 2,
      name: "Sala de Procedimientos B",
      type: "Sala de Procedimientos",
      capacity: 6,
      area: 35,
      pricePerHour: 75,
      minDuration: 2,
      status: "AVAILABLE",
      rating: 4.9,
      reviewCount: 18,
      clinic: {
        name: "Hospital Universitario",
        address: "Ciudad Universitaria, Caracas",
        phone: "+58 212 987 6543",
        rating: 4.8,
        reviewCount: 203
      },
      images: [
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500",
        "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=500"
      ],
      equipment: [
        "Mesa de Cirugía",
        "Lámpara Quirúrgica",
        "Monitor de Signos Vitales",
        "Equipo de Anestesia",
        "Aspirador Quirúrgico",
        "Electrocauterio"
      ],
      features: ["Aire Acondicionado", "Sistema de Ventilación", "Acceso 24/7"],
      policies: {
        cancellation: "Cancelación con 48 horas de anticipación",
        approval: "Requiere aprobación manual"
      },
      nextAvailable: { date: "2025-09-02", time: "09:00" }
    },
    {
      id: 3,
      name: "Consultorio Dermatología",
      type: "Consultorio Especializado",
      capacity: 3,
      area: 20,
      pricePerHour: 40,
      minDuration: 1,
      status: "BUSY",
      rating: 4.6,
      reviewCount: 31,
      clinic: {
        name: "Centro Médico Valencia",
        address: "Av. Bolívar Norte, Valencia",
        phone: "+58 241 456 7890",
        rating: 4.5,
        reviewCount: 89
      },
      images: [
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500",
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500"
      ],
      equipment: [
        "Dermatoscopio",
        "Lámpara de Wood",
        "Crioterapia",
        "Mesa de Examen",
        "Lupa con Luz",
        "Cámara Dermatológica"
      ],
      features: ["WiFi", "Aire Acondicionado"],
      policies: {
        cancellation: "Cancelación gratuita hasta 12 horas antes",
        approval: "Aprobación automática"
      },
      nextAvailable: { date: "2025-09-04", time: "11:30" }
    },
    {
      id: 4,
      name: "Laboratorio de Análisis",
      type: "Laboratorio",
      capacity: 8,
      area: 45,
      pricePerHour: 60,
      minDuration: 1,
      status: "AVAILABLE",
      rating: 4.7,
      reviewCount: 42,
      clinic: {
        name: "Clínica Maracaibo",
        address: "Av. 5 de Julio, Maracaibo",
        phone: "+58 261 234 5678",
        rating: 4.6,
        reviewCount: 134
      },
      images: [
        "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=500",
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500"
      ],
      equipment: [
        "Microscopio",
        "Centrífuga",
        "Analizador Hematológico",
        "Espectrofotómetro",
        "Refrigerador de Muestras",
        "Cabina de Bioseguridad"
      ],
      features: ["Sistema de Ventilación", "Refrigeración", "Acceso Controlado"],
      policies: {
        cancellation: "Cancelación con 24 horas de anticipación",
        approval: "Requiere aprobación manual"
      },
      nextAvailable: { date: "2025-09-02", time: "08:00" }
    },
    {
      id: 5,
      name: "Sala de Imágenes",
      type: "Sala de Imágenes",
      capacity: 5,
      area: 30,
      pricePerHour: 85,
      minDuration: 1,
      status: "AVAILABLE",
      rating: 4.9,
      reviewCount: 15,
      clinic: {
        name: "Hospital Militar",
        address: "Fuerte Tiuna, Caracas",
        phone: "+58 212 345 6789",
        rating: 4.8,
        reviewCount: 98
      },
      images: [
        "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500"
      ],
      equipment: [
        "Ecógrafo",
        "Rayos X Digital",
        "Mesa de Examen",
        "Monitor de Alta Resolución",
        "Sistema PACS",
        "Impresora de Placas"
      ],
      features: ["Blindaje Radiológico", "Aire Acondicionado", "Sistema de Respaldo"],
      policies: {
        cancellation: "Cancelación con 48 horas de anticipación",
        approval: "Aprobación automática"
      },
      nextAvailable: { date: "2025-09-02", time: "15:00" }
    },
    {
      id: 6,
      name: "Consultorio Pediatría",
      type: "Consultorio General",
      capacity: 4,
      area: 22,
      pricePerHour: 35,
      minDuration: 1,
      status: "MAINTENANCE",
      rating: 4.5,
      reviewCount: 28,
      clinic: {
        name: "Clínica Caracas",
        address: "Av. Francisco de Miranda, Caracas",
        phone: "+58 212 123 4567",
        rating: 4.7,
        reviewCount: 156
      },
      images: [
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500",
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500"
      ],
      equipment: [
        "Báscula Pediátrica",
        "Tallímetro",
        "Otoscopio",
        "Mesa de Examen Pediátrica",
        "Juguetes Médicos",
        "Termómetro Digital"
      ],
      features: ["Decoración Infantil", "WiFi", "Aire Acondicionado"],
      policies: {
        cancellation: "Cancelación gratuita hasta 24 horas antes",
        approval: "Aprobación automática"
      },
      nextAvailable: { date: "2025-09-05", time: "10:00" }
    }
  ];

  // ------- Mock data: Reservations -------
  const mockReservations = [
    {
      id: 1,
      spaceId: 1,
      spaceName: "Consultorio Cardiología A",
      clinicName: "Clínica Caracas",
      doctorName: "Carlos Mendoza",
      date: "2025-09-02",
      time: "10:00",
      duration: "2 horas",
      status: "APPROVED",
      patientName: "María González"
    },
    {
      id: 2,
      spaceId: 2,
      spaceName: "Sala de Procedimientos B",
      clinicName: "Hospital Universitario",
      doctorName: "Ana Rodríguez",
      date: "2025-09-02",
      time: "14:00",
      duration: "3 horas",
      status: "PENDING",
      patientName: "José Martínez"
    },
    {
      id: 3,
      spaceId: 4,
      spaceName: "Laboratorio de Análisis",
      clinicName: "Clínica Maracaibo",
      doctorName: "Luis García",
      date: "2025-09-03",
      time: "09:00",
      duration: "1 hora",
      status: "CHECKED_IN",
      patientName: "Carmen Silva"
    },
    {
      id: 4,
      spaceId: 1,
      spaceName: "Consultorio Cardiología A",
      clinicName: "Clínica Caracas",
      doctorName: "Elena Morales",
      date: "2025-09-04",
      time: "16:00",
      duration: "1.5 horas",
      status: "COMPLETED",
      patientName: "Roberto Díaz"
    }
  ];

  // ------- Init (simulate API) -------
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 800));
      setSpaces(mockSpaces);
      setReservations(mockReservations);
      setIsLoading(false);
    };
    load();
  }, []);

  // ------- Filters -------
  const filteredSpaces = spaces?.filter(space => {
    if (filters?.clinic && space?.clinic?.name?.toLowerCase() !== filters?.clinic?.toLowerCase()) return false;
    if (filters?.spaceType && space?.type?.toLowerCase() !== filters?.spaceType?.toLowerCase()) return false;
    if (filters?.equipment && !space?.equipment?.some(eq => eq?.toLowerCase()?.includes(filters?.equipment?.toLowerCase()))) return false;

    if (filters?.capacity) {
      if (filters.capacity === '10+') {
        if (space?.capacity < 10) return false;
      } else {
        const [min, max] = filters.capacity.split('-').map(n => parseInt(n, 10));
        if (Number.isFinite(min) && space.capacity < min) return false;
        if (Number.isFinite(max) && space.capacity > max) return false;
      }
    }

    if (filters?.minPrice && space?.pricePerHour < parseFloat(filters.minPrice)) return false;
    if (filters?.maxPrice && space?.pricePerHour > parseFloat(filters.maxPrice)) return false;

    if (filters?.availability === 'inmediata' && space?.status !== 'AVAILABLE') return false;

    if (filters?.quickFilter === 'disponible-ahora' && space?.status !== 'AVAILABLE') return false;
    if (filters?.quickFilter === 'mejor-calificado' && space?.rating < 4.8) return false;
    if (filters?.quickFilter === 'aprobacion-inmediata' && space?.policies?.approval !== 'Aprobación automática') return false;

    return true;
  });

  // ------- Handlers -------
  const handleFiltersChange = (newFilters) => setFilters(newFilters);
  const handleClearFilters = () => setFilters({});
  const handleBookSpace = (space) => { setSelectedSpace(space); setIsBookingModalOpen(true); };
  const handleViewDetails = (space) => { setSelectedSpace(space); setIsDetailsModalOpen(true); };

  const handleConfirmBooking = async (bookingData) => {
    await new Promise(r => setTimeout(r, 600));
    const newReservation = {
      id: reservations.length + 1,
      ...bookingData,
      doctorName: "Usuario Actual"
    };
    setReservations(prev => [...prev, newReservation]);
    setIsBookingModalOpen(false);
    alert(`Reserva ${bookingData?.status === 'APPROVED' ? 'confirmada' : 'solicitada'} exitosamente`);
  };

  const handleReservationClick = (reservation) => {
    console.log('Reservation clicked:', reservation);
  };

  const handleDateSelect = (date) => setSelectedDate(date);
  const handleViewChange = (view) => setCalendarView(view);

  // ------- Loading -------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header userRole="doctor" onMenuToggle={() => setIsMobileSidebarOpen(true)} />
        <Sidebar
          userRole="doctor"
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
        <main className={`pt-16 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="text-center">
              <div className="animate-pulse-slow mb-4">
                <Icon name="Calendar" size={48} className="mx-auto text-primary" />
              </div>
              <p className="text-lg text-muted-foreground">Cargando espacios disponibles...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ------- UI -------
  return (
    <div className="min-h-screen bg-background">
      <Header userRole="doctor" onMenuToggle={() => setIsMobileSidebarOpen(true)} />
      <Sidebar
        userRole="doctor"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <main className={`pt-16 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Reserva de Espacios</h1>
                <p className="text-muted-foreground">Encuentra y reserva espacios médicos para tus consultas y procedimientos</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={currentView === 'spaces' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentView('spaces')}
                  iconName="Grid3X3"
                  iconPosition="left"
                  iconSize={16}
                >
                  Espacios
                </Button>
                <Button
                  variant={currentView === 'calendar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentView('calendar')}
                  iconName="Calendar"
                  iconPosition="left"
                  iconSize={16}
                >
                  Calendario
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Building" size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Espacios Disponibles</p>
                    <p className="text-xl font-semibold text-foreground">
                      {filteredSpaces.filter(s => s.status === 'AVAILABLE').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon name="Calendar" size={20} className="text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mis Reservas</p>
                    <p className="text-xl font-semibold text-foreground">{reservations.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Icon name="Clock" size={20} className="text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pendientes</p>
                    <p className="text-xl font-semibold text-foreground">
                      {reservations.filter(r => r.status === 'PENDING').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Icon name="DollarSign" size={20} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Precio Promedio</p>
                    <p className="text-xl font-semibold text-foreground">
                      ${Math.round(spaces.reduce((acc, s) => acc + s.pricePerHour, 0) / (spaces.length || 1))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          {currentView === 'spaces' ? (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Filters */}
              <div className="xl:col-span-1">
                <SpaceFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                />
              </div>

              {/* Grid */}
              <div className="xl:col-span-3">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {filteredSpaces.length} espacio(s) encontrado(s)
                  </p>
                </div>

                {filteredSpaces.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron espacios</h3>
                    <p className="text-muted-foreground mb-4">Intenta ajustar los filtros de búsqueda</p>
                    <Button variant="outline" onClick={handleClearFilters}>Limpiar Filtros</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredSpaces.map(space => (
                      <SpaceCard
                        key={space.id}
                        space={space}
                        onBookSpace={handleBookSpace}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <CalendarView
                view={calendarView}
                onViewChange={handleViewChange}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                reservations={reservations}
                onReservationClick={handleReservationClick}
              />
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        space={selectedSpace}
        onConfirmBooking={handleConfirmBooking}
        selectedDate={selectedDate}
      />
      <SpaceDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        space={selectedSpace}
        onBookSpace={handleBookSpace}
      />
    </div>
  );
};

export default SpaceReservation;
