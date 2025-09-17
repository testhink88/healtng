import React from "react";
import Icon from "../../components/AppIcon";

export default function ProviderHelp() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <Icon name="HelpCircle" size={22} className="text-primary" />
        <h1 className="text-2xl font-bold">Ayuda y Soporte</h1>
      </div>
      <p className="text-muted-foreground">
        Aquí podrás colocar FAQs, enlaces a documentación y canales de soporte.
      </p>
    </div>
  );
}
