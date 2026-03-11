import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { createTreatment } from "@/api/treatments";
import { fetchPatients } from "@/api/patient/patients";

export default function NewPrescriptionForm() {
  const { profile } = useAuth();
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(patientId || "");
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [medications, setMedications] = useState([]);
  const [currentMed, setCurrentMed] = useState({ name: "", dose: "", freq: "", dur: "" });
  const [doctorStamp, setDoctorStamp] = useState(null);
  const [error, setError] = useState("");

  const patientMeta = useMemo(() => {
    if (!patient) return null;
    return { name: patient.full_name, dni: patient.id.slice(0,8), age: patient.metadata?.age || "--" };
  }, [patient]);

  // Cargar lista de pacientes del doctor
  useEffect(() => {
    const loadPatients = async () => {
      if (!profile?.id) return;
      try {
        const data = await fetchPatients({ professional_id: profile.id });
        setPatients(data || []);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };
    loadPatients();
  }, [profile?.id]);

  // Cargar detalles del paciente seleccionado
  useEffect(() => {
    const loadPatient = async () => {
      if (!selectedPatientId) {
        setPatient(null);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError("");
      const { data, error } = await supabase.from('profiles').select('*').eq('id', selectedPatientId).single();
      if (!error && data) setPatient(data);
      else setError("Paciente no encontrado.");
      setIsLoading(false);
    };
    loadPatient();
  }, [selectedPatientId]);

  const addMedication = () => {
    setError("");
    if (!currentMed.name?.trim() || !currentMed.dose?.trim()) {
      setError("Indica al menos nombre y dosis del medicamento.");
      return;
    }
    setMedications((prev) => [...prev, {
      id: `MED-${Date.now()}`,
      name: currentMed.name.trim(),
      dose: currentMed.dose.trim(),
      freq: currentMed.freq.trim(),
      dur: currentMed.dur.trim(),
    }]);
    setCurrentMed({ name: "", dose: "", freq: "", dur: "" });
  };

  const removeMedication = (id) => setMedications((prev) => prev.filter((m) => m.id !== id));

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setDoctorStamp(reader.result);
    reader.readAsDataURL(file);
  };

  const handleEmit = async () => {
    setError("");
    if (!patient) return setError("No hay paciente cargado.");
    if (medications.length < 1) return setError("Debes agregar al menos 1 medicamento.");
    if (!doctorStamp) return setError("Debes subir firma/sello antes de emitir.");
    if (!profile?.id) return alert("Error: Sesión no válida.");

    setSaving(true);
    try {
      // Guardar cada medicamento como un registro en 'treatments' en Supabase
      const tasks = medications.map(med => 
        createTreatment({
            patient_id: selectedPatientId,
            doctor_id: profile.id,
            name: med.name,
            dosage: med.dose,
            frequency: med.freq,
            instructions: med.dur,
            status: 'active',
            type: 'Medicamento',
            start_date: new Date().toISOString().split('T')[0],
            metadata: { 
                digital_signature: true, 
                doctor_stamp: doctorStamp.slice(0, 100) + '... (truncated for DB)'
            }
        })
      );
      
      await Promise.all(tasks);
      navigate(`/patients/${selectedPatientId}`);
    } catch (err) {
      console.error("Error creating treatments:", err);
      alert("Error al guardar prescripción: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div className="p-20 text-center"><Icon name="Loader2" className="animate-spin text-primary" size={40} /></div>;

  const inputBase = "w-full px-3 py-2.5 bg-muted/40 border border-border rounded-md text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="doctor" />
      <Sidebar userRole="doctor" />

      <main className="pt-16 lg:ml-64">
        <div className="p-4 lg:p-6 max-w-5xl mx-auto">
          <div className="mb-6 flex items-center gap-3 text-left">
            <Button variant="ghost" size="icon" onClick={() => navigate(selectedPatientId ? `/patients/${selectedPatientId}` : '/patients')} className="text-muted-foreground"><Icon name="ArrowLeft" size={20} /></Button>
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold">Nueva Receta Electrónica</h1>
              {patientId ? (
                <p className="text-muted-foreground">Prescripción digital para <span className="text-foreground font-medium">{patientMeta?.name}</span></p>
              ) : (
                <div className="mt-2 max-w-xs">
                  <select 
                    className={inputBase}
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                  >
                    <option value="">Seleccionar Paciente...</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.full_name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6 text-left">
              <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Agregar Medicamento</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2"><label className="text-xs font-semibold text-gray-400 uppercase">Nombre *</label><input className={inputBase} placeholder="Ej: Metformina" value={currentMed.name} onChange={(e) => setCurrentMed({ ...currentMed, name: e.target.value })} /></div>
                  <div><label className="text-xs font-semibold text-gray-400 uppercase">Dosis *</label><input className={inputBase} placeholder="Ej: 500mg" value={currentMed.dose} onChange={(e) => setCurrentMed({ ...currentMed, dose: e.target.value })} /></div>
                  <div><label className="text-xs font-semibold text-gray-400 uppercase">Frecuencia</label><input className={inputBase} placeholder="Ej: cada 8h" value={currentMed.freq} onChange={(e) => setCurrentMed({ ...currentMed, freq: e.target.value })} /></div>
                  <div className="md:col-span-2"><label className="text-xs font-semibold text-gray-400 uppercase">Duración / Instrucciones</label><input className={inputBase} placeholder="Ej: 7 días" value={currentMed.dur} onChange={(e) => setCurrentMed({ ...currentMed, dur: e.target.value })} /></div>
                </div>
                <Button onClick={addMedication} className="mt-4 w-full border-dashed border-primary/40 text-primary" variant="outline"><Icon name="Plus" size={16} className="mr-2" /> Añadir Medicamento</Button>
              </div>

              <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                <h3 className="text-lg font-semibold">Lista de prescripción</h3>
                {medications.length === 0 ? <p className="text-sm text-muted-foreground py-4">No hay medicamentos en la lista.</p> : (
                  <div className="divide-y divide-border">
                    {medications.map((m) => (
                      <div key={m.id} className="py-3 flex items-start justify-between">
                        <div><div className="font-medium">{m.name}</div><div className="text-xs text-muted-foreground mt-1">{m.dose} • {m.freq} • {m.dur}</div></div>
                        <button onClick={() => removeMedication(m.id)} className="text-red-400 hover:text-red-600 transition"><Icon name="Trash2" size={18} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-border p-6 text-left shadow-sm">
                <h4 className="text-lg font-semibold mb-4">Emitir y Firmar</h4>
                <div className="w-full aspect-video border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden mb-6">
                  {doctorStamp ? <img src={doctorStamp} className="h-full object-contain" /> : (
                    <label className="cursor-pointer text-center p-6"><Icon name="Upload" size={32} className="mx-auto text-gray-300 mb-2" /><span className="text-xs font-bold text-blue-600 uppercase">Subir Firma Digital</span><input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" /></label>
                  )}
                </div>
                <Button onClick={handleEmit} disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl shadow-lg shadow-emerald-900/10">
                  <Icon name={saving ? "Loader2" : "CheckCircle2"} size={18} className={`mr-2 ${saving ? 'animate-spin' : ''}`} />
                  {saving ? "Emitiendo..." : "Emitir Receta"}
                </Button>
                {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}
                <p className="text-[10px] text-gray-400 text-center mt-4">La receta se guardará en el expediente clínico del paciente en la nube.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
