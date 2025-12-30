import React, { useState, useEffect } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";

import AppointmentsList from "@/pages/professional-dashboard/components/AppointmentsList";
import UpcomingSchedule from "@/pages/professional-dashboard/components/UpcomingSchedule";

import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

const ProfessionalDashboard = () => {
  // Shell
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userRole] = useState("doctor");

  // Estado
  const [currentTime] = useState(new Date()); // (se mantiene por si lo usas luego)
  const [isOfflineMode, setIsOfflineMode] = useState(!navigator.onLine);

  useEffect(() => {
    const onOnline = () => setIsOfflineMode(false);
    const onOffline = () => setIsOfflineMode(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  // Mock del profesional (sustituible por store/API)
  const professionalData = {
    name: "Dr. Carlos Mendoza",
    specialty: "Medicina Interna",
    mpps: "12345",
    avatar:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150",
    rating: 4.7,
    reviews: 52,
    verified: true,
  };

  // Datos demo
  const todaysAppointments = [
    {
      id: 1,
      patientName: "María González",
      time: "09:00",
      duration: 30,
      type: "in-person",
      status: "confirmed",
      reason: "Consulta General",
      note: "Control de presión arterial",
    },
    {
      id: 2,
      patientName: "Carlos Rodríguez",
      time: "09:30",
      duration: 20,
      type: "in-person",
      status: "pending",
      reason: "Seguimiento",
      note: "Revisión de exámenes",
    },
    {
      id: 3,
      patientName: "Ana Martínez",
      time: "10:00",
      duration: 45,
      type: "teleconsultation",
      status: "inprogress",
      reason: "Primera Consulta",
      note: "Evaluación inicial",
    },
    {
      id: 4,
      patientName: "Luis Pérez",
      time: "10:45",
      duration: 30,
      type: "in-person",
      status: "confirmed",
      reason: "Control",
      note: "Control post-operatorio",
    },
    {
      id: 5,
      patientName: "Carmen Silva",
      time: "11:15",
      duration: 60,
      type: "in-person",
      status: "confirmed",
      reason: "Consulta Especializada",
      note: "Evaluación cardiológica",
    },
  ];

  const weekPills = [
    { id: "mon", dayLabel: "Lun", dayNum: 26, count: 8 },
    { id: "tue", dayLabel: "Mar", dayNum: 27, count: 6 },
    { id: "wed", dayLabel: "Mié", dayNum: 28, count: 9 },
    { id: "thu", dayLabel: "Jue", dayNum: 29, count: 7 },
    { id: "fri", dayLabel: "Vie", dayNum: 30, count: 5 },
    { id: "sat", dayLabel: "Sáb", dayNum: 31, count: 3 },
    { id: "sun", dayLabel: "Dom", dayNum: 1, count: 12, active: true },
  ];

  const dayTimeline = [
    { time: "09:00", left: "María G.", right: "Carlos R." },
    { time: "10:00", left: "Ana M." },
    { time: "11:00", left: "Luis P.", right: "Carmen S." },
    { time: "12:00", slot: "Disponible" },
    { time: "13:00", slot: "Descanso" },
    { time: "14:00", left: "Pedro L." },
    { time: "15:00", left: "Sofía R.", right: "Miguel A." },
    { time: "16:00", left: "Elena V." },
  ];

  // Helpers (si los quieres reutilizar)
  const formatReviews = (n) => new Intl.NumberFormat("es-VE").format(n);

  // -------- Accesos rápidos PRIORITARIOS (debajo del header) --------
  const quickAccess = [
    {
      key: "new_appointment",
      icon: "Plus",
      title: "Nueva Cita",
      subtitle: "Programar cita con paciente",
      onClick: () => (window.location.href = "/appointments/new"),
    },
    {
      key: "today",
      icon: "Calendar",
      title: "Pacientes Hoy",
      subtitle: "Ver agenda del día",
      onClick: () =>
        document
          .getElementById("today-appointments")
          ?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      key: "rx",
      icon: "FileEdit",
      title: "Crear Receta",
      subtitle: "Nueva prescripción médica",
      onClick: () => (window.location.href = "/prescriptions/new"),
    },
    {
      key: "emergency",
      icon: "AlertTriangle",
      title: "Emergencias",
      subtitle: "Casos urgentes",
      onClick: () => (window.location.href = "/emergency"),
    },
  ];

  // Row: swipe en móvil + grid en desktop
  const QuickAccessRow = () => (
    <div className="mb-6 sm:mb-8">
      {/* Mobile swipeable row */}
      <div className="lg:hidden overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] no-scrollbar">
        <div className="flex gap-4 min-w-max pr-2">
          {quickAccess.map((qa) => (
            <button
              key={qa.key}
              onClick={qa.onClick}
              className="min-w-[260px] bg-card border border-border rounded-xl p-4 text-left hover:bg-accent transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name={qa.icon} size={16} className="text-primary" />
                </div>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              </div>
              <div className="mt-3">
                <div className="font-medium text-foreground">{qa.title}</div>
                <div className="text-xs text-muted-foreground">{qa.subtitle}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop grid */}
      <div className="hidden lg:grid grid-cols-4 gap-6 mb-0">
        {quickAccess.map((qa) => (
          <button
            key={qa.key}
            onClick={qa.onClick}
            className="bg-card border border-border rounded-xl p-4 text-left hover:bg-accent transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name={qa.icon} size={16} className="text-primary" />
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </div>
            <div className="mt-3">
              <div className="font-medium text-foreground">{qa.title}</div>
              <div className="text-xs text-muted-foreground">{qa.subtitle}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole={userRole}
        isAuthenticated
        onMenuToggle={() => setMobileSidebarOpen(true)}
      />
      <Sidebar
        userRole={userRole}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Encabezado profesional (limpio, sin Actualizar) */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-5 mb-6 sm:mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-muted rounded-full overflow-hidden">
                  <img
                    src={professionalData.avatar}
                    alt={professionalData.name}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      (e.currentTarget.src = "/assets/images/no_image.png")
                    }
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                      Bienvenido, {professionalData.name}
                    </h1>
                    {professionalData.verified && (
                      <span
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary"
                        title="Profesional verificado"
                      >
                        <Icon name="BadgeCheck" size={16} className="text-primary" />
                        Verificado
                      </span>
                    )}
                  </div>

                  <div className="mt-1 text-sm text-muted-foreground">
                    {professionalData.specialty} • MPPS: {professionalData.mpps}
                  </div>

                  <div className="mt-1 flex items-center gap-1 text-sm">
                    <Icon name="Star" size={16} className="text-warning fill-current" />
                    <span className="font-medium text-foreground">
                      {professionalData.rating}
                    </span>
                    <span className="text-muted-foreground">
                      ({formatReviews(professionalData.reviews)} comentarios)
                    </span>
                  </div>
                </div>
              </div>

              {isOfflineMode && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-warning/10 border border-warning/20 rounded-full">
                  <Icon name="WifiOff" size={16} className="text-warning" />
                  <span className="text-sm font-medium text-warning">Modo Offline</span>
                </div>
              )}
            </div>
          </div>

          {/* Accesos rápidos (swipe mobile / grid desktop) */}
          <QuickAccessRow />

          {/* Citas (2/3) + Vista semanal (1/3) con más aire */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10">
            <div className="lg:col-span-2 space-y-7" id="today-appointments">
              <AppointmentsList
                appointments={todaysAppointments}
                onCheckIn={(id) => console.log("[checkin]", id)}
                onReschedule={(id) => console.log("[reschedule]", id)}
                onCancel={(id) => console.log("[cancel]", id)}
                hideConversation
              />
            </div>

            <div className="space-y-6 mt-2 lg:mt-0">
              <UpcomingSchedule
                weekPills={weekPills}
                timeline={dayTimeline}
                monthLabel="Agosto - Septiembre 2025"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalDashboard;
