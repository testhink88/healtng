// src/components/practice/PracticeBar.jsx
import React from "react";
import Icon from "@/components/AppIcon";
import { usePractice } from "@/context/PracticeContext";
import { useNavigate } from "react-router-dom";

const BRAND_BLUE = "#0E39B1";

export default function PracticeBar() {
  const navigate = useNavigate();
  const { practiceId, officeId, practices, offices, setPractice, setOffice, currentPractice, currentOffice } = usePractice();

  const officesInPractice = offices.filter(o => String(o.practiceId) === String(practiceId));

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-3 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest">Contexto</span>

          <select
            value={practiceId || ""}
            onChange={(e) => setPractice(e.target.value || null)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white outline-none"
          >
            <option value="">Selecciona centro</option>
            {practices.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <select
            value={officeId || ""}
            onChange={(e) => setOffice(e.target.value || null)}
            disabled={!practiceId}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white outline-none disabled:opacity-50"
          >
            <option value="">Selecciona consultorio</option>
            {officesInPractice.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500">
            {currentPractice ? (
              <>
                <span className="font-medium text-gray-900">{currentPractice.name}</span>
                {currentOffice ? <span className="text-gray-400"> • {currentOffice.name}</span> : null}
              </>
            ) : (
              <span className="text-gray-400">Sin centro seleccionado</span>
            )}
          </div>

          <button
            onClick={() => navigate("/doctor/offices/new")}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white"
            style={{ backgroundColor: BRAND_BLUE }}
          >
            <Icon name="Plus" size={16} />
            Crear consultorio
          </button>
        </div>
      </div>
    </div>
  );
}
