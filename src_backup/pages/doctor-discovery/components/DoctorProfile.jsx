import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Image from '@/components/AppImage';
import Button from '@/components/ui/Button';

const DoctorProfile = ({ isOpen, onClose, doctor, onBookAppointment }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !doctor) return null;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={16} color="var(--color-warning)" className="fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="StarHalf" size={16} color="var(--color-warning)" className="fill-current" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={16} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  const tabs = [
    { key: 'overview', label: 'Información general', icon: 'User' },
    { key: 'schedule', label: 'Horarios', icon: 'Calendar' },
    { key: 'location', label: 'Ubicación', icon: 'MapPin' },
    { key: 'reviews', label: 'Reseñas', icon: 'Star' }
  ];

  const mockSchedule = [
    { day: 'Lunes', hours: '8:00 AM - 5:00 PM', available: true },
    { day: 'Martes', hours: '8:00 AM - 5:00 PM', available: true },
    { day: 'Miércoles', hours: '8:00 AM - 12:00 PM', available: true },
    { day: 'Jueves', hours: '8:00 AM - 5:00 PM', available: true },
    { day: 'Viernes', hours: '8:00 AM - 4:00 PM', available: true },
    { day: 'Sábado', hours: '9:00 AM - 1:00 PM', available: true },
    { day: 'Domingo', hours: 'Cerrado', available: false }
  ];

  const mockReviews = [
    {
      id: 1,
      patientName: 'María González',
      rating: 5,
      date: '15 Ago 2025',
      comment: 'Excelente atención, muy profesional y puntual. Las instalaciones están muy limpias.',
      verified: true
    },
    {
      id: 2,
      patientName: 'Carlos Rodríguez',
      rating: 4,
      date: '10 Ago 2025',
      comment: 'Buen médico, explicó todo muy claramente. Solo el tiempo de espera fue un poco largo.',
      verified: true
    },
    {
      id: 3,
      patientName: 'Ana Martínez',
      rating: 5,
      date: '5 Ago 2025',
      comment: 'Muy recomendado. Diagnóstico acertado y tratamiento efectivo.',
      verified: false
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
                  <Image
                    src={doctor?.photo}
                    alt={`Dr. ${doctor?.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {doctor?.licenseVerified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                    <Icon name="CheckCircle" size={14} color="white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  Dr. {doctor?.name}
                </h2>
                <p className="text-lg text-primary font-medium mb-2">{doctor?.specialty}</p>
                <p className="text-sm text-muted-foreground mb-3">{doctor?.location}</p>
                
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    {renderStars(doctor?.rating)}
                    <span className="text-sm text-muted-foreground ml-1">
                      {doctor?.rating} ({doctor?.reviewCount} reseñas)
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {doctor?.experience} años de experiencia
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-foreground">
                    ${doctor?.consultationFee}
                  </span>
                  <span className="text-sm text-muted-foreground">USD por consulta</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="default"
                onClick={() => onBookAppointment(doctor)}
                iconName="Calendar"
                iconPosition="left"
              >
                Agendar cita
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-0 overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.key}
                onClick={() => setActiveTab(tab?.key)}
                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab?.key
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* About */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Acerca del médico</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {doctor?.about || `Dr. ${doctor?.name} es un especialista en ${doctor?.specialty} con ${doctor?.experience} años de experiencia. Graduado de ${doctor?.education}, se especializa en brindar atención médica de alta calidad con un enfoque personalizado para cada paciente.`}
                </p>
              </div>

              {/* Education & Certifications */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Educación y certificaciones</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Icon name="GraduationCap" size={20} className="text-primary mt-1" />
                    <div>
                      <p className="font-medium text-foreground">{doctor?.education}</p>
                      <p className="text-sm text-muted-foreground">Medicina General</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Icon name="Award" size={20} className="text-primary mt-1" />
                    <div>
                      <p className="font-medium text-foreground">Especialización en {doctor?.specialty}</p>
                      <p className="text-sm text-muted-foreground">Hospital Universitario de Caracas</p>
                    </div>
                  </div>
                  {doctor?.licenseVerified && (
                    <div className="flex items-start space-x-3">
                      <Icon name="Shield" size={20} className="text-success mt-1" />
                      <div>
                        <p className="font-medium text-foreground">Licencia médica verificada</p>
                        <p className="text-sm text-muted-foreground">Colegio de Médicos de Venezuela</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Servicios ofrecidos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {doctor?.services?.map((service, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                      <Icon name="CheckCircle" size={16} className="text-success" />
                      <span className="text-sm text-foreground">{service}</span>
                    </div>
                  )) || [
                    'Consulta general',
                    'Diagnóstico especializado',
                    'Seguimiento de tratamiento',
                    'Teleconsulta'
                  ]?.map((service, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                      <Icon name="CheckCircle" size={16} className="text-success" />
                      <span className="text-sm text-foreground">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Idiomas</h3>
                <div className="flex flex-wrap gap-2">
                  {(doctor?.languages || ['Español', 'Inglés'])?.map((language, index) => (
                    <span key={index} className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm">
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Horarios de atención</h3>
              <div className="space-y-3">
                {mockSchedule?.map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium text-foreground">{schedule?.day}</span>
                    <span className={`text-sm ${schedule?.available ? 'text-success' : 'text-muted-foreground'}`}>
                      {schedule?.hours}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-primary">
                  <Icon name="Info" size={16} className="inline mr-2" />
                  Los horarios pueden variar según disponibilidad. Se recomienda confirmar al agendar la cita.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Ubicación del consultorio</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Icon name="MapPin" size={20} className="text-primary mt-1" />
                  <div>
                    <p className="font-medium text-foreground">{doctor?.clinicName || 'Centro Médico Profesional'}</p>
                    <p className="text-muted-foreground">{doctor?.address || 'Av. Francisco de Miranda, Caracas 1060, Venezuela'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Icon name="Phone" size={20} className="text-primary" />
                  <span className="text-foreground">{doctor?.phone || '+58 212-555-0123'}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <Icon name="Car" size={20} className="text-primary" />
                  <span className="text-muted-foreground">Estacionamiento disponible</span>
                </div>

                <div className="w-full h-64 bg-muted rounded-lg overflow-hidden">
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
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(doctor?.rating)}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {doctor?.rating} ({doctor?.reviewCount} reseñas)
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {mockReviews?.map((review) => (
                  <div key={review?.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {review?.patientName?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{review?.patientName}</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              {renderStars(review?.rating)}
                            </div>
                            <span className="text-sm text-muted-foreground">{review?.date}</span>
                          </div>
                        </div>
                      </div>
                      {review?.verified && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-success bg-success/10">
                          <Icon name="CheckCircle" size={10} className="mr-1" />
                          Verificado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{review?.comment}</p>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full">
                Ver todas las reseñas
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;