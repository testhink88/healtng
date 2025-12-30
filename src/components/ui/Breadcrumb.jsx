import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react"; // Puedes usar otro ícono si prefieres

/**
 * Componente Breadcrumb (mejorado)
 * - Soporta rutas dinámicas y fallback si no se pasan props
 * - Evita crash por .map() en undefined
 * - Incluye separador visual y estilo básico de navegación
 */
const Breadcrumb = ({ items = [], separator = <ChevronRight size={14} />, className = "" }) => {
  // Si no hay items, mostramos un fallback sencillo
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <nav className={`flex items-center text-sm text-muted-foreground ${className}`}>
        <span className="font-medium text-foreground">Inicio</span>
      </nav>
    );
  }

  return (
    <nav className={`flex items-center text-sm text-muted-foreground ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center">
            {item.href ? (
              <Link
                to={item.href}
                className={`hover:text-foreground ${isLast ? "font-semibold text-foreground" : ""}`}
              >
                {item.label}
              </Link>
            ) : (
              <span className={`text-foreground ${isLast ? "font-semibold" : ""}`}>
                {item.label}
              </span>
            )}

            {!isLast && <span className="mx-2 text-muted-foreground">{separator}</span>}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
