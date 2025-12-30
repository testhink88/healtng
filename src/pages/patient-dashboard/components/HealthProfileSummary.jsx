// src/pages/patient-dashboard/components/HealthProfileSummary.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 NUEVO
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

const HealthProfileSummary = ({ className = "" }) => {
  const navigate = useNavigate(); // 👈 NUEVO

  const [healthProfile] = useState({
    allergies: [
      { id: 1, name: "Penicilina", severity: "high", type: "medication" },
      { id: 2, name: "Mariscos", severity: "medium", type: "food" },
      { id: 3, name: "Polen", severity: "low", type: "environmental" },
    ],
    chronicConditions: [
      { id: 1, name: "Hipertensión Arterial", controlled: true, since: "2020" },
      { id: 2, name: "Diabetes Tipo 2", controlled: true, since: "2018" },
    ],
    emergencyContacts: [
      {
        id: 1,
        name: "Juan González",
        relationship: "Esposo",
        phone: "+58 414-123-4567",
      },
      {
        id: 2,
        name: "Ana González",
        relationship: "Hija",
        phone: "+58 424-987-6543",
      },
    ],
    bloodType: "O+",
    lastUpdate: "2025-07-31",
  });

  const [expandedSection, setExpandedSection] = useState(null);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "text-destructive bg-destructive/10"; // usa tokens de Healtng
      case "medium":
        return "text-amber-600 bg-amber-50";
      case "low":
        return "text-emerald-600 bg-emerald-50";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case "high":
        return "Alta";
      case "medium":
        return "Media";
      case "low":
        return "Baja";
      default:
        return "Desconocida";
    }
  };

  const getAllergyIcon = (type) => {
    switch (type) {
      case "medication":
        return "Pill";
      case "food":
        return "Apple";
      case "environmental":
        return "Leaf";
      default:
        return "AlertTriangle";
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // 👇 Ahora usamos React Router en lugar de window.location.href
 const handleEditProfile = () => {
  navigate("/patient-health-profile");  // Verifica que la ruta es la correcta
};

  const handleViewFullHistory = () => {
    navigate("/medical-history");
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date?.toLocaleDateString("es-VE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className={`bg-card rounded-2xl border border-border p-6 ${className}`}>
      {/* Header de la card */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Perfil de Salud</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Resumen rápido de tu información importante
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={handleEditProfile}
          className="text-sm text-primary hover:text-primary/80 font-medium px-2"
        >
          Editar perfil
        </Button>
      </div>

      <div className="space-y-4">
        {/* Tipo de sangre */}
        <div className="bg-muted/40 rounded-lg p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                <Icon name="Droplet" size={18} className="text-destructive" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Tipo de sangre</h3>
                <p className="text-2xl font-bold text-destructive leading-tight">
                  {healthProfile?.bloodType}
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>Última actualización</p>
              <p className="font-medium">
                {formatDate(healthProfile?.lastUpdate)}
              </p>
            </div>
          </div>
        </div>

        {/* Alergias */}
        <div className="border border-border rounded-lg">
          <button
            type="button"
            onClick={() => toggleSection("allergies")}
            className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={16} className="text-amber-600" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-semibold text-foreground">Alergias</h3>
                <p className="text-xs text-muted-foreground">
                  {healthProfile?.allergies?.length} registradas
                </p>
              </div>
            </div>
            <Icon
              name={expandedSection === "allergies" ? "ChevronUp" : "ChevronDown"}
              size={16}
              className="text-muted-foreground"
            />
          </button>

          {expandedSection === "allergies" && (
            <div className="px-4 pb-4 space-y-3 animate-fade-in">
              {healthProfile?.allergies?.map((allergy) => (
                <div
                  key={allergy?.id}
                  className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      name={getAllergyIcon(allergy?.type)}
                      size={16}
                      className="text-muted-foreground"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {allergy?.name}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {allergy?.type}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-[11px] font-medium ${getSeverityColor(
                      allergy?.severity
                    )}`}
                  >
                    {getSeverityText(allergy?.severity)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Condiciones crónicas */}
        <div className="border border-border rounded-lg">
          <button
            type="button"
            onClick={() => toggleSection("conditions")}
            className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="Activity" size={16} className="text-primary" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-semibold text-foreground">
                  Condiciones crónicas
                </h3>
                <p className="text-xs text-muted-foreground">
                  {healthProfile?.chronicConditions?.length} condiciones
                </p>
              </div>
            </div>
            <Icon
              name={expandedSection === "conditions" ? "ChevronUp" : "ChevronDown"}
              size={16}
              className="text-muted-foreground"
            />
          </button>

          {expandedSection === "conditions" && (
            <div className="px-4 pb-4 space-y-3 animate-fade-in">
              {healthProfile?.chronicConditions?.map((condition) => (
                <div
                  key={condition?.id}
                  className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        condition?.controlled ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {condition?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Desde {condition?.since}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-[11px] font-medium ${
                      condition?.controlled
                        ? "text-emerald-600 bg-emerald-50"
                        : "text-amber-600 bg-amber-50"
                    }`}
                  >
                    {condition?.controlled ? "Controlada" : "En tratamiento"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contactos de emergencia */}
        <div className="border border-border rounded-lg">
          <button
            type="button"
            onClick={() => toggleSection("contacts")}
            className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
                <Icon name="Phone" size={16} className="text-destructive" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-semibold text-foreground">
                  Contactos de emergencia
                </h3>
                <p className="text-xs text-muted-foreground">
                  {healthProfile?.emergencyContacts?.length} contactos
                </p>
              </div>
            </div>
            <Icon
              name={expandedSection === "contacts" ? "ChevronUp" : "ChevronDown"}
              size={16}
              className="text-muted-foreground"
            />
          </button>

          {expandedSection === "contacts" && (
            <div className="px-4 pb-4 space-y-3 animate-fade-in">
              {healthProfile?.emergencyContacts?.map((contact) => (
                <div
                  key={contact?.id}
                  className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Icon name="User" size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {contact?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {contact?.relationship}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {contact?.phone}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`tel:${contact?.phone}`)}
                      className="text-xs text-primary hover:text-primary/80 p-0 h-auto"
                    >
                      Llamar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleViewFullHistory}
            className="flex items-center justify-center gap-2"
          >
            <Icon name="FileText" size={16} />
            <span className="text-sm">Historial completo</span>
          </Button>

          <Button
            onClick={handleEditProfile}
            className="flex items-center justify-center gap-2"
          >
            <Icon name="Edit" size={16} />
            <span className="text-sm">Editar perfil</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HealthProfileSummary;
