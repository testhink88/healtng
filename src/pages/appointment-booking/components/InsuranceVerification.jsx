import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InsuranceVerification = ({ 
  insuranceProvider, 
  policyNumber, 
  doctorId, 
  appointmentType,
  onVerificationComplete 
}) => {
  const [verificationStatus, setVerificationStatus] = useState('checking'); // 'checking', 'verified', 'partial', 'denied', 'error'
  const [coverageDetails, setCoverageDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (insuranceProvider && policyNumber) {
      verifyInsurance();
    }
  }, [insuranceProvider, policyNumber, doctorId, appointmentType]);

  const verifyInsurance = async () => {
    setIsLoading(true);
    
    // Simulate insurance verification API call
    setTimeout(() => {
      const mockVerificationResult = generateMockVerification();
      setVerificationStatus(mockVerificationResult?.status);
      setCoverageDetails(mockVerificationResult?.details);
      setIsLoading(false);
      onVerificationComplete?.(mockVerificationResult);
    }, 2000);
  };

  const generateMockVerification = () => {
    const scenarios = [
      {
        status: 'verified',
        details: {
          coveragePercentage: 80,
          copayAmount: 15,
          deductibleMet: true,
          maxBenefit: 5000,
          usedBenefit: 1200,
          preAuthRequired: false,
          networkProvider: true,
          effectiveDate: '2025-01-01',
          expirationDate: '2025-12-31'
        }
      },
      {
        status: 'partial',
        details: {
          coveragePercentage: 60,
          copayAmount: 25,
          deductibleMet: false,
          deductibleRemaining: 150,
          maxBenefit: 3000,
          usedBenefit: 800,
          preAuthRequired: true,
          networkProvider: false,
          effectiveDate: '2025-01-01',
          expirationDate: '2025-12-31'
        }
      },
      {
        status: 'denied',
        details: {
          reason: 'Póliza vencida',
          expirationDate: '2024-12-31',
          renewalRequired: true
        }
      }
    ];

    return scenarios?.[Math.floor(Math.random() * scenarios?.length)];
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'checking':
        return 'Loader';
      case 'verified':
        return 'CheckCircle';
      case 'partial':
        return 'AlertCircle';
      case 'denied':
        return 'XCircle';
      case 'error':
        return 'AlertTriangle';
      default:
        return 'Shield';
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'verified':
        return 'text-success';
      case 'partial':
        return 'text-warning';
      case 'denied': case'error':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusMessage = () => {
    switch (verificationStatus) {
      case 'checking':
        return 'Verificando cobertura de seguro...';
      case 'verified':
        return 'Seguro verificado - Cobertura completa';
      case 'partial':
        return 'Seguro verificado - Cobertura parcial';
      case 'denied':
        return 'Seguro no válido o vencido';
      case 'error':
        return 'Error al verificar el seguro';
      default:
        return 'Verificación pendiente';
    }
  };

  if (!insuranceProvider || !policyNumber) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          verificationStatus === 'verified' ? 'bg-success/10' :
          verificationStatus === 'partial' ? 'bg-warning/10' :
          verificationStatus === 'denied' || verificationStatus === 'error' ? 'bg-error/10' :
          'bg-muted'
        }`}>
          <Icon 
            name={getStatusIcon()} 
            size={16} 
            className={`${getStatusColor()} ${verificationStatus === 'checking' ? 'animate-spin' : ''}`}
          />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Verificación de Seguro</h3>
          <p className={`text-sm ${getStatusColor()}`}>{getStatusMessage()}</p>
        </div>
      </div>
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Icon name="Loader" size={32} className="mx-auto mb-3 text-primary animate-spin" />
            <p className="text-muted-foreground">Verificando tu póliza de seguro...</p>
            <p className="text-sm text-muted-foreground mt-1">Esto puede tomar unos segundos</p>
          </div>
        </div>
      )}
      {!isLoading && coverageDetails && verificationStatus === 'verified' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-success/10 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Percent" size={16} className="text-success" />
                <span className="text-sm font-medium text-success">Cobertura</span>
              </div>
              <p className="text-2xl font-bold text-success">{coverageDetails?.coveragePercentage}%</p>
              <p className="text-xs text-muted-foreground">de los costos médicos</p>
            </div>

            <div className="bg-primary/10 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="DollarSign" size={16} className="text-primary" />
                <span className="text-sm font-medium text-primary">Copago</span>
              </div>
              <p className="text-2xl font-bold text-primary">${coverageDetails?.copayAmount}</p>
              <p className="text-xs text-muted-foreground">por consulta</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Proveedor en red:</span>
              <span className={coverageDetails?.networkProvider ? 'text-success' : 'text-warning'}>
                {coverageDetails?.networkProvider ? 'Sí' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Deducible:</span>
              <span className={coverageDetails?.deductibleMet ? 'text-success' : 'text-warning'}>
                {coverageDetails?.deductibleMet ? 'Cumplido' : `$${coverageDetails?.deductibleRemaining || 0} restante`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Beneficio usado:</span>
              <span className="text-foreground">
                ${coverageDetails?.usedBenefit} / ${coverageDetails?.maxBenefit}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vigencia:</span>
              <span className="text-foreground">
                Hasta {new Date(coverageDetails.expirationDate)?.toLocaleDateString('es-VE')}
              </span>
            </div>
          </div>

          {coverageDetails?.preAuthRequired && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-warning" />
                <span className="text-sm font-medium text-warning">Pre-autorización requerida</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Este tipo de consulta requiere pre-autorización de tu seguro
              </p>
            </div>
          )}
        </div>
      )}
      {!isLoading && coverageDetails && verificationStatus === 'partial' && (
        <div className="space-y-4">
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="AlertCircle" size={16} className="text-warning" />
              <span className="text-sm font-medium text-warning">Cobertura Limitada</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Tu seguro cubre {coverageDetails?.coveragePercentage}% de esta consulta
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tu copago:</span>
              <span className="font-medium text-foreground">${coverageDetails?.copayAmount}</span>
            </div>
            {!coverageDetails?.deductibleMet && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deducible restante:</span>
                <span className="text-warning">${coverageDetails?.deductibleRemaining}</span>
              </div>
            )}
            {!coverageDetails?.networkProvider && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Proveedor fuera de red:</span>
                <span className="text-warning">Cobertura reducida</span>
              </div>
            )}
          </div>
        </div>
      )}
      {!isLoading && verificationStatus === 'denied' && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="XCircle" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">Seguro No Válido</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {coverageDetails?.reason || 'No se pudo verificar tu cobertura de seguro'}
          </p>
          {coverageDetails?.renewalRequired && (
            <Button variant="outline" size="sm" className="text-error border-error hover:bg-error/10">
              Renovar Póliza
            </Button>
          )}
        </div>
      )}
      {!isLoading && verificationStatus === 'error' && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertTriangle" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">Error de Verificación</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            No pudimos verificar tu seguro en este momento
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={verifyInsurance}
            className="text-primary border-primary hover:bg-primary/10"
          >
            Intentar Nuevamente
          </Button>
        </div>
      )}
    </div>
  );
};

export default InsuranceVerification;