import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";

// LÓGICA CORE
import SpecialtyDiagnosisCore from "./components/SpecialtyDiagnosisCore";
import ReportConfigurator from "./components/ReportConfigurator"; 

import { encounterStorage } from "./utils/encounterStorage";
import { MOCK_PATIENTS } from "@/mock/patients";

// CONFIGURACIÓN CENTRALIZADA
import { SPECIALTY_GROUPS_UI, SPECIALTY_DIAGNOSIS_SCHEMAS } from "@/config/diagnosisSchemas";

const LS_KEY = "MOCK_PATIENTS";
const BRAND_BLUE = "#0E39B1";

// --- HELPERS SEGUROS ---
function safeJsonParse(raw, fallback) {
  try { return JSON.parse(raw); } catch { return fallback; }
}

function getPatientsFromLS() {
  return safeJsonParse(localStorage.getItem(LS_KEY) || "[]", []);
}

function savePatientsToLS(patients) {
  localStorage.setItem(LS_KEY, JSON.stringify(patients));
}

function ensurePatientShape(p) {
  return { ...p, diagnoses: Array.isArray(p?.diagnoses) ? p.diagnoses : [] };
}

function getPatientFullName(p) { return p?.fullName || p?.name || ""; }
function getPatientDni(p) { return p?.dni || p?.docId || ""; }
function getPatientSex(p) { return p?.sex || p?.gender || ""; }

export default function NewDiagnosisForm() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const scope = new URLSearchParams(location.search).get("scope") || "doctor";
  const userRole = scope === "clinic" ? "clinic" : "doctor";
  const scopeSuffix = scope === "clinic" ? "?scope=clinic" : "";

  const [isLoading, setIsLoading] = useState(true);
  const [patient, setPatient] = useState(null);

  // ESTADO CLÍNICO
  const [specialtyCode, setSpecialtyCode] = useState("Medicina General");
  const [diagnosisData, setDiagnosisData] = useState({});
  const [error, setError] = useState("");

  // ESTADO PARA CONTROLAR EL MODAL DE REPORTE
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const patientMeta = useMemo(() => {
    if (!patient) return null;
    return {
      name: getPatientFullName(patient),
      dni: getPatientDni(patient),
      age: patient.age,
      sex: getPatientSex(patient),
    };
  }, [patient]);

  // 1. CARGA DE DATOS
  useEffect(() => {
    setIsLoading(true);
    setError("");

    const locals = getPatientsFromLS();
    const found = locals.find((p) => String(p.id) === String(patientId)) ||
                  (MOCK_PATIENTS || []).find((p) => String(p.id) === String(patientId));

    if (!found) {
      setPatient(null);
      setIsLoading(false);
      setError("Paciente no encontrado.");
      return;
    }

    setPatient(ensurePatientShape(found));

    const draft = encounterStorage?.load?.(patientId);
    if (draft?.data) setDiagnosisData(draft.data);
    if (draft?.specialtyCode && SPECIALTY_DIAGNOSIS_SCHEMAS[draft.specialtyCode]) {
      setSpecialtyCode(draft.specialtyCode);
    }

    setIsLoading(false);
  }, [patientId]);

  // 2. PERSISTENCIA EN TIEMPO REAL
  const persistDraft = (nextData, nextSpecialty) => {
    try {
      encounterStorage?.save?.({
        patientId,
        data: nextData,
        specialtyCode: nextSpecialty,
      });
    } catch (e) {
      console.warn("Error saving draft", e);
    }
  };

  // 3. VALIDACIÓN INICIAL Y APERTURA DE MODAL
  const handleInitialSave = () => {
    setError("");

    if (!patient) return setError("No hay paciente cargado.");
    
    // Validación básica: al menos un campo lleno
    const hasData = diagnosisData && Object.values(diagnosisData).some(val => val && String(val).trim() !== "");

    if (!hasData) {
      return setError("Completa datos clínicos antes de guardar.");
    }

    // SI TODO ESTÁ BIEN, ABRIMOS EL CONFIGURADOR
    setIsReportModalOpen(true);
  };

  // ✅ 4. GUARDADO DEFINITIVO Y CIERRE DE CICLO ADMINISTRATIVO
  const handleFinalConfirm = (finalReportText) => {
    const locals = getPatientsFromLS();
    const hasLS = locals.some((p) => String(p.id) === String(patientId));
    const basePatients = hasLS ? locals : [...locals, ...MOCK_PATIENTS];

    const diagnosisEvent = {
      id: `DX-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type: "diagnosis",
      specialtyCode,
      specialtyName: SPECIALTY_DIAGNOSIS_SCHEMAS[specialtyCode]?.name || specialtyCode,
      createdAt: new Date().toISOString(),
      doctorName: "Dr. Usuario Actual",
      data: diagnosisData,          
      reportText: finalReportText,  
      preview: diagnosisData.main_diagnosis_cie10?.name || "Evolución sin diagnóstico CIE-10",
    };

    const updated = basePatients.map((p) => {
      if (String(p.id) !== String(patientId)) return p;
      const normalized = ensurePatientShape(p);
      return { 
        ...normalized, 
        // 🔥 CAMBIO CRÍTICO: Actualizamos estatus para que la secretaria sepa que terminó
        status: "active", 
        lastVisit: new Date().toISOString(),
        diagnoses: [diagnosisEvent, ...normalized.diagnoses] 
      };
    });

    savePatientsToLS(updated);

    try { encounterStorage?.clear?.(patientId); } catch (e) {}

    // CERRAR MODAL Y NAVEGAR
    setIsReportModalOpen(false);
    navigate(`/patients/${patientId}${scopeSuffix}`);
  };

  if (isLoading) return <div className="p-20 text-center text-gray-500">Cargando expediente...</div>;

  if (!patient) return <div className="p-20 text-center">Error: Paciente no encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header userRole={userRole} />
      <Sidebar userRole={userRole} />

      <main className="lg:ml-64 pt-20 pb-10 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* BARRA DE NAVEGACIÓN SUPERIOR */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest">
              <span>{scope === "clinic" ? "Centro Médico" : "Mis Pacientes"}</span>
              <Icon name="ChevronRight" size={12} />
              <span>Expediente</span>
              <Icon name="ChevronRight" size={12} />
              <span className="text-blue-600 font-medium">Nueva Evolución</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/patients/${patientId}${scopeSuffix}`)}
                className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleInitialSave} 
                className="px-6 py-2 rounded-xl text-sm text-white font-medium shadow-md shadow-blue-900/10 transition hover:opacity-90 flex items-center gap-2"
                style={{ backgroundColor: BRAND_BLUE }}
              >
                <Icon name="Save" size={16} />
                Guardar Evolución
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* COLUMNA PRINCIPAL */}
            <section className="lg:col-span-8 space-y-6">
              
              {/* FICHA DEL PACIENTE */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-start gap-5">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-white text-xl font-medium shadow-inner" style={{ backgroundColor: BRAND_BLUE }}>
                  {(patientMeta?.name || "P").slice(0, 1)}
                </div>
                <div>
                  <h1 className="text-xl font-medium text-gray-900">Nueva Evolución Clínica</h1>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium text-gray-900">{patientMeta?.name}</span>
                    <span>•</span>
                    <span>{patientMeta?.dni}</span>
                    {patientMeta?.age && <span>• {patientMeta.age} años</span>}
                    <span className="ml-2 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700">
                      Activo
                    </span>
                  </div>
                </div>
              </div>

              {/* MENSAJES DE ERROR */}
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                  <Icon name="AlertTriangle" className="text-red-600 mt-0.5" size={18} />
                  <div>
                    <h4 className="text-sm font-medium text-red-900">Atención requerida</h4>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* SELECTOR DE ESPECIALIDAD */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Plantilla Clínica
                    </label>
                    <p className="text-xs text-gray-400 mt-0.5">Define los campos específicos del formulario.</p>
                  </div>
                  
                  <div className="w-full sm:w-64">
                    <select
                      value={specialtyCode}
                      onChange={(e) => {
                        const next = e.target.value;
                        setSpecialtyCode(next);
                        persistDraft(diagnosisData, next);
                      }}
                      className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-10 text-sm font-medium text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {SPECIALTY_GROUPS_UI.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                          {group.keys.map((key) => (
                            <option key={key} value={key}>
                              {SPECIALTY_DIAGNOSIS_SCHEMAS[key]?.name || key}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
                  <Icon name="Layout" size={14} className="text-blue-600" />
                  <span className="text-xs text-blue-800">
                    Mostrando campos para: <strong>{SPECIALTY_DIAGNOSIS_SCHEMAS[specialtyCode]?.name || specialtyCode}</strong>
                  </span>
                </div>
              </div>

              {/* CORE CLÍNICO */}
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

            {/* COLUMNA LATERAL */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  Acciones Vinculadas
                </h3>
                
                <div className="space-y-3">
                  <Button
                    onClick={handleInitialSave} 
                    className="w-full justify-center bg-[#0E39B1] text-white py-3.5 rounded-xl text-sm font-medium border-none shadow-md shadow-blue-900/10"
                  >
                    <Icon name="Save" size={18} className="mr-2" />
                    Finalizar y Guardar
                  </Button>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-2 text-xs text-gray-400">Opciones adicionales</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/patients/${patientId}/prescriptions/new${scopeSuffix}`)}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Icon name="Pill" size={16} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-700 group-hover:text-blue-800">Receta Digital</p>
                        <p className="text-[10px] text-gray-400">Agregar medicamentos</p>
                      </div>
                    </div>
                    <Icon name="ChevronRight" size={16} className="text-gray-300 group-hover:text-blue-400" />
                  </button>

                  <button
                    onClick={() => navigate(`/patients/${patientId}/referrals/new${scopeSuffix}`)}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Icon name="Share2" size={16} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-700 group-hover:text-blue-800">Derivación</p>
                        <p className="text-[10px] text-gray-400">Referir especialista</p>
                      </div>
                    </div>
                    <Icon name="ChevronRight" size={16} className="text-gray-300 group-hover:text-blue-400" />
                  </button>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 leading-relaxed text-center">
                      Healtng Auto-Save™ activo. <br/>
                      Los cambios se guardan localmente.
                    </p>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* RENDERIZADO DEL MODAL */}
        <ReportConfigurator 
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          onConfirm={handleFinalConfirm}
          patient={patientMeta}
          diagnosisData={diagnosisData}
          specialtyName={SPECIALTY_DIAGNOSIS_SCHEMAS[specialtyCode]?.name || specialtyCode}
        />
      </main>
    </div>
  );
}