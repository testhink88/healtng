import React, { useState } from 'react';
import { Eye, MessageCircle, CheckCircle, XCircle, Calendar, MapPin, Phone, Mail, FileText, ChevronRight, AlertTriangle } from 'lucide-react';

const VerificationQueue = ({
  applications,
  onSelectApplication,
  onApprove,
  onReject,
  onRequestInfo,
  getStatusBadge,
  getPriorityBadge
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBatchActions, setShowBatchActions] = useState(false);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(applications?.map(app => app?.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id, checked) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev?.filter(selectedId => selectedId !== id));
    }
  };

  const handleBatchApprove = () => {
    selectedIds?.forEach(id => onApprove(id, "Aprobación en lote"));
    setSelectedIds([]);
    setShowBatchActions(false);
  };

  const handleBatchReject = () => {
    const reason = prompt("Razón del rechazo en lote:");
    if (reason) {
      selectedIds?.forEach(id => onReject(id, reason));
      setSelectedIds([]);
      setShowBatchActions(false);
    }
  };

  const getDocumentStatus = (documents) => {
    const verified = documents?.filter(doc => doc?.status === 'verified')?.length || 0;
    const total = documents?.length || 0;
    
    if (verified === total) {
      return { status: 'complete', color: 'text-green-600', text: `${verified}/${total} verificados` };
    } else if (verified > 0) {
      return { status: 'partial', color: 'text-yellow-600', text: `${verified}/${total} verificados` };
    } else {
      return { status: 'pending', color: 'text-gray-600', text: `${verified}/${total} verificados` };
    }
  };

  const isLicenseExpiringSoon = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
  };

  const isLicenseExpired = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry < now;
  };

  return (
    <div className="space-y-4">
      {/* Batch Actions */}
      {selectedIds?.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-blue-900">
                {selectedIds?.length} solicitud(es) seleccionada(s)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBatchApprove}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Aprobar Selección
              </button>
              <button
                onClick={handleBatchReject}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <XCircle className="w-3 h-3 mr-1" />
                Rechazar Selección
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Applications List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {applications?.map((application) => {
            const docStatus = getDocumentStatus(application?.documents);
            const licenseExpiring = isLicenseExpiringSoon(application?.licenseExpiry);
            const licenseExpired = isLicenseExpired(application?.licenseExpiry);
            
            return (
              <li key={application?.id} className="hover:bg-gray-50 transition-colors duration-150">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center space-x-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedIds?.includes(application?.id)}
                      onChange={(e) => handleSelectOne(application?.id, e?.target?.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />

                    {/* Priority Indicator */}
                    <div className="flex-shrink-0">
                      {application?.priority === 'high' && (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                      {application?.priority === 'normal' && (
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      )}
                      {application?.priority === 'low' && (
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      )}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {application?.fullName}
                          </h3>
                          {getStatusBadge(application?.status)}
                          {getPriorityBadge(application?.priority)}
                          {(licenseExpiring || licenseExpired) && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              licenseExpired ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {licenseExpired ? 'Licencia Vencida' : 'Licencia por Vencer'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            ID: {application?.id}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Personal Info */}
                        <div className="space-y-1">
                          <div className="flex items-center text-xs text-gray-600">
                            <FileText className="w-3 h-3 mr-1" />
                            {application?.cedula}
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <MapPin className="w-3 h-3 mr-1" />
                            {application?.state}, {application?.municipality}
                          </div>
                        </div>

                        {/* Professional Info */}
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-900">
                            {application?.specialty}
                          </div>
                          <div className="text-xs text-gray-600">
                            {application?.collegialNumber}
                          </div>
                        </div>

                        {/* Contact */}
                        <div className="space-y-1">
                          <div className="flex items-center text-xs text-gray-600">
                            <Mail className="w-3 h-3 mr-1" />
                            <span className="truncate">{application?.email}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <Phone className="w-3 h-3 mr-1" />
                            {application?.phone}
                          </div>
                        </div>

                        {/* Status & Date */}
                        <div className="space-y-1">
                          <div className="flex items-center text-xs text-gray-600">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(application?.submissionDate)?.toLocaleDateString('es-ES')}
                          </div>
                          <div className={`text-xs ${docStatus?.color}`}>
                            {docStatus?.text}
                          </div>
                        </div>
                      </div>

                      {/* College and License Info */}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-xs text-gray-600">
                          {application?.college}
                        </div>
                        <div className="text-xs text-gray-500">
                          MPPS: {application?.mppsRegistry}
                        </div>
                      </div>

                      {/* Rejection Reason (if applicable) */}
                      {application?.status === 'rejected' && application?.rejectionReason && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                          <div className="flex">
                            <XCircle className="w-4 h-4 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                            <div className="text-xs text-red-700">
                              <strong>Razón del rechazo:</strong> {application?.rejectionReason}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onSelectApplication(application)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Ver
                      </button>

                      {application?.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onApprove(application?.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Aprobar
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt("Razón del rechazo:");
                              if (reason) onReject(application?.id, reason);
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Rechazar
                          </button>
                          <button
                            onClick={() => {
                              const message = prompt("Mensaje para solicitar información adicional:");
                              if (message) onRequestInfo(application?.id, message);
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Solicitar Info
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      {/* Select All Footer */}
      {applications?.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedIds?.length === applications?.length}
              onChange={(e) => handleSelectAll(e?.target?.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-600">
              Seleccionar todas las solicitudes en esta página
            </label>
          </div>
          <div className="text-sm text-gray-500">
            {selectedIds?.length} de {applications?.length} seleccionadas
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationQueue;