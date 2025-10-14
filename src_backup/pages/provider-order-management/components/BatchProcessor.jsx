import React, { useState } from 'react';
import { X, Package, CheckCircle, XCircle, Clock, AlertCircle, Download } from 'lucide-react';

const BatchProcessor = ({ orders, onClose, onBulkAction }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedAction, setSelectedAction] = useState('');
  const [processing, setProcessing] = useState(false);
  const [batchNotes, setBatchNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = orders?.filter(order => {
    if (filterStatus === 'all') return true;
    return order?.status === filterStatus;
  });

  const handleOrderToggle = (orderId) => {
    setSelectedOrders(prev => 
      prev?.includes(orderId) 
        ? prev?.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    const allFilteredIds = filteredOrders?.map(order => order?.id);
    setSelectedOrders(
      selectedOrders?.length === allFilteredIds?.length 
        ? [] 
        : allFilteredIds
    );
  };

  const handleBatchProcess = async () => {
    if (!selectedAction || selectedOrders?.length === 0) return;
    
    setProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      onBulkAction(selectedOrders, selectedAction);
      setProcessing(false);
      setSelectedOrders([]);
      setSelectedAction('');
      setBatchNotes('');
    }, 2000);
  };

  const getActionLabel = (action) => {
    switch (action) {
      case 'approve': return 'Aprobar Órdenes';
      case 'reject': return 'Rechazar Órdenes';
      case 'ship': return 'Marcar como Enviadas';
      case 'process': return 'Iniciar Procesamiento';
      default: return action;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'received': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'received': return 'Recibida';
      case 'processing': return 'En Proceso';
      case 'approved': return 'Aprobada';
      case 'shipped': return 'Enviada';
      case 'delivered': return 'Entregada';
      case 'rejected': return 'Rechazada';
      default: return status;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'normal': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'low': return <Clock className="w-4 h-4 text-gray-500" />;
      default: return null;
    }
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
      year: 'numeric'
    });
  };

  const exportToCSV = () => {
    const selectedOrdersData = filteredOrders?.filter(order => selectedOrders?.includes(order?.id));
    
    const csvHeaders = [
      'ID Orden',
      'Cliente',
      'Estado',
      'Prioridad',
      'Total',
      'Productos',
      'Fecha Orden',
      'Fecha Requerida'
    ];

    const csvData = selectedOrdersData?.map(order => [
      order?.id,
      order?.customer?.name,
      getStatusLabel(order?.status),
      order?.priority === 'high' ? 'Alta' : order?.priority === 'normal' ? 'Normal' : 'Baja',
      order?.totalAmount,
      order?.products?.length,
      formatDate(order?.orderDate),
      formatDate(order?.requiredDate)
    ]);

    const csvContent = [csvHeaders, ...csvData]
      ?.map(row => row?.map(field => `"${field}"`)?.join(','))
      ?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link?.setAttribute('href', url);
    link?.setAttribute('download', `ordenes_lote_${new Date()?.toISOString()?.slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Procesamiento en Lote
              </h2>
              <p className="text-gray-600">Gestión masiva de órdenes</p>
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
          {/* Filters and Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e?.target?.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Todas las Órdenes</option>
                <option value="received">Recibidas</option>
                <option value="processing">En Proceso</option>
                <option value="approved">Aprobadas</option>
                <option value="shipped">Enviadas</option>
              </select>
              
              <button
                onClick={handleSelectAll}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                {selectedOrders?.length === filteredOrders?.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
              </button>
              
              <span className="text-sm text-gray-600">
                {selectedOrders?.length} de {filteredOrders?.length} órdenes seleccionadas
              </span>
            </div>
            
            <button
              onClick={exportToCSV}
              disabled={selectedOrders?.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
          </div>

          {/* Orders List */}
          <div className="bg-white border border-gray-200 rounded-lg mb-6">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Órdenes Disponibles</h3>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="w-12 px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedOrders?.length === filteredOrders?.length && filteredOrders?.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Orden</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cliente</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Prioridad</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Productos</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders?.map((order) => (
                    <tr key={order?.id} className={`hover:bg-gray-50 ${selectedOrders?.includes(order?.id) ? 'bg-purple-50' : ''}`}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedOrders?.includes(order?.id)}
                          onChange={() => handleOrderToggle(order?.id)}
                          className="w-4 h-4 text-purple-600 rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getPriorityIcon(order?.priority)}
                          <span className="font-medium text-gray-900">{order?.id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{order?.customer?.name}</p>
                          <p className="text-sm text-gray-600">{order?.customer?.contact}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order?.status)}`}>
                          {getStatusLabel(order?.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900">
                          {order?.priority === 'high' ? 'Alta' : order?.priority === 'normal' ? 'Normal' : 'Baja'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {formatCurrency(order?.totalAmount)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {order?.products?.length} artículos
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(order?.orderDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Batch Actions */}
          {selectedOrders?.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-gray-900 mb-4">Acciones en Lote</h3>
              
              <div className="space-y-4">
                {/* Action Selection */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-white">
                    <input
                      type="radio"
                      name="batchAction"
                      value="approve"
                      checked={selectedAction === 'approve'}
                      onChange={(e) => setSelectedAction(e?.target?.value)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Aprobar</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-white">
                    <input
                      type="radio"
                      name="batchAction"
                      value="reject"
                      checked={selectedAction === 'reject'}
                      onChange={(e) => setSelectedAction(e?.target?.value)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium">Rechazar</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-white">
                    <input
                      type="radio"
                      name="batchAction"
                      value="ship"
                      checked={selectedAction === 'ship'}
                      onChange={(e) => setSelectedAction(e?.target?.value)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">Enviar</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-white">
                    <input
                      type="radio"
                      name="batchAction"
                      value="process"
                      checked={selectedAction === 'process'}
                      onChange={(e) => setSelectedAction(e?.target?.value)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Procesar</span>
                    </div>
                  </label>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas del procesamiento (opcional)
                  </label>
                  <textarea
                    value={batchNotes}
                    onChange={(e) => setBatchNotes(e?.target?.value)}
                    placeholder="Agregar notas sobre el procesamiento en lote..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Summary */}
                {selectedAction && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Resumen de la Acción</h4>
                    <p className="text-sm text-gray-600">
                      Se aplicará la acción "<strong>{getActionLabel(selectedAction)}</strong>" a{' '}
                      <strong>{selectedOrders?.length}</strong> órdenes seleccionadas.
                    </p>
                    {selectedAction === 'ship' && (
                      <p className="text-sm text-blue-600 mt-1">
                        ⚠️ Se generarán números de seguimiento automáticamente para cada orden.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {selectedOrders?.length > 0 ? (
              `${selectedOrders?.length} órdenes seleccionadas para procesamiento`
            ) : (
              'Selecciona órdenes para habilitar las acciones en lote'
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>
            
            <button
              onClick={handleBatchProcess}
              disabled={!selectedAction || selectedOrders?.length === 0 || processing}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {processing ? 'Procesando...' : `${getActionLabel(selectedAction)} (${selectedOrders?.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchProcessor;