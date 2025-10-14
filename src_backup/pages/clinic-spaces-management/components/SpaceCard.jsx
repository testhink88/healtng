import React from 'react';
import Button from '@/components/ui/Button';
import Icon from '@/components/AppIcon';

const SpaceCard = ({ space, onReserve, onEdit, onPublish }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Disponible':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Reservado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Ocupado':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Mantenimiento':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{space?.name}</h3>
          <p className="text-sm text-gray-500">{space?.id}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(space?.status)}`}>
          {space?.status}
        </span>
      </div>
      {/* Space Type and Capacity */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Tipo</p>
          <p className="text-sm font-medium text-gray-900">{space?.type}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Capacidad</p>
          <p className="text-sm font-medium text-gray-900">{space?.capacity} personas</p>
        </div>
      </div>
      {/* Pricing */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-1">Tarifa por hora</p>
        <p className="text-xl font-bold text-gray-900">${space?.hourlyRate}</p>
      </div>
      {/* Location */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-1">Ubicación</p>
        <p className="text-sm text-gray-700">{space?.location}</p>
      </div>
      {/* Amenities */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 mb-2">Amenidades</p>
        <div className="flex flex-wrap gap-2">
          {space?.amenities?.slice(0, 3)?.map((amenity, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200"
            >
              {amenity}
            </span>
          ))}
          {space?.amenities?.length > 3 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md border border-gray-200">
              +{space?.amenities?.length - 3} más
            </span>
          )}
        </div>
      </div>
      {/* Additional Details */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>Área:</span>
          <span className="font-medium">{space?.squareFootage}m²</span>
        </div>
        <div className="flex justify-between">
          <span>Equipos:</span>
          <span className="font-medium">{space?.equipment?.length || 0}</span>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col space-y-2">
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={onEdit}
          >
            <Icon name="Edit" size={14} className="mr-1" />
            Editar
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={onPublish}
          >
            <Icon name={space?.status === 'Disponible' ? 'EyeOff' : 'Eye'} size={14} className="mr-1" />
            {space?.status === 'Disponible' ? 'Despublicar' : 'Publicar'}
          </Button>
        </div>
        
        <Button 
          size="sm" 
          className="w-full"
          disabled={space?.status !== 'Disponible'}
          onClick={onReserve}
        >
          <Icon name="Calendar" size={14} className="mr-2" />
          Reservar
        </Button>
      </div>
    </div>
  );
};

export default SpaceCard;