import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PrescriptionCard = ({ prescription, onFindPharmacy, onDownload, onShare, onRenewRequest }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'dispensed':
        return 'text-success bg-success/10 border-success/20';
      case 'issued':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'expired':
        return 'text-muted-foreground bg-muted border-border';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'dispensed':
        return 'Dispensada';
      case 'issued':
        return 'Emitida';
      case 'expired':
        return 'Expirada';
      default:
        return 'Desconocido';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('es-VE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const generateQRCode = (prescriptionId) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=PRESCRIPTION_${prescriptionId}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-foreground">{prescription?.medicationName}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(prescription?.status)}`}>
              {getStatusLabel(prescription?.status)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">
            <span className="font-medium">Dosis:</span> {prescription?.dosage}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Frecuencia:</span> {prescription?.frequency}
          </p>
        </div>
        
        {/* QR Code */}
        <div className="flex-shrink-0 ml-4">
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
            <Image 
              src={generateQRCode(prescription?.id)}
              alt={`QR Code para ${prescription?.medicationName}`}
              className="w-full h-full rounded-lg"
            />
          </div>
        </div>
      </div>
      {/* Doctor Information */}
      <div className="flex items-center space-x-3 mb-4 p-3 bg-muted/50 rounded-lg">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name="User" size={20} color="var(--color-primary)" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{prescription?.doctorName}</p>
          <p className="text-xs text-muted-foreground">{prescription?.specialty}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Emitida</p>
          <p className="text-sm font-medium text-foreground">{formatDate(prescription?.issueDate)}</p>
        </div>
      </div>
      {/* Digital Signature Verification */}
      <div className="flex items-center justify-between mb-4 p-3 bg-success/5 border border-success/20 rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} color="var(--color-success)" />
          <span className="text-sm font-medium text-success">Firma Digital Verificada</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">Colegio Médico de Venezuela</span>
          <Icon name="CheckCircle" size={14} color="var(--color-success)" />
        </div>
      </div>
      {/* Expandable Details */}
      {isExpanded && (
        <div className="mb-4 p-4 bg-muted/30 rounded-lg space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Número de Receta</p>
              <p className="text-sm font-medium text-foreground">{prescription?.prescriptionNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Válida hasta</p>
              <p className="text-sm font-medium text-foreground">{formatDate(prescription?.expiryDate)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Cantidad</p>
              <p className="text-sm font-medium text-foreground">{prescription?.quantity}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Refills</p>
              <p className="text-sm font-medium text-foreground">{prescription?.refills}</p>
            </div>
          </div>
          
          {prescription?.instructions && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Instrucciones Especiales</p>
              <p className="text-sm text-foreground">{prescription?.instructions}</p>
            </div>
          )}

          {prescription?.status === 'dispensed' && prescription?.pharmacyInfo && (
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-1">Dispensada en</p>
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={14} color="var(--color-muted-foreground)" />
                <p className="text-sm font-medium text-foreground">{prescription?.pharmacyInfo?.name}</p>
              </div>
              <p className="text-xs text-muted-foreground ml-5">{prescription?.pharmacyInfo?.address}</p>
              <p className="text-xs text-muted-foreground ml-5">
                Dispensada el {formatDate(prescription?.dispensedDate)}
              </p>
            </div>
          )}
        </div>
      )}
      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          {isExpanded ? 'Menos detalles' : 'Ver detalles'}
        </Button>

        {prescription?.status === 'issued' && (
          <Button
            variant="default"
            size="sm"
            onClick={() => onFindPharmacy(prescription)}
            iconName="MapPin"
            iconPosition="left"
          >
            Buscar Farmacia
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onDownload(prescription)}
          iconName="Download"
          iconPosition="left"
        >
          Descargar
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onShare(prescription)}
          iconName="Share2"
          iconPosition="left"
        >
          Compartir
        </Button>

        {prescription?.status === 'expired' && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onRenewRequest(prescription)}
            iconName="RefreshCw"
            iconPosition="left"
          >
            Solicitar Renovación
          </Button>
        )}
      </div>
    </div>
  );
};

export default PrescriptionCard;