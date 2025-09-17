import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const ExportModal = ({ isOpen, onClose, onExport, selectedRecords = [] }) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [includeAttachments, setIncludeAttachments] = useState(true);
  const [includeSignatures, setIncludeSignatures] = useState(true);
  const [dateRange, setDateRange] = useState('all');
  const [selectedSections, setSelectedSections] = useState({
    diagnoses: true,
    treatments: true,
    tests: true,
    timeline: false
  });
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: 'pdf', label: 'PDF - Documento completo', description: 'Ideal para compartir con médicos' },
    { value: 'excel', label: 'Excel - Datos estructurados', description: 'Para análisis y seguimiento' },
    { value: 'summary', label: 'PDF - Resumen ejecutivo', description: 'Versión condensada' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'Todo el historial' },
    { value: 'last_year', label: 'Último año' },
    { value: 'last_6_months', label: 'Últimos 6 meses' },
    { value: 'last_3_months', label: 'Últimos 3 meses' },
    { value: 'custom', label: 'Rango personalizado' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    const exportConfig = {
      format: exportFormat,
      dateRange,
      sections: selectedSections,
      includeAttachments,
      includeSignatures,
      selectedRecords: selectedRecords?.length > 0 ? selectedRecords : null
    };

    try {
      await onExport?.(exportConfig);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSectionChange = (section, checked) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: checked
    }));
  };

  const getEstimatedSize = () => {
    let size = 0;
    if (selectedSections?.diagnoses) size += 2;
    if (selectedSections?.treatments) size += 3;
    if (selectedSections?.tests) size += 1.5;
    if (selectedSections?.timeline) size += 1;
    if (includeAttachments) size *= 2;
    return `~${Math.round(size)} MB`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Exportar Historial Médico</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedRecords?.length > 0 
                ? `${selectedRecords?.length} registros seleccionados`
                : 'Exportar historial completo'
              }
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="min-w-touch min-h-touch"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Format */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Formato de Exportación</h3>
            <div className="space-y-3">
              {formatOptions?.map((option) => (
                <div
                  key={option?.value}
                  onClick={() => setExportFormat(option?.value)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    exportFormat === option?.value
                      ? 'border-primary bg-primary/5' :'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 mt-0.5 ${
                      exportFormat === option?.value
                        ? 'border-primary bg-primary' :'border-muted-foreground'
                    }`}>
                      {exportFormat === option?.value && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{option?.label}</p>
                      <p className="text-sm text-muted-foreground">{option?.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <Select
              label="Período a Exportar"
              options={dateRangeOptions}
              value={dateRange}
              onChange={setDateRange}
              className="w-full"
            />
          </div>

          {/* Sections to Include */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Secciones a Incluir</h3>
            <div className="space-y-3">
              <Checkbox
                label="Diagnósticos"
                description="Todas las condiciones médicas diagnosticadas"
                checked={selectedSections?.diagnoses}
                onChange={(e) => handleSectionChange('diagnoses', e?.target?.checked)}
              />
              <Checkbox
                label="Tratamientos"
                description="Medicamentos, terapias y procedimientos"
                checked={selectedSections?.treatments}
                onChange={(e) => handleSectionChange('treatments', e?.target?.checked)}
              />
              <Checkbox
                label="Exámenes y Resultados"
                description="Laboratorios, imágenes y estudios"
                checked={selectedSections?.tests}
                onChange={(e) => handleSectionChange('tests', e?.target?.checked)}
              />
              <Checkbox
                label="Cronología Médica"
                description="Vista temporal de eventos médicos"
                checked={selectedSections?.timeline}
                onChange={(e) => handleSectionChange('timeline', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Additional Options */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Opciones Adicionales</h3>
            <div className="space-y-3">
              <Checkbox
                label="Incluir Documentos Adjuntos"
                description="Imágenes, PDFs y otros archivos relacionados"
                checked={includeAttachments}
                onChange={(e) => setIncludeAttachments(e?.target?.checked)}
              />
              <Checkbox
                label="Incluir Firmas Digitales"
                description="Certificaciones y validaciones médicas"
                checked={includeSignatures}
                onChange={(e) => setIncludeSignatures(e?.target?.checked)}
              />
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Resumen de Exportación</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Formato:</span>
                <span className="ml-2 font-medium text-foreground">
                  {formatOptions?.find(opt => opt?.value === exportFormat)?.label?.split(' - ')?.[0]}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Tamaño estimado:</span>
                <span className="ml-2 font-medium text-foreground">{getEstimatedSize()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Secciones:</span>
                <span className="ml-2 font-medium text-foreground">
                  {Object.values(selectedSections)?.filter(Boolean)?.length} de 4
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Período:</span>
                <span className="ml-2 font-medium text-foreground">
                  {dateRangeOptions?.find(opt => opt?.value === dateRange)?.label}
                </span>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="flex items-start space-x-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <Icon name="Shield" size={16} className="text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning mb-1">Aviso de Privacidad</p>
              <p className="text-muted-foreground">
                El archivo exportado contendrá información médica sensible. Manténgalo seguro y compártalo solo con profesionales de la salud autorizados.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancelar
          </Button>
          <Button
            variant="default"
            onClick={handleExport}
            loading={isExporting}
            disabled={!Object.values(selectedSections)?.some(Boolean)}
          >
            <Icon name="Download" size={16} className="mr-2" />
            {isExporting ? 'Exportando...' : 'Exportar Historial'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;