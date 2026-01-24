// src/context/PracticeContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const PracticeContext = createContext(null);
const LS_KEY = "HEALTNG_CONTEXT_V1";

// MOCKS (reemplazables por API)
const MOCK_PRACTICES = [
  { id: "center_1", name: "Centro Médico Docente La Trinidad" },
  { id: "center_2", name: "Consultorio Privado (Santa Paula)" },
];

const MOCK_OFFICES = [
  { id: "off_1", practiceId: "center_1", name: "Piso 2, Cons. 204", phone: "0212-0000000", address: "Caracas..." },
  { id: "off_2", practiceId: "center_2", name: "Anexo A", phone: "0414-0000000", address: "Caracas..." },
];

function safeParse(raw, fallback) {
  try { return JSON.parse(raw); } catch { return fallback; }
}

export function PracticeProvider({ children }) {
  const [state, setState] = useState({
    practiceId: null,
    officeId: null,
    practices: MOCK_PRACTICES,
    offices: MOCK_OFFICES,
  });

  // Carga inicial + autoselect con validación
  useEffect(() => {
    const saved = safeParse(localStorage.getItem(LS_KEY) || "null", null);

    const practiceValid = saved?.practiceId && MOCK_PRACTICES.some(p => p.id === saved.practiceId);
    const officeValid =
      saved?.officeId &&
      MOCK_OFFICES.some(o => o.id === saved.officeId && o.practiceId === saved.practiceId);

    if (practiceValid) {
      setState(prev => ({
        ...prev,
        practiceId: saved.practiceId,
        officeId: officeValid ? saved.officeId : (MOCK_OFFICES.find(o => o.practiceId === saved.practiceId)?.id || null),
      }));
      return;
    }

    // autoselect 1er centro + 1er consultorio de ese centro
    if (MOCK_PRACTICES.length > 0) {
      const firstPractice = MOCK_PRACTICES[0];
      const firstOffice = MOCK_OFFICES.find(o => o.practiceId === firstPractice.id) || null;
      setState(prev => ({
        ...prev,
        practiceId: firstPractice.id,
        officeId: firstOffice?.id || null,
      }));
    }
  }, []);

  // Persistencia mínima
  useEffect(() => {
    if (!state.practiceId) return;
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({ practiceId: state.practiceId, officeId: state.officeId })
    );
  }, [state.practiceId, state.officeId]);

  const api = useMemo(() => {
    const currentPractice = state.practices.find(p => p.id === state.practiceId) || null;
    const currentOffice =
      state.offices.find(o => o.id === state.officeId && o.practiceId === state.practiceId) || null;

    return {
      ...state,
      currentPractice,
      currentOffice,
      setPractice: (practiceId) => {
        const firstOffice = state.offices.find(o => o.practiceId === practiceId) || null;
        setState(p => ({ ...p, practiceId, officeId: firstOffice?.id || null }));
      },
      setOffice: (officeId) => {
        // Solo permite office dentro del practice actual
        const ok = state.offices.some(o => o.id === officeId && o.practiceId === state.practiceId);
        setState(p => ({ ...p, officeId: ok ? officeId : null }));
      },
      reset: () => setState(p => ({ ...p, practiceId: null, officeId: null })),
    };
  }, [state]);

  return <PracticeContext.Provider value={api}>{children}</PracticeContext.Provider>;
}

export function usePractice() {
  const ctx = useContext(PracticeContext);
  if (!ctx) throw new Error("usePractice debe usarse dentro de PracticeProvider");
  return ctx;
}
