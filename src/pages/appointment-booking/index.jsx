import React, { useEffect, useMemo, useRef, useState } from 'react';
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
const money = (n = 0) =>
  new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);

/* ===================== HELPERS ===================== */
const startOfWeek = (d) => {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // lunes=0
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
};
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const fmtDayShort = (d) =>
  d.toLocaleDateString('es-VE', { weekday: 'short', day: '2-digit', month: 'short' }).replace('.', '');
const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const fmtTime = (h) => `${String(h).padStart(2, '0')}:00`;
const toDateKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const hourStr = (h) => `${String(h).padStart(2, '0')}:00`;

/* ===================== ESTILOS / MAPAS ===================== */
const STATUS_STYLES = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  confirmed: 'bg-primary/10 text-primary border-primary/20',
  attended: 'bg-success/10 text-success border-success/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20 line-through',
};

// Color de FONDO de la celda (según estado dominante)
const CELL_BG_BY_STATUS = {
  confirmed: 'bg-blue-100',   // azul
  attended:  'bg-blue-100',   // tratamos atendida como confirmada para el tinte
  pending:   'bg-yellow-100', // amarillo
  cancelled: 'bg-red-100',    // rojo
};

// Badge de pago
const PAY_BADGE = (method) => {
  if (method === 'cash') return 'bg-amber-100 text-amber-800 border-amber-200';
  if (method === 'pos') return 'bg-indigo-100 text-indigo-800 border-indigo-200';
  if (method === 'transfer') return 'bg-cyan-100 text-cyan-800 border-cyan-200';
  if (method === 'zelle') return 'bg-violet-100 text-violet-800 border-violet-200';
  return 'bg-muted text-muted-foreground border-border';
};

/* ===================== COMPONENTE PRINCIPAL ===================== */
const AppointmentBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ====== ROL ======
  const [userRole] = useState(() => localStorage.getItem('userRole') || 'doctor');
  const isProfessional = ['doctor', 'specialist', 'clinic_admin', 'professional', 'clinic'].includes(userRole);

  // ====== Chrome ======
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // ====== Doctor (flujo paciente) ======
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
      education: 'Universidad Central de Venezuela',
    };
  });

  // ====== Flujo Paciente original ======
  const [currentStep, setCurrentStep] = useState('booking');
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
    medications: 'Losartán 50mg',
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
          daySlots.push({
            time,
            available: Math.random() > 0.3,
            type: Math.random() > 0.5 ? 'in-person' : 'teleconsultation',
          });
        }
      }
      for (let hour = 14; hour < 18; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          daySlots.push({
            time,
            available: Math.random() > 0.3,
            type: Math.random() > 0.5 ? 'in-person' : 'teleconsultation',
          });
        }
      }
      slots[dateKey] = daySlots;
    }
    return slots;
  });

  const handleBookingSubmit = (formData) => {
    setBookingData(formData);
    setCurrentStep('confirmation');
  };
  const calculateTotalAmount = () => {
    if (!bookingData) return selectedDoctor.consultationFee;
    let total = selectedDoctor.consultationFee;
    if (bookingData?.hasInsurance && insuranceVerification?.status === 'verified') total *= 0.8;
    return total;
  };
  const handleConfirmBooking = async (confirmationData) => {
    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      navigate('/payment-processing', {
        state: {
          type: 'appointment',
          amount: calculateTotalAmount(),
          paymentMethod: confirmationData?.paymentMethod,
          appointmentDetails: { doctor: selectedDoctor, date: selectedDate, time: selectedTime, ...bookingData },
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };
  const handleCancelBooking = () => {
    setCurrentStep('booking');
    setBookingData(null);
  };

  /* ===================== PROFESIONAL (Agenda) ===================== */
  const [viewMode, setViewMode] = useState('calendar');
  const [weekRef, setWeekRef] = useState(startOfWeek(new Date()));
  const [selectedDay, setSelectedDay] = useState(new Date());

  // Config de agenda por profesional
  const pros = [
    {
      id: 'prof1',
      name: 'Dr. Carlos Mendoza',
      specialty: 'Cardiología',
      validated: true,
      available: true,
      workHours: { start: 8, lunch: [12, 14], end: 18 }, // 08-12 y 14-18
      closedWeekdays: [0], // 0=Domingo
      blockedSlots: {
        // ejemplo: '2025-08-27': ['11:00', '16:00']
      },
    },
  ];

  const [selectedPro] = useState(pros[0].id);

  // Pacientes (mock)
  const [patients, setPatients] = useState([
    { id: 'p-1', name: 'Juan Pérez', phone: '+58 412-1112233' },
    { id: 'p-2', name: 'María López', phone: '+58 424-2223344' },
    { id: 'p-3', name: 'Ana Martínez', phone: '+58 414-3334455' },
    { id: 'p-4', name: 'Carlos Rodríguez', phone: '+58 416-7778899' },
    { id: 'p-5', name: 'Carmen Silva', phone: '+58 426-2223344' },
    { id: 'p-6', name: 'Luis Romero', phone: '+58 416-9997788' },
    { id: 'p-7', name: 'Sofía Ramírez', phone: '+58 412-3331122' },
    { id: 'p-8', name: 'Ignacio Mendoza', phone: '+58 424-2228899' },
    { id: 'p-9', name: 'Patricia Salazar', phone: '+58 416-1122334' },
    { id: 'p-10', name: 'Roberto Fernández', phone: '+58 426-7788991' },
    { id: 'p-11', name: 'Elena Martínez', phone: '+58 416-6655443' },
    { id: 'p-12', name: 'Javier Rojas', phone: '+58 412-9988776' },
  ]);

  // Citas (mock base)
  const [proAppointments, setProAppointments] = useState([
    {
      id: 'apt-1',
      date: todayISO(),
      time: '10:00',
      duration: 30,
      status: 'confirmed',
      professionalId: 'prof1',
      patient: { id: 'p-1', name: 'Juan Pérez', phone: '+58 412-1112233' },
      reason: 'Consulta Cardiológica',
      payMethod: 'cash',
      amount: 20,
      commissionPct: 0.1,
      commission: 2,
    },
  ]);

  /* ---------- SEED: más citas por cada semana (solo calendario) --------- */
  const seedRandom = (seed) => {
    let x = Math.sin(seed) * 10000;
    return () => {
      x = Math.sin(x) * 10000;
      return x - Math.floor(x);
    };
  };

  const generateWeekAppointments = (weekStart) => {
    const rnd = seedRandom(Number(weekStart));
    const out = [];
    const hours = [9, 10, 11, 14, 15, 16, 17];
    const reasons = ['Consulta', 'Teleconsulta', 'Seguimiento', 'Control', 'Procedimiento'];
    const statusPool = ['confirmed', 'pending', 'confirmed', 'confirmed', 'cancelled', 'attended'];
    const methods = ['cash', 'pos', 'transfer', 'zelle'];

    for (let d = 0; d < 7; d++) {
      const dayObj = addDays(weekStart, d);
      if (dayObj.getDay() === 0) continue; // domingo cerrado
      const dk = toDateKey(dayObj);

      hours.forEach((h) => {
        if (rnd() < 0.6) {
          const p = patients[Math.floor(rnd() * patients.length)];
          const status = statusPool[Math.floor(rnd() * statusPool.length)];
          const amount = status === 'cancelled' ? 0 : [15, 20, 25, 30, 35, 40, 45, 50][Math.floor(rnd() * 8)];
          const payMethod = status === 'cancelled' ? 'none' : methods[Math.floor(rnd() * methods.length)];
          const id = `seed-${dk}-${h}-${p.id}`;

          out.push({
            id,
            date: dk,
            time: hourStr(h),
            duration: 30,
            status,
            professionalId: 'prof1',
            patient: { id: p.id, name: p.name, phone: p.phone },
            reason: reasons[Math.floor(rnd() * reasons.length)],
            payMethod,
            amount,
            commissionPct: 0.1,
            commission: amount * 0.1,
          });
        }
      });
    }
    return out;
  };

  // añade (sin borrar las existentes) las citas de la semana visible
  useEffect(() => {
    const generated = generateWeekAppointments(weekRef);
    setProAppointments((prev) => {
      const existing = new Set(prev.map((a) => a.id));
      const merged = [...prev];
      generated.forEach((a) => {
        if (!existing.has(a.id)) merged.push(a);
      });
      return merged.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekRef]);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekRef, i)), [weekRef]);
  const goPrevWeek = () => setWeekRef((d) => addDays(d, -7));
  const goNextWeek = () => setWeekRef((d) => addDays(d, +7));

  const rightPanelApts = useMemo(() => {
    const key = toDateKey(selectedDay);
    return proAppointments
      .filter((a) => a.date === key && a.professionalId === selectedPro)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDay, proAppointments, selectedPro]);

  // -------- Disponibilidad por celda (día/hora)
  const proCfg = pros[0];
  const isCellAvailable = (dObj, h) => {
    const weekday = dObj.getDay();
    if (proCfg.closedWeekdays.includes(weekday)) return false; // día cerrado

    const { start, lunch, end } = proCfg.workHours;
    const inMorning = h >= start && h < lunch[0];
    const inAfternoon = h >= lunch[1] && h < end;
    if (!inMorning && !inAfternoon) return false;

    const dk = toDateKey(dObj);
    const hh = hourStr(h);
    if (proCfg.blockedSlots[dk]?.includes(hh)) return false;

    // Importante: las canceladas NO bloquean
    const overlap = proAppointments.some(
      (a) => a.professionalId === selectedPro && a.date === dk && a.time === hh && a.status !== 'cancelled'
    );
    if (overlap) return false;

    return true;
  };

  // citas por celda
  const aptsByDayHour = (dayObj, hour) => {
    const dk = toDateKey(dayObj);
    const hh = hourStr(hour);
    return proAppointments.filter((a) => a.date === dk && a.time === hh && a.professionalId === selectedPro);
  };

  // Estado dominante de la celda para colorear fondo
  const getCellStatusTint = (items) => {
    if (!items || items.length === 0) return '';
    // prioridad: confirmadas/atendidas > pendientes > canceladas
    const hasConfirmed = items.some((i) => i.status === 'confirmed' || i.status === 'attended');
    if (hasConfirmed) return CELL_BG_BY_STATUS.confirmed;
    const hasPending = items.some((i) => i.status === 'pending');
    if (hasPending) return CELL_BG_BY_STATUS.pending;
    const hasCancelled = items.some((i) => i.status === 'cancelled');
    if (hasCancelled) return CELL_BG_BY_STATUS.cancelled;
    return '';
  };

  /* ====== Auto-scroll al horario actual ====== */
  const gridRef = useRef(null);
  const scrollToCurrentHour = () => {
    if (!gridRef.current) return;
    const nowHour = new Date().getHours(); // 0..23
    const rows = gridRef.current.children; // cada fila = 1 hora
    if (!rows || !rows.length) return;
    const target = rows[Math.min(nowHour, rows.length - 1)];
    if (target) {
      const y = target.offsetTop - 40; // margen superior
      gridRef.current.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };
  useEffect(() => {
    scrollToCurrentHour();
  }, [weekRef]);

  /* ===================== MODAL NUEVA CITA ===================== */
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [modalForm, setModalForm] = useState({
    patientId: '',
    isNewPatient: false,
    newPatientName: '',
    newPatientPhone: '',
    reason: '',
    date: '',
    time: '',
    duration: 30,
    payMethod: 'none',
    amount: 0,
    commissionPct: 0.1,
    status: 'confirmed',
  });

  const openNewAppointment = () => {
    setModalForm((f) => ({
      ...f,
      patientId: '',
      isNewPatient: false,
      newPatientName: '',
      newPatientPhone: '',
      reason: '',
      date: toDateKey(new Date()),
      time: '',
      duration: 30,
      payMethod: 'none',
      amount: 0,
      commissionPct: 0.1,
      status: 'confirmed',
    }));
    setIsNewAppointmentOpen(true);
    setTimeout(scrollToCurrentHour, 0);
  };

  const openFromGrid = (dateObj, hour) => {
    if (!isCellAvailable(dateObj, hour)) return;
    setSelectedDay(dateObj);
    setModalForm({
      patientId: '',
      isNewPatient: false,
      newPatientName: '',
      newPatientPhone: '',
      reason: '',
      date: toDateKey(dateObj),
      time: hourStr(hour),
      duration: 30,
      payMethod: 'none',
      amount: 0,
      commissionPct: 0.1,
      status: 'confirmed',
    });
    setIsNewAppointmentOpen(true);
  };

  const saveAppointment = () => {
    let patientId = modalForm.patientId;
    let patientName = '';
    let patientPhone = '';

    if (modalForm.isNewPatient) {
      const newId = `p-${Date.now()}`;
      const newP = {
        id: newId,
        name: modalForm.newPatientName.trim() || 'Paciente',
        phone: modalForm.newPatientPhone.trim(),
      };
      setPatients((prev) => [...prev, newP]);
      patientId = newId;
      patientName = newP.name;
      patientPhone = newP.phone;
    } else {
      const p = patients.find((x) => x.id === modalForm.patientId);
      patientName = p?.name || 'Paciente';
      patientPhone = p?.phone || '';
    }

    const commission = (Number(modalForm.amount) || 0) * (Number(modalForm.commissionPct) || 0);

    const newApt = {
      id: `apt-${Date.now()}`,
      date: modalForm.date,
      time: modalForm.time || '08:00',
      duration: Number(modalForm.duration) || 30,
      status: modalForm.status,
      professionalId: selectedPro,
      patient: { id: patientId, name: patientName, phone: patientPhone },
      reason: modalForm.reason || 'Consulta',
      payMethod: modalForm.payMethod,
      amount: Number(modalForm.amount) || 0,
      commissionPct: Number(modalForm.commissionPct) || 0,
      commission,
    };

    setProAppointments((prev) => [...prev, newApt]);
    setIsNewAppointmentOpen(false);
  };

  /* ===================== KPIs / ESTADÍSTICAS ===================== */
  const kpisWeek = useMemo(() => {
    const startKey = toDateKey(weekRef);
    const endKey = toDateKey(addDays(weekRef, 6));
    const inWeek = proAppointments.filter(
      (a) => a.date >= startKey && a.date <= endKey && a.professionalId === selectedPro
    );

    const totals = {
      total: inWeek.length,
      pending: inWeek.filter((x) => x.status === 'pending').length,
      confirmed: inWeek.filter((x) => x.status === 'confirmed').length,
      attended: inWeek.filter((x) => x.status === 'attended').length,
      cancelled: inWeek.filter((x) => x.status === 'cancelled').length,
      income: inWeek.reduce((s, x) => s + (x.amount || 0), 0),
      fee: inWeek.reduce((s, x) => s + (x.commission || 0), 0),
    };

    // capacidad semanal (8h/día * 7 columnas de calendario)
    const capacityPerDay =
      (pros[0].workHours.lunch[0] - pros[0].workHours.start) +
      (pros[0].workHours.end - pros[0].workHours.lunch[1]); // 4 + 4 = 8
    const capacitySlots = capacityPerDay * 7;

    const serviced = totals.confirmed + totals.attended;
    const occupancyPct = capacitySlots ? Math.min(100, Math.round((serviced / capacitySlots) * 100)) : 0;
    const cancelRate = totals.total ? Math.round((totals.cancelled / totals.total) * 100) : 0;
    const avgTicket = serviced > 0 ? totals.income / serviced : 0;

    const byDay = Array.from({ length: 7 }, (_, i) => {
      const dk = toDateKey(addDays(weekRef, i));
      const items = inWeek.filter((a) => a.date === dk);
      return {
        dateKey: dk,
        count: items.length,
        income: items.reduce((s, x) => s + (x.amount || 0), 0),
        fee: items.reduce((s, x) => s + (x.commission || 0), 0),
      };
    });

    return { totals: { ...totals, occupancyPct, cancelRate, avgTicket }, byDay };
  }, [proAppointments, selectedPro, weekRef]);

  /* ===================== RENDER ===================== */
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
            // -------- PACIENTE --------
            <div className="container mx-auto px-0 py-0 max-w-6xl">
              <DoctorSummary doctor={selectedDoctor} onBackClick={() => navigate('/doctor-discovery')} />

              {currentStep === 'booking' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CalendarWidget
                    selectedDate={selectedDate}
                    onDateSelect={(date) => {
                      setSelectedDate(date);
                      setSelectedTime('');
                    }}
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
            // -------- PROFESIONAL --------
            <>
              {/* Encabezado */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-1">Agenda de Citas</h1>
                  <p className="text-muted-foreground">Gestiona las citas médicas y horarios</p>
                </div>

                <div className="flex items-center gap-3 mt-4 lg:mt-0">
                  <div className="flex items-center bg-muted rounded-lg p-1">
                    <Button
                      variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('calendar')}
                      iconName="Calendar"
                      iconSize={16}
                      aria-pressed={viewMode === 'calendar'}
                    >
                      Calendario
                    </Button>
                    <Button
                      variant={viewMode === 'stats' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('stats')}
                      iconName="BarChart3"
                      iconSize={16}
                      aria-pressed={viewMode === 'stats'}
                    >
                      Estadísticas
                    </Button>
                  </div>

                  <Button onClick={openNewAppointment} iconName="Plus" iconSize={16}>
                    Nueva Cita
                  </Button>
                </div>
              </div>

              {/* Leyenda */}
              <div className="mb-4 flex flex-wrap gap-2 text-xs">
                <span className={`px-2 py-1 rounded border ${STATUS_STYLES.pending}`}>Pendiente</span>
                <span className={`px-2 py-1 rounded border ${STATUS_STYLES.confirmed}`}>Confirmada</span>
                <span className={`px-2 py-1 rounded border ${STATUS_STYLES.attended}`}>Atendida</span>
                <span className={`px-2 py-1 rounded border ${STATUS_STYLES.cancelled}`}>Cancelada</span>
                <span className="ml-3 text-muted-foreground">Celdas grisadas: No disponible</span>
              </div>

              {viewMode === 'calendar' ? (
                /* 2 columnas: calendario (2) + panel derecho (1) */
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Calendario */}
                  <section className="xl:col-span-2">
                    <div className="bg-card rounded-lg border border-border">
                      {/* Barra superior */}
                      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={goPrevWeek} aria-label="Semana anterior">
                            <Icon name="ChevronLeft" size={18} />
                          </Button>
                          <div className="font-medium text-foreground capitalize">
                            {weekRef.toLocaleDateString('es-VE', { month: 'long', year: 'numeric' })}
                          </div>
                          <Button variant="ghost" size="icon" onClick={goNextWeek} aria-label="Semana siguiente">
                            <Icon name="ChevronRight" size={18} />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Icon name="Clock" size={16} />
                          {new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </div>
                      </div>

                      {/* Encabezado días */}
                      <div className="grid grid-cols-8 text-xs text-muted-foreground px-4 py-2">
                        <div className="col-span-1" />
                        {weekDays.map((d, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedDay(d)}
                            className={`col-span-1 text-center rounded-md py-1 ${
                              sameDay(d, selectedDay) ? 'bg-primary/10 text-foreground' : ''
                            }`}
                            title={d.toLocaleDateString()}
                          >
                            <div className="capitalize">{fmtDayShort(d)}</div>
                          </button>
                        ))}
                      </div>

                      {/* Grid horas x días */}
                      <div ref={gridRef} className="h-[520px] overflow-auto border-t border-border">
                        {Array.from({ length: 24 }, (_, h) => (
                          <div key={h} className="grid grid-cols-8 border-b border-border">
                            {/* columna hora */}
                            <div className="col-span-1 text-xs text-muted-foreground px-3 py-2">{fmtTime(h)}</div>
                            {/* 7 columnas día */}
                            {weekDays.map((d, i) => {
                              const available = isCellAvailable(d, h);
                              const items = aptsByDayHour(d, h);
                              const tint = getCellStatusTint(items);
                              const baseBg = tint || (!available ? 'bg-muted/40' : '');
                              return (
                                <div
                                  key={`${h}-${i}`}
                                  className={`col-span-1 border-l border-border px-2 py-2 ${baseBg} ${
                                    available ? 'hover:bg-opacity-70 cursor-pointer' : 'cursor-not-allowed opacity-70'
                                  }`}
                                  onClick={() => available && openFromGrid(d, h)}
                                  title={available ? 'Click para crear cita en este horario' : 'No disponible'}
                                  role={available ? 'button' : 'gridcell'}
                                  tabIndex={available ? 0 : -1}
                                  onKeyDown={(e) => {
                                    if (available && (e.key === 'Enter' || e.key === ' ')) {
                                      e.preventDefault();
                                      openFromGrid(d, h);
                                    }
                                  }}
                                >
                                  {/* Chips existentes en esa celda */}
                                  <div className="min-h-[34px] space-y-1">
                                    {items.map((a) => (
                                      <button
                                        key={a.id}
                                        className={`w-full text-left text-[11px] px-2 py-1 rounded border truncate ${STATUS_STYLES[a.status] || ''}`}
                                        title={`${a.reason || 'Consulta'} · ${a.patient?.name || ''}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigate(`/patients/${a.patient.id}`);
                                        }}
                                      >
                                        {(a.patient?.name || 'Paciente').slice(0, 22)} ·{' '}
                                        {(a.reason || 'Consulta').slice(0, 18)}
                                        {a.payMethod && a.payMethod !== 'none' && (
                                          <span className={`ml-2 inline-block border px-1 rounded ${PAY_BADGE(a.payMethod)}`}>
                                            {a.payMethod.toUpperCase()}
                                          </span>
                                        )}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Panel derecho */}
                  <aside className="xl:col-span-1">
                    <div className="bg-card rounded-lg border border-border">
                      <div className="px-4 py-3 border-b border-border">
                        <div className="text-sm text-muted-foreground">
                          {selectedDay.toLocaleDateString('es-VE', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </div>
                        <h3 className="font-medium text-foreground">Citas del día</h3>
                      </div>

                      <div className="p-4 space-y-3">
                        {rightPanelApts.length === 0 ? (
                          <div className="text-center py-10">
                            <Icon name="Calendar" size={48} className="mx-auto mb-3 text-muted-foreground/70" />
                            <div className="font-medium text-foreground">No hay citas programadas</div>
                            <div className="text-sm text-muted-foreground">No se encontraron citas para esta fecha</div>
                          </div>
                        ) : (
                          rightPanelApts.map((a) => (
                            <div key={a.id} className="rounded-md border border-border p-3">
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-foreground">{a.time}</div>
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLES[a.status] || ''}`}>
                                  {a.status === 'confirmed'
                                    ? 'Confirmada'
                                    : a.status === 'attended'
                                    ? 'Atendida'
                                    : a.status === 'cancelled'
                                    ? 'Cancelada'
                                    : 'Pendiente'}
                                </span>
                              </div>
                              <div className="mt-1 text-sm">
                                <button
                                  className="font-medium hover:underline"
                                  onClick={() => navigate(`/patients/${a.patient.id}`)}
                                  title="Ver perfil del paciente"
                                >
                                  {a.patient.name}
                                </button>
                                <div className="text-muted-foreground">{a.reason}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {a.payMethod !== 'none' ? (
                                    <>
                                      <span className={`inline-block mr-2 px-1 rounded border ${PAY_BADGE(a.payMethod)}`}>
                                        {a.payMethod.toUpperCase()}
                                      </span>
                                      Monto: {money(a.amount)} · Fee Healtng: {money(a.commission)}
                                    </>
                                  ) : (
                                    'Pago no registrado'
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Estadísticas del día */}
                      <div className="px-4 pb-4">
                        {(() => {
                          const ds = rightPanelApts;
                          const total = ds.length;
                          const totals = {
                            pending: ds.filter((x) => x.status === 'pending').length,
                            confirmed: ds.filter((x) => x.status === 'confirmed').length,
                            attended: ds.filter((x) => x.status === 'attended').length,
                            cancelled: ds.filter((x) => x.status === 'cancelled').length,
                          };
                          const income = ds.reduce((s, x) => s + (x.amount || 0), 0);
                          const fee = ds.reduce((s, x) => s + (x.commission || 0), 0);
                          return (
                            <div className="mt-4 rounded-lg border border-border p-3 text-sm space-y-1">
                              <div className="flex justify-between">
                                <span>Total citas</span>
                                <span>{total}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Pendientes</span>
                                <span>{totals.pending}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Confirmadas</span>
                                <span>{totals.confirmed}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Atendidas</span>
                                <span>{totals.attended}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Canceladas</span>
                                <span>{totals.cancelled}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Ingresos</span>
                                <span>{money(income)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Comisión Healtng</span>
                                <span>{money(fee)}</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </aside>
                </div>
              ) : (
                /* -------- VISTA ESTADÍSTICAS -------- */
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-card rounded-lg border border-border p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Resumen semanal</h3>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={goPrevWeek} aria-label="Semana anterior">
                          <Icon name="ChevronLeft" size={18} />
                        </Button>
                        <span className="text-sm text-muted-foreground capitalize">
                          {weekRef.toLocaleDateString('es-VE', { day: '2-digit', month: 'long' })} –{' '}
                          {addDays(weekRef, 6).toLocaleDateString('es-VE', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                        <Button variant="ghost" size="icon" onClick={goNextWeek} aria-label="Semana siguiente">
                          <Icon name="ChevronRight" size={18} />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Kpi label="Total citas" value={kpisWeek.totals.total} />
                      <Kpi label="Confirmadas" value={kpisWeek.totals.confirmed} />
                      <Kpi label="Atendidas" value={kpisWeek.totals.attended} />
                      <Kpi label="Canceladas" value={kpisWeek.totals.cancelled} />
                      <Kpi label="Ingresos" value={money(kpisWeek.totals.income)} />
                      <Kpi label="Pendientes" value={kpisWeek.totals.pending} />
                      <Kpi label="Ticket promedio" value={money(kpisWeek.totals.avgTicket)} />
                      <Kpi label="Ocupación (sem.)" value={`${kpisWeek.totals.occupancyPct}%`} />
                      <Kpi label="Tasa de cancelación" value={`${kpisWeek.totals.cancelRate}%`} />
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-2">Distribución por día</h4>
                      <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                        {kpisWeek.byDay.map((d) => (
                          <div key={d.dateKey} className="border border-border rounded-lg p-3">
                            <div className="text-xs text-muted-foreground mb-1">
                              {new Date(d.dateKey).toLocaleDateString('es-VE', { weekday: 'short', day: '2-digit' })}
                            </div>
                            <div className="text-2xl font-semibold">{d.count}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {money(d.income)} · Fee {money(d.fee)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Eliminado: tarjeta de Acciones rápidas */}
                  <div className="bg-card rounded-lg border border-border p-5">
                    <h4 className="text-sm font-medium mb-4">Top pacientes (semana)</h4>
                    <ul className="space-y-2 text-sm">
                      {Object.values(
                        proAppointments
                          .filter(
                            (a) =>
                              a.date >= toDateKey(weekRef) &&
                              a.date <= toDateKey(addDays(weekRef, 6)) &&
                              a.professionalId === selectedPro
                          )
                          .reduce((acc, a) => {
                            const pid = a.patient?.id || 'unknown';
                            if (!acc[pid]) acc[pid] = { id: pid, name: a.patient?.name || 'Paciente', count: 0 };
                            acc[pid].count += 1;
                            return acc;
                          }, {})
                      )
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 5)
                        .map((p) => (
                          <li key={p.id} className="flex items-center justify-between">
                            <span className="truncate">{p.name}</span>
                            <span className="text-muted-foreground">{p.count}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </section>
              )}

              {/* Modal inline */}
              {isNewAppointmentOpen && (
                <div className="fixed inset-0 z-50">
                  <div
                    className="absolute inset-0 bg-black/50"
                    onClick={() => setIsNewAppointmentOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 mx-auto w-full max-w-3xl bg-card border border-border rounded-xl shadow-xl">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">Nueva Cita</h3>
                      <button
                        className="p-2 rounded-md hover:bg-muted"
                        onClick={() => setIsNewAppointmentOpen(false)}
                        aria-label="Cerrar"
                      >
                        <Icon name="X" size={18} />
                      </button>
                    </div>

                    <div className="p-6 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Paciente *</label>
                          <select
                            className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background"
                            value={modalForm.patientId}
                            onChange={(e) => setModalForm((f) => ({ ...f, patientId: e.target.value }))}
                            disabled={modalForm.isNewPatient}
                          >
                            <option value="">Seleccionar paciente</option>
                            {patients.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>

                          <label className="flex items-center gap-2 mt-2 text-sm">
                            <input
                              type="checkbox"
                              checked={modalForm.isNewPatient}
                              onChange={(e) =>
                                setModalForm((f) => ({
                                  ...f,
                                  isNewPatient: e.target.checked,
                                  patientId: e.target.checked ? '' : f.patientId,
                                }))
                              }
                            />
                            Registrar nuevo paciente
                          </label>
                        </div>

                        {modalForm.isNewPatient && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="text-sm font-medium">Nombre y Apellido *</label>
                              <input
                                className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background"
                                placeholder="Ej. Ana Fernández"
                                value={modalForm.newPatientName}
                                onChange={(e) => setModalForm((f) => ({ ...f, newPatientName: e.target.value }))}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Teléfono</label>
                              <input
                                className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background"
                                placeholder="+58 xxx-xxxxxxx"
                                value={modalForm.newPatientPhone}
                                onChange={(e) => setModalForm((f) => ({ ...f, newPatientPhone: e.target.value }))}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium">Profesional</label>
                        <input
                          className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-muted/40 text-muted-foreground"
                          value={pros[0].name}
                          disabled
                          readOnly
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Motivo de consulta *</label>
                        <input
                          className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background"
                          placeholder="Ej. Control post-operatorio"
                          value={modalForm.reason}
                          onChange={(e) => setModalForm((f) => ({ ...f, reason: e.target.value }))}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-sm font-medium">Fecha *</label>
                          <input
                            type="date"
                            className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background"
                            value={modalForm.date}
                            onChange={(e) => setModalForm((f) => ({ ...f, date: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Hora *</label>
                          <input
                            type="time"
                            className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background"
                            value={modalForm.time}
                            onChange={(e) => setModalForm((f) => ({ ...f, time: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Duración (min)</label>
                          <input
                            type="number"
                            min="5"
                            step="5"
                            className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background"
                            value={modalForm.duration}
                            onChange={(e) => setModalForm((f) => ({ ...f, duration: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Estado</label>
                          <select
                            className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background"
                            value={modalForm.status}
                            onChange={(e) => setModalForm((f) => ({ ...f, status: e.target.value }))}
                          >
                            <option value="pending">Pendiente</option>
                            <option value="confirmed">Confirmada</option>
                            <option value="attended">Atendida</option>
                            <option value="cancelled">Cancelada</option>
                          </select>
                        </div>
                      </div>

                      {/* Pago & comisión */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium">Método de pago</label>
                          <select
                            className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background"
                            value={modalForm.payMethod}
                            onChange={(e) => setModalForm((f) => ({ ...f, payMethod: e.target.value }))}
                          >
                            <option value="none">No registrado</option>
                            <option value="cash">Efectivo</option>
                            <option value="pos">Punto</option>
                            <option value="transfer">Transferencia</option>
                            <option value="zelle">Zelle</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Monto (USD)</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background"
                            value={modalForm.amount}
                            onChange={(e) => setModalForm((f) => ({ ...f, amount: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">% Comisión Healtng</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background"
                            value={modalForm.commissionPct}
                            onChange={(e) => setModalForm((f) => ({ ...f, commissionPct: e.target.value }))}
                          />
                        </div>
                        <div className="md:col-span-3 text-sm text-muted-foreground">
                          Comisión estimada:{' '}
                          <span className="font-medium text-foreground">
                            {money((Number(modalForm.amount) || 0) * (Number(modalForm.commissionPct) || 0))}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t border-border flex items-center justify-end gap-2">
                      <button
                        className="px-4 py-2 rounded-md border border-border hover:bg-muted"
                        onClick={() => setIsNewAppointmentOpen(false)}
                      >
                        Cancelar
                      </button>
                      <button
                        className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
                        onClick={saveAppointment}
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

/* --------- Subcomponente KPI --------- */
const Kpi = ({ label, value }) => (
  <div className="rounded-lg border border-border p-3">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="text-xl font-semibold">{value}</div>
  </div>
);

/* --------- Formulario simple para crear paciente (flujo paciente original) --------- */
const NewPatientForm = ({ onCreate }) => {
  const [form, setForm] = useState({ name: '', dni: '', phone: '' });
  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">Nombre y Apellido</label>
        <Input
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="Ej. Ana Pérez"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Documento</label>
        <Input
          value={form.dni}
          onChange={(e) => setForm((p) => ({ ...p, dni: e.target.value }))}
          placeholder="V-xx.xxx.xxx"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Teléfono</label>
        <Input
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          placeholder="+58 xxx-xxxxxxx"
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="default" onClick={() => onCreate(form)}>
          Crear
        </Button>
      </div>
    </div>
  );
};

export default AppointmentBooking;
