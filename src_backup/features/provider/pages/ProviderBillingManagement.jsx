import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Icon from '@/components/AppIcon';
import { getBusinessContext, getMockProviderOrders } from '../../utils/mockData';

const ProviderBillingManagement = () => {
  const [activeTab, setActiveTab] = useState('invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [selectedBills, setSelectedBills] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const businessContext = getBusinessContext();
  const orders = getMockProviderOrders(businessContext?.businessType || '');

  // Transform orders to billing records
  const [billingRecords, setBillingRecords] = useState([]);

  useEffect(() => {
    const transformedBilling = orders?.map(order => ({
      id: `INV-${order?.id?.replace('PO-', '')}`,
      invoiceNumber: `INV-${order?.id?.replace('PO-', '')}`,
      orderId: order?.id,
      customer: order?.customer,
      issueDate: order?.orderDate,
      dueDate: new Date(new Date(order?.orderDate)?.getTime() + 30 * 24 * 60 * 60 * 1000)?.toISOString(),
      amount: order?.totalAmount,
      currency: 'USD',
      amountVES: Math.round(order?.totalAmount * 36.5), // Mock exchange rate
      paymentStatus: getPaymentStatus(order?.paymentStatus),
      paymentMethod: order?.paymentMethod || 'transfer',
      products: order?.products,
      taxes: calculateTaxes(order?.totalAmount, businessContext?.businessType),
      commission: calculateCommission(order?.totalAmount, businessContext?.businessType),
      notes: order?.notes || '',
      lastPaymentDate: order?.paymentStatus === 'paid' ? 
        new Date(new Date(order?.orderDate)?.getTime() + 5 * 24 * 60 * 60 * 1000)?.toISOString() : null
    })) || [];
    
    setBillingRecords(transformedBilling);
  }, [orders, businessContext]);

  const getPaymentStatus = (orderPaymentStatus) => {
    switch (orderPaymentStatus) {
      case 'pending': return 'pending';
      case 'approved': return 'partial';
      case 'paid': return 'paid';
      default: return 'pending';
    }
  };

  const calculateTaxes = (amount, businessType) => {
    const bType = businessType?.toLowerCase() || '';
    let taxRate = 0.16; // Default IVA 16%
    
    if (bType?.includes('farmacia') || bType?.includes('laboratorio')) {
      taxRate = 0.08; // Reduced rate for medical
    } else if (bType?.includes('óptica')) {
      taxRate = 0.12; // Special rate for optics
    }
    
    return {
      iva: Math.round(amount * taxRate * 100) / 100,
      rate: taxRate,
      total: Math.round(amount * (1 + taxRate) * 100) / 100
    };
  };

  const calculateCommission = (amount, businessType) => {
    const bType = businessType?.toLowerCase() || '';
    let commissionRate = 0.03; // Default 3%
    
    if (bType?.includes('farmacia')) {
      commissionRate = 0.025; // 2.5% for pharmacy
    } else if (bType?.includes('laboratorio')) {
      commissionRate = 0.035; // 3.5% for lab
    }
    
    return {
      rate: commissionRate,
      amount: Math.round(amount * commissionRate * 100) / 100
    };
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: 'Clock', text: 'Pendiente' },
      partial: { color: 'bg-blue-100 text-blue-800', icon: 'AlertCircle', text: 'Parcial' },
      paid: { color: 'bg-green-100 text-green-800', icon: 'CheckCircle', text: 'Pagado' },
      overdue: { color: 'bg-red-100 text-red-800', icon: 'AlertTriangle', text: 'Vencido' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.pending;
    
    return (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} className="mr-1" />
        {config?.text}
      </div>
    );
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (currency === 'VES') {
      return `Bs. ${amount?.toLocaleString('es-VE')}`;
    }
    return `$${amount?.toFixed(2)}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString)?.toLocaleDateString('es-VE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const isOverdue = (dueDate, paymentStatus) => {
    return paymentStatus !== 'paid' && new Date(dueDate) < new Date();
  };

  const filteredBillingRecords = billingRecords?.filter(record => {
    const matchesSearch = record?.customer?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         record?.invoiceNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         record?.orderId?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    let matchesStatus = statusFilter === 'all' || record?.paymentStatus === statusFilter;
    if (statusFilter === 'overdue') {
      matchesStatus = isOverdue(record?.dueDate, record?.paymentStatus);
    }
    
    const matchesCustomer = customerFilter === 'all' || record?.customer?.name === customerFilter;
    
    return matchesSearch && matchesStatus && matchesCustomer;
  }) || [];

  const handleSendInvoice = (invoiceId) => {
    console.log('Sending invoice:', invoiceId);
    // Mock API call
  };

  const handleRecordPayment = (invoiceId) => {
    setBillingRecords(prev => prev?.map(record => 
      record?.id === invoiceId ? { ...record, paymentStatus: 'paid', lastPaymentDate: new Date()?.toISOString() } : record
    ));
  };

  const handleGenerateReceipt = (invoiceId) => {
    console.log('Generating receipt for:', invoiceId);
    // Mock receipt generation
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'send_invoices':
        selectedBills?.forEach(id => handleSendInvoice(id));
        break;
      case 'send_reminders': console.log('Sending payment reminders to:', selectedBills);
        break;
      case 'export_report':
        console.log('Exporting financial report');
        break;
    }
    setSelectedBills([]);
  };

  const getTotalRevenue = () => {
    return filteredBillingRecords?.reduce((total, record) => total + record?.amount, 0) || 0;
  };

  const getPendingAmount = () => {
    return filteredBillingRecords?.filter(r => r?.paymentStatus !== 'paid')?.reduce((total, record) => total + record?.amount, 0) || 0;
  };

  const tabs = [
    { id: 'invoices', label: 'Facturas', icon: 'FileText' },
    { id: 'payments', label: 'Pagos', icon: 'CreditCard' },
    { id: 'reports', label: 'Reportes Fiscales', icon: 'BarChart3' },
    { id: 'analytics', label: 'Análisis Financiero', icon: 'TrendingUp' }
  ];

  const uniqueCustomers = [...new Set(billingRecords?.map(r => r?.customer?.name))]?.filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestión de Facturación
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Operaciones financieras integrales con seguimiento de pagos y analíticas de ingresos
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowInvoiceModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Icon name="Plus" size={16} className="mr-2" />
              Nueva Factura
            </Button>
            <Button
              onClick={() => handleBulkAction('export_report')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Icon name="Download" size={16} className="mr-2" />
              Exportar Reporte
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`
                  flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab?.id
                    ? 'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon name={tab?.icon} size={16} className="mr-2" />
                {tab?.label}
                {tab?.id === 'invoices' && (
                  <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                    {filteredBillingRecords?.filter(r => r?.paymentStatus === 'pending')?.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                type="text"
                placeholder="Buscar por cliente, factura..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e?.target?.value)}
                className="w-full"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="partial">Parcial</option>
                <option value="paid">Pagado</option>
                <option value="overdue">Vencido</option>
              </Select>
            </div>
            <div>
              <Select
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e?.target?.value)}
                className="w-full"
              >
                <option value="all">Todos los clientes</option>
                {uniqueCustomers?.map((customer) => (
                  <option key={customer} value={customer}>{customer}</option>
                ))}
              </Select>
            </div>
            <div>
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e?.target?.value)}
                className="w-full"
              >
                <option value="all">Todos los períodos</option>
                <option value="today">Hoy</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
                <option value="quarter">Este trimestre</option>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'analytics' ? (
        // Financial Analytics Dashboard
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(getTotalRevenue())}</p>
                  <p className="text-sm text-gray-500">{formatCurrency(getTotalRevenue() * 36.5, 'VES')}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <Icon name="DollarSign" size={24} className="text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Por Cobrar</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(getPendingAmount())}</p>
                  <p className="text-sm text-gray-500">{formatCurrency(getPendingAmount() * 36.5, 'VES')}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-full">
                  <Icon name="Clock" size={24} className="text-yellow-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Facturas Pagadas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredBillingRecords?.filter(r => r?.paymentStatus === 'paid')?.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <Icon name="CheckCircle" size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rentabilidad</p>
                  <p className="text-2xl font-bold text-gray-900">22.3%</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-full">
                  <Icon name="TrendingUp" size={24} className="text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart Placeholder */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Flujo de Caja</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Icon name="BarChart3" size={48} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Gráfico de tendencias de ingresos</p>
                <p className="text-sm text-gray-400">Datos de los últimos 12 meses</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Billing Records Table
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {selectedBills?.length > 0 && (
            <div className="p-4 bg-blue-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-700">
                  {selectedBills?.length} facturas seleccionadas
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleBulkAction('send_invoices')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Enviar Facturas
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleBulkAction('send_reminders')}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Enviar Recordatorios
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e?.target?.checked) {
                          setSelectedBills(filteredBillingRecords?.map(r => r?.id));
                        } else {
                          setSelectedBills([]);
                        }
                      }}
                      checked={selectedBills?.length === filteredBillingRecords?.length && filteredBillingRecords?.length > 0}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Factura / Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha / Vencimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado de Pago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBillingRecords?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Icon name="FileText" size={48} className="text-gray-400 mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No hay registros de facturación</p>
                        <p className="text-gray-400 text-sm">No se encontraron facturas con los filtros aplicados</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBillingRecords?.map((record) => (
                    <tr key={record?.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedBills?.includes(record?.id)}
                          onChange={(e) => {
                            if (e?.target?.checked) {
                              setSelectedBills(prev => [...prev, record?.id]);
                            } else {
                              setSelectedBills(prev => prev?.filter(id => id !== record?.id));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {record?.invoiceNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record?.customer?.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            Orden: {record?.orderId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">
                            Emitida: {formatDateTime(record?.issueDate)}
                          </div>
                          <div className={`text-sm ${isOverdue(record?.dueDate, record?.paymentStatus) ? 'text-red-600' : 'text-gray-500'}`}>
                            Vence: {formatDateTime(record?.dueDate)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(record?.amount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatCurrency(record?.amountVES, 'VES')}
                          </div>
                          <div className="text-xs text-gray-400">
                            Comisión: {formatCurrency(record?.commission?.amount)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPaymentStatusBadge(isOverdue(record?.dueDate, record?.paymentStatus) ? 'overdue' : record?.paymentStatus)}
                        {record?.lastPaymentDate && (
                          <div className="text-xs text-gray-500 mt-1">
                            Pagado: {formatDateTime(record?.lastPaymentDate)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSendInvoice(record?.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Icon name="Send" size={16} className="mr-1" />
                          Enviar
                        </Button>
                        {record?.paymentStatus !== 'paid' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRecordPayment(record?.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Icon name="Check" size={16} className="mr-1" />
                            Registrar Pago
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateReceipt(record?.id)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          <Icon name="Receipt" size={16} className="mr-1" />
                          Recibo
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderBillingManagement;