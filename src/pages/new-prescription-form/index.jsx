import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import { MOCK_PATIENTS } from "@/mock/patients";

const LS_KEY = "MOCK_PATIENTS";

function safeJsonParse(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function getPatientsFromLS() {
  return safeJsonParse(localStorage.getItem(LS_KEY) || "[]", []);
}

function savePatientsToLS(patients) {
  localStorage.setItem(LS_KEY, JSON.stringify(patients));
}

function ensurePatientShape(p) {
  return {
    ...p,
    diagnoses: Array.isArray(p?.diagnoses) ? p.diagnoses : [],
  };
}

export default function NewPrescriptionForm() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [medications, setMedications] = useState([]);
  const [currentMed, setCurrentMed] = useState({ name: "", dose: "", freq: "", dur: "" });

  const [doctorStamp, setDoctorStamp] = useState(null);
  const [error, setError] = useState("");

  const patientMeta = useMemo(() => {
    if (!patient) return null;
    return { name: patient.fullName, dni: patient.dni, age: patient.age };
  }, [patient]);

  useEffect(() => {
    setIsLoading(true);
    setError("");

    const locals = getPatientsFromLS();
    const fromLS = locals.find((p) => String(p.id) === String(patientId));
    const fromMock = (MOCK_PATIENTS || []).find((p) => String(p.id) === String(patientId));
    const found = fromLS || fromMock;

    if (!found) {
      setPatient(null);
      setIsLoading(false);
      setError("Paciente no encontrado para este ID.");
      return;
    }

    setPatient(ensurePatientShape(found));
    setIsLoading(false);
  }, [patientId]);

  const addMedication = () => {
    setError("");
    if (!currentMed.name?.trim() || !currentMed.dose?.trim()) {
      setError("Indica al menos nombre y dosis del medicamento.");
      return;
    }

    setMedications((prev) => [
      ...prev,
      {
        id: `MED-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: currentMed.name.trim(),
        dose: currentMed.dose.trim(),
        freq: currentMed.freq.trim(),
        dur: currentMed.dur.trim(),
      },
    ]);

    setCurrentMed({ name: "", dose: "", freq: "", dur: "" });
  };

  const removeMedication = (id) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  const handleFileUpload = (e) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setDoctorStamp(reader.result);
    reader.readAsDataURL(file);
  };

  const handleEmit = () => {
    setError("");

    if (!patient) return setError("No hay paciente cargado.");
    if (medications.length < 1) return setError("Debes agregar al menos 1 medicamento.");
    if (!doctorStamp) return setError("Debes subir firma/sello antes de emitir.");

    const now = new Date().toISOString();
    const prescription = {
      id: `RX-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type: "prescription",
      patientId: String(patientId),
      createdAt: now,
      medications: medications.map(({ id, ...rest }) => rest),
      doctorStamp,
      status: "signed",
    };

    const locals = getPatientsFromLS();
    const hasLS = locals.some((p) => String(p.id) === String(patientId));
    const basePatients = hasLS ? locals : [...locals, ...MOCK_PATIENTS];

    const updated = basePatients.map((p) => {
      if (String(p.id) !== String(patientId)) return p;
      const normalized = ensurePatientShape(p);
      return { ...normalized, diagnoses: [prescription, ...normalized.diagnoses] };
    });

    savePatientsToLS(updated);
    navigate(`/patients/${patientId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header userRole="doctor" />
        <Sidebar userRole="doctor" />
        <main className="pt-16 lg:ml-64">
          <div className="p-4 lg:p-6 max-w-5xl mx-auto">
            <div className="bg-card rounded-lg border border-border p-10">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Icon name="Loader2" size={18} className="animate-spin text-primary" />
                </span>
                <span>Sincronizando expediente…</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-background">
        <Header userRole="doctor" />
        <Sidebar userRole="doctor" />
        <main className="pt-16 lg:ml-64">
          <div className="p-4 lg:p-6 max-w-3xl mx-auto">
            <div className="bg-card rounded-lg border border-border p-6">
              <h1 className="text-xl font-semibold text-foreground">Paciente no disponible</h1>
              <p className="text-sm text-muted-foreground mt-2">{error || "No se pudo cargar el paciente."}</p>
              <div className="mt-4">
                <Button
                  onClick={() => navigate("/patients")}
                  className="bg-primary text-primary-foreground px-4 py-3 rounded-md"
                >
                  Volver a pacientes
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const inputBase =
    "w-full px-3 py-2.5 bg-muted/40 border border-border rounded-md text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="doctor" />
      <Sidebar userRole="doctor" />

      <main className="pt-16 lg:ml-64">
        <div className="p-4 lg:p-6 max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/patients/${patientId}`)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="ArrowLeft" size={20} />
              </Button>

              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Nueva Receta</h1>
                <p className="text-muted-foreground">
                  Prescripción médica digital para{" "}
                  <span className="text-foreground font-medium">{patientMeta?.name}</span>
                </p>
              </div>
            </div>
          </div>

          {error ? (
            <div className="mb-6 bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-sm text-destructive">
              <div className="flex items-start gap-2">
                <Icon name="AlertTriangle" size={16} className="mt-0.5" />
                <div>{error}</div>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Builder */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Medicamentos</h2>
                    <p className="text-sm text-muted-foreground">Agrega medicamentos a la receta.</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {medications.length} en lista
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-muted-foreground mb-2">
                      Nombre del medicamento *
                    </label>
                    <input
                      className={inputBase}
                      placeholder="Ej: Metformina"
                      value={currentMed.name}
                      onChange={(e) => setCurrentMed({ ...currentMed, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">
                      Dosis *
                    </label>
                    <input
                      className={inputBase}
                      placeholder="Ej: 500mg"
                      value={currentMed.dose}
                      onChange={(e) => setCurrentMed({ ...currentMed, dose: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">
                      Frecuencia
                    </label>
                    <input
                      className={inputBase}
                      placeholder="Ej: cada 8h"
                      value={currentMed.freq}
                      onChange={(e) => setCurrentMed({ ...currentMed, freq: e.target.value })}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-muted-foreground mb-2">
                      Duración
                    </label>
                    <input
                      className={inputBase}
                      placeholder="Ej: 7 días / 30 días"
                      value={currentMed.dur}
                      onChange={(e) => setCurrentMed({ ...currentMed, dur: e.target.value })}
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={addMedication}
                  className="mt-4 w-full bg-primary/10 text-primary hover:bg-primary/15"
                >
                  <Icon name="Plus" size={16} className="mr-2" /> Añadir a la lista
                </Button>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground">Lista de receta</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Revisa antes de firmar.
                </p>

                {medications.length === 0 ? (
                  <div className="bg-muted/30 border border-border rounded-lg p-4 text-sm text-muted-foreground">
                    Aún no has agregado medicamentos.
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {medications.map((m) => (
                      <div key={m.id} className="py-3 flex items-start justify-between gap-4">
                        <div>
                          <div className="font-medium text-foreground">{m.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {m.dose}
                            {m.freq ? ` • ${m.freq}` : ""}
                            {m.dur ? ` • ${m.dur}` : ""}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMedication(m.id)}
                          className="text-muted-foreground hover:text-destructive transition"
                          aria-label="Eliminar medicamento"
                        >
                          <Icon name="Trash2" size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Signature + actions */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="PenTool" size={18} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">Firma / Sello</h4>
                    <p className="text-sm text-muted-foreground">Obligatorio para emitir.</p>
                  </div>
                </div>

                <div className="w-full aspect-video border border-dashed border-border rounded-lg flex items-center justify-center bg-muted/30 overflow-hidden">
                  {doctorStamp ? (
                    <img src={doctorStamp} className="h-full object-contain" alt="Sello médico" />
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground cursor-pointer">
                      <Icon name="Upload" size={22} className="text-muted-foreground" />
                      <span className="text-primary font-medium">Subir sello/firma</span>
                      <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                    </label>
                  )}
                </div>

                {doctorStamp ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setDoctorStamp(null)}
                    className="mt-3 text-destructive hover:text-destructive"
                  >
                    Eliminar sello
                  </Button>
                ) : null}
              </div>

              <Button
                type="button"
                onClick={handleEmit}
                className="w-full bg-primary text-primary-foreground py-4 rounded-md"
              >
                <Icon name="CheckCircle2" size={18} className="mr-2" />
                Emitir y firmar
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/patients/${patientId}`)}
                className="w-full"
              >
                <Icon name="ChevronLeft" size={18} className="mr-2" />
                Volver al perfil
              </Button>

              <p className="text-xs text-muted-foreground leading-relaxed">
                La receta se guarda en el expediente del paciente (localStorage) y quedará visible al regresar.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
