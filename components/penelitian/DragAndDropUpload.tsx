import React, { useState, useRef, useCallback } from 'react';
import { Upload, Check, AlertCircle, FileText, Eye, Download } from 'lucide-react';

interface DragAndDropUploadProps {
  file: File | null;
  existingFileName?: string;
  onFileSelect: (file: File | null) => void;
  acceptedTypes: string[];
  helperText: string;
  onPreview?: () => void;
  onDownload?: () => void;
}

export const DragAndDropUpload: React.FC<DragAndDropUploadProps> = ({ 
  file, 
  existingFileName, 
  onFileSelect, 
  acceptedTypes, 
  helperText,
  onPreview,
  onDownload
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(extension)) {
      setError(`Hanya file format ${acceptedTypes.join(', ')} yang diperbolehkan.`);
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError(`Ukuran file terlalu besar. Maksimal 10 MB.`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) onFileSelect(droppedFile);
    }
  }, [onFileSelect, acceptedTypes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) onFileSelect(selectedFile);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative w-full p-8 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group
          ${isDragging ? 'border-primary-600 bg-primary-600/10 scale-[1.01]' : 'border-slate-200 dark:border-white/10 hover:border-primary-500/50 bg-slate-50/50 dark:bg-white/[0.02]'}
          ${(file || existingFileName) ? 'border-primary-600 bg-primary-600/5' : ''}
          ${error ? 'border-red-500/50 bg-red-500/5' : ''}
        `}
      >
        <input type="file" ref={inputRef} accept={acceptedTypes.join(',')} onChange={handleChange} className="hidden" />
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 
          ${(file || existingFileName) ? 'bg-primary-600 text-white' : error ? 'bg-red-50 text-white' : 'bg-white dark:bg-neutral-800 text-slate-400'}
        `}>
          {(file || existingFileName) ? <Check className="w-7 h-7" /> : error ? <AlertCircle className="w-7 h-7" /> : <Upload className="w-7 h-7" />}
        </div>
        <div className="text-center px-4">
          {file ? (
            <p className="text-[15px] font-normal text-primary-600 truncate max-w-[250px]">{file.name}</p>
          ) : (
            <>
              <p className="text-[15px] font-normal text-slate-900 dark:text-white">
                {isDragging ? 'Lepaskan Berkas Di Sini' : 'Klik atau Seret Berkas ke Sini'}
              </p>
              <p className="text-[12px] text-slate-400 mt-1 font-medium">{helperText}</p>
            </>
          )}
        </div>
      </div>
      
      {existingFileName && !file && (
        <div className="flex items-center justify-between p-4 bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/20 rounded-2xl">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <FileText className="w-4 h-4 text-primary-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-normal text-slate-700 dark:text-neutral-200 truncate">{existingFileName}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Berkas Tersimpan</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => onPreview?.()} className="p-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-400 hover:text-primary-600 transition-all shadow-sm"><Eye className="w-4 h-4" /></button>
            <button type="button" onClick={() => onDownload?.()} className="p-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-400 hover:text-primary-600 transition-all shadow-sm"><Download className="w-4 h-4" /></button>
          </div>
        </div>
      )}
      {error && <div className="text-red-500 text-xs font-bold text-center px-4 py-2 bg-red-50 dark:bg-red-900/10 rounded-xl">{error}</div>}
    </div>
  );
};
