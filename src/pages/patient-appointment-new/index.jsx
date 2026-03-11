import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Button from '@/components/ui/Button';
import Icon from '@/components/AppIcon';
import DoctorSearch from "@/pages/patient-appointment-new/components/DoctorSearch";
import DoctorCard from "@/pages/patient-appointment-new/components/DoctorCard";
import CalendarBooking from "@/pages/patient-appointment-new/components/CalendarBooking";
import BookingForm from "@/pages/patient-appointment-new/components/BookingForm";
import BookingConfirmation from "@/pages/patient-appointment-new/components/BookingConfirmation";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { createAppointment } from '@/api/appointments';

const NewPatientAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  
  // UI State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  
  // Booking Flow State
  const [currentStep, setCurrentStep] = useState('search'); 
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
  
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  // CARGAR DOCTORES DESDE SUPABASE
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'doctor');

        if (error) throw error;

        // Mapear perfiles a formato esperado por el componente DoctorCard
        const mapped = (data || []).map(p => ({
          id: p.id,
          name: p.full_name,
          photo: p.avatar_url || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
          specialty: p.metadata?.specialty_label || 'Medicina General',
          rating: 4.8, // Mock rating
          reviewCount: 0,
          location: p.metadata?.state || 'Sin ubicación',
          consultationFee: { usd: p.metadata?.consultationFee || 50, ves: 0 },
          acceptsInsurance: p.metadata?.acceptsInsurance || false,
          isOnline: true,
          nextAvailable: 'Consulta Horarios',
          languages: ['Español'],
          experience: p.metadata?.experience || 'Sin registro',
          education: p.metadata?.education || 'Sin registro',
          availability: {} // Real availability would come from another table
        }));

        setDoctors(mapped);
        setFilteredDoctors(mapped);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter logic
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
    setFilteredDoctors(filtered);
  }, [searchFilters, doctors]);

  const handleBookingConfirm = async (paymentData) => {
    if (!profile?.id) {
        alert("Debes iniciar sesión para agendar.");
        return;
    }
    setIsLoading(true);
    try {
      const payload = {
        patient_id: profile.id,
        professional_id: selectedDoctor.id,
        date: selectedDate,
        time: selectedTime,
        status: "pending", // Empezar en pendiente hasta pagar (simulado)
        patient_name: profile.full_name,
        professional_name: selectedDoctor.name,
        reason: bookingData?.reason || "Consulta",
        amount: selectedDoctor.consultationFee.usd,
        metadata: {
            ...bookingData,
            paymentMethod: paymentData?.paymentMethod
        }
      };

      await createAppointment(payload);
      
      // Navigate to payment processing (simulado)
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
      alert("Error al agendar.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepBack = () => {
    switch (currentStep) {
      case 'calendar': setCurrentStep('search'); setSelectedDoctor(null); break;
      case 'booking': setCurrentStep('calendar'); setSelectedDate(null); setSelectedTime(''); break;
      case 'confirmation': setCurrentStep('booking'); setBookingData(null); break;
      default: navigate('/patient-dashboard');
    }
  };

  const getStepProgress = () => {
    const steps = ['search', 'calendar', 'booking', 'confirmation'];
    return ((steps?.indexOf(currentStep) + 1) / steps?.length) * 100;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="patient" onMenuToggle={() => setIsMobileSidebarOpen(true)} />
      <Sidebar
        userRole="patient"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      <main className={`pt-16 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                {location?.state?.reschedule ? 'Reagendar Cita' : 'Nueva Cita Médica'}
              </h1>
              <p className="text-muted-foreground">Agenda una cita con el médico ideal en tiempo real</p>
            </div>
            <Button variant="ghost" onClick={() => navigate('/patient-dashboard')} iconName="ArrowLeft">
              Volver al dashboard
            </Button>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-muted-foreground">Progreso</div>
              <div className="text-sm font-medium text-primary">{Math.round(getStepProgress())}%</div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${getStepProgress()}%` }} />
            </div>
          </div>

          <div className="space-y-6">
            {currentStep === 'search' && (
              <>
                <DoctorSearch filters={searchFilters} onFiltersChange={f => setSearchFilters(prev => ({ ...prev, ...f }))} />
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-foreground">Médicos disponibles ({filteredDoctors?.length})</h2>
                  {loadingDoctors ? (
                    <div className="py-20 text-center"><Icon name="Loader2" className="animate-spin mx-auto text-primary" size={40} /></div>
                  ) : filteredDoctors?.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="UserX" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No se encontraron médicos</h3>
                      <Button variant="outline" onClick={() => setSearchFilters({ specialty: '', location: '', insuranceCompatible: false, appointmentType: '', availability: 'any', priceRange: { min: 0, max: 200 } })}>Limpiar filtros</Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {filteredDoctors?.map((doctor) => <DoctorCard key={doctor?.id} doctor={doctor} onSelect={d => { setSelectedDoctor(d); setCurrentStep('calendar'); }} />)}
                    </div>
                  )}
                </div>
              </>
            )}

            {currentStep === 'calendar' && selectedDoctor && (
              <CalendarBooking doctor={selectedDoctor} onDateTimeSelect={(d, t) => { setSelectedDate(d); setSelectedTime(t); setCurrentStep('booking'); }} onBack={handleStepBack} />
            )}

            {currentStep === 'booking' && selectedDoctor && selectedDate && selectedTime && (
              <BookingForm doctor={selectedDoctor} selectedDate={selectedDate} selectedTime={selectedTime} onSubmit={d => { setBookingData(d); setCurrentStep('confirmation'); }} onBack={handleStepBack} />
            )}

            {currentStep === 'confirmation' && bookingData && (
              <BookingConfirmation doctor={selectedDoctor} selectedDate={selectedDate} selectedTime={selectedTime} bookingData={bookingData} onConfirm={handleBookingConfirm} onBack={handleStepBack} isProcessing={isLoading} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewPatientAppointment;