import React, { useEffect, useMemo, useRef, useState } from "react";

// ----------------------------------------------------------------------
// COMPONENTES STUB / IMPORTS
// (Ajusta estas rutas según tu proyecto real)
// ----------------------------------------------------------------------
import Header from "@/components/ui/Header"; 
import Sidebar from "@/components/ui/Sidebar"; 
import Icon from "@/components/AppIcon";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

/* =========================================================
   DOCTOR SETTINGS (V2)
   - Persistencia: localStorage
   - Esquema: Strict V2
   - Lógica: Dirty state inteligente (ignora meta/logs)
========================================================= */

const SCHEMA_VERSION = 2;
const STORAGE_KEY = "DOCTOR_SETTINGS_V2";
const LEGACY_KEYS = ["DOCTOR_PROFILE", "HLT_SETTINGS::doctor::v2", "HLT_SETTINGS::doctor::v1"];

const MAX_IMAGE_BYTES = 800_000; // ~0.8 MB
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg"];

/* =========================================================
   HELPERS
========================================================= */

function nowIso() {
  return new Date().toISOString();
}

function deepClone(obj) {
  if (obj === undefined || obj === null) return obj;
  return JSON.parse(JSON.stringify(obj));
}

function safeJsonParse(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// Merge profundo para asegurar que nuevas claves del schema existan al cargar data vieja
function deepMerge(base, patch) {
  const out = Array.isArray(base) ? [...base] : { ...base };
  if (patch && typeof patch === "object") {
    Object.keys(patch).forEach((k) => {
      const pv = patch[k];
      const bv = base ? base[k] : undefined;
      if (Array.isArray(pv)) {
        // En arrays, preferimos la data guardada (patch) salvo que sea undefined
        out[k] = pv; 
      } else if (pv && typeof pv === "object" && bv && typeof bv === "object") {
        out[k] = deepMerge(bv, pv);
      } else {
        out[k] = pv;
      }
    });
  }
  return out;
}

// Convierte File a Base64
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Error leyendo archivo"));
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
}

// Estimar bytes de string base64
function approxBytesFromBase64(dataUrl) {
  const idx = dataUrl.indexOf("base64,");
  if (idx < 0) return 0;
  const b64 = dataUrl.slice(idx + "base64,".length);
  return Math.floor((b64.length * 3) / 4);
}

// Generador de Defaults V2
function makeDefaults() {
  return {
    meta: {
      updatedAt: nowIso(),
      updatedBy: "system",
      version: SCHEMA_VERSION,
    },
    profile: {
      firstName: "",
      lastName: "",
      documentId: "",
      licenseNumber: "",
      specialtyPrimary: "",
      specialtySecondary: [],
      experienceYears: "",
      bio: "",
      email: "",
      phone: "",
      whatsapp: "",
      website: "",
      languages: ["es"],
      photo: { dataUrl: "", mime: "", bytes: 0 },
      certifications: [], // { title, entity, year }
      verified: false,
    },
    practice: {
      modality: "presencial",
      locations: [],
      appointmentTypes: [
        { id: "cons_gen", name: "Consulta General", durationMin: 30, priceUsd: "", teleAllowed: true, requirements: "" },
      ],
      defaultDurationMin: 30,
      bufferMin: 5,
      bookingWindow: { minNoticeHours: 2, maxDaysAhead: 30 },
      cancellationPolicy: { minHours: 4, text: "Por favor notificar con 4 horas de antelación." },
      requireConfirmation: true,
      lateToleranceMin: 10,
      allowOverbooking: false,
      overbookingLimit: 0,
    },
    schedule: {
      timezone: "America/Caracas",
      week: {
        mon: { enabled: true, blocks: [{ start: "08:00", end: "12:00" }, { start: "14:00", end: "17:00" }] },
        tue: { enabled: true, blocks: [{ start: "08:00", end: "12:00" }, { start: "14:00", end: "17:00" }] },
        wed: { enabled: true, blocks: [{ start: "08:00", end: "12:00" }, { start: "14:00", end: "17:00" }] },
        thu: { enabled: true, blocks: [{ start: "08:00", end: "12:00" }, { start: "14:00", end: "17:00" }] },
        fri: { enabled: true, blocks: [{ start: "08:00", end: "12:00" }, { start: "14:00", end: "17:00" }] },
        sat: { enabled: false, blocks: [] },
        sun: { enabled: false, blocks: [] },
      },
      slotRules: {
        reuseCancelledSlot: true,
        cancelledStateStyle: "crossed",
        allowManualAssignOnEmptySlot: true,
      },
    },
    patients: {
      quickRegistration: {
        requiredFields: { firstName: true, lastName: true, phone: true, documentId: false, sex: true, birthDateOrAge: true },
        recommendedFields: { address: false, insurer: false, emergencyContact: false, allergies: false, chronicConditions: false },
        allowWithoutDocumentId: true,
        validatePhoneVE: true,
        detectDuplicatesBy: { phone: true, documentId: false },
      },
      consents: {
        dataProcessingRequired: true,
        telemedicineRequired: false,
        shareWithClinicDefault: true,
        shareWithInsurerDefault: false,
      },
    },
    clinicalDocs: {
      templates: {
        noteStyle: "SOAP",
        diagnosis: { requireCode: false, codingSystem: "CIE10" },
        prescription: { showWarnings: true },
        labOrders: { enabled: true },
        imagingOrders: { enabled: true },
        referrals: { enabled: true },
        certificates: { enabled: false },
      },
      catalogs: {
        frequentDiagnoses: [],
        frequentMeds: [],
        frequentInstructions: [],
        frequentStudies: [],
      },
    },
    signature: {
      signatureImage: { dataUrl: "", mime: "", bytes: 0 },
      stampImage: { dataUrl: "", mime: "", bytes: 0 },
      docPrefix: "DOC-",
      numbering: "auto",
      placeOfIssue: "",
      legalFooter: "",
    },
    notifications: {
      channels: { whatsapp: true, sms: false, email: true },
      quietHours: { start: "22:00", end: "07:00" },
      reminders: { enabled: true, when: { h24: true, h2: true, h1: false } },
      autoConfirm: true,
      templates: {
        confirm: "Hola {PACIENTE}, su cita con {MEDICO} está confirmada para el {FECHA} a las {HORA}.",
        reminder: "Recordatorio: Mañana tiene cita con {MEDICO} a las {HORA}.",
        cancel: "Su cita ha sido cancelada.",
        reschedule: "Su cita ha sido reprogramada.",
        noShow: "Notamos su inasistencia a la consulta.",
      },
    },
    privacySecurity: {
      session: { lockAfterMin: 15, showSensitiveMask: false },
      exportPolicy: { allowExport: true },
      audit: { enabled: true, lastEvents: [] },
    },
    dataTools: {
      exportFormat: "json",
    },
  };
}

// Lógica de migración (Legacy -> V2)
function migrateDoctorSettings(loaded) {
  if (!loaded) return makeDefaults();
  
  // Si ya es V2, devolvemos
  if (loaded.meta?.version === SCHEMA_VERSION) return loaded;

  // Migración simple: mergear lo que haya contra los defaults
  // Si fuera necesario mapear campos viejos (ej: 'name' -> 'firstName'), se haría aquí.
  return loaded; 
}

// Función para obtener objeto comparable (ignorando meta y logs para isDirty)
function getComparable(s) {
  const c = deepClone(s);
  if (c.meta) delete c.meta;
  if (c.privacySecurity?.audit?.lastEvents) delete c.privacySecurity.audit.lastEvents;
  return c;
}

/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */

export default function DoctorSettings() {
  const { profile, fetchProfile } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");
  const [settings, setSettings] = useState(() => makeDefaults());
  const [baseline, setBaseline] = useState(() => makeDefaults());
  
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  // Modal Export/Import
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("export"); // export | import
  const [modalPayload, setModalPayload] = useState("");

  const filePhotoRef = useRef(null);
  const fileSignRef = useRef(null);
  const fileStampRef = useRef(null);

  // 1. Carga Inicial (Primero de Perfil Supabase, luego fallback LocalStorage)
  useEffect(() => {
    const defaults = makeDefaults();
    
    // Prioridad 1: Datos en Supabase Metadata
    if (profile?.metadata?.settings_v2) {
      const merged = deepMerge(defaults, profile.metadata.settings_v2);
      merged.meta.version = SCHEMA_VERSION;
      setSettings(merged);
      setBaseline(deepClone(merged));
      return;
    }

    // Prioridad 2: LocalStorage (Migración)
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      for (const key of LEGACY_KEYS) {
        const legacy = localStorage.getItem(key);
        if (legacy) {
          raw = legacy;
          break;
        }
      }
    }

    if (raw) {
      const parsed = safeJsonParse(raw, null);
      if (parsed) {
        const migrated = migrateDoctorSettings(parsed);
        const merged = deepMerge(defaults, migrated);
        merged.meta.version = SCHEMA_VERSION;
        setSettings(merged);
        setBaseline(deepClone(merged));
        return;
      }
    }

    // Si no hay data o falló parse
    setSettings(defaults);
    setBaseline(deepClone(defaults));
  }, [profile]);

  // 2. Dirty Check
  const isDirty = useMemo(() => {
    const s = getComparable(settings);
    const b = getComparable(baseline);
    return JSON.stringify(s) !== JSON.stringify(b);
  }, [settings, baseline]);

  // 3. BeforeUnload Warning
  useEffect(() => {
    const handler = (e) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // --- ACTIONS ---

  const update = (path, value) => {
    setSettings((prev) => {
      const next = deepClone(prev);
      const parts = path.split(".");
      let current = next;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      
      // Actualizar meta localmente
      next.meta = { ...next.meta, updatedAt: nowIso(), updatedBy: "local" };
      return next;
    });
  };

  const validate = (s) => {
    const errs = [];
    if (!s.profile.firstName || !s.profile.lastName) errs.push("Falta Nombre o Apellido.");
    
    const hasContact = s.profile.phone || s.profile.whatsapp || s.profile.email;
    if (!hasContact) errs.push("Se requiere al menos un método de contacto.");

    if (!s.practice.appointmentTypes || s.practice.appointmentTypes.length === 0) {
      errs.push("Debe haber al menos un tipo de cita configurado.");
    }

    const hasSchedule = Object.values(s.schedule.week).some(d => d.enabled);
    if (!hasSchedule) errs.push("El horario debe tener al menos un día habilitado.");

    if (!s.signature.docPrefix) errs.push("El prefijo de documentos es obligatorio.");

    return errs;
  };

  const save = async () => {
    if (!profile?.id) return;
    setErrorMsg("");
    setStatusMsg("");
    setSaving(true);

    const errors = validate(settings);
    if (errors.length > 0) {
      setErrorMsg(errors.join(" "));
      setSaving(false);
      return;
    }

    try {
      const next = deepClone(settings);
      
      // Audit Log
      if (next.privacySecurity.audit.enabled) {
        const event = { at: nowIso(), action: "save", section: activeSection };
        next.privacySecurity.audit.lastEvents = [event, ...next.privacySecurity.audit.lastEvents].slice(0, 50);
      }
      
      // 1. Persistencia Local (Buffer)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

      // 2. Persistencia en Supabase
      const fullName = `${next.profile.firstName} ${next.profile.lastName}`.trim();
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          metadata: {
            ...profile.metadata,
            settings_v2: next,
            // Atajos para ser compatibles con otros componentes
            license: next.profile.licenseNumber,
            specialty_label: next.profile.specialtyPrimary,
            avatar_url: next.profile.photo.dataUrl // Para el Header
          }
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      // 3. Actualizar estado y Contexto
      setSettings(next);
      setBaseline(deepClone(next));
      setStatusMsg("Configuración sincronizada en la nube.");
      await fetchProfile(profile.id); // Refrescar Header y dashboard
    } catch (e) {
      console.error("Save Error:", e);
      setErrorMsg("Error guardando en Supabase: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const revert = () => {
    setSettings(deepClone(baseline));
    setStatusMsg("Cambios revertidos.");
  };

  const resetDefaults = () => {
    if (window.confirm("¿Restaurar valores de fábrica? Perderás tu configuración actual.")) {
      const def = makeDefaults();
      setSettings(def);
      setStatusMsg("Restaurado a defaults (No guardado aún).");
    }
  };

  const handleExport = () => {
    setModalPayload(JSON.stringify(settings, null, 2));
    setModalMode("export");
    setShowModal(true);
  };

  const handleImport = () => {
    setModalPayload("");
    setModalMode("import");
    setShowModal(true);
  };

  const confirmImport = () => {
    try {
      const parsed = JSON.parse(modalPayload);
      const migrated = migrateDoctorSettings(parsed);
      const merged = deepMerge(makeDefaults(), migrated);
      merged.meta.version = SCHEMA_VERSION;
      merged.meta.updatedBy = "import";
      
      setSettings(merged);
      setStatusMsg("Importación aplicada. Revisa y Guarda.");
      setShowModal(false);
    } catch (e) {
      alert("JSON Inválido.");
    }
  };

  const handleImage = async (file, path) => {
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      alert("Solo PNG o JPG.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      alert("Imagen muy pesada (máx 800KB).");
      return;
    }
    try {
      const b64 = await fileToBase64(file);
      update(path, {
        dataUrl: b64,
        mime: file.type,
        bytes: approxBytesFromBase64(b64)
      });
    } catch (e) {
      alert("Error procesando imagen.");
    }
  };

  const removeImage = (path) => {
    update(path, { dataUrl: "", mime: "", bytes: 0 });
  };

  // --- RENDERS ---

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header userRole="doctor" />
      <Sidebar userRole="doctor" />

      <main className="lg:ml-64 pt-20 px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          
          {/* TOP BAR */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Configuración del Doctor</h1>
              <p className="text-sm text-gray-500">Ajustes de perfil, agenda y documentos.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={save} primary disabled={!isDirty || saving}>
                 {saving ? "Sincronizando..." : "Guardar en Nube"}
              </Button>
              <Button onClick={revert} disabled={!isDirty}>Revertir</Button>
              <Button onClick={handleExport}>Exportar</Button>
              <Button onClick={handleImport}>Importar</Button>
              <Button onClick={resetDefaults} danger>Defaults</Button>
            </div>
          </div>

          {/* ALERTS */}
          {statusMsg && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm">{statusMsg}</div>}
          {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm font-medium">{errorMsg}</div>}
          {isDirty && !statusMsg && !errorMsg && <div className="mb-4 p-2 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100">Tienes cambios sin guardar.</div>}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* SIDEBAR MENU */}
            <div className="lg:col-span-3">
              <nav className="space-y-1">
                {[
                  { id: "profile", label: "Perfil", icon: "User" },
                  { id: "practice", label: "Práctica", icon: "Briefcase" },
                  { id: "schedule", label: "Agenda", icon: "Calendar" },
                  { id: "patients", label: "Pacientes", icon: "Users" },
                  { id: "clinicalDocs", label: "Documentos", icon: "FileText" },
                  { id: "signature", label: "Firma", icon: "PenTool" },
                  { id: "notifications", label: "Notificaciones", icon: "Bell" },
                  { id: "privacySecurity", label: "Privacidad", icon: "Shield" },
                  { id: "dataTools", label: "Datos", icon: "Database" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === item.id ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon name={item.icon} size={16} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* CONTENT AREA */}
            <div className="lg:col-span-9 space-y-6">
              
              {activeSection === "profile" && (
                <SectionContainer title="Perfil Profesional" subtitle="Información pública y de contacto.">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Nombre" value={settings.profile.firstName} onChange={v=>update("profile.firstName", v)} />
                    <Field label="Apellido" value={settings.profile.lastName} onChange={v=>update("profile.lastName", v)} />
                    <Field label="Cédula / ID" value={settings.profile.documentId} onChange={v=>update("profile.documentId", v)} />
                    <Field label="Colegiatura / MPPS" value={settings.profile.licenseNumber} onChange={v=>update("profile.licenseNumber", v)} />
                    <Field label="Especialidad Principal" value={settings.profile.specialtyPrimary} onChange={v=>update("profile.specialtyPrimary", v)} />
                    <Field label="Años Experiencia" value={settings.profile.experienceYears} onChange={v=>update("profile.experienceYears", v)} type="number" />
                    <div className="md:col-span-2">
                       <Field label="Bio Corta" value={settings.profile.bio} onChange={v=>update("profile.bio", v)} textarea />
                    </div>
                    <Field label="Email" value={settings.profile.email} onChange={v=>update("profile.email", v)} />
                    <Field label="Teléfono" value={settings.profile.phone} onChange={v=>update("profile.phone", v)} />
                    <Field label="WhatsApp" value={settings.profile.whatsapp} onChange={v=>update("profile.whatsapp", v)} />
                    <Field label="Website" value={settings.profile.website} onChange={v=>update("profile.website", v)} />
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Foto de Perfil</h4>
                    <ImageManager 
                      imgData={settings.profile.photo} 
                      onUpload={(f) => handleImage(f, "profile.photo")} 
                      onRemove={() => removeImage("profile.photo")}
                      fileRef={filePhotoRef}
                    />
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100">
                     <h4 className="text-sm font-medium text-gray-900 mb-2">Verificación</h4>
                     <Toggle label="Perfil Verificado (Flag Interno)" checked={settings.profile.verified} onChange={v => update("profile.verified", v)} />
                     <div className="mt-4">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Certificaciones</label>
                        <CertificationsEditor value={settings.profile.certifications} onChange={v => update("profile.certifications", v)} />
                     </div>
                  </div>
                </SectionContainer>
              )}

              {activeSection === "practice" && (
                <SectionContainer title="Práctica Clínica" subtitle="Configuración operativa de la consulta.">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select label="Modalidad" value={settings.practice.modality} onChange={v=>update("practice.modality", v)} options={["presencial", "teleconsulta", "mixto"]} />
                    <Field label="Duración Default (min)" value={settings.practice.defaultDurationMin} onChange={v=>update("practice.defaultDurationMin", Number(v))} type="number" />
                    <Field label="Buffer entre citas (min)" value={settings.practice.bufferMin} onChange={v=>update("practice.bufferMin", Number(v))} type="number" />
                    <Field label="Tolerancia Retraso (min)" value={settings.practice.lateToleranceMin} onChange={v=>update("practice.lateToleranceMin", Number(v))} type="number" />
                  </div>
                  
                  <div className="mt-6">
                     <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Tipos de Cita</label>
                     <AppointmentTypesEditor value={settings.practice.appointmentTypes} onChange={v => update("practice.appointmentTypes", v)} />
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Reglas de Reserva</h4>
                      <div className="space-y-2">
                        <Field label="Min. Horas Anticipación" value={settings.practice.bookingWindow.minNoticeHours} onChange={v=>update("practice.bookingWindow.minNoticeHours", Number(v))} type="number" />
                        <Field label="Máx. Días Futuro" value={settings.practice.bookingWindow.maxDaysAhead} onChange={v=>update("practice.bookingWindow.maxDaysAhead", Number(v))} type="number" />
                        <Toggle label="Requerir Confirmación" checked={settings.practice.requireConfirmation} onChange={v => update("practice.requireConfirmation", v)} />
                      </div>
                    </div>
                    <div>
                       <h4 className="text-sm font-medium mb-2">Sobrecupo</h4>
                       <Toggle label="Permitir Sobrecupo" checked={settings.practice.allowOverbooking} onChange={v => update("practice.allowOverbooking", v)} />
                       {settings.practice.allowOverbooking && (
                         <Field label="Límite Diario" value={settings.practice.overbookingLimit} onChange={v=>update("practice.overbookingLimit", Number(v))} type="number" />
                       )}
                    </div>
                  </div>
                </SectionContainer>
              )}

              {activeSection === "schedule" && (
                <SectionContainer title="Agenda y Horarios" subtitle="Define tu disponibilidad semanal.">
                   <div className="mb-6">
                      <Field label="Zona Horaria" value={settings.schedule.timezone} onChange={v=>update("schedule.timezone", v)} />
                   </div>
                   <WeekScheduleEditor value={settings.schedule.week} onChange={v => update("schedule.week", v)} />
                   
                   <div className="mt-6 pt-6 border-t border-gray-100">
                      <h4 className="text-sm font-medium mb-3">Reglas de Slots</h4>
                      <div className="space-y-2">
                         <Toggle label="Reusar espacios cancelados" checked={settings.schedule.slotRules.reuseCancelledSlot} onChange={v=>update("schedule.slotRules.reuseCancelledSlot", v)} />
                         <Toggle label="Asignación manual en huecos vacíos" checked={settings.schedule.slotRules.allowManualAssignOnEmptySlot} onChange={v=>update("schedule.slotRules.allowManualAssignOnEmptySlot", v)} />
                      </div>
                   </div>
                </SectionContainer>
              )}

              {activeSection === "patients" && (
                <SectionContainer title="Pacientes" subtitle="Registro y consentimientos.">
                   <h4 className="text-sm font-bold text-gray-700 mb-3">Registro Rápido</h4>
                   <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                         <p className="text-xs text-gray-500 mb-2 font-bold">Campos Obligatorios</p>
                         {Object.keys(settings.patients.quickRegistration.requiredFields).map(k => (
                            <Toggle key={k} label={k} checked={settings.patients.quickRegistration.requiredFields[k]} onChange={v => update(`patients.quickRegistration.requiredFields.${k}`, v)} />
                         ))}
                      </div>
                      <div>
                         <p className="text-xs text-gray-500 mb-2 font-bold">Campos Recomendados</p>
                         {Object.keys(settings.patients.quickRegistration.recommendedFields).map(k => (
                            <Toggle key={k} label={k} checked={settings.patients.quickRegistration.recommendedFields[k]} onChange={v => update(`patients.quickRegistration.recommendedFields.${k}`, v)} />
                         ))}
                      </div>
                   </div>
                   <Toggle label="Permitir sin documento de identidad" checked={settings.patients.quickRegistration.allowWithoutDocumentId} onChange={v => update("patients.quickRegistration.allowWithoutDocumentId", v)} />
                   <Toggle label="Validar teléfonos VE" checked={settings.patients.quickRegistration.validatePhoneVE} onChange={v => update("patients.quickRegistration.validatePhoneVE", v)} />

                   <div className="mt-6 pt-6 border-t border-gray-100">
                      <h4 className="text-sm font-bold text-gray-700 mb-3">Consentimientos Default</h4>
                      <Toggle label="Tratamiento de Datos Requerido" checked={settings.patients.consents.dataProcessingRequired} onChange={v => update("patients.consents.dataProcessingRequired", v)} />
                      <Toggle label="Compartir con Clínica" checked={settings.patients.consents.shareWithClinicDefault} onChange={v => update("patients.consents.shareWithClinicDefault", v)} />
                   </div>
                </SectionContainer>
              )}

              {activeSection === "clinicalDocs" && (
                 <SectionContainer title="Documentación Clínica" subtitle="Plantillas y catálogos.">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <Select label="Estilo de Nota" value={settings.clinicalDocs.templates.noteStyle} onChange={v=>update("clinicalDocs.templates.noteStyle", v)} options={["SOAP", "libre"]} />
                          <div className="mt-2 space-y-2">
                             <Toggle label="Diagnóstico requiere código" checked={settings.clinicalDocs.templates.diagnosis.requireCode} onChange={v=>update("clinicalDocs.templates.diagnosis.requireCode", v)} />
                             <Toggle label="Advertencias en Recetas" checked={settings.clinicalDocs.templates.prescription.showWarnings} onChange={v=>update("clinicalDocs.templates.prescription.showWarnings", v)} />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <p className="text-xs font-bold text-gray-500">Módulos Activos</p>
                          <Toggle label="Laboratorio" checked={settings.clinicalDocs.templates.labOrders.enabled} onChange={v=>update("clinicalDocs.templates.labOrders.enabled", v)} />
                          <Toggle label="Imagenología" checked={settings.clinicalDocs.templates.imagingOrders.enabled} onChange={v=>update("clinicalDocs.templates.imagingOrders.enabled", v)} />
                          <Toggle label="Referencias" checked={settings.clinicalDocs.templates.referrals.enabled} onChange={v=>update("clinicalDocs.templates.referrals.enabled", v)} />
                       </div>
                    </div>
                    <div className="mt-6">
                       <h4 className="text-sm font-bold text-gray-700 mb-2">Catálogos Frecuentes (Separa por líneas)</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Field label="Diagnósticos Frecuentes" value={settings.clinicalDocs.catalogs.frequentDiagnoses.join('\n')} onChange={v => update("clinicalDocs.catalogs.frequentDiagnoses", v.split('\n'))} textarea />
                          <Field label="Medicamentos Frecuentes" value={settings.clinicalDocs.catalogs.frequentMeds.join('\n')} onChange={v => update("clinicalDocs.catalogs.frequentMeds", v.split('\n'))} textarea />
                       </div>
                    </div>
                 </SectionContainer>
              )}

              {activeSection === "signature" && (
                 <SectionContainer title="Firma y Documentos" subtitle="Configuración de salida PDF.">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <Field label="Prefijo Documentos" value={settings.signature.docPrefix} onChange={v=>update("signature.docPrefix", v)} />
                       <Select label="Numeración" value={settings.signature.numbering} onChange={v=>update("signature.numbering", v)} options={["auto", "manual"]} />
                       <Field label="Lugar de Emisión" value={settings.signature.placeOfIssue} onChange={v=>update("signature.placeOfIssue", v)} />
                    </div>
                    <div className="mt-4">
                       <Field label="Pie de página legal" value={settings.signature.legalFooter} onChange={v=>update("signature.legalFooter", v)} textarea rows={2} />
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <h4 className="text-sm font-medium mb-2">Firma Digital</h4>
                          <ImageManager 
                             imgData={settings.signature.signatureImage} 
                             onUpload={(f) => handleImage(f, "signature.signatureImage")} 
                             onRemove={() => removeImage("signature.signatureImage")}
                             fileRef={fileSignRef}
                          />
                       </div>
                       <div>
                          <h4 className="text-sm font-medium mb-2">Sello Húmedo</h4>
                          <ImageManager 
                             imgData={settings.signature.stampImage} 
                             onUpload={(f) => handleImage(f, "signature.stampImage")} 
                             onRemove={() => removeImage("signature.stampImage")}
                             fileRef={fileStampRef}
                          />
                       </div>
                    </div>
                 </SectionContainer>
              )}

              {activeSection === "notifications" && (
                 <SectionContainer title="Notificaciones" subtitle="Mensajes automáticos al paciente.">
                    <div className="flex gap-4 mb-4">
                       <Toggle label="WhatsApp" checked={settings.notifications.channels.whatsapp} onChange={v=>update("notifications.channels.whatsapp", v)} />
                       <Toggle label="Email" checked={settings.notifications.channels.email} onChange={v=>update("notifications.channels.email", v)} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                       <Toggle label="Confirmación Automática" checked={settings.notifications.autoConfirm} onChange={v=>update("notifications.autoConfirm", v)} />
                       <Toggle label="Recordatorios Activos" checked={settings.notifications.reminders.enabled} onChange={v=>update("notifications.reminders.enabled", v)} />
                    </div>

                    <div className="space-y-4">
                       <Field label="Plantilla Confirmación" value={settings.notifications.templates.confirm} onChange={v=>update("notifications.templates.confirm", v)} textarea rows={2} />
                       <Field label="Plantilla Recordatorio" value={settings.notifications.templates.reminder} onChange={v=>update("notifications.templates.reminder", v)} textarea rows={2} />
                    </div>
                 </SectionContainer>
              )}

              {activeSection === "privacySecurity" && (
                 <SectionContainer title="Privacidad y Seguridad">
                    <div className="space-y-4">
                       <Field label="Bloquear sesión tras (min)" value={settings.privacySecurity.session.lockAfterMin} onChange={v=>update("privacySecurity.session.lockAfterMin", Number(v))} type="number" />
                       <Toggle label="Ocultar datos sensibles (Máscara)" checked={settings.privacySecurity.session.showSensitiveMask} onChange={v=>update("privacySecurity.session.showSensitiveMask", v)} />
                       <Toggle label="Permitir Exportación de Datos" checked={settings.privacySecurity.exportPolicy.allowExport} onChange={v=>update("privacySecurity.exportPolicy.allowExport", v)} />
                       <Toggle label="Auditoría Local Activa" checked={settings.privacySecurity.audit.enabled} onChange={v=>update("privacySecurity.audit.enabled", v)} />
                       
                       <div className="bg-gray-100 p-3 rounded text-xs font-mono max-h-40 overflow-auto">
                          <p className="text-gray-500 font-bold mb-1">Últimos Eventos:</p>
                          {settings.privacySecurity.audit.lastEvents.map((e, i) => (
                             <div key={i}>{e.at} - {e.action} ({e.section})</div>
                          ))}
                       </div>
                    </div>
                 </SectionContainer>
              )}
              
              {activeSection === "dataTools" && (
                 <SectionContainer title="Herramientas de Datos">
                    <p className="text-sm text-gray-600 mb-4">Acciones destructivas o de mantenimiento.</p>
                    <Button onClick={() => {
                        localStorage.removeItem(STORAGE_KEY);
                        setSettings(makeDefaults());
                        alert("Storage Limpiado");
                    }} danger>
                       Borrar Configuración Local
                    </Button>
                 </SectionContainer>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* MODAL IMPORT/EXPORT */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
             <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-700">{modalMode === "export" ? "Exportar JSON" : "Importar JSON"}</h3>
                <button onClick={() => setShowModal(false)}><Icon name="X" size={20}/></button>
             </div>
             <div className="p-4">
                <textarea 
                   className="w-full h-64 p-3 border rounded font-mono text-xs" 
                   value={modalPayload} 
                   onChange={e => setModalPayload(e.target.value)}
                   readOnly={modalMode === "export"}
                />
             </div>
             <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
                {modalMode === "export" ? (
                   <Button onClick={() => {navigator.clipboard.writeText(modalPayload); alert("Copiado!");}}>Copiar</Button>
                ) : (
                   <Button primary onClick={confirmImport}>Aplicar Importación</Button>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SUB-COMPONENTES DE UI
========================================================= */

const SectionContainer = ({ title, subtitle, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="p-5 border-b border-gray-100 bg-gray-50/50">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const Button = ({ children, primary, danger, disabled, onClick }) => {
  let cls = "px-4 py-2 rounded-lg text-sm font-medium transition-colors ";
  if (disabled) cls += "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400";
  else if (primary) cls += "bg-blue-600 text-white hover:bg-blue-700 shadow-sm";
  else if (danger) cls += "bg-white border border-red-200 text-red-600 hover:bg-red-50";
  else cls += "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50";
  return <button disabled={disabled} onClick={onClick} className={cls}>{children}</button>;
};

const Field = ({ label, value, onChange, type = "text", textarea, rows }) => (
  <div className="w-full">
    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{label}</label>
    {textarea ? (
      <textarea 
        className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
        rows={rows || 3} value={value || ""} onChange={e => onChange(e.target.value)} 
      />
    ) : (
      <input 
        type={type} 
        className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
        value={value || ""} onChange={e => onChange(e.target.value)} 
      />
    )}
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div className="w-full">
    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{label}</label>
    <select 
      className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
      value={value} onChange={e => onChange(e.target.value)}
    >
      {options.map(o => (
        <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
          {typeof o === 'string' ? o.charAt(0).toUpperCase() + o.slice(1) : o.label}
        </option>
      ))}
    </select>
  </div>
);

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer py-1">
    <div className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${checked ? "bg-blue-600" : "bg-gray-300"}`}>
      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </div>
    <span className="text-sm text-gray-700">{label}</span>
    <input type="checkbox" className="hidden" checked={!!checked} onChange={e => onChange(e.target.checked)} />
  </label>
);

// Editor de Array de Objetos para Tipos de Cita
const AppointmentTypesEditor = ({ value, onChange }) => {
  const add = () => onChange([...value, { id: Date.now(), name: "Nueva Cita", durationMin: 30, priceUsd: "", teleAllowed: true, requirements: "" }]);
  const remove = (idx) => onChange(value.filter((_, i) => i !== idx));
  const updateItem = (idx, k, v) => onChange(value.map((item, i) => i === idx ? { ...item, [k]: v } : item));

  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="p-3 border rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
          <div className="md:col-span-4"><Field label="Nombre" value={item.name} onChange={v => updateItem(i, "name", v)} /></div>
          <div className="md:col-span-2"><Field label="Minutos" value={item.durationMin} onChange={v => updateItem(i, "durationMin", Number(v))} type="number" /></div>
          <div className="md:col-span-2"><Field label="Precio $" value={item.priceUsd} onChange={v => updateItem(i, "priceUsd", v)} /></div>
          <div className="md:col-span-3 pb-2"><Toggle label="Tele" checked={item.teleAllowed} onChange={v => updateItem(i, "teleAllowed", v)} /></div>
          <div className="md:col-span-1 pb-1 text-right">
            <button onClick={() => remove(i)} className="text-red-500 hover:text-red-700"><Icon name="Trash" size={16}/></button>
          </div>
        </div>
      ))}
      <button onClick={add} className="text-sm text-blue-600 font-medium hover:underline">+ Agregar Tipo</button>
    </div>
  );
};

// Editor de Horario
const WeekScheduleEditor = ({ value, onChange }) => {
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const labels = { mon: "Lun", tue: "Mar", wed: "Mié", thu: "Jue", fri: "Vie", sat: "Sáb", sun: "Dom" };

  const toggleDay = (d, enabled) => {
    const day = value[d] || { enabled: false, blocks: [] };
    onChange({ ...value, [d]: { ...day, enabled, blocks: enabled && !day.blocks.length ? [{start:"08:00", end:"12:00"}] : day.blocks } });
  };
  
  const updateBlocks = (d, blocks) => onChange({ ...value, [d]: { ...value[d], blocks } });

  return (
    <div className="space-y-2">
      {days.map(d => {
        const day = value[d];
        return (
          <div key={d} className={`p-3 rounded-lg border ${day.enabled ? "bg-white border-gray-300" : "bg-gray-50 border-gray-100 opacity-75"}`}>
             <div className="flex items-center justify-between mb-2">
               <span className="font-bold text-sm uppercase text-gray-600">{labels[d]}</span>
               <Toggle label={day.enabled ? "Activo" : "Inactivo"} checked={day.enabled} onChange={v => toggleDay(d, v)} />
             </div>
             {day.enabled && (
               <div className="space-y-2 pl-2">
                 {day.blocks.map((b, i) => (
                   <div key={i} className="flex gap-2 items-center">
                      <input type="time" value={b.start} onChange={e => {
                        const nb = [...day.blocks]; nb[i].start = e.target.value; updateBlocks(d, nb);
                      }} className="border rounded p-1 text-sm" />
                      <span>-</span>
                      <input type="time" value={b.end} onChange={e => {
                        const nb = [...day.blocks]; nb[i].end = e.target.value; updateBlocks(d, nb);
                      }} className="border rounded p-1 text-sm" />
                      <button onClick={() => updateBlocks(d, day.blocks.filter((_, idx) => idx !== i))} className="text-red-400"><Icon name="X" size={14}/></button>
                   </div>
                 ))}
                 <button onClick={() => updateBlocks(d, [...day.blocks, {start:"14:00", end:"18:00"}])} className="text-xs text-blue-500">+ Bloque</button>
               </div>
             )}
          </div>
        )
      })}
    </div>
  );
};

const ImageManager = ({ imgData, onUpload, onRemove, fileRef }) => (
  <div className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50">
    {imgData.dataUrl ? (
      <img src={imgData.dataUrl} className="w-16 h-16 object-cover rounded bg-white border" alt="Preview" />
    ) : (
      <div className="w-16 h-16 rounded bg-gray-200 flex items-center justify-center text-gray-400"><Icon name="Image" size={24}/></div>
    )}
    <div className="flex-1">
      <div className="text-xs text-gray-500 mb-2">
         {imgData.dataUrl ? `${(imgData.bytes / 1024).toFixed(1)} KB - ${imgData.mime}` : "Sin imagen"}
      </div>
      <div className="flex gap-2">
         <Button onClick={() => fileRef.current.click()}>Subir</Button>
         {imgData.dataUrl && <Button danger onClick={onRemove}>Quitar</Button>}
         <input type="file" accept="image/png, image/jpeg" ref={fileRef} className="hidden" onChange={e => onUpload(e.target.files[0])} />
      </div>
    </div>
  </div>
);

const CertificationsEditor = ({ value, onChange }) => {
   const add = () => onChange([...value, { title: "", entity: "", year: "" }]);
   const update = (i, k, v) => onChange(value.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
   const remove = (i) => onChange(value.filter((_, idx) => idx !== i));

   return (
     <div className="space-y-2">
       {value.map((c, i) => (
         <div key={i} className="flex gap-2 items-center">
            <input placeholder="Título" value={c.title} onChange={e => update(i, "title", e.target.value)} className="flex-1 border rounded p-1 text-sm" />
            <input placeholder="Entidad" value={c.entity} onChange={e => update(i, "entity", e.target.value)} className="flex-1 border rounded p-1 text-sm" />
            <input placeholder="Año" value={c.year} onChange={e => update(i, "year", e.target.value)} className="w-16 border rounded p-1 text-sm" />
            <button onClick={() => remove(i)} className="text-red-500"><Icon name="X" size={14}/></button>
         </div>
       ))}
       <button onClick={add} className="text-xs text-blue-500">+ Agregar</button>
     </div>
   );
};