import React from 'react';
import { Clock, Package, AlertTriangle, CheckCircle, Eye, MessageCircle, User, Phone, Mail } from 'lucide-react';

const OrderCard = ({ order, businessType, onViewDetails, onUpdateStatus, workflow }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'received': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'received': return 'Recibida';
      case 'processing': return 'En Proceso';
      case 'approved': return 'Aprobada';
      case 'shipped': return 'Enviada';
      case 'delivered': return 'Entregada';
      default: return status;
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'normal': return 'Normal';
      case 'low': return 'Baja';
      default: return priority;
    }
  };

  const getBusinessSpecificActions = () => {
    if (businessType?.toLowerCase()?.includes('farmacia')) {
      return ['Verificar Prescripción', 'Preparar', 'Empacar'];
    }
    if (businessType?.toLowerCase()?.includes('laboratorio')) {
      return ['Programar', 'Recolectar', 'Procesar'];
    }
    if (businessType?.toLowerCase()?.includes('óptica')) {
      return ['Validar', 'Medir', 'Fabricar'];
    }
    return ['Validar', 'Preparar', 'Enviar'];
  };

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

  const isUrgent = order?.urgencyLevel === 'urgent' || order?.priority === 'high';
  const isOverdue = new Date(order?.requiredDate) < new Date();

  return (
    <div className={`bg-white rounded-lg border-2 p-6 space-y-4 hover:shadow-lg transition-shadow ${
      isUrgent ? 'border-red-200 bg-red-50' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{order?.id}</h3>
            <p className="text-sm text-gray-600">{order?.customer?.name}</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 items-end">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(order?.priority)}`}>
            {getPriorityLabel(order?.priority)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order?.status)}`}>
            {getStatusLabel(order?.status)}
          </span>
        </div>
      </div>

      {/* Urgency Indicators */}
      {(isUrgent || isOverdue) && (
        <div className="flex items-center gap-2 p-2 bg-red-100 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span className="text-sm font-medium text-red-800">
            {isOverdue ? 'Vencida' : 'Urgente'}
          </span>
          {order?.notes && (
            <span className="text-xs text-red-600 ml-auto truncate max-w-32">
              {order?.notes}
            </span>
          )}
        </div>
      )}

      {/* Customer Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>{order?.customer?.contact}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{order?.customer?.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span className="truncate">{order?.customer?.email}</span>
        </div>
      </div>

      {/* Order Details */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(order?.totalAmount)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Artículos</span>
          <span className="text-sm font-medium text-gray-900">
            {order?.products?.length} productos
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Fecha Requerida</span>
          <span className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
            {formatDate(order?.requiredDate)}
          </span>
        </div>
      </div>

      {/* Products Preview */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Productos</h4>
        <div className="space-y-1">
          {order?.products?.slice(0, 2)?.map((product, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span className="text-gray-600 truncate">{product?.name}</span>
              <span className="text-gray-900 font-medium">
                {product?.quantity} × {formatCurrency(product?.unitPrice)}
              </span>
            </div>
          ))}
          {order?.products?.length > 2 && (
            <div className="text-xs text-gray-500">
              +{order?.products?.length - 2} productos más...
            </div>
          )}
        </div>
      </div>

      {/* Business-Specific Workflow */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Acciones Disponibles</h4>
        <div className="flex flex-wrap gap-1">
          {getBusinessSpecificActions()?.map((action, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
            >
              {action}
            </span>
          ))}
        </div>
      </div>

      {/* Tracking Info */}
      {order?.trackingNumber && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Seguimiento: {order?.trackingNumber}
            </span>
          </div>
          {order?.estimatedDelivery && (
            <p className="text-xs text-blue-600 mt-1">
              Entrega estimada: {formatDate(order?.estimatedDelivery)}
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onViewDetails(order)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex-1"
        >
          <Eye className="w-4 h-4" />
          Ver Detalles
        </button>
        
        <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
          <MessageCircle className="w-4 h-4" />
          Contactar
        </button>
        
        {order?.status === 'received' && (
          <button
            onClick={() => onUpdateStatus(order?.id, 'processing')}
            className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
          >
            Procesar
          </button>
        )}
      </div>

      {/* Time Indicators */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>Recibida: {formatDate(order?.orderDate)}</span>
        </div>
        {order?.status !== 'received' && order?.status !== 'processing' && (
          <span className="text-green-600">
            ✓ Procesada
          </span>
        )}
      </div>
    </div>
  );
};

export default OrderCard;