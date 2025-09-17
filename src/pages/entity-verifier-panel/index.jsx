import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, FileText, CheckCircle, XCircle, Clock, User, AlertTriangle } from 'lucide-react';
import VerificationQueue from './components/VerificationQueue';
import VerificationDetail from './components/VerificationDetail';
import VerificationFilters from './components/VerificationFilters';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ProfessionalSheet from './components/ProfessionalSheet';
import Icon from '../../components/AppIcon';


// Mock data for medical professionals verification
const getMockVerificationApplications = () => {
  const professionals = [
    {
      id: "VER-001",
      cedula: "V-18234567",
      fullName: "Dr. Carlos Pérez",
      profession: "Médico Cirujano",
      specialty: "Medicina Interna",
      collegialNumber: "CMV-10234",
      mppsRegistry: "MPPS-451230",
      sanitaryLicense: "LS-VE-MI-2024-001",
      college: "Colegio de Médicos de Distrito Capital",
      state: "Distrito Capital",
      municipality: "Libertador",
      email: "c.perez@example.com",
      phone: "+58 412-1234567",
      submissionDate: "2024-12-01",
      status: "pending",
      priority: "high",
      licenseExpiry: "2026-09-01",
      documents: [
        { type: "cedula", status: "verified", uploadedAt: "2024-12-01" },
        { type: "title", status: "verified", uploadedAt: "2024-12-01" },
        { type: "mpps", status: "pending", uploadedAt: "2024-12-01" },
        { type: "license", status: "verified", uploadedAt: "2024-12-01" }
      ],
      verificationHistory: [
        { date: "2024-12-01", action: "Application submitted", user: "System" },
        { date: "2024-12-02", action: "Initial review", user: "Ana Rodríguez" }
      ]
    },
    {
      id: "VER-002",
      cedula: "V-20456789",
      fullName: "Dra. Ana González",
      profession: "Médico Cirujano",
      specialty: "Pediatría",
      collegialNumber: "CMV-10421",
      mppsRegistry: "MPPS-451231",
      sanitaryLicense: "LS-VE-PED-2024-003",
      college: "Colegio de Médicos de Miranda",
      state: "Miranda",
      municipality: "Chacao",
      email: "ana.gonzalez@example.com",
      phone: "+58 424-9876543",
      submissionDate: "2024-11-28",
      status: "pending",
      priority: "normal",
      licenseExpiry: "2025-11-15",
      documents: [
        { type: "cedula", status: "verified", uploadedAt: "2024-11-28" },
        { type: "title", status: "verified", uploadedAt: "2024-11-28" },
        { type: "mpps", status: "verified", uploadedAt: "2024-11-28" },
        { type: "license", status: "pending", uploadedAt: "2024-11-28" }
      ],
      verificationHistory: [
        { date: "2024-11-28", action: "Application submitted", user: "System" },
        { date: "2024-11-29", action: "Documents reviewed", user: "Carlos López" }
      ]
    },
    {
      id: "VER-003",
      cedula: "V-21567890",
      fullName: "Dr. Luis Rodríguez",
      profession: "Médico Cirujano",
      specialty: "Traumatología",
      collegialNumber: "CMV-11056",
      mppsRegistry: "MPPS-451232",
      sanitaryLicense: "LS-VE-TRM-2023-014",
      college: "Colegio de Médicos de Aragua",
      state: "Aragua",
      municipality: "Girardot",
      email: "l.rodriguez@example.com",
      phone: "+58 416-2244668",
      submissionDate: "2024-11-25",
      status: "approved",
      priority: "normal",
      licenseExpiry: "2024-05-10",
      documents: [
        { type: "cedula", status: "verified", uploadedAt: "2024-11-25" },
        { type: "title", status: "verified", uploadedAt: "2024-11-25" },
        { type: "mpps", status: "verified", uploadedAt: "2024-11-25" },
        { type: "license", status: "requires_renewal", uploadedAt: "2024-11-25" }
      ],
      verificationHistory: [
        { date: "2024-11-25", action: "Application submitted", user: "System" },
        { date: "2024-11-26", action: "Approved with conditions", user: "María García" },
        { date: "2024-11-27", action: "License renewal notice sent", user: "System" }
      ]
    },
    {
      id: "VER-004",
      cedula: "V-17345678",
      fullName: "Dra. María Fernández",
      profession: "Médico Cirujano",
      specialty: "Ginecología y Obstetricia",
      collegialNumber: "CMV-10098",
      mppsRegistry: "MPPS-451233",
      sanitaryLicense: "LS-VE-GYO-2022-022",
      college: "Colegio de Médicos de Carabobo",
      state: "Carabobo",
      municipality: "Valencia",
      email: "m.fernandez@example.com",
      phone: "+58 414-5566778",
      submissionDate: "2024-11-20",
      status: "rejected",
      priority: "low",
      licenseExpiry: "2025-02-20",
      documents: [
        { type: "cedula", status: "verified", uploadedAt: "2024-11-20" },
        { type: "title", status: "rejected", uploadedAt: "2024-11-20" },
        { type: "mpps", status: "pending", uploadedAt: "2024-11-20" },
        { type: "license", status: "verified", uploadedAt: "2024-11-20" }
      ],
      rejectionReason: "Título universitario no es legible, favor reenviar documento escaneado con mejor calidad",
      verificationHistory: [
        { date: "2024-11-20", action: "Application submitted", user: "System" },
        { date: "2024-11-21", action: "Document issues identified", user: "José Martínez" },
        { date: "2024-11-22", action: "Application rejected", user: "José Martínez" }
      ]
    }
  ];

  // Add more professionals with different statuses
  for (let i = 5; i <= 20; i++) {
    const statuses = ["pending", "approved", "rejected"];
    const priorities = ["low", "normal", "high"];
    const colleges = [
      "Colegio de Médicos de Zulia",
      "Colegio de Médicos de Lara", 
      "Colegio de Médicos de Táchira",
      "Colegio de Médicos de Bolívar"
    ];
    
    professionals?.push({
      id: `VER-${String(i)?.padStart(3, '0')}`,
      cedula: `V-${18000000 + i * 1000}`,
      fullName: `Dr(a). Profesional ${i}`,
      profession: "Médico Cirujano",
      specialty: ["Medicina Interna", "Pediatría", "Cardiología", "Neurología"]?.[i % 4],
      collegialNumber: `CMV-${10000 + i}`,
      mppsRegistry: `MPPS-${450000 + i}`,
      college: colleges?.[i % colleges?.length],
      submissionDate: `2024-${String(11 + (i % 2))?.padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1)?.padStart(2, '0')}`,
      status: statuses?.[i % 3],
      priority: priorities?.[i % 3],
      licenseExpiry: "2025-12-31",
      documents: [
        { type: "cedula", status: "verified" },
        { type: "title", status: i % 3 === 0 ? "pending" : "verified" },
        { type: "mpps", status: "verified" },
        { type: "license", status: "verified" }
      ]
    });
  }

  return professionals;
};

const EntityVerifierPanel = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    profession: 'all',
    dateRange: 'all',
    college: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('queue');
  const [showProfessionalSheet, setShowProfessionalSheet] = useState(false);

  // Load mock data
  useEffect(() => {
    const mockData = getMockVerificationApplications();
    setApplications(mockData);
    setFilteredApplications(mockData);
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...applications];

    // Search filter
    if (searchTerm) {
      filtered = filtered?.filter(app => 
        app?.fullName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        app?.cedula?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        app?.collegialNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        app?.specialty?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(app => app?.status === filters?.status);
    }

    // Priority filter
    if (filters?.priority !== 'all') {
      filtered = filtered?.filter(app => app?.priority === filters?.priority);
    }

    // Profession filter
    if (filters?.profession !== 'all') {
      filtered = filtered?.filter(app => app?.profession === filters?.profession);
    }

    // College filter
    if (filters?.college !== 'all') {
      filtered = filtered?.filter(app => app?.college === filters?.college);
    }

    // Date range filter
    if (filters?.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date(now);
      
      switch (filters?.dateRange) {
        case 'today':
          filterDate?.setHours(0, 0, 0, 0);
          filtered = filtered?.filter(app => new Date(app?.submissionDate) >= filterDate);
          break;
        case 'week':
          filterDate?.setDate(now?.getDate() - 7);
          filtered = filtered?.filter(app => new Date(app?.submissionDate) >= filterDate);
          break;
        case 'month':
          filterDate?.setMonth(now?.getMonth() - 1);
          filtered = filtered?.filter(app => new Date(app?.submissionDate) >= filterDate);
          break;
      }
    }

    setFilteredApplications(filtered);
  }, [applications, filters, searchTerm]);

  // Analytics data
  const analytics = useMemo(() => {
    const total = applications?.length;
    const pending = applications?.filter(app => app?.status === 'pending')?.length;
    const approved = applications?.filter(app => app?.status === 'approved')?.length;
    const rejected = applications?.filter(app => app?.status === 'rejected')?.length;
    const highPriority = applications?.filter(app => app?.priority === 'high')?.length;
    
    const avgProcessingTime = 2.5; // Mock average days
    const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

    return {
      total,
      pending,
      approved,
      rejected,
      highPriority,
      avgProcessingTime,
      approvalRate
    };
  }, [applications]);

  const handleApprove = (applicationId, notes = "") => {
    setApplications(prev => prev?.map(app => 
      app?.id === applicationId 
        ? { 
            ...app, 
            status: 'approved',
            approvedAt: new Date()?.toISOString(),
            approvedBy: 'Current User',
            approvalNotes: notes
          }
        : app
    ));
    
    // TODO: Replace with API call
    console.log(`Approved application ${applicationId} with notes: ${notes}`);
  };

  const handleReject = (applicationId, reason = "") => {
    setApplications(prev => prev?.map(app => 
      app?.id === applicationId 
        ? { 
            ...app, 
            status: 'rejected',
            rejectedAt: new Date()?.toISOString(),
            rejectedBy: 'Current User',
            rejectionReason: reason
          }
        : app
    ));
    
    // TODO: Replace with API call
    console.log(`Rejected application ${applicationId} with reason: ${reason}`);
  };

  const handleRequestInfo = (applicationId, message = "") => {
    setApplications(prev => prev?.map(app => 
      app?.id === applicationId 
        ? { 
            ...app, 
            status: 'requires_info',
            infoRequestedAt: new Date()?.toISOString(),
            infoRequestedBy: 'Current User',
            infoRequestMessage: message
          }
        : app
    ));
    
    // TODO: Replace with API call
    console.log(`Requested additional info for application ${applicationId}: ${message}`);
  };

  const downloadCollegeRoster = () => {
    // Create and download the demo CSV file
    const csvContent = `cedula,nombre,apellido,profesion,especialidad,nroColegiatura,registroMPPS,licenciaSanitaria,colegio,estado,municipio,telefono,email,fechaEmision,fechaVencimiento,estatus,observaciones
V-18234567,Carlos,Pérez,Médico Cirujano,Medicina Interna,CMV-10234,MPPS-451230,LS-VE-MI-2024-001,Colegio de Médicos de Distrito Capital,Distrito Capital,Libertador,+58 412-1234567,c.perez@example.com,2023-09-01,2026-09-01,ACTIVO,
V-20456789,Ana,González,Médico Cirujano,Pediatría,CMV-10421,MPPS-451231,LS-VE-PED-2024-003,Colegio de Médicos de Miranda,Miranda,Chacao,+58 424-9876543,ana.gonzalez@example.com,2022-11-15,2025-11-15,ACTIVO,
V-21567890,Luis,Rodríguez,Médico Cirujano,Traumatología,CMV-11056,MPPS-451232,LS-VE-TRM-2023-014,Colegio de Médicos de Aragua,Aragua,Girardot,+58 416-2244668,l.rodriguez@example.com,2021-05-10,2024-05-10,PRÓXIMO_A_VENCER,Licencia vence en 60 días
V-17345678,María,Fernández,Médico Cirujano,Ginecología y Obstetricia,CMV-10098,MPPS-451233,LS-VE-GYO-2022-022,Colegio de Médicos de Carabobo,Carabobo,Valencia,+58 414-5566778,m.fernandez@example.com,2022-02-20,2025-02-20,ACTIVO,
V-22678901,José,Martínez,Médico Cirujano,Cardiología,CMV-11540,MPPS-451234,LS-VE-CAR-2023-031,Colegio de Médicos de Zulia,Zulia,Maracaibo,+58 426-7788990,j.martinez@example.com,2023-06-01,2026-06-01,ACTIVO,
V-19654321,Patricia,Rivas,Médico Cirujano,Neumonología,CMV-10777,MPPS-451235,LS-VE-NEU-2023-041,Colegio de Médicos de Lara,Lara,Iribarren,+58 412-6677889,patricia.rivas@example.com,2021-09-12,2024-09-12,VENCIDO,Requiere renovación
V-23890123,Andrés,Gutiérrez,Médico Cirujano,Neurología,CMV-11802,MPPS-451236,LS-VE-NEURO-2024-011,Colegio de Médicos de Bolívar,Bolívar,Caroní,+58 424-3344556,andres.gutierrez@example.com,2024-01-05,2027-01-05,ACTIVO,
V-20987654,Verónica,Suárez,Médico Cirujano,Medicina Familiar,CMV-11220,MPPS-451237,LS-VE-MF-2022-055,Colegio de Médicos de Mérida,Mérida,Libertador,+58 416-9988776,veronica.suarez@example.com,2022-07-19,2025-07-19,ACTIVO,
V-18765432,Rafael,Castillo,Médico Cirujano,Anestesiología,CMV-10345,MPPS-451238,LS-VE-ANE-2021-066,Colegio de Médicos de Táchira,Táchira,San Cristóbal,+58 414-2211334,rafa.castillo@example.com,2021-03-30,2024-03-30,VENCIDO,Notificado para actualización
V-24567890,Daniela,Mendoza,Médico Cirujano,Oncología,CMV-11930,MPPS-451239,LS-VE-ONC-2024-025,Colegio de Médicos de Monagas,Monagas,Maturín,+58 426-5544332,daniela.mendoza@example.com,2023-12-01,2026-12-01,ACTIVO,
V-17890123,César,Romero,Médico Cirujano,Dermatología,CMV-10112,MPPS-451240,LS-VE-DER-2022-017,Colegio de Médicos de Nueva Esparta,Nueva Esparta,Maneiro,+58 412-8877665,cesar.romero@example.com,2022-04-14,2025-04-14,ACTIVO,
V-23456781,Paola,Quintero,Médico Cirujano,Otorrinolaringología,CMV-11770,MPPS-451241,LS-VE-ORL-2023-029,Colegio de Médicos de Falcón,Falcón,Carirubana,+58 424-1122334,paola.quintero@example.com,2023-03-21,2026-03-21,ACTIVO,
V-19876543,Julio,Salazar,Médico Cirujano,Nefrología,CMV-10888,MPPS-451242,LS-VE-NEF-2021-044,Colegio de Médicos de Barinas,Barinas,Barinas,+58 416-4433221,julio.salazar@example.com,2021-11-02,2024-11-02,PRÓXIMO_A_VENCER,Vence en 90 días
V-21345987,Lucía,Velásquez,Médico Cirujano,Endocrinología,CMV-11101,MPPS-451243,LS-VE-END-2022-052,Colegio de Médicos de Portuguesa,Portuguesa,Guanare,+58 414-6655443,luc.velasquez@example.com,2022-08-09,2025-08-09,ACTIVO,
V-20567891,Diego,Navarro,Médico Cirujano,Oftalmología,CMV-10990,MPPS-451244,LS-VE-OFT-2023-037,Colegio de Médicos de Anzoátegui,Anzoátegui,Lechería,+58 426-7788001,diego.navarro@example.com,2023-05-18,2026-05-18,ACTIVO,
V-19234567,Beatriz,Cárdenas,Médico Cirujano,Reumatología,CMV-10620,MPPS-451245,LS-VE-REU-2021-039,Colegio de Médicos de Sucre,Sucre,Sucre,+58 412-6007008,bea.cardenas@example.com,2021-12-10,2024-12-10,PRÓXIMO_A_VENCER,Vence en 120 días
V-22456780,Fernando,Blanco,Médico Cirujano,Medicina de Emergencias,CMV-11450,MPPS-451246,LS-VE-EMG-2022-060,Colegio de Médicos de Vargas,La Guaira,Vargas,+58 424-3332211,fernando.blanco@example.com,2022-10-05,2025-10-05,ACTIVO,
V-18901234,Sofía,Arrieta,Médico Cirujano,Infectología,CMV-10478,MPPS-451247,LS-VE-INF-2023-072,Colegio de Médicos de Trujillo,Trujillo,Valera,+58 416-2200112,sofia.arrieta@example.com,2023-02-12,2026-02-12,ACTIVO,
V-21654320,Tomás,Huertas,Médico Cirujano,Urología,CMV-11288,MPPS-451248,LS-VE-URO-2022-074,Colegio de Médicos de Apure,Apure,San Fernando,+58 414-9001122,tomas.huertas@example.com,2022-06-28,2025-06-28,ACTIVO,
V-23124567,Adriana,López,Médico Cirujano,Medicina Ocupacional,CMV-11605,MPPS-451249,LS-VE-MO-2023-083,Colegio de Médicos de Cojedes,Cojedes,San Carlos,+58 426-8899776,adriana.lopez@example.com,2023-07-07,2026-07-07,ACTIVO,
V-20765431,Ignacio,Peña,Médico Cirujano,Medicina Crítica,CMV-11010,MPPS-451250,LS-VE-UCI-2021-090,Colegio de Médicos de Guárico,Guárico,San Juan de los Morros,+58 412-3311445,ignacio.pena@example.com,2021-01-22,2024-01-22,VENCIDO,En revisión para reactivación`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link?.setAttribute('href', url);
    link?.setAttribute('download', 'college_roster_demo.csv');
    link.style.visibility = 'hidden';
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Pendiente' },
      approved: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Aprobado' },
      rejected: { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'Rechazado' },
      requires_info: { icon: AlertTriangle, color: 'bg-orange-100 text-orange-800', label: 'Requiere Info' }
    };
    
    const badge = badges?.[status] || badges?.pending;
    const Icon = badge?.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge?.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge?.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: 'bg-red-100 text-red-800',
      normal: 'bg-gray-100 text-gray-800',
      low: 'bg-blue-100 text-blue-800'
    };
    
    const labels = {
      high: 'Alta',
      normal: 'Normal',
      low: 'Baja'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badges?.[priority] || badges?.normal}`}>
        {labels?.[priority] || labels?.normal}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Panel de Verificación de Entidades
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Gestión y revisión de solicitudes de verificación profesional
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={downloadCollegeRoster}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar CSV Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Analytics Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnalyticsDashboard analytics={analytics} />
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setCurrentTab('queue')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentTab === 'queue' ?'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Cola de Verificación
                <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs font-medium">
                  {analytics?.pending}
                </span>
              </button>
              <button
                onClick={() => setCurrentTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentTab === 'analytics' ?'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Análisis y Métricas
              </button>
            </nav>
          </div>

          {currentTab === 'queue' && (
            <>
              {/* Search and Filters */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Search */}
                  <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre, cédula, colegiatura..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e?.target?.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Filters Component */}
                  <VerificationFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    applications={applications}
                  />
                </div>
              </div>

              {/* Results */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-600">
                    Mostrando {filteredApplications?.length} de {applications?.length} solicitudes
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Prioridad:</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      ● Alta ({applications?.filter(a => a?.priority === 'high')?.length})
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      ● Normal ({applications?.filter(a => a?.priority === 'normal')?.length})
                    </span>
                  </div>
                </div>

                {filteredApplications?.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No hay solicitudes
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No se encontraron solicitudes que coincidan con los filtros aplicados.
                    </p>
                  </div>
                ) : (
                  <VerificationQueue
                    applications={filteredApplications}
                    onSelectApplication={setSelectedApplication}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onRequestInfo={handleRequestInfo}
                    getStatusBadge={getStatusBadge}
                    getPriorityBadge={getPriorityBadge}
                  />
                )}
              </div>
            </>
          )}

          {currentTab === 'analytics' && (
            <div className="p-6">
              <AnalyticsDashboard analytics={analytics} detailed />
            </div>
          )}
        </div>
      </div>
      {/* Professional Detail Sheet */}
      {selectedApplication && (
        <VerificationDetail
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onRequestInfo={handleRequestInfo}
          getStatusBadge={getStatusBadge}
          getPriorityBadge={getPriorityBadge}
        />
      )}
      {/* Professional Sheet Modal */}
      {showProfessionalSheet && selectedApplication && (
        <ProfessionalSheet
          professional={selectedApplication}
          onClose={() => setShowProfessionalSheet(false)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default EntityVerifierPanel;