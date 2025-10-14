// src/@/@/pages/patient-list/index.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const PatientList = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const search = new URLSearchParams(location.search);
  const isClinicScope = search.get('scope') === 'clinic';

  const userRole = isClinicScope ? 'clinic' : 'doctor';
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [patients, setPatients] = useState([]);
  const [q, setQ] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [doctor, setDoctor] = useState('');

  // Modo médico: controles extra
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [sortBy, setSortBy] = useState('name');      // 'name' | 'lastVisit'

  // Nombre del médico actual
  const currentDoctor = useMemo(
    () => localStorage.getItem('doctorName') || 'Dr. Pérez',
    []
  );

  // Mock de pacientes (incluye >= 10 del Dr. Pérez)
  useEffect(() => {
    const base = [
      // >= 12 pacientes para Dr. Pérez
      { id: '1',  name: 'María Elena González',   specialty: 'Medicina General', doctor: 'Dr. Pérez',   lastVisit: '2025-01-14', age: 39, gender: 'Femenino', docId: 'V-12345678' },
      { id: '2',  name: 'Carlos López Martín',    specialty: 'Medicina General', doctor: 'Dr. Pérez',   lastVisit: '2025-01-11', age: 58, gender: 'Masculino', docId: 'V-87654321' },
      { id: '3',  name: 'Elena Martínez Ruiz',    specialty: 'Medicina General', doctor: 'Dr. Pérez',   lastVisit: '2025-01-17', age: 32, gender: 'Femenino',  docId: 'V-45678912' },
      { id: '4',  name: 'Roberto Fernández Díaz', specialty: 'Medicina General', doctor: 'Dr. Pérez',   lastVisit: '2025-01-19', age: 67, gender: 'Masculino', docId: 'V-78912345' },
      { id: '5',  name: 'Sofía Jiménez Torres',   specialty: 'Medicina General', doctor: 'Dr. Pérez',   lastVisit: '2025-01-13', age: 8,  gender: 'Femenino',  docId: 'V-34567891' },
      { id: '6',  name: 'Luis Alberto Romero',     specialty: 'Medicina General', doctor: 'Dr. Pérez',   lastVisit: '2025-01-15', age: 44, gender: 'Masculino', docId: 'V-23456789' },
      { id: '7',  name: 'Patricia Salazar',        specialty: 'Medicina General', doctor: 'Dr. Pérez',   lastVisit: '2025-01-09', age: 51, gender: 'Femenino',  docId: 'V-11223344' },
      { id: '8',  name: 'Javier Rojas',            specialty: 'Medicina General', doctor: 'Dr. Pérez',   lastVisit: '2025-01-07', age: 29, gender: 'Masculino', docId: 'V-99887766' },
      { id: '9',  name: 'Camila Pacheco',          specialty: 'Medicina General', doctor: 'Dr. Pérez',   lastVisit: '2025-01-05', age: 26, gender: 'Femenino',  docId: 'V-66778899' },
      { id: '10', name: 'Ignacio Mendoza',         specialty: 'Medicina General', doctor: 'Dr. Pérez',   lastVisit: '2025-01-03', age: 61, gender: 'Masculino', docId: 'V-55667788' },
      { id: '11', name: 'Valentina Bravo',         specialty: 'Medicina General', doctor: 'Dr. Pérez',   lastVisit: '2025-01-18', age: 22, gender: 'Femenino',  docId: 'V-44556677' },
      { id: '12', name: 'Diego Castellanos',       specialty: 'Medicina General', doctor: 'Dr. Pérez',   lastVisit: '2025-01-16', age: 36, gender: 'Masculino', docId: 'V-33445566' },

      // Otras especialidades y médicos
      { id: '13', name: 'José Antonio Pérez',      specialty: 'Pediatría',       doctor: 'Dra. López',   lastVisit: '2025-01-17', age: 12, gender: 'Masculino', docId: 'V-22334455' },
      { id: '14', name: 'Carmen Rosa Martínez',    specialty: 'Cardiología',     doctor: 'Dr. García',   lastVisit: '2025-01-11', age: 45, gender: 'Femenino',  docId: 'V-99887711' },
      { id: '15', name: 'Ricardo Alejandro Silva', specialty: 'Dermatología',    doctor: 'Dra. Rivas',   lastVisit: '2025-01-13', age: 40, gender: 'Masculino', docId: 'V-88990011' },
      { id: '16', name: 'Lucía Navarro',           specialty: 'Pediatría',       doctor: 'Dra. López',   lastVisit: '2025-01-10', age: 6,  gender: 'Femenino',  docId: 'V-77889900' },
    ];

    setPatients(base);
  }, []);

  // Filtro por texto + combos (en modo clínica)
  const baseFiltered = useMemo(() => {
    return patients.filter((p) => {
      const byQ =
        !q ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.docId?.toLowerCase().includes(q.toLowerCase());

      const byS = !isClinicScope || !specialty || p.specialty === specialty;
      const byD = !isClinicScope || !doctor || p.doctor === doctor;

      return byQ && byS && byD;
    });
  }, [patients, q, specialty, doctor, isClinicScope]);

  // Modo médico: limitar a sus pacientes
  const scoped = useMemo(() => {
    if (isClinicScope) return baseFiltered;
    return baseFiltered.filter((p) => p.doctor === currentDoctor);
  }, [baseFiltered, isClinicScope, currentDoctor]);

  // Orden
  const sorted = useMemo(() => {
    const arr = [...scoped];
    if (sortBy === 'name') {
      arr.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    } else if (sortBy === 'lastVisit') {
      arr.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit)); // más reciente primero
    }
    return arr;
  }, [scoped, sortBy]);

  const openProfile = (id) => {
    const suffix = isClinicScope ? '?scope=clinic' : '';
    navigate(`/patients/${id}${suffix}`);
  };

  const clearFilters = () => {
    setQ('');
    setSpecialty('');
    setDoctor('');
  };

  const allSpecialties = useMemo(
    () => Array.from(new Set(patients.map((p) => p.specialty))),
    [patients]
  );
  const allDoctors = useMemo(
    () => Array.from(new Set(patients.map((p) => p.doctor))),
    [patients]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole={userRole}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <Sidebar
        userRole={userRole}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <main className={`pt-16 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="p-6 max-w-6xl mx-auto">
          {/* Título */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {isClinicScope ? 'Pacientes del Centro' : 'Mis Pacientes'}
              </h1>
              <p className="text-muted-foreground">
                {isClinicScope
                  ? 'Listado con filtros por Especialidad y Médico'
                  : `Pacientes asignados a ${currentDoctor}`}
              </p>
            </div>
            <Button variant="outline" onClick={clearFilters}>
              <Icon name="RotateCcw" size={16} className="mr-2" />
              Limpiar Filtros
            </Button>
          </div>

          {/* Filtros */}
          <div className="bg-card rounded-lg border border-border p-4 mb-4">
            <div className={`grid grid-cols-1 ${isClinicScope ? 'md:grid-cols-3' : 'md:grid-cols-3'} gap-3`}>
              <Input
                placeholder="Buscar por nombre o cédula..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                icon="Search"
              />

              {isClinicScope ? (
                <>
                  <select
                    className="w-full py-2 px-3 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                  >
                    <option value="">Especialidad (todas)</option>
                    {allSpecialties.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <select
                    className="w-full py-2 px-3 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                  >
                    <option value="">Médico (todos)</option>
                    {allDoctors.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </>
              ) : (
                // Controles extra para médico
                <>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">Ordenar por</label>
                    <select
                      className="flex-1 py-2 px-3 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="name">Nombre</option>
                      <option value="lastVisit">Última visita</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-end">
                    <div className="inline-flex bg-muted/50 rounded-md p-1">
                      <Button
                        variant={viewMode === 'table' ? 'default' : 'ghost'}
                        className="gap-2"
                        onClick={() => setViewMode('table')}
                        title="Vista lista"
                      >
                        <Icon name="List" size={16} />
                      </Button>
                      <Button
                        variant={viewMode === 'cards' ? 'default' : 'ghost'}
                        className="gap-2"
                        onClick={() => setViewMode('cards')}
                        title="Vista tarjetas"
                      >
                        <Icon name="Grid" size={16} />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* CONTENIDO */}
          {isClinicScope ? (
            // === CLÍNICA: agrupado por especialidad ===
            <div className="space-y-3">
              {allSpecialties.map((grp) => {
                const inGrp = sorted.filter((p) => p.specialty === grp);
                if (inGrp.length === 0) return null;
                return (
                  <div key={grp} className="border border-border rounded-lg">
                    <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-b border-border">
                      <div className="font-medium text-foreground">{grp}</div>
                      <div className="text-xs text-muted-foreground">
                        {inGrp.length} {inGrp.length === 1 ? 'paciente' : 'pacientes'}
                      </div>
                    </div>
                    <ul className="divide-y divide-border">
                      {inGrp.map((p) => (
                        <li key={p.id} className="px-4 py-3 flex items-center justify-between">
                          <div>
                            <button
                              className="text-primary hover:underline font-medium"
                              onClick={() => openProfile(p.id)}
                              title="Ver ficha del paciente"
                            >
                              {p.name}
                            </button>
                            <div className="text-xs text-muted-foreground">{p.doctor}</div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => openProfile(p.id)} title="Ver ficha">
                            <Icon name="ExternalLink" size={16} />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
              {sorted.length === 0 && (
                <div className="p-8 text-center">
                  <Icon name="Users" size={36} className="mx-auto mb-3 text-muted-foreground/60" />
                  <p className="text-muted-foreground">No hay pacientes para los filtros seleccionados.</p>
                </div>
              )}
            </div>
          ) : (
            // === MÉDICO: lista plana o tarjetas ===
            <>
              {viewMode === 'table' ? (
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="hidden md:grid grid-cols-12 bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground">
                    <div className="col-span-6">Paciente</div>
                    <div className="col-span-3">Especialidad</div>
                    <div className="col-span-3 text-right">Última visita</div>
                  </div>
                  {sorted.map((p) => (
                    <div
                      key={p.id}
                      className="grid grid-cols-12 px-4 py-3 border-t border-border text-sm hover:bg-muted/30"
                    >
                      <div className="col-span-12 md:col-span-6 flex items-center gap-2">
                        <button
                          className="text-primary hover:underline font-medium text-left"
                          onClick={() => openProfile(p.id)}
                          title="Ver ficha del paciente"
                        >
                          {p.name}
                        </button>
                        <span className="hidden md:inline text-xs text-muted-foreground">• {p.docId}</span>
                      </div>
                      <div className="col-span-6 md:col-span-3 text-muted-foreground">{p.specialty}</div>
                      <div className="col-span-6 md:col-span-3 text-right text-muted-foreground">
                        {new Date(p.lastVisit).toLocaleDateString('es-VE')}
                      </div>
                    </div>
                  ))}
                  {sorted.length === 0 && (
                    <div className="p-8 text-center">
                      <Icon name="Users" size={36} className="mx-auto mb-3 text-muted-foreground/60" />
                      <p className="text-muted-foreground">No tienes pacientes que coincidan con la búsqueda.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sorted.map((p) => (
                    <div key={p.id} className="border border-border rounded-lg p-4 bg-card">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <div className="font-medium text-foreground truncate">{p.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{p.docId} • {p.gender} • {p.age} años</div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => openProfile(p.id)} title="Ver ficha">
                          <Icon name="ExternalLink" size={16} />
                        </Button>
                      </div>
                      <div className="mt-3 text-sm text-muted-foreground">
                        {p.specialty} • Última visita: {new Date(p.lastVisit).toLocaleDateString('es-VE')}
                      </div>
                    </div>
                  ))}
                  {sorted.length === 0 && (
                    <div className="col-span-full p-8 text-center border border-dashed border-border rounded-lg">
                      <Icon name="Users" size={36} className="mx-auto mb-3 text-muted-foreground/60" />
                      <p className="text-muted-foreground">No tienes pacientes que coincidan con la búsqueda.</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientList;
