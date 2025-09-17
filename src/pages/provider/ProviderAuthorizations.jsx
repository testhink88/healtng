import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const ProviderAuthorizations = () => {
  const [authorizations, setAuthorizations] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedAuth, setSelectedAuth] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const mockAuthorizations = [
      {
        id: 'AUTH-001',
        patientName: 'María González',
        patientId: 'V-12345678',
        insuranceCompany: 'Seguros Caracas',
        policyNumber: 'POL-789456',
        serviceType: 'Cirugía Menor',
        procedureCode: 'CPT-12345',
        requestedService: 'Extirpación de lunar',
        requestingDoctor: 'Dr. Carlos Mendoza',
        requestDate: '2024-01-15',
        status: 'pending',
        priority: 'normal',
        estimatedCost: 150000,
        copay: 15000,
        notes: 'Lesión pigmentada en brazo derecho',
        documents: [
          { name: 'Solicitud médica', type: 'PDF', uploaded: true },
          { name: 'Historia clínica', type: 'PDF', uploaded: true },
          { name: 'Exámenes previos', type: 'PDF', uploaded: false }
        ]
      },
      {
        id: 'AUTH-002',
        patientName: 'Carlos Rodríguez',
        patientId: 'V-87654321',
        insuranceCompany: 'Seguro Social',
        policyNumber: 'SS-456789',
        serviceType: 'Tratamiento Especializado',
        procedureCode: 'CPT-54321',
        requestedService: 'Terapia de Insulina',
        requestingDoctor: 'Dra. Ana Silva',
        requestDate: '2024-01-14',
        status: 'approved',
        priority: 'high',
        estimatedCost: 200000,
        copay: 0,
        approvalDate: '2024-01-15',
        authorizationNumber: 'APP-789123',
        notes: 'Diabetes tipo 2 descompensada, requiere tratamiento inmediato',
        documents: [
          { name: 'Solicitud médica', type: 'PDF', uploaded: true },
          { name: 'Exámenes de laboratorio', type: 'PDF', uploaded: true }
        ]
      },
      {
        id: 'AUTH-003',
        patientName: 'Ana López',
        patientId: 'V-11223344',
        insuranceCompany: 'Medicina Privada S.A.',
        policyNumber: 'MP-112233',
        serviceType: 'Estudios Diagnósticos',
        procedureCode: 'CPT-98765',
        requestedService: 'Resonancia Magnética',
        requestingDoctor: 'Dr. Luis Herrera',
        requestDate: '2024-01-13',
        status: 'denied',
        priority: 'normal',
        estimatedCost: 300000,
        copay: 30000,
        denialDate: '2024-01-14',
        denialReason: 'Falta documentación complementaria',
        notes: 'Dolor lumbar crónico',
        documents: [
          { name: 'Solicitud médica', type: 'PDF', uploaded: true }
        ]
      },
      {
        id: 'AUTH-004',
        patientName: 'Pedro Martínez',
        patientId: 'V-99887766',
        insuranceCompany: 'Seguros Unidos',
        policyNumber: 'SU-998877',
        serviceType: 'Consulta Especializada',
        procedureCode: 'CPT-11111',
        requestedService: 'Consulta Cardiológica',
        requestingDoctor: 'Dr. Roberto García',
        requestDate: '2024-01-12',
        status: 'in_review',
        priority: 'high',
        estimatedCost: 80000,
        copay: 8000,
        notes: 'Antecedentes de arritmia cardíaca',
        documents: [
          { name: 'Solicitud médica', type: 'PDF', uploaded: true },
          { name: 'Electrocardiograma', type: 'PDF', uploaded: true }
        ]
      }
    ];
    setAuthorizations(mockAuthorizations);
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pendiente', class: 'bg-yellow-100 text-yellow-800' },
      in_review: { label: 'En Revisión', class: 'bg-blue-100 text-blue-800' },
      approved: { label: 'Aprobada', class: 'bg-green-100 text-green-800' },
      denied: { label: 'Denegada', class: 'bg-red-100 text-red-800' },
      expired: { label: 'Vencida', class: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.pending;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config?.class}`}>
        {config?.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      normal: { label: 'Normal', class: 'bg-gray-100 text-gray-800' },
      high: { label: 'Alta', class: 'bg-red-100 text-red-800' },
      urgent: { label: 'Urgente', class: 'bg-red-200 text-red-900' }
    };
    
    const config = priorityConfig?.[priority] || priorityConfig?.normal;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config?.class}`}>
        ⚡ {config?.label}
      </span>
    );
  };

  const filteredAuthorizations = authorizations?.filter(auth => {
    if (activeTab === 'all') return true;
    return auth?.status === activeTab;
  });

  const AuthorizationCard = ({ authorization }) => (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{authorization?.id}</h3>
            <p className="text-sm text-muted-foreground">{authorization?.patientName}</p>
            <p className="text-sm text-muted-foreground">ID: {authorization?.patientId}</p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          {getStatusBadge(authorization?.status)}
          {authorization?.priority !== 'normal' && getPriorityBadge(authorization?.priority)}
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Servicio:</span>
          <span className="text-foreground">{authorization?.requestedService}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Seguro:</span>
          <span className="text-foreground">{authorization?.insuranceCompany}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Médico:</span>
          <span className="text-foreground">{authorization?.requestingDoctor}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Fecha:</span>
          <span className="text-foreground">
            {new Date(authorization?.requestDate)?.toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Costo:</span>
          <span className="text-foreground font-medium">
            Bs. {authorization?.estimatedCost?.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Copago:</span>
          <span className="text-foreground">
            Bs. {authorization?.copay?.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-foreground mb-2">Documentos:</h4>
        <div className="space-y-1">
          {authorization?.documents?.map((doc, index) => (
            <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
              <div className="flex items-center space-x-2">
                <Icon name="FileText" size={14} className="text-muted-foreground" />
                <span className="text-foreground">{doc?.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                {doc?.uploaded ? (
                  <Icon name="CheckCircle" size={14} className="text-green-600" />
                ) : (
                  <Icon name="AlertCircle" size={14} className="text-red-600" />
                )}
                <span className={`text-xs ${doc?.uploaded ? 'text-green-600' : 'text-red-600'}`}>
                  {doc?.uploaded ? 'Cargado' : 'Pendiente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {authorization?.notes && (
        <p className="text-sm text-muted-foreground mb-4 p-2 bg-muted rounded">
          <strong>Notas:</strong> {authorization?.notes}
        </p>
      )}

      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => {
            setSelectedAuth(authorization);
            setIsModalOpen(true);
          }}
        >
          <Icon name="Eye" size={14} className="mr-2" />
          Ver Detalles
        </Button>
        <Button variant="default" size="sm" className="flex-1">
          <Icon name="Edit2" size={14} className="mr-2" />
          Procesar
        </Button>
        <Button variant="outline" size="sm">
          <Icon name="MoreHorizontal" size={14} />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestión de Autorizaciones</h1>
          <p className="text-muted-foreground">
            Administra autorizaciones de seguros y procesos de aprobación
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline">
            <Icon name="Download" size={16} className="mr-2" />
            Exportar
          </Button>
          <Button variant="outline">
            <Icon name="Filter" size={16} className="mr-2" />
            Filtros
          </Button>
          <Button variant="default">
            <Icon name="Plus" size={16} className="mr-2" />
            Nueva Solicitud
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-foreground">{authorizations?.length}</p>
            </div>
            <Icon name="Shield" size={24} className="text-blue-500" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {authorizations?.filter(a => a?.status === 'pending')?.length}
              </p>
            </div>
            <Icon name="Clock" size={24} className="text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">En Revisión</p>
              <p className="text-2xl font-bold text-blue-600">
                {authorizations?.filter(a => a?.status === 'in_review')?.length}
              </p>
            </div>
            <Icon name="Search" size={24} className="text-blue-500" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aprobadas</p>
              <p className="text-2xl font-bold text-green-600">
                {authorizations?.filter(a => a?.status === 'approved')?.length}
              </p>
            </div>
            <Icon name="CheckCircle" size={24} className="text-green-500" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Denegadas</p>
              <p className="text-2xl font-bold text-red-600">
                {authorizations?.filter(a => a?.status === 'denied')?.length}
              </p>
            </div>
            <Icon name="XCircle" size={24} className="text-red-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
        {[
          { key: 'all', label: 'Todas', count: authorizations?.length },
          { key: 'pending', label: 'Pendientes', count: authorizations?.filter(a => a?.status === 'pending')?.length },
          { key: 'in_review', label: 'En Revisión', count: authorizations?.filter(a => a?.status === 'in_review')?.length },
          { key: 'approved', label: 'Aprobadas', count: authorizations?.filter(a => a?.status === 'approved')?.length },
          { key: 'denied', label: 'Denegadas', count: authorizations?.filter(a => a?.status === 'denied')?.length }
        ]?.map(tab => (
          <Button
            key={tab?.key}
            variant={activeTab === tab?.key ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab?.key)}
          >
            {tab?.label} ({tab?.count})
          </Button>
        ))}
      </div>

      {/* Authorizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAuthorizations?.map(authorization => (
          <AuthorizationCard key={authorization?.id} authorization={authorization} />
        ))}
      </div>

      {filteredAuthorizations?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Shield" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">No hay autorizaciones</p>
          <p className="text-muted-foreground">en esta categoría por el momento</p>
        </div>
      )}

      {/* Authorization Details Modal */}
      {isModalOpen && selectedAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">{selectedAuth?.id}</h2>
                <p className="text-muted-foreground">Detalle de Autorización de Seguro</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Información del Paciente</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nombre:</span>
                      <span className="text-foreground">{selectedAuth?.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cédula:</span>
                      <span className="text-foreground">{selectedAuth?.patientId}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-foreground mb-2">Información del Seguro</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Aseguradora:</span>
                      <span className="text-foreground">{selectedAuth?.insuranceCompany}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Póliza:</span>
                      <span className="text-foreground">{selectedAuth?.policyNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Copago:</span>
                      <span className="text-foreground">Bs. {selectedAuth?.copay?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Servicio Solicitado</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Servicio:</span>
                      <span className="text-foreground">{selectedAuth?.requestedService}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="text-foreground">{selectedAuth?.serviceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Código:</span>
                      <span className="text-foreground font-mono">{selectedAuth?.procedureCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Costo:</span>
                      <span className="text-foreground">Bs. {selectedAuth?.estimatedCost?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-foreground mb-2">Estado y Fechas</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estado:</span>
                      {getStatusBadge(selectedAuth?.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prioridad:</span>
                      {getPriorityBadge(selectedAuth?.priority)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Solicitud:</span>
                      <span className="text-foreground">
                        {new Date(selectedAuth?.requestDate)?.toLocaleDateString()}
                      </span>
                    </div>
                    {selectedAuth?.approvalDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Aprobación:</span>
                        <span className="text-foreground">
                          {new Date(selectedAuth?.approvalDate)?.toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-foreground mb-3">Documentos Requeridos</h3>
              <div className="space-y-2">
                {selectedAuth?.documents?.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded">
                    <div className="flex items-center space-x-3">
                      <Icon name="FileText" size={16} className="text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{doc?.name}</p>
                        <p className="text-sm text-muted-foreground">{doc?.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {doc?.uploaded ? (
                        <Icon name="CheckCircle" size={16} className="text-green-600" />
                      ) : (
                        <Icon name="AlertCircle" size={16} className="text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${doc?.uploaded ? 'text-green-600' : 'text-red-600'}`}>
                        {doc?.uploaded ? 'Cargado' : 'Pendiente'}
                      </span>
                      <Button variant="outline" size="sm">
                        {doc?.uploaded ? 'Ver' : 'Subir'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedAuth?.notes && (
              <div className="mb-6">
                <h3 className="font-medium text-foreground mb-2">Notas Médicas</h3>
                <p className="text-foreground p-3 bg-muted rounded">{selectedAuth?.notes}</p>
              </div>
            )}

            {selectedAuth?.denialReason && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded">
                <h3 className="font-medium text-red-800 mb-2">Motivo de Denegación</h3>
                <p className="text-red-700">{selectedAuth?.denialReason}</p>
              </div>
            )}

            <div className="flex space-x-3">
              <Button variant="default" className="flex-1">
                <Icon name="Edit2" size={16} className="mr-2" />
                Procesar Autorización
              </Button>
              <Button variant="outline" className="flex-1">
                <Icon name="MessageSquare" size={16} className="mr-2" />
                Contactar Seguro
              </Button>
              <Button variant="outline">
                <Icon name="Printer" size={16} className="mr-2" />
                Imprimir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderAuthorizations;