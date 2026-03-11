import React, { useState, useEffect } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import AppointmentsList from "@/pages/professional-dashboard/components/AppointmentsList";
import UpcomingSchedule from "@/pages/professional-dashboard/components/UpcomingSchedule";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

// 1. IMPORTAR CONTEXTOS Y API
import { useProfessional } from "@/context/ProfessionalContext";
import { useAuth } from "@/context/AuthContext";
import { fetchAppointmentsByProfessional } from "@/api/appointments";

// 2. IMPORTAR EL MODAL
import NewAppointmentModal from "@/components/modals/NewAppointmentModal";
import RescheduleModal from "@/components/modals/RescheduleModal";

const ProfessionalDashboard = () => {
  const { profile } = useAuth();
  const { currentProfessional, specialtyContext } = useProfessional();

  // Roles y permisos
  const userRole = profile?.role || "doctor";

  // Shell
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Estado
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({ isOpen: false, appointment: null });
  const [loading, setLoading] = useState(true);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [isOfflineMode, setIsOfflineMode] = useState(!navigator.onLine);

  // 3. GENERAR SEMANA DINÁMICA (Lunes a Domingo)
  const getWeekPills = (allAppointments = []) => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0: Dom, 1: Lun...
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const monday = new Date();
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0,0,0,0);

    const weekLabels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const todayISO = now.toISOString().split('T')[0];

    return weekLabels.map((label, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      
      return {
        id: label.toLowerCase(),
        dayLabel: label,
        dayNum: d.getDate(),
        fullDate: iso,
        active: iso === todayISO,
        count: allAppointments.filter(a => a.date === iso).length
      };
    });
  };

  const [weekPills, setWeekPills] = useState([]);

  // CARGAR CITAS REALES DE SUPABASE
  const loadAppointments = async () => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await fetchAppointmentsByProfessional(profile.id);
      
      // 1. Mapear para la lista de hoy
      const mappedToday = data
        .filter(a => a.date === today)
        .map(a => ({
          id: a.id,
          patientName: a.patient_name,
          patientId: a.patient_id,
          time: a.time ? a.time.slice(0, 5) : "--:--",
          duration: a.metadata?.duration || 30,
          type: a.metadata?.type || "in-person",
          status: a.status,
          reason: a.reason,
          intakeStatus: a.metadata?.intakeStatus || {},
          original: a // Mantenemos el objeto original para el modal
        }));

      setTodaysAppointments(mappedToday);

      // 2. Generar pills de la semana con los datos completos
      setWeekPills(getWeekPills(data));

    } catch (err) {
      console.error("Error loading dashboard appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.id) loadAppointments();
  }, [profile?.id]);

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

  const professionalData = {
    name: profile?.full_name || currentProfessional?.name || "Médico",
    specialty: profile?.metadata?.specialty_label || specialtyContext?.label || "Especialista", 
    mpps: profile?.metadata?.license || currentProfessional?.licenseNumber || "---",
    state: profile?.metadata?.state || currentProfessional?.state || "Venezuela",
    avatar: profile?.avatar_url || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150",
    rating: 5.0,
    reviews: 0,
    verified: true,
  };

  const dayTimeline = todaysAppointments.map(a => ({
    time: a.time,
    patientName: a.patientName,
    status: a.status,
    appointment: a.original
  }));

  const currentMonthLabel = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  const quickAccess = [
    {
      key: "new_appointment",
      icon: "Plus",
      title: "Nueva Cita",
      subtitle: "Programar cita con paciente",
      onClick: () => setIsModalOpen(true),
    },
    {
      key: "today",
      icon: "Calendar",
      title: "Pacientes Hoy",
      subtitle: "Ver agenda del día",
      onClick: () => document.getElementById("today-appointments")?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      key: "rx",
      icon: "FileEdit",
      title: "Crear Receta",
      subtitle: "Nueva prescripción médica",
      onClick: () => (window.location.href = "/prescriptions/new"),
    },
    {
      key: "report",
      icon: "BarChart",
      title: "Reportes",
      subtitle: "Estadísticas del mes",
      onClick: () => (window.location.href = "/professional/analytics"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} onMenuToggle={() => setMobileSidebarOpen(true)} />
      <Sidebar
        userRole={userRole}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          
          <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-left">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-2xl border-2 border-white shadow-sm">
                   {professionalData.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-foreground">Hola, {professionalData.name}</h1>
                    <Icon name="BadgeCheck" size={18} className="text-primary" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {professionalData.specialty} • MPPS: {professionalData.mpps}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{professionalData.state}</div>
                </div>
              </div>
              <Button variant="outline" className="hidden sm:flex" onClick={loadAppointments}>
                 <Icon name="RefreshCcw" size={14} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                 Actualizar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
             {quickAccess.map(qa => (
               <button key={qa.key} onClick={qa.onClick} className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center mb-3 group-hover:bg-primary/10">
                     <Icon name={qa.icon} size={20} className="text-primary" />
                  </div>
                  <p className="font-bold text-sm text-foreground">{qa.title}</p>
                  <p className="text-xs text-muted-foreground">{qa.subtitle}</p>
               </button>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6" id="today-appointments">
              <AppointmentsList
                appointments={todaysAppointments}
                dateLabel={loading ? "Cargando citas..." : null}
                onEditAppointment={(app) => setRescheduleData({ isOpen: true, appointment: app })}
              />
            </div>

            <div className="space-y-6">
              <UpcomingSchedule
                weekPills={weekPills}
                timeline={dayTimeline}
                monthLabel={currentMonthLabel}
                onEditAppointment={(app) => setRescheduleData({ isOpen: true, appointment: app })}
              />
            </div>
          </div>
        </div>

        <NewAppointmentModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={() => {
            loadAppointments();
            alert("Cita agendada correctamente.");
          }}
        />

        <RescheduleModal 
          isOpen={rescheduleData.isOpen}
          appointment={rescheduleData.appointment}
          onClose={() => setRescheduleData({ isOpen: false, appointment: null })}
          onSave={() => {
            loadAppointments();
            alert("Cita reprogramada correctamente.");
          }}
        />

      </main>
    </div>
  );
};

export default ProfessionalDashboard;