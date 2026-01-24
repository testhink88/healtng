// src/pages/appointment-booking/components/AppointmentCalendar.jsx
import React, { useState, useMemo } from 'react';
import NewAppointmentModal from './NewAppointmentModal';  // Modal para crear paciente

const AppointmentCalendar = ({ appointments, onUpdateAppointments }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleCancelAppointment = (appointmentId) => {
    const appointment = appointments.find(appt => appt.id === appointmentId);
    if (appointment && appointment.status === 'cancelled') {
      setSelectedAppointment(appointmentId);
      setIsModalOpen(true);
    }
  };

  const handleSaveAppointment = (patientData) => {
    const updatedAppointments = appointments.map((appt) => {
      if (appt.id === selectedAppointment) {
        appt.patient = patientData.name;
        appt.status = 'assigned';
      }
      return appt;
    });
    onUpdateAppointments(updatedAppointments);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="calendar">
        {appointments.map((appt) => (
          <button
            key={appt.id}
            onClick={() => handleCancelAppointment(appt.id)}
            className="appointment-cell"
          >
            {appt.date} {appt.status === 'cancelled' ? 'Cancelado' : 'Disponible'}
          </button>
        ))}
      </div>
      <NewAppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveAppointment} 
        patients={[]} // Si es necesario, puedes pasar la lista de pacientes registrados
      />
    </div>
  );
};

export default AppointmentCalendar;
