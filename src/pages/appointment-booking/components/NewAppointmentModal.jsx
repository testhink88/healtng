import React, { useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

/**
 * Modal para crear cita:
 * props:
 * - isOpen, onClose
 * - onSave(appointmentData)
 * - selectedDate, selectedTime
 * - patients: [{id,name,phone}]
 * - professionalId (opcional si luego quieres guardarlo)
 */
export default function NewAppointmentModal({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  selectedTime,
  patients = [],
  professionalId = "self",
}) {
  const [mode, setMode] = useState("existing"); // 'existing' | 'new'
  const [patientId, setPatientId] = useState("");
  const [newPatient, setNewPatient] = useState({ name: "", phone: "" });
  const [date, setDate] = useState(selectedDate || "");
  const [time, setTime] = useState(selectedTime || "");
  const [reason, setReason] = useState("");

  const canSave = useMemo(() => {
    if (!date || !time || !reason.trim()) return false;
    if (mode === "existing") return Boolean(patientId);
    return newPatient.name.trim().length > 1;
  }, [mode, patientId, newPatient, date, time, reason]);

  const handleSave = () => {
    const payload = {
      patientId: mode === "existing" ? patientId : `p-${Date.now()}`,
      patientName:
        mode === "existing"
          ? (patients.find((p) => p.id === patientId)?.name || "Paciente")
          : newPatient.name,
      patientPhone:
        mode === "existing"
          ? (patients.find((p) => p.id === patientId)?.phone || "")
          : newPatient.phone,
      professionalId,
      date,
      time,
      duration: 30,
      reason,
      status: "confirmed",
    };
    onSave?.(payload);
    onClose?.();
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Nueva Cita">
      <div className="space-y-4">
        {/* paciente */}
        <div className="flex items-center gap-3">
          <button
            className={`text-xs px-2 py-1 rounded ${mode === "existing" ? "bg-primary/10" : "bg-muted"}`}
            onClick={() => setMode("existing")}
          >
            Paciente registrado
          </button>
          <button
            className={`text-xs px-2 py-1 rounded ${mode === "new" ? "bg-primary/10" : "bg-muted"}`}
            onClick={() => setMode("new")}
          >
            Nuevo paciente
          </button>
        </div>

        {mode === "existing" ? (
          <div>
            <label className="text-sm font-medium">Paciente *</label>
            <select
              className="w-full mt-1 px-3 py-2 border border-border rounded-md"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            >
              <option value="">Seleccionar paciente</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.phone}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Nombre *</label>
              <Input value={newPatient.name} onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })} placeholder="Ej. Ana Pérez" />
            </div>
            <div>
              <label className="text-sm font-medium">Teléfono</label>
              <Input value={newPatient.phone} onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })} placeholder="+58 xxx-xxxxxxx" />
            </div>
          </div>
        )}

        {/* fecha/hora */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Fecha *</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Hora *</label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>

        {/* motivo */}
        <div>
          <label className="text-sm font-medium">Motivo de consulta *</label>
          <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ej. Control post-operatorio" />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="default" disabled={!canSave} onClick={handleSave}>Guardar</Button>
        </div>
      </div>
    </Modal>
  );
}
