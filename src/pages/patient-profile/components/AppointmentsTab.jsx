import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import RescheduleModal from '@/components/modals/RescheduleModal';

const AppointmentsTab = ({ patient, allAppointments = [], onUpdate, onOpenConsultation }) => {
  const [rescheduleData, setRescheduleData] = useState({ isOpen: false, appointment: null });
  // Citas basadas en seguimientos (Diagnósticos anteriores)
  const followUpAppointments = patient?.diagnoses
    ?.filter(d => d.data?.followUpDate)
    ?.map(d => ({
      id: `fu-${d.id}`,
      date: d.data.followUpDate,
      diagnosisId: d.id,
      specialty: d.specialtyName,
      doctor: d.doctorName,
      type: 'followup',
      status: 'confirmed'
    })) || [];

  // Citas reales desde la tabla 'appointments'
  const realAppointments = allAppointments.map(a => ({
    id: a.id,
    date: a.date,
    time: a.time,
    reason: a.reason,
    doctor: a.professional_name || 'Médico',
    status: a.status,
    type: 'general'
  }));

  // Combinar y ordenar todas
  const appointments = [...followUpAppointments, ...realAppointments].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  if (appointments.length === 0) {
    return (
      <div className="py-20 text-center border border-dashed border-gray-200 rounded-2xl">
        <Icon name="Calendar" size={32} className="mx-auto text-gray-200 mb-2" />
        <p className="text-gray-400 text-sm font-normal uppercase tracking-widest">Sin citas de control programadas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-[11px] font-normal text-gray-400 uppercase tracking-widest mb-6">Próximos Seguimientos</h3>
      {appointments.map((app, idx) => (
        <div key={app.id || idx} className="group flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:border-[#0E39B1] transition-all">
          <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center border ${
              app.type === 'followup' 
                ? "bg-purple-50 text-purple-700 border-purple-100" 
                : "bg-blue-50 text-[#0E39B1] border-blue-100"
            }`}>
              <span className="text-[10px] font-normal uppercase">
                {new Date(app.date).toLocaleDateString('es-ES', {month: 'short'})}
              </span>
              <span className="text-xl font-normal leading-none">
                {new Date(app.date).getDate() + 1}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-normal text-gray-900 text-lg leading-tight">
                  {app.type === 'followup' ? `Control: ${app.specialty}` : app.reason}
                </p>
                <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded border ${
                    app.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {app.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 font-normal mt-1">
                {app.time && <span className="mr-2 font-medium text-gray-700">{app.time.slice(0, 5)}</span>}
                Dr. {app.doctor}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {app.type === 'general' && (
              <button 
                onClick={() => setRescheduleData({ isOpen: true, appointment: app })}
                className="flex items-center gap-2 px-4 py-2 text-[10px] font-normal text-gray-500 border border-gray-100 rounded-lg hover:bg-gray-50 transition-all"
              >
                <Icon name="Calendar" size={14} />
                MODIFICAR
              </button>
            )}
            {app.type === 'followup' && (
              <button 
                onClick={() => onOpenConsultation(app.diagnosisId)}
                className="flex items-center gap-2 px-4 py-2 text-[10px] font-normal text-[#0E39B1] border border-blue-100 rounded-lg hover:bg-[#0E39B1] hover:text-white transition-all"
              >
                VER ORIGEN
              </button>
            )}
          </div>
        </div>
      ))}

      <RescheduleModal 
        isOpen={rescheduleData.isOpen}
        appointment={rescheduleData.appointment}
        onClose={() => setRescheduleData({ isOpen: false, appointment: null })}
        onSave={() => onUpdate && onUpdate()}
      />
    </div>
  );
};

export default AppointmentsTab;