import React, { useState, useRef } from 'react';
import { Upload, Check } from 'lucide-react';

export const DragAndDropUpload: React.FC<{
  file: File | null;
  existingFileName?: string;
  onFileSelect: (file: File | null) => void;
  acceptedTypes?: string[];
  helperText?: string;
  onError?: (msg: string) => void;
}> = ({ file, existingFileName, onFileSelect, acceptedTypes = [".pdf"], helperText = "Hanya PDF (Max 10MB)", onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (selectedFile: File) => {
    const extension = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(extension)) {
      if (onError) onError("Hanya file format PDF yang diperbolehkan.");
      return false;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      if (onError) onError("Ukuran file terlalu besar. Maksimal 10 MB.");
      return false;
    }
    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (validateFile(selectedFile)) {
        onFileSelect(selectedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        onFileSelect(selectedFile);
      }
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative w-full p-10 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group
        ${isDragging ? 'border-primary-600 bg-primary-600/10 scale-[1.01]' : 'border-slate-200 dark:border-white/10 hover:border-primary-500/50 bg-slate-50/50 dark:bg-white/[0.02]'}
      `}
    >
      <input type="file" ref={inputRef} accept={acceptedTypes.join(',')} onChange={handleFileChange} className="hidden" />
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 ${(file || existingFileName) ? 'bg-primary-600 text-white' : 'bg-white dark:bg-neutral-800 text-slate-400'}`}>
        {(file || existingFileName) ? <Check className="w-7 h-7" /> : <Upload className="w-7 h-7" />}
      </div>
      <div className="text-center">
        <p className="text-[15px] font-normal text-slate-900 dark:text-white">
          {file ? file.name : existingFileName ? existingFileName : 'Klik atau Seret Berkas ke Sini'}
        </p>
        <p className="text-[12px] text-slate-400 mt-1 font-medium">{helperText}</p>
      </div>
    </div>
  );
};
