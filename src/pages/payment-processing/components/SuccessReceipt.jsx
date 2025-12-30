// src/pages/payment-confirmation/components/SuccessReceipt.jsx
import React from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

const currency = (n = 0) => `$${Number(n || 0).toFixed(2)}`;

// Renglón compacto para totales
const Row = ({ label, value, strong, dashed }) => (
  <div
    className={[
      "flex items-center justify-between py-2",
      dashed ? "border-t border-dashed border-border mt-1" : "",
    ].join(" ")}
  >
    <span className={strong ? "font-semibold text-foreground" : "text-muted-foreground"}>
      {label}
    </span>
    <span className={strong ? "font-bold text-foreground" : "font-medium"}>{value}</span>
  </div>
);

const ItemLine = ({ icon = "Package", title, subtitle, qty = 1, price = 0 }) => (
  <div className="flex items-start gap-3 py-3">
    <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
      <Icon name={icon} size={16} className="text-muted-foreground" />
    </div>
    <div className="flex-1">
      <div className="text-sm font-medium text-foreground">{title}</div>
      {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
    </div>
    <div className="text-right text-sm text-muted-foreground">
      <div>x{qty}</div>
      <div className="font-medium text-foreground">{currency(price * qty)}</div>
    </div>
  </div>
);

/**
 * SuccessReceipt (PRODUCTO)
 * Modo por defecto: "product"
 * Para uso inmediato (captura), trae mocks de carrito y totales.
 *
 * Props opcionales:
 * - paymentMethodLabel: "Tarjeta" | "Pago Móvil" | ...
 * - totals: { subtotal, tax, shipping, total }
 * - cart: { items: [{title, subtitle, price, qty, icon}], delivery?: {eta, address}}
 * - orderNumber: string
 * - actions: { primaryLabel, primaryAction, secondaryLabel, secondaryAction }
 */
const SuccessReceipt = ({
  // forzamos producto como default
  mode = "product",
  paymentMethodLabel = "Pago Móvil",
  totals,
  cart,
  orderNumber,
  actions = {
    primaryLabel: "Ver mis pedidos",
    primaryAction: () => {},
    secondaryLabel: "Descargar comprobante",
    secondaryAction: () => {},
  },
}) => {
  // --------- Mocks para captura si no llegan props ----------
  const fallbackCart = {
    items: [
      {
        title: "Losartán 50mg – Antihipertensivo",
        subtitle: "Farmacia Central",
        price: 21.68,
        qty: 1,
        icon: "Pill",
      },
    ],
    delivery: { eta: "Entrega: 2–3 días", address: "Av. Francisco de Miranda, Caracas" },
  };

  const items = (cart?.items?.length ? cart.items : fallbackCart.items).map((it) => ({
    qty: 1,
    icon: "Package",
    ...it,
  }));

  const delivery = cart?.delivery || fallbackCart.delivery;

  const computedSubtotal = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);
  const computedTax = +(computedSubtotal * 0.16).toFixed(2);
  const computedShipping = 0;
  const computedTotal = +(computedSubtotal + computedTax + computedShipping).toFixed(2);

  const T = {
    subtotal: totals?.subtotal ?? computedSubtotal,
    tax: totals?.tax ?? computedTax,
    shipping: totals?.shipping ?? computedShipping,
    total: totals?.total ?? computedTotal,
  };

  const showProducts = true; // este archivo es específico de producto

  return (
    <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon name="Check" size={22} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Pago exitoso</h2>
          <p className="text-sm text-muted-foreground">Tu pago fue procesado correctamente.</p>
        </div>
      </div>

      {/* Resumen de pago */}
      <div className="border-t border-dashed border-border pt-6 mt-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">Resumen de pago</h3>
          <div className="text-xs text-muted-foreground">{paymentMethodLabel}</div>
        </div>

        {/* Productos (lista) */}
        {showProducts && (
          <div className="bg-muted/40 rounded-lg border border-border p-3 mb-2">
            {items.map((it, idx) => (
              <ItemLine
                key={`${it.title}-${idx}`}
                icon={it.icon}
                title={it.title}
                subtitle={it.subtitle}
                qty={it.qty || 1}
                price={it.price || 0}
              />
            ))}
            {(delivery?.eta || delivery?.address) && (
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {delivery?.eta && (
                  <span className="inline-flex items-center gap-1">
                    <Icon name="Truck" size={12} />
                    {delivery.eta}
                  </span>
                )}
                {delivery?.address && (
                  <span className="inline-flex items-center gap-1">
                    <Icon name="MapPin" size={12} />
                    {delivery.address}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Totales de producto */}
        <>
          <Row label="Subtotal" value={currency(T.subtotal)} />
          <Row label="IVA (16%)" value={currency(T.tax)} />
          <Row label="Envío" value={T.shipping === 0 ? "Gratis" : currency(T.shipping)} />
          <Row dashed strong label="Total" value={currency(T.total)} />
        </>
      </div>

      {/* Meta del pedido */}
      {(orderNumber || "ORD-2025-001987") && (
        <div className="mt-4 text-xs text-muted-foreground">
          Pedido: <span className="text-foreground font-medium">{orderNumber || "ORD-2025-001987"}</span>
        </div>
      )}

      {/* Nota legal */}
      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        La boleta correspondiente al pago y/o prestación se enviará en un máximo de 24 horas hábiles a partir de la fecha de la
        transacción, como constancia. El comprobante electrónico registrado en Healtng ha sido emitido correctamente.
      </p>

      {/* Acciones */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button variant="default" className="flex-1" onClick={actions.primaryAction}>
          {actions.primaryLabel}
        </Button>
        <Button variant="outline" className="sm:min-w-[220px]" onClick={actions.secondaryAction}>
          {actions.secondaryLabel}
        </Button>
      </div>
    </div>
  );
};

export default SuccessReceipt;
