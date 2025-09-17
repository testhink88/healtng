import React from "react";
import Icon from "../../components/AppIcon";

export default function ProviderSettings() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <Icon name="Settings" size={22} className="text-primary" />
        <h1 className="text-2xl font-bold">Configuración</h1>
      </div>
      <p className="text-muted-foreground">
        Configura preferencias del proveedor, módulos y datos de la cuenta.
      </p>
    </div>
  );
}
