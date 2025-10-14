import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

const PagoMovilForm = ({ orderTotal, onSubmit, isProcessing = false, className = '' }) => {
  const [formData, setFormData] = useState({
    bank: '',
    phoneNumber: '',
    idNumber: '',
    amount: orderTotal?.toString(),
    referenceNumber: ''
  });
  const [errors, setErrors] = useState({});

  const venezuelanBanks = [
    { value: 'banesco', label: 'Banesco' },
    { value: 'mercantil', label: 'Mercantil' },
    { value: 'venezuela', label: 'Banco de Venezuela' },
    { value: 'provincial', label: 'BBVA Provincial' },
    { value: 'bicentenario', label: 'Banco Bicentenario' },
    { value: 'exterior', label: 'Banco Exterior' },
    { value: 'bod', label: 'BOD' },
    { value: 'bancaribe', label: 'Bancaribe' },
    { value: 'activo', label: 'Banco Activo' },
    { value: 'plaza', label: 'Banco Plaza' }
  ];

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    // Format phone number
    if (field === 'phoneNumber') {
      formattedValue = value?.replace(/\D/g, '');
      if (formattedValue?.length > 11) return;
      if (formattedValue?.length >= 4) {
        formattedValue = formattedValue?.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3');
      }
    }
    
    // Format ID number
    if (field === 'idNumber') {
      formattedValue = value?.replace(/\D/g, '');
      if (formattedValue?.length > 8) return;
    }
    
    // Format reference number
    if (field === 'referenceNumber') {
      formattedValue = value?.replace(/\D/g, '');
      if (formattedValue?.length > 10) return;
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Bank validation
    if (!formData?.bank) {
      newErrors.bank = 'Seleccione un banco';
    }
    
    // Phone number validation
    const phoneDigits = formData?.phoneNumber?.replace(/\D/g, '');
    if (!phoneDigits) {
      newErrors.phoneNumber = 'Número de teléfono requerido';
    } else if (phoneDigits?.length !== 11) {
      newErrors.phoneNumber = 'Número de teléfono inválido (11 dígitos)';
    } else if (!phoneDigits?.startsWith('04')) {
      newErrors.phoneNumber = 'Debe comenzar con 04';
    }
    
    // ID number validation
    if (!formData?.idNumber) {
      newErrors.idNumber = 'Cédula de identidad requerida';
    } else if (formData?.idNumber?.length < 7 || formData?.idNumber?.length > 8) {
      newErrors.idNumber = 'Cédula inválida (7-8 dígitos)';
    }
    
    // Reference number validation
    if (!formData?.referenceNumber) {
      newErrors.referenceNumber = 'Número de referencia requerido';
    } else if (formData?.referenceNumber?.length < 6) {
      newErrors.referenceNumber = 'Número de referencia inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
          <Icon name="Smartphone" size={20} color="var(--color-secondary)" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Pago Móvil</h3>
          <p className="text-sm text-muted-foreground">Sistema bancario venezolano</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bank Selection */}
        <Select
          label="Banco Emisor"
          placeholder="Seleccione su banco"
          options={venezuelanBanks}
          value={formData?.bank}
          onChange={(value) => handleInputChange('bank', value)}
          error={errors?.bank}
          required
          searchable
        />

        {/* Phone Number */}
        <Input
          label="Número de Teléfono"
          type="text"
          placeholder="0412-123-4567"
          value={formData?.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e?.target?.value)}
          error={errors?.phoneNumber}
          description="Número asociado a su cuenta bancaria"
          required
        />

        {/* ID Number */}
        <Input
          label="Cédula de Identidad"
          type="text"
          placeholder="12345678"
          value={formData?.idNumber}
          onChange={(e) => handleInputChange('idNumber', e?.target?.value)}
          error={errors?.idNumber}
          description="Sin puntos ni guiones"
          required
        />

        {/* Amount Confirmation */}
        <div className="bg-accent/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Monto a Pagar:</span>
            <span className="text-lg font-bold text-primary">${orderTotal} USD</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Confirme que este monto coincida con su transferencia
          </p>
        </div>

        {/* Reference Number */}
        <Input
          label="Número de Referencia"
          type="text"
          placeholder="1234567890"
          value={formData?.referenceNumber}
          onChange={(e) => handleInputChange('referenceNumber', e?.target?.value)}
          error={errors?.referenceNumber}
          description="Número de confirmación de su transferencia"
          required
        />

        {/* Instructions */}
        <div className="bg-muted/30 rounded-lg p-4 mt-6">
          <div className="flex items-start space-x-2 mb-2">
            <Icon name="Info" size={16} color="var(--color-primary)" />
            <span className="text-sm font-medium text-primary">Instrucciones</span>
          </div>
          <ol className="text-xs text-muted-foreground space-y-1 ml-6">
            <li>1. Realice la transferencia desde su app bancaria</li>
            <li>2. Use el monto exacto mostrado arriba</li>
            <li>3. Copie el número de referencia generado</li>
            <li>4. Complete este formulario con los datos</li>
          </ol>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          fullWidth
          loading={isProcessing}
          className="mt-6"
        >
          {isProcessing ? 'Verificando Pago...' : 'Confirmar Pago Móvil'}
        </Button>
      </form>
    </div>
  );
};

export default PagoMovilForm;