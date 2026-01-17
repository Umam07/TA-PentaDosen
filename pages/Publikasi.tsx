import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  FileUp, 
  FileDown, 
  Eye, 
  Download, 
  Pencil, 
  Trash2, 
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  X,
  AlertCircle,
  FileSpreadsheet,
  Upload,
  User,
  Info,
  Users,
  Check,
  FileText,
  Building2,
  Calendar as CalendarIcon,
  GraduationCap,
  CheckCircle2,
  ArrowLeft,
  Briefcase,
  Layers,
  AlertTriangle,
  FileSearch,
  Globe,
  BookOpen,
  Hash,
  AlignLeft
} from 'lucide-react';
import { useLayout } from '../components/layout/AppLayout';

interface PublicationItem {
  id: string;
  title: string;
  author: string; 
  coAuthors: string[];
  category: 'Publikasi Karya Ilmiah' | 'Publikasi Buku Ilmiah';
  type: 'Artikel' | 'Buku' | 'Majalah';
  publisher: string;
  pages: string;
  isbn: string;
  abstract?: string;
  year: string;
  status: 'Lengkap' | 'Sedang Berjalan';
  manuscriptFile?: File;
  manuscriptFileName?: string;
}

const MOCK_PUBLICATIONS: PublicationItem[] = [
  {
    id: '1',
    title: 'Deep Learning for Early Breast Cancer Detection: A Systematic Review',
    author: 'Dr. Jane Doe, M.T.',
    coAuthors: ['Prof. Ahmad Fauzi', 'Rafly Eryan'],
    category: 'Publikasi Karya Ilmiah',
    type: 'Artikel',
    publisher: 'International Journal of Medical Informatics (Q1)',
    pages: '12',
    isbn: '978-602-12-3456-7',
    year: '2025',
    status: 'Lengkap',
    manuscriptFileName: 'publication_q1_review.pdf'
  }
];

const MEMBER_SUGGESTIONS = [
  'Prof. Ahmad Fauzi',
  'Dr. Sarah Putri, S.T., M.Kom.',
  'Dr. Budi Santoso, S.Kom., M.M.',
  'Lisa Kurniawan, S.Ds., M.Sn.',
  'Dr. Linda Sari',
  'Hendra Wijaya',
  'Siti Aminah',
  'Rafly Eryan Azis',
  'Rafi Daniswara',
  "Muhammad Syafi'ul Umam"
];

/* --- ANIMATION CONFIGS --- */
const appleEase = [0.22, 1, 0.36, 1] as any;

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const modalVariants = {
  initial: { opacity: 0, scale: 0.96, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 12 }
};

const modalTransition = {
  duration: 0.35,
  ease: appleEase
};

const btnScaleDown = {
  whileTap: { scale: 0.96 },
  transition: { duration: 0.12, ease: "easeOut" as any }
};

/* --- HELPERS --- */

const getStatusStyles = (status: PublicationItem['status']) => {
  switch (status) {
    case 'Lengkap':
      return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30';
    case 'Sedang Berjalan':
      return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
    default:
      return 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-neutral-400 border-slate-100 dark:border-white/10';
  }
};

const formatISBN = (val: string) => {
  const digits = val.replace(/\D/g, '').substring(0, 13);
  let formatted = '';
  if (digits.length > 0) formatted += digits.substring(0, 3);
  if (digits.length > 3) formatted += '-' + digits.substring(3, 6);
  if (digits.length > 6) formatted += '-' + digits.substring(6, 8);
  if (digits.length > 8) formatted += '-' + digits.substring(8, 12);
  if (digits.length > 12) formatted += '-' + digits.substring(12, 13);
  return formatted;
};

/* --- COMPONENTS --- */

interface ActionButtonProps {
  icon: React.ReactNode;
  tooltip?: string;
  variant?: 'primary' | 'ghost' | 'danger';
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, tooltip, variant = 'primary', onClick }) => {
  const baseStyles = "w-10 h-10 md:w-9 md:h-9 flex items-center justify-center rounded-xl transition-all active:scale-90 group/btn relative";
  const variantStyles = {
    primary: "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-neutral-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 border border-slate-200 dark:border-white/10 shadow-sm",
    ghost: "text-slate-400 dark:text-neutral-600 hover:text-primary-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5",
    danger: "text-slate-400 dark:text-neutral-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
  };
  return (
    <button type="button" className={`${baseStyles} ${variantStyles[variant]}`} onClick={onClick}>
      {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-[18px] h-[18px]' })}
      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-all duration-300 whitespace-nowrap z-[100] shadow-xl border border-white/10 hidden md:block">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-slate-900 dark:border-t-white"></div>
        </div>
      )}
    </button>
  );
};

/* --- REUSABLE DRAG AND DROP --- */

interface DragAndDropUploadProps {
  file: File | null;
  existingFileName?: string;
  onFileSelect: (file: File | null) => void;
  acceptedTypes: string[];
  helperText: string;
  onPreview?: () => void;
  onDownload?: () => void;
}

const DragAndDropUpload: React.FC<DragAndDropUploadProps> = ({ 
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
      setError(`Format file tidak didukung. Gunakan ${acceptedTypes.join(' atau ')}.`);
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

export const Publikasi: React.FC = () => {
  const { setGlobalBlur, showToast } = useLayout();
  const [publicationList, setPublicationList] = useState<PublicationItem[]>(MOCK_PUBLICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('Semua Tipe');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [yearFilter, setYearFilter] = useState('Semua Tahun');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPubDetail, setSelectedPubDetail] = useState<PublicationItem | null>(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [pubToDelete, setPubToDelete] = useState<PublicationItem | null>(null);
  const [previewData, setPreviewData] = useState<{ name: string; url: string; type: string } | null>(null);
  const [selectedImportFile, setSelectedImportFile] = useState<File | null>(null);

  // Form States
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<PublicationItem['category'] | ''>('');
  const [formType, setFormType] = useState<PublicationItem['type'] | ''>('');
  const [formPublisher, setFormPublisher] = useState('');
  const [formPages, setFormPages] = useState('');
  const [formIsbn, setFormIsbn] = useState('');
  const [formAbstract, setFormAbstract] = useState('');
  const [formYear, setFormYear] = useState(new Date().getFullYear().toString());
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [authorSearch, setAuthorSearch] = useState('');
  const [isAuthorDropdownOpen, setIsAuthorDropdownOpen] = useState(false);
  
  // File States
  const [manuscriptFile, setManuscriptFile] = useState<File | null>(null);
  
  const authorContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (authorContainerRef.current && !authorContainerRef.current.contains(event.target as Node)) {
        setIsAuthorDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPublications = useMemo(() => {
    return publicationList.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.publisher.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'Semua Tipe' || item.type === typeFilter;
      const matchesStatus = statusFilter === 'Semua Status' || item.status === statusFilter;
      const matchesYear = yearFilter === 'Semua Tahun' || item.year === yearFilter;
      return matchesSearch && matchesType && matchesStatus && matchesYear;
    });
  }, [searchQuery, typeFilter, statusFilter, yearFilter, publicationList]);

  const paginatedPubs = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredPublications.slice(start, start + rowsPerPage);
  }, [filteredPublications, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredPublications.length / rowsPerPage);

  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('Semua Tipe');
    setStatusFilter('Semua Status');
    setYearFilter('Semua Tahun');
    setRowsPerPage(10);
    setCurrentPage(1);
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormTitle('');
    setFormCategory(''); 
    setFormType(''); 
    setFormPublisher('');
    setFormPages('');
    setFormIsbn('');
    setFormAbstract('');
    setFormYear(new Date().getFullYear().toString());
    setSelectedAuthors([]);
    setManuscriptFile(null);
    setIsAddModalOpen(true);
    setGlobalBlur(true);
  };

  const openEditModal = (item: PublicationItem) => {
    setIsEditMode(true);
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormType(item.type);
    setFormPublisher(item.publisher);
    setFormPages(item.pages);
    setFormIsbn(item.isbn);
    setFormAbstract(item.abstract || '');
    setFormYear(item.year);
    setSelectedAuthors(item.coAuthors);
    setManuscriptFile(null);
    setIsAddModalOpen(true);
    setGlobalBlur(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setGlobalBlur(false);
  };

  const handleAuthorAdd = (author: string) => {
    if (!selectedAuthors.includes(author)) {
      setSelectedAuthors([...selectedAuthors, author]);
    }
    setAuthorSearch('');
    setIsAuthorDropdownOpen(false);
  };

  const handleAuthorRemove = (author: string) => {
    setSelectedAuthors(selectedAuthors.filter(a => a !== author));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formCategory) {
      showToast('Mohon pilih kategori kegiatan.', 'error');
      return;
    }
    if (!formType) {
      showToast('Mohon pilih jenis publikasi.', 'error');
      return;
    }
    
    const hasAnyFile = manuscriptFile || (isEditMode && publicationList.find(p => p.id === editingId)?.manuscriptFileName);
    const finalStatus: 'Lengkap' | 'Sedang Berjalan' = hasAnyFile ? 'Lengkap' : 'Sedang Berjalan';
    
    if (formIsbn.replace(/\D/g, '').length !== 13) {
      showToast('ISBN harus tepat 13 digit.', 'error');
      return;
    }

    if (isEditMode && editingId) {
      setPublicationList(prev => prev.map(p => p.id === editingId ? {
        ...p,
        title: formTitle,
        category: formCategory as PublicationItem['category'],
        type: formType as PublicationItem['type'],
        publisher: formPublisher,
        pages: formPages,
        isbn: formIsbn,
        abstract: formAbstract,
        year: formYear,
        status: finalStatus,
        coAuthors: selectedAuthors,
        manuscriptFile: manuscriptFile || p.manuscriptFile,
        manuscriptFileName: manuscriptFile ? manuscriptFile.name : p.manuscriptFileName
      } : p));
      showToast('Publikasi diperbarui.', 'info');
    } else {
      const newItem: PublicationItem = {
        id: Math.random().toString(36).substring(7),
        title: formTitle,
        author: 'Dr. Jane Doe, M.T.', 
        coAuthors: selectedAuthors,
        category: formCategory as PublicationItem['category'],
        type: formType as PublicationItem['type'],
        publisher: formPublisher,
        pages: formPages,
        isbn: formIsbn,
        abstract: formAbstract,
        year: new Date().getFullYear().toString(),
        status: finalStatus,
        manuscriptFile: manuscriptFile || undefined,
        manuscriptFileName: manuscriptFile?.name
      };
      setPublicationList([newItem, ...publicationList]);
      showToast('Publikasi ditambahkan.', 'success');
    }
    closeAddModal();
  };

  const handleDelete = () => {
    if (pubToDelete) {
      setPublicationList(prev => prev.filter(p => p.id !== pubToDelete.id));
      showToast('Publikasi berhasil dihapus.', 'delete');
      setIsDeleteConfirmOpen(false);
      setPubToDelete(null);
      setGlobalBlur(false);
    }
  };

  const openPreview = (item: PublicationItem) => {
    const fileName = item.manuscriptFileName;
    const file = item.manuscriptFile;
    
    if (!fileName) return;

    const isPdf = fileName.toLowerCase().endsWith('.pdf');
    const previewUrl = file ? URL.createObjectURL(file) : '';
    setPreviewData({ name: fileName, url: previewUrl, type: isPdf ? 'pdf' : 'docx' });
    setGlobalBlur(true);
  };

  const handleDownloadFile = (item: PublicationItem) => {
    const fileName = item.manuscriptFileName;
    const file = item.manuscriptFile;
    
    if (!fileName) return;

    if (file) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(a.href);
    } else {
      const blob = new Blob(["Mock content"], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(a.href);
    }
    showToast(`Mengunduh ${fileName}`, 'info');
  };

  const handleTriggerFileUpload = (id: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.docx';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          showToast('File terlalu besar. Maksimal 10 MB.', 'error');
          return;
        }
        setPublicationList(prev => prev.map(p => {
          if (p.id === id) {
            return { ...p, manuscriptFile: file, manuscriptFileName: file.name, status: 'Lengkap' };
          }
          return p;
        }));
        showToast('Berkas berhasil diperbarui.', 'success');
      }
    };
    input.click();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <AnimatePresence>
        {previewData && (
          <PreviewModal 
            fileName={previewData.name} 
            fileUrl={previewData.url} 
            fileType={previewData.type} 
            onClose={() => {
              if (previewData.url) URL.revokeObjectURL(previewData.url);
              setPreviewData(null);
              setGlobalBlur(false);
            }} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedPubDetail ? (
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={modalTransition}
          >
            <PublicationDetailView 
              detail={selectedPubDetail}
              onBack={() => setSelectedPubDetail(null)}
              onPreview={() => openPreview(selectedPubDetail)}
              onDownload={() => handleDownloadFile(selectedPubDetail)}
              onUpload={() => handleTriggerFileUpload(selectedPubDetail.id)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="space-y-6 px-4 md:px-0">
              <div className="space-y-1.5">
                <h1 className="text-[20px] md:text-[24px] font-bold text-slate-900 dark:text-white tracking-tight">Publikasi</h1>
                <p className="text-[13px] md:text-[14px] text-slate-400 dark:text-neutral-500 font-medium tracking-tight">Kelola dan lacak publikasi akademik dosen.</p>
              </div>
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                <button onClick={openAddModal} className="h-[48px] px-8 bg-primary-600 text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-primary-700 transition-all active:scale-95"><Plus className="w-4 h-4" /> Tambah Publikasi</button>
                <button onClick={() => { setIsImportModalOpen(true); setGlobalBlur(true); }} className="h-[48px] px-6 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"><FileUp className="w-4 h-4" /> Import Excel</button>
                <button className="h-[48px] px-6 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"><FileDown className="w-4 h-4" /> Export Excel</button>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0D0D0D] border md:rounded-[2.5rem] shadow-sm flex flex-col overflow-hidden">
              <div className="px-6 md:px-10 py-6 md:py-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01]">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Cari Publikasi</label>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Cari judul..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-11 pl-11 pr-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-medium outline-none text-slate-900 dark:text-white" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Jenis</label>
                      <div className="relative">
                        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full h-11 appearance-none pl-4 pr-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-semibold outline-none cursor-pointer text-slate-700 dark:text-neutral-200"><option>Semua Tipe</option><option>Artikel</option><option>Buku</option><option>Majalah</option></select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Status</label>
                      <div className="relative">
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full h-11 appearance-none pl-4 pr-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-semibold outline-none cursor-pointer text-slate-700 dark:text-neutral-200"><option>Semua Status</option><option>Lengkap</option><option>Sedang Berjalan</option></select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Tahun</label>
                      <div className="relative">
                        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="w-full h-11 appearance-none pl-4 pr-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-semibold outline-none cursor-pointer text-slate-700 dark:text-neutral-200"><option>Semua Tahun</option><option>2024</option><option>2025</option><option>2026</option></select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <button onClick={handleResetFilters} className="h-11 px-6 bg-white dark:bg-white/5 text-slate-500 dark:text-neutral-400 font-bold rounded-xl border border-slate-200 dark:border-white/10 hover:text-primary-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"><RotateCcw className="w-4 h-4" /> Reset Filter</button>
                </div>
              </div>

              <div className="hidden md:block overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[1100px]">
                  <thead>
                    <tr className="bg-slate-50/30 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/10">
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Judul</th>
                      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Ketua Penulis</th>
                      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Penerbit</th>
                      <th className="px-4 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Tahun</th>
                      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Status</th>
                      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Berkas</th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {paginatedPubs.length > 0 ? paginatedPubs.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-6 max-w-xs"><p className="text-[14px] font-medium text-slate-900 dark:text-white leading-snug group-hover:text-primary-600 transition-colors">{item.title}</p></td>
                        <td className="px-6 py-6"><span className="text-[13px] font-bold text-slate-800 dark:text-neutral-200">{item.author}</span></td>
                        <td className="px-6 py-6"><span className="text-[13px] font-medium text-slate-600 dark:text-neutral-400">{item.publisher}</span></td>
                        <td className="px-4 py-6 text-[13px] font-medium text-slate-500 dark:text-neutral-400">{item.year}</td>
                        <td className="px-6 py-6 text-center"><span className={`inline-block px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap text-center leading-none ${getStatusStyles(item.status)}`}>{item.status}</span></td>
                        <td className="px-6 py-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {item.manuscriptFileName ? (
                              <><ActionButton icon={<Eye />} onClick={() => openPreview(item)} /><ActionButton icon={<Download />} onClick={() => handleDownloadFile(item)} /></>
                            ) : (
                              <ActionButton icon={<Upload />} onClick={() => handleTriggerFileUpload(item.id)} />
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6"><div className="flex items-center justify-end gap-2.5"><ActionButton icon={<Eye />} tooltip="Detail Publikasi" variant="ghost" onClick={() => setSelectedPubDetail(item)} /><ActionButton icon={<Pencil />} tooltip="Edit Data" variant="ghost" onClick={() => openEditModal(item)} /><ActionButton icon={<Trash2 />} tooltip="Hapus Data" variant="danger" onClick={() => { setPubToDelete(item); setIsDeleteConfirmOpen(true); setGlobalBlur(true); }} /></div></td>
                      </tr>
                    )) : <tr><td colSpan={8} className="py-20 text-center text-slate-400">Tidak ada data.</td></tr>}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-white/5">
                {paginatedPubs.length > 0 ? paginatedPubs.map((item) => (
                  <div key={item.id} className="p-6 space-y-5 bg-white dark:bg-transparent">
                    <h4 className="text-[16px] font-medium text-slate-900 dark:text-white leading-relaxed">{item.title}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ketua Penulis</p>
                        <p className="text-[13px] font-bold text-slate-700 dark:text-neutral-200">{item.author}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tahun</p>
                        <p className="text-[13px] font-bold text-slate-700 dark:text-neutral-200">{item.year}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipe & Publisher</p>
                      <p className="text-[13px] font-medium text-slate-600 dark:text-neutral-400">{item.type} • {item.publisher}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-block px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap text-center leading-none ${getStatusStyles(item.status)}`}>{item.status}</span>
                    </div>
                    <div className="pt-2">
                      <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mb-3 text-center">Berkas</p>
                        <div className="flex justify-center gap-2">
                          {item.manuscriptFileName ? (
                            <><ActionButton icon={<Eye />} onClick={() => openPreview(item)} /><ActionButton icon={<Download />} onClick={() => handleDownloadFile(item)} /></>
                          ) : (
                            <ActionButton icon={<Upload />} onClick={() => handleTriggerFileUpload(item.id)} />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                      <div className="flex gap-1.5">
                        <ActionButton icon={<Eye />} variant="ghost" onClick={() => setSelectedPubDetail(item)} />
                        <ActionButton icon={<Pencil />} variant="ghost" onClick={() => openEditModal(item)} />
                        <ActionButton icon={<Trash2 />} variant="danger" onClick={() => { setPubToDelete(item); setIsDeleteConfirmOpen(true); setGlobalBlur(true); }} />
                      </div>
                      <div className="text-[12px] font-black text-primary-600/50 uppercase tracking-widest tabular-nums">ID: {item.id}</div>
                    </div>
                  </div>
                )) : <div className="py-20 text-center text-slate-400 px-6">Tidak ada data hasil pencarian.</div>}
              </div>

              <div className="px-6 md:px-10 py-8 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-50/20 dark:bg-white/[0.01]">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-8 w-full md:w-auto">
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl shadow-sm hover:border-primary-500/50 transition-colors">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Baris:</span>
                    <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} className="bg-transparent text-[13px] font-bold text-slate-700 dark:text-neutral-200 outline-none cursor-pointer pr-1">
                      {[10, 25, 50, 100].map(val => <option key={val} value={val} className="bg-white dark:bg-neutral-900">{val}</option>)}
                    </select>
                  </div>
                  <p className="text-[13px] font-semibold text-slate-400">Menampilkan {paginatedPubs.length} dari {filteredPublications.length} publikasi</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto justify-center">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p-1))} 
                    disabled={currentPage === 1} 
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-primary-600 disabled:opacity-30 disabled:cursor-default active:scale-90 transition-all shadow-sm"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button key={i} onClick={() => setCurrentPage(i+1)} className={`w-10 h-10 flex items-center justify-center rounded-xl text-[13px] font-bold transition-all ${currentPage === i+1 ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>
                        {i+1}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} 
                    disabled={currentPage === totalPages} 
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-primary-600 disabled:opacity-30 disabled:cursor-default active:scale-90 transition-all shadow-sm"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center">
            <motion.div 
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0 bg-black/45 dark:bg-black/80 backdrop-blur-md" 
              onClick={closeAddModal}
            />
            <motion.div 
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={modalTransition}
              className="relative bg-white dark:bg-[#0A0A0A] w-full max-w-5xl h-full md:h-auto md:max-h-[95vh] rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-white/5 flex flex-col"
            >
              <div className="px-8 py-6 md:px-12 md:py-8 flex justify-between items-center border-b border-slate-50 dark:border-white/5">
                <div className="flex items-center gap-4"><div className="w-12 h-12 bg-primary-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-xl">{isEditMode ? <Pencil className="w-6 h-6" /> : <Plus className="w-6 h-6" />}</div><div><h3 className="text-[20px] md:text-[24px] font-black text-slate-900 dark:text-white tracking-tight">{isEditMode ? 'Edit Publikasi' : 'Tambah Publikasi Baru'}</h3><p className="text-[12px] text-slate-400 mt-1">Daftarkan karya ilmiah atau buku akademik Anda.</p></div></div>
                <button type="button" onClick={closeAddModal} className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-slate-900"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-8 md:px-12 py-10 custom-scrollbar space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center"><FileText className="w-4 h-4" /></div><h4 className="text-[16px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Detail Publikasi</h4></div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Judul Publikasi <span className="text-red-500">*</span>
                      </label>
                      <textarea required value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Masukkan judul lengkap..." className="w-full px-6 py-4 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl outline-none focus:border-primary-600/30 border border-transparent dark:text-white min-h-[100px] text-[15px] font-normal" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                          Kategori Kegiatan <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select required value={formCategory} onChange={e => setFormCategory(e.target.value as any)} className={`w-full h-[52px] appearance-none px-5 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl outline-none border border-transparent dark:text-white text-[14px] font-normal ${!formCategory ? 'text-slate-400 dark:text-neutral-500' : ''}`}>
                            <option value="" disabled>Pilih kategori kegiatan</option>
                            <option value="Publikasi Karya Ilmiah">Publikasi Karya Ilmiah</option>
                            <option value="Publikasi Buku Ilmiah">Publikasi Buku Ilmiah</option>
                          </select>
                          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                          Jenis Publikasi <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select required value={formType} onChange={e => setFormType(e.target.value as any)} className={`w-full h-[52px] appearance-none px-5 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl outline-none border border-transparent dark:text-white text-[14px] font-normal ${!formType ? 'text-slate-400 dark:text-neutral-500' : ''}`}>
                            <option value="" disabled>Pilih jenis publikasi</option>
                            <option value="Artikel">Artikel</option>
                            <option value="Buku">Buku</option>
                            <option value="Majalah">Majalah</option>
                          </select>
                          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    {isEditMode && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Tahun <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select value={formYear} onChange={e => setFormYear(e.target.value)} className="w-full h-[52px] appearance-none px-5 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl outline-none border border-transparent dark:text-white text-[14px] font-normal">
                              <option>2023</option>
                              <option>2024</option>
                              <option>2025</option>
                              <option>2026</option>
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4" ref={authorContainerRef}>
                  <div className="flex items-center gap-3 mb-2"><div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center"><Users className="w-4 h-4" /></div><h4 className="text-[16px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Penulis</h4></div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Anggota Penulis <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className={`h-[52px] w-full bg-slate-50 dark:bg-neutral-800/50 border rounded-2xl flex items-center transition-all ${isAuthorDropdownOpen ? 'border-primary-600/30 ring-4 ring-primary-500/5' : 'border-transparent'}`}>
                          <Users className="w-5 h-5 ml-5 text-slate-400" />
                          <input type="text" placeholder="Cari penulis..." value={authorSearch} onChange={(e) => { setAuthorSearch(e.target.value); setIsAuthorDropdownOpen(true); }} onFocus={() => setIsAuthorDropdownOpen(true)} className="flex-1 bg-transparent outline-none px-4 text-[14px] font-normal dark:text-white h-full" />
                        </div>
                        {isAuthorDropdownOpen && (
                          <div className="absolute z-[110] top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-neutral-900 border border-slate-100 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden">
                            <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                              {MEMBER_SUGGESTIONS.filter(m => m.toLowerCase().includes(authorSearch.toLowerCase()) && !selectedAuthors.includes(m)).map(author => (
                                <button key={author} type="button" onClick={() => handleAuthorAdd(author)} className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center justify-between group">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400 flex items-center justify-center font-black text-[10px]">{author[0]}</div>
                                    <span className="text-[13px] font-normal text-slate-700 dark:text-neutral-200 group-hover:bg-slate-50/10 transition-colors">{author}</span>
                                  </div>
                                  <Plus className="w-4 h-4 text-slate-300 group-hover:text-primary-600" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      <div className="h-10 px-4 bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/20 rounded-xl flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary-600 text-[10px] font-black text-white flex items-center justify-center shadow-sm">JD</div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold text-primary-700 dark:text-primary-300">Dr. Jane Doe, M.T.</span>
                          <span className="px-2 py-0.5 bg-primary-600/10 text-primary-600 dark:text-primary-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-primary-600/10 whitespace-nowrap">Ketua Penulis</span>
                        </div>
                      </div>
                      {selectedAuthors.map(author => (
                        <div key={author} className="h-10 px-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition-all group/chip">
                          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-neutral-800 text-primary-600 flex items-center justify-center font-black text-[9px]">{author[0]}</div>
                          <span className="text-[13px] font-semibold text-slate-700 dark:text-neutral-200">{author}</span>
                          <button type="button" onClick={() => handleAuthorRemove(author)} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-md transition-all"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] font-bold text-primary-600/70 ml-1">Anggota yang ditambahkan akan otomatis menjadi penulis pendamping.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center"><Globe className="w-4 h-4" /></div><h4 className="text-[16px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Info Publikasi</h4></div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Penerbit <span className="text-red-500">*</span>
                      </label>
                      <input required value={formPublisher} onChange={e => setFormPublisher(e.target.value)} placeholder="Nama Publisher / Jurnal / Konferensi" className="w-full h-[52px] px-6 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl outline-none border border-transparent dark:text-white text-[15px] font-normal" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                          Jumlah Halaman <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-stretch bg-slate-50 dark:bg-neutral-800/50 rounded-2xl overflow-hidden border border-transparent focus-within:border-primary-600/30 transition-all">
                          <input required type="text" inputMode="numeric" value={formPages} onChange={e => setFormPages(e.target.value.replace(/\D/g, ''))} placeholder="0" className="flex-1 h-[52px] bg-transparent pl-5 pr-3 outline-none dark:text-white font-normal text-sm" />
                          <div className="flex items-center px-4 bg-slate-100/50 dark:bg-white/5 border-l border-slate-200 dark:border-white/10"><span className="text-slate-400 dark:text-neutral-500 text-[11px] font-bold uppercase tracking-wider">Hlm</span></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                          Nomor ISBN <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input required type="text" value={formIsbn} onChange={e => setFormIsbn(formatISBN(e.target.value))} placeholder="978-602-xx-xxxx-x" className={`w-full h-[52px] pl-12 pr-5 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl outline-none border transition-all dark:text-white font-normal ${formIsbn && formIsbn.replace(/\D/g, '').length !== 13 ? 'border-red-500/50' : 'border-transparent'}`} />
                        </div>
                        {formIsbn && formIsbn.replace(/\D/g, '').length !== 13 && <p className="text-[10px] font-bold text-red-500 ml-1">Harus 13 digit.</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center"><AlignLeft className="w-4 h-4" /></div><h4 className="text-[16px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Deskripsi / Abstrak</h4></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Abstrak (Opsional)</label><textarea value={formAbstract} onChange={e => setFormAbstract(e.target.value)} placeholder="Tuliskan ringkasan publikasi..." className="w-full px-6 py-4 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl outline-none focus:border-primary-600/30 border border-transparent dark:text-white min-h-[150px] text-[14px] font-normal" /></div>
                </div>

                <div className="space-y-12">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center"><Layers className="w-4 h-4" /></div><h4 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Manuskrip Utama</h4></div>
                    <DragAndDropUpload 
                      file={manuscriptFile} 
                      existingFileName={isEditMode ? publicationList.find(p => p.id === editingId)?.manuscriptFileName : undefined}
                      onFileSelect={setManuscriptFile} 
                      acceptedTypes={['.pdf', '.docx']} 
                      helperText="PDF atau DOCX (Max 10MB)" 
                    />
                  </div>
                </div>

                <div className="pt-8 flex gap-4">
                  <button type="button" onClick={closeAddModal} className="flex-1 h-[56px] border border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-colors">
                    Batal
                  </button>
                  <motion.button 
                    {...btnScaleDown}
                    type="submit" 
                    className="flex-[2] h-[56px] bg-primary-600 text-white font-black rounded-2xl shadow-xl shadow-primary-600/20 transition-all hover:bg-primary-700"
                  >
                    Simpan Publikasi
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0 bg-black/45 backdrop-blur-sm" 
              onClick={() => { setIsDeleteConfirmOpen(false); setGlobalBlur(false); }} 
            />
            <motion.div 
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={modalTransition}
              className="relative bg-white dark:bg-[#0D0D0D] w-full max-w-[400px] rounded-[2rem] shadow-2xl p-10 text-center border border-slate-100 dark:border-white/10"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-[20px] font-black text-slate-900 dark:text-white mb-2 tracking-tight">Hapus Publikasi?</h3>
              <div className="space-y-4 mb-10">
                <p className="text-slate-500 dark:text-neutral-500 text-[14px] leading-relaxed">
                  Publikasi yang dihapus tidak dapat dikembalikan.
                </p>
                {pubToDelete && (
                  <p className="text-[12px] font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-widest line-clamp-2 px-4">
                    {pubToDelete.title}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <motion.button 
                  {...btnScaleDown}
                  onClick={handleDelete} 
                  className="w-full h-[52px] bg-red-500 text-white font-black rounded-2xl shadow-xl shadow-red-500/20 transition-all hover:bg-red-600"
                >
                  Hapus Publikasi
                </motion.button>
                <button 
                  onClick={() => { setIsDeleteConfirmOpen(false); setGlobalBlur(false); }} 
                  className="w-full h-[52px] bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-neutral-400 font-bold rounded-2xl transition-all hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isImportModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0 bg-black/45 dark:bg-black/80 backdrop-blur-md" 
              onClick={() => { setIsImportModalOpen(false); setGlobalBlur(false); setSelectedImportFile(null); }}
            />
            <motion.div 
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={modalTransition}
              className="relative bg-white dark:bg-[#0A0A0A] w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-white/5 flex flex-col max-h-[90vh]"
            >
              <div className="px-8 py-6 flex justify-between items-center border-b border-slate-50 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.01]">
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-primary-600/10 text-primary-600 rounded-xl flex items-center justify-center"><FileUp className="w-5 h-5" /></div><h3 className="text-[18px] md:text-[20px] font-black text-slate-900 dark:text-white tracking-tight">Import Excel</h3></div>
                <button type="button" onClick={() => { setIsImportModalOpen(false); setGlobalBlur(false); setSelectedImportFile(null); }} className="p-2 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-400 hover:text-slate-900"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar space-y-8">
                <div className="p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 rounded-2xl flex gap-4">
                  <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-[13px] font-black text-amber-800 uppercase tracking-widest">Penting:</p>
                    <p className="text-[14px] font-medium text-amber-700/80 dark:text-amber-300">
                      Silakan gunakan templat yang telah disediakan untuk memastikan kesesuaian format dan keakuratan data sebelum melakukan proses impor berkas Excel.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Persiapan</label>
                  <button type="button" className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-white/5 border border-slate-100 rounded-2xl group transition-all hover:bg-slate-100 dark:hover:bg-white/10 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-500/10 text-green-600 rounded-xl flex items-center justify-center"><FileSpreadsheet className="w-5 h-5" /></div>
                      <div className="text-left"><p className="text-[14px] font-bold text-slate-900 dark:text-white">Unduh Template</p></div>
                    </div>
                    <Download className="w-5 h-5 text-slate-300 group-hover:text-green-600 transition-colors" />
                  </button>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pilih Berkas</label>
                  <DragAndDropUpload file={selectedImportFile} onFileSelect={setSelectedImportFile} acceptedTypes={['.xlsx', '.xls', '.csv']} helperText="Format: XLSX, XLS, CSV" />
                </div>
              </div>
              <div className="px-8 py-8 border-t border-slate-50 dark:border-white/5 flex gap-4">
                <button type="button" onClick={() => { setIsImportModalOpen(false); setGlobalBlur(false); setSelectedImportFile(null); }} className="flex-1 h-[52px] bg-white dark:bg-white/5 border border-slate-200 text-slate-600 dark:text-neutral-400 font-bold rounded-2xl transition-all">Batal</button>
                <motion.button 
                  {...btnScaleDown}
                  disabled={!selectedImportFile} 
                  onClick={() => { setIsImportModalOpen(false); setGlobalBlur(false); setSelectedImportFile(null); showToast("Data berhasil diimport.", "success"); }} 
                  className="flex-[2] h-[52px] bg-primary-600 text-white font-black rounded-2xl shadow-xl disabled:opacity-50 transition-all hover:bg-primary-700"
                >
                  Mulai Import
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* --- DETAIL VIEW SUBCOMPONENT --- */

interface PublicationDetailViewProps {
  detail: PublicationItem;
  onBack: () => void;
  onPreview: () => void;
  onDownload: () => void;
  onUpload: () => void;
}

const PublicationDetailView: React.FC<PublicationDetailViewProps> = ({ detail, onBack, onPreview, onDownload, onUpload }) => {
  return (
    <div className="space-y-10">
      <div className="space-y-6 px-4 md:px-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1">
              <span>Publikasi</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-primary-600">Detail Publikasi</span>
            </div>
            <h1 className="text-[24px] md:text-[28px] font-black text-slate-900 dark:text-white tracking-tight">Detail Publikasi</h1>
          </div>
          <button 
            onClick={onBack} 
            className="w-fit h-[48px] px-6 bg-white dark:bg-white/5 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 md:px-0">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info Card */}
          <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Rincian Informasi Publikasi</h3>
                <p className="text-[12px] text-slate-400 font-medium mt-0.5">Informasi bibliografi lengkap dari karya ilmiah.</p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest block mb-2.5">Judul Publikasi</label>
                <p className="text-[18px] md:text-[20px] font-bold text-slate-900 dark:text-white leading-snug">{detail.title}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <DetailField label="Kategori" value={detail.category} />
                <DetailField label="Jenis" value={detail.type} icon={detail.type === 'Buku' ? <BookOpen className="w-4 h-4" /> : detail.type === 'Artikel' ? <Globe className="w-4 h-4" /> : <FileText className="w-4 h-4" />} />
                <DetailField label="Publisher / Konferensi" value={detail.publisher} />
                <DetailField label="Jumlah Halaman" value={detail.pages} />
                <DetailField label="ISBN" value={detail.isbn} />
                <DetailField label="Tahun" value={detail.year} />
                <DetailField label="Status" value={detail.status} badgeStyles={getStatusStyles(detail.status)} />
              </div>

              {detail.abstract && (
                <div>
                  <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest block mb-2.5">Deskripsi / Abstrak</label>
                  <p className="text-[14px] text-slate-600 dark:text-neutral-400 leading-relaxed font-medium bg-slate-50 dark:bg-white/[0.02] p-5 rounded-2xl border border-slate-100 dark:border-white/5 italic">"{detail.abstract}"</p>
                </div>
              )}

              <div className="pt-4">
                <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest block mb-4">Penulis (Authors)</label>
                <div className="flex flex-wrap gap-2.5">
                  <div className="h-10 px-4 bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/20 rounded-xl flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary-600 text-[10px] font-black text-white flex items-center justify-center shadow-sm">
                      {detail.author[0]}
                    </div>
                    <span className="text-[13px] font-bold text-primary-700 dark:text-primary-300">{detail.author} (Ketua)</span>
                  </div>
                  {detail.coAuthors.map((member, idx) => (
                    <div key={idx} className="h-10 px-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white dark:bg-neutral-800 text-[10px] font-black text-primary-600 flex items-center justify-center shadow-sm">
                        {member[0]}
                      </div>
                      <span className="text-[13px] font-bold text-slate-700 dark:text-neutral-200">{member}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Document Section */}
          <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Berkas Publikasi</h3>
                <p className="text-[12px] text-slate-400 font-medium mt-0.5">Kelola manuskrip atau berkas pendukung publikasi.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DocActionCard 
                title="Manuskrip Utama" 
                isUploaded={!!detail.manuscriptFileName} 
                tooltipPrefix="Manuskrip" 
                onUpload={onUpload} 
                onPreview={onPreview} 
                onDownload={onDownload} 
              />
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm space-y-8 sticky top-10">
            <div className="flex items-center gap-3 border-b border-slate-50 dark:border-white/5 pb-6">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <h4 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Ketua Penulis</h4>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col items-center py-4">
                <div className="w-20 h-20 bg-primary-600 text-white rounded-[2rem] flex items-center justify-center text-2xl font-black shadow-xl shadow-primary-500/20 mb-4">
                  JD
                </div>
                <h5 className="text-[18px] font-black text-slate-900 dark:text-white text-center leading-tight">
                  {detail.author}
                </h5>
                <p className="text-[12px] font-bold text-primary-600 uppercase tracking-widest mt-2">Dosen Tetap</p>
              </div>
              <div className="space-y-5 pt-4">
                <SidebarField label="Universitas" value="Universitas YARSI" icon={<Building2 className="w-3.5 h-3.5" />} />
                <SidebarField label="Fakultas" value="Teknologi Informasi" icon={<Briefcase className="w-3.5 h-3.5" />} />
                <SidebarField label="Program Studi" value="Teknik Informatika" icon={<GraduationCap className="w-3.5 h-3.5" />} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- SUBCOMPONENTS --- */

const PreviewModal: React.FC<{ fileName: string; fileUrl: string; fileType: string; onClose: () => void }> = ({ fileName, fileUrl, fileType, onClose }) => {
  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      <motion.div 
        variants={backdropVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="absolute inset-0 bg-black/45 dark:bg-black/80 backdrop-blur-xl" 
        onClick={onClose} 
      />
      <motion.div 
        variants={modalVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={modalTransition}
        className="relative bg-white dark:bg-[#0D0D0D] w-full md:w-[92vw] md:max-w-6xl h-full md:h-[90vh] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/10"
      >
        <div className="px-6 py-4 md:px-10 md:py-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center shrink-0 bg-white/80 dark:bg-black/60 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4"><div className="w-11 h-11 bg-primary-600/10 text-primary-600 rounded-xl flex items-center justify-center shrink-0"><FileSearch className="w-5 h-5" /></div><div className="min-w-0"><h3 className="text-[16px] md:text-[19px] font-black text-slate-900 dark:text-white leading-tight truncate">{fileName}</h3><p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-0.5">Quick Look Preview</p></div></div>
          <button onClick={onClose} className="w-11 h-11 flex items-center justify-center bg-slate-100 dark:bg-white/10 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all active:scale-90"><X className="w-6 h-6" /></button>
        </div>
        <div className="flex-1 overflow-hidden bg-slate-50 dark:bg-black relative">
          {fileUrl && fileType === 'pdf' ? (
            <div className="w-full h-full p-2 md:p-6 lg:p-8"><div className="w-full h-full rounded-2xl overflow-hidden bg-white shadow-2xl border border-black/5"><iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=1`} className="w-full h-full border-none" title="PDF Preview" /></div></div>
          ) : (
            <div className="w-full h-full flex items-center justify-center p-6"><div className="max-w-md w-full bg-white dark:bg-neutral-900/60 p-10 md:p-16 rounded-[3rem] text-center shadow-2xl border border-slate-100 dark:border-white/5 space-y-10 backdrop-blur-md"><div className="w-24 h-24 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner relative group"><FileText className="w-12 h-12 relative z-10" /></div><div className="space-y-4"><h4 className="text-[22px] md:text-[26px] font-black text-slate-900 dark:text-white tracking-tight leading-tight">Pratinjau tidak tersedia</h4><p className="text-[15px] md:text-[17px] text-slate-500 dark:text-neutral-400 leading-relaxed font-medium">Format file ini saat ini tidak didukung for pratinjau langsung. Silakan unduh berkas for melihat konten.</p></div></div></div>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

const DetailField: React.FC<{ label: string; value: string; icon?: React.ReactNode; badgeStyles?: string }> = ({ label, value, icon, badgeStyles }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest block">{label}</label>
    {badgeStyles ? (
      <span className={`inline-block px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider ${badgeStyles}`}>{value}</span>
    ) : (
      <div className="flex items-center gap-2">
        {icon && <span className="text-primary-600">{icon}</span>}
        <p className="text-[15px] font-bold text-slate-700 dark:text-neutral-200">{value}</p>
      </div>
    )}
  </div>
);

const SidebarField: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="flex items-start gap-4 p-3.5 bg-slate-50/50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-2xl">
    <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/5 flex items-center justify-center text-slate-400 shrink-0 shadow-sm border border-slate-100 dark:border-white/5">{icon}</div>
    <div className="min-w-0"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p><p className="text-[13px] font-bold text-slate-700 dark:text-neutral-200 truncate">{value}</p></div>
  </div>
);

const DocActionCard: React.FC<{ title: string; isUploaded: boolean; tooltipPrefix: string; onUpload?: () => void; onPreview?: () => void; onDownload?: () => void }> = ({ title, isUploaded, tooltipPrefix, onUpload, onPreview, onDownload }) => (
  <div className="p-6 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-[2rem] space-y-5 group/card transition-all hover:border-primary-500/20">
    <div className="flex items-center justify-between">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${isUploaded ? 'bg-primary-600 text-white' : 'bg-white dark:bg-neutral-800 text-slate-300'}`}>
        <FileText className="w-5 h-5" />
      </div>
      {isUploaded && (
        <div className="px-2.5 py-1 bg-green-50 dark:bg-green-900/20 rounded-md">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
        </div>
      )}
    </div>
    <div>
      <h5 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-wider">{title}</h5>
      <p className="text-[11px] font-medium text-slate-400 mt-1">{isUploaded ? 'Dokumen tersedia' : 'Belum diunggah'}</p>
    </div>
    <div className="flex items-center gap-2 pt-2">
      {isUploaded ? (
        <>
          <ActionButton icon={<Eye />} tooltip={`Pratinjau ${tooltipPrefix}`} onClick={onPreview} />
          <ActionButton icon={<Download />} tooltip={`Unduh ${tooltipPrefix}`} onClick={onDownload} />
        </>
      ) : (
        <button type="button" onClick={onUpload} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-primary-600 transition-all border border-slate-200 dark:border-white/10">
          <Upload className="w-[18px] h-[18px]" />
        </button>
      )}
    </div>
  </div>
);
