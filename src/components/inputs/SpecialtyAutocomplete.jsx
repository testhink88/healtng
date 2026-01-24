// src/components/inputs/SpecialtyAutocomplete.jsx
import React, { useState, useEffect } from "react";
import { SPECIALTIES } from "@/mock/specialties";

const SpecialtyAutocomplete = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Filtramos solo si hay texto y el menú está "abierto" (para no filtrar cuando seleccionamos)
    if (query && isOpen) {
      const filtered = SPECIALTIES.filter(specialty =>
        specialty.label.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSpecialties(filtered);
    } else {
      setFilteredSpecialties([]);
    }
  }, [query, isOpen]);

  const handleSelection = (specialty) => {
    onSelect(specialty.id);     // Envía el ID al padre
    setQuery(specialty.label);  // Mantiene el nombre visible en el input
    setIsOpen(false);           // Cierra el menú
  }

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(true); // Abre el menú al escribir
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)} // Abre al hacer click
        // CORRECCIÓN AQUÍ: Quitamos 'input-classes' y ponemos estilos blancos fijos
        className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        placeholder="Buscar especialidad..."
      />
      
      {filteredSpecialties.length > 0 && isOpen && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
          {filteredSpecialties.map((specialty) => (
            <div
              key={specialty.id}
              className="cursor-pointer px-4 py-2 hover:bg-blue-50 text-sm text-gray-700 border-b last:border-0 border-gray-100"
              onClick={() => handleSelection(specialty)}
            >
              <div className="font-medium text-gray-900">{specialty.label}</div>
              {specialty.group && (
                <div className="text-xs text-gray-500">{specialty.group}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpecialtyAutocomplete;