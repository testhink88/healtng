import React from 'react';
import Icon from '@/components/AppIcon';
import Image from '@/components/AppImage';

const DoctorSummary = ({ doctor, onBackClick }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <button
          onClick={onBackClick}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-150 mb-4 lg:mb-0"
        >
          <Icon name="ArrowLeft" size={20} />
          <span className="text-sm font-medium">Volver a búsqueda</span>
        </button>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          <div className="relative">
            <Image
              src={doctor?.photo}
              alt={`Dr. ${doctor?.name}`}
              className="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover"
            />
            {doctor?.isOnline && (
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-success rounded-full border-2 border-card"></div>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-foreground mb-1">
              Dr. {doctor?.name}
            </h1>
            <p className="text-muted-foreground mb-2">{doctor?.specialty}</p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={16} className="text-warning fill-current" />
                <span className="font-medium">{doctor?.rating}</span>
                <span className="text-muted-foreground">({doctor?.reviewCount} reseñas)</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Icon name="MapPin" size={16} />
                <span>{doctor?.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:items-end space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">${doctor?.consultationFee}</span>
            <span className="text-muted-foreground">USD</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            {doctor?.acceptsInsurance && (
              <div className="flex items-center space-x-1 text-success">
                <Icon name="Shield" size={14} />
                <span>Acepta seguros</span>
              </div>
            )}
            {doctor?.isOnline && (
              <div className="flex items-center space-x-1 text-success">
                <Icon name="Video" size={14} />
                <span>Teleconsulta</span>
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Próxima disponibilidad: {doctor?.nextAvailable}
          </div>
        </div>
      </div>
      {doctor?.languages && doctor?.languages?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Languages" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Idiomas:</span>
            <div className="flex space-x-2">
              {doctor?.languages?.map((lang, index) => (
                <span key={index} className="text-sm bg-muted px-2 py-1 rounded-md">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSummary;