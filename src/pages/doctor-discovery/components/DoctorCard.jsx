import React from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import RatingStars from "@/components/common/RatingStars";

const DoctorCard = ({
  doctor = {},
  onBookAppointment = () => {},
  onViewProfile = () => {},
  className = "",
}) => {
  const priceUsd =
    doctor?.consultationFee?.usd ??
    (typeof doctor?.consultationFee === "number" ? doctor.consultationFee : undefined);
  const priceLocal =
    doctor?.consultationFee?.ves ?? doctor?.priceLocal ?? doctor?.consultationFeeVES;

  const isOnline = !!(doctor?.isOnline ?? doctor?.online);
  const nextSlotLabel =
    doctor?.nextAvailable?.label ||
    (doctor?.nextAvailable
      ? `${doctor?.nextAvailable?.date} ${doctor?.nextAvailable?.time ?? ""}`.trim()
      : null);

  const availabilityColor = (status) => {
    switch (status) {
      case "available_today": return "text-success bg-success/10";
      case "available_soon":  return "text-warning bg-warning/10";
      case "busy":            return "text-error bg-error/10";
      default:                return "text-muted-foreground bg-muted";
    }
  };

  const availabilityText = (status) => {
    switch (status) {
      case "available_today": return "Disponible hoy";
      case "available_soon":  return "Disponible pronto";
      case "busy":            return "Ocupado";
      default:                return "No disponible";
    }
  };

  return (
    <div
      className={[
        "bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow",
        "flex flex-col gap-4",
        className,
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-muted">
            <img
              src={doctor?.photo || "/assets/images/no_image.png"}
              alt={doctor?.name || "Doctor"}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = "/assets/images/no_image.png")}
              loading="lazy"
            />
            {doctor?.licenseVerified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success border-2 border-card flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </div>
        </div>

        {/* Info principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
                {doctor?.name || "Dr./Dra."}
              </h3>
              <p className="text-sm text-primary font-medium truncate">
                {doctor?.specialty || "Especialidad"}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {doctor?.location && (
                  <span className="inline-flex items-center gap-1">
                    <Icon name="MapPin" size={14} />
                    <span className="truncate">{doctor.location}</span>
                  </span>
                )}

                {isOnline ? (
                  <span className="inline-flex items-center gap-1 text-success">
                    <span className="w-2 h-2 rounded-full bg-success inline-block" />
                    En línea
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground inline-block" />
                    Desconectado
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-center gap-3 text-sm">
                <RatingStars rating={doctor?.rating} size={14} />
                {typeof doctor?.rating === "number" && (
                  <>
                    <span className="font-medium">{doctor.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({doctor?.reviewCount ?? 0} reseñas)</span>
                  </>
                )}
              </div>
            </div>

            {/* Precio */}
            <div className="text-right shrink-0">
              {typeof priceUsd !== "undefined" && (
                <div className="text-lg sm:text-xl font-bold text-foreground leading-none">${priceUsd}</div>
              )}
              {priceLocal && <div className="text-xs text-muted-foreground mt-1">{priceLocal} VES</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${availabilityColor(doctor?.availability)}`}>
          <Icon name="Clock" size={12} className="mr-1" />
          {availabilityText(doctor?.availability)}
        </span>

        {doctor?.teleconsultation && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-primary bg-primary/10">
            <Icon name="Video" size={12} className="mr-1" />
            Teleconsulta
          </span>
        )}

        {doctor?.licenseVerified && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-success bg-success/10">
            <Icon name="ShieldCheck" size={12} className="mr-1" />
            Licencia verificada
          </span>
        )}

        {doctor?.acceptsInsurance && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-secondary bg-secondary/10">
            <Icon name="CreditCard" size={12} className="mr-1" />
            Acepta seguro
          </span>
        )}
      </div>

      {/* Próxima cita */}
      {nextSlotLabel && (
        <div className="rounded-xl border border-border px-3 py-2 flex items-center justify-between">
          <div className="text-sm text-foreground flex items-center gap-2 min-w-0">
            <Icon name="Calendar" size={16} className="text-primary shrink-0" />
            <span className="truncate">
              Próxima cita disponible: <span className="font-medium">{nextSlotLabel}</span>
            </span>
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <Button
          variant="default"
          className="w-full sm:w-auto order-1"
          onClick={() => onBookAppointment(doctor)}
          iconName="CalendarPlus"
          iconPosition="left"
          disabled={doctor?.availability === "busy"}
        >
          {doctor?.availability === "busy" ? "No disponible" : "Agendar cita"}
        </Button>

        <Button
          variant="outline"
          className="w-full sm:w-auto order-2"
          onClick={() => onViewProfile(doctor)}
          iconName="User"
          iconPosition="left"
        >
          Ver perfil
        </Button>
      </div>
    </div>
  );
};

export default DoctorCard;
