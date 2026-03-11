import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import { useAuth } from "@/context/AuthContext";

// API Supabase
import { createEncounter, updateEncounter } from "@/api/encounters/encounters";
import { createDiagnosis, updateDiagnosis, getDiagnosisById } from "@/api/diagnoses/diagnoses";
import { supabase } from "@/lib/supabase";

import SpecialtyDiagnosisCore from "./components/SpecialtyDiagnosisCore";
import ReportConfigurator from "./components/ReportConfigurator"; 

import { encounterStorage } from "./utils/encounterStorage";
import { SPECIALTY_GROUPS_UI, SPECIALTY_DIAGNOSIS_SCHEMAS } from "@/config/diagnosisSchemas";

const BRAND_BLUE = "#0E39B1";

export default function NewDiagnosisForm() {
  const { profile } = useAuth();
  const { patientId, diagnosisId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const scope = new URLSearchParams(location.search).get("scope") || "doctor";
  const userRole = scope === "clinic" ? "clinic" : "doctor";
  const scopeSuffix = scope === "clinic" ? "?scope=clinic" : "";

  const [isLoading, setIsLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [specialtyCode, setSpecialtyCode] = useState("Medicina General");
  const [diagnosisData, setDiagnosisData] = useState({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const patientMeta = useMemo(() => {
    if (!patient) return null;
    return {
      name: patient.full_name || "Paciente",
      dni: patient.id.slice(0, 8),
      age: patient.metadata?.age || "--",
      sex: patient.metadata?.gender || "--",
    };
  }, [patient]);

  useEffect(() => {
    const loadPatient = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', patientId).single();
        if (error || !data) {
          setError("Paciente no encontrado en la base de datos.");
        } else {
          setPatient(data);
        }

        if (diagnosisId) {
          // MODO EDICIÓN
          const dx = await getDiagnosisById(diagnosisId);
          if (dx) {
            setSpecialtyCode(dx.metadata?.specialty_code || "Medicina General");
            setDiagnosisData(dx.metadata?.full_data || {});
          }
        } else {
          // MODO NUEVO + DRAFT
          const draft = encounterStorage?.load?.(patientId);
          if (draft?.data) setDiagnosisData(draft.data);
          if (draft?.specialtyCode) setSpecialtyCode(draft.specialtyCode);
        }
      } catch (err) {
        console.error("Error loading initial data:", err);
      }
      
      setIsLoading(false);
    };
    loadPatient();
  }, [patientId, diagnosisId]);

  const persistDraft = (nextData, nextSpecialty) => {
    try {
      encounterStorage?.save?.({ patientId, data: nextData, specialtyCode: nextSpecialty });
    } catch (e) { console.warn("Error saving draft", e); }
  };

  const handleInitialSave = async () => {
    setError("");
    const hasData = diagnosisData && diagnosisData.clinical_note?.trim();
    if (!hasData) return setError("Completa la nota de evolución clínica antes de guardar.");
    
    if (!profile?.id) return alert("Debe iniciar sesión como médico.");
    
    setSaving(true);
    try {
      const finalReportText = `EVOLUCIÓN MÉDICA:\n${diagnosisData.clinical_note || 'N/A'}\n\nPLAN Y TRATAMIENTO:\n${diagnosisData.treatment_plan || 'N/A'}`;

      if (diagnosisId) {
        // ACTUALIZAR EXISTENTE
        const dx = await getDiagnosisById(diagnosisId);
        
        // 1. Actualizar Encuentro
        if (dx.encounter_id) {
          await updateEncounter(dx.encounter_id, { notes: finalReportText });
        }

        // 2. Actualizar Diagnóstico
        await updateDiagnosis(diagnosisId, {
          condition: diagnosisData.main_diagnosis_cie10?.name || "Consulta Médica",
          findings: diagnosisData.clinical_note,
          plan: diagnosisData.treatment_plan,
          metadata: {
              specialty_code: specialtyCode,
              report_text: finalReportText,
              full_data: diagnosisData
          }
        });
      } else {
        // CREAR NUEVO
        // 1. Crear Encuentro
        const encounter = await createEncounter({
          patient_id: patientId,
          doctor_id: profile.id,
          clinic_id: null,
          notes: finalReportText
        });

        // 2. Crear Diagnóstico vinculado
        await createDiagnosis({
          encounter_id: encounter.id,
          patient_id: patientId,
          doctor_id: profile.id,
          condition: diagnosisData.main_diagnosis_cie10?.name || "Consulta Médica",
          status: "Activo",
          findings: diagnosisData.clinical_note,
          plan: diagnosisData.treatment_plan,
          metadata: {
              specialty_code: specialtyCode,
              report_text: finalReportText,
              full_data: diagnosisData
          }
        });
      }

      try { encounterStorage?.clear?.(patientId); } catch (e) {}
      navigate(`/patients/${patientId}${scopeSuffix}`);
    } catch (err) {
      console.error("Error saving medical history:", err);
      alert("Error al guardar en Supabase: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div className="p-20 text-center text-gray-400"><Icon name="Loader2" className="animate-spin inline mr-2" /> Cargando expediente...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header userRole={userRole} />
      <Sidebar userRole={userRole} />

      <main className="lg:ml-64 pt-20 pb-10 px-6">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest">
              <span>{scope === "clinic" ? "Centro Médico" : "Mis Pacientes"}</span>
              <Icon name="ChevronRight" size={12} />
              <span>Expediente</span>
              <Icon name="ChevronRight" size={12} />
              <span className="text-blue-600 font-medium">{diagnosisId ? "Editar Evolución" : "Nueva Evolución Nube"}</span>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => navigate(`/patients/${patientId}${scopeSuffix}`)} className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button
                onClick={handleInitialSave} 
                disabled={saving}
                className="px-6 py-2 rounded-xl text-sm text-white font-medium shadow-md transition hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: BRAND_BLUE }}
              >
                <Icon name={saving ? "Loader2" : "Save"} size={16} className={saving ? "animate-spin" : ""} />
                {saving ? "Guardando..." : "Guardar en Nube"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-8 space-y-6 text-left">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-start gap-5">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-white text-xl font-medium shadow-inner" style={{ backgroundColor: BRAND_BLUE }}>
                  {patientMeta?.name.slice(0, 1)}
                </div>
                <div>
                  <h1 className="text-xl font-medium text-gray-900">{diagnosisId ? "Editar Registro Clínico" : "Nueva Evolución Clínica"}</h1>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium text-gray-900">{patientMeta?.name}</span>
                    <span>•</span>
                    <span>ID: {patientId.slice(0,8)}</span>
                    <span className="ml-2 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700">Conectado</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                  <Icon name="AlertTriangle" className="text-red-600 mt-0.5" size={18} />
                  <div><p className="text-sm text-red-700">{error}</p></div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Plantilla Clínica</label>
                    <p className="text-xs text-gray-400 mt-0.5">Sincronización en tiempo real habilitada.</p>
                  </div>
                  <div className="w-full sm:w-64">
                    <select
                      value={specialtyCode}
                      onChange={(e) => {
                        const next = e.target.value;
                        setSpecialtyCode(next);
                        persistDraft(diagnosisData, next);
                      }}
                      className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-10 text-sm font-medium text-gray-700 focus:border-blue-500 focus:outline-none"
                    >
                      {SPECIALTY_GROUPS_UI.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                          {group.keys.map((key) => (
                            <option key={key} value={key}>{SPECIALTY_DIAGNOSIS_SCHEMAS[key]?.name || key}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-6">
                  <SpecialtyDiagnosisCore
                    specialtyCode={specialtyCode}
                    diagnosisData={diagnosisData}
                    setDiagnosisData={(nextData) => {
                      setDiagnosisData(nextData);
                      persistDraft(nextData, specialtyCode);
                    }}
                  />
                </div>
              </div>
            </section>

            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 text-left">Control de Consulta</h3>
                <div className="space-y-3">
                  <Button onClick={handleInitialSave} disabled={saving} className="w-full justify-center bg-[#0E39B1] text-white py-3.5 rounded-xl text-sm font-medium shadow-md">
                    <Icon name={saving ? "Loader2" : "Save"} size={18} className={`mr-2 ${saving ? 'animate-spin' : ''}`} />
                    Terminar Consulta
                  </Button>
                  <div className="relative py-2"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div><div className="relative flex justify-center"><span className="bg-white px-2 text-xs text-gray-400">Vinculación</span></div></div>
                  <button onClick={() => navigate(`/patients/${patientId}/prescriptions/new${scopeSuffix}`)} className="w-full flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><Icon name="Pill" size={16} /></div>
                      <div className="text-left"><p className="text-sm font-medium text-gray-700">Nueva Receta</p></div>
                    </div>
                  </button>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-center"><p className="text-[10px] text-gray-400">Healtng Cloud Sync 2.0</p></div>
              </div>
            </aside>
          </div>
        </div>

        {/* ReportConfigurator modal removed for direct saving */}
      </main>
    </div>
  );
}