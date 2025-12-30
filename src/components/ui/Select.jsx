// src/components/ui/Select.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check, Search, X } from "lucide-react";
import Button from "./Button";
import Input from "./Input";
// Ajusta esta ruta si tu util 'cn' vive en otra carpeta:
import { cn } from "../../utils/cn";

/**
 * Select con menú portalizado (ideal para modales con overflow).
 * Props relevantes:
 * - options: [{ value, label, disabled?, description? }]
 * - value: string | string[]
 * - multiple: boolean
 * - searchable, clearable, loading
 * - portal (true por defecto): si es false renderiza el menú inline
 * - menuClassName, zIndex (por si quieres ajustar)
 */
const Select = React.forwardRef(function Select(
  {
    className,
    options = [],
    value,
    placeholder = "Seleccionar opción",
    multiple = false,
    disabled = false,
    required = false,
    label,
    description,
    error,
    searchable = false,
    clearable = false,
    loading = false,
    id,
    name,
    onChange,
    onOpenChange,
    portal = true,
    menuClassName,
    zIndex = 1000,
  },
  ref
) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuStyle, setMenuStyle] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef(null);
  const internalBtnRef = ref || btnRef;

  const selectId = useMemo(
    () => id || `select-${Math.random().toString(36).slice(2, 9)}`,
    [id]
  );

  // Opciones filtradas por búsqueda
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm) return options;
    const q = searchTerm.toLowerCase();
    return options.filter(
      (o) =>
        o?.label?.toLowerCase().includes(q) ||
        String(o?.value ?? "").toLowerCase().includes(q)
    );
  }, [options, searchable, searchTerm]);

  const hasValue = multiple
    ? Array.isArray(value) && value.length > 0
    : value !== undefined && value !== null && value !== "";

  const displayValue = useMemo(() => {
    if (!hasValue) return placeholder;
    if (multiple) {
      const selected = options.filter((o) => value?.includes(o.value));
      if (selected.length === 0) return placeholder;
      if (selected.length === 1) return selected[0].label;
      return `${selected.length} opciones seleccionadas`;
    }
    const found = options.find((o) => o.value === value);
    return found ? found.label : placeholder;
  }, [hasValue, multiple, options, placeholder, value]);

  const open = () => {
    if (disabled) return;
    setIsOpen(true);
    onOpenChange?.(true);
  };

  const close = () => {
    setIsOpen(false);
    onOpenChange?.(false);
    setSearchTerm("");
  };

  const toggle = () => (isOpen ? close() : open());

  const commitChange = (nextValue) => {
    onChange?.(nextValue);
  };

  const onSelectOption = (opt) => {
    if (multiple) {
      const base = Array.isArray(value) ? value : [];
      const exists = base.includes(opt.value);
      const next = exists ? base.filter((v) => v !== opt.value) : [...base, opt.value];
      commitChange(next);
    } else {
      commitChange(opt.value);
      close();
    }
  };

  const isSelected = (val) => (multiple ? value?.includes(val) : value === val);

  // Posicionar el menú (portal/fixed) bajo el botón
  const updateMenuPosition = () => {
    if (!internalBtnRef?.current) return;
    const rect = internalBtnRef.current.getBoundingClientRect();
    setMenuStyle({
      top: Math.round(rect.bottom + 4), // 4px de separación
      left: Math.round(rect.left),
      width: Math.round(rect.width),
    });
  };

  // Reposicionar al abrir / en scroll / resize / cambio de fonts
  useEffect(() => {
    if (!isOpen) return;
    updateMenuPosition();
    const onWin = () => updateMenuPosition();
    window.addEventListener("resize", onWin);
    window.addEventListener("scroll", onWin, true); // true: captura scroll en contenedores
    const ro = new ResizeObserver(onWin);
    ro.observe(document.documentElement);
    return () => {
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Clic afuera + Escape
  useEffect(() => {
    if (!isOpen) return;
    const onClick = (e) => {
      if (!internalBtnRef.current) return;
      const menuEl = document.getElementById(`${selectId}-menu`);
      const insideBtn = internalBtnRef.current.contains(e.target);
      const insideMenu = menuEl?.contains(e.target);
      if (!insideBtn && !insideMenu) close();
    };
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const MenuContent = (
    <div
      id={`${selectId}-menu`}
      className={cn(
        "bg-white text-black border border-border rounded-md shadow-md",
        "max-h-60 overflow-auto py-1",
        menuClassName
      )}
      style={
        portal
          ? {
              position: "fixed",
              top: menuStyle.top,
              left: menuStyle.left,
              width: menuStyle.width,
              zIndex,
            }
          : {}
      }
      role="listbox"
      aria-labelledby={selectId}
    >
      {searchable && (
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      )}

      {filteredOptions.length === 0 ? (
        <div className="px-3 py-2 text-sm text-muted-foreground">
          {searchTerm ? "Sin resultados" : "Sin opciones"}
        </div>
      ) : (
        filteredOptions.map((opt) => (
          <div
            key={opt.value}
            onClick={() => !opt.disabled && onSelectOption(opt)}
            className={cn(
              "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none",
              "hover:bg-accent hover:text-accent-foreground",
              isSelected(opt.value) && "bg-primary text-primary-foreground",
              opt.disabled && "pointer-events-none opacity-50"
            )}
            role="option"
            aria-selected={isSelected(opt.value)}
          >
            <span className="flex-1">{opt.label}</span>
            {multiple && isSelected(opt.value) && <Check className="h-4 w-4" />}
            {opt.description && (
              <span className="text-xs text-muted-foreground ml-2">{opt.description}</span>
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className={cn("relative", className)}>
      {label && (
        <label
          htmlFor={selectId}
          className={cn(
            "text-sm font-medium leading-none mb-2 block",
            error ? "text-destructive" : "text-foreground"
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          ref={internalBtnRef}
          id={selectId}
          type="button"
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input",
            "bg-white text-black px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus:ring-destructive",
            !hasValue && "text-muted-foreground"
          )}
          onClick={toggle}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="truncate">{displayValue}</span>

          <div className="flex items-center gap-1">
            {loading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                {/* Path corregido (arc flags válidos) */}
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291
                     A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}

            {clearable && hasValue && !loading && (
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4"
                onClick={(e) => {
                  e.stopPropagation();
                  commitChange(multiple ? [] : "");
                }}
                aria-label="Limpiar selección"
              >
                <X className="h-3 w-3" />
              </Button>
            )}

            <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
          </div>
        </button>

        {/* Select nativo oculto (para formularios) */}
        <select
          name={name}
          value={multiple ? (Array.isArray(value) ? value : []) : value || ""}
          onChange={() => {}}
          className="sr-only"
          tabIndex={-1}
          multiple={multiple}
          required={required}
          aria-hidden="true"
        >
          {!multiple && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Menú: portalizado o inline */}
        {isOpen &&
          (portal
            ? createPortal(MenuContent, document.body)
            : (
              <div
                className="absolute w-full mt-1 z-[999]"
                // En inline no usamos fixed, sólo aseguramos un zIndex alto
                style={{ zIndex }}
              >
                {MenuContent}
              </div>
            ))}
      </div>

      {description && !error && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
});

export default Select;
