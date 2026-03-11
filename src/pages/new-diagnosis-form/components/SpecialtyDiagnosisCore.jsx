import React from "react";
import { SPECIALTY_DIAGNOSIS_SCHEMAS } from "@/config/diagnosisSchemas";
import DiagnosisSearch from "./DiagnosisSearch";
import Icon from "@/components/AppIcon";
import VoiceRecorderButton from "./VoiceRecorderButton";

const SpecialtyDiagnosisCore = ({ specialtyCode, diagnosisData, setDiagnosisData }) => {
  const schema = SPECIALTY_DIAGNOSIS_SCHEMAS[specialtyCode] || SPECIALTY_DIAGNOSIS_SCHEMAS["GEN"];

  const handleFieldChange = (key, value) => {
    setDiagnosisData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (!schema) return <div className="p-4 text-red-500 font-normal">Error cargando esquema clínico.</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {schema.sections.map((section) => (
        <div key={section.key} className="space-y-5">
          {/* TÍTULO DE SECCIÓN: ÚNICO LUGAR CON NEGRITA/BOLD */}
          <h4 className="flex items-center gap-2 text-xs font-bold text-[#0E39B1] uppercase tracking-widest border-b border-gray-100 pb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0E39B1]"></span>
            {section.label}
          </h4>

          {/* Grid de Campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-6">
            {section.fields?.map((field) => {
              const colSpan = field.type === "textarea" || field.type === "cie10_search" || field.fullWidth
                ? "md:col-span-2 lg:col-span-3" 
                : "col-span-1";

              return (
                <div key={field.key} className={colSpan}>
                  <label className="block text-sm font-normal text-gray-400 mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  
                  {renderField(
                    field, 
                    diagnosisData[field.key], 
                    (val) => handleFieldChange(field.key, val)
                  )}

                  {field.helperText && (
                    <p className="mt-1.5 text-[10px] text-gray-400 font-normal uppercase tracking-tighter">{field.helperText}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- RENDERIZADOR POTENCIADO CON LÓGICA CONDICIONAL ---
function renderField(field, currentValue, onChange, extraActions = null) {
  // Manejo de valores nulos/undefined por seguridad
  const value = currentValue !== undefined && currentValue !== null ? currentValue : "";
  const baseClasses = "w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-normal text-gray-900 focus:ring-1 focus:ring-[#0E39B1] focus:border-[#0E39B1] outline-none transition-all placeholder:text-gray-300";

  switch (field.type) {
    
    // PUNTO 3: ANTECEDENTES CON MARCAJE SÍ/NO + FECHAS
    case "antecedente_toggle":
      const hasHistory = value?.hasHistory || false;
      return (
        <div className="space-y-3">
          <div className="flex gap-1 bg-gray-50 p-1 rounded-xl w-fit border border-gray-100">
            <button 
              onClick={() => onChange({ hasHistory: false, detail: "" })}
              className={`px-4 py-1.5 text-xs rounded-lg transition-all ${!hasHistory ? 'bg-white text-[#0E39B1] border border-gray-100 font-medium' : 'text-gray-400 hover:text-gray-600'}`}
            >
              No
            </button>
            <button 
              onClick={() => onChange({ ...value, hasHistory: true })}
              className={`px-4 py-1.5 text-xs rounded-lg transition-all ${hasHistory ? 'bg-[#0E39B1] text-white font-medium' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Sí
            </button>
          </div>
          {hasHistory && (
            <div className="animate-in slide-in-from-top-2 duration-200">
               <input 
                type="text" 
                className={baseClasses} 
                placeholder={field.placeholder || "Indique fecha y descripción..."}
                value={value.detail || ""}
                onChange={(e) => onChange({ ...value, detail: e.target.value })}
              />
            </div>
          )}
        </div>
      );

    // PUNTO 9: TMN STAGING (Oncología)
    case "tnm_staging":
      return (
        <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
          {['t', 'n', 'm'].map((part) => (
            <div key={part}>
              <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">{part}</label>
              <select 
                className={`${baseClasses} py-1 text-xs`}
                value={value[part] || ""}
                onChange={(e) => onChange({ ...value, [part]: e.target.value })}
              >
                <option value="">-</option>
                {field.options[part]?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          ))}
        </div>
      );

    // PUNTO 4: CARGA DE PARACLÍNICOS (ASISTENTE / MÉDICO)
    case "file_uploader":
      return (
        <div className="group relative border-2 border-dashed border-gray-100 rounded-xl p-4 hover:border-[#0E39B1] hover:bg-blue-50/30 transition-all text-center">
          <input 
            type="file" 
            multiple 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={(e) => onChange([...(value || []), ...Array.from(e.target.files)])}
          />
          <div className="flex flex-col items-center gap-1">
             <Icon name="UploadCloud" size={20} className="text-gray-300 group-hover:text-[#0E39B1]" />
             <span className="text-xs text-gray-500">Subir PDF o Fotos</span>
          </div>
          {value.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {value.map((f, i) => (
                <div key={i} className="bg-white border border-gray-200 px-2 py-1 rounded text-[10px] text-blue-600 flex items-center gap-1">
                  <Icon name="File" size={10} /> {f.name.substring(0, 10)}...
                </div>
              ))}
            </div>
          )}
        </div>
      );

    case "cie10_search":
      return <DiagnosisSearch value={value} onChange={onChange} />;

    case "textarea":
      return (
        <div className="relative group">
          <textarea 
            rows={field.rows || 3} 
            placeholder={field.placeholder} 
            className={`${baseClasses} resize-y pr-10`} 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <VoiceRecorderButton onTranscriptionResult={(text) => onChange((value ? value + " " : "") + text)} />
          </div>
        </div>
      );

    case "select":
      return (
        <div className="relative">
          <select className={`${baseClasses} appearance-none pr-8`} value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="" disabled>{field.placeholder || "Seleccionar..."}</option>
            {field.options?.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <div className="absolute right-3 top-3 pointer-events-none text-gray-400"><Icon name="ChevronDown" size={16} /></div>
        </div>
      );

    case "number":
      return (
        <div className="relative">
          <input type="number" className={baseClasses} value={value} onChange={(e) => onChange(e.target.value)} />
          {field.unit && <span className="absolute right-3 top-2.5 text-xs text-gray-400 pointer-events-none">{field.unit}</span>}
        </div>
      );

    case "date":
      return <input type="date" className={baseClasses} value={value} onChange={(e) => onChange(e.target.value)} />;

    default:
      return <input type="text" className={baseClasses} placeholder={field.placeholder} value={value} onChange={(e) => onChange(e.target.value)} />;
  }
}

export default SpecialtyDiagnosisCore;