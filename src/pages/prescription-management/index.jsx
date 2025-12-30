// src/pages/prescription-management/index.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

import PrescriptionCard from "@/pages/prescription-management/components/PrescriptionCard";
import PrescriptionFilters from "@/pages/prescription-management/components/PrescriptionFilters";
import PrescriptionTabs from "@/pages/prescription-management/components/PrescriptionTabs";
import PharmacyFinderModal from "@/pages/prescription-management/components/PharmacyFinderModal";
import RenewalRequestModal from "@/pages/prescription-management/components/RenewalRequestModal";

const SPECIALTIES = ["Medicina General", "Pediatría", "Cardiología", "Dermatología"];
const DOCTORS = ["Dr. Carlos Mendoza", "Dra. Ana Rodríguez", "Dr. Luis García", "Dr. María González"];

const fmtDate = (iso) => new Date(iso).toLocaleDateString("es-VE");
const toCSV = (rows) => {
  const header = [
    "ID",
    "Número Receta",
    "Medicamento",
    "Dosis",
    "Frecuencia",
    "Cantidad",
    "Repeticiones",
    "Médico",
    "Especialidad",
    "Emitida",
    "Vence",
    "Estado",
    "Paciente",
  ].join(",");
  const body = rows
    .map((r) =>
      [
        r?.id ?? "",
        r?.prescriptionNumber ?? "",
        r?.medicationName ?? "",
        r?.dosage ?? "",
        r?.frequency ?? "",
        r?.quantity ?? "",
        r?.refills ?? "",
        r?.doctorName ?? "",
        r?.specialty ?? "",
        r?.issueDate ? fmtDate(r.issueDate) : "",
        r?.expiryDate ? fmtDate(r.expiryDate) : "",
        r?.status ?? "",
        r?.patientName ?? "",
      ]
        .map((s) => `"${String(s ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");
  return `${header}\n${body}`;
};

const PrescriptionManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const qs = new URLSearchParams(location.search);

  // ===== Layout: si ?scope=clinic fuerza clínica; si no, usa rol guardado (default patient)
  const scopeClinic = qs.get("scope") === "clinic";
  const storedRole = (localStorage.getItem("userRole") || "patient").toLowerCase();
  const userRole = scopeClinic ? "clinic" : storedRole;

  const isPatient = userRole === "patient";
  const isClinic = userRole === "clinic";
  const isDoctor = userRole === "doctor" || userRole === "specialist";

  // ===== UI
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const searchRef = useRef(null);

  // ===== Estado (paciente/doctor)
  const [activeTab, setActiveTab] = useState(qs.get("tab") || localStorage.getItem("rx_tab") || "issued");
  const [searchQuery, setSearchQuery] = useState(qs.get("q") || "");
  const [sortBy, setSortBy] = useState(qs.get("sort") || "date-desc");
  const [filterBy, setFilterBy] = useState(qs.get("type") || "all");

  // ===== Estado (clínica)
  const [qClinic, setQClinic] = useState(qs.get("qc") || "");
  const [specClinic, setSpecClinic] = useState(qs.get("spec") || "");
  const [docClinic, setDocClinic] = useState(qs.get("doc") || "");

  // ===== Modales
  const [isPharmacyModalOpen, setIsPharmacyModalOpen] = useState(false);
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // ===== Datos mock
  const [prescriptions, setPrescriptions] = useState([]);
  useEffect(() => {
    setPrescriptions([
      {
        id: "RX001",
        prescriptionNumber: "CMV-2025-001234",
        medicationName: "Losartán",
        dosage: "50mg",
        frequency: "Una vez al día",
        quantity: "30",
        refills: "2",
        doctorName: "Dr. Carlos Mendoza",
        specialty: "Cardiología",
        issueDate: "2025-08-15T10:30:00Z",
        expiryDate: "2025-11-15T23:59:59Z",
        status: "issued",
        type: "cardiovascular",
        patientId: "101",
        patientName: "María Elena González",
      },
      {
        id: "RX002",
        prescriptionNumber: "CMV-2025-001235",
        medicationName: "Amoxicilina",
        dosage: "500mg",
        frequency: "Cada 8 horas",
        quantity: "21",
        refills: "0",
        doctorName: "Dra. Ana Rodríguez",
        specialty: "Medicina General",
        issueDate: "2025-08-10T14:15:00Z",
        expiryDate: "2025-09-10T23:59:59Z",
        status: "issued",
        type: "antibiotics",
        patientId: "102",
        patientName: "José Antonio Pérez",
      },
      {
        id: "RX003",
        prescriptionNumber: "CMV-2025-001236",
        medicationName: "Metformina",
        dosage: "850mg",
        frequency: "Dos veces al día",
        quantity: "60",
        refills: "3",
        doctorName: "Dr. Luis García",
        specialty: "Endocrinología",
        issueDate: "2025-07-20T09:00:00Z",
        expiryDate: "2025-10-20T23:59:59Z",
        status: "dispensed",
        type: "diabetes",
        pharmacyInfo: { name: "Farmacia Central", address: "Av. F. de Miranda" },
        dispensedDate: "2025-07-22T16:30:00Z",
        patientId: "103",
        patientName: "Carmen Rosa Martínez",
      },
      {
        id: "RX004",
        prescriptionNumber: "CMV-2025-001237",
        medicationName: "Ibuprofeno",
        dosage: "400mg",
        frequency: "Cada 6-8 horas",
        quantity: "20",
        refills: "0",
        doctorName: "Dr. María González",
        specialty: "Traumatología",
        issueDate: "2025-06-15T11:45:00Z",
        expiryDate: "2025-07-15T23:59:59Z",
        status: "expired",
        type: "pain-relief",
        patientId: "104",
        patientName: "Ricardo Alejandro Silva",
      },
    ]);
  }, []);

  // ===== Persistir pestaña y sincronizar QS
  useEffect(() => localStorage.setItem("rx_tab", activeTab), [activeTab]);

  useEffect(() => {
    const next = new URLSearchParams(location.search);
    if (scopeClinic) {
      next.set("scope", "clinic");
      qClinic ? next.set("qc", qClinic) : next.delete("qc");
      specClinic ? next.set("spec", specClinic) : next.delete("spec");
      docClinic ? next.set("doc", docClinic) : next.delete("doc");
    } else {
      activeTab ? next.set("tab", activeTab) : next.delete("tab");
      searchQuery ? next.set("q", searchQuery) : next.delete("q");
      sortBy ? next.set("sort", sortBy) : next.delete("sort");
      filterBy && filterBy !== "all" ? next.set("type", filterBy) : next.delete("type");
    }
    const newUrl = `${location.pathname}?${next.toString()}`;
    if (newUrl !== `${location.pathname}${location.search ? `?${location.search.slice(1)}` : ""}`) {
      window.history.replaceState(null, "", newUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, searchQuery, sortBy, filterBy, qClinic, specClinic, docClinic, scopeClinic]);

  // ===== Filtrado datos
  const filteredPrescriptions = useMemo(() => {
    const byTab = prescriptions.filter((p) => p.status === activeTab);
    const byText = !searchQuery
      ? byTab
      : byTab.filter((p) => {
          const q = searchQuery.toLowerCase();
          return (
            p.medicationName.toLowerCase().includes(q) ||
            p.doctorName.toLowerCase().includes(q) ||
            p.prescriptionNumber.toLowerCase().includes(q) ||
            (p.patientName || "").toLowerCase().includes(q)
          );
        });
    const byType = filterBy === "all" ? byText : byText.filter((p) => p.type === filterBy);
    return [...byType].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.issueDate) - new Date(a.issueDate);
        case "date-asc":
          return new Date(a.issueDate) - new Date(b.issueDate);
        case "medication":
          return a.medicationName.localeCompare(b.medicationName);
        case "doctor":
          return a.doctorName.localeCompare(b.doctorName);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  }, [prescriptions, activeTab, searchQuery, sortBy, filterBy]);

  const clinicFiltered = useMemo(() => {
    const all = prescriptions;
    const byText = !qClinic
      ? all
      : all.filter((p) => {
          const q = qClinic.toLowerCase();
          return (
            p.medicationName.toLowerCase().includes(q) ||
            p.doctorName.toLowerCase().includes(q) ||
            p.prescriptionNumber.toLowerCase().includes(q) ||
            (p.patientName || "").toLowerCase().includes(q)
          );
        });
    const bySpec = specClinic ? byText.filter((p) => p.specialty === specClinic) : byText;
    const byDoc = docClinic ? bySpec.filter((p) => p.doctorName === docClinic) : bySpec;
    return [...byDoc].sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
  }, [prescriptions, qClinic, specClinic, docClinic]);

  const counts = useMemo(
    () => ({
      issued: prescriptions.filter((p) => p.status === "issued").length,
      dispensed: prescriptions.filter((p) => p.status === "dispensed").length,
      expired: prescriptions.filter((p) => p.status === "expired").length,
    }),
    [prescriptions]
  );

  // ===== Acciones
  const exportCSV = () => {
    const rows = scopeClinic ? clinicFiltered : filteredPrescriptions;
    const csv = toCSV(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recetas-${scopeClinic ? "clinica" : activeTab}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearPatientFilters = () => {
    setSearchQuery("");
    setSortBy("date-desc");
    setFilterBy("all");
  };
  const clearClinicFilters = () => {
    setQClinic("");
    setSpecClinic("");
    setDocClinic("");
  };

  // ====== Layout común con Header + Sidebar (siempre)
  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} onMenuToggle={() => setMobileSidebarOpen(true)} />

      <Sidebar
        userRole={userRole}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((s) => !s)}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Migas */}
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            {isClinic ? (
              <Button variant="ghost" className="px-2 py-1" onClick={() => navigate("/clinic-dashboard")}>
                <Icon name="Home" size={16} className="mr-2" />
                Panel Principal
              </Button>
            ) : isPatient ? (
              <Button variant="ghost" className="px-2 py-1" onClick={() => navigate("/patient-dashboard")}>
                <Icon name="Home" size={16} className="mr-2" />
                Panel del Paciente
              </Button>
            ) : (
              <Button variant="ghost" className="px-2 py-1" onClick={() => navigate("/professional-dashboard")}>
                <Icon name="BarChart3" size={16} className="mr-2" />
                Panel Profesional
              </Button>
            )}
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground font-medium">
              {isPatient ? "Mis Recetas" : "Gestión de Recetas"}
            </span>
          </div>

          {/* Encabezado y acciones */}
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                {isPatient ? "Mis Recetas" : "Gestión de Recetas"}
              </h1>
              <p className="text-muted-foreground">
                {isClinic
                  ? "Recetas del centro — filtra por especialidad y médico"
                  : isPatient
                  ? "Administra tus prescripciones, renueva y encuentra farmacias cercanas"
                  : "Administra las prescripciones de tus pacientes y gestiona dispensas"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!isClinic && (
                <Button variant="outline" onClick={() => navigate("/medical-history")} className="gap-2">
                  <Icon name="FileText" size={16} />
                  Historial Médico
                </Button>
              )}
              <Button variant="outline" onClick={exportCSV} className="gap-2">
                <Icon name="Download" size={16} />
                Exportar CSV
              </Button>
            </div>
          </div>

          {/* ===== Vista CLÍNICA */}
          {scopeClinic ? (
            <>
              <div className="rounded-xl border border-border bg-card p-3 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2 relative">
                    <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      ref={searchRef}
                      value={qClinic}
                      onChange={(e) => setQClinic(e.target.value)}
                      placeholder="Buscar por medicamento, médico, paciente o Nº de receta…"
                      className="w-full pl-9 pr-3 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <select
                    value={specClinic}
                    onChange={(e) => setSpecClinic(e.target.value)}
                    className="w-full py-2 px-3 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Especialidad (todas)</option>
                    {SPECIALTIES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <select
                    value={docClinic}
                    onChange={(e) => setDocClinic(e.target.value)}
                    className="w-full py-2 px-3 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Médico (todos)</option>
                    {DOCTORS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="hidden md:block rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-12 bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground">
                  <div className="col-span-3">Medicamento</div>
                  <div className="col-span-2">Paciente</div>
                  <div className="col-span-2">Médico</div>
                  <div className="col-span-2">Especialidad</div>
                  <div className="col-span-2">Emitida</div>
                  <div className="col-span-1 text-right">Estado</div>
                </div>
                {clinicFiltered.map((rx) => (
                  <div key={rx.id} className="grid grid-cols-12 px-4 py-3 border-t border-border text-sm hover:bg-muted/30">
                    <div className="col-span-3">
                      <div className="font-medium text-foreground">{rx.medicationName}</div>
                      <div className="text-xs text-muted-foreground">{rx.prescriptionNumber}</div>
                    </div>
                    <div className="col-span-2">
                      <button
                        className="text-primary hover:underline"
                        onClick={() => rx.patientId && navigate(`/patients/${rx.patientId}`)}
                        title="Ver ficha del paciente"
                      >
                        {rx.patientName || "—"}
                      </button>
                    </div>
                    <div className="col-span-2">{rx.doctorName}</div>
                    <div className="col-span-2">{rx.specialty}</div>
                    <div className="col-span-2">{fmtDate(rx.issueDate)}</div>
                    <div className="col-span-1 text-right capitalize">{rx.status}</div>
                  </div>
                ))}
                {clinicFiltered.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No hay recetas para los filtros seleccionados.
                  </div>
                )}
              </div>

              <div className="md:hidden space-y-3">
                {clinicFiltered.map((rx) => (
                  <div key={rx.id} className="rounded-xl border border-border p-3 bg-card">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <div className="font-medium text-foreground">{rx.medicationName}</div>
                        <div className="text-xs text-muted-foreground">{rx.prescriptionNumber}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {rx.doctorName} — {rx.specialty}
                        </div>
                        <div className="mt-1 text-xs">
                          Paciente:{" "}
                          <button
                            className="text-primary hover:underline"
                            onClick={() => rx.patientId && navigate(`/patients/${rx.patientId}`)}
                          >
                            {rx.patientName || "—"}
                          </button>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted capitalize">{rx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* ===== Vista PACIENTE / MÉDICO (con tabs) */
            <>
              <PrescriptionTabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />

              <PrescriptionFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                filterBy={filterBy}
                onFilterChange={setFilterBy}
                onClearFilters={clearPatientFilters}
                inputRef={searchRef}
              />

              {filteredPrescriptions.length > 0 && (
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {filteredPrescriptions.length} de {prescriptions.filter((p) => p.status === activeTab).length} recetas
                    {searchQuery && ` para "${searchQuery}"`}
                  </p>
                  <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2">
                    <Icon name="Download" size={16} />
                    Exportar CSV
                  </Button>
                </div>
              )}

              {filteredPrescriptions.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredPrescriptions.map((rx) => (
                    <PrescriptionCard
                      key={rx.id}
                      prescription={rx}
                      onFindPharmacy={() => {
                        setSelectedPrescription(rx);
                        setIsPharmacyModalOpen(true);
                      }}
                      onDownload={() => {
                        const payload = `Receta Médica\n\nNº: ${rx.prescriptionNumber}\nMedicamento: ${rx.medicationName}\nDosis: ${rx.dosage}\nFrecuencia: ${rx.frequency}\nCantidad: ${rx.quantity}\nMédico: ${rx.doctorName}\nPaciente: ${rx.patientName}\nEmitida: ${fmtDate(rx.issueDate)}`;
                        const blob = new Blob([payload], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `receta-${rx.prescriptionNumber}.txt`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      onShare={() => {
                        const text = `Receta: ${rx.medicationName} (${rx.dosage}) — ${rx.doctorName} — Nº ${rx.prescriptionNumber}`;
                        if (navigator.share) navigator.share({ title: `Receta ${rx.prescriptionNumber}`, text, url: window.location.href });
                        else navigator.clipboard?.writeText(text)?.then(() => alert("Información copiada"));
                      }}
                      onRenewRequest={() => {
                        setSelectedPrescription(rx);
                        setIsRenewalModalOpen(true);
                      }}
                      onClickPatient={() => rx.patientId && navigate(`/patients/${rx.patientId}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                    <Icon name={activeTab === "issued" ? "FileText" : activeTab === "dispensed" ? "CheckCircle" : "Clock"} size={32} color="var(--color-muted-foreground)" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {activeTab === "issued"
                      ? "No tienes recetas emitidas"
                      : activeTab === "dispensed"
                      ? "No tienes recetas dispensadas"
                      : "No tienes recetas expiradas"}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {activeTab === "issued"
                      ? "Las recetas activas aparecerán aquí cuando sean prescritas por tu médico."
                      : activeTab === "dispensed"
                      ? "Las recetas retiradas de la farmacia aparecerán aquí."
                      : "Las recetas vencidas aparecerán aquí para que puedas solicitar renovaciones."}
                  </p>
                  {activeTab === "issued" && (
                    <Button variant="default" onClick={() => navigate("/doctor-discovery")} className="gap-2">
                      <Icon name="Search" size={16} />
                      Buscar Médicos
                    </Button>
                  )}
                </div>
              )}
            </>
          )}

          {/* Modales (siempre montados) */}
          <PharmacyFinderModal isOpen={isPharmacyModalOpen} onClose={() => setIsPharmacyModalOpen(false)} prescription={selectedPrescription} />
          <RenewalRequestModal isOpen={isRenewalModalOpen} onClose={() => setIsRenewalModalOpen(false)} prescription={selectedPrescription} />
        </div>
      </main>
    </div>
  );
};

export default PrescriptionManagement;
