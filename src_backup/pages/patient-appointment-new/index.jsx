import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Button from '@/components/ui/Button';
import Icon from '@/components/AppIcon';
import DoctorSearch from '@/components/DoctorSearch';
import DoctorCard from '@/components/DoctorCard';
import CalendarBooking from '@/components/CalendarBooking';
import BookingForm from '@/components/BookingForm';
import BookingConfirmation from '@/components/BookingConfirmation';

const NewPatientAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // UI State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Booking Flow State
  const [currentStep, setCurrentStep] = useState('search'); // 'search', 'calendar', 'booking', 'confirmation'
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingData, setBookingData] = useState(null);
  
  // Search State
  const [searchFilters, setSearchFilters] = useState({
    specialty: '',
    location: '',
    insuranceCompatible: false,
    appointmentType: '',
    availability: 'any',
    priceRange: { min: 0, max: 200 }
  });
  
  // Mock doctors data
  const [doctors] = useState([
    {
      id: 'dr-001',
      name: 'Dr. Carlos Mendoza',
      photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
      specialty: 'Cardiología',
      rating: 4.8,
      reviewCount: 127,
      location: 'Caracas, Venezuela',
      consultationFee: { usd: 85, ves: 31.28 },
      acceptsInsurance: true,
      isOnline: true,
      nextAvailable: 'Hoy 2:00 PM',
      languages: ['Español', 'Inglés'],
      experience: '15 años de experiencia',
      education: 'Universidad Central de Venezuela',
      availability: {
        '2024-01-20': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        '2024-01-21': ['09:30', '10:30', '15:00', '16:30'],
        '2024-01-22': ['09:00', '11:00', '14:30', '15:30', '17:00']
      }
    },
    {
      id: 'dr-002',
      name: 'Dra. Elena Rodríguez',
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
      specialty: 'Dermatología',
      rating: 4.9,
      reviewCount: 89,
      location: 'Maracaibo, Venezuela',
      consultationFee: { usd: 60, ves: 22.08 },
      acceptsInsurance: true,
      isOnline: true,
      nextAvailable: 'Mañana 9:00 AM',
      languages: ['Español'],
      experience: '12 años de experiencia',
      education: 'Universidad del Zulia',
      availability: {
        '2024-01-20': ['09:00', '10:00', '15:00', '16:00'],
        '2024-01-21': ['09:00', '10:00', '11:00', '14:00', '15:00'],
        '2024-01-22': ['10:00', '11:00', '16:00', '17:00']
      }
    },
    {
      id: 'dr-003',
      name: 'Dr. Miguel Torres',
      photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
      specialty: 'Neurología',
      rating: 4.7,
      reviewCount: 156,
      location: 'Valencia, Venezuela',
      consultationFee: { usd: 90, ves: 33.12 },
      acceptsInsurance: false,
      isOnline: true,
      nextAvailable: 'En 2 días 10:00 AM',
      languages: ['Español', 'Inglés', 'Francés'],
      experience: '18 años de experiencia',
      education: 'Universidad de Carabobo',
      availability: {
        '2024-01-22': ['09:00', '10:00', '14:00', '15:00'],
        '2024-01-23': ['09:30', '11:00', '15:30', '16:30'],
        '2024-01-24': ['10:00', '14:00', '16:00', '17:00']
      }
    }
  ]);
  
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);
  
  // Check if this is a reschedule from appointment history
  useEffect(() => {
    const rescheduleData = location?.state?.reschedule;
    const originalAppointment = location?.state?.originalAppointment;
    
    if (rescheduleData && originalAppointment) {
      // Pre-select the same doctor for rescheduling
      const doctor = doctors?.find(d => d?.id === originalAppointment?.doctor?.id);
      if (doctor) {
        setSelectedDoctor(doctor);
        setCurrentStep('calendar');
      }
    }
  }, [location?.state, doctors]);
  
  // Filter doctors based on search criteria
  useEffect(() => {
    let filtered = [...doctors];
    
    if (searchFilters?.specialty) {
      filtered = filtered?.filter(doctor => 
        doctor?.specialty?.toLowerCase()?.includes(searchFilters?.specialty?.toLowerCase())
      );
    }
    
    if (searchFilters?.location) {
      filtered = filtered?.filter(doctor =>
        doctor?.location?.toLowerCase()?.includes(searchFilters?.location?.toLowerCase())
      );
    }
    
    if (searchFilters?.insuranceCompatible) {
      filtered = filtered?.filter(doctor => doctor?.acceptsInsurance);
    }
    
    if (searchFilters?.priceRange?.min > 0 || searchFilters?.priceRange?.max < 200) {
      filtered = filtered?.filter(doctor => 
        doctor?.consultationFee?.usd >= searchFilters?.priceRange?.min &&
        doctor?.consultationFee?.usd <= searchFilters?.priceRange?.max
      );
    }
    
    // Sort by rating (highest first)
    filtered?.sort((a, b) => b?.rating - a?.rating);
    
    setFilteredDoctors(filtered);
  }, [searchFilters, doctors]);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

  const handleSearchFiltersChange = (newFilters) => {
    setSearchFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep('calendar');
  };

  const handleDateTimeSelect = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setCurrentStep('booking');
  };

  const handleBookingSubmit = (formData) => {
    setBookingData(formData);
    setCurrentStep('confirmation');
  };

  const handleBookingConfirm = async (paymentData) => {
    setIsLoading(true);
    
    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to payment processing
      navigate('/payment-processing', {
        state: {
          type: 'appointment',
          amount: selectedDoctor?.consultationFee?.usd || 0,
          paymentMethod: paymentData?.paymentMethod,
          appointmentDetails: {
            doctor: selectedDoctor,
            date: selectedDate,
            time: selectedTime,
            ...bookingData
          }
        }
      });
    } catch (error) {
      console.error('Booking error:', error);
      setIsLoading(false);
    }
  };

  const handleStepBack = () => {
    switch (currentStep) {
      case 'calendar': setCurrentStep('search');
        setSelectedDoctor(null);
        break;
      case 'booking': setCurrentStep('calendar');
        setSelectedDate(null);
        setSelectedTime('');
        break;
      case 'confirmation': setCurrentStep('booking');
        setBookingData(null);
        break;
      default:
        navigate('/patient-dashboard');
    }
  };

  const getStepProgress = () => {
    const steps = ['search', 'calendar', 'booking', 'confirmation'];
    return ((steps?.indexOf(currentStep) + 1) / steps?.length) * 100;
  };

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
                {location?.state?.reschedule ? 'Reagendar Cita' : 'Nueva Cita Médica'}
              </h1>
              <p className="text-muted-foreground">
                {location?.state?.reschedule 
                  ? 'Selecciona una nueva fecha y hora para tu cita' :'Encuentra y agenda una cita con el médico ideal para ti'
                }
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/patient-dashboard')}
              iconName="ArrowLeft"
            >
              Volver al dashboard
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-muted-foreground">
                Progreso de agendamiento
              </div>
              <div className="text-sm font-medium text-primary">
                {Math.round(getStepProgress())}%
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${getStepProgress()}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="space-y-6">
            {/* Step 1: Doctor Search */}
            {currentStep === 'search' && (
              <>
                {/* Search Filters */}
                <DoctorSearch
                  filters={searchFilters}
                  onFiltersChange={handleSearchFiltersChange}
                />

                {/* Doctor Results */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">
                      Médicos disponibles ({filteredDoctors?.length})
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Star" size={16} />
                      Ordenado por calificación
                    </div>
                  </div>

                  {filteredDoctors?.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="UserX" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        No se encontraron médicos
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Intenta ajustar los filtros para ver más resultados.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setSearchFilters({
                          specialty: '',
                          location: '',
                          insuranceCompatible: false,
                          appointmentType: '',
                          availability: 'any',
                          priceRange: { min: 0, max: 200 }
                        })}
                      >
                        Limpiar filtros
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {filteredDoctors?.map((doctor) => (
                        <DoctorCard
                          key={doctor?.id}
                          doctor={doctor}
                          onSelect={handleDoctorSelect}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Step 2: Calendar & Time Selection */}
            {currentStep === 'calendar' && selectedDoctor && (
              <CalendarBooking
                doctor={selectedDoctor}
                onDateTimeSelect={handleDateTimeSelect}
                onBack={handleStepBack}
              />
            )}

            {/* Step 3: Booking Form */}
            {currentStep === 'booking' && selectedDoctor && selectedDate && selectedTime && (
              <BookingForm
                doctor={selectedDoctor}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSubmit={handleBookingSubmit}
                onBack={handleStepBack}
              />
            )}

            {/* Step 4: Booking Confirmation */}
            {currentStep === 'confirmation' && bookingData && (
              <BookingConfirmation
                doctor={selectedDoctor}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                bookingData={bookingData}
                onConfirm={handleBookingConfirm}
                onBack={handleStepBack}
                isProcessing={isLoading}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewPatientAppointment;