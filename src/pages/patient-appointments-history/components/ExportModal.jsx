import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';


const ExportModal = ({ isOpen, onClose, appointments, onExport }) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedData, setSelectedData] = useState('filtered');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const formatOptions = [
    { value: 'pdf', label: 'PDF - Documento completo' },
    { value: 'csv', label: 'CSV - Datos para Excel' },
    { value: 'json', label: 'JSON - Datos técnicos' }
  ];

  const dataOptions = [
    { value: 'filtered', label: `Citas filtradas (${appointments?.length})` },
    { value: 'all', label: 'Todas las citas' },
    { value: 'completed', label: 'Solo citas completadas' },
    { value: 'current-year', label: 'Citas del año actual' }
  ];

  const handleExport = async () => {
    setIsProcessing(true);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      let dataToExport = appointments;

      // Filter data based on selection
      switch (selectedData) {
        case 'completed':
          dataToExport = appointments?.filter(apt => apt?.status === 'completed');
          break;
        case 'current-year':
          const currentYear = new Date()?.getFullYear();
          dataToExport = appointments?.filter(apt => 
            new Date(apt.date)?.getFullYear() === currentYear
          );
          break;
        case 'all':
          // Would need to fetch all appointments from API
          break;
        default:
          dataToExport = appointments;
      }

      onExport(selectedFormat, dataToExport);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getFormatDescription = () => {
    switch (selectedFormat) {
      case 'pdf':
        return 'Genera un documento PDF con formato profesional, ideal para presentar a seguros médicos o para mantener un registro físico.';
      case 'csv':
        return 'Archivo CSV compatible con Excel y Google Sheets. Perfecto para análisis de datos y seguimiento de gastos médicos.';
      case 'json':
        return 'Formato JSON con todos los datos técnicos. Útil para desarrolladores o integración con otras aplicaciones.';
      default:
        return '';
    }
  };

  const getDataCount = () => {
    switch (selectedData) {
      case 'filtered':
        return appointments?.length;
      case 'completed':
        return appointments?.filter(apt => apt?.status === 'completed')?.length;
      case 'current-year':
        const currentYear = new Date()?.getFullYear();
        return appointments?.filter(apt => 
          new Date(apt.date)?.getFullYear() === currentYear
        )?.length;
      default:
        return appointments?.length;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Download" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Exportar historial
              </h2>
              <p className="text-sm text-muted-foreground">
                Descarga tus registros médicos
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isProcessing}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <Select
              label="Formato de exportación"
              options={formatOptions}
              value={selectedFormat}
              onChange={setSelectedFormat}
              disabled={isProcessing}
            />
            <p className="text-xs text-muted-foreground mt-2">
              {getFormatDescription()}
            </p>
          </div>

          {/* Data Selection */}
          <div>
            <Select
              label="Datos a exportar"
              options={dataOptions}
              value={selectedData}
              onChange={setSelectedData}
              disabled={isProcessing}
            />
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Icon name="Info" size={12} />
              Se exportarán {getDataCount()} citas médicas
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
            <div className="flex gap-3">
              <Icon name="Shield" size={16} className="text-warning flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-medium text-warning mb-1">Información confidencial</p>
                <p className="text-muted-foreground">
                  Este archivo contiene información médica confidencial. 
                  Manténlo seguro y no lo compartas públicamente.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            disabled={isProcessing || getDataCount() === 0}
            loading={isProcessing}
            iconName={isProcessing ? undefined : "Download"}
          >
            {isProcessing ? 'Exportando...' : 'Exportar'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;