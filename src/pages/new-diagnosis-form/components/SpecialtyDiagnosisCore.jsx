// src/pages/new-diagnosis-form/components/SpecialtyDiagnosisCore.jsx
import React, { useState, useEffect } from "react";
import { SPECIALTY_DIAGNOSIS_SCHEMAS } from "@/config/diagnosisSchemas";

const SpecialtyDiagnosisCore = ({ specialtyCode }) => {
  const [schema, setSchema] = useState(null);

  useEffect(() => {
    const selectedSchema = SPECIALTY_DIAGNOSIS_SCHEMAS?.[specialtyCode];

    if (selectedSchema) {
      setSchema(selectedSchema);
    } else {
      // valor seguro para evitar errores
      setSchema({ name: "Esquema no encontrado", sections: [] });
    }
  }, [specialtyCode]);

  if (!schema) {
    return (
      <p className="text-sm text-muted-foreground">
        Cargando esquema de diagnóstico...
      </p>
    );
  }

  if (!schema.sections || schema.sections.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay un esquema de diagnóstico definido para esta especialidad (
        {specialtyCode}).
      </p>
    );
  }

  return (
    // IMPORTANTE: ya **no** usamos <form> aquí para evitar anidar formularios
    <div className="space-y-6">
      {schema.sections.map((section) => (
        <div
          key={`${specialtyCode}-${section.key}`}
          className="space-y-3 border border-border rounded-lg bg-card/60 p-4"
        >
          {section.label && (
            <h4 className="text-sm font-semibold text-primary">
              {section.label}
            </h4>
          )}

          {section.fields?.map((field) => (
            <div
              key={`${specialtyCode}-${section.key}-${field.key}`}
              className="space-y-1"
            >
              {field.label && (
                <label
                  htmlFor={`${specialtyCode}-${field.key}`}
                  className="block text-sm font-medium text-foreground"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-destructive ml-0.5">*</span>
                  )}
                </label>
              )}

              {renderField(field, specialtyCode)}
              {field.helperText && (
                <p className="text-xs text-muted-foreground">
                  {field.helperText}
                </p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// ---- Helper para renderizar cada tipo de campo con estilos CLAROS ----
const baseFieldClasses =
  "w-full px-3 py-2 bg-input text-foreground border border-border " +
  "rounded-md focus:outline-none focus:ring-2 focus:ring-primary " +
  "focus:border-transparent";

function renderField(field, specialtyCode) {
  const id = `${specialtyCode}-${field.key}`;
  const type = field.type?.toLowerCase?.() || "text";

  switch (type) {
    case "textarea":
    case "longtext":
      return (
        <textarea
          id={id}
          rows={field.rows || 3}
          placeholder={field.placeholder || ""}
          className={`${baseFieldClasses} resize-y`}
        />
      );

    case "number":
      return (
        <input
          id={id}
          type="number"
          placeholder={field.placeholder || ""}
          className={baseFieldClasses}
        />
      );

    case "select":
      return (
        <select
          id={id}
          defaultValue=""
          className={baseFieldClasses}
        >
          <option value="" disabled>
            {field.placeholder || "Seleccione una opción"}
          </option>
          {field.options?.map((opt) => {
            const value = opt.value ?? opt;
            const label = opt.label ?? opt;
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </select>
      );

    case "checkbox":
      return (
        <div className="flex items-center gap-2">
          <input
            id={id}
            type="checkbox"
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
        </div>
      );

    default:
      // text / shortText / cualquier otro
      return (
        <input
          id={id}
          type="text"
          placeholder={field.placeholder || ""}
          className={baseFieldClasses}
        />
      );
  }
}

export default SpecialtyDiagnosisCore;
