import React, { useState, useMemo, useEffect } from "react";
import Icon from "@/components/AppIcon";
// 1. Importamos la base oficial
import { CIE10_CATALOG } from "@/data/cie10_catalog";

const DiagnosisSearch = ({ label, value, onChange, required }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  // 2. Estado para diagnósticos personalizados (simulando base de datos aprendida)
  const [customDiagnoses, setCustomDiagnoses] = useState([]);

  // Cargar diagnósticos aprendidos al iniciar
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("LEARNED_DIAGNOSES") || "[]");
    setCustomDiagnoses(saved);
  }, []);

  // Visualización del valor seleccionado
  const displayValue = value?.name 
    ? (value.code ? `${value.code} - ${value.name}` : value.name) 
    : (value || "");

  // 3. Lógica de Filtrado Híbrida (Oficial + Aprendido)
  const filteredDiagnoses = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const lowerTerm = searchTerm.toLowerCase();
    
    // A. Buscar en Oficiales
    const officialMatches = CIE10_CATALOG.filter((item) => {
      const matchCode = item.code?.toLowerCase().includes(lowerTerm);
      const matchName = item.name.toLowerCase().includes(lowerTerm);
      const matchTerms = item.searchTerms?.includes(lowerTerm);
      return matchCode || matchName || matchTerms;
    });

    // B. Buscar en Aprendidos (Custom)
    const customMatches = customDiagnoses.filter(item => 
      item.name.toLowerCase().includes(lowerTerm)
    );

    // Combinar y limitar
    return [...customMatches, ...officialMatches].slice(0, 10);
  }, [searchTerm, customDiagnoses]);

  const handleSelect = (item) => {
    onChange(item); 
    setSearchTerm("");
    setIsOpen(false);
  };

  // 4. Función para "Aprender" un nuevo diagnóstico
  const handleAddNew = () => {
    const newDiagnosis = {
      code: "N/A", // Código provisional
      name: searchTerm, // Lo que escribió el médico (ej: "Sindrome de burnout severo")
      category: "Personalizado",
      isCustom: true // Bandera para identificarlo
    };

    // Guardar en memoria local
    const updatedCustoms = [newDiagnosis, ...customDiagnoses];
    setCustomDiagnoses(updatedCustoms);
    localStorage.setItem("LEARNED_DIAGNOSES", JSON.stringify(updatedCustoms));

    // Seleccionarlo inmediatamente
    onChange(newDiagnosis);
    setSearchTerm("");
    setIsOpen(false);
    
    // Feedback rápido (opcional, en una app real sería un toast)
    // alert("Diagnóstico agregado a tu base de conocimiento personal.");
  };

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {/* Input de Búsqueda */}
      <div className="relative">
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300 font-medium"
          placeholder={value ? "Buscar otro diagnóstico..." : "Escriba el diagnóstico..."}
          value={isOpen ? searchTerm : displayValue}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === "") onChange(null); 
          }}
          onFocus={() => {
            setIsOpen(true);
            setSearchTerm(""); 
          }}
          // Retrasamos el blur para permitir click en opciones
          onBlur={() => setTimeout(() => setIsOpen(false), 200)} 
        />
        <div className="absolute left-3 top-2.5 text-gray-400">
          <Icon name="Search" size={18} />
        </div>
      </div>

      {/* Menú Desplegable */}
      {isOpen && searchTerm.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto overflow-x-hidden">
          
          {/* A. Lista de Resultados Encontrados */}
          {filteredDiagnoses.map((item, index) => (
            <button
              key={`${item.code}-${index}`}
              type="button"
              className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0 group"
              onClick={() => handleSelect(item)}
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-bold text-gray-900 group-hover:text-blue-700">
                  {item.name}
                </span>
                {item.isCustom ? (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap border border-amber-200">
                    PERSONAL
                  </span>
                ) : (
                  <span className="text-xs font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap group-hover:bg-white group-hover:text-blue-600">
                    {item.code}
                  </span>
                )}
              </div>
              <div className="flex gap-2 mt-1">
                <span className={`text-[10px] uppercase font-bold px-1.5 rounded ${item.isCustom ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50'}`}>
                  {item.category}
                </span>
              </div>
            </button>
          ))}

          {/* B. Opción "Crear Nuevo" (Si no hay match exacto o la lista está vacía) */}
          {/* Siempre mostramos la opción de crear si lo que escribieron no existe exactamente */}
          {!filteredDiagnoses.some(d => d.name.toLowerCase() === searchTerm.toLowerCase()) && (
            <button
              type="button"
              className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-emerald-50 transition-colors border-t border-gray-100 flex items-center gap-3 group"
              onMouseDown={handleAddNew} // Usamos onMouseDown porque ocurre antes que onBlur del input
            >
              <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-emerald-500 group-hover:text-emerald-600 group-hover:bg-emerald-100 transition-all">
                <Icon name="Plus" size={16} />
              </div>
              <div>
                <span className="block text-xs text-gray-500 group-hover:text-emerald-600 font-medium">
                  ¿No encuentras "{searchTerm}"?
                </span>
                <span className="block text-sm font-bold text-gray-900 group-hover:text-emerald-700">
                  Agregar a mi base de datos
                </span>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DiagnosisSearch;