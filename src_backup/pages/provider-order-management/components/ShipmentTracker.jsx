import React, { useState } from 'react';
import { X, Truck, MapPin, Clock, Package, CheckCircle, AlertCircle } from 'lucide-react';

const ShipmentTracker = ({ orders, onClose, onUpdate }) => {
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [trackingDetails, setTrackingDetails] = useState({});

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getShipmentStatus = (order) => {
    if (order?.status === 'delivered') return 'delivered';
    if (order?.status === 'shipped') {
      const shipped = new Date(order?.shippedAt);
      const estimated = new Date(order?.estimatedDelivery);
      const now = new Date();
      
      if (now > estimated) return 'delayed';
      return 'in_transit';
    }
    return 'pending';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'in_transit': return 'text-blue-600 bg-blue-100';
      case 'delayed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'delivered': return 'Entregado';
      case 'in_transit': return 'En Tránsito';
      case 'delayed': return 'Retrasado';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  const generateTrackingDetails = (order) => {
    const baseEvents = [
      {
        status: 'Orden Procesada',
        timestamp: order?.processedAt || order?.orderDate,
        location: 'Centro de Procesamiento',
        description: 'Orden procesada y preparada para envío'
      }
    ];

    if (order?.shippedAt) {
      baseEvents?.push({
        status: 'En Tránsito',
        timestamp: order?.shippedAt,
        location: 'Centro de Distribución',
        description: `Paquete despachado - Transportista: ${order?.carrier || 'Transporte Healtng'}`
      });

      // Add intermediate tracking events for shipped orders
      const shippedTime = new Date(order?.shippedAt);
      const hoursSinceShipped = (Date.now() - shippedTime?.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceShipped > 4) {
        baseEvents?.push({
          status: 'En Ruta',
          timestamp: new Date(shippedTime.getTime() + 4 * 60 * 60 * 1000)?.toISOString(),
          location: 'Hub de Distribución Regional',
          description: 'Paquete en ruta hacia destino final'
        });
      }

      if (hoursSinceShipped > 12) {
        baseEvents?.push({
          status: 'Fuera de Reparto',
          timestamp: new Date(shippedTime.getTime() + 12 * 60 * 60 * 1000)?.toISOString(),
          location: 'Centro de Distribución Local',
          description: 'Paquete fuera de reparto para entrega'
        });
      }
    }

    if (order?.status === 'delivered') {
      baseEvents?.push({
        status: 'Entregado',
        timestamp: order?.deliveredAt || new Date()?.toISOString(),
        location: order?.customer?.name,
        description: 'Paquete entregado al destinatario'
      });
    }

    return baseEvents?.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const handleUpdateDeliveryStatus = (orderId, status) => {
    const updates = { status };
    if (status === 'delivered') {
      updates.deliveredAt = new Date()?.toISOString();
    }
    onUpdate(orderId, updates);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Seguimiento de Envíos
              </h2>
              <p className="text-gray-600">Gestión y monitoreo de entregas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shipments List */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Envíos Activos ({orders?.length})
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {orders?.map((order) => {
                  const shipmentStatus = getShipmentStatus(order);
                  return (
                    <div
                      key={order?.id}
                      onClick={() => setSelectedShipment(order)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedShipment?.id === order?.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{order?.id}</h4>
                          <p className="text-sm text-gray-600">{order?.customer?.name}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipmentStatus)}`}>
                            {getStatusLabel(shipmentStatus)}
                          </span>
                          {shipmentStatus === 'delayed' && (
                            <div className="flex items-center gap-1 mt-1">
                              <AlertCircle className="w-3 h-3 text-red-500" />
                              <span className="text-xs text-red-600">Retrasado</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        {order?.trackingNumber && (
                          <p><span className="font-medium">Tracking:</span> {order?.trackingNumber}</p>
                        )}
                        {order?.shippedAt && (
                          <p><span className="font-medium">Enviado:</span> {formatDate(order?.shippedAt)}</p>
                        )}
                        {order?.estimatedDelivery && (
                          <p><span className="font-medium">Estimado:</span> {formatDate(order?.estimatedDelivery)}</p>
                        )}
                        <p><span className="font-medium">Transportista:</span> {order?.carrier || 'Transporte Healtng'}</p>
                      </div>
                      {order?.status !== 'delivered' && (
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={(e) => {
                              e?.stopPropagation();
                              handleUpdateDeliveryStatus(order?.id, 'delivered');
                            }}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700"
                          >
                            Marcar Entregado
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tracking Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Detalles de Seguimiento
              </h3>
              
              {selectedShipment ? (
                <div className="space-y-4">
                  {/* Shipment Header */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Package className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{selectedShipment?.id}</h4>
                        <p className="text-sm text-gray-600">{selectedShipment?.customer?.name}</p>
                      </div>
                    </div>
                    
                    {selectedShipment?.trackingNumber && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Número de seguimiento:</span>
                          <p className="font-medium">{selectedShipment?.trackingNumber}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Transportista:</span>
                          <p className="font-medium">{selectedShipment?.carrier || 'Transporte Healtng'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Dirección de entrega:</span>
                          <p className="font-medium">{selectedShipment?.shippingAddress}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Entrega estimada:</span>
                          <p className="font-medium">
                            {selectedShipment?.estimatedDelivery ? formatDate(selectedShipment?.estimatedDelivery) : 'Por definir'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tracking Timeline */}
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-4 border-b border-gray-200">
                      <h4 className="font-medium text-gray-900">Historial de Seguimiento</h4>
                    </div>
                    
                    <div className="p-4">
                      <div className="space-y-4">
                        {generateTrackingDetails(selectedShipment)?.map((event, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`w-3 h-3 rounded-full ${
                                event?.status === 'Entregado' ? 'bg-green-500' :
                                event?.status === 'En Tránsito'|| event?.status === 'En Ruta' || event?.status === 'Fuera de Reparto' ? 'bg-blue-500' : 'bg-gray-300'
                              }`} />
                              {index < generateTrackingDetails(selectedShipment)?.length - 1 && (
                                <div className="w-0.5 h-8 bg-gray-200 mt-2" />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {event?.status === 'Entregado' && <CheckCircle className="w-4 h-4 text-green-600" />}
                                {(event?.status === 'En Tránsito' || event?.status === 'En Ruta' || event?.status === 'Fuera de Reparto') && <Truck className="w-4 h-4 text-blue-600" />}
                                {event?.status === 'Orden Procesada' && <Package className="w-4 h-4 text-gray-600" />}
                                <p className="font-medium text-gray-900">{event?.status}</p>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{event?.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDate(event?.timestamp)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {event?.location}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Package Contents */}
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-4 border-b border-gray-200">
                      <h4 className="font-medium text-gray-900">Contenido del Paquete</h4>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {selectedShipment?.products?.map((product, index) => (
                        <div key={index} className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{product?.name}</p>
                            <p className="text-sm text-gray-600">SKU: {product?.sku}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">Cantidad: {product?.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>Selecciona un envío para ver los detalles de seguimiento</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentTracker;