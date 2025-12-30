import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Icon from "@/components/AppIcon";

import { RoleGuard } from "@/features/auth";

import { getClinicLots } from "@/api/clinicInventory";

const categoryOptions = [
  { value: "all", label: "Todas las categorías" },
  { value: "medicamentos", label: "Medicamentos" },
  { value: "material-médico", label: "Material Médico" },
  { value: "limpieza y desinfección", label: "Limpieza y desinfección" },
];

const expiryOptions = [
  { value: "all", label: "Todos" },
  { value: "valid", label: "Vigente" },
  { value: "expired", label: "Vencido" },
];

const badgeForExpiry = (s) =>
  s === "expired"
    ? "bg-red-50 text-red-700"
    : "bg-green-50 text-green-700";

const labelForExpiry = (s) => (s === "expired" ? "Vencido" : "Vigente");

const ClinicLotsAndExpiry = () => {
  const navigate = useNavigate();

  const [userRole] = useState(localStorage.getItem("userRole") || "clinic");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [lots, setLots] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    expiry: "all",
  });

  useEffect(() => {
    let cancel = false;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getClinicLots();
        if (!cancel) setLots(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Clinic lots error:", e);
      } finally {
        if (!cancel) setLoading(false);
      }
    };

    load();
    return () => {
      cancel = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = [...(lots || [])];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (l) =>
          l?.productName?.toLowerCase()?.includes(q) ||
          l?.sku?.toLowerCase()?.includes(q)
      );
    }

    if (filters.category !== "all") {
      list = list.filter(
        (l) => String(l?.categoryLabel || "").toLowerCase() === filters.category
      );
    }

    if (filters.expiry !== "all") {
      list = list.filter((l) => l?.expiryStatus === filters.expiry);
    }

    return list;
  }, [lots, filters]);

  return (
    <RoleGuard allowedRoles={["clinic", "clinic_admin"]}>
      <div className="min-h-screen bg-background">
        <Header userRole={userRole} onMenuToggle={() => setIsMobileSidebarOpen(true)} />
        <Sidebar
          userRole={userRole}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />

        <main className={`pt-16 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
          <div className="p-4 lg:p-6">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Lotes y Vencimiento</h1>
                <p className="text-sm text-muted-foreground">
                  Control por lote: código, fechas y cantidades. Umbral “Por vencer”: 30 días.
                </p>
              </div>

              <Button className="flex items-center gap-2">
                <Icon name="PackagePlus" size={16} />
                Recibir Lote
              </Button>
            </div>

            {/* Filtros */}
            <div className="bg-card border border-border rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1">
                  <label className="block text-xs text-muted-foreground mb-1">Buscar</label>
                  <Input
                    placeholder="Producto, SKU o código de lote..."
                    value={filters.search}
                    onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Categoría</label>
                  <select
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    value={filters.category}
                    onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
                  >
                    {categoryOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Vencimiento</label>
                  <select
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    value={filters.expiry}
                    onChange={(e) => setFilters((p) => ({ ...p, expiry: e.target.value }))}
                  >
                    {expiryOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Lista tipo proveedor */}
            <div className="space-y-3">
              {loading ? (
                <div className="p-6 bg-card border border-border rounded-lg text-center text-muted-foreground">
                  <Icon name="Loader" size={20} className="inline mr-2 animate-spin" />
                  Cargando lotes...
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-6 bg-card border border-border rounded-lg text-center text-muted-foreground">
                  No hay lotes para mostrar.
                </div>
              ) : (
                filtered.map((l) => (
                  <div
                    key={l.id}
                    className="bg-card border border-border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="sm">
                        <Icon name="ChevronRight" size={14} />
                      </Button>

                      <div>
                        <div className="font-medium text-foreground">{l.productName}</div>
                        <div className="text-xs text-muted-foreground">
                          SKU: {l.sku} · {l.categoryLabel} · {l.subcategoryLabel}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-sm text-muted-foreground">
                        Total: <span className="text-foreground font-medium">{l.total}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${badgeForExpiry(l.expiryStatus)}`}>
                        {labelForExpiry(l.expiryStatus)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => navigate("/clinic-dashboard")}>
                Volver a Panel de Clínica
              </Button>
            </div>
          </div>
        </main>
      </div>
    </RoleGuard>
  );
};

export default ClinicLotsAndExpiry;
