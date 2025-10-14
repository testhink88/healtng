import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const CreditCardForm = ({ onSubmit, isProcessing = false, className = '' }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    // Format card number with spaces
    if (field === 'cardNumber') {
      formattedValue = value?.replace(/\s/g, '')?.replace(/(.{4})/g, '$1 ')?.trim();
      if (formattedValue?.length > 19) return; // Max 16 digits + 3 spaces
    }
    
    // Format expiry date
    if (field === 'expiryDate') {
      formattedValue = value?.replace(/\D/g, '')?.replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue?.length > 5) return;
    }
    
    // Format CVC
    if (field === 'cvc') {
      formattedValue = value?.replace(/\D/g, '');
      if (formattedValue?.length > 4) return;
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Card number validation
    const cardNumberDigits = formData?.cardNumber?.replace(/\s/g, '');
    if (!cardNumberDigits) {
      newErrors.cardNumber = 'Número de tarjeta requerido';
    } else if (cardNumberDigits?.length < 13 || cardNumberDigits?.length > 19) {
      newErrors.cardNumber = 'Número de tarjeta inválido';
    }
    
    // Expiry date validation
    if (!formData?.expiryDate) {
      newErrors.expiryDate = 'Fecha de vencimiento requerida';
    } else if (!/^\d{2}\/\d{2}$/?.test(formData?.expiryDate)) {
      newErrors.expiryDate = 'Formato inválido (MM/YY)';
    } else {
      const [month, year] = formData?.expiryDate?.split('/');
      const currentDate = new Date();
      const currentYear = currentDate?.getFullYear() % 100;
      const currentMonth = currentDate?.getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Mes inválido';
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Tarjeta vencida';
      }
    }
    
    // CVC validation
    if (!formData?.cvc) {
      newErrors.cvc = 'CVC requerido';
    } else if (formData?.cvc?.length < 3) {
      newErrors.cvc = 'CVC inválido';
    }
    
    // Cardholder name validation
    if (!formData?.cardholderName?.trim()) {
      newErrors.cardholderName = 'Nombre del titular requerido';
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

  const getCardType = (cardNumber) => {
    const number = cardNumber?.replace(/\s/g, '');
    if (/^4/?.test(number)) return 'visa';
    if (/^5[1-5]/?.test(number)) return 'mastercard';
    if (/^3[47]/?.test(number)) return 'amex';
    return 'generic';
  };

  const getCardIcon = (cardType) => {
    switch (cardType) {
      case 'visa': return 'CreditCard';
      case 'mastercard': return 'CreditCard';
      case 'amex': return 'CreditCard';
      default: return 'CreditCard';
    }
  };

  const cardType = getCardType(formData?.cardNumber);

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name="CreditCard" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Tarjeta de Crédito</h3>
          <p className="text-sm text-muted-foreground">Pago seguro con encriptación SSL</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Number */}
        <div className="relative">
          <Input
            label="Número de Tarjeta"
            type="text"
            placeholder="1234 5678 9012 3456"
            value={formData?.cardNumber}
            onChange={(e) => handleInputChange('cardNumber', e?.target?.value)}
            error={errors?.cardNumber}
            required
          />
          <div className="absolute right-3 top-9">
            <Icon name={getCardIcon(cardType)} size={20} className="text-muted-foreground" />
          </div>
        </div>

        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Fecha de Vencimiento"
            type="text"
            placeholder="MM/YY"
            value={formData?.expiryDate}
            onChange={(e) => handleInputChange('expiryDate', e?.target?.value)}
            error={errors?.expiryDate}
            required
          />
          <Input
            label="CVC"
            type="text"
            placeholder="123"
            value={formData?.cvc}
            onChange={(e) => handleInputChange('cvc', e?.target?.value)}
            error={errors?.cvc}
            required
          />
        </div>

        {/* Cardholder Name */}
        <Input
          label="Nombre del Titular"
          type="text"
          placeholder="Como aparece en la tarjeta"
          value={formData?.cardholderName}
          onChange={(e) => handleInputChange('cardholderName', e?.target?.value)}
          error={errors?.cardholderName}
          required
        />

        {/* Security Features */}
        <div className="bg-muted/30 rounded-lg p-4 mt-6">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Shield" size={16} color="var(--color-success)" />
            <span className="text-sm font-medium text-success">Pago Seguro</span>
          </div>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Encriptación SSL de 256 bits</li>
            <li>• Datos protegidos según PCI DSS</li>
            <li>• No almacenamos información de tarjetas</li>
          </ul>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          fullWidth
          loading={isProcessing}
          className="mt-6"
        >
          {isProcessing ? 'Procesando Pago...' : 'Procesar Pago'}
        </Button>
      </form>
    </div>
  );
};

export default CreditCardForm;