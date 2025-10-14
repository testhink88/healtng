import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Image from '@/components/AppImage';
import Button from '@/components/ui/Button';

const SpaceCard = ({ space, onBookSpace, onViewDetails, className = '' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'text-success bg-success/10';
      case 'BUSY': return 'text-warning bg-warning/10';
      case 'MAINTENANCE': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'Disponible';
      case 'BUSY': return 'Ocupado';
      case 'MAINTENANCE': return 'Mantenimiento';
      default: return 'No disponible';
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === space?.images?.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? space?.images?.length - 1 : prev - 1
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={14}
        color={i < Math.floor(rating) ? '#F59E0B' : '#E5E7EB'}
        className={i < Math.floor(rating) ? 'fill-current' : ''}
      />
    ));
  };

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 ${className}`}>
      {/* Image Gallery */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={space?.images?.[currentImageIndex]}
          alt={`${space?.name} - Imagen ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Image Navigation */}
        {space?.images?.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 w-8 h-8"
            >
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 w-8 h-8"
            >
              <Icon name="ChevronRight" size={16} />
            </Button>
            
            {/* Image Indicators */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {space?.images?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(space?.status)}`}>
            <div className={`w-2 h-2 rounded-full mr-1 ${
              space?.status === 'AVAILABLE' ? 'bg-success' :
              space?.status === 'BUSY' ? 'bg-warning' : 'bg-error'
            }`} />
            {getStatusText(space?.status)}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm font-semibold">
            ${space?.pricePerHour}/hora
          </span>
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-foreground line-clamp-1">
              {space?.name}
            </h3>
            <div className="flex items-center space-x-1 ml-2">
              {renderStars(space?.rating)}
              <span className="text-sm text-muted-foreground ml-1">
                ({space?.reviewCount})
              </span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Icon name="Building" size={14} className="mr-1" />
            <span className="truncate">{space?.clinic?.name}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Icon name="MapPin" size={14} className="mr-1" />
            <span className="truncate">{space?.clinic?.address}</span>
          </div>
        </div>

        {/* Space Details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm">
            <Icon name="Users" size={14} className="mr-2 text-muted-foreground" />
            <span className="text-foreground">{space?.capacity} personas</span>
          </div>
          <div className="flex items-center text-sm">
            <Icon name="Square" size={14} className="mr-2 text-muted-foreground" />
            <span className="text-foreground">{space?.area} m²</span>
          </div>
          <div className="flex items-center text-sm">
            <Icon name="Tag" size={14} className="mr-2 text-muted-foreground" />
            <span className="text-foreground">{space?.type}</span>
          </div>
          <div className="flex items-center text-sm">
            <Icon name="Clock" size={14} className="mr-2 text-muted-foreground" />
            <span className="text-foreground">Min. {space?.minDuration}h</span>
          </div>
        </div>

        {/* Equipment */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Equipamiento Disponible</h4>
          <div className="flex flex-wrap gap-1">
            {space?.equipment?.slice(0, 4)?.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
              >
                <Icon name="Check" size={10} className="mr-1" />
                {item}
              </span>
            ))}
            {space?.equipment?.length > 4 && (
              <span className="inline-flex items-center bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                +{space?.equipment?.length - 4} más
              </span>
            )}
          </div>
        </div>

        {/* Policies */}
        <div className="mb-4">
          <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Icon name="Clock" size={12} className="mr-2" />
              <span>Cancelación: {space?.policies?.cancellation}</span>
            </div>
            <div className="flex items-center">
              <Icon name="Shield" size={12} className="mr-2" />
              <span>Aprobación: {space?.policies?.approval}</span>
            </div>
          </div>
        </div>

        {/* Next Available Slot */}
        {space?.nextAvailable && (
          <div className="mb-4 p-3 bg-success/10 rounded-lg">
            <div className="flex items-center text-sm">
              <Icon name="Calendar" size={14} className="mr-2 text-success" />
              <span className="text-success font-medium">
                Próximo disponible: {space?.nextAvailable?.date} a las {space?.nextAvailable?.time}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(space)}
            className="flex-1"
            iconName="Eye"
            iconPosition="left"
            iconSize={14}
          >
            Ver Detalles
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onBookSpace(space)}
            disabled={space?.status !== 'AVAILABLE'}
            className="flex-1"
            iconName="Calendar"
            iconPosition="left"
            iconSize={14}
          >
            {space?.status === 'AVAILABLE' ? 'Reservar' : 'No Disponible'}
          </Button>
        </div>

        {/* Special Features */}
        {(space?.features?.length > 0) && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex flex-wrap gap-1">
              {space?.features?.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full"
                >
                  <Icon 
                    name={
                      feature === 'WiFi' ? 'Wifi' :
                      feature === 'Aire Acondicionado' ? 'Wind' :
                      feature === 'Estacionamiento' ? 'Car' :
                      feature === 'Acceso 24/7'? 'Clock' : 'Star'
                    } 
                    size={10} 
                    className="mr-1" 
                  />
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpaceCard;