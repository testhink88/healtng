// src/components/practice/RequireOffice.jsx
import React from "react";
import Icon from "@/components/AppIcon";
import { usePractice } from "@/context/PracticeContext";

export default function RequireOffice({ children }) {
  const { currentPractice, currentOffice } = usePractice();

  if (!currentPractice || !currentOffice) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Icon name="MapPin" size={18} className="text-[#0E39B1]" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Selecciona un consultorio para continuar</p>
            <p className="text-xs text-gray-500 mt-1">
              Esto evita mezclar datos entre centros y consultorios.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
