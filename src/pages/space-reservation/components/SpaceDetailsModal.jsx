import React, { useState, useEffect, useMemo } from "react";
import Icon from "@/components/AppIcon";
import Image from "@/components/AppImage";
import Button from "@/components/ui/Button";

const SpaceDetailsModal = ({
  isOpen,
  onClose,
  space,
  onBookSpace,
  className = "",
}) => {
  // ---------------- Hooks ----------------
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  const images = Array.isArray(space?.images) ? space.images : [];
  const totalImages = images.length || 1;

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Reset de imagen y pestaña al abrir/cambiar de espacio
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setActiveTab("overview");
    }
  }, [isOpen, space?.id]);

  // Clampear índice si cambia el número de imágenes
  useEffect(() => {
    if (currentImageIndex > totalImages - 1) {
      setCurrentImageIndex(0);
    }
  }, [totalImages, currentImageIndex]);

  const tabs = useMemo(
    () => [
      { key: "overview", label: "Información General", icon: "Info" },
      { key: "equipment", label: "Equipamiento", icon: "Package" },
      { key: "policies", label: "Políticas", icon: "FileText" },
      { key: "reviews", label: "Reseñas", icon: "Star" },
    ],
    []
  );

  if (!isOpen || !space) return null;

  // ---------------- Helpers UI ----------------
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  // Estrella con color amarillo (y soporte para media estrella)
  const Star = ({ filled, half = false, size = 16 }) => {
    const iconName = half ? "StarHalf" : "Star";
    const isActive = filled || half;
    return (
      <Icon
        name={iconName}
        size={size}
        color={isActive ? "#F59E0B" : "#E5E7EB"}
        className={isActive ? "fill-current" : ""}
      />
    );
  };

  const renderStars = (val = 0, size = 16) => {
    const full = Math.floor(val);
    const hasHalf = val - full >= 0.5;
    const empties = 5 - full - (hasHalf ? 1 : 0);
    return (
      <div className="flex items-center">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f${i}`} filled size={size} />
        ))}
        {hasHalf && <Star key="h" half size={size} />}
        {Array.from({ length: empties }).map((_, i) => (
          <Star key={`e${i}`} filled={false} size={size} />
        ))}
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "text-success bg-success/10";
      case "BUSY":
        return "text-warning bg-warning/10";
      case "MAINTENANCE":
        return "text-error bg-error/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "Disponible";
      case "BUSY":
        return "Ocupado";
      case "MAINTENANCE":
        return "Mantenimiento";
      default:
        return "No disponible";
    }
  };

  // ---------------- Sub-vistas internas ----------------
  const OverviewTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Información Básica
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <InfoRow icon="Users" label="Capacidad" value={`${space?.capacity} personas`} />
          <InfoRow icon="Square" label="Área" value={`${space?.area} m²`} />
          <InfoRow icon="Tag" label="Tipo" value={space?.type} />
          <InfoRow
            icon="Clock"
            label="Duración Mínima"
            value={`${space?.minDuration} hora(s)`}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Descripción</h3>
        <p className="text-muted-foreground leading-relaxed">
          {space?.description ||
            "Espacio médico completamente equipado. Ideal para consultas y procedimientos."}
        </p>
      </div>

      {Array.isArray(space?.features) && space.features.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Características Especiales
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {space.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon
                  name={
                    feature === "WiFi"
                      ? "Wifi"
                      : feature === "Aire Acondicionado"
                      ? "Wind"
                      : feature === "Estacionamiento"
                      ? "Car"
                      : "Clock"
                  }
                  size={16}
                  className="text-success"
                />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">
          Información de la Clínica
        </h3>
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Building" size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{space?.clinic?.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                {renderStars(space?.clinic?.rating, 14)}
                <span className="text-sm text-muted-foreground">
                  ({space?.clinic?.reviewCount} reseñas)
                </span>
              </div>
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Icon name="MapPin" size={14} className="mr-1" />
                <span>{space?.clinic?.address}</span>
              </div>
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <Icon name="Phone" size={14} className="mr-1" />
                <span>{space?.clinic?.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ---------------- Render ----------------
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div
        className={`mx-auto bg-card border border-border rounded-lg w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden ${className}`}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    space?.status
                  )}`}
                >
                  {getStatusText(space?.status)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ${space?.pricePerHour}/hora
                </span>
              </div>
              <h2 className="mt-1 text-lg sm:text-xl font-semibold text-foreground truncate">
                {space?.name}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0 w-8 h-8"
              aria-label="Cerrar"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>

        {/* Body: altura fija, contenido scrollable */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-0">
          {/* Galería */}
          <div className="lg:w-1/2 relative">
            <div className="relative h-56 sm:h-64 lg:h-full lg:min-h-0">
              <Image
                src={images[currentImageIndex] || images[0]}
                alt={`${space?.name} - Imagen ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-9 h-9"
                    aria-label="Imagen anterior"
                  >
                    <Icon name="ChevronLeft" size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-9 h-9"
                    aria-label="Imagen siguiente"
                  >
                    <Icon name="ChevronRight" size={18} />
                  </Button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-0.5 rounded-full text-xs">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tabs + contenido */}
          <div className="lg:w-1/2 flex flex-col min-h-0">
            <div className="border-b border-border">
              <div className="flex overflow-x-auto">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm whitespace-nowrap ${
                      activeTab === t.key
                        ? "text-primary border-b-2 border-primary font-medium"
                        : "text-foreground/80"
                    }`}
                    type="button"
                  >
                    <Icon name={t.icon} size={14} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {activeTab === "overview" && <OverviewTab />}
              {activeTab === "equipment" && (
                <EquipmentTab equipment={space?.equipment} />
              )}
              {activeTab === "policies" && (
                <PoliciesTab policies={space?.policies} />
              )}
              {activeTab === "reviews" && (
                <ReviewsTab rating={space?.rating} count={space?.reviewCount} />
              )}
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-border bg-card/95">
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cerrar
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    onBookSpace?.(space);
                    onClose?.();
                  }}
                  disabled={space?.status !== "AVAILABLE"}
                  className="flex-1"
                  iconName="Calendar"
                  iconPosition="left"
                  iconSize={16}
                >
                  {space?.status === "AVAILABLE" ? "Reservar Espacio" : "No Disponible"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------- Subcomponentes puros (sin hooks) --------------
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <Icon name={icon} size={18} className="text-muted-foreground" />
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  </div>
);

const EquipmentTab = ({ equipment }) => {
  const list = Array.isArray(equipment) ? equipment : [];
  if (list.length === 0) {
    return <p className="text-sm text-muted-foreground">Sin equipamiento registrado.</p>;
  }
  return (
    <div className="space-y-3">
      {list.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <Icon name="Check" size={16} className="text-success" />
            <span className="text-foreground text-sm">{item}</span>
          </div>
          <span className="text-xs text-success bg-success/10 px-2 py-1 rounded-full">
            Incluido
          </span>
        </div>
      ))}
    </div>
  );
};

const PoliciesTab = ({ policies }) => {
  const p = policies || {};
  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
        <Icon name="Clock" size={20} className="text-primary mt-0.5" />
        <div>
          <h4 className="font-medium text-foreground">Política de Cancelación</h4>
          <p className="text-sm text-muted-foreground mt-1">
            {p.cancellation || "—"}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
        <Icon name="Shield" size={20} className="text-success mt-0.5" />
        <div>
          <h4 className="font-medium text-foreground">Proceso de Aprobación</h4>
          <p className="text-sm text-muted-foreground mt-1">
            {p.approval || "—"}
          </p>
        </div>
      </div>
    </div>
  );
};

const ReviewsTab = ({ rating = 0, count = 0 }) => {
  const mockReviews = [
    {
      id: 1,
      doctorName: "Dr. Carlos Mendoza",
      rating: 5,
      date: "2025-08-28",
      comment:
        "Excelente espacio, muy bien equipado y limpio. El personal de la clínica fue muy colaborativo.",
    },
    {
      id: 2,
      doctorName: "Dra. Ana Rodríguez",
      rating: 4,
      date: "2025-08-25",
      comment:
        "Buen espacio para consultas especializadas. La ubicación es conveniente y el equipamiento está en buen estado.",
    },
    {
      id: 3,
      doctorName: "Dr. Luis García",
      rating: 5,
      date: "2025-08-20",
      comment:
        "Perfecto para procedimientos menores. Muy recomendado, volveré a reservar.",
    },
  ];

  const renderStars = (val = 0) => {
    const full = Math.round(val);
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={16}
        color={i < full ? "#F59E0B" : "#E5E7EB"}
        className={i < full ? "fill-current" : ""}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Reseñas de Profesionales
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {renderStars(rating)}
          </div>
          <span className="text-sm text-muted-foreground">
            {rating.toFixed(1)} ({count} reseñas)
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {mockReviews.map((review) => (
          <div key={review.id} className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {review.doctorName}
                  </p>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(review.date).toLocaleDateString("es-ES")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpaceDetailsModal;
