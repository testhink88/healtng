import React, { useState } from 'react';
import { X, Package, User, Clock, AlertTriangle, CheckCircle, MessageCircle, FileText } from 'lucide-react';

const OrderProcessingModal = ({ order, businessType, workflow, onClose, onUpdate }) => {
  const [processing, setProcessing] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [notes, setNotes] = useState('');
  const [validationResults, setValidationResults] = useState({
    inventory: null,
    pricing: null,
    customer: null
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const runValidation = async () => {
    setProcessing(true);
    
    // Simulate validation checks
    setTimeout(() => {
      setValidationResults({
        inventory: Math.random() > 0.2, // 80% success rate
        pricing: Math.random() > 0.1,   // 90% success rate  
        customer: Math.random() > 0.05  // 95% success rate
      });
      setProcessing(false);
    }, 2000);
  };

  const getBusinessWorkflow = () => {
    const businessType_lower = businessType?.toLowerCase() || '';
    
    if (businessType_lower?.includes('farmacia')) {
      return {
        title: 'Procesamiento Farmacéutico',
        steps: [
          {
            id: 'verify_prescription',
            label: 'Verificar Prescripción',
            description: 'Validar receta médica y autorización',
            actions: ['Verificar firma médica', 'Validar dosis', 'Confirmar paciente']
          },
          {
            id: 'prepare_medication',
            label: 'Preparar Medicamento',
            description: 'Dispensar y preparar medicamentos',
            actions: ['Contar medicamentos', 'Verificar lote', 'Etiquetar']
          },
          {
            id: 'quality_control',
            label: 'Control de Calidad',
            description: 'Revisión final antes del empaque',
            actions: ['Verificar cantidad', 'Comprobar etiquetado', 'Empacar']
          }
        ]
      };
    }
    
    if (businessType_lower?.includes('laboratorio')) {
      return {
        title: 'Procesamiento Laboratorio',
        steps: [
          {
            id: 'schedule_test',
            label: 'Programar Examen',
            description: 'Coordinar horarios y recursos',
            actions: ['Verificar disponibilidad', 'Asignar técnico', 'Preparar equipo']
          },
          {
            id: 'sample_collection',
            label: 'Recolección de Muestra',
            description: 'Coordinar toma de muestras',
            actions: ['Programar cita', 'Preparar contenedores', 'Coordinar transporte']
          },
          {
            id: 'processing',
            label: 'Procesamiento',
            description: 'Análisis y procesamiento de muestras',
            actions: ['Procesar muestra', 'Generar resultados', 'Validar resultados']
          }
        ]
      };
    }
    
    if (businessType_lower?.includes('óptica')) {
      return {
        title: 'Procesamiento Óptico',
        steps: [
          {
            id: 'validate_prescription',
            label: 'Validar Prescripción',
            description: 'Verificar graduación y medidas',
            actions: ['Verificar graduación', 'Validar medidas', 'Confirmar tipo de lente']
          },
          {
            id: 'measurement_appointment',
            label: 'Cita para Medidas',
            description: 'Programar toma de medidas precisas',
            actions: ['Programar cita', 'Tomar medidas', 'Seleccionar marcos']
          },
          {
            id: 'manufacturing',
            label: 'Fabricación',
            description: 'Fabricar lentes según especificaciones',
            actions: ['Cortar lentes', 'Montar marcos', 'Control de calidad']
          }
        ]
      };
    }
    
    // Default workflow
    return {
      title: 'Procesamiento General',
      steps: [
        {
          id: 'validation',
          label: 'Validación',
          description: 'Verificar orden y disponibilidad',
          actions: ['Verificar inventario', 'Validar precios', 'Confirmar cliente']
        },
        {
          id: 'preparation',
          label: 'Preparación',
          description: 'Preparar productos para envío',
          actions: ['Recolectar productos', 'Verificar calidad', 'Empacar']
        },
        {
          id: 'quality_control',
          label: 'Control de Calidad',
          description: 'Revisión final antes del envío',
          actions: ['Verificar empaque', 'Confirmar dirección', 'Generar guía']
        }
      ]
    };
  };

  const businessWorkflow = getBusinessWorkflow();

  const handleProcessOrder = () => {
    if (!selectedAction) return;
    
    setProcessing(true);
    
    setTimeout(() => {
      const updates = {
        status: selectedAction,
        processedAt: new Date()?.toISOString(),
        processingNotes: notes,
        validationResults
      };
      
      if (selectedAction === 'approved') {
        updates.trackingNumber = 'HLT-' + Math.random()?.toString(36)?.substr(2, 9)?.toUpperCase();
      }
      
      onUpdate(updates);
      setProcessing(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Procesamiento de Orden: {order?.id}
              </h2>
              <p className="text-gray-600">{businessWorkflow?.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Información del Cliente
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Cliente:</span> {order?.customer?.name}</p>
                <p><span className="font-medium">Contacto:</span> {order?.customer?.contact}</p>
                <p><span className="font-medium">Teléfono:</span> {order?.customer?.phone}</p>
                <p><span className="font-medium">Email:</span> {order?.customer?.email}</p>
                <p><span className="font-medium">Dirección:</span> {order?.shippingAddress}</p>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Detalles de la Orden
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Total:</span> {formatCurrency(order?.totalAmount)}</p>
                <p><span className="font-medium">Productos:</span> {order?.products?.length} artículos</p>
                <p><span className="font-medium">Fecha de Orden:</span> {formatDate(order?.orderDate)}</p>
                <p><span className="font-medium">Fecha Requerida:</span> {formatDate(order?.requiredDate)}</p>
                <p><span className="font-medium">Prioridad:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    order?.priority === 'high' ? 'bg-red-100 text-red-800' : 
                    order?.priority === 'normal'? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {order?.priority === 'high' ? 'Alta' : order?.priority === 'normal' ? 'Normal' : 'Baja'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Productos Solicitados</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {order?.products?.map((product, index) => (
                <div key={index} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{product?.name}</p>
                    <p className="text-sm text-gray-600">SKU: {product?.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {product?.quantity} × {formatCurrency(product?.unitPrice)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Subtotal: {formatCurrency(product?.quantity * product?.unitPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Validation Section */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium text-gray-900">Validación de Orden</h3>
              <button
                onClick={runValidation}
                disabled={processing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {processing ? 'Validando...' : 'Ejecutar Validación'}
              </button>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Verificación de Inventario</span>
                <div className="flex items-center gap-2">
                  {validationResults?.inventory === null ? (
                    <span className="text-gray-500 text-sm">Pendiente</span>
                  ) : validationResults?.inventory ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 text-sm">Disponible</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-red-600 text-sm">Stock Insuficiente</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Verificación de Precios</span>
                <div className="flex items-center gap-2">
                  {validationResults?.pricing === null ? (
                    <span className="text-gray-500 text-sm">Pendiente</span>
                  ) : validationResults?.pricing ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 text-sm">Válidos</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-red-600 text-sm">Precios Desactualizados</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Autenticación del Cliente</span>
                <div className="flex items-center gap-2">
                  {validationResults?.customer === null ? (
                    <span className="text-gray-500 text-sm">Pendiente</span>
                  ) : validationResults?.customer ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 text-sm">Verificado</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-red-600 text-sm">Requiere Verificación</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Business Workflow */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Flujo de Procesamiento</h3>
            </div>
            <div className="p-4 space-y-4">
              {businessWorkflow?.steps?.map((step, index) => (
                <div key={step?.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <h4 className="font-medium text-gray-900">{step?.label}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{step?.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {step?.actions?.map((action, actionIndex) => (
                      <span
                        key={actionIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                      >
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Notas de Procesamiento
              </h3>
            </div>
            <div className="p-4">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e?.target?.value)}
                placeholder="Agregar notas sobre el procesamiento de la orden..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Action Selection */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Acción a Realizar</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="action"
                    value="approved"
                    checked={selectedAction === 'approved'}
                    onChange={(e) => setSelectedAction(e?.target?.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-gray-900">Aprobar</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="action"
                    value="processing"
                    checked={selectedAction === 'processing'}
                    onChange={(e) => setSelectedAction(e?.target?.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-900">En Proceso</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="action"
                    value="rejected"
                    checked={selectedAction === 'rejected'}
                    onChange={(e) => setSelectedAction(e?.target?.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-gray-900">Rechazar</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancelar
          </button>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200">
              <MessageCircle className="w-4 h-4" />
              Contactar Cliente
            </button>
            
            <button
              onClick={handleProcessOrder}
              disabled={!selectedAction || processing}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {processing ? 'Procesando...' : 'Procesar Orden'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderProcessingModal;