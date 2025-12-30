// src/pages/patient-dashboard/index.jsx
import React, { useEffect, useMemo, useState } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import GlobalSearch from "@/components/ui/GlobalSearch";

// Bloques ya existentes en tu proyecto (no se tocan sus imports)
import QuickActionsGrid from "@/pages/patient-dashboard/components/QuickActionsGrid";
import NextAppointment from "@/pages/patient-dashboard/components/NextAppointment";
import RecentExams from "@/pages/patient-dashboard/components/RecentExams";
import HealthProfileSummary from "@/pages/patient-dashboard/components/HealthProfileSummary";

// ====================== Utils ======================
const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

// ======================================================
// Welcome Banner (AZUL) + Carrusel de notificaciones
// ======================================================
const NotificationChip = ({ icon, title, message, timeAgo, action }) => (
  <div className="min-w-[260px] max-w-[260px] snap-center shrink-0 rounded-2xl bg-white/12 backdrop-blur px-4 py-3 mr-3">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">{icon}</div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-white/90">
          <span className="text-sm font-semibold truncate">{title}</span>
          <span className="text-[11px] text-white/70 whitespace-nowrap">• {timeAgo}</span>
        </div>
        <p className="text-xs text-white/85 mt-0.5 line-clamp-2">{message}</p>
        {action?.label && (
          <button
            onClick={action.onClick}
            className="mt-1 text-[11px] font-semibold text-yellow-200 hover:text-yellow-100"
          >
            {action.label} →
          </button>
        )}
      </div>
    </div>
  </div>
);

const WelcomeBanner = ({ patientName = "María", city = "Caracas", notifications = [] }) => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(id);
  }, []);
  const dateStr = useMemo(() => formatDate(now.toISOString()), [now]);

  return (
    <div className="rounded-3xl p-6 md:p-7 bg-gradient-to-r from-[#0E39B1] to-[#0A2D8F] text-white relative overflow-hidden">
      {/* metadatos superiores */}
      <div className="absolute right-6 top-6 text-white/80 text-sm flex items-center gap-2">
        <span className="opacity-80">{city}</span>
      </div>

      <h2 className="text-xl md:text-2xl font-semibold">Hola, {patientName}</h2>
      <p className="text-white/90 text-sm mt-1">{dateStr}</p>

      
      {/* Consejo breve (sutil) */}
      <div className="mt-4 rounded-2xl bg-white/10 text-white/90 p-4">
        <div className="flex items-center gap-2">
          <span className="text-white/90">💙</span>
          <span className="text-sm font-medium">Consejo del día</span>
        </div>
        <p className="text-sm mt-1 opacity-90">
          Bebe agua regularmente y toma pausas activas durante el día.
        </p>
      </div>
    </div>
  );
};

// ======================================================
// Buscador con chips (sin “Disponible hoy / Teleconsulta”)
// CTA: “Explora productos y servicios”
// ======================================================
const DoctorSearchPanel = ({ onSubmit }) => {
  const [q, setQ] = useState("");
  const chips = [
    "Cardiología",
    "Pediatría",
    "Dermatología",
    "Neurología",
    "Traumatología",
    "Ginecología",
  ];
  return (
    <div className="rounded-3xl border border-border bg-card p-4 md:p-5">
      <div className="flex items-center gap-2 rounded-2xl border border-border px-4 py-3 bg-background">
        <span className="text-muted-foreground">🔎</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Busca por especialidad, servicio o ubicación…"
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>

      <div className="mt-4">
        <p className="text-xs text-muted-foreground mb-2">Especialidades populares:</p>
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c}
              onClick={() => setQ(c)}
              className="px-3 py-1.5 rounded-full bg-muted text-foreground/80 text-xs hover:bg-muted/80"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* CTA principal */}
      <div className="mt-4">
        <button
          onClick={() => {
            const dest =
              `/marketplace-hub?query=${encodeURIComponent(q || "")}`;
            onSubmit?.(q) ?? (window.location.href = dest);
          }}
          className="w-full rounded-xl bg-[#0E39B1] text-white py-3 font-semibold hover:brightness-110"
        >
          🔎 Explora productos y servicios
        </button>
      </div>
    </div>
  );
};

// ======================================================
// Página principal
// ======================================================
const PatientDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock perfil y notificaciones
  const patientProfile = { name: "María", memberSince: "2022" };
  const notifications = useMemo(
    () => [
      {
        id: 1,
        icon: "💊",
        title: "Nueva receta",
        message: "Tu médico ha emitido una receta para tu tratamiento.",
        timeAgo: "hoy",
        read: false,
        action: { label: "Ver receta", onClick: () => (window.location.href = "/prescription-management") },
      },
      {
        id: 2,
        icon: "📅",
        title: "Recordatorio de cita",
        message: "Mañana a las 10:00 AM con el Dr. Mendoza.",
        timeAgo: "ayer",
        read: false,
      },
      {
        id: 3,
        icon: "🧪",
        title: "Resultados listos",
        message: "Tu hemograma completo ya está disponible.",
        timeAgo: "esta semana",
        read: true,
      },
    ],
    []
  );

  const recentExams = useMemo(
    () => [
      { id: 1, name: "Hemograma Completo", status: "completed" },
      { id: 2, name: "Radiografía de Tórax", status: "processing" },
      { id: 3, name: "Perfil Lipídico", status: "pending" },
    ],
    []
  );

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse mb-3">
            <div className="w-16 h-16 bg-primary rounded-full mx-auto" />
          </div>
          <p className="text-muted-foreground">Cargando tu dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        userRole="patient"
        isAuthenticated
        onMenuToggle={() => setIsMobileSidebarOpen((v) => !v)}
      />

      {/* Sidebar */}
      <Sidebar
        userRole="patient"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((v) => !v)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main */}
      <main
        className={`pt-16 transition-all duration-300 ${
          isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Breadcrumbs muy livianos */}
          <div className="text-sm text-muted-foreground mb-4">
            <span className="cursor-pointer hover:text-foreground" onClick={() => (window.location.href = "/")}>
              Inicio
            </span>{" "}
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">Dashboard del Paciente</span>
          </div>

          {/* Banner azul con carrusel de notificaciones */}
          <WelcomeBanner patientName={patientProfile.name} notifications={notifications} />

          {/* Buscador/CTA */}
          <div className="mt-6">
            <DoctorSearchPanel />
          </div>

          {/* Acceso rápido / Servicios */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground">Servicios de Salud</h3>
              <button
                onClick={() => (window.location.href = "/marketplace-hub")}
                className="text-sm text-primary font-medium hover:text-primary/80"
              >
                Ver todos
              </button>
            </div>

            {/* QuickActionsGrid se mantiene (si luego quieres modo carrusel lo ajustamos dentro del componente) */}
            <QuickActionsGrid onActionClick={(a) => console.log("quick action", a)} />
          </div>

          {/* Grid principal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            {/* Columna principal */}
            <div className="lg:col-span-8 space-y-6">
              <NextAppointment />
              <RecentExams />
            </div>

            {/* Lateral derecho */}
            <div className="lg:col-span-4 space-y-6">
              <HealthProfileSummary />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
