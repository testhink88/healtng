import React from 'react';
import Icon from '@/components/AppIcon';

const ParaclinicalUploader = ({ files = [], onChange, onPreview }) => {
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      id: `file-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      type: file.type,
      preview: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString()
    }));
    onChange([...files, ...newFiles]);
  };

  const removeFile = (id) => {
    onChange(files.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-100 rounded-2xl p-8 text-center group hover:border-[#0E39B1] hover:bg-blue-50/30 transition-all relative">
        <input 
          type="file" 
          multiple 
          accept="image/*,.pdf"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 group-hover:text-[#0E39B1] transition-colors">
            <Icon name="UploadCloud" size={24} />
          </div>
          <p className="text-sm font-normal text-gray-500">Arrastre paraclínicos o haga clic aquí</p>
          <p className="text-[10px] text-gray-400 uppercase font-normal tracking-widest">PDF, JPG o PNG aceptados</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div 
                className="flex items-center gap-3 overflow-hidden cursor-pointer flex-1"
                onClick={() => onPreview && onPreview(file)}
              >
                <div className="p-2 bg-gray-50 rounded-lg text-[#0E39B1]">
                   <Icon name={file.type?.includes('pdf') ? 'FileText' : 'Image'} size={20} />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-gray-800 truncate hover:text-[#0E39B1] transition-colors">{file.name}</p>
                  <p className="text-[9px] text-gray-400 font-normal uppercase">{file.size}</p>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
              >
                <Icon name="Trash2" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParaclinicalUploader;