import React from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

const AppointmentsList = ({ appointments = [], dateLabel }) => {
  
  // 1. LÓGICA DE COLORES FLAT (Incluye estado de preparación)
  const getStatusStyles = (a) => {
    // Si la secretaria ya terminó el intake, este estado domina
    if (a.intakeStatus?.isReady) {
      return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    }

    switch (a.status) {
      case 'confirmed':
        return 'bg-blue-50 text-[#0E39B1] border-blue-100';
      case 'pending':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'inprogress':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'completed':
        return 'bg-gray-50 text-gray-400 border-gray-100';
      default:
        return 'bg-gray-50 text-gray-400 border-gray-100';
    }
  };

  const getTypeIcon = (type) => (type === 'teleconsultation' ? 'Video' : 'User');

  const goToPatientProfile = (appointment) => {
    const patientId = appointment?.patientId ?? appointment?.id;
    window.location.href = `/patients/${patientId}`;
  };

  const todayLabel = dateLabel || new Date().toLocaleDateString('es-VE', {
      year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-none font-sans">
      {/* Header Flat */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Calendar" size={16} className="text-[#0E39B1]" />
            <h2 className="text-lg font-normal text-gray-900">Citas de Hoy</h2>
          </div>
          <Button
            variant="outline"
            className="border-gray-200 font-normal text-xs"
            onClick={() => (window.location.href = '/appointment-booking')}
          >
            <Icon name="Plus" size={14} className="mr-2" />
            Nueva Cita
          </Button>
        </div>
        <p className="mt-1 text-[10px] text-gray-400 font-normal uppercase tracking-widest">{todayLabel}</p>
      </div>

      {/* Listado de Citas Inteligente */}
      <div className="px-4 sm:px-6 py-5 space-y-3">
        {appointments?.map((a) => (
          <div
            key={a?.id}
            className="rounded-xl border border-gray-100 bg-white px-4 sm:px-5 py-4 flex items-center justify-between transition-all hover:border-[#0E39B1] hover:bg-blue-50/10 group"
          >
            {/* Bloque Hora */}
            <div className="w-20 sm:w-24 shrink-0">
              <div className="text-sm font-normal text-gray-900 leading-5">{a?.time}</div>
              <div className="text-[10px] text-gray-400 font-normal uppercase">{a?.duration} min</div>
            </div>

            {/* Centro: Nombre + Clip de Paraclínicos */}
            <div className="flex-1 min-w-0 px-2 sm:px-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPatientProfile(a)}
                  className="text-left text-sm font-normal text-gray-900 hover:text-[#0E39B1] transition-colors truncate"
                >
                  {a?.patientName}
                </button>
                
                {/* INDICADOR DE CLIP (📎) - Punto 4 del feedback médico */}
                {a.intakeStatus?.hasFiles && (
                  <div className="group/clip relative">
                    <Icon name="Paperclip" size={14} className="text-[#0E39B1] animate-in fade-in zoom-in" />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover/clip:block bg-gray-900 text-white text-[9px] px-2 py-1 rounded whitespace-nowrap">
                      Paraclínicos listos
                    </span>
                  </div>
                )}
              </div>
              
              <div className="text-[11px] text-gray-400 font-normal truncate">{a?.reason}</div>

              <div className="mt-1 flex items-center gap-2 text-[10px] font-normal uppercase tracking-tighter text-gray-300">
                <Icon name={getTypeIcon(a?.type)} size={12} />
                <span>{a?.type === 'in-person' ? 'Presencial' : 'Teleconsulta'}</span>
              </div>
            </div>

            {/* Derecha: Estado Dinámico */}
            <div className="shrink-0 flex flex-col items-end gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-normal uppercase tracking-widest border transition-all ${getStatusStyles(a)}`}>
                {a.intakeStatus?.isReady ? "Listo para Consulta" : 
                 a?.status === 'confirmed' ? 'Confirmada' :
                 a?.status === 'pending' ? 'Pendiente' :
                 (a?.status === 'in-progress' || a?.status === 'inprogress') ? 'En Progreso' :
                 a?.status === 'completed' ? 'Completada' : 'Cancelada'}
              </span>
              
              <button 
                onClick={() => goToPatientProfile(a)}
                className="opacity-0 group-hover:opacity-100 text-[9px] text-[#0E39B1] font-normal uppercase tracking-widest hover:underline transition-opacity"
              >
                Abrir Expediente
              </button>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {appointments?.length === 0 && (
          <div className="py-12 text-center">
            <Icon name="Calendar" size={40} className="mx-auto mb-4 text-gray-100" />
            <h3 className="text-sm font-normal text-gray-400 uppercase tracking-widest">No hay citas programadas</h3>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      {appointments?.length > 0 && (
        <div className="border-t border-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={() => (window.location.href = '/appointment-booking')}
            className="flex items-center gap-2 text-[10px] text-gray-400 font-normal uppercase tracking-widest hover:text-[#0E39B1] transition-all"
          >
            <Icon name="Calendar" size={14} />
            Ver Agenda Completa
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;