// src/@/@/pages/provider-profile-setup/index.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import { setProviderProfile } from "@/utils/providerProfile"; // ✅ import limpio

// Función que devuelve los módulos según tipo de negocio
const modulesFor = (type) => {
  switch (type) {
    case "producto":
      return { inventario: true, agenda: false, pedidos: true, despacho: true, facturacion: true };
    case "servicio":
      return { inventario: false, agenda: true, pedidos: true, despacho: false, facturacion: true };
    case "mixto":
    default:
      return { inventario: true, agenda: true, pedidos: true, despacho: true, facturacion: true };
  }
};

export default function ProviderProfileSetup() {
  const navigate = useNavigate();
  const [businessType, setBusinessType] = useState("producto");

  const onSave = () => {
    const profile = {
      businessType,
      businessModules: modulesFor(businessType), // ✅ guarda los módulos correctos
      createdAt: new Date().toISOString(),
    };

    setProviderProfile(profile);
    localStorage.setItem("userRole", "provider");

    navigate("/provider/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-foreground">
          Configuración inicial de Proveedor
        </h1>
        <p className="text-muted-foreground mb-6">
          Selecciona el tipo de negocio para personalizar tu panel:
        </p>

        <select
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md mb-4"
        >
          <option value="producto">Proveedor de Productos</option>
          <option value="servicio">Proveedor de Servicios</option>
          <option value="mixto">Proveedor Mixto</option>
        </select>

        <Button onClick={onSave} className="w-full">Guardar y Continuar</Button>
      </div>
    </div>
  );
}
