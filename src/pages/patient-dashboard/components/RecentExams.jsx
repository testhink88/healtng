import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentExams = ({ className = '' }) => {
  const [exams] = useState([
    {
      id: 1,
      name: 'Hemograma Completo',
      date: '2025-08-15',
      doctor: 'Dr. Ana Rodríguez',
      status: 'completed',
      results: 'Valores normales',
      category: 'Hematología',
      urgent: false,
      downloadUrl: '/reports/hemograma-150825.pdf'
    },
    {
      id: 2,
      name: 'Electrocardiograma',
      date: '2025-08-10',
      doctor: 'Dr. Carlos Mendoza',
      status: 'completed',
      results: 'Ritmo sinusal normal',
      category: 'Cardiología',
      urgent: false,
      downloadUrl: '/reports/ecg-100825.pdf'
    },
    {
      id: 3,
      name: 'Perfil Lipídico',
      date: '2025-08-08',
      doctor: 'Dr. Ana Rodríguez',
      status: 'pending',
      results: 'Pendiente de resultados',
      category: 'Bioquímica',
      urgent: false,
      downloadUrl: null
    },
    {
      id: 4,
      name: 'Radiografía de Tórax',
      date: '2025-08-05',
      doctor: 'Dr. Luis Martínez',
      status: 'completed',
      results: 'Sin alteraciones significativas',
      category: 'Radiología',
      urgent: false,
      downloadUrl: '/reports/rx-torax-050825.pdf'
    }
  ]);

  const [expandedExam, setExpandedExam] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'urgent': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'pending': return 'Pendiente';
      case 'urgent': return 'Urgente';
      default: return 'Desconocido';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Hematología': return 'Droplet';
      case 'Cardiología': return 'Heart';
      case 'Bioquímica': return 'TestTube';
      case 'Radiología': return 'Scan';
      default: return 'FileText';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Hematología': return 'var(--color-error)';
      case 'Cardiología': return 'var(--color-primary)';
      case 'Bioquímica': return 'var(--color-success)';
      case 'Radiología': return 'var(--color-secondary)';
      default: return 'var(--color-muted-foreground)';
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date?.toLocaleDateString('es-VE', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleDownload = (exam) => {
    if (exam?.downloadUrl) {
      // Mock download
      alert(`Descargando ${exam?.name}...`);
    }
  };

  const handleViewDetails = (examId) => {
    window.location.href = `/medical-history?exam=${examId}`;
  };

  const toggleExpanded = (examId) => {
    setExpandedExam(expandedExam === examId ? null : examId);
  };

  return (
    <div className={`bg-card rounded-2xl border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Exámenes Recientes</h2>
        <Button
          variant="ghost"
          onClick={() => window.location.href = '/medical-history?tab=exams'}
          className="text-sm text-primary hover:text-primary/80 font-medium"
        >
          Ver historial completo
        </Button>
      </div>
      <div className="space-y-4">
        {exams?.map((exam) => (
          <div
            key={exam?.id}
            className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors duration-150"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Icon 
                    name={getCategoryIcon(exam?.category)} 
                    size={18} 
                    color={getCategoryColor(exam?.category)}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">
                      {exam?.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam?.status)}`}>
                      {getStatusText(exam?.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{formatDate(exam?.date)}</span>
                    <span>•</span>
                    <span>{exam?.doctor}</span>
                    <span>•</span>
                    <span>{exam?.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {exam?.downloadUrl && exam?.status === 'completed' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(exam)}
                    className="min-w-touch min-h-touch"
                    title="Descargar resultado"
                  >
                    <Icon name="Download" size={16} />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleExpanded(exam?.id)}
                  className="min-w-touch min-h-touch"
                >
                  <Icon 
                    name={expandedExam === exam?.id ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                  />
                </Button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedExam === exam?.id && (
              <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Resultados</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {exam?.results}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Detalles</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><span className="font-medium">Fecha:</span> {formatDate(exam?.date)}</p>
                      <p><span className="font-medium">Médico:</span> {exam?.doctor}</p>
                      <p><span className="font-medium">Categoría:</span> {exam?.category}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(exam?.id)}
                    className="flex items-center space-x-2"
                  >
                    <Icon name="Eye" size={14} />
                    <span>Ver detalles</span>
                  </Button>
                  
                  {exam?.downloadUrl && exam?.status === 'completed' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleDownload(exam)}
                      className="flex items-center space-x-2"
                    >
                      <Icon name="Download" size={14} />
                      <span>Descargar</span>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {exams?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="FileText" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="font-semibold text-foreground mb-2">No hay exámenes recientes</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Tus próximos resultados de exámenes aparecerán aquí
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/appointment-booking'}
            className="flex items-center space-x-2"
          >
            <Icon name="Calendar" size={16} />
            <span>Agendar Examen</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecentExams;