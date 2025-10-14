import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Image from '@/components/AppImage';
import Button from '@/components/ui/Button';

const DoctorCard = ({ doctor, onBookAppointment, onViewProfile }) => {
  const [imageError, setImageError] = useState(false);

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

  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'available_today':
        return 'text-success bg-success/10';
      case 'available_soon':
        return 'text-warning bg-warning/10';
      case 'busy':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getAvailabilityText = (status) => {
    switch (status) {
      case 'available_today':
        return 'Disponible hoy';
      case 'available_soon':
        return 'Disponible pronto';
      case 'busy':
        return 'Ocupado';
      default:
        return 'No disponible';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      {/* Doctor Header */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
            <Image
              src={doctor?.photo}
              alt={`Dr. ${doctor?.name}`}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>
          {doctor?.licenseVerified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={14} color="white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground truncate">
            Dr. {doctor?.name}
          </h3>
          <p className="text-sm text-primary font-medium">{doctor?.specialty}</p>
          <p className="text-sm text-muted-foreground">{doctor?.location}</p>
          
          {/* Rating */}
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex items-center space-x-1">
              {renderStars(doctor?.rating)}
            </div>
            <span className="text-sm text-muted-foreground">
              {doctor?.rating} ({doctor?.reviewCount} reseñas)
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="text-right">
          <p className="text-lg font-bold text-foreground">${doctor?.consultationFee}</p>
          <p className="text-xs text-muted-foreground">USD por consulta</p>
        </div>
      </div>
      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(doctor?.availability)}`}>
          <Icon name="Clock" size={12} className="mr-1" />
          {getAvailabilityText(doctor?.availability)}
        </span>

        {doctor?.teleconsultation && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-primary bg-primary/10">
            <Icon name="Video" size={12} className="mr-1" />
            Teleconsulta
          </span>
        )}

        {doctor?.licenseVerified && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-success bg-success/10">
            <Icon name="Shield" size={12} className="mr-1" />
            Licencia verificada
          </span>
        )}

        {doctor?.acceptsInsurance && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-secondary bg-secondary/10">
            <Icon name="CreditCard" size={12} className="mr-1" />
            Acepta seguros
          </span>
        )}
      </div>
      {/* Next Available Appointment */}
      {doctor?.nextAvailable && (
        <div className="bg-muted/50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Próxima cita disponible</p>
              <p className="text-sm text-muted-foreground">
                {doctor?.nextAvailable?.date} a las {doctor?.nextAvailable?.time}
              </p>
            </div>
            <Icon name="Calendar" size={20} className="text-primary" />
          </div>
        </div>
      )}
      {/* Languages */}
      {doctor?.languages && doctor?.languages?.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-1">Idiomas:</p>
          <div className="flex flex-wrap gap-1">
            {doctor?.languages?.map((language, index) => (
              <span key={index} className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                {language}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Experience */}
      <div className="mb-4">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="GraduationCap" size={14} />
            <span>{doctor?.experience} años de experiencia</span>
          </div>
          {doctor?.education && (
            <div className="flex items-center space-x-1">
              <Icon name="Building2" size={14} />
              <span className="truncate">{doctor?.education}</span>
            </div>
          )}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          variant="default"
          onClick={() => onBookAppointment(doctor)}
          className="flex-1"
          iconName="Calendar"
          iconPosition="left"
          disabled={doctor?.availability === 'busy'}
        >
          {doctor?.availability === 'busy' ? 'No disponible' : 'Agendar cita'}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => onViewProfile(doctor)}
          iconName="User"
          iconPosition="left"
        >
          Ver perfil
        </Button>
      </div>
      {/* Quick Actions */}
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
        <div className="flex space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = `tel:${doctor?.phone}`}
            iconName="Phone"
            iconPosition="left"
          >
            Llamar
          </Button>
          
          {doctor?.teleconsultation && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBookAppointment(doctor, 'teleconsultation')}
              iconName="Video"
              iconPosition="left"
            >
              Videollamada
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            // Add to favorites functionality
            console.log('Added to favorites:', doctor?.id);
          }}
          title="Agregar a favoritos"
        >
          <Icon name="Heart" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default DoctorCard;