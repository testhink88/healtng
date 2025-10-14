import React from 'react';
import Button from '@/components/ui/Button';
import Icon from '@/components/AppIcon';


const DoctorCard = ({ doctor, onSelect }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={14} className="text-warning fill-warning" />
      );
    }
    
    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="Star" size={14} className="text-warning fill-warning opacity-50" />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={14} className="text-muted-foreground" />
      );
    }
    
    return stars;
  };

  const getOnlineStatus = () => {
    if (doctor?.isOnline) {
      return (
        <div className="flex items-center gap-1 text-xs">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-success font-medium">En línea</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-xs">
        <div className="w-2 h-2 bg-muted-foreground rounded-full" />
        <span className="text-muted-foreground">Desconectado</span>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start gap-4 mb-4">
        {/* Doctor Photo */}
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              src={doctor?.photo || '/assets/images/no_image.png'}
              alt={doctor?.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-border group-hover:border-primary transition-colors"
              onError={(e) => {
                e.target.src = '/assets/images/no_image.png';
              }}
            />
            {doctor?.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-card flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </div>
        </div>

        {/* Doctor Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {doctor?.name}
              </h3>
              <p className="text-muted-foreground text-sm">{doctor?.specialty}</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-foreground">
                ${doctor?.consultationFee?.usd}
              </div>
              <div className="text-xs text-muted-foreground">
                ${doctor?.consultationFee?.ves} VES
              </div>
            </div>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1">
              {renderStars(doctor?.rating)}
            </div>
            <span className="text-sm font-medium text-foreground">{doctor?.rating}</span>
            <span className="text-sm text-muted-foreground">({doctor?.reviewCount} reseñas)</span>
          </div>

          {/* Location and Online Status */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Icon name="MapPin" size={14} />
              <span>{doctor?.location}</span>
            </div>
            {getOnlineStatus()}
          </div>
        </div>
      </div>
      {/* Details */}
      <div className="space-y-3 mb-4">
        {/* Experience and Education */}
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Icon name="Award" size={14} className="text-primary" />
            <span className="text-muted-foreground">{doctor?.experience}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="GraduationCap" size={14} className="text-primary" />
            <span className="text-muted-foreground">{doctor?.education}</span>
          </div>
        </div>

        {/* Languages */}
        <div className="flex items-center gap-2">
          <Icon name="Globe" size={14} className="text-primary" />
          <div className="flex flex-wrap gap-1">
            {doctor?.languages?.map((language, index) => (
              <span
                key={index}
                className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium"
              >
                {language}
              </span>
            ))}
          </div>
        </div>

        {/* Insurance and Availability */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Icon 
              name={doctor?.acceptsInsurance ? "Shield" : "ShieldOff"} 
              size={14} 
              className={doctor?.acceptsInsurance ? "text-success" : "text-muted-foreground"} 
            />
            <span className={doctor?.acceptsInsurance ? "text-success" : "text-muted-foreground"}>
              {doctor?.acceptsInsurance ? "Acepta seguro" : "No acepta seguro"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <Icon name="Clock" size={14} />
            <span className="font-medium">{doctor?.nextAvailable}</span>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          iconName="Eye"
          onClick={() => {
            // Could implement a doctor profile modal
            console.log('View doctor profile:', doctor?.id);
          }}
        >
          Ver perfil
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          iconName="MessageCircle"
          onClick={() => {
            // Could implement messaging functionality
            console.log('Message doctor:', doctor?.id);
          }}
        >
          Mensaje
        </Button>
        <Button
          size="sm"
          className="flex-1"
          iconName="Calendar"
          onClick={() => onSelect(doctor)}
        >
          Agendar cita
        </Button>
      </div>
    </div>
  );
};

export default DoctorCard;