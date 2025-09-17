import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const InsuranceVerification = ({ patientId, specialty, isVerified, onVerificationChange }) => {
  const [loading, setLoading] = useState(false);
  const [insuranceData, setInsuranceData] = useState({
    provider: '',
    policyNumber: '',
    groupNumber: '',
    memberName: '',
    coverageType: 'partial',
    copay: '',
    deductible: '',
    authRequired: false,
    authNumber: ''
  });
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [verificationDetails, setVerificationDetails] = useState(null);

  // Mock insurance providers
  const insuranceProviders = [
    { value: 'nacional', label: 'Seguros Nacional' },
    { value: 'banesco', label: 'Banesco Seguros' },
    { value: 'provincial', label: 'Provincial Seguros' },
    { value: 'mercantil', label: 'Seguros Mercantil' },
    { value: 'venezolana', label: 'Seguros La Venezolana' },
    { value: 'other', label: 'Otro' }
  ];

  useEffect(() => {
    if (patientId && insuranceData?.provider && insuranceData?.policyNumber) {
      verifyInsurance();
    }
  }, [patientId, insuranceData?.provider, insuranceData?.policyNumber]);

  const handleInputChange = (field, value) => {
    setInsuranceData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset verification status when data changes
    if (field === 'provider' || field === 'policyNumber') {
      setVerificationStatus('pending');
      setVerificationDetails(null);
      onVerificationChange?.(false);
    }
  };

  const verifyInsurance = async () => {
    if (!insuranceData?.provider || !insuranceData?.policyNumber) {
      return;
    }

    try {
      setLoading(true);
      setVerificationStatus('checking');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock verification results
      const mockResults = {
        verified: true,
        coverageDetails: {
          specialtyCovered: true,
          coveragePercentage: 80,
          copay: '$15',
          deductible: '$200',
          authRequired: specialty === 'cardiology' || specialty === 'oncology',
          authNumber: specialty === 'cardiology' ? 'AUTH-2025-001234' : '',
          networkProvider: true,
          effectiveDate: '2024-01-01',
          expirationDate: '2025-12-31'
        }
      };

      if (mockResults?.verified) {
        setVerificationStatus('verified');
        setVerificationDetails(mockResults?.coverageDetails);
        onVerificationChange?.(true);
        
        // Update insurance data with verification details
        setInsuranceData(prev => ({
          ...prev,
          copay: mockResults?.coverageDetails?.copay,
          deductible: mockResults?.coverageDetails?.deductible,
          authRequired: mockResults?.coverageDetails?.authRequired,
          authNumber: mockResults?.coverageDetails?.authNumber
        }));
      } else {
        setVerificationStatus('failed');
        setVerificationDetails(null);
        onVerificationChange?.(false);
      }
    } catch (error) {
      console.error('Error verifying insurance:', error);
      setVerificationStatus('error');
      setVerificationDetails(null);
      onVerificationChange?.(false);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'checking': return 'Loader2';
      case 'verified': return 'CheckCircle';
      case 'failed': return 'XCircle';
      case 'error': return 'AlertTriangle';
      default: return 'Shield';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'checking': return 'text-primary';
      case 'verified': return 'text-success';
      case 'failed': return 'text-error';
      case 'error': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'checking': return 'bg-primary/10 border-primary/20';
      case 'verified': return 'bg-success/10 border-success/20';
      case 'failed': return 'bg-error/10 border-error/20';
      case 'error': return 'bg-warning/10 border-warning/20';
      default: return 'bg-muted/10 border-border';
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'checking': return 'Verificando cobertura...';
      case 'verified': return 'Seguro verificado exitosamente';
      case 'failed': return 'No se pudo verificar la cobertura';
      case 'error': return 'Error en la verificación';
      default: return 'Ingrese los datos del seguro para verificar';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center">
          <Icon name="Shield" size={20} className="text-info" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Verificación de Seguro</h2>
          <p className="text-sm text-muted-foreground">
            Verifique la cobertura del seguro para la consulta especializada
          </p>
        </div>
      </div>

      {/* Insurance Information Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Compañía de Seguros *"
          value={insuranceData?.provider}
          onChange={(value) => handleInputChange('provider', value)}
          placeholder="Seleccione la aseguradora"
          required
        >
          <option value="">Seleccione la aseguradora</option>
          {insuranceProviders?.map(provider => (
            <option key={provider?.value} value={provider?.value}>
              {provider?.label}
            </option>
          ))}
        </Select>

        <Input
          label="Número de Póliza *"
          value={insuranceData?.policyNumber}
          onChange={(e) => handleInputChange('policyNumber', e?.target?.value)}
          placeholder="Ej: POL-123456789"
          required
        />

        <Input
          label="Número de Grupo"
          value={insuranceData?.groupNumber}
          onChange={(e) => handleInputChange('groupNumber', e?.target?.value)}
          placeholder="Ej: GRP-001"
        />

        <Input
          label="Nombre del Asegurado"
          value={insuranceData?.memberName}
          onChange={(e) => handleInputChange('memberName', e?.target?.value)}
          placeholder="Nombre según la póliza"
        />
      </div>

      {/* Verification Status */}
      <div className={`p-4 rounded-lg border ${getStatusBgColor(verificationStatus)}`}>
        <div className="flex items-center space-x-3">
          <Icon 
            name={getStatusIcon(verificationStatus)} 
            size={20} 
            className={`${getStatusColor(verificationStatus)} ${
              verificationStatus === 'checking' ? 'animate-spin' : ''
            }`} 
          />
          <div className="flex-1">
            <p className="font-medium text-foreground">
              {getStatusMessage(verificationStatus)}
            </p>
            {verificationStatus === 'pending' && insuranceData?.provider && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={verifyInsurance}
                disabled={loading}
                iconName="Search"
                iconPosition="left"
                className="mt-2"
              >
                Verificar Cobertura
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Verification Details */}
      {verificationDetails && verificationStatus === 'verified' && (
        <div className="bg-success/5 border border-success/20 rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <h3 className="font-semibold text-foreground">Detalles de Cobertura</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Especialidad Cubierta</p>
                <p className="font-medium text-foreground">
                  {verificationDetails?.specialtyCovered ? 'Sí' : 'No'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Porcentaje de Cobertura</p>
                <p className="font-medium text-foreground">
                  {verificationDetails?.coveragePercentage}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Co-pago</p>
                <p className="font-medium text-foreground">
                  {verificationDetails?.copay}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deducible</p>
                <p className="font-medium text-foreground">
                  {verificationDetails?.deductible}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Proveedor en Red</p>
                <p className="font-medium text-foreground">
                  {verificationDetails?.networkProvider ? 'Sí' : 'No'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vigencia</p>
                <p className="font-medium text-foreground">
                  {verificationDetails?.effectiveDate} - {verificationDetails?.expirationDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Autorización Requerida</p>
                <p className={`font-medium ${
                  verificationDetails?.authRequired ? 'text-warning' : 'text-success'
                }`}>
                  {verificationDetails?.authRequired ? 'Sí' : 'No'}
                </p>
              </div>
              {verificationDetails?.authRequired && verificationDetails?.authNumber && (
                <div>
                  <p className="text-sm text-muted-foreground">Número de Autorización</p>
                  <p className="font-medium text-foreground">
                    {verificationDetails?.authNumber}
                  </p>
                </div>
              )}
            </div>
          </div>

          {verificationDetails?.authRequired && !verificationDetails?.authNumber && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mt-4">
              <div className="flex items-start space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">Autorización Requerida</p>
                  <p className="text-muted-foreground">
                    Esta especialidad requiere autorización previa. Se enviará la solicitud 
                    automáticamente con la derivación.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Authorization Number Input */}
      {verificationDetails?.authRequired && (
        <div>
          <Input
            label="Número de Autorización (Si ya lo tiene)"
            value={insuranceData?.authNumber}
            onChange={(e) => handleInputChange('authNumber', e?.target?.value)}
            placeholder="AUTH-2025-XXXXXX"
          />
        </div>
      )}

      {/* Insurance Guidelines */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="text-sm space-y-2">
            <p className="font-medium text-foreground">Información Importante:</p>
            <ul className="text-muted-foreground space-y-1 ml-2">
              <li>• La verificación de seguro es opcional pero recomendada</li>
              <li>• Algunos especialistas requieren autorización previa</li>
              <li>• Los co-pagos y deducibles pueden aplicar</li>
              <li>• Verifique que el especialista esté en su red de proveedores</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceVerification;