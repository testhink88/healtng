import React, { useState } from "react";
import Icon from "@/components/AppIcon";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

const PagoMovilForm = ({ orderTotal, onSubmit, onCancel, isProcessing = false, className = "" }) => {
  const [formData, setFormData] = useState({
    bank: "",
    phoneNumber: "",
    idNumber: "",
    amount: orderTotal?.toString(),
    referenceNumber: "",
  });
  const [errors, setErrors] = useState({});

  const venezuelanBanks = [
    { value: "banesco", label: "Banesco" },
    { value: "mercantil", label: "Mercantil" },
    { value: "venezuela", label: "Banco de Venezuela" },
    { value: "provincial", label: "BBVA Provincial" },
    { value: "bicentenario", label: "Banco Bicentenario" },
    { value: "exterior", label: "Banco Exterior" },
    { value: "bancaribe", label: "Bancaribe" },
    { value: "activo", label: "Banco Activo" },
    { value: "plaza", label: "Banco Plaza" },
  ];

  const handleInputChange = (field, value) => {
    let v = value;
    if (field === "phoneNumber") {
      v = value?.replace(/\D/g, "");
      if (v?.length > 11) return;
      if (v?.length >= 4) v = v.replace(/(\d{4})(\d{3})(\d{4})/, "$1-$2-$3");
    }
    if (field === "idNumber") {
      v = value?.replace(/\D/g, "");
      if (v?.length > 8) return;
    }
    if (field === "referenceNumber") {
      v = value?.replace(/\D/g, "");
      if (v?.length > 10) return;
    }
    setFormData((p) => ({ ...p, [field]: v }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.bank) e.bank = "Seleccione un banco";
    const phoneDigits = formData.phoneNumber?.replace(/\D/g, "");
    if (!phoneDigits) e.phoneNumber = "Número de teléfono requerido";
    else if (phoneDigits.length !== 11) e.phoneNumber = "Debe tener 11 dígitos";
    else if (!phoneDigits.startsWith("04")) e.phoneNumber = "Debe comenzar con 04";

    if (!formData.idNumber) e.idNumber = "Cédula requerida";
    else if (formData.idNumber.length < 7 || formData.idNumber.length > 8) e.idNumber = "Cédula inválida";

    if (!formData.referenceNumber) e.referenceNumber = "Referencia requerida";
    else if (formData.referenceNumber.length < 6) e.referenceNumber = "Referencia inválida";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev?.preventDefault();
    if (validateForm()) onSubmit?.(formData);
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
          <Icon name="Smartphone" size={18} color="var(--color-secondary)" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Pago Móvil</h3>
          <p className="text-sm text-muted-foreground">Sistema bancario venezolano</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <Select
          label="Banco Emisor"
          placeholder="Seleccione su banco"
          options={venezuelanBanks}
          value={formData.bank}
          onChange={(v) => handleInputChange("bank", v)}
          error={errors.bank}
          required
          searchable
        />

        <Input
          label="Número de Teléfono"
          type="text"
          placeholder="0412-123-4567"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          error={errors.phoneNumber}
          description="Número asociado a su cuenta bancaria"
          required
        />

        <Input
          label="Cédula de Identidad"
          type="text"
          placeholder="12345678"
          value={formData.idNumber}
          onChange={(e) => handleInputChange("idNumber", e.target.value)}
          error={errors.idNumber}
          description="Sin puntos ni guiones"
          required
        />

        <div className="bg-accent/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Monto a Pagar:</span>
            <span className="text-lg font-bold text-primary">${orderTotal?.toFixed(2)} USD</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Confirme que el monto coincida con su transferencia</p>
        </div>

        <Input
          label="Número de Referencia"
          type="text"
          placeholder="1234567890"
          value={formData.referenceNumber}
          onChange={(e) => handleInputChange("referenceNumber", e.target.value)}
          error={errors.referenceNumber}
          description="Número de confirmación de su transferencia"
          required
        />

        {/* Instrucciones + CTAs dentro de la card */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-start space-x-2 mb-2">
            <Icon name="Info" size={16} color="var(--color-primary)" />
            <span className="text-sm font-medium text-primary">Instrucciones rápidas</span>
          </div>
          <ol className="text-xs text-muted-foreground space-y-1 ml-6">
            <li>1. Realiza el Pago Móvil desde tu app bancaria.</li>
            <li>2. Usa el monto exacto de arriba.</li>
            <li>3. Copia el número de referencia.</li>
            <li>4. Completa y envía este formulario.</li>
          </ol>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button type="button" variant="outline" className="sm:min-w-[160px]" onClick={onCancel} disabled={isProcessing}>
            Volver
          </Button>
          <Button type="submit" variant="default" className="flex-1" loading={isProcessing}>
            Enviar comprobante ({orderTotal?.toFixed(2)} USD)
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PagoMovilForm;
