import React, { useState } from "react";
import Icon from "@/components/AppIcon";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const CreditCardForm = ({ onSubmit, onCancel, totalAmount = 0, isProcessing = false, className = "" }) => {
  const [formData, setFormData] = useState({
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    cardholderName: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    let v = value;

    if (field === "cardNumber") {
      v = value?.replace(/\s/g, "")?.replace(/(.{4})/g, "$1 ")?.trim();
      if (v?.length > 19) return;
    }
    if (field === "expiryDate") {
      v = value?.replace(/\D/g, "")?.replace(/(\d{2})(\d)/, "$1/$2");
      if (v?.length > 5) return;
    }
    if (field === "cvc") {
      v = value?.replace(/\D/g, "");
      if (v?.length > 4) return;
    }

    setFormData((p) => ({ ...p, [field]: v }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.email?.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) e.email = "Correo inválido";
    const num = formData.cardNumber?.replace(/\s/g, "");
    if (!num) e.cardNumber = "Número de tarjeta requerido";
    else if (num.length < 13 || num.length > 19) e.cardNumber = "Número de tarjeta inválido";

    if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) e.expiryDate = "Formato MM/YY";
    else {
      const [m, y] = formData.expiryDate.split("/");
      const now = new Date();
      const cy = now.getFullYear() % 100;
      const cm = now.getMonth() + 1;
      if (+m < 1 || +m > 12) e.expiryDate = "Mes inválido";
      else if (+y < cy || (+y === cy && +m < cm)) e.expiryDate = "Tarjeta vencida";
    }

    if (!formData.cvc || formData.cvc.length < 3) e.cvc = "CVC inválido";
    if (!formData.cardholderName?.trim()) e.cardholderName = "Nombre requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev?.preventDefault();
    if (validate()) onSubmit?.(formData);
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name="CreditCard" size={18} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Tarjeta de Crédito</h3>
          <p className="text-sm text-muted-foreground">Pago seguro con encriptación SSL</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tucorreo@dominio.com"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          error={errors.email}
          required
        />

        <div className="relative">
          <Input
            label="Número de Tarjeta"
            type="text"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChange={(e) => handleInputChange("cardNumber", e.target.value)}
            error={errors.cardNumber}
            required
          />
          <div className="absolute right-3 top-9">
            <Icon name="CreditCard" size={18} className="text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Fecha de Vencimiento"
            type="text"
            placeholder="MM/YY"
            value={formData.expiryDate}
            onChange={(e) => handleInputChange("expiryDate", e.target.value)}
            error={errors.expiryDate}
            required
          />
          <Input
            label="CVC"
            type="text"
            placeholder="123"
            value={formData.cvc}
            onChange={(e) => handleInputChange("cvc", e.target.value)}
            error={errors.cvc}
            required
          />
          <Input
            label="Nombre del Titular"
            type="text"
            placeholder="Como aparece en la tarjeta"
            value={formData.cardholderName}
            onChange={(e) => handleInputChange("cardholderName", e.target.value)}
            error={errors.cardholderName}
            required
          />
        </div>

        {/* Footer dentro de la card */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button type="button" variant="outline" className="sm:min-w-[160px]" onClick={onCancel} disabled={isProcessing}>
            Volver
          </Button>
          <Button type="submit" variant="default" className="flex-1" loading={isProcessing}>
            Pagar {totalAmount.toFixed(2)} USD
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreditCardForm;
