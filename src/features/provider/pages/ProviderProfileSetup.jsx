// src/features/provider/pages/ProviderProfileSetup.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import { writeProviderProfileHard, BUSINESS_TYPES, AUDIENCES } from "@/utils/providerProfile";

const BUSINESS_OPTIONS = [
  { label: "Proveedor de Productos", value: "producto" },
  { label: "Proveedor de Servicios", value: "servicio" },
  { label: "Proveedor Mixto (Productos y Servicios)", value: "mixto" },
];

const AUDIENCE_OPTIONS = [
  { label: "Consumidor final", value: "b2c" },
  { label: "Empresas", value: "b2b" },
  { label: "Ambos", value: "both" },
];

export default function ProviderProfileSetup() {
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("Mi Negocio");
  const [businessType, setBusinessType] = useState("");
  const [audience, setAudience] = useState("");
  const [canBuy, setCanBuy] = useState(false);

  const isValid = useMemo(() => {
    return BUSINESS_TYPES.includes(businessType) && AUDIENCES.includes(audience);
  }, [businessType, audience]);

  const handleSave = () => {
    const profile = writeProviderProfileHard({
      businessName,
      businessType,
      audience,
      canBuy,
    });
    // Navegar al dashboard del provider
    navigate("/provider/dashboard", { replace: true, state: { justOnboarded: true } });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-md p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-foreground">Configuración inicial de Proveedor</h1>
          <p className="text-sm text-muted-foreground">
            Define tu tipo de negocio y a quién vendes. Esto activará los módulos adecuados en tu menú.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground block mb-1">Nombre comercial</label>
            <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Mi Negocio" />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground block mb-1">Tipo de proveedor</label>
            <Select
              value={businessType}
              onChange={(v) => setBusinessType(v)}
              options={BUSINESS_OPTIONS}
              placeholder="Selecciona tu tipo de proveedor"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground block mb-1">¿A quién vendes?</label>
            <Select
              value={audience}
              onChange={(v) => setAudience(v)}
              options={AUDIENCE_OPTIONS}
              placeholder="Selecciona el público objetivo"
            />
            <p className="text-xs text-muted-foreground mt-1">
              <strong>Consumidor final</strong> = B2C, <strong>Empresas</strong> = B2B, <strong>Ambos</strong> = habilita ambos flujos.
            </p>
          </div>

          <div className="flex items-center justify-between bg-muted rounded-lg px-3 py-2">
            <div>
              <p className="text-sm font-medium text-foreground">¿Necesitas comprar insumos a proveedores?</p>
              <p className="text-xs text-muted-foreground">Si activas esta opción verás el menú de Marketplace/Compras.</p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={canBuy}
                onChange={(e) => setCanBuy(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary transition-colors relative">
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all ${canBuy ? "translate-x-5" : ""}`} />
              </div>
            </label>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>Cancelar</Button>
          <Button disabled={!isValid} onClick={handleSave}>
            Guardar y continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
