import React from 'react';
import Button from '@/components/ui/Button';
import Icon from '@/components/AppIcon';
import { getStatusColor, formatCurrency } from '@/utils/spaces';

const SpaceCard = ({ space, onBook, onEdit, onTogglePublish }) => {
  // Imagen por defecto si no hay una cargada
  const defaultImage = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600";

  return (
    <div className="group bg-white border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      
      {/* SECCIÓN DE IMAGEN */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <img 
          src={space?.image || defaultImage} 
          alt={space?.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badge de Estado Flotante */}
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold shadow-sm border ${getStatusColor(space?.status)}`}>
          {space?.status}
        </div>

        {/* Badge de Precio Flotante */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-border flex items-center gap-1">
          <span className="font-bold text-foreground text-lg">{formatCurrency(space?.hourlyRate)}</span>
          <span className="text-xs text-muted-foreground">/h</span>
        </div>
      </div>

      {/* CUERPO DE LA TARJETA */}
      <div className="p-5 flex flex-col flex-1">
        
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
              {space?.name}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Icon name="MapPin" size={12} />
              {space?.location}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-100 ml-2">
            <Icon name="Star" size={12} className="text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold text-yellow-700">{space?.rating || '4.5'}</span>
          </div>
        </div>

        {/* CARACTERÍSTICAS RÁPIDAS */}
        <div className="flex items-center gap-3 py-3 border-y border-border/50 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Icon name="Users" size={14} className="text-primary/60" />
            <span className="font-medium text-foreground">{space?.capacity} pers.</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground border-l pl-3">
            <Icon name="Layout" size={14} className="text-primary/60" />
            <span className="font-medium text-foreground">{space?.type}</span>
          </div>
        </div>

        {/* AMENIDADES (Máximo 2 visibles) */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {space?.amenities?.slice(0, 2).map((amenity, i) => (
            <span key={i} className="text-[10px] font-medium px-2 py-0.5 bg-secondary text-secondary-foreground rounded">
              {amenity}
            </span>
          ))}
          {space?.amenities?.length > 2 && (
            <span className="text-[10px] text-muted-foreground px-1 self-center">
              +{space?.amenities?.length - 2}
            </span>
          )}
        </div>

        {/* ACCIONES */}
        <div className="mt-auto space-y-2">
          <Button 
            className="w-full shadow-sm"
            disabled={space?.status !== 'Disponible'}
            onClick={onBook}
          >
            <Icon name="Calendar" size={16} className="mr-2" />
            Gestionar Reserva
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={onEdit} className="w-full text-xs">
              <Icon name="Settings" size={14} className="mr-1.5" />
              Editar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onTogglePublish} 
              className={`w-full text-xs ${!space?.isPublished ? 'text-green-600 hover:text-green-700' : 'text-orange-600 hover:text-orange-700'}`}
            >
              <Icon name={space?.isPublished ? 'EyeOff' : 'Eye'} size={14} className="mr-1.5" />
              {space?.isPublished ? 'Ocultar' : 'Publicar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceCard;