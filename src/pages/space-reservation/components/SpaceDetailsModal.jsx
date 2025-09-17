import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SpaceDetailsModal = ({ 
  isOpen, 
  onClose, 
  space, 
  onBookSpace,
  className = '' 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !space) return null;

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
        size={16}
        color={i < Math.floor(rating) ? '#F59E0B' : '#E5E7EB'}
        className={i < Math.floor(rating) ? 'fill-current' : ''}
      />
    ));
  };

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

  const tabs = [
    { key: 'overview', label: 'Información General', icon: 'Info' },
    { key: 'equipment', label: 'Equipamiento', icon: 'Package' },
    { key: 'policies', label: 'Políticas', icon: 'FileText' },
    { key: 'reviews', label: 'Reseñas', icon: 'Star' }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Información Básica</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Icon name="Users" size={18} className="text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Capacidad</p>
              <p className="font-medium text-foreground">{space?.capacity} personas</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Icon name="Square" size={18} className="text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Área</p>
              <p className="font-medium text-foreground">{space?.area} m²</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Icon name="Tag" size={18} className="text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Tipo</p>
              <p className="font-medium text-foreground">{space?.type}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Icon name="Clock" size={18} className="text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Duración Mínima</p>
              <p className="font-medium text-foreground">{space?.minDuration} hora(s)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Descripción</h3>
        <p className="text-muted-foreground leading-relaxed">
          {space?.description || `Espacio médico completamente equipado ubicado en ${space?.clinic?.name}. Ideal para consultas especializadas y procedimientos menores. Cuenta con todas las comodidades necesarias para brindar atención médica de calidad en un ambiente profesional y cómodo.`}
        </p>
      </div>

      {/* Features */}
      {space?.features && space?.features?.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Características Especiales</h3>
          <div className="grid grid-cols-2 gap-2">
            {space?.features?.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Icon 
                  name={
                    feature === 'WiFi' ? 'Wifi' :
                    feature === 'Aire Acondicionado' ? 'Wind' :
                    feature === 'Estacionamiento' ? 'Car' :
                    feature === 'Acceso 24/7'? 'Clock' : 'Check'
                  } 
                  size={16} 
                  className="text-success" 
                />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clinic Information */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Información de la Clínica</h3>
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Building" size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{space?.clinic?.name}</h4>
              <div className="flex items-center space-x-1 mt-1">
                {renderStars(space?.clinic?.rating)}
                <span className="text-sm text-muted-foreground ml-2">
                  ({space?.clinic?.reviewCount} reseñas)
                </span>
              </div>
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Icon name="MapPin" size={14} className="mr-1" />
                <span>{space?.clinic?.address}</span>
              </div>
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <Icon name="Phone" size={14} className="mr-1" />
                <span>{space?.clinic?.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEquipmentTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Equipamiento Disponible</h3>
        <div className="grid grid-cols-1 gap-3">
          {space?.equipment?.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Check" size={16} className="text-success" />
                <span className="text-foreground">{item}</span>
              </div>
              <span className="text-xs text-success bg-success/10 px-2 py-1 rounded-full">
                Incluido
              </span>
            </div>
          ))}
        </div>
      </div>

      {space?.additionalEquipment && space?.additionalEquipment?.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Equipamiento Adicional (Costo Extra)</h3>
          <div className="grid grid-cols-1 gap-3">
            {space?.additionalEquipment?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="Plus" size={16} className="text-warning" />
                  <span className="text-foreground">{item?.name}</span>
                </div>
                <span className="text-sm font-medium text-warning">
                  +${item?.price}/hora
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPoliciesTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Políticas de Reserva</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
            <Icon name="Clock" size={20} className="text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground">Política de Cancelación</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {space?.policies?.cancellation}
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
            <Icon name="Shield" size={20} className="text-success mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground">Proceso de Aprobación</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {space?.policies?.approval}
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
            <Icon name="AlertCircle" size={20} className="text-warning mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground">Tiempo de Buffer</h4>
              <p className="text-sm text-muted-foreground mt-1">
                15 minutos entre reservas para limpieza y preparación
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
            <Icon name="DollarSign" size={20} className="text-secondary mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground">Política de Pagos</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Pago requerido al momento de la confirmación. Reembolsos según política de cancelación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviewsTab = () => {
    const mockReviews = [
      {
        id: 1,
        doctorName: "Dr. Carlos Mendoza",
        rating: 5,
        date: "2025-08-28",
        comment: "Excelente espacio, muy bien equipado y limpio. El personal de la clínica fue muy colaborativo."
      },
      {
        id: 2,
        doctorName: "Dra. Ana Rodríguez",
        rating: 4,
        date: "2025-08-25",
        comment: "Buen espacio para consultas especializadas. La ubicación es conveniente y el equipamiento está en buen estado."
      },
      {
        id: 3,
        doctorName: "Dr. Luis García",
        rating: 5,
        date: "2025-08-20",
        comment: "Perfecto para procedimientos menores. Muy recomendado, volveré a reservar."
      }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Reseñas de Profesionales</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {renderStars(space?.rating)}
            </div>
            <span className="text-sm text-muted-foreground">
              {space?.rating} ({space?.reviewCount} reseñas)
            </span>
          </div>
        </div>
        <div className="space-y-4">
          {mockReviews?.map((review) => (
            <div key={review?.id} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{review?.doctorName}</p>
                    <div className="flex items-center space-x-1">
                      {renderStars(review?.rating)}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(review.date)?.toLocaleDateString('es-ES')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{review?.comment}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden ${className}`}>
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-xl font-semibold text-foreground">{space?.name}</h2>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(space?.status)}`}>
                  <div className={`w-2 h-2 rounded-full mr-1 ${
                    space?.status === 'AVAILABLE' ? 'bg-success' :
                    space?.status === 'BUSY' ? 'bg-warning' : 'bg-error'
                  }`} />
                  {getStatusText(space?.status)}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Building" size={14} />
                  <span>{space?.clinic?.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="DollarSign" size={14} />
                  <span>${space?.pricePerHour}/hora</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-8 h-8"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-120px)]">
          {/* Image Gallery */}
          <div className="lg:w-1/2 relative">
            <div className="relative h-64 lg:h-full">
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
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 w-10 h-10"
                  >
                    <Icon name="ChevronLeft" size={20} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 w-10 h-10"
                  >
                    <Icon name="ChevronRight" size={20} />
                  </Button>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {space?.images?.length}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="lg:w-1/2 flex flex-col">
            {/* Tabs */}
            <div className="border-b border-border">
              <div className="flex overflow-x-auto">
                {tabs?.map((tab) => (
                  <Button
                    key={tab?.key}
                    variant={activeTab === tab?.key ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab(tab?.key)}
                    className="flex-shrink-0 rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
                    iconName={tab?.icon}
                    iconPosition="left"
                    iconSize={14}
                  >
                    {tab?.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'overview' && renderOverviewTab()}
              {activeTab === 'equipment' && renderEquipmentTab()}
              {activeTab === 'policies' && renderPoliciesTab()}
              {activeTab === 'reviews' && renderReviewsTab()}
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-border">
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cerrar
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    onBookSpace(space);
                    onClose();
                  }}
                  disabled={space?.status !== 'AVAILABLE'}
                  className="flex-1"
                  iconName="Calendar"
                  iconPosition="left"
                  iconSize={16}
                >
                  {space?.status === 'AVAILABLE' ? 'Reservar Espacio' : 'No Disponible'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceDetailsModal;