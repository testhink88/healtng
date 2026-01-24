import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import { MOCK_PATIENTS } from "@/mock/patients";

const PatientList = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const search = new URLSearchParams(location.search);
  const isClinicScope = search.get("scope") === "clinic";
  const userRole = isClinicScope ? "clinic" : "doctor";

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [patients, setPatients] = useState([]);
  const [q, setQ] = useState("");

  const [viewMode, setViewMode] = useState("table");
  const [sortBy, setSortBy] = useState("lastVisit");

  useEffect(() => {
    const stored = localStorage.getItem("MOCK_PATIENTS");
    if (stored) setPatients(JSON.parse(stored));
    else {
      localStorage.setItem("MOCK_PATIENTS", JSON.stringify(MOCK_PATIENTS));
      setPatients(MOCK_PATIENTS);
    }
  }, []);

  const getPatientStatus = (dateStr) => {
    if (!dateStr) return { label: "Nuevo", pill: "bg-primary/10 text-primary" };

    const days = (new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24);
    if (days < 30) return { label: "Activo", pill: "bg-emerald-500/10 text-emerald-700" };
    if (days < 90) return { label: "Seguimiento", pill: "bg-amber-500/10 text-amber-700" };
    return { label: "Inactivo", pill: "bg-muted text-muted-foreground" };
  };

  const filteredPatients = useMemo(() => {
    let result = [...patients];

    if (q) {
      const lowerQ = q.toLowerCase();
      result = result.filter(
        (p) =>
          (p.name || p.fullName || "").toLowerCase().includes(lowerQ) ||
          (p.docId || p.dni || "").toLowerCase().includes(lowerQ)
      );
    }

    result.sort((a, b) => {
      const aName = (a.name || a.fullName || "").toString();
      const bName = (b.name || b.fullName || "").toString();
      if (sortBy === "name") return aName.localeCompare(bName);
      if (sortBy === "lastVisit") return new Date(b.lastVisit || 0) - new Date(a.lastVisit || 0);
      return 0;
    });

    return result;
  }, [patients, q, sortBy]);

  const openProfile = (id) => {
    const suffix = isClinicScope ? "?scope=clinic" : "";
    navigate(`/patients/${id}${suffix}`);
  };

  const handleQuickEvolution = (e, id) => {
    e.stopPropagation();
    navigate(`/patients/${id}/diagnosis/new`);
  };

  const clearFilters = () => setQ("");

  const searchInput =
    "w-full pl-10 pr-4 py-2.5 bg-muted/40 border border-border rounded-md text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <Sidebar
        userRole={userRole}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <main className={`pt-16 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                {isClinicScope ? "Directorio General" : "Mis Pacientes"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredPatients.length} expedientes registrados
              </p>
            </div>

            <Button
              type="button"
              className="bg-primary text-primary-foreground"
              onClick={() => alert("Funcionalidad para crear paciente nuevo")}
            >
              <Icon name="Plus" size={18} className="mr-2" />
              Nuevo Paciente
            </Button>
          </div>

          {/* Toolbar */}
          <div className="bg-card rounded-lg border border-border p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 justify-between">
              <div className="flex-1 max-w-lg relative">
                <div className="absolute left-3 top-3 text-muted-foreground">
                  <Icon name="Search" size={18} />
                </div>
                <input
                  className={searchInput}
                  placeholder="Buscar por nombre, cédula o historia..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 overflow-x-auto">
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-medium text-muted-foreground uppercase">Orden:</span>
                  <select
                    className="bg-muted/40 border border-border text-sm rounded-md px-2 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="lastVisit">Recientes</option>
                    <option value="name">Alfabético</option>
                  </select>
                </div>

                <div className="flex bg-muted/40 rounded-md p-1 shrink-0 border border-border">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-1.5 rounded-md transition-all ${
                      viewMode === "table" ? "bg-card text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                    aria-label="Vista tabla"
                  >
                    <Icon name="List" size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`p-1.5 rounded-md transition-all ${
                      viewMode === "cards" ? "bg-card text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                    aria-label="Vista tarjetas"
                  >
                    <Icon name="Grid" size={18} />
                  </button>
                </div>

                <Button variant="ghost" onClick={clearFilters}>
                  Limpiar
                </Button>
              </div>
            </div>
          </div>

          {/* Empty */}
          {filteredPatients.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <Icon name="Users" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No se encontraron pacientes</h3>
              <p className="text-muted-foreground text-sm mt-1">Ajusta el criterio de búsqueda.</p>
            </div>
          ) : viewMode === "table" ? (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/30 text-muted-foreground font-medium uppercase text-xs border-b border-border">
                    <tr>
                      <th className="px-6 py-4">Paciente</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4">Última Visita</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {filteredPatients.map((p) => {
                      const status = getPatientStatus(p.lastVisit);
                      const name = p.name || p.fullName;
                      const dni = p.docId || p.dni;

                      return (
                        <tr
                          key={p.id}
                          className="hover:bg-muted/20 transition-colors cursor-pointer group"
                          onClick={() => openProfile(p.id)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold border border-border">
                                {(name || "P").charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium text-foreground">{name}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  {dni} • {p.age ? `${p.age} años` : "—"}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.pill}`}>
                              {status.label}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">
                                {p.lastVisit ? new Date(p.lastVisit).toLocaleDateString("es-VE") : "N/A"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {p.specialty || "General"}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={(e) => handleQuickEvolution(e, p.id)}
                                title="Nueva Evolución"
                                className="text-primary hover:text-primary"
                              >
                                <Icon name="Zap" size={18} />
                              </Button>

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openProfile(p.id);
                                }}
                                title="Ver Perfil"
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Icon name="ChevronRight" size={18} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.map((p) => {
                const status = getPatientStatus(p.lastVisit);
                const name = p.name || p.fullName;
                const dni = p.docId || p.dni;

                return (
                  <div
                    key={p.id}
                    className="bg-card rounded-lg border border-border p-5 hover:bg-muted/10 transition cursor-pointer"
                    onClick={() => openProfile(p.id)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-lg border border-border">
                        {(name || "P").charAt(0)}
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-1 rounded-full uppercase ${status.pill}`}>
                        {status.label}
                      </span>
                    </div>

                    <h3 className="font-semibold text-foreground text-lg mb-1 truncate">{name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{dni}</p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 bg-muted/30 p-2 rounded-md border border-border">
                      <Icon name="Calendar" size={14} />
                      Última: {p.lastVisit ? new Date(p.lastVisit).toLocaleDateString("es-VE") : "Nunca"}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 text-xs justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          openProfile(p.id);
                        }}
                      >
                        Ver ficha
                      </Button>

                      <Button
                        className="flex-1 text-xs justify-center bg-primary text-primary-foreground"
                        onClick={(e) => handleQuickEvolution(e, p.id)}
                      >
                        <Icon name="Zap" size={12} className="mr-1" />
                        Evolucionar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientList;
