import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// ---- (flujo paciente - originales) ----
import DoctorSummary from '@/pages/appointment-booking/components/DoctorSummary';
import CalendarWidget from '@/pages/appointment-booking/components/CalendarWidget';
import BookingForm from '@/pages/appointment-booking/components/BookingForm';
import InsuranceVerification from '@/pages/appointment-booking/components/InsuranceVerification';
import BookingConfirmation from '@/pages/appointment-booking/components/BookingConfirmation';

// ---- (chrome de app) ----
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';


// util
const todayISO = () => new Date().toISOString().slice(0, 10);

// modal liviano inline
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 left-0 top-0 bottom-0 m-auto max-w-lg w-full h-fit bg-card border border-border rounded-xl shadow-xl">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><Icon name="X" size={18} /></Button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const AppointmentBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ====== ROL (decide qué UI mostrar) ======
  const [userRole] = useState(() => localStorage.getItem('userRole') || 'doctor');
  const isProfessional = ['doctor', 'specialist', 'clinic_admin', 'professional', 'clinic'].includes(userRole);

  // ====== Chrome (layout) ======
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // ====== DATOS DOCTOR (flujo paciente) ======
  const [selectedDoctor] = useState(() => {
    return location?.state?.doctor || {
      id: 'dr-carlos-mendoza',
      name: 'Carlos Mendoza',
      specialty: 'Cardiología',
      photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
      rating: 4.8,
      reviewCount: 127,
      location: 'Caracas, Venezuela',
      consultationFee: 85,
      acceptsInsurance: true,
      isOnline: true,
      nextAvailable: 'Hoy 2:00 PM',
      languages: ['Español', 'Inglés'],
      experience: '15 años de experiencia',
      education: 'Universidad Central de Venezuela'
    };
  });

  // ====== ---------- FLUJO PACIENTE (original) ---------- ======
  const [currentStep, setCurrentStep] = useState('booking'); // 'booking', 'confirmation'
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingData, setBookingData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [insuranceVerification, setInsuranceVerification] = useState(null);

  const [patientInfo] = useState({
    name: 'María González',
    phone: '+58 412 123 4567',
    email: 'maria.gonzalez@email.com',
    emergencyContact: '+58 414 987 6543',
    allergies: 'Penicilina',
    medications: 'Losartán 50mg'
  });

  const [availableSlots] = useState(() => {
    const slots = {};
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      const daySlots = [];
      for (let hour = 9; hour < 12; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          daySlots.push({ time, available: Math.random() > 0.3, type: Math.random() > 0.5 ? 'in-person' : 'teleconsultation' });
        }
      }
      for (let hour = 14; hour < 18; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          daySlots.push({ time, available: Math.random() > 0.3, type: Math.random() > 0.5 ? 'in-person' : 'teleconsultation' });
        }
      }
      slots[dateKey] = daySlots;
    }
    return slots;
  });

  const handleDateSelect = (date) => { setSelectedDate(date); setSelectedTime(''); };
  const handleTimeSelect = (time) => setSelectedTime(time);
  const handleBookingSubmit = (formData) => { setBookingData(formData); setCurrentStep('confirmation'); };
  const handleInsuranceVerification = (verificationResult) => setInsuranceVerification(verificationResult);

  const calculateTotalAmount = () => {
    if (!bookingData) return selectedDoctor.consultationFee;
    let total = selectedDoctor.consultationFee;
    if (bookingData?.urgencyLevel === 'urgent') total += selectedDoctor.consultationFee * 0.5;
    if (bookingData?.hasInsurance && insuranceVerification?.status === 'verified') total *= 0.8;
    return total;
  };

  const handleConfirmBooking = async (confirmationData) => {
    setIsProcessing(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      navigate('/payment-processing', {
        state: {
          type: 'appointment',
          amount: calculateTotalAmount(),
          paymentMethod: confirmationData?.paymentMethod,
          appointmentDetails: { doctor: selectedDoctor, date: selectedDate, time: selectedTime, ...bookingData }
        }
      });
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  const handleCancelBooking = () => { setCurrentStep('booking'); setBookingData(null); };
  const handleBackToSearch = () => navigate('/doctor-discovery');

  // ====== ---------- FLUJO PROFESIONAL (agenda del día) ---------- ======
  const [patients, setPatients] = useState([
    { id: 'p-100', name: 'Luis Contreras', dni: 'V-15.234.567', phone: '+58 412-5551122', type: 'followup' },
    { id: 'p-101', name: 'Elena Méndez', dni: 'V-18.987.654', phone: '+58 414-5552200', type: 'followup' },
    { id: 'p-102', name: 'María González', dni: 'V-12.345.678', phone: '+58 416-5553301', type: 'new' }
  ]);

  const [appointments, setAppointments] = useState([
    { id: 'a-1', date: todayISO(), time: '09:00', reason: 'Control neurológico', status: 'confirmada', patientId: 'p-100' },
    { id: 'a-2', date: todayISO(), time: '10:00', reason: 'Control post-operatorio', status: 'confirmada', patientId: 'p-101' },
    { id: 'a-3', date: todayISO(), time: '11:30', reason: 'Primera consulta', status: 'pendiente', patientId: 'p-102' }
  ]);

  const [search, setSearch] = useState('');
  const rows = useMemo(() => {
    const joined = appointments
      .filter(a => a.date === todayISO())
      .map(a => ({ ...a, patient: patients.find(p => p.id === a.patientId) }))
      .filter(r =>
        r.patient?.name.toLowerCase().includes(search.toLowerCase()) ||
        r.reason.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => a.time.localeCompare(b.time));
    return joined;
  }, [appointments, patients, search]);

  const handleCheckIn = (id) => setAppointments(prev => prev.map(a => (a.id === id ? { ...a, status: 'en_espera' } : a)));

  // crear paciente
  const [newPatientOpen, setNewPatientOpen] = useState(false);
  const handleCreatePatient = (data) => {
    const id = `p-${Date.now()}`;
    const newP = { id, name: data.name, dni: data.dni || '', phone: data.phone || '', type: 'new' };
    setPatients(prev => [...prev, newP]);
    setNewPatientOpen(false);
    // abrir diálogo de nueva cita con paciente precargado
    setNewAppointmentOpen(true);
    setPendingAppointment(prev => ({ ...prev, patientId: id }));
  };

  // crear cita
  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);
  const [pendingAppointment, setPendingAppointment] = useState({ patientId: '', date: todayISO(), time: '', reason: '' });
  const handleCreateAppointment = () => {
    if (!pendingAppointment.patientId || !pendingAppointment.time || !pendingAppointment.reason) return;
    const id = `a-${Date.now()}`;
    setAppointments(prev => [
      ...prev,
      { id, date: pendingAppointment.date, time: pendingAppointment.time, reason: pendingAppointment.reason, status: 'confirmada', patientId: pendingAppointment.patientId }
    ]);
    setPendingAppointment({ patientId: '', date: todayISO(), time: '', reason: '' });
    setNewAppointmentOpen(false);
  };

  // asegurar contexto profesional para detalles menores
  useEffect(() => {
    if (isProfessional) localStorage.setItem('marketplace_mode', 'b2b');
  }, [isProfessional]);

  // ====== RENDER ======
  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
      <Sidebar
        userRole={userRole}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {!isProfessional ? (
            // ------------------ PACIENTE (original) ------------------
            <div className="container mx-auto px-0 py-0 max-w-6xl">
              <DoctorSummary doctor={selectedDoctor} onBackClick={() => navigate('/doctor-discovery')} />

              {currentStep === 'booking' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CalendarWidget
                    selectedDate={selectedDate}
                    onDateSelect={date => { setSelectedDate(date); setSelectedTime(''); }}
                    selectedTime={selectedTime}
                    onTimeSelect={setSelectedTime}
                    availableSlots={availableSlots}
                  />
                  <div className="space-y-6">
                    <BookingForm
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      doctor={selectedDoctor}
                      onSubmit={handleBookingSubmit}
                      isLoading={isProcessing}
                      patientInfo={patientInfo}
                    />
                  </div>
                </div>
              )}

              {currentStep === 'confirmation' && bookingData && (
                <div className="max-w-4xl mx-auto">
                  {bookingData?.hasInsurance && (
                    <InsuranceVerification
                      insuranceProvider={bookingData?.insuranceProvider}
                      policyNumber={bookingData?.policyNumber}
                      doctorId={selectedDoctor?.id}
                      appointmentType={bookingData?.appointmentType}
                      onVerificationComplete={setInsuranceVerification}
                    />
                  )}
                  <BookingConfirmation
                    appointmentData={bookingData}
                    doctor={selectedDoctor}
                    totalAmount={calculateTotalAmount()}
                    onConfirm={handleConfirmBooking}
                    onCancel={handleCancelBooking}
                    isProcessing={isProcessing}
                  />
                </div>
              )}
            </div>
          ) : (
            // ------------------ PROFESIONAL (agenda del día) ------------------
            <>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Agenda de Citas</h1>
                  <p className="text-muted-foreground">Citas del día, check-in, ficha del paciente y agendamiento rápido.</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setNewPatientOpen(true)}>
                    <Icon name="UserPlus" size={16} className="mr-2" />
                    Crear Paciente
                  </Button>
                  <Button variant="default" onClick={() => setNewAppointmentOpen(true)}>
                    <Icon name="CalendarPlus" size={16} className="mr-2" />
                    Nueva Cita
                  </Button>
                </div>
              </div>

              <div className="mb-4 flex items-center gap-3">
                <div className="relative flex-1 max-w-xl">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por paciente o motivo…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="ghost" onClick={() => setSearch('')}>Limpiar</Button>
              </div>

              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="text-left px-4 py-3">Hora</th>
                      <th className="text-left px-4 py-3">Paciente</th>
                      <th className="text-left px-4 py-3">Tipo</th>
                      <th className="text-left px-4 py-3">Motivo</th>
                      <th className="text-left px-4 py-3">Estado</th>
                      <th className="text-left px-4 py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(row => (
                      <tr key={row.id} className="border-t border-border">
                        <td className="px-4 py-3 font-medium">{row.time}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground">{row.patient?.name}</div>
                          <div className="text-xs text-muted-foreground">{row.patient?.dni} · {row.patient?.phone}</div>
                        </td>
                        <td className="px-4 py-3">
                          {row.patient?.type === 'new'
                            ? <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Nuevo</span>
                            : <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">Seguimiento</span>}
                        </td>
                        <td className="px-4 py-3">{row.reason}</td>
                        <td className="px-4 py-3">
                          {row.status === 'confirmada' && <span className="bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded">Confirmada</span>}
                          {row.status === 'pendiente' && <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Pendiente</span>}
                          {row.status === 'en_espera' && <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">En espera</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleCheckIn(row.id)}>Check-in</Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/patients/${row.patientId}`)}>Ver Ficha</Button>
                            <Button variant="ghost" size="sm" onClick={() => { setNewAppointmentOpen(true); setPendingAppointment(prev => ({ ...prev, patientId: row.patientId })); }}>Reagendar</Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/prescriptions/new')}>Receta</Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/diagnosis/new')}>Diagnóstico</Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/referrals/new')}>Derivar</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {rows.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No hay citas para hoy.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Modales Profesional */}
              <Modal open={newAppointmentOpen} onClose={() => setNewAppointmentOpen(false)} title="Agendar nueva cita">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Paciente</label>
                  <select
                    className="w-full px-3 py-2 border border-border rounded-md"
                    value={pendingAppointment.patientId}
                    onChange={(e) => setPendingAppointment(prev => ({ ...prev, patientId: e.target.value }))}
                  >
                    <option value="">Selecciona un paciente…</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name} · {p.dni}</option>)}
                  </select>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Fecha</label>
                      <Input type="date" value={pendingAppointment.date} onChange={(e) => setPendingAppointment(prev => ({ ...prev, date: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Hora</label>
                      <Input type="time" value={pendingAppointment.time} onChange={(e) => setPendingAppointment(prev => ({ ...prev, time: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Motivo</label>
                    <Input value={pendingAppointment.reason} onChange={(e) => setPendingAppointment(prev => ({ ...prev, reason: e.target.value }))} placeholder="Motivo de consulta" />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" onClick={() => setNewAppointmentOpen(false)}>Cancelar</Button>
                    <Button variant="default" onClick={handleCreateAppointment}>Guardar</Button>
                  </div>
                </div>
              </Modal>

              <Modal open={newPatientOpen} onClose={() => setNewPatientOpen(false)} title="Crear paciente">
                <NewPatientForm onCreate={handleCreatePatient} />
              </Modal>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

const NewPatientForm = ({ onCreate }) => {
  const [form, setForm] = useState({ name: '', dni: '', phone: '' });
  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">Nombre y Apellido</label>
        <Input value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Ej. Ana Pérez" />
      </div>
      <div>
        <label className="text-sm font-medium">Documento</label>
        <Input value={form.dni} onChange={(e) => setForm(prev => ({ ...prev, dni: e.target.value }))} placeholder="V-xx.xxx.xxx" />
      </div>
      <div>
        <label className="text-sm font-medium">Teléfono</label>
        <Input value={form.phone} onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))} placeholder="+58 xxx-xxxxxxx" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="default" onClick={() => onCreate(form)}>Crear</Button>
      </div>
    </div>
  );
};

export default AppointmentBooking;
