// src/pages/doctor-discovery/components/DoctorProfile.jsx
import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Image from '@/components/AppImage';
import Button from '@/components/ui/Button';
import RatingStars from '@/components/common/RatingStars';

const DoctorProfile = ({ isOpen, onClose, doctor, onBookAppointment }) => {
  const [activeTab, setActiveTab] = useState('overview');
  if (!isOpen || !doctor) return null;

  const tabs = [
    { key: 'overview',  label: 'Información general', icon: 'User'     },
    { key: 'schedule',  label: 'Horarios',            icon: 'Calendar' },
    { key: 'location',  label: 'Ubicación',           icon: 'MapPin'   },
    { key: 'reviews',   label: 'Reseñas',             icon: 'Star'     },
  ];

  const mockSchedule = [
    { day: 'Lunes',      hours: '8:00 AM - 5:00 PM',  available: true  },
    { day: 'Martes',     hours: '8:00 AM - 5:00 PM',  available: true  },
    { day: 'Miércoles',  hours: '8:00 AM - 12:00 PM', available: true  },
    { day: 'Jueves',     hours: '8:00 AM - 5:00 PM',  available: true  },
    { day: 'Viernes',    hours: '8:00 AM - 4:00 PM',  available: true  },
    { day: 'Sábado',     hours: '9:00 AM - 1:00 PM',  available: true  },
    { day: 'Domingo',    hours: 'Cerrado',            available: false },
  ];

  const mockReviews = [
    { id: 1, patientName: 'María González',  rating: 5, date: '15 Ago 2025', comment: 'Excelente atención, muy profesional y puntual. Las instalaciones están muy limpias.', verified: true },
    { id: 2, patientName: 'Carlos Rodríguez', rating: 4, date: '10 Ago 2025', comment: 'Buen médico, explicó todo claramente. El tiempo de espera fue un poco largo.', verified: true },
    { id: 3, patientName: 'Ana Martínez',     rating: 5, date: '5 Ago 2025',  comment: 'Muy recomendado. Diagnóstico acertado y tratamiento efectivo.', verified: false },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="absolute inset-0 flex items-stretch justify-stretch p-0 sm:p-4">
        <div className="bg-card w-full h-full sm:h-auto sm:max-h-[90vh] sm:rounded-lg sm:max-w-4xl sm:mx-auto sm:my-auto border border-border flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-border sticky top-0 bg-card z-10">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-muted">
                    <Image src={doctor?.photo} alt={`Dr. ${doctor?.name}`} className="w-full h-full object-cover" />
                  </div>
                  {doctor?.licenseVerified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-success rounded-full flex items-center justify-center">
                      <Icon name="CheckCircle" size={12} className="text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                    Dr. {doctor?.name}
                  </h2>
                  <p className="text-sm sm:text-base text-primary font-medium">{doctor?.specialty}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{doctor?.location}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="flex items-center gap-2">
                      <RatingStars rating={doctor?.rating} size={16} />
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {doctor?.rating} ({doctor?.reviewCount} reseñas)
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {doctor?.experience} años de experiencia
                    </span>
                  </div>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg sm:text-2xl font-bold text-foreground">
                      ${doctor?.consultationFee}
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground">USD por consulta</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="default"
                  onClick={() => onBookAppointment?.(doctor)}
                  iconName="Calendar"
                  iconPosition="left"
                  className="hidden sm:inline-flex"
                >
                  Agendar cita
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar">
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </div>

            {/* CTA móvil */}
            <div className="mt-3 sm:hidden">
              <Button
                variant="default"
                onClick={() => onBookAppointment?.(doctor)}
                iconName="Calendar"
                iconPosition="left"
                className="w-full"
              >
                Agendar cita
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border sticky top-[68px] sm:top-[92px] bg-card z-10">
            <div className="flex overflow-x-auto no-scrollbar -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* About */}
                <section>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Acerca del médico</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {doctor?.about || `Dr. ${doctor?.name} es un especialista en ${doctor?.specialty} con ${doctor?.experience} años de experiencia. Graduado de ${doctor?.education}, se especializa en brindar atención médica de alta calidad con un enfoque personalizado.`}
                  </p>
                </section>

                {/* Educación */}
                <section>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Educación y certificaciones</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Icon name="GraduationCap" size={20} className="text-primary mt-1" />
                      <div>
                        <p className="font-medium text-foreground">{doctor?.education}</p>
                        <p className="text-sm text-muted-foreground">Medicina General</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="Award" size={20} className="text-primary mt-1" />
                      <div>
                        <p className="font-medium text-foreground">Especialización en {doctor?.specialty}</p>
                        <p className="text-sm text-muted-foreground">Hospital Universitario de Caracas</p>
                      </div>
                    </div>
                    {doctor?.licenseVerified && (
                      <div className="flex items-start gap-3">
                        <Icon name="Shield" size={20} className="text-success mt-1" />
                        <div>
                          <p className="font-medium text-foreground">Licencia médica verificada</p>
                          <p className="text-sm text-muted-foreground">Colegio de Médicos de Venezuela</p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Servicios */}
                <section>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Servicios ofrecidos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(doctor?.services?.length ? doctor.services : [
                      'Consulta general',
                      'Diagnóstico especializado',
                      'Seguimiento de tratamiento',
                      'Teleconsulta',
                    ])?.map((service, i) => (
                      <div key={i} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <Icon name="CheckCircle" size={16} className="text-success" />
                        <span className="text-sm text-foreground">{service}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Horarios de atención</h3>
                <div className="space-y-3">
                  {mockSchedule.map((sch, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium text-foreground">{sch.day}</span>
                      <span className={`text-sm ${sch.available ? 'text-success' : 'text-muted-foreground'}`}>
                        {sch.hours}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 sm:p-4 bg-primary/10 rounded-lg text-sm text-primary">
                  <Icon name="Info" size={16} className="inline mr-2" />
                  Los horarios pueden variar según disponibilidad. Confirma al agendar la cita.
                </div>
              </div>
            )}

            {activeTab === 'location' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Ubicación del consultorio</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Icon name="MapPin" size={20} className="text-primary mt-1" />
                    <div>
                      <p className="font-medium text-foreground">{doctor?.clinicName || 'Centro Médico Profesional'}</p>
                      <p className="text-muted-foreground">{doctor?.address || 'Av. Francisco de Miranda, Caracas 1060, Venezuela'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Icon name="Phone" size={20} className="text-primary" />
                    <span className="text-foreground">{doctor?.phone || '+58 212-555-0123'}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Icon name="Car" size={20} className="text-primary" />
                    <span className="text-muted-foreground">Estacionamiento disponible</span>
                  </div>

                  <div className="w-full h-48 sm:h-64 bg-muted rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      loading="lazy"
                      title={doctor?.clinicName || 'Ubicación del consultorio'}
                      referrerPolicy="no-referrer-when-downgrade"
                      src="https://www.google.com/maps?q=10.4806,-66.9036&z=14&output=embed"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Reseñas de pacientes</h3>
                  <div className="flex items-center gap-2">
                    <RatingStars rating={doctor?.rating} size={14} />
                    <span className="text-sm text-muted-foreground">
                      {doctor?.rating} ({doctor?.reviewCount} reseñas)
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {mockReviews.map((r) => (
                    <div key={r.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">{r.patientName?.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{r.patientName}</p>
                            <div className="flex items-center gap-2">
                              <RatingStars rating={r.rating} size={12} />
                              <span className="text-sm text-muted-foreground">{r.date}</span>
                            </div>
                          </div>
                        </div>
                        {r.verified && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-success bg-success/10">
                            <Icon name="CheckCircle" size={10} className="mr-1" />
                            Verificado
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
