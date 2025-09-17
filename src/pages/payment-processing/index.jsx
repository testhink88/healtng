import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';

// Import components
import PaymentMethodSelector from './components/PaymentMethodSelector';
import CreditCardForm from './components/CreditCardForm';
import PagoMovilForm from './components/PagoMovilForm';
import OrderSummary from './components/OrderSummary';
import SecurityTrustSignals from './components/SecurityTrustSignals';
import PaymentProgress from './components/PaymentProgress';

const PaymentProcessing = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit_card');
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending', 'processing', 'success', 'failed'

  // Mock order data - in real app this would come from cart/booking context
  const [orderData] = useState({
    orderNumber: 'ORD-2025-001234',
    date: new Date()?.toLocaleDateString('es-VE'),
    deliveryAddress: 'Av. Francisco de Miranda, Caracas 1060',
    shipping: 0,
    items: [
      {
        name: 'Consulta Cardiológica',
        description: 'Dr. Carlos Mendoza - 45 minutos',
        price: 85.00,
        quantity: 1,
        icon: 'Heart'
      },
      {
        name: 'Electrocardiograma',
        description: 'Estudio complementario',
        price: 35.00,
        quantity: 1,
        icon: 'Activity'
      },
      {
        name: 'Losartán 50mg',
        description: '30 tabletas - Farmacia Central',
        price: 12.50,
        quantity: 2,
        icon: 'Pill'
      }
    ]
  });

  const calculateOrderTotal = () => {
    const subtotal = orderData?.items?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);
    const tax = subtotal * 0.16;
    return subtotal + tax + orderData?.shipping;
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    setCurrentStep(2);
  };

  const handleCreditCardSubmit = async (cardData) => {
    setIsProcessing(true);
    setCurrentStep(3);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock validation - in real app, validate with payment processor
      const isValidCard = cardData?.cardNumber?.replace(/\s/g, '')?.length >= 13;
      
      if (isValidCard) {
        setPaymentStatus('success');
        setCurrentStep(4);
        
        // Redirect to success page after delay
        setTimeout(() => {
          navigate('/patient-dashboard', { 
            state: { 
              paymentSuccess: true, 
              orderNumber: orderData?.orderNumber,
              amount: calculateOrderTotal()
            }
          });
        }, 2000);
      } else {
        throw new Error('Tarjeta inválida');
      }
    } catch (error) {
      setPaymentStatus('failed');
      setCurrentStep(2);
      alert('Error en el pago: ' + error?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePagoMovilSubmit = async (pagoMovilData) => {
    setIsProcessing(true);
    setCurrentStep(3);
    
    try {
      // Simulate payment verification
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Mock validation - in real app, verify with Venezuelan banking system
      const isValidReference = pagoMovilData?.referenceNumber?.length >= 6;
      
      if (isValidReference) {
        setPaymentStatus('success');
        setCurrentStep(4);
        
        // Redirect to success page after delay
        setTimeout(() => {
          navigate('/patient-dashboard', { 
            state: { 
              paymentSuccess: true, 
              orderNumber: orderData?.orderNumber,
              amount: calculateOrderTotal(),
              paymentMethod: 'pago_movil'
            }
          });
        }, 2000);
      } else {
        throw new Error('Número de referencia inválido');
      }
    } catch (error) {
      setPaymentStatus('failed');
      setCurrentStep(2);
      alert('Error en la verificación: ' + error?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToCart = () => {
    navigate('/marketplace');
  };

  const handleBackToBooking = () => {
    navigate('/appointment-booking');
  };

  // Auto-advance to step 2 if payment method is already selected
  useEffect(() => {
    if (selectedPaymentMethod && currentStep === 1) {
      setCurrentStep(2);
    }
  }, [selectedPaymentMethod, currentStep]);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole="patient"
        onMenuToggle={() => setIsMobileSidebarOpen(true)}
      />
      
      <Sidebar
        userRole="patient"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-4 lg:p-6">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="min-w-touch min-h-touch"
              >
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Procesamiento de Pago</h1>
                <p className="text-muted-foreground">Complete su transacción de forma segura</p>
              </div>
            </div>
            
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <button onClick={handleBackToCart} className="hover:text-foreground transition-colors">
                Carrito
              </button>
              <Icon name="ChevronRight" size={14} />
              <button onClick={handleBackToBooking} className="hover:text-foreground transition-colors">
                Reserva
              </button>
              <Icon name="ChevronRight" size={14} />
              <span className="text-foreground font-medium">Pago</span>
            </nav>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Payment Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Progress */}
              <PaymentProgress 
                currentStep={currentStep}
                isProcessing={isProcessing}
              />

              {/* Payment Method Selection */}
              {currentStep >= 1 && (
                <PaymentMethodSelector
                  selectedMethod={selectedPaymentMethod}
                  onMethodChange={handlePaymentMethodChange}
                />
              )}

              {/* Payment Forms */}
              {currentStep >= 2 && !isProcessing && (
                <div className="space-y-6">
                  {selectedPaymentMethod === 'credit_card' && (
                    <CreditCardForm
                      onSubmit={handleCreditCardSubmit}
                      isProcessing={isProcessing}
                    />
                  )}
                  
                  {selectedPaymentMethod === 'pago_movil' && (
                    <PagoMovilForm
                      orderTotal={calculateOrderTotal()}
                      onSubmit={handlePagoMovilSubmit}
                      isProcessing={isProcessing}
                    />
                  )}
                </div>
              )}

              {/* Processing State */}
              {isProcessing && (
                <div className="bg-card border border-border rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Loader" size={32} color="var(--color-primary)" className="animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {selectedPaymentMethod === 'credit_card' ? 'Procesando Pago...' : 'Verificando Transferencia...'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Por favor no cierre esta ventana ni presione el botón atrás
                  </p>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              )}

              {/* Success State */}
              {paymentStatus === 'success' && currentStep === 4 && (
                <div className="bg-card border border-success rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="CheckCircle" size={32} color="var(--color-success)" />
                  </div>
                  <h3 className="text-lg font-semibold text-success mb-2">¡Pago Exitoso!</h3>
                  <p className="text-muted-foreground mb-4">
                    Su transacción ha sido procesada correctamente
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Redirigiendo al dashboard...
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary & Security */}
            <div className="space-y-6">
              <OrderSummary orderData={orderData} />
              <SecurityTrustSignals />
              
              {/* Help Section */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Icon name="HelpCircle" size={16} color="var(--color-primary)" />
                  <h4 className="font-medium text-foreground">¿Necesita Ayuda?</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Nuestro equipo de soporte está disponible 24/7
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" fullWidth>
                    <Icon name="MessageCircle" size={14} className="mr-2" />
                    Chat en Vivo
                  </Button>
                  <Button variant="ghost" size="sm" fullWidth>
                    <Icon name="Phone" size={14} className="mr-2" />
                    +58 212-555-0123
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Actions */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Volver
              </Button>
              {currentStep === 1 && selectedPaymentMethod && (
                <Button
                  variant="default"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1"
                >
                  Continuar
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentProcessing;