import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";

/* ===================== HELPERS ===================== */
const todayISO = () => new Date().toISOString().slice(0, 10);

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
const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const fmtDayShort = (d) =>
  d
    .toLocaleDateString("es-VE", { weekday: "short", day: "2-digit", month: "short" })
    .replace(".", "");

const fmtTime = (h) => `${String(h).padStart(2, "0")}:00`;
const hourStr = (h) => `${String(h).padStart(2, "0")}:00`;
const toDateKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(
    2,
    "0"
  )}`;

/* ✅ Slots de trabajo (para capacidad/huecos) */
const WORKING_HOURS = [8, 9, 10, 11, 14, 15, 16, 17];
const SLOT_MINUTES = 60;

const isActiveAppt = (a) => a && a.status !== "cancelled";

/* ===================== ESTILOS ===================== */
const STATUS_STYLES = {
  scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  done: "bg-emerald-100 text-emerald-800 border-emerald-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  cancelled: "bg-rose-100 text-rose-800 border-rose-200 line-through",
};

const CELL_BG_BY_STATUS = {
  scheduled: "bg-blue-50",
  done: "bg-blue-50",
  pending: "bg-yellow-50",
  cancelled: "bg-red-50",
};

const StatusPill = ({ status }) => {
  const cfg =
    {
      scheduled: { text: "Programada", cls: "bg-blue-100 text-blue-800" },
      done: { text: "Realizada", cls: "bg-emerald-100 text-emerald-800" },
      pending: { text: "Pendiente", cls: "bg-amber-100 text-amber-800" },
      cancelled: { text: "Cancelada", cls: "bg-rose-100 text-rose-800" },
    }[status] || { text: status, cls: "bg-gray-100 text-gray-700" };

  return <span className={`px-2 py-0.5 text-xs rounded-full ${cfg.cls}`}>{cfg.text}</span>;
};

const StatCard = ({ label, value, icon, tone = "default" }) => {
  const toneMap = {
    default: "bg-card",
    success: "bg-emerald-50 dark:bg-emerald-950/30",
    warning: "bg-amber-50 dark:bg-amber-950/30",
    info: "bg-blue-50 dark:bg-blue-950/30",
    danger: "bg-rose-50 dark:bg-rose-950/30",
  };
  return (
    <div className={`rounded-xl border border-border ${toneMap[tone]} p-4`}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon name={icon} size={16} className="text-muted-foreground" />
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
};

const Badge = ({ children, tone = "default" }) => {
  const cls =
    tone === "danger"
      ? "bg-rose-100 text-rose-700 border-rose-200"
      : tone === "warning"
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : tone === "success"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-zinc-100 text-zinc-700 border-zinc-200";
  return <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full border ${cls}`}>{children}</span>;
};

/* ===================== SEED MOCK (SEMANA VIVA) ===================== */
const seedRandom = (seed) => {
  let x = Math.sin(seed) * 10000;
  return () => {
    x = Math.sin(x) * 10000;
    return x - Math.floor(x);
  };
};

const generateWeekAppointments = ({ weekStart, doctors, rooms }) => {
  const rnd = seedRandom(Number(weekStart));
  const out = [];
  const hours = WORKING_HOURS;
  const types = ["Consulta General", "Especialidad", "Teleconsulta", "Procedimiento"];
  const statusPool = ["scheduled", "pending", "scheduled", "done", "cancelled"];

  for (let d = 0; d < 7; d++) {
    const dayObj = addDays(weekStart, d);
    if (dayObj.getDay() === 0) continue; // domingo
    const dk = toDateKey(dayObj);

    hours.forEach((h) => {
      if (rnd() < 0.6) {
        const doctor = doctors[Math.floor(rnd() * doctors.length)];
        const room = rooms[Math.floor(rnd() * rooms.length)];
        const status = statusPool[Math.floor(rnd() * statusPool.length)];
        const id = `seed-${dk}-${h}-${doctor.replace(/\s/g, "")}`;

        const patientId = String(Math.floor(rnd() * 12) + 1);
        const patientNames = [
          "María González",
          "Juan Rodríguez",
          "Ana Martínez",
          "Carlos Pérez",
          "Sofía Ramírez",
          "Luis Romero",
          "Carmen Silva",
          "Elena Martínez",
          "Ignacio Mendoza",
          "Patricia Salazar",
          "Roberto Fernández",
          "Javier Rojas",
        ];

        out.push({
          id,
          patientId,
          patient: patientNames[Number(patientId) - 1] || "Paciente",
          time: hourStr(h),
          doctor,
          room,
          type: types[Math.floor(rnd() * types.length)],
          status,
          date: dk,
        });
      }
    });
  }

  return out.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
};

/* ===================== COMPONENTE PRINCIPAL ===================== */
const ClinicAppointmentsManagement = () => {
  const navigate = useNavigate();
  const [userRole] = useState(localStorage.getItem("userRole") || "clinic");

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("calendar"); // calendar | list

  // Filtros
  const [q, setQ] = useState("");
  const [doctor, setDoctor] = useState("");
  const [status, setStatus] = useState("");

  const doctors = ["Dr. Pérez", "Dra. López", "Dr. García"];
  const rooms = ["Consultorio 1", "Consultorio 2", "Consultorio 3", "Sala A"];

  // Semana visible
  const [weekRef, setWeekRef] = useState(startOfWeek(new Date()));
  const [selectedDay, setSelectedDay] = useState(new Date());
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekRef, i)), [weekRef]);

  const goPrevWeek = () => setWeekRef((d) => addDays(d, -7));
  const goNextWeek = () => setWeekRef((d) => addDays(d, 7));

  // Appointments mock
  const [appointments, setAppointments] = useState(() => [
    {
      id: "APP-001",
      patientId: "1",
      patient: "María González",
      time: "09:00",
      doctor: "Dr. Pérez",
      room: "Consultorio 1",
      type: "Consulta General",
      status: "scheduled",
      date: todayISO(),
    },
  ]);

  // Seed automático por semana
  useEffect(() => {
    const seeded = generateWeekAppointments({ weekStart: weekRef, doctors, rooms });
    setAppointments((prev) => {
      const existing = new Set(prev.map((a) => a.id));
      const merged = [...prev];
      seeded.forEach((a) => {
        if (!existing.has(a.id)) merged.push(a);
      });
      return merged.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekRef]);

  // Filtros aplicados
  const filtered = useMemo(() => {
    return appointments.filter((r) => {
      const mQ =
        !q ||
        r.patient.toLowerCase().includes(q.toLowerCase()) ||
        r.id.toLowerCase().includes(q.toLowerCase());
      const mDoctor = !doctor || r.doctor === doctor;
      const mStatus = !status || r.status === status;
      return mQ && mDoctor && mStatus;
    });
  }, [appointments, q, doctor, status]);

  // ✅ (2) Capacidad usada + huecos muertos + badge sobrecarga por doctor
  const opsAgenda = useMemo(() => {
    const key = toDateKey(selectedDay);

    const todays = filtered.filter((a) => a.date === key);
    const todaysActive = todays.filter(isActiveAppt);

    const totalSlots = doctors.length * WORKING_HOURS.length;

    // cuenta slots ocupados únicos por doctor+hora
    const usedSet = new Set(
      todaysActive
        .filter((a) => WORKING_HOURS.includes(Number(a.time.slice(0, 2))))
        .map((a) => `${a.doctor}|${a.time}`)
    );
    const usedSlots = usedSet.size;

    const capacityUsedPct = totalSlots ? Math.round((usedSlots / totalSlots) * 100) : 0;
    const deadMinutes = Math.max(0, totalSlots - usedSlots) * SLOT_MINUTES;

    // por doctor
    const byDoctor = doctors.map((d) => {
      const dUsed = new Set(
        todaysActive
          .filter((a) => a.doctor === d)
          .filter((a) => WORKING_HOURS.includes(Number(a.time.slice(0, 2))))
          .map((a) => a.time)
      ).size;

      const dTotal = WORKING_HOURS.length;
      const dPct = dTotal ? Math.round((dUsed / dTotal) * 100) : 0;

      const overload = dPct >= 90; // badge de sobrecarga (ajustable)
      return { doctor: d, used: dUsed, total: dTotal, pct: dPct, overload };
    });

    const overloadCount = byDoctor.filter((x) => x.overload).length;

    return {
      totalSlots,
      usedSlots,
      capacityUsedPct,
      deadMinutes,
      byDoctor,
      overloadCount,
    };
  }, [filtered, selectedDay, doctors]);

  // KPIs simples
  const kpis = useMemo(() => {
    const todayKey = todayISO();
    const today = appointments.filter((r) => r.date === todayKey).length;
    const done = appointments.filter((r) => r.status === "done").length;
    const pend = appointments.filter((r) => r.status === "pending").length;
    const roomUsage = "75%"; // placeholder
    return { today, done, pend, roomUsage };
  }, [appointments]);

  const clearFilters = () => {
    setQ("");
    setDoctor("");
    setStatus("");
  };

  // ====== Calendario semanal ======
  const gridRef = useRef(null);

  const scrollToCurrentHour = () => {
    if (!gridRef.current) return;
    const nowHour = new Date().getHours();
    const rows = gridRef.current.children;
    if (!rows || !rows.length) return;
    const target = rows[Math.min(nowHour, rows.length - 1)];
    if (target) {
      const y = target.offsetTop - 40;
      gridRef.current.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToCurrentHour();
  }, [weekRef]);

  const aptsByDayHour = (dayObj, hour) => {
    const dk = toDateKey(dayObj);
    const hh = hourStr(hour);
    return filtered.filter((a) => a.date === dk && a.time === hh);
  };

  const getCellStatusTint = (items) => {
    if (!items || items.length === 0) return "";
    const hasScheduled = items.some((i) => i.status === "scheduled" || i.status === "done");
    if (hasScheduled) return CELL_BG_BY_STATUS.scheduled;
    const hasPending = items.some((i) => i.status === "pending");
    if (hasPending) return CELL_BG_BY_STATUS.pending;
    const hasCancelled = items.some((i) => i.status === "cancelled");
    if (hasCancelled) return CELL_BG_BY_STATUS.cancelled;
    return "";
  };

  // Panel derecho: citas del día seleccionado
  const rightPanelApts = useMemo(() => {
    const key = toDateKey(selectedDay);
    return filtered.filter((a) => a.date === key).sort((a, b) => a.time.localeCompare(b.time));
  }, [filtered, selectedDay]);

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

      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
            <Button variant="ghost" className="px-2 py-1" onClick={() => navigate("/clinic-dashboard")}>
              <Icon name="Home" size={16} className="mr-2" />
              Panel Principal
            </Button>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground font-medium">Gestión de Consultas</span>
          </div>

          {/* Header + CTA */}
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Gestión de Consultas</h1>
              <p className="text-muted-foreground">Controla agenda, salas y rendimiento clínico en una sola vista.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <Icon name="Download" size={16} />
                Exportar CSV
              </Button>
              <Button onClick={() => navigate("/new-patient-appointment")}>
                <Icon name="CalendarPlus" size={16} className="mr-2" />
                Nueva Cita
              </Button>
            </div>
          </div>

          {/* KPIs básicos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <StatCard label="Citas hoy" value={kpis.today} icon="Calendar" tone="info" />
            <StatCard label="Realizadas" value={kpis.done} icon="CheckCircle" tone="success" />
            <StatCard label="Pendientes" value={kpis.pend} icon="Clock" tone="warning" />
            <StatCard label="Ocupación salas" value={kpis.roomUsage} icon="Activity" />
          </div>

          {/* ✅ (2) KPIs Operativos Agenda: Capacidad + Huecos + Badge por doctor */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
            <StatCard
              label="Capacidad usada (día)"
              value={`${opsAgenda.capacityUsedPct}%`}
              icon="Gauge"
              tone={opsAgenda.capacityUsedPct >= 85 ? "warning" : "info"}
            />
            <StatCard
              label="Huecos muertos (min)"
              value={opsAgenda.deadMinutes}
              icon="Timer"
              tone={opsAgenda.deadMinutes > 180 ? "warning" : "default"}
            />
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Sobrecarga por doctor</p>
                <Icon name="AlertTriangle" size={16} className="text-muted-foreground" />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {opsAgenda.byDoctor.map((d) => (
                  <Badge key={d.doctor} tone={d.overload ? "danger" : d.pct >= 80 ? "warning" : "success"}>
                    {d.doctor}: {d.pct}%
                    {d.overload ? " · Sobrecarga" : ""}
                  </Badge>
                ))}
                {opsAgenda.byDoctor.length === 0 && <Badge>—</Badge>}
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-card border border-border rounded-xl p-3 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <div className="relative">
                  <Icon
                    name="Search"
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Buscar por paciente o ID..."
                    className="w-full pl-9 pr-3 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <select
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  className="w-full py-2 px-3 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Doctor (todos)</option>
                  {doctors.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full py-2 px-3 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Estado (todos)</option>
                  <option value="scheduled">Programada</option>
                  <option value="done">Realizada</option>
                  <option value="pending">Pendiente</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon name="Clock" size={14} />
                <span>Actualizado hace 2 min</span>
              </div>
              <Button variant="ghost" onClick={clearFilters} className="text-sm">
                Limpiar filtros
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-3 flex items-center gap-2 md:gap-3">
            <div className="flex w-full md:w-auto bg-muted/50 p-1 rounded-lg">
              <Button
                variant={activeTab === "calendar" ? "default" : "ghost"}
                className="flex-1 md:flex-none gap-2"
                onClick={() => setActiveTab("calendar")}
              >
                <Icon name="Calendar" size={16} />
                Vista Calendario
              </Button>
              <Button
                variant={activeTab === "list" ? "default" : "ghost"}
                className="flex-1 md:flex-none gap-2"
                onClick={() => setActiveTab("list")}
              >
                <Icon name="List" size={16} />
                Vista Lista
              </Button>
            </div>
          </div>

          {/* ===================== CALENDARIO ===================== */}
          {activeTab === "calendar" ? (
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
                        {weekRef.toLocaleDateString("es-VE", { month: "long", year: "numeric" })}
                      </div>
                      <Button variant="ghost" size="icon" onClick={goNextWeek} aria-label="Semana siguiente">
                        <Icon name="ChevronRight" size={18} />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Clock" size={16} />
                      {new Date().toLocaleTimeString("es-VE", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
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
                          sameDay(d, selectedDay) ? "bg-primary/10 text-foreground" : ""
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
                        {/* Hora */}
                        <div className="col-span-1 text-xs text-muted-foreground px-3 py-2">{fmtTime(h)}</div>

                        {/* Días */}
                        {weekDays.map((d, i) => {
                          const items = aptsByDayHour(d, h);
                          const tint = getCellStatusTint(items);
                          const baseBg = tint || "";

                          return (
                            <div
                              key={`${h}-${i}`}
                              className={`col-span-1 border-l border-border px-2 py-2 ${baseBg}`}
                              title={items.length ? `${items.length} cita(s)` : "Sin citas"}
                            >
                              <div className="min-h-[34px] space-y-1">
                                {items.map((a) => (
                                  <button
                                    key={a.id}
                                    className={`w-full text-left text-[11px] px-2 py-1 rounded border truncate ${
                                      STATUS_STYLES[a.status] || ""
                                    }`}
                                    title={`${a.patient} • ${a.type} • ${a.doctor}`}
                                    onClick={() => navigate(`/patients/${a.patientId}?scope=clinic`)}
                                  >
                                    {a.patient.slice(0, 20)} · {a.type.slice(0, 16)}
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
                      {selectedDay.toLocaleDateString("es-VE", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <h3 className="font-medium text-foreground">Citas del día</h3>

                    {/* mini resumen */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge tone={opsAgenda.capacityUsedPct >= 85 ? "warning" : "success"}>
                        Capacidad: {opsAgenda.capacityUsedPct}%
                      </Badge>
                      <Badge tone={opsAgenda.deadMinutes > 180 ? "warning" : "default"}>
                        Huecos: {opsAgenda.deadMinutes} min
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    {rightPanelApts.length === 0 ? (
                      <div className="text-center py-10">
                        <Icon name="Calendar" size={48} className="mx-auto mb-3 text-muted-foreground/70" />
                        <div className="font-medium text-foreground">No hay citas programadas</div>
                        <div className="text-sm text-muted-foreground">Prueba otra fecha o ajusta filtros</div>
                      </div>
                    ) : (
                      rightPanelApts.map((a) => (
                        <div key={a.id} className="rounded-md border border-border p-3">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-foreground">{a.time}</div>
                            <StatusPill status={a.status} />
                          </div>
                          <div className="mt-1 text-sm">
                            <button
                              className="font-medium hover:underline text-primary"
                              onClick={() => navigate(`/patients/${a.patientId}?scope=clinic`)}
                              title="Ver perfil del paciente"
                            >
                              {a.patient}
                            </button>
                            <div className="text-muted-foreground">{a.type}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {a.doctor} • {a.room}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            /* ===================== LISTA ===================== */
            <div className="hidden md:block rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-12 bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground">
                <div className="col-span-3">Paciente</div>
                <div className="col-span-2">Fecha</div>
                <div className="col-span-1">Hora</div>
                <div className="col-span-2">Doctor</div>
                <div className="col-span-2">Sala</div>
                <div className="col-span-1 text-right">Estado</div>
                <div className="col-span-1 text-right">Acción</div>
              </div>

              {filtered.map((r) => (
                <div key={r.id} className="grid grid-cols-12 px-4 py-3 border-t border-border text-sm hover:bg-muted/30">
                  <div className="col-span-3">
                    <div className="font-medium text-foreground">
                      <button className="text-primary hover:underline" onClick={() => navigate(`/patients/${r.patientId}?scope=clinic`)}>
                        {r.patient}
                      </button>
                    </div>
                    <div className="text-xs text-muted-foreground">ID: {r.id}</div>
                  </div>
                  <div className="col-span-2">{r.date}</div>
                  <div className="col-span-1">{r.time}</div>
                  <div className="col-span-2">{r.doctor}</div>
                  <div className="col-span-2">{r.room}</div>
                  <div className="col-span-1 text-right">
                    <StatusPill status={r.status} />
                  </div>
                  <div className="col-span-1 text-right">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/patients/${r.patientId}?scope=clinic`)} title="Ver ficha del paciente">
                      <Icon name="Eye" size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile list when activeTab=list */}
          {activeTab === "list" && (
            <div className="md:hidden space-y-3 mt-3">
              {filtered.map((r) => (
                <div key={r.id} className="rounded-xl border border-border p-3 bg-card">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        <button className="text-primary hover:underline" onClick={() => navigate(`/patients/${r.patientId}?scope=clinic`)}>
                          {r.patient}
                        </button>{" "}
                        <span className="text-muted-foreground">• {r.time}</span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{r.date} • {r.doctor}</div>
                      <div className="text-xs text-muted-foreground truncate">{r.room} • {r.type}</div>
                    </div>
                    <StatusPill status={r.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClinicAppointmentsManagement;
