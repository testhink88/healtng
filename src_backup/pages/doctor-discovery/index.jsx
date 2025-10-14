import React, { useState, useEffect } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import SearchFilters from '@/components/SearchFilters';
import DoctorCard from '@/components/DoctorCard';
import ReviewModal from '@/components/ReviewModal';
import DoctorProfile from '@/components/DoctorProfile';

const DoctorDiscovery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    specialty: '',
    location: '',
    availability: '',
    insurance: '',
    sortBy: 'rating',
    licenseVerified: false,
    teleconsultation: false,
    minRating: 0,
    maxPrice: 1000
  });
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock doctors data
  const mockDoctors = [
    {
      id: 1,
      name: 'Carlos Mendoza',
      specialty: 'Cardiología',
      location: 'Caracas',
      rating: 4.8,
      reviewCount: 127,
      consultationFee: 85,
      photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
      availability: 'available_today',
      teleconsultation: true,
      licenseVerified: true,
      acceptsInsurance: true,
      nextAvailable: {
        date: '3 Sep 2025',
        time: '10:30 AM'
      },
      languages: ['Español', 'Inglés'],
      experience: 15,
      education: 'Universidad Central de Venezuela',
      phone: '+58 212-555-0123',
      clinicName: 'Centro Cardiológico Caracas',
      address: 'Av. Francisco de Miranda, Torre Médica, Piso 8',
      about: 'Especialista en cardiología con amplia experiencia en diagnóstico y tratamiento de enfermedades cardiovasculares. Enfoque en medicina preventiva y atención personalizada.',
      services: ['Electrocardiograma', 'Ecocardiograma', 'Holter 24h', 'Consulta preventiva']
    },
    {
      id: 2,
      name: 'Ana Rodríguez',
      specialty: 'Dermatología',
      location: 'Valencia',
      rating: 4.9,
      reviewCount: 89,
      consultationFee: 75,
      photo: 'https://images.unsplash.com/photo-1594824475317-d0d4e5e8b6b5?w=400&h=400&fit=crop&crop=face',
      availability: 'available_soon',
      teleconsultation: true,
      licenseVerified: true,
      acceptsInsurance: false,
      nextAvailable: {
        date: '4 Sep 2025',
        time: '2:00 PM'
      },
      languages: ['Español'],
      experience: 12,
      education: 'Universidad de Carabobo',
      phone: '+58 241-555-0456',
      clinicName: 'Clínica Dermatológica Valencia',
      address: 'Av. Bolívar Norte, Centro Médico Valencia'
    },
    {
      id: 3,
      name: 'Miguel Torres',
      specialty: 'Pediatría',
      location: 'Maracaibo',
      rating: 4.7,
      reviewCount: 156,
      consultationFee: 65,
      photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
      availability: 'available_today',
      teleconsultation: false,
      licenseVerified: true,
      acceptsInsurance: true,
      nextAvailable: {
        date: '3 Sep 2025',
        time: '4:00 PM'
      },
      languages: ['Español', 'Inglés'],
      experience: 18,
      education: 'Universidad del Zulia',
      phone: '+58 261-555-0789'
    },
    {
      id: 4,
      name: 'Carmen Silva',
      specialty: 'Ginecología',
      location: 'Caracas',
      rating: 4.6,
      reviewCount: 203,
      consultationFee: 90,
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
      availability: 'busy',
      teleconsultation: true,
      licenseVerified: true,
      acceptsInsurance: true,
      nextAvailable: {
        date: '6 Sep 2025',
        time: '9:00 AM'
      },
      languages: ['Español', 'Inglés', 'Francés'],
      experience: 20,
      education: 'Universidad Central de Venezuela',
      phone: '+58 212-555-0321'
    },
    {
      id: 5,
      name: 'Roberto Fernández',
      specialty: 'Neurología',
      location: 'Barquisimeto',
      rating: 4.5,
      reviewCount: 94,
      consultationFee: 95,
      photo: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face',
      availability: 'available_soon',
      teleconsultation: true,
      licenseVerified: false,
      acceptsInsurance: false,
      nextAvailable: {
        date: '5 Sep 2025',
        time: '11:00 AM'
      },
      languages: ['Español'],
      experience: 10,
      education: 'Universidad Centroccidental Lisandro Alvarado',
      phone: '+58 251-555-0654'
    },
    {
      id: 6,
      name: 'Elena Morales',
      specialty: 'Oftalmología',
      location: 'Maracay',
      rating: 4.8,
      reviewCount: 112,
      consultationFee: 80,
      photo: 'https://images.unsplash.com/photo-1594824475317-d0d4e5e8b6b5?w=400&h=400&fit=crop&crop=face',
      availability: 'available_today',
      teleconsultation: false,
      licenseVerified: true,
      acceptsInsurance: true,
      nextAvailable: {
        date: '3 Sep 2025',
        time: '1:30 PM'
      },
      languages: ['Español', 'Inglés'],
      experience: 14,
      education: 'Universidad de Carabobo',
      phone: '+58 243-555-0987'
    }
  ];

  // Mock reviews data
  const mockReviews = [
    {
      id: 1,
      patientName: 'María González',
      rating: 5,
      date: '15 Ago 2025',
      comment: 'Excelente atención, muy profesional y puntual. Las instalaciones están muy limpias y el doctor explicó todo detalladamente.',
      verified: true,
      visitType: 'Consulta general',
      waitTime: '15 minutos',
      helpfulVotes: 8
    },
    {
      id: 2,
      patientName: 'Carlos Rodríguez',
      rating: 4,
      date: '10 Ago 2025',
      comment: 'Buen médico, explicó todo muy claramente. Solo el tiempo de espera fue un poco largo, pero valió la pena.',
      verified: true,
      visitType: 'Consulta especializada',
      waitTime: '30 minutos',
      helpfulVotes: 5
    },
    {
      id: 3,
      patientName: 'Ana Martínez',
      rating: 5,
      date: '5 Ago 2025',
      comment: 'Muy recomendado. Diagnóstico acertado y tratamiento efectivo. El seguimiento post-consulta fue excelente.',
      verified: false,
      visitType: 'Teleconsulta',
      waitTime: '5 minutos',
      helpfulVotes: 12
    },
    {
      id: 4,
      patientName: 'José Pérez',
      rating: 4,
      date: '1 Ago 2025',
      comment: 'Profesional competente, instalaciones modernas. La recepcionista fue muy amable y el proceso fue eficiente.',
      verified: true,
      visitType: 'Consulta de control',
      waitTime: '20 minutos',
      helpfulVotes: 3
    },
    {
      id: 5,
      patientName: 'Luisa Herrera',
      rating: 5,
      date: '28 Jul 2025',
      comment: 'Increíble experiencia. El doctor se tomó el tiempo necesario para explicar mi condición y las opciones de tratamiento.',
      verified: true,
      visitType: 'Primera consulta',
      waitTime: '10 minutos',
      helpfulVotes: 15
    }
  ];

  // Filter and search logic
  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      let filtered = mockDoctors?.filter(doctor => {
        // Search query filter
        if (searchQuery && !doctor?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())) {
          return false;
        }

        // Specialty filter
        if (filters?.specialty && doctor?.specialty?.toLowerCase() !== filters?.specialty?.toLowerCase()) {
          return false;
        }

        // Location filter
        if (filters?.location && doctor?.location?.toLowerCase() !== filters?.location?.toLowerCase()) {
          return false;
        }

        // Availability filter
        if (filters?.availability) {
          if (filters?.availability === 'today' && doctor?.availability !== 'available_today') {
            return false;
          }
          if (filters?.availability === 'tomorrow' && doctor?.availability === 'busy') {
            return false;
          }
        }

        // Insurance filter
        if (filters?.insurance && filters?.insurance !== 'particular') {
          if (!doctor?.acceptsInsurance) {
            return false;
          }
        }

        // License verification filter
        if (filters?.licenseVerified && !doctor?.licenseVerified) {
          return false;
        }

        // Teleconsultation filter
        if (filters?.teleconsultation && !doctor?.teleconsultation) {
          return false;
        }

        // Rating filter
        if (doctor?.rating < filters?.minRating) {
          return false;
        }

        // Price filter
        if (doctor?.consultationFee > filters?.maxPrice) {
          return false;
        }

        return true;
      });

      // Sort results
      filtered?.sort((a, b) => {
        switch (filters?.sortBy) {
          case 'rating':
            return b?.rating - a?.rating;
          case 'price_low':
            return a?.consultationFee - b?.consultationFee;
          case 'price_high':
            return b?.consultationFee - a?.consultationFee;
          case 'availability':
            const availabilityOrder = { 'available_today': 0, 'available_soon': 1, 'busy': 2 };
            return availabilityOrder?.[a?.availability] - availabilityOrder?.[b?.availability];
          case 'distance':
            return a?.name?.localeCompare(b?.name); // Mock distance sort
          default:
            return 0;
        }
      });

      setFilteredDoctors(filtered);
      setIsLoading(false);
    }, 500);
  }, [searchQuery, filters]);

  const handleBookAppointment = (doctor, type = 'regular') => {
    console.log('Booking appointment with:', doctor?.name, 'Type:', type);
    // Navigate to appointment booking
    window.location.href = '/appointment-booking';
  };

  const handleViewProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setShowProfileModal(true);
  };

  const handleViewReviews = (doctor) => {
    setSelectedDoctor(doctor);
    setShowReviewModal(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({
      specialty: '',
      location: '',
      availability: '',
      insurance: '',
      sortBy: 'rating',
      licenseVerified: false,
      teleconsultation: false,
      minRating: 0,
      maxPrice: 1000
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        userRole="patient"
        isAuthenticated={true}
        onMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />
      {/* Sidebar */}
      <Sidebar
        userRole="patient"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-4 lg:p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <button 
                onClick={() => window.location.href = '/patient-dashboard'}
                className="hover:text-foreground transition-colors"
              >
                Inicio
              </button>
              <Icon name="ChevronRight" size={16} />
              <span className="text-foreground">Buscar médicos</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Buscar médicos</h1>
            <p className="text-muted-foreground">
              Encuentra y agenda citas con médicos especializados en tu área
            </p>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setIsMobileFiltersOpen(true)}
              iconName="Filter"
              iconPosition="left"
              className="w-full"
            >
              Filtros {Object.values(filters)?.filter(v => v !== '' && v !== false && v !== 0 && v !== 1000)?.length > 0 && 
                `(${Object.values(filters)?.filter(v => v !== '' && v !== false && v !== 0 && v !== 1000)?.length})`}
            </Button>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <SearchFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filters={filters}
              onFiltersChange={setFilters}
              resultCount={filteredDoctors?.length}
              onClearFilters={handleClearFilters}
              onClose={() => {}} // Add missing onClose prop
            />
          </div>

          {/* Mobile Filters */}
          <SearchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFiltersChange={setFilters}
            resultCount={filteredDoctors?.length}
            onClearFilters={handleClearFilters}
            isMobile={true}
            isOpen={isMobileFiltersOpen}
            onClose={() => setIsMobileFiltersOpen(false)}
          />

          {/* Results Section */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-foreground">
                {isLoading ? 'Buscando...' : `${filteredDoctors?.length} médicos encontrados`}
              </h2>
              {searchQuery && (
                <span className="text-sm text-muted-foreground">
                  para "{searchQuery}"
                </span>
              )}
            </div>

            {/* Quick Sort */}
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Ordenar:</span>
              <select
                value={filters?.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e?.target?.value }))}
                className="text-sm border border-border rounded px-2 py-1 bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="rating">Mejor calificación</option>
                <option value="price_low">Precio: menor a mayor</option>
                <option value="price_high">Precio: mayor a menor</option>
                <option value="availability">Disponibilidad</option>
                <option value="distance">Distancia</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)]?.map((_, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 bg-muted rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded mb-1 w-2/3"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results Grid */}
          {!isLoading && (
            <>
              {filteredDoctors?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDoctors?.map((doctor) => (
                    <DoctorCard
                      key={doctor?.id}
                      doctor={doctor}
                      onBookAppointment={handleBookAppointment}
                      onViewProfile={handleViewProfile}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon name="SearchX" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No se encontraron médicos
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Intenta ajustar tus filtros de búsqueda o busca con términos diferentes
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    iconName="RotateCcw"
                    iconPosition="left"
                  >
                    Limpiar filtros
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Load More Button */}
          {!isLoading && filteredDoctors?.length > 0 && filteredDoctors?.length >= 6 && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                iconName="ChevronDown"
                iconPosition="right"
              >
                Cargar más médicos
              </Button>
            </div>
          )}
        </div>
      </main>
      {/* Modals */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        doctor={selectedDoctor}
        reviews={mockReviews}
      />
      <DoctorProfile
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        doctor={selectedDoctor}
        onBookAppointment={handleBookAppointment}
      />
    </div>
  );
};

export default DoctorDiscovery;