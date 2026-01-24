import React, { useEffect, useMemo, useState } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import { usePractice } from "@/context/PracticeContext"; // <- AJUSTA la ruta si cambia

/* =========================
   STORAGE (separado)
========================= */
const GLOBAL_KEY = "HEALTNG_DOCTOR_GLOBAL_V1";
const OFFICE_PREFIX = "HEALTNG_OFFICE_SETTINGS_V1:";

// legacy keys (por compatibilidad)
const LEGACY_FLAT_KEY = "DOCTOR_PROFILE";
const LEGACY_V2_KEY = "DOCTOR_SETTINGS_V2";
const IMPORT_MARKER = "HEALTNG_DOCTOR_SETTINGS_IMPORTED_V1"; // evita re-importar

const BRAND_BLUE = "#0E39B1";

// límites para localStorage
const MAX_IMAGE_BYTES = 800_000;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg"];

function safeJsonParse(raw, fallback) {
  try { return JSON.parse(raw); } catch { return fallback; }
}
function officeKey(officeId) {
  return `${OFFICE_PREFIX}${officeId}`;
}

function defaultOutput() {
  return {
    printMode: "digital", // digital | preprinted
    paperSize: "a4",
    margins: { top: 40, bottom: 40, left: 25, right: 25 },
    showQr: true,
    digitalDisclaimer: true,
  };
}

function defaultGlobalDoctor() {
  return {
    name: "",
    specialty: "",
    license_mpps: "",
    license_cm: "",
    email: "",
    phone: "",
    university: "",
  };
}

function defaultOfficeSettings() {
  return {
    label: "",        // alias opcional (si quieres sobrescribir nombre del office)
    clinic_name: "",
    address: "",
    city: "",
    phones: "",
    branding: { logo: null, signature: null },
    output: defaultOutput(),
  };
}

function loadGlobal() {
  const raw = localStorage.getItem(GLOBAL_KEY);
  const parsed = safeJsonParse(raw, null);
  return parsed && typeof parsed === "object" ? { ...defaultGlobalDoctor(), ...parsed } : defaultGlobalDoctor();
}
function saveGlobal(obj) {
  localStorage.setItem(GLOBAL_KEY, JSON.stringify(obj));
}

function loadOffice(officeId) {
  if (!officeId) return defaultOfficeSettings();
  const raw = localStorage.getItem(officeKey(officeId));
  const parsed = safeJsonParse(raw, null);
  return parsed && typeof parsed === "object"
    ? {
        ...defaultOfficeSettings(),
        ...parsed,
        branding: { ...defaultOfficeSettings().branding, ...(parsed.branding || {}) },
        output: { ...defaultOutput(), ...(parsed.output || {}) },
      }
    : defaultOfficeSettings();
}
function saveOffice(officeId, obj) {
  if (!officeId) return;
  localStorage.setItem(officeKey(officeId), JSON.stringify(obj));
}

/* =========================
   Migración (legacy → global + office)
========================= */
function extractFromLegacyFlat(legacyFlat) {
  // tu profile plano original
  return {
    global: {
      name: legacyFlat?.name || "",
      specialty: legacyFlat?.specialty || "",
      license_mpps: legacyFlat?.license_mpps || "",
      license_cm: legacyFlat?.license_cm || "",
      email: legacyFlat?.email || "",
      phone: legacyFlat?.phone || "",
      university: legacyFlat?.university || "",
    },
    office: {
      label: legacyFlat?.clinic_name ? `${legacyFlat.clinic_name}` : "",
      clinic_name: legacyFlat?.clinic_name || "",
      address: legacyFlat?.address || "",
      city: legacyFlat?.city || "",
      phones: legacyFlat?.phone || "",
      branding: { logo: legacyFlat?.logo || null, signature: legacyFlat?.signature || null },
      output: {
        printMode: legacyFlat?.printMode || "digital",
        paperSize: legacyFlat?.paperSize || "a4",
        margins: legacyFlat?.margins || { top: 40, bottom: 40, left: 25, right: 25 },
        showQr: legacyFlat?.showQr ?? true,
        digitalDisclaimer: legacyFlat?.digitalDisclaimer ?? true,
      },
    },
  };
}

function extractFromLegacyV2(v2) {
  // tu DOCTOR_SETTINGS_V2 (doctor + practices[])
  const firstPractice =
    v2?.practices?.find(p => p?.id === v2?.activePracticeId) ||
    v2?.practices?.[0] ||
    null;

  return {
    global: { ...defaultGlobalDoctor(), ...(v2?.doctor || {}) },
    office: firstPractice
      ? {
          label: firstPractice.label || "",
          clinic_name: firstPractice.clinic_name || "",
          address: firstPractice.address || "",
          city: firstPractice.city || "",
          phones: firstPractice.phones || "",
          branding: {
            logo: firstPractice?.branding?.logo || null,
            signature: firstPractice?.branding?.signature || null,
          },
          output: { ...defaultOutput(), ...(firstPractice.output || {}) },
        }
      : defaultOfficeSettings(),
  };
}

/* =========================
   UI helper: ImageUploader
========================= */
const ImageUploader = ({ label, imageSrc, onUpload, onRemove, helpText, isSignature = false }) => (
  <div className="border border-gray-200 rounded-xl p-4 bg-white hover:border-blue-300 transition-colors">
    <div className="flex justify-between items-start mb-3">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {imageSrc && (
        <button onClick={onRemove} className="text-xs text-red-500 hover:text-red-700 font-medium">
          Eliminar
        </button>
      )}
    </div>

    <div
      className={`relative border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group overflow-hidden ${
        isSignature ? "h-24" : "h-32"
      }`}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt="Preview"
          className={`w-full h-full object-contain p-2 ${isSignature ? "mix-blend-multiply" : ""}`}
        />
      ) : (
        <div className="text-center p-4">
          <Icon name="UploadCloud" className="mx-auto text-gray-400 mb-2" size={24} />
          <span className="text-xs text-gray-400 font-medium">Clic para subir</span>
        </div>
      )}
      <input type="file" accept="image/png, image/jpeg" className="absolute inset-0 opacity-0 cursor-pointer" onChange={onUpload} />
    </div>

    {helpText && <p className="text-[10px] text-gray-400 mt-2 leading-tight">{helpText}</p>}
  </div>
);

/* =========================
   Componente principal
========================= */
export default function DoctorSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  // Contexto del consultorio activo (single source of truth)
  const { currentPractice, currentOffice } = usePractice();
  const officeId = currentOffice?.id || null;

  // Estados locales separados
  const [doctor, setDoctor] = useState(() => loadGlobal());
  const [office, setOffice] = useState(() => defaultOfficeSettings());

  // Cargar office settings cada vez que cambie el officeId
  useEffect(() => {
    setError("");
    if (!officeId) {
      setOffice(defaultOfficeSettings());
      return;
    }
    setOffice(loadOffice(officeId));
  }, [officeId]);

  // Import legacy una sola vez (al primer office válido)
  useEffect(() => {
    if (!officeId) return;

    const imported = localStorage.getItem(IMPORT_MARKER) === "1";
    if (imported) return;

    const hasGlobal = !!localStorage.getItem(GLOBAL_KEY);
    const hasOffice = !!localStorage.getItem(officeKey(officeId));

    // Si ya hay datos nuevos, no importes
    if (hasGlobal || hasOffice) {
      localStorage.setItem(IMPORT_MARKER, "1");
      return;
    }

    // Intenta importar V2 primero, luego flat legacy
    const v2Raw = localStorage.getItem(LEGACY_V2_KEY);
    if (v2Raw) {
      const v2 = safeJsonParse(v2Raw, null);
      if (v2 && typeof v2 === "object") {
        const { global, office: officeFromLegacy } = extractFromLegacyV2(v2);
        saveGlobal(global);
        saveOffice(officeId, officeFromLegacy);
        setDoctor(global);
        setOffice(officeFromLegacy);
        localStorage.setItem(IMPORT_MARKER, "1");
        setToast("Importados ajustes previos (V2) al consultorio activo.");
        return;
      }
    }

    const legacyRaw = localStorage.getItem(LEGACY_FLAT_KEY);
    if (legacyRaw) {
      const legacy = safeJsonParse(legacyRaw, null);
      if (legacy && typeof legacy === "object") {
        const { global, office: officeFromLegacy } = extractFromLegacyFlat(legacy);
        saveGlobal(global);
        saveOffice(officeId, officeFromLegacy);
        setDoctor(global);
        setOffice(officeFromLegacy);
        localStorage.setItem(IMPORT_MARKER, "1");
        setToast("Importados ajustes previos (legacy) al consultorio activo.");
      }
    } else {
      localStorage.setItem(IMPORT_MARKER, "1");
    }
  }, [officeId]);

  const effectiveHeader = useMemo(() => {
    // “vista” que usará impresión / preview
    return {
      doctor,
      office,
      context: {
        practiceName: currentPractice?.name || "",
        officeName: currentOffice?.name || "",
      },
    };
  }, [doctor, office, currentPractice, currentOffice]);

  /* =========================
     Updaters
  ========================= */
  const updateDoctor = (field, value) => setDoctor(prev => ({ ...prev, [field]: value }));

  const updateOfficePatch = (patch) => setOffice(prev => ({ ...prev, ...patch }));
  const updateOfficeBranding = (field, value) =>
    setOffice(prev => ({ ...prev, branding: { ...prev.branding, [field]: value } }));
  const updateOfficeOutput = (field, value) =>
    setOffice(prev => ({ ...prev, output: { ...prev.output, [field]: value } }));
  const updateMargins = (side, value) => {
    const num = Number.isFinite(Number(value)) ? Math.max(0, parseInt(value, 10)) : 0;
    setOffice(prev => ({ ...prev, output: { ...prev.output, margins: { ...prev.output.margins, [side]: num } } }));
  };

  // imágenes robustas
  const handleImage = (e, field) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Formato no permitido. Usa PNG o JPG.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Imagen demasiado pesada. Reduce el tamaño antes de subirla (ideal < 800KB).");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      updateOfficeBranding(field, reader.result);
      setToast("Imagen cargada.");
    };
    reader.readAsDataURL(file);
  };

  const persist = () => {
    setIsSaving(true);
    setError("");

    try {
      if (!doctor.name.trim()) {
        setError("El nombre del médico es obligatorio.");
        setIsSaving(false);
        return;
      }
      if (!officeId) {
        setError("Selecciona un consultorio activo para guardar ajustes por consultorio.");
        setIsSaving(false);
        return;
      }

      saveGlobal(doctor);
      saveOffice(officeId, office);
      setToast("Cambios guardados.");
    } catch (e) {
      setError("No se pudo guardar. Posible límite de almacenamiento excedido.");
      console.error(e);
    } finally {
      setTimeout(() => setIsSaving(false), 300);
    }
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  /* =========================
     Gating: sin consultorio activo
  ========================= */
  const noOffice = !officeId;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      <Header userRole="doctor" />
      <Sidebar userRole="doctor" />

      <main className="lg:ml-64 pt-24 px-6 max-w-5xl mx-auto">
        {(error || toast) && (
          <div
            className={`mb-6 rounded-xl border p-4 text-sm ${
              error ? "bg-red-50 border-red-100 text-red-700" : "bg-blue-50 border-blue-100 text-blue-800"
            }`}
          >
            <div className="flex items-start gap-2">
              <Icon name={error ? "AlertTriangle" : "CheckCircle2"} size={16} className="mt-0.5" />
              <div>{error || toast}</div>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <h1 className="text-2xl font-light text-gray-900">Configuración Profesional</h1>
            <p className="text-sm text-gray-500 mt-1">
              Global del médico + ajustes por consultorio activo (branding e impresión).
            </p>

            <div className="mt-3 text-xs text-gray-600 flex flex-wrap items-center gap-2">
              <span className="px-2 py-1 rounded-lg bg-white border border-gray-200">
                Centro: <b className="text-gray-900">{currentPractice?.name || "—"}</b>
              </span>
              <span className="px-2 py-1 rounded-lg bg-white border border-gray-200">
                Consultorio: <b className="text-gray-900">{currentOffice?.name || "—"}</b>
              </span>
              {noOffice && (
                <span className="px-2 py-1 rounded-lg bg-amber-50 border border-amber-100 text-amber-800">
                  Selecciona un consultorio en el shell para editar sus ajustes
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(true)}
              disabled={noOffice}
              className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <Icon name="Eye" size={18} className="mr-2" />
              Probar Impresión
            </Button>

            <Button
              onClick={persist}
              className="bg-[#0E39B1] text-white px-8 shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 transition-all"
              disabled={noOffice}
            >
              {isSaving ? <Icon name="Loader2" className="animate-spin" /> : "Guardar Cambios"}
            </Button>
          </div>
        </div>

        {/* NAVEGACIÓN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <nav className="space-y-1 sticky top-28">
              {[
                { id: "profile", label: "Datos del Médico", icon: "User", desc: "Identidad y títulos (global)" },
                { id: "office", label: "Datos del Consultorio", icon: "MapPin", desc: "Dirección y teléfonos (office)" },
                { id: "branding", label: "Identidad Visual", icon: "PenTool", desc: "Logo y firma (office)" },
                { id: "output", label: "Salida e Impresión", icon: "Printer", desc: "Márgenes/papel (office)" },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl transition-all text-left ${
                    activeTab === tab.id
                      ? "bg-white shadow-md border border-blue-100 ring-1 ring-blue-50"
                      : "hover:bg-gray-100/50 text-gray-500"
                  }`}
                >
                  <div className={`mt-0.5 ${activeTab === tab.id ? "text-[#0E39B1]" : "text-gray-400"}`}>
                    <Icon name={tab.icon} size={18} />
                  </div>
                  <div>
                    <span className={`block text-sm font-medium ${activeTab === tab.id ? "text-gray-900" : "text-gray-600"}`}>
                      {tab.label}
                    </span>
                    <span className="text-[10px] text-gray-400">{tab.desc}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm min-h-[500px]">
              {/* TAB: DATOS MÉDICO (global) */}
              {activeTab === "profile" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre Completo</label>
                      <input
                        value={doctor.name}
                        onChange={e => updateDoctor("name", e.target.value)}
                        className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Ej: Dr. Carlos Pérez"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Especialidad</label>
                      <input
                        value={doctor.specialty}
                        onChange={e => updateDoctor("specialty", e.target.value)}
                        className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                        placeholder="Ej: Cardiología Intervencionista"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Universidad / Postgrado</label>
                      <input
                        value={doctor.university}
                        onChange={e => updateDoctor("university", e.target.value)}
                        className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                        placeholder="Ej: UCV / Hospital Militar"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Matrícula MPPS</label>
                      <input
                        value={doctor.license_mpps}
                        onChange={e => updateDoctor("license_mpps", e.target.value)}
                        className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Colegio de Médicos</label>
                      <input
                        value={doctor.license_cm}
                        onChange={e => updateDoctor("license_cm", e.target.value)}
                        className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: DATOS CONSULTORIO (office) */}
              {activeTab === "office" && (
                <div className={`space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ${noOffice ? "opacity-50 pointer-events-none" : ""}`}>
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre del Centro / Clínica</label>
                    <input
                      value={office.clinic_name}
                      onChange={e => updateOfficePatch({ clinic_name: e.target.value })}
                      className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                      placeholder="Ej: Policlínica Metropolitana"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dirección Completa</label>
                    <textarea
                      value={office.address}
                      onChange={e => updateOfficePatch({ address: e.target.value })}
                      className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none h-24 resize-none"
                      placeholder="Piso, Consultorio, Torre..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ciudad / Estado</label>
                      <input
                        value={office.city}
                        onChange={e => updateOfficePatch({ city: e.target.value })}
                        className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Teléfonos de Citas</label>
                      <input
                        value={office.phones}
                        onChange={e => updateOfficePatch({ phones: e.target.value })}
                        className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                        placeholder="Ej: 0414-xxxxxxx / 0241-xxxxxxx"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: BRANDING (office) */}
              {activeTab === "branding" && (
                <div className={`space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 ${noOffice ? "opacity-50 pointer-events-none" : ""}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ImageUploader
                      label="Logotipo (consultorio activo)"
                      imageSrc={office.branding.logo}
                      onUpload={(e) => handleImage(e, "logo")}
                      onRemove={() => updateOfficeBranding("logo", null)}
                      helpText="Aparecerá en el encabezado en modo digital."
                    />
                    <ImageUploader
                      label="Firma y Sello (consultorio activo)"
                      imageSrc={office.branding.signature}
                      isSignature={true}
                      onUpload={(e) => handleImage(e, "signature")}
                      onRemove={() => updateOfficeBranding("signature", null)}
                      helpText="Se aplica transparencia visual al fondo blanco."
                    />
                  </div>

                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
                    <Icon name="AlertCircle" className="text-amber-600 flex-shrink-0" />
                    <p className="text-xs text-amber-800 leading-relaxed">
                      <strong>Importante:</strong> Firma digitalizada puede no aplicar para casos regulados. En esos casos: imprime sin firma y firma a mano.
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-xs text-gray-600 leading-relaxed">
                    <strong>Riesgo técnico:</strong> guardar imágenes en localStorage puede fallar por tamaño. Mantén logos/firma livianos.
                  </div>
                </div>
              )}

              {/* TAB: OUTPUT (office) */}
              {activeTab === "output" && (
                <div className={`space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 ${noOffice ? "opacity-50 pointer-events-none" : ""}`}>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                      Modo de Impresión (consultorio activo)
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        onClick={() => updateOfficeOutput("printMode", "digital")}
                        className={`cursor-pointer p-4 rounded-xl border transition-all ${
                          office.output.printMode === "digital"
                            ? "bg-blue-50 border-blue-200 ring-1 ring-blue-100"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <Icon name="FileText" size={20} className="text-blue-600" />
                          </div>
                          <span className="font-semibold text-gray-900">Hoja en Blanco / PDF</span>
                        </div>
                        <p className="text-xs text-gray-500">Imprime TODO: header, logo, firma, pie.</p>
                      </div>

                      <div
                        onClick={() => updateOfficeOutput("printMode", "preprinted")}
                        className={`cursor-pointer p-4 rounded-xl border transition-all ${
                          office.output.printMode === "preprinted"
                            ? "bg-emerald-50 border-emerald-200 ring-1 ring-emerald-100"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <Icon name="Printer" size={20} className="text-emerald-600" />
                          </div>
                          <span className="font-semibold text-gray-900">Papel Membretado</span>
                        </div>
                        <p className="text-xs text-gray-500">Imprime SOLO contenido clínico.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Icon name="Move" size={16} /> Calibración de Márgenes (mm)
                      </h3>
                      <span className="text-xs text-gray-400">Por consultorio</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {["top", "bottom", "left", "right"].map((side) => (
                        <div key={side}>
                          <label className="text-[10px] uppercase text-gray-500 font-semibold mb-1 block">
                            {side === "top" ? "Superior" : side === "bottom" ? "Inferior" : side === "left" ? "Izquierdo" : "Derecho"}
                          </label>
                          <input
                            type="number"
                            value={office.output.margins?.[side] ?? 0}
                            onChange={(e) => updateMargins(side, e.target.value)}
                            className="w-full p-2 border rounded-lg text-center"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={!!office.output.showQr}
                        onChange={(e) => updateOfficeOutput("showQr", e.target.checked)}
                      />
                      Mostrar QR de verificación (futuro)
                    </label>

                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={!!office.output.digitalDisclaimer}
                        onChange={(e) => updateOfficeOutput("digitalDisclaimer", e.target.checked)}
                      />
                      Incluir disclaimer digital
                    </label>
                  </div>
                </div>
              )}
            </div>

            {noOffice && (
              <div className="mt-4 bg-white border border-gray-200 rounded-2xl p-4 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <Icon name="MapPin" size={16} className="mt-0.5 text-[#0E39B1]" />
                  <div>
                    Selecciona un consultorio activo en el selector del sistema (PracticeBar) para editar branding/impresión.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* PREVIEW */}
      {isPreviewOpen && !noOffice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-700">Prueba de Impresión</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {currentPractice?.name || "—"} • <span className="font-medium text-gray-700">{currentOffice?.name || "—"}</span>
                </p>
              </div>
              <button onClick={() => setIsPreviewOpen(false)} className="p-2 hover:bg-gray-200 rounded-full">
                <Icon name="X" />
              </button>
            </div>

            <div className="flex-1 bg-gray-200 overflow-y-auto p-8 flex justify-center">
              <div
                className="bg-white shadow-2xl relative flex flex-col"
                style={{
                  width: "210mm",
                  minHeight: "297mm",
                  paddingTop: `${office.output.margins?.top ?? 40}mm`,
                  paddingBottom: `${office.output.margins?.bottom ?? 40}mm`,
                  paddingLeft: `${office.output.margins?.left ?? 25}mm`,
                  paddingRight: `${office.output.margins?.right ?? 25}mm`,
                }}
              >
                {office.output.printMode === "digital" && (
                  <div
                    className="absolute top-0 left-0 right-0 p-8 border-b-2 flex justify-between items-start"
                    style={{ height: `${office.output.margins?.top ?? 40}mm`, borderColor: BRAND_BLUE }}
                  >
                    <div>
                      <h1 className="text-xl font-bold" style={{ color: BRAND_BLUE }}>
                        {effectiveHeader.doctor.name || "Nombre del Médico"}
                      </h1>
                      <p className="text-xs uppercase tracking-widest text-gray-500">
                        {effectiveHeader.doctor.specialty || "Especialidad"}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {office.clinic_name || effectiveHeader.context.practiceName || "Centro"} • {office.city || "Ciudad"}
                      </p>
                    </div>
                    {office.branding.logo ? <img src={office.branding.logo} className="h-full object-contain" alt="Logo" /> : null}
                  </div>
                )}

                <div className="flex-1 border border-dashed border-gray-200 rounded p-4 flex items-center justify-center text-gray-400 text-sm">
                  <div className="text-center">
                    <p className="mb-2">ÁREA DE CONTENIDO CLÍNICO</p>
                    <p className="text-xs">Aquí irá el diagnóstico, indicaciones y tratamiento.</p>
                    <p className="text-xs mt-4" style={{ color: BRAND_BLUE }}>
                      {office.output.printMode === "preprinted"
                        ? "Modo Papel Membretado: Branding oculto."
                        : "Modo Digital: Branding visible."}
                    </p>
                  </div>
                </div>

                {office.output.printMode === "digital" && (
                  <div
                    className="absolute bottom-0 left-0 right-0 p-8 text-center"
                    style={{ height: `${office.output.margins?.bottom ?? 40}mm` }}
                  >
                    {office.branding.signature ? (
                      <img src={office.branding.signature} className="h-16 mx-auto mix-blend-multiply" alt="Firma" />
                    ) : null}
                    <div className="border-t border-gray-300 w-1/2 mx-auto pt-2 mt-2">
                      <p className="font-bold text-xs">{effectiveHeader.doctor.name}</p>
                      <p className="text-[9px] text-gray-500">{effectiveHeader.doctor.license_mpps}</p>
                      <p className="text-[9px] text-gray-400">{office.phones}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
