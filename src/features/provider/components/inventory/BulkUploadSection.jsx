import React, { useState } from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

const BulkUploadSection = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);

    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFileUpload(e?.dataTransfer?.files?.[0]);
    }
  };

  const handleFileUpload = (file) => {
    if (!file) return;

    // Por ahora solo CSV para que coincida con el parser del modal
    const allowedTypes = [".csv"];
    const ext = "." + file?.name?.split(".").pop()?.toLowerCase();

    if (!allowedTypes.includes(ext)) {
      alert("Por ahora solo soportamos archivos CSV (.csv)");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulación de progreso visual
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onFileUpload?.(file);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  const downloadSampleCSV = () => {
    // Cabeceras pensadas para el parser del BulkUploadModal:
    // nombre / sku / categoria / subcategoria / stock / nivel_minimo / precio / precio_mayorista / moq / unidad
    const sampleData = [
      "nombre,sku,categoria,subcategoria,stock,nivel_minimo,precio,precio_mayorista,moq,unidad",
      "Paracetamol 500mg,PAR-500-001,Medicamentos,Analgésicos,1500,300,0.15,0.12,200,unidades",
      "Tensiómetro Digital,TEN-DIG-002,Equipos,Diagnóstico,25,10,39.9,35.0,5,unidades",
      "Guantes Nitrilo Talla M,GUA-NIT-M,Consumibles,Guantes,1200,400,0.12,0.10,500,unidades"
    ].join("\n");

    const blob = new Blob([sampleData], { type: "text/csv" });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla_productos_healtng.csv";
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    window.URL?.revokeObjectURL(url);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 clinical-shadow mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-1">
            Carga masiva de productos
          </h3>
          <p className="text-sm text-muted-foreground">
            Sube un archivo CSV con tu catálogo para agregar productos al inventario de Healtng.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={downloadSampleCSV}
        >
          <Icon name="Download" size={16} className="mr-2" />
          Descargar plantilla CSV
        </Button>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center healthcare-transition ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="space-y-4">
            <Icon name="Upload" size={32} className="text-primary mx-auto" />
            <div>
              <p className="text-sm font-medium text-card-foreground mb-2">
                Subiendo archivo... {uploadProgress}%
              </p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full healthcare-transition"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Icon name="Upload" size={32} className="text-muted-foreground mx-auto" />
            <div>
              <p className="text-sm font-medium text-card-foreground mb-1">
                Arrastra y suelta tu archivo aquí
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                o haz clic para seleccionar (solo CSV - máx. 10MB)
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => handleFileUpload(e?.target?.files?.[0])}
                className="hidden"
                id="file-upload-products"
              />
              <label htmlFor="file-upload-products">
                <Button variant="outline" asChild>
                  <span>Seleccionar archivo</span>
                </Button>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Icon name="FileText" size={12} />
          CSV
        </span>
        <span className="flex items-center gap-1">
          <Icon name="Shield" size={12} />
          Mapeo automático de columnas
        </span>
      </div>
    </div>
  );
};

export default BulkUploadSection;
