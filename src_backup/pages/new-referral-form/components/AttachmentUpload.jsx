import React, { useState, useRef } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

const AttachmentUpload = ({ attachments = [], onAttachmentAdd, onAttachmentRemove }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const acceptedFileTypes = {
    'image/*': ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
    'application/pdf': ['pdf'],
    'application/msword': ['doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
    'text/plain': ['txt']
  };

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const maxFiles = 5;

  const getFileIcon = (fileName) => {
    const extension = fileName?.toLowerCase()?.split('.')?.pop();
    switch (extension) {
      case 'pdf': return 'FileText';
      case 'doc': case'docx': return 'FileText';
      case 'jpg': case'jpeg': case'png': case'gif': case'bmp': return 'Image';
      default: return 'File';
    }
  };

  const getFileTypeColor = (fileName) => {
    const extension = fileName?.toLowerCase()?.split('.')?.pop();
    switch (extension) {
      case 'pdf': return 'text-error';
      case 'doc': case'docx': return 'text-primary';
      case 'jpg': case'jpeg': case'png': case'gif': case'bmp': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const validateFile = (file) => {
    // Check file size
    if (file?.size > maxFileSize) {
      return `El archivo es demasiado grande. Máximo ${formatFileSize(maxFileSize)}`;
    }

    // Check file type
    const fileType = file?.type;
    const extension = file?.name?.toLowerCase()?.split('.')?.pop();
    const isValidType = Object.entries(acceptedFileTypes)?.some(([mimeType, extensions]) => {
      return fileType === mimeType || extensions?.includes(extension);
    });

    if (!isValidType) {
      return 'Tipo de archivo no permitido';
    }

    // Check maximum number of files
    if (attachments?.length >= maxFiles) {
      return `Máximo ${maxFiles} archivos permitidos`;
    }

    return null;
  };

  const handleFileUpload = async (files) => {
    if (!files?.length) return;

    setUploading(true);
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        alert(validationError);
        continue;
      }

      try {
        // Simulate file upload
        await new Promise(resolve => setTimeout(resolve, 1000));

        const attachment = {
          id: Date.now() + Math.random(),
          name: file?.name,
          size: file?.size,
          type: file?.type,
          url: URL.createObjectURL(file),
          uploadedAt: new Date()?.toISOString()
        };

        onAttachmentAdd?.(attachment);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert(`Error al subir ${file?.name}`);
      }
    }

    setUploading(false);
  };

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === 'dragenter' || e?.type === 'dragover') {
      setDragActive(true);
    } else if (e?.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFileUpload(e?.dataTransfer?.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFileUpload(e?.target?.files);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
          <Icon name="Paperclip" size={20} className="text-secondary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Archivos Médicos</h2>
          <p className="text-sm text-muted-foreground">
            Adjunte estudios, imágenes diagnósticas o documentos relevantes
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' :'border-border hover:border-border/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading || attachments?.length >= maxFiles}
        />

        <div className="space-y-4">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
            dragActive ? 'bg-primary/10' : 'bg-muted'
          }`}>
            <Icon 
              name={uploading ? "Loader2" : "Upload"} 
              size={24} 
              className={`${
                uploading ? 'animate-spin text-primary' : dragActive ?'text-primary' : 'text-muted-foreground'
              }`} 
            />
          </div>

          <div>
            <p className="text-lg font-medium text-foreground">
              {uploading ? 'Subiendo archivos...' : 'Arrastra archivos aquí o haz clic para seleccionar'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Máximo {maxFiles} archivos • {formatFileSize(maxFileSize)} por archivo
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Formatos soportados: JPG, PNG, PDF, DOC, DOCX, TXT
            </p>
          </div>

          {!uploading && attachments?.length < maxFiles && (
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef?.current?.click()}
              iconName="Plus"
              iconPosition="left"
            >
              Seleccionar Archivos
            </Button>
          )}
        </div>
      </div>

      {/* File List */}
      {attachments?.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-foreground">
            Archivos Adjuntos ({attachments?.length}/{maxFiles})
          </h3>
          
          <div className="space-y-2">
            {attachments?.map((attachment, index) => (
              <div
                key={attachment?.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-background rounded flex items-center justify-center flex-shrink-0">
                    <Icon 
                      name={getFileIcon(attachment?.name)} 
                      size={16} 
                      className={getFileTypeColor(attachment?.name)} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {attachment?.name}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(attachment?.size)}</span>
                      <span>•</span>
                      <span>
                        {new Date(attachment?.uploadedAt)?.toLocaleDateString('es-VE')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    iconName="Eye"
                    onClick={() => {
                      // Open file preview
                      if (attachment?.url) {
                        window.open(attachment?.url, '_blank');
                      }
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Ver
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    iconName="X"
                    onClick={() => onAttachmentRemove?.(index)}
                    className="text-error hover:text-error hover:bg-error/10"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="bg-info/5 border border-info/20 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-info mt-0.5 flex-shrink-0" />
          <div className="text-sm space-y-2">
            <p className="font-medium text-foreground">Recomendaciones para archivos:</p>
            <ul className="text-muted-foreground space-y-1 ml-2">
              <li>• Incluya estudios de laboratorio recientes</li>
              <li>• Adjunte imágenes diagnósticas relevantes</li>
              <li>• Proporcione informes de otros especialistas</li>
              <li>• Asegúrese de que los archivos sean legibles</li>
              <li>• Mantenga la confidencialidad del paciente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttachmentUpload;