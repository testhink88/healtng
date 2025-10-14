import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Icon from '@/components/AppIcon';

const ProviderRxIntake = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const mockPrescriptions = [
      {
        id: 'RX-001',
        patientName: 'María González',
        patientId: 'V-12345678',
        doctorName: 'Dr. Carlos Mendoza',
        clinicName: 'Clínica San Rafael',
        date: '2024-01-15',
        status: 'pending',
        priority: 'normal',
        medications: [
          {
            name: 'Amoxicilina 500mg',
            dosage: '1 cápsula cada 8 horas',
            duration: '7 días',
            quantity: 21,
            available: true
          },
          {
            name: 'Ibuprofeno 400mg',
            dosage: '1 tableta cada 6 horas',
            duration: '5 días',
            quantity: 20,
            available: true
          }
        ],
        notes: 'Infección respiratoria aguda',
        insuranceInfo: {
          company: 'Seguros Caracas',
          policy: 'POL-789456',
          copay: 15000
        }
      },
      {
        id: 'RX-002',
        patientName: 'Carlos Rodríguez',
        patientId: 'V-87654321',
        doctorName: 'Dra. Ana Silva',
        clinicName: 'Hospital General',
        date: '2024-01-15',
        status: 'processing',
        priority: 'high',
        medications: [
          {
            name: 'Insulina Glargina',
            dosage: '20 unidades subcutáneas',
            duration: '1 mes',
            quantity: 1,
            available: true
          },
          {
            name: 'Metformina 850mg',
            dosage: '1 tableta antes de cada comida',
            duration: '1 mes',
            quantity: 90,
            available: false
          }
        ],
        notes: 'Diabetes tipo 2 descompensada',
        insuranceInfo: {
          company: 'Seguro Social',
          policy: 'SS-456789',
          copay: 0
        }
      },
      {
        id: 'RX-003',
        patientName: 'Ana López',
        patientId: 'V-11223344',
        doctorName: 'Dr. Luis Herrera',
        clinicName: 'Clínica Especializada',
        date: '2024-01-14',
        status: 'ready',
        priority: 'normal',
        medications: [
          {
            name: 'Losartán 50mg',
            dosage: '1 tableta en la mañana',
            duration: '1 mes',
            quantity: 30,
            available: true
          }
        ],
        notes: 'Hipertensión arterial controlada',
        insuranceInfo: null
      }
    ];
    setPrescriptions(mockPrescriptions);
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pendiente', class: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'Procesando', class: 'bg-blue-100 text-blue-800' },
      ready: { label: 'Lista', class: 'bg-green-100 text-green-800' },
      completed: { label: 'Entregada', class: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Cancelada', class: 'bg-red-100 text-red-800' }
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

  const filteredPrescriptions = prescriptions?.filter(rx => {
    if (activeTab === 'all') return true;
    return rx?.status === activeTab;
  });

  const PrescriptionCard = ({ prescription }) => (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="FileText" size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{prescription?.id}</h3>
            <p className="text-sm text-muted-foreground">{prescription?.patientName}</p>
            <p className="text-sm text-muted-foreground">ID: {prescription?.patientId}</p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          {getStatusBadge(prescription?.status)}
          {prescription?.priority !== 'normal' && getPriorityBadge(prescription?.priority)}
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Médico:</span>
          <span className="text-foreground">{prescription?.doctorName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Clínica:</span>
          <span className="text-foreground">{prescription?.clinicName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Fecha:</span>
          <span className="text-foreground">{new Date(prescription?.date)?.toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Medicamentos:</span>
          <span className="text-foreground">{prescription?.medications?.length} items</span>
        </div>
        {prescription?.insuranceInfo && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Seguro:</span>
            <span className="text-foreground">{prescription?.insuranceInfo?.company}</span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-foreground mb-2">Medicamentos:</h4>
        <div className="space-y-1">
          {prescription?.medications?.map((med, index) => (
            <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
              <div className="flex-1">
                <span className="font-medium text-foreground">{med?.name}</span>
                <span className="text-muted-foreground ml-2">({med?.quantity})</span>
              </div>
              <div className="flex items-center space-x-2">
                {med?.available ? (
                  <Icon name="CheckCircle" size={14} className="text-green-600" />
                ) : (
                  <Icon name="XCircle" size={14} className="text-red-600" />
                )}
                <span className={`text-xs ${med?.available ? 'text-green-600' : 'text-red-600'}`}>
                  {med?.available ? 'Disponible' : 'Agotado'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {prescription?.notes && (
        <p className="text-sm text-muted-foreground mb-4 p-2 bg-muted rounded">
          <strong>Notas:</strong> {prescription?.notes}
        </p>
      )}

      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => {
            setSelectedPrescription(prescription);
            setIsModalOpen(true);
          }}
        >
          <Icon name="Eye" size={14} className="mr-2" />
          Ver Detalles
        </Button>
        <Button variant="default" size="sm" className="flex-1">
          <Icon name="Package" size={14} className="mr-2" />
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
          <h1 className="text-2xl font-bold text-foreground">Procesamiento de Recetas (RX Intake)</h1>
          <p className="text-muted-foreground">
            Gestiona recetas médicas y órdenes de medicamentos
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline">
            <Icon name="Upload" size={16} className="mr-2" />
            Cargar Receta
          </Button>
          <Button variant="outline">
            <Icon name="Scanner" size={16} className="mr-2" />
            Escanear Código
          </Button>
          <Button variant="default">
            <Icon name="Plus" size={16} className="mr-2" />
            Nueva Receta
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Recetas Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {prescriptions?.filter(rx => rx?.status === 'pending')?.length}
              </p>
            </div>
            <Icon name="Clock" size={24} className="text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">En Procesamiento</p>
              <p className="text-2xl font-bold text-blue-600">
                {prescriptions?.filter(rx => rx?.status === 'processing')?.length}
              </p>
            </div>
            <Icon name="RefreshCw" size={24} className="text-blue-500" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Listas para Entrega</p>
              <p className="text-2xl font-bold text-green-600">
                {prescriptions?.filter(rx => rx?.status === 'ready')?.length}
              </p>
            </div>
            <Icon name="CheckCircle" size={24} className="text-green-500" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Procesadas Hoy</p>
              <p className="text-2xl font-bold text-foreground">12</p>
            </div>
            <Icon name="Activity" size={24} className="text-purple-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
        {[
          { key: 'all', label: 'Todas', count: prescriptions?.length },
          { key: 'pending', label: 'Pendientes', count: prescriptions?.filter(rx => rx?.status === 'pending')?.length },
          { key: 'processing', label: 'Procesando', count: prescriptions?.filter(rx => rx?.status === 'processing')?.length },
          { key: 'ready', label: 'Listas', count: prescriptions?.filter(rx => rx?.status === 'ready')?.length }
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

      {/* Prescriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrescriptions?.map(prescription => (
          <PrescriptionCard key={prescription?.id} prescription={prescription} />
        ))}
      </div>

      {filteredPrescriptions?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">No hay recetas</p>
          <p className="text-muted-foreground">en esta categoría por el momento</p>
        </div>
      )}

      {/* Prescription Details Modal */}
      {isModalOpen && selectedPrescription && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">{selectedPrescription?.id}</h2>
                <p className="text-muted-foreground">Detalle de Receta Médica</p>
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
                      <span className="text-foreground">{selectedPrescription?.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cédula:</span>
                      <span className="text-foreground">{selectedPrescription?.patientId}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-foreground mb-2">Información Médica</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Médico:</span>
                      <span className="text-foreground">{selectedPrescription?.doctorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Clínica:</span>
                      <span className="text-foreground">{selectedPrescription?.clinicName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha:</span>
                      <span className="text-foreground">
                        {new Date(selectedPrescription?.date)?.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Estado y Prioridad</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estado:</span>
                      {getStatusBadge(selectedPrescription?.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prioridad:</span>
                      {getPriorityBadge(selectedPrescription?.priority)}
                    </div>
                  </div>
                </div>
                
                {selectedPrescription?.insuranceInfo && (
                  <div>
                    <h3 className="font-medium text-foreground mb-2">Información del Seguro</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Aseguradora:</span>
                        <span className="text-foreground">{selectedPrescription?.insuranceInfo?.company}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Póliza:</span>
                        <span className="text-foreground">{selectedPrescription?.insuranceInfo?.policy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Copago:</span>
                        <span className="text-foreground">
                          Bs. {selectedPrescription?.insuranceInfo?.copay?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-foreground mb-3">Medicamentos Prescritos</h3>
              <div className="space-y-3">
                {selectedPrescription?.medications?.map((med, index) => (
                  <div key={index} className="border border-border rounded p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{med?.name}</h4>
                        <p className="text-sm text-muted-foreground">{med?.dosage}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {med?.available ? (
                          <Icon name="CheckCircle" size={16} className="text-green-600" />
                        ) : (
                          <Icon name="XCircle" size={16} className="text-red-600" />
                        )}
                        <span className={`text-sm font-medium ${med?.available ? 'text-green-600' : 'text-red-600'}`}>
                          {med?.available ? 'Disponible' : 'Agotado'}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Duración:</span>
                        <span className="text-foreground ml-2">{med?.duration}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cantidad:</span>
                        <span className="text-foreground ml-2">{med?.quantity} unidades</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedPrescription?.notes && (
              <div className="mb-6">
                <h3 className="font-medium text-foreground mb-2">Notas Médicas</h3>
                <p className="text-foreground p-3 bg-muted rounded">{selectedPrescription?.notes}</p>
              </div>
            )}

            <div className="flex space-x-3">
              <Button variant="default" className="flex-1">
                <Icon name="Package" size={16} className="mr-2" />
                Procesar Receta
              </Button>
              <Button variant="outline" className="flex-1">
                <Icon name="MessageSquare" size={16} className="mr-2" />
                Contactar Médico
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

export default ProviderRxIntake;