import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";

import PaymentMethodSelector from "@/pages/payment-processing/components/PaymentMethodSelector";
import CreditCardForm from "@/pages/payment-processing/components/CreditCardForm";
import PagoMovilForm from "@/pages/payment-processing/components/PagoMovilForm";
import SuccessReceipt from "@/pages/payment-processing/components/SuccessReceipt";

const PaymentProcessing = () => {
  const navigate = useNavigate();

  // Layout shell
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Flujo simplificado: 2 = Pago | 3 = Procesando | 4 = Éxito
  const [currentStep, setCurrentStep] = useState(2);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("pending");

  // Pedido (mock)
  const [orderData] = useState({
    orderNumber: "ORD-2025-001234",
    items: [
      { name: "Consulta Cardiológica", price: 85, quantity: 1 },
      { name: "Electrocardiograma", price: 35, quantity: 1 },
      { name: "Losartán 50mg", price: 12.5, quantity: 2 },
    ],
  });
  const subtotal = useMemo(() => orderData.items.reduce((s, it) => s + it.price * it.quantity, 0), [orderData]);
  const tax = useMemo(() => subtotal * 0.16, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  const goBack = () => navigate(-1);
  const handlePaymentMethodChange = (m) => setSelectedPaymentMethod(m);

  // Simulaciones de pago
  const handleCardSubmit = async () => {
    setIsProcessing(true);
    setPaymentStatus("processing");
    setCurrentStep(3);
    await new Promise((r) => setTimeout(r, 1200));
    setPaymentStatus("success");
    setCurrentStep(4);
  };

  const handlePMSubmit = async () => {
    setIsProcessing(true);
    setPaymentStatus("processing");
    setCurrentStep(3);
    await new Promise((r) => setTimeout(r, 1200));
    setPaymentStatus("success");
    setCurrentStep(4);
  };

  // Acciones del recibo
  const goToAppointments = () => navigate("/patient-appointment-history");
  const downloadReceipt = () => {
    // aquí puedes implementar la descarga real del PDF
    alert("Descarga de comprobante no implementada en este mock.");
  };

  const paymentMethodLabel = selectedPaymentMethod === "credit_card" ? "Tarjeta" : "Pago Móvil";

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="patient" onMenuToggle={() => setIsMobileSidebarOpen(true)} />
      <Sidebar
        userRole="patient"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <main className={`pt-16 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Button variant="ghost" size="icon" onClick={goBack} className="min-w-touch min-h-touch">
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {currentStep === 4 ? "Confirmación de Pago" : "Procesamiento de Pago"}
                </h1>
                <p className="text-muted-foreground">
                  {currentStep === 4 ? "Tu pago fue procesado correctamente." : "Complete su transacción de forma segura"}
                </p>
              </div>
            </div>
          </div>

          {/* Contenido */}
          {currentStep === 4 ? (
            // === ÉXITO / RECIBO ===
            <SuccessReceipt
              total={total}
              paymentMethodLabel={paymentMethodLabel}
              orderNumber={orderData.orderNumber}
              appointment={{
                doctorName: "Dr. Andrés Morillo Lárez",
                specialty: "Especialista en Cardiología Clínica",
                clinic: "Clínica Santa Rosalía, Policlínica San Juan",
                dateLabel: "17 de Julio de 2024 – 11:00 hrs",
                isTomorrow: true,
                patientName: "Paciente: Marcos Nabulcodonosor Hernandez Rodriguez",
                whatsapp: "Whatsapp: +58 412 940 8250",
                duration: "Duración: máximo 45 minutos",
              }}
              onGoToAppointments={goToAppointments}
              onDownloadReceipt={downloadReceipt}
            />
          ) : (
            // === PAGO (método + formulario) ===
            <div className="max-w-4xl mx-auto grid grid-cols-1 gap-6">
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Total a pagar</div>
                    <div className="text-lg font-bold text-foreground">${total.toFixed(2)}</div>
                  </div>
                </div>

                <PaymentMethodSelector
                  selectedMethod={selectedPaymentMethod}
                  onMethodChange={handlePaymentMethodChange}
                />

                {selectedPaymentMethod === "credit_card" ? (
                  <CreditCardForm
                    totalAmount={total}
                    isProcessing={isProcessing}
                    onCancel={goBack}
                    onSubmit={handleCardSubmit}
                  />
                ) : (
                  <PagoMovilForm
                    orderTotal={total}
                    isProcessing={isProcessing}
                    onCancel={goBack}
                    onSubmit={handlePMSubmit}
                  />
                )}

                {isProcessing && (
                  <div className="bg-card border border-border rounded-lg p-6 text-center">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon name="Loader" size={28} className="animate-spin" color="var(--color-primary)" />
                    </div>
                    <div className="font-medium text-foreground mb-1">
                      {selectedPaymentMethod === "credit_card" ? "Procesando pago…" : "Verificando transferencia…"}
                    </div>
                    <div className="text-sm text-muted-foreground">No cierre esta ventana.</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PaymentProcessing;
