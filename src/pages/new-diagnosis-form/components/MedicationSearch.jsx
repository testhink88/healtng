// src/pages/new-diagnosis-form/components/DiagnosisSearch.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import Icon from '@/components/AppIcon';

const DiagnosisSearch = ({ value, onChange, label, required = false, isMulti = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const CIE10_DB = [
    { code: 'I10', name: 'Hipertensión esencial (primaria)', category: 'Cardiovascular' },
    { code: 'E11.9', name: 'Diabetes mellitus tipo 2 sin complicaciones', category: 'Endocrino' },
    { code: 'I20.9', name: 'Angina de pecho, no especificada', category: 'Cardiovascular' },
    { code: 'J00', name: 'Rinofaringitis aguda (Resfriado común)', category: 'Respiratorio' },
    { code: 'M54.5', name: 'Lumbago no especificado', category: 'Osteomuscular' }
  ];

  const results = useMemo(() => {
    if (searchTerm.length < 2) return [];
    return CIE10_DB.filter(d => 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      d.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSelect = (diagnosis) => {
    if (isMulti) {
      const current = Array.isArray(value) ? value : [];
      if (!current.find(d => d.code === diagnosis.code)) {
        onChange([...current, diagnosis]);
      }
    } else {
      onChange(diagnosis);
    }
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="space-y-3 relative" ref={wrapperRef}>
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Chips de Diagnóstico - Estilo Limpio */}
      <div className="flex flex-wrap gap-2">
        {isMulti && Array.isArray(value) && value.map(d => (
          <div key={d.code} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-100 text-xs font-bold animate-in zoom-in-95">
            <span className="opacity-60 font-mono">{d.code}</span>
            <span>{d.name}</span>
            <button onClick={() => onChange(value.filter(item => item.code !== d.code))} className="hover:text-red-500"><Icon name="X" size={14} /></button>
          </div>
        ))}
        {!isMulti && value && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl border border-emerald-100 text-sm font-bold animate-in zoom-in-95">
            <span className="font-mono opacity-60">{value.code}</span>
            <span>{value.name}</span>
            <button onClick={() => onChange(null)} className="ml-2 hover:text-red-500"><Icon name="X" size={16} /></button>
          </div>
        )}
      </div>

      <div className="relative">
        <input 
          className="w-full h-12 px-4 pl-11 bg-white border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
          placeholder="Escriba código o descripción CIE-10..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
        />
        <Icon name="Search" size={18} className="absolute left-4 top-3.5 text-gray-300" />
      </div>

      {/* Resultados Flotantes (Evitan romper el layout) */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-[110] left-0 right-0 bg-white border border-gray-100 rounded-2xl shadow-2xl mt-2 overflow-hidden max-h-72 overflow-y-auto animate-in slide-in-from-top-2">
          {results.map(d => (
            <button 
              key={d.code}
              onClick={() => handleSelect(d)}
              className="w-full text-left px-5 py-4 hover:bg-blue-50/50 border-b border-gray-50 last:border-0 flex justify-between items-center transition-colors"
            >
              <div className="pr-4">
                <p className="text-sm font-bold text-gray-900 leading-tight">{d.name}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">{d.category}</p>
              </div>
              <span className="shrink-0 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded font-mono font-bold tracking-tighter">
                {d.code}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiagnosisSearch;