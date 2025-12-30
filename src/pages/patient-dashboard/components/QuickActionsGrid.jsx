// src/pages/patient-dashboard/components/QuickActionsGrid.jsx
import React, { useMemo, useRef } from "react";
import Icon from "@/components/AppIcon"; // mantiene tu icon system
import { cn } from "@/utils/cn";        // si no lo usas, puedes remover este import

/**
 * QuickActionsGrid
 * - Móvil: carrusel horizontal con snap.
 * - Desktop: grid responsivo.
 * - onActionClick(action) se mantiene.
 *
 * Props:
 *  - className?: string
 *  - onActionClick?: (action) => void
 *  - actions?: { key, label, href, icon }[]
 */
const QuickActionsGrid = ({ className = "", onActionClick, actions }) => {
  const trackRef = useRef(null);

  // Acciones por defecto (puedes editar los href según tus rutas)
  const items = useMemo(
    () =>
      actions?.length
        ? actions
        : [
            { key: "new_appointment", label: "Nueva Cita", icon: "CalendarPlus", href: "/appointment-booking" },
            { key: "prescriptions",   label: "Mis Recetas", icon: "Pill",          href: "/prescription-management" },
            { key: "medical_history", label: "Historial",   icon: "FileText",      href: "/medical-history" },
            { key: "marketplace",     label: "Marketplace", icon: "ShoppingBag",   href: "/marketplace" },
            { key: "payments",        label: "Reembolsos",  icon: "CreditCard",    href: "/payment-processing" },
            { key: "upload_docs",     label: "Subir Soporte",icon: "Upload",       href: "/patient/reimbursements/upload" },
          ],
    [actions]
  );

  const handleClick = (it) => {
    // Navegación simple sin romper contratos
    try {
      if (typeof onActionClick === "function") onActionClick(it);
      if (it?.href) window.location.href = it.href;
    } catch (_) {}
  };

  const scrollByCards = (dir = 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-qa-card]");
    const delta = card ? card.getBoundingClientRect().width + 16 : 260;
    el.scrollBy({ left: dir * delta * 2, behavior: "smooth" });
  };

  return (
    <section className={cn("w-full", className)}>
      {/* Encabezado opcional */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Accesos Rápidos</h3>

        {/* Flechas: visibles solo en móvil/tablet (ocultas en lg) */}
        <div className="flex gap-2 lg:hidden">
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => scrollByCards(-1)}
            className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center active:scale-95"
          >
            <Icon name="ChevronLeft" size={16} />
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={() => scrollByCards(1)}
            className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center active:scale-95"
          >
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>
      </div>

      {/* Track móvil: carrusel con snap */}
      <div className="lg:hidden -mx-4 px-4">
        <div
          ref={trackRef}
          className="
            flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory
            scroll-px-4 touch-pan-x
          "
          role="list"
          aria-label="Accesos rápidos"
        >
          {items.map((it) => (
            <button
              key={it.key}
              data-qa-card
              onClick={() => handleClick(it)}
              className="
                snap-start shrink-0 w-[220px]
                bg-card border border-border rounded-2xl
                p-4 text-left hover:bg-muted/40 transition-colors
                focus:outline-none focus:ring-2 focus:ring-primary/40
              "
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon name={it.icon} size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{it.label}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {it.key === "new_appointment" && "Agenda en minutos"}
                    {it.key === "prescriptions" && "Ver y renovar"}
                    {it.key === "medical_history" && "Tus registros clínicos"}
                    {it.key === "marketplace" && "Servicios y productos"}
                    {it.key === "payments" && "Pagos y reembolsos"}
                    {it.key === "upload_docs" && "Sube soportes de gasto"}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Grid desktop */}
      <div
        className="
          hidden lg:grid
          grid-cols-2 xl:grid-cols-3 gap-4
        "
        role="list"
      >
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => handleClick(it)}
            className="
              bg-card border border-border rounded-2xl p-4 text-left
              hover:bg-muted/40 transition-colors
              focus:outline-none focus:ring-2 focus:ring-primary/40
            "
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon name={it.icon} size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{it.label}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {it.key === "new_appointment" && "Agenda en minutos"}
                  {it.key === "prescriptions" && "Ver y renovar"}
                  {it.key === "medical_history" && "Tus registros clínicos"}
                  {it.key === "marketplace" && "Servicios y productos"}
                  {it.key === "payments" && "Pagos y reembolsos"}
                  {it.key === "upload_docs" && "Sube soportes de gasto"}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickActionsGrid;
