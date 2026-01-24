import React from 'react';
import Icon from '@/components/AppIcon';

const AppointmentsTab = ({ patient, onOpenConsultation }) => {
  const appointments = patient?.diagnoses
    ?.filter(d => d.data?.followUpDate)
    ?.map(d => ({
      date: d.data.followUpDate,
      diagnosisId: d.id,
      specialty: d.specialtyName,
      doctor: d.doctorName
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date)) || [];

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
        <div key={idx} className="group flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:border-[#0E39B1] transition-all">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 text-[#0E39B1] rounded-xl flex flex-col items-center justify-center border border-blue-100">
              <span className="text-[10px] font-normal uppercase">{new Date(app.date).toLocaleDateString('es-ES', {month: 'short'})}</span>
              <span className="text-xl font-normal leading-none">{new Date(app.date).getDate()}</span>
            </div>
            <div>
              <p className="font-normal text-gray-900 text-lg leading-tight">Control: {app.specialty}</p>
              <p className="text-sm text-gray-500 font-normal mt-1">Dr. {app.doctor}</p>
            </div>
          </div>
          <button 
            onClick={() => onOpenConsultation(app.diagnosisId)}
            className="flex items-center gap-2 px-4 py-2 text-[10px] font-normal text-[#0E39B1] border border-blue-100 rounded-lg hover:bg-[#0E39B1] hover:text-white transition-all"
          >
            VER ORIGEN
          </button>
        </div>
      ))}
    </div>
  );
};

export default AppointmentsTab;