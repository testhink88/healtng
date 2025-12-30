import React from "react";

// Funciones de Utilidad
function labelByType(t) {
  return {
    appointment: "Cita Médica",
    diagnosis: "Diagnóstico",
    rx: "Receta Farmacológica",
    lab: "Resultado Laboratorio",
    referral: "Interconsulta",
    note: "Nota Clínica",
  }[t] || t;
}

function colorByType(t) {
  return {
    appointment: "bg-blue-500",
    diagnosis: "bg-amber-500",
    rx: "bg-emerald-600",
    lab: "bg-purple-600",
    referral: "bg-cyan-600",
    note: "bg-slate-400",
  }[t] || "bg-slate-400";
}

function IconByType({ type, className = "h-4 w-4" }) {
  const icons = {
    appointment: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    // Otros íconos como diagnóstico, receta, laboratorio, etc.
  };
  return icons[type] || null;
}

function formatMeta(meta) {
  if (!meta || Object.keys(meta).length === 0) return null;

  const entries = Object.entries(meta).map(([key, value]) => {
    let label = key;
    let val = value;

    if (key === 'doctor') label = 'Médico';
    if (key === 'waitMin') {
      label = 'Espera';
      val = `${value} min`;
    }
    if (key === 'durationMin') {
      label = 'Duración';
      val = `${value} min`;
    }

    return (
      <span key={key} className="flex items-center text-xs text-muted-foreground mr-4">
        <span className="font-semibold text-foreground mr-1">{label}:</span> {val}
      </span>
    );
  });

  return (
    <div className="flex flex-wrap mt-2 pt-2 border-t border-border/70">
      {entries}
    </div>
  );
}

/**
 * Componente principal PatientJourneyFlow
 * Props:
 * - items: [{ type, at, title, status, meta }]
 */
export default function PatientJourneyFlow({ items = [] }) {
  // Aseguramos que 'at' sea una fecha, no una cadena formateada si viene del padre
  const sorted = [...items].sort((a, b) => new Date(a.at) - new Date(b.at));

  return (
    <ol className="relative border-s border-border pl-6 space-y-6">
      {sorted.map((it, idx) => {
        // Formato de fecha
        const date = new Date(it.at);
        const formattedDate = date.toLocaleDateString('es-VE', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        });
        const formattedTime = date.toLocaleTimeString('es-VE', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        // Clase de estado para badges (simulación)
        const statusClass = it.status === 'completed' 
          ? 'bg-emerald-100 text-emerald-800'
          : it.status === 'no_show'
          ? 'bg-red-100 text-red-800'
          : 'bg-muted/60 text-muted-foreground';

        return (
          <li key={idx} className="relative">
            {/* Punto de la línea de tiempo con icono */}
            <span className={`absolute -start-3.5 mt-1.5 p-1 rounded-full border-4 border-background ${colorByType(it.type)} text-white shadow-md`}>
                <IconByType type={it.type} className="h-4 w-4" />
            </span>

            {/* Contenido del evento */}
            <div className="bg-card hover:bg-muted/40 rounded-lg border border-border p-4 transition-colors duration-200">
              <div className="flex justify-between items-start mb-1">
                <div className="text-base font-semibold text-foreground">
                  <span className={`text-sm font-medium mr-2 text-primary/80`}>{labelByType(it.type)}:</span>
                  {it.title}
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap pt-1">
                    {formattedDate} <span className="font-medium text-foreground ml-1">{formattedTime}</span>
                </div>
              </div>

              {/* Estado (Badge) */}
              {it.status && (
                <span className={`inline-block px-2 py-0.5 text-[10px] font-medium uppercase rounded-full ${statusClass} mr-2`}>
                  {it.status}
                </span>
              )}

              {/* Metadatos formateados */}
              {formatMeta(it.meta)}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
