// src/@/@/@/@/pages/clinic-appointments-management/index.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Button from '@/components/ui/Button';
import Icon from '@/components/AppIcon';

const StatCard = ({ label, value, icon, tone = 'default' }) => {
  const toneMap = {
    default: 'bg-card',
    success: 'bg-emerald-50 dark:bg-emerald-950/30',
    warning: 'bg-amber-50 dark:bg-amber-950/30',
    info: 'bg-blue-50 dark:bg-blue-950/30',
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

const StatusPill = ({ status }) => {
  const cfg =
    {
      scheduled: {
        text: 'Programada',
        cls: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      },
      done: {
        text: 'Realizada',
        cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      },
      pending: {
        text: 'Pendiente',
        cls: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      },
      cancelled: {
        text: 'Cancelada',
        cls: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
      },
    }[status] || { text: status, cls: 'bg-muted text-foreground' };
  return <span className={`px-2 py-0.5 text-xs rounded-full ${cfg.cls}`}>{cfg.text}</span>;
};

const ClinicAppointmentsManagement = () => {
  const navigate = useNavigate();
  const [userRole] = useState(localStorage.getItem('userRole') || 'clinic');

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' | 'list'

  // Filtros
  const [q, setQ] = useState('');
  const [doctor, setDoctor] = useState('');
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Mock data con patientId para poder abrir ficha
  const doctors = ['Dr. Pérez', 'Dra. López', 'Dr. García'];
  const rows = useMemo(
    () => [
      {
        id: 'APP-001',
        patientId: '1',
        patient: 'María González',
        time: '09:00',
        doctor: 'Dr. Pérez',
        room: 'Consultorio 1',
        type: 'Consulta General',
        status: 'scheduled',
      },
      {
        id: 'APP-002',
        patientId: '2',
        patient: 'Juan Rodríguez',
        time: '10:30',
        doctor: 'Dra. López',
        room: 'Consultorio 2',
        type: 'Teleconsulta',
        status: 'done',
      },
      {
        id: 'APP-003',
        patientId: '3',
        patient: 'Ana Martínez',
        time: '14:00',
        doctor: 'Dr. García',
        room: 'Consultorio 3',
        type: 'Especialidad',
        status: 'pending',
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const mQ =
        !q ||
        r.patient.toLowerCase().includes(q.toLowerCase()) ||
        r.id.toLowerCase().includes(q.toLowerCase());
      const mDoctor = !doctor || r.doctor === doctor;
      const mStatus = !status || r.status === status;
      // Fechas – placeholder
      const mDate = true;
      return mQ && mDoctor && mStatus && mDate;
    });
  }, [rows, q, doctor, status]);

  // KPIs simples (placeholder)
  const kpis = useMemo(() => {
    const today = rows.length;
    const done = rows.filter((r) => r.status === 'done').length;
    const pend = rows.filter((r) => r.status === 'pending').length;
    const roomUsage = '75%';
    return { today, done, pend, roomUsage };
  }, [rows]);

  const clearFilters = () => {
    setQ('');
    setDoctor('');
    setStatus('');
    setDateFrom('');
    setDateTo('');
  };

  // ===== Calendario por sala (simple) =====
  const CalendarByRoom = ({ data }) => {
    const groups = useMemo(() => {
      const g = {};
      data.forEach((r) => {
        if (!g[r.room]) g[r.room] = [];
        g[r.room].push(r);
      });
      Object.keys(g).forEach((k) => g[k].sort((a, b) => a.time.localeCompare(b.time)));
      return g;
    }, [data]);

    const rooms = Object.keys(groups);
    if (rooms.length === 0) {
      return (
        <div className="text-center py-10 border border-dashed border-border rounded-xl">
          <Icon name="Calendar" size={32} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No hay citas para los filtros seleccionados.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <section key={room} className="border border-border rounded-xl overflow-hidden">
            <header className="px-4 py-3 bg-muted/40 border-b border-border flex items-center justify-between">
              <div className="font-medium text-foreground">{room}</div>
              <span className="text-xs text-muted-foreground">{groups[room].length} citas</span>
            </header>
            <ul className="divide-y divide-border">
              {groups[room].map((r) => (
                <li key={r.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {r.time} •{' '}
                        <button
                          className="text-primary hover:underline"
                          title="Ver ficha del paciente"
                          onClick={() => navigate(`/patients/${r.patientId}?scope=clinic`)}
                        >
                          {r.patient}
                        </button>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {r.doctor} — {r.type} • {r.id}
                      </div>
                    </div>
                    <StatusPill status={r.status} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    );
  };

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

      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}
      >
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
            <Button variant="ghost" className="px-2 py-1" onClick={() => navigate('/clinic-dashboard')}>
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
              <p className="text-muted-foreground">
                Administra las consultas del centro de atención y coordina tu operación diaria.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  /* TODO: export CSV */
                }}
              >
                <Icon name="Download" size={16} />
                Exportar CSV
              </Button>
              <Button onClick={() => navigate('/new-patient-appointment')}>
                <Icon name="CalendarPlus" size={16} className="mr-2" />
                Nueva Cita
              </Button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <StatCard label="Citas hoy" value={kpis.today} icon="Calendar" tone="info" />
            <StatCard label="Realizadas" value={kpis.done} icon="CheckCircle" tone="success" />
            <StatCard label="Pendientes" value={kpis.pend} icon="Clock" tone="warning" />
            <StatCard label="Ocupación salas" value={kpis.roomUsage} icon="Activity" />
          </div>

          {/* Filtros sticky */}
          <div className="sticky top-16 z-10 bg-card/95 backdrop-blur border border-border rounded-xl p-3 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
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

              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full py-2 px-3 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full py-2 px-3 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
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
                variant={activeTab === 'calendar' ? 'default' : 'ghost'}
                className="flex-1 md:flex-none gap-2"
                onClick={() => setActiveTab('calendar')}
              >
                <Icon name="Calendar" size={16} />
                Vista Calendario
              </Button>
              <Button
                variant={activeTab === 'list' ? 'default' : 'ghost'}
                className="flex-1 md:flex-none gap-2"
                onClick={() => setActiveTab('list')}
              >
                <Icon name="List" size={16} />
                Vista Lista
              </Button>
            </div>
          </div>

          {activeTab === 'calendar' ? (
            <CalendarByRoom data={filtered} />
          ) : (
            <>
              {/* Tabla md+ */}
              <div className="hidden md:block rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-12 bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground">
                  <div className="col-span-3">Paciente</div>
                  <div className="col-span-1">Hora</div>
                  <div className="col-span-2">Doctor</div>
                  <div className="col-span-2">Sala/Consultorio</div>
                  <div className="col-span-2">Tipo</div>
                  <div className="col-span-1 text-right">Estado</div>
                  <div className="col-span-1 text-right">Acción</div>
                </div>

                {filtered.map((r) => (
                  <div
                    key={r.id}
                    className="grid grid-cols-12 px-4 py-3 border-t border-border text-sm hover:bg-muted/30"
                  >
                    <div className="col-span-3">
                      <div className="font-medium text-foreground">
                        <button
                          className="text-primary hover:underline"
                          title="Ver ficha del paciente"
                          onClick={() => navigate(`/patients/${r.patientId}?scope=clinic`)}
                        >
                          {r.patient}
                        </button>
                      </div>
                      <div className="text-xs text-muted-foreground">ID: {r.id}</div>
                    </div>
                    <div className="col-span-1">{r.time}</div>
                    <div className="col-span-2">{r.doctor}</div>
                    <div className="col-span-2">{r.room}</div>
                    <div className="col-span-2">{r.type}</div>
                    <div className="col-span-1 text-right">
                      <StatusPill status={r.status} />
                    </div>
                    <div className="col-span-1 text-right">
                      <div className="inline-flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/patients/${r.patientId}?scope=clinic`)}
                          title="Ver ficha del paciente"
                        >
                          <Icon name="Eye" size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tarjetas móvil */}
              <div className="md:hidden space-y-3">
                {filtered.map((r) => (
                  <div key={r.id} className="rounded-xl border border-border p-3 bg-card">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">
                          <button
                            className="text-primary hover:underline"
                            title="Ver ficha del paciente"
                            onClick={() => navigate(`/patients/${r.patientId}?scope=clinic`)}
                          >
                            {r.patient}
                          </button>{' '}
                          <span className="text-muted-foreground">• {r.time}</span>
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {r.doctor} — {r.room}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {r.type} • {r.id}
                        </div>
                      </div>
                      <StatusPill status={r.status} />
                    </div>

                    <div className="mt-3 flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/patients/${r.patientId}?scope=clinic`)}
                        title="Ver ficha del paciente"
                      >
                        <Icon name="Eye" size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClinicAppointmentsManagement;
