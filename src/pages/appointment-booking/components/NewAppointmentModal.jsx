// src/components/modals/NewAppointmentModal.jsx
import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function NewAppointmentModal({ isOpen, onClose, onSave, selectedDate, selectedTime }) {
  const [mode, setMode] = useState("new");
  const [formData, setFormData] = useState({
    name: "",
    docId: "", // Cédula
    phone: "",
    gender: "Femenino",
    birthDate: "",
    reason: "Primera vez", // Punto 8: Motivo
    date: selectedDate || "",
    time: selectedTime || ""
  });

  const handleSave = () => {
    const newPatient = {
      id: `p-${Date.now()}`,
      ...formData,
      age: calculateAge(formData.birthDate), // Helper simple
      lastVisit: new Date().toISOString().split('T')[0],
      status: "active"
    };

    // PERSISTENCIA SIMULADA: Guardamos en localStorage para el Directorio
    const currentPatients = JSON.parse(localStorage.getItem("MOCK_PATIENTS") || "[]");
    localStorage.setItem("MOCK_PATIENTS", JSON.stringify([...currentPatients, newPatient]));

    onSave?.(newPatient);
    onClose();
  };

  const calculateAge = (date) => {
    if (!date) return 0;
    return new Date().getFullYear() - new Date(date).getFullYear();
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Registrar Cita y Paciente">
      <div className="space-y-4 font-sans"> {/* Forzamos consistencia de fuente */}
        <div className="grid grid-cols-2 gap-3">
          <Input label="Nombre Completo" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <Input label="Cédula/ID" value={formData.docId} onChange={(e) => setFormData({...formData, docId: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input type="date" label="F. Nacimiento" value={formData.birthDate} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} />
          <div>
            <label className="text-xs font-bold mb-1 block uppercase">Género</label>
            <select className="w-full h-10 border rounded-md px-2" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
              <option>Femenino</option>
              <option>Masculino</option>
              <option>Otro</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input type="date" label="Fecha Cita" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
          <Input type="time" label="Hora" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
        </div>
        <div>
          <label className="text-xs font-bold mb-1 block uppercase">Motivo de Consulta</label>
          <select className="w-full h-10 border rounded-md px-2" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})}>
            <option>Primera vez</option>
            <option>Seguimiento</option>
            <option>Pre-operatorio</option>
            <option>Post-operatorio</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Confirmar Cita</Button>
        </div>
      </div>
    </Modal>
  );
}