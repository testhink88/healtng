import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

const RecentExams = ({ className = '', examsData }) => {
  const exams = (examsData || [])
    .filter(item => item !== null && typeof item === 'object')
    .map(item => ({
      id: item.id,
      name: item.name || 'Estudio / Tratamiento',
      date: item.start_date || item.created_at,
      doctor: item.doctor?.full_name || 'Médico',
      status: item.status === 'completed' ? 'completed' : 'pending',
      results: item.instructions || 'Ver detalles del reporte',
      category: item.type || 'General',
      urgent: false,
      downloadUrl: item.metadata?.report_url || null
    }));

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
    return date?.toLocaleDateString('es-VE', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleDownload = (exam) => {
    if (exam?.downloadUrl) alert(`Descargando ${exam?.name}...`);
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
          onClick={() => (window.location.href = '/medical-history?tab=exams')}
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
            {/* Fila superior */}
            <div className="flex items-start gap-3">
              {/* Izquierda */}
              <div className="shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Icon
                  name={getCategoryIcon(exam?.category)}
                  size={18}
                  color={getCategoryColor(exam?.category)}
                />
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">{exam?.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam?.status)}`}>
                    {getStatusText(exam?.status)}
                  </span>
                </div>

                {/* Metadatos: grid en mobile, fila en >= sm */}
                <div className="text-xs sm:text-sm text-muted-foreground">
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 sm:flex sm:flex-wrap sm:items-center">
                    <span className="truncate">{formatDate(exam?.date)}</span>
                    <span className="hidden sm:inline">•</span>

                    <span className="truncate">{exam?.doctor}</span>
                    <span className="hidden sm:inline">•</span>

                    <span className="truncate">{exam?.category}</span>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="-mr-2 shrink-0 flex items-center gap-1 ml-1">
                {exam?.downloadUrl && exam?.status === 'completed' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(exam)}
                    className="w-9 h-9 p-0 sm:w-10 sm:h-10"
                    title="Descargar resultado"
                  >
                    <Icon name="Download" size={16} />
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleExpanded(exam?.id)}
                  className="w-9 h-9 p-0 sm:w-10 sm:h-10"
                  title="Mostrar detalles"
                >
                  <Icon
                    name={expandedExam === exam?.id ? 'ChevronUp' : 'ChevronDown'}
                    size={16}
                  />
                </Button>
              </div>
            </div>

            {/* Detalle expandido */}
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

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(exam?.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon name="Eye" size={14} />
                    <span>Ver detalles</span>
                  </Button>

                  {exam?.downloadUrl && exam?.status === 'completed' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleDownload(exam)}
                      className="flex items-center gap-2"
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
            onClick={() => (window.location.href = '/appointment-booking')}
            className="flex items-center gap-2"
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
