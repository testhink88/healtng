import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Icon from '@/components/AppIcon';

const ProviderServices = () => {
    const [services, setServices] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [activeTab, setActiveTab] = useState('services');
    const [selectedDate, setSelectedDate] = useState(new Date()?.toISOString()?.split('T')?.[0]);
    // 🆕 Nuevo estado para la vista de servicios: 'grid' (tarjetas) o 'list' (enlistado)
    const [viewMode, setViewMode] = useState('grid'); 

    // Mock data for services
    useEffect(() => {
        const mockServices = [
            {
                id: 1,
                name: 'Consulta General',
                description: 'Consulta médica general ambulatoria',
                duration: 30,
                price: 25000,
                category: 'Consulta Médica',
                requiresOrder: false,
                isActive: true,
                specialist: 'Dr. Carlos Mendoza'
            },
            {
                id: 2,
                name: 'Examen de Laboratorio - Hemograma Completo',
                description: 'Análisis completo de sangre con conteo celular',
                duration: 15,
                price: 35000,
                category: 'Laboratorio',
                requiresOrder: true,
                isActive: true,
                specialist: 'Bioanalista María González'
            },
            {
                id: 3,
                name: 'Examen Visual Completo',
                description: 'Evaluación oftalmológica con dilatación pupilar',
                duration: 45,
                price: 45000,
                category: 'Oftalmología',
                requiresOrder: false,
                isActive: true,
                specialist: 'Dr. Ana Rodríguez'
            },
            {
                id: 4,
                name: 'Radiografía de Tórax',
                description: 'Estudio radiológico del tórax AP y lateral',
                duration: 20,
                price: 40000,
                category: 'Imagenología',
                requiresOrder: true,
                isActive: true,
                specialist: 'Dr. Luis Herrera'
            },
            {
                id: 5,
                name: 'Terapia Física Sesión',
                description: 'Sesión de rehabilitación física personalizada',
                duration: 60,
                price: 30000,
                category: 'Rehabilitación',
                requiresOrder: true,
                isActive: true,
                specialist: 'Ft. Carmen Silva'
            }
        ];
        setServices(mockServices);

        const mockAppointments = [
            {
                id: 1,
                serviceId: 1,
                serviceName: 'Consulta General',
                patientName: 'Juan Pérez',
                patientId: 'V-12345678',
                date: selectedDate,
                time: '09:00',
                status: 'confirmed',
                specialist: 'Dr. Carlos Mendoza',
                notes: 'Control de rutina'
            },
            {
                id: 2,
                serviceId: 2,
                serviceName: 'Examen de Laboratorio - Hemograma Completo',
                patientName: 'María García',
                patientId: 'V-87654321',
                date: selectedDate,
                time: '10:30',
                status: 'pending',
                specialist: 'Bioanalista María González',
                notes: 'Orden médica adjunta'
            },
            {
                id: 3,
                serviceId: 3,
                serviceName: 'Examen Visual Completo',
                patientName: 'Carlos Rodríguez',
                patientId: 'V-11223344',
                date: selectedDate,
                time: '14:00',
                status: 'confirmed',
                specialist: 'Dr. Ana Rodríguez',
                notes: 'Primera cita'
            }
        ];
        setAppointments(mockAppointments);
    }, [selectedDate]);

    const getStatusBadge = (status) => {
        const statusConfig = {
            confirmed: { label: 'Confirmada', class: 'bg-green-100 text-green-800' },
            pending: { label: 'Pendiente', class: 'bg-yellow-100 text-yellow-800' },
            completed: { label: 'Completada', class: 'bg-blue-100 text-blue-800' },
            cancelled: { label: 'Cancelada', class: 'bg-red-100 text-red-800' }
        };
        
        const config = statusConfig?.[status] || statusConfig?.pending;
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${config?.class}`}>
                {config?.label}
            </span>
        );
    };

    // Componente original de tarjeta (grid view)
    const ServiceCard = ({ service }) => (
        <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{service?.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{service?.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>⏱️ {service?.duration} min</span>
                        <span>💰 Bs. {service?.price?.toLocaleString()}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {service?.requiresOrder && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Requiere orden
                        </span>
                    )}
                    <div className={`w-3 h-3 rounded-full ${service?.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
            </div>
            
            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Categoría:</span>
                    <span className="text-foreground">{service?.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Especialista:</span>
                    <span className="text-foreground">{service?.specialist}</span>
                </div>
            </div>

            <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                    <Icon name="Edit2" size={14} className="mr-2" />
                    Editar
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                    <Icon name="Calendar" size={14} className="mr-2" />
                    Agenda
                </Button>
                <Button variant="outline" size="sm">
                    <Icon name="MoreHorizontal" size={14} />
                </Button>
            </div>
        </div>
    );

    // 🆕 Nuevo componente para la vista en lista
    const ServiceListRow = ({ service }) => (
        <div className="grid grid-cols-10 gap-4 items-center bg-card border-b border-border py-3 px-2 hover:bg-muted/50 transition-colors">
            {/* Nombre y Descripción */}
            <div className="col-span-3">
                <h3 className="font-medium text-foreground">{service?.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{service?.description}</p>
            </div>
            
            {/* Categoría */}
            <span className="col-span-2 text-sm text-muted-foreground">{service?.category}</span>

            {/* Especialista */}
            <span className="col-span-1 text-sm text-foreground">{service?.specialist}</span>

            {/* Duración */}
            <span className="col-span-1 text-sm text-muted-foreground">⏱️ {service?.duration} min</span>

            {/* Precio */}
            <span className="col-span-1 text-sm font-medium text-foreground">Bs. {service?.price?.toLocaleString()}</span>

            {/* Estado / Requisito */}
            <div className="col-span-1 flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${service?.isActive ? 'bg-green-500' : 'bg-gray-400'}`} title={service?.isActive ? 'Activo' : 'Inactivo'} />
                {service?.requiresOrder && (
                    <span className="text-xs text-blue-500" title="Requiere Orden Médica">
                        <Icon name="FileText" size={14} />
                    </span>
                )}
            </div>
            
            {/* Acciones */}
            <div className="col-span-1 flex justify-end space-x-1">
                <Button variant="outline" size="icon-sm" title="Editar">
                    <Icon name="Edit2" size={14} />
                </Button>
                <Button variant="outline" size="icon-sm" title="Agenda">
                    <Icon name="Calendar" size={14} />
                </Button>
            </div>
        </div>
    );
    // Fin del nuevo componente de lista

    const AppointmentCard = ({ appointment }) => (
        // ... (Tu componente AppointmentCard original, sin cambios) ...
        <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{appointment?.serviceName}</h3>
                    <p className="text-sm text-muted-foreground">{appointment?.patientName} • {appointment?.patientId}</p>
                </div>
                {getStatusBadge(appointment?.status)}
            </div>
            
            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hora:</span>
                    <span className="text-foreground font-medium">{appointment?.time}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Especialista:</span>
                    <span className="text-foreground">{appointment?.specialist}</span>
                </div>
                {appointment?.notes && (
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Notas:</span>
                        <span className="text-foreground">{appointment?.notes}</span>
                    </div>
                )}
            </div>

            <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                    <Icon name="CheckCircle" size={14} className="mr-2" />
                    Marcar Completada
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                    <Icon name="Upload" size={14} className="mr-2" />
                    Subir Resultado
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
                    <h1 className="text-2xl font-bold text-foreground">Servicios y Agenda</h1>
                    <p className="text-muted-foreground">
                        Gestiona tus servicios médicos y citas programadas
                    </p>
                </div>
                
                <div className="flex space-x-3">
                    <Button variant="outline">
                        <Icon name="Upload" size={16} className="mr-2" />
                        Subir Resultados
                    </Button>
                    <Button variant="default">
                        <Icon name="Plus" size={16} className="mr-2" />
                        Nuevo Servicio
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
                <Button
                    variant={activeTab === 'services' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('services')}
                >
                    <Icon name="Activity" size={16} className="mr-2" />
                    Servicios ({services?.length})
                </Button>
                <Button
                    variant={activeTab === 'appointments' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('appointments')}
                >
                    <Icon name="Calendar" size={16} className="mr-2" />
                    Agenda ({appointments?.length})
                </Button>
            </div>

            {/* Services Tab */}
            {activeTab === 'services' && (
                <>
                    {/* Statistics Cards (Sin cambios) */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {/* ... (Estadísticas originales) ... */}
                        <div className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Servicios</p>
                                    <p className="text-2xl font-bold text-foreground">{services?.length}</p>
                                </div>
                                <Icon name="Activity" size={24} className="text-blue-500" />
                            </div>
                        </div>
                        
                        <div className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Servicios Activos</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {services?.filter(s => s?.isActive)?.length}
                                    </p>
                                </div>
                                <Icon name="CheckCircle" size={24} className="text-green-500" />
                            </div>
                        </div>
                        
                        <div className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Con Orden Médica</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {services?.filter(s => s?.requiresOrder)?.length}
                                    </p>
                                </div>
                                <Icon name="FileText" size={24} className="text-orange-500" />
                            </div>
                        </div>
                        
                        <div className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Precio Promedio</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        Bs. {Math.round(services?.reduce((sum, s) => sum + s?.price, 0) / services?.length)?.toLocaleString()}
                                    </p>
                                </div>
                                <Icon name="DollarSign" size={24} className="text-purple-500" />
                            </div>
                        </div>
                    </div>

                    {/* 🆕 CONTROL DE VISTA */}
                    <div className="flex justify-end mb-4">
                        <div className="flex space-x-1 bg-muted p-1 rounded-md">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                size="icon-sm"
                                onClick={() => setViewMode('grid')}
                                title="Vista de Tarjetas"
                            >
                                <Icon name="Grid" size={16} />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                size="icon-sm"
                                onClick={() => setViewMode('list')}
                                title="Vista Enlistada"
                            >
                                <Icon name="List" size={16} />
                            </Button>
                        </div>
                    </div>

                    {/* RENDERIZADO CONDICIONAL DE SERVICIOS */}
                    {viewMode === 'grid' ? (
                        /* Vista de Tarjetas (Original) */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services?.map(service => (
                                <ServiceCard key={service?.id} service={service} />
                            ))}
                        </div>
                    ) : (
                        /* 🆕 Vista Enlistada */
                        <div className="border border-border rounded-lg divide-y divide-border">
                            {/* Encabezado de la lista */}
                            <div className="grid grid-cols-10 gap-4 items-center bg-muted/70 py-3 px-2 font-semibold text-xs text-muted-foreground uppercase rounded-t-lg">
                                <span className="col-span-3">Servicio</span>
                                <span className="col-span-2">Categoría</span>
                                <span className="col-span-1">Especialista</span>
                                <span className="col-span-1">Duración</span>
                                <span className="col-span-1">Precio</span>
                                <span className="col-span-1">Estado</span>
                                <span className="col-span-1 text-right">Acciones</span>
                            </div>
                            {/* Filas de servicios */}
                            {services?.map(service => (
                                <ServiceListRow key={service?.id} service={service} />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Appointments Tab (Sin cambios) */}
            {activeTab === 'appointments' && (
                <>
                    {/* Date Filter */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <label className="text-sm font-medium text-foreground">Fecha:</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e?.target?.value)}
                                className="px-3 py-2 rounded-md border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        
                        <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                                <Icon name="Calendar" size={16} className="mr-2" />
                                Ver Calendario
                            </Button>
                            <Button variant="outline" size="sm">
                                <Icon name="Filter" size={16} className="mr-2" />
                                Filtros
                            </Button>
                        </div>
                    </div>

                    {/* Appointments Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {/* ... (Estadísticas de citas originales) ... */}
                        <div className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Citas Hoy</p>
                                    <p className="text-2xl font-bold text-foreground">{appointments?.length}</p>
                                </div>
                                <Icon name="Calendar" size={24} className="text-blue-500" />
                            </div>
                        </div>
                        
                        <div className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Confirmadas</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {appointments?.filter(a => a?.status === 'confirmed')?.length}
                                    </p>
                                </div>
                                <Icon name="CheckCircle" size={24} className="text-green-500" />
                            </div>
                        </div>
                        
                        <div className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Pendientes</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {appointments?.filter(a => a?.status === 'pending')?.length}
                                    </p>
                                </div>
                                <Icon name="Clock" size={24} className="text-yellow-500" />
                            </div>
                        </div>
                        
                        <div className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Completadas</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {appointments?.filter(a => a?.status === 'completed')?.length}
                                    </p>
                                </div>
                                <Icon name="CheckCircle2" size={24} className="text-blue-500" />
                            </div>
                        </div>
                    </div>

                    {/* Appointments Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {appointments?.map(appointment => (
                            <AppointmentCard key={appointment?.id} appointment={appointment} />
                        ))}
                    </div>

                    {appointments?.length === 0 && (
                        <div className="text-center py-12">
                            <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
                            <p className="text-lg font-medium text-foreground mb-2">No hay citas programadas</p>
                            <p className="text-muted-foreground">para la fecha seleccionada</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProviderServices;