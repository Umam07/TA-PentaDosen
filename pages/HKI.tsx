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
  GraduationCap,
  ArrowLeft,
  Briefcase,
  Layers,
  AlertTriangle,
  FileSearch,
  Hash,
  ShieldCheck,
  MapPin,
  Calendar as CalendarIcon,
  ShieldAlert,
  Clock,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { useLayout } from '../components/layout/AppLayout';

/* --- TYPES --- */

type JenisCiptaan = 
  | 'Hak Cipta (Umum)' 
  | 'Hak Cipta (Digital/PT)' 
  | 'Paten Biasa' 
  | 'Paten Sederhana' 
  | 'Merek' 
  | 'Desain Industri' 
  | 'DTLST' 
  | 'Rahasia Dagang';

interface HKIItem {
  id: string;
  title: string;
  jenisCiptaan: JenisCiptaan;
  nomorPermohonan: string;
  tempatDiumumkan: string;
  tanggalDiumumkan: string;
  nomorPencatatan: string;
  pencipta: string[];
  pemegang: string[];
  hkiFile?: File;
  hkiFileName?: string;
  year: string; 
}

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

/* --- CONSTANTS --- */

const JENIS_OPTIONS: JenisCiptaan[] = [
  'Hak Cipta (Umum)',
  'Hak Cipta (Digital/PT)',
  'Paten Biasa',
  'Paten Sederhana',
  'Merek',
  'Desain Industri',
  'DTLST',
  'Rahasia Dagang'
];

const PEOPLE_SUGGESTIONS = [
  'Prof. Ahmad Fauzi',
  'Dr. Sarah Putri, S.T., M.Kom.',
  'Dr. Budi Santoso, S.Kom., M.M.',
  'Lisa Kurniawan, S.Ds., M.Sn.',
  'Dr. Linda Sari',
  'Hendra Wijaya',
  'Siti Aminah',
  'Rafly Eryan Azis',
  'Rafi Daniswara',
  "Muhammad Syafi'ul Umam",
  'Universitas YARSI'
];

const MOCK_HKI: HKIItem[] = [
  {
    id: '1',
    title: 'Sistem Deteksi Dini Kanker Payudara Berbasis Deep Learning',
    jenisCiptaan: 'Hak Cipta (Digital/PT)',
    nomorPermohonan: 'P00202500123',
    tempatDiumumkan: 'Jakarta',
    tanggalDiumumkan: '2025-01-15',
    nomorPencatatan: '000123456',
    pencipta: ['Dr. Jane Doe, M.T.', 'Rafly Eryan'],
    pemegang: ['Universitas YARSI'],
    hkiFileName: 'manuskrip_hki_final.pdf',
    year: '2025'
  }
];

/* --- COMPONENTS --- */

const ActionButton: React.FC<{
  icon: React.ReactNode;
  tooltip?: string;
  variant?: 'primary' | 'ghost' | 'danger';
  onClick?: () => void;
}> = ({ icon, tooltip, variant = 'primary', onClick }) => {
  const baseStyles = "w-10 h-10 md:w-9 md:h-9 flex items-center justify-center rounded-xl transition-all active:scale-90 group/btn relative";
  const variantStyles = {
    primary: "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-neutral-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/30 border border-slate-200 dark:border-white/10 shadow-sm",
    ghost: "text-slate-400 dark:text-neutral-600 hover:text-primary-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5",
    danger: "text-slate-400 dark:text-neutral-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
  };
  return (
    <motion.button 
      {...btnScaleDown}
      type="button" 
      className={`${baseStyles} ${variantStyles[variant]}`} 
      onClick={onClick}
    >
      {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-[18px] h-[18px]' })}
      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-all duration-300 whitespace-nowrap z-[100] shadow-xl border border-white/10 hidden md:block">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-slate-900 dark:border-t-white"></div>
        </div>
      )}
    </motion.button>
  );
};

const DragAndDropUpload: React.FC<{
  file: File | null;
  existingFileName?: string;
  onFileSelect: (file: File | null) => void;
  acceptedTypes?: string[];
  helperText?: string;
}> = ({ file, existingFileName, onFileSelect, acceptedTypes = [".pdf", ".docx"], helperText = "Hanya PDF atau DOCX (Max 10MB)" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (e.dataTransfer.files?.[0]) onFileSelect(e.dataTransfer.files[0]);
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
      <input type="file" ref={inputRef} accept={acceptedTypes.join(',')} onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])} className="hidden" />
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

export const HKI: React.FC = () => {
  const { setGlobalBlur, showToast } = useLayout();
  const [hkiList, setHkiList] = useState<HKIItem[]>(MOCK_HKI);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('Semua Jenis');
  const [yearFilter, setYearFilter] = useState('Semua Tahun');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHkiDetail, setSelectedHkiDetail] = useState<HKIItem | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedImportFile, setSelectedImportFile] = useState<File | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [hkiToDelete, setHkiToDelete] = useState<HKIItem | null>(null);
  const [previewData, setPreviewData] = useState<{ name: string; url: string; type: string } | null>(null);

  /* --- FORM STATE --- */
  const [formTitle, setFormTitle] = useState('');
  const [formJenis, setFormJenis] = useState<JenisCiptaan | ''>('');
  const [formNomorPermohonan, setFormNomorPermohonan] = useState('');
  const [formTempatDiumumkan, setFormTempatDiumumkan] = useState('');
  const [formTanggalDiumumkan, setFormTanggalDiumumkan] = useState('');
  const [formNomorPencatatan, setFormNomorPencatatan] = useState('');
  const [selectedPencipta, setSelectedPencipta] = useState<string[]>([]);
  const [selectedPemegang, setSelectedPemegang] = useState<string[]>([]);
  const [hkiFile, setHkiFile] = useState<File | null>(null);

  /* --- UI STATE --- */
  const [penciptaSearch, setPenciptaSearch] = useState('');
  const [isPenciptaDropdownOpen, setIsPenciptaDropdownOpen] = useState(false);
  const [pemegangSearch, setPemegangSearch] = useState('');
  const [isPemegangDropdownOpen, setIsPemegangDropdownOpen] = useState(false);

  const penciptaRef = useRef<HTMLDivElement>(null);
  const pemegangRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (penciptaRef.current && !penciptaRef.current.contains(event.target as Node)) {
        setIsPenciptaDropdownOpen(false);
      }
      if (pemegangRef.current && !pemegangRef.current.contains(event.target as Node)) {
        setIsPemegangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredHKI = useMemo(() => {
    return hkiList.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.nomorPencatatan.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'Semua Jenis' || item.jenisCiptaan === typeFilter;
      const matchesYear = yearFilter === 'Semua Tahun' || item.year === yearFilter;
      return matchesSearch && matchesType && matchesYear;
    });
  }, [searchQuery, typeFilter, yearFilter, hkiList]);

  const paginatedHKI = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredHKI.slice(start, start + rowsPerPage);
  }, [filteredHKI, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredHKI.length / rowsPerPage));

  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('Semua Jenis');
    setYearFilter('Semua Tahun');
    setCurrentPage(1);
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormTitle('');
    setFormJenis('');
    setFormNomorPermohonan('');
    setFormTempatDiumumkan('');
    setFormTanggalDiumumkan('');
    setFormNomorPencatatan('');
    setSelectedPencipta([]);
    setSelectedPemegang([]);
    setHkiFile(null);
    setIsAddModalOpen(true);
    setGlobalBlur(true);
  };

  const openEditModal = (item: HKIItem) => {
    setIsEditMode(true);
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormJenis(item.jenisCiptaan);
    setFormNomorPermohonan(item.nomorPermohonan);
    setFormTempatDiumumkan(item.tempatDiumumkan);
    setFormTanggalDiumumkan(item.tanggalDiumumkan);
    setFormNomorPencatatan(item.nomorPencatatan);
    setSelectedPencipta(item.pencipta);
    setSelectedPemegang(item.pemegang);
    setHkiFile(null);
    setIsAddModalOpen(true);
    setGlobalBlur(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formJenis || !formTanggalDiumumkan) {
      showToast('Mohon lengkapi field wajib (*)', 'error');
      return;
    }

    const itemData: HKIItem = {
      id: isEditMode && editingId ? editingId : Math.random().toString(36).substring(7),
      title: formTitle,
      jenisCiptaan: formJenis as JenisCiptaan,
      nomorPermohonan: formNomorPermohonan,
      tempatDiumumkan: formTempatDiumumkan,
      tanggalDiumumkan: formTanggalDiumumkan,
      nomorPencatatan: formNomorPencatatan,
      pencipta: selectedPencipta,
      pemegang: selectedPemegang,
      hkiFile: hkiFile || undefined,
      hkiFileName: hkiFile ? hkiFile.name : (isEditMode ? hkiList.find(i => i.id === editingId)?.hkiFileName : undefined),
      year: new Date(formTanggalDiumumkan).getFullYear().toString()
    };

    if (isEditMode) {
      setHkiList(prev => prev.map(item => item.id === editingId ? itemData : item));
      showToast('Data HKI diperbarui', 'info');
    } else {
      setHkiList([itemData, ...hkiList]);
      showToast('Data HKI berhasil ditambahkan', 'success');
    }
    setIsAddModalOpen(false);
    setGlobalBlur(false);
  };

  const handleDelete = () => {
    if (hkiToDelete) {
      setHkiList(prev => prev.filter(item => item.id !== hkiToDelete.id));
      showToast('HKI berhasil dihapus.', 'delete');
      setIsDeleteConfirmOpen(false);
      setHkiToDelete(null);
      setGlobalBlur(false);
    }
  };

  const handleDownload = (item: HKIItem) => {
    const fileName = item.hkiFileName;
    const file = item.hkiFile;
    if (!fileName) return;

    if (file) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(a.href);
    } else {
      const blob = new Blob(["Demo HKI Document"], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(a.href);
    }
    showToast(`Mengunduh ${fileName}`, 'info');
  };

  const openPreview = (item: HKIItem) => {
    if (!item.hkiFileName) return;
    const isPdf = item.hkiFileName.toLowerCase().endsWith('.pdf');
    const url = item.hkiFile ? URL.createObjectURL(item.hkiFile) : '';
    setPreviewData({ name: item.hkiFileName, url, type: isPdf ? 'pdf' : 'docx' });
    setGlobalBlur(true);
  };

  const closePreview = () => {
    if (previewData?.url) URL.revokeObjectURL(previewData.url);
    setPreviewData(null);
    setGlobalBlur(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <AnimatePresence>
        {previewData && (
          <PreviewModal 
            fileName={previewData.name} 
            fileUrl={previewData.url} 
            fileType={previewData.type} 
            onClose={closePreview} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedHkiDetail ? (
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={modalTransition}
          >
            <HKIDetailView 
              detail={selectedHkiDetail} 
              onBack={() => setSelectedHkiDetail(null)} 
              onPreview={() => openPreview(selectedHkiDetail)}
              onDownload={() => handleDownload(selectedHkiDetail)}
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
                <h1 className="text-[20px] md:text-[24px] font-bold text-slate-900 dark:text-white tracking-tight">HKI</h1>
                <p className="text-[13px] md:text-[14px] text-slate-400 dark:text-neutral-500 font-medium tracking-tight">Kelola Hak Kekayaan Intelektual Anda, termasuk Hak Cipta dan Paten.</p>
              </div>
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                <motion.button {...btnScaleDown} onClick={openAddModal} className="h-[48px] px-8 bg-primary-600 text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-primary-700 transition-all"><Plus className="w-4 h-4" /> Tambah HKI</motion.button>
                <button onClick={() => { setIsImportModalOpen(true); setGlobalBlur(true); }} className="h-[48px] px-6 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"><FileUp className="w-4 h-4" /> Import Excel</button>
                <button className="h-[48px] px-6 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"><FileDown className="w-4 h-4" /> Export Excel</button>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0D0D0D] border md:rounded-[2.5rem] shadow-sm flex flex-col overflow-hidden mx-4 md:mx-0">
              <div className="px-6 md:px-10 py-6 md:py-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01]">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Cari HKI</label>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Cari judul atau nomor pencatatan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-11 pl-11 pr-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-medium outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 transition-all" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Jenis</label>
                      <div className="relative">
                        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full h-11 appearance-none pl-4 pr-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-semibold outline-none cursor-pointer text-slate-700 dark:text-neutral-200"><option>Semua Jenis</option>{JENIS_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}</select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Tahun</label>
                      <div className="relative">
                        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="w-full h-11 appearance-none pl-4 pr-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-semibold outline-none cursor-pointer text-slate-700 dark:text-neutral-200">
                          <option>Semua Tahun</option>
                          <option>2024</option>
                          <option>2025</option>
                          <option>2026</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <button onClick={handleResetFilters} className="h-11 px-6 bg-white dark:bg-white/5 text-slate-500 dark:text-neutral-400 font-bold rounded-xl border border-slate-200 dark:border-white/10 hover:text-primary-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm shrink-0"><RotateCcw className="w-4 h-4" /> Reset Filter</button>
                </div>
              </div>

              <div className="hidden md:block overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[1300px]">
                  <thead>
                    <tr className="bg-slate-50/30 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/10">
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Judul HKI</th>
                      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Pencipta Utama</th>
                      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Jenis Ciptaan</th>
                      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Nomor Pencatatan</th>
                      <th className="px-4 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Tahun</th>
                      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Berkas</th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {paginatedHKI.length > 0 ? paginatedHKI.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-6 max-sm"><p className="text-[14px] font-medium text-slate-900 dark:text-white leading-snug group-hover:text-primary-600 transition-colors">{item.title}</p></td>
                        <td className="px-6 py-6"><span className="text-[13px] font-bold text-slate-800 dark:text-neutral-200">{item.pencipta[0] || '-'}</span></td>
                        <td className="px-6 py-6"><span className="inline-block px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-wider rounded-lg border border-primary-100 dark:border-primary-900/30 whitespace-nowrap text-center leading-none">{item.jenisCiptaan}</span></td>
                        <td className="px-6 py-6 text-[13px] font-medium text-slate-600 dark:text-neutral-400 tabular-nums">{item.nomorPencatatan || '-'}</td>
                        <td className="px-4 py-6 text-[13px] font-medium text-slate-500 dark:text-neutral-400">{item.year}</td>
                        <td className="px-6 py-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {item.hkiFileName ? <><ActionButton icon={<Eye />} onClick={() => openPreview(item)} /><ActionButton icon={<Download />} onClick={() => handleDownload(item)} /></> : <span className="text-[11px] text-slate-300">-</span>}
                          </div>
                        </td>
                        <td className="px-8 py-6"><div className="flex items-center justify-end gap-2.5"><ActionButton icon={<Eye />} tooltip="Detail HKI" variant="ghost" onClick={() => setSelectedHkiDetail(item)} /><ActionButton icon={<Pencil />} tooltip="Edit Data" variant="ghost" onClick={() => openEditModal(item)} /><ActionButton icon={<Trash2 />} tooltip="Hapus Data" variant="danger" onClick={() => { setHkiToDelete(item); setIsDeleteConfirmOpen(true); setGlobalBlur(true); }} /></div></td>
                      </tr>
                    )) : <tr><td colSpan={8} className="py-20 text-center text-slate-400 font-medium">Tidak ada data HKI ditemukan.</td></tr>}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-white/5">
                {paginatedHKI.length > 0 ? paginatedHKI.map((item) => (
                  <div key={item.id} className="p-6 space-y-5 bg-white dark:bg-transparent">
                    <h4 className="text-[16px] font-medium text-slate-900 dark:text-white leading-relaxed">{item.title}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pencipta Pertama</p><p className="text-[13px] font-bold text-slate-700 dark:text-neutral-200">{item.pencipta[0] || '-'}</p></div>
                      <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tahun</p><p className="text-[13px] font-bold text-slate-700 dark:text-neutral-200">{item.year}</p></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-wider rounded-lg border border-primary-100 dark:border-primary-900/30 whitespace-nowrap text-center leading-none">{item.jenisCiptaan}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                      <div className="flex gap-1.5">
                        <ActionButton icon={<Eye />} variant="ghost" onClick={() => setSelectedHkiDetail(item)} />
                        <ActionButton icon={<Pencil />} variant="ghost" onClick={() => openEditModal(item)} />
                        <ActionButton icon={<Trash2 />} variant="danger" onClick={() => { setHkiToDelete(item); setIsDeleteConfirmOpen(true); setGlobalBlur(true); }} />
                      </div>
                      <div className="text-[12px] font-black text-primary-600/50 uppercase tracking-widest tabular-nums">ID: {item.id}</div>
                    </div>
                  </div>
                )) : <div className="py-20 text-center text-slate-400 px-6 font-medium">Tidak ada data hasil pencarian.</div>}
              </div>

              <div className="px-6 md:px-10 py-8 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-50/20 dark:bg-white/[0.01]">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-8 w-full md:w-auto">
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl shadow-sm hover:border-primary-500/50 transition-colors">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Baris:</span>
                    <select 
                      value={rowsPerPage} 
                      onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }} 
                      className="bg-transparent text-[13px] font-bold text-slate-700 dark:text-neutral-200 outline-none cursor-pointer pr-1"
                    >
                      {[10, 25, 50, 100].map(val => <option key={val} value={val} className="bg-white dark:bg-neutral-900">{val}</option>)}
                    </select>
                  </div>
                  <p className="text-[13px] font-semibold text-slate-400">Menampilkan {paginatedHKI.length} dari {filteredHKI.length} HKI</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto justify-center">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p-1))} 
                    disabled={currentPage === 1} 
                    className={`w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-primary-600 disabled:opacity-30 transition-all shadow-sm active:scale-90`}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setCurrentPage(i+1)} 
                        className={`w-10 h-10 flex items-center justify-center rounded-xl text-[13px] font-bold transition-all active:scale-95 ${currentPage === i+1 ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                      >
                        {i+1}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} 
                    disabled={currentPage === totalPages} 
                    className={`w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-primary-600 disabled:opacity-30 transition-all shadow-sm active:scale-90`}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ADD/EDIT MODAL --- */}
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
              onClick={() => { setIsAddModalOpen(false); setGlobalBlur(false); }} 
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
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-xl">{isEditMode ? <Pencil className="w-6 h-6" /> : <Plus className="w-6 h-6" />}</div>
                  <div><h3 className="text-[20px] md:text-[24px] font-black text-slate-900 dark:text-white tracking-tight">{isEditMode ? 'Edit HKI' : 'Tambah HKI Baru'}</h3><p className="text-[12px] text-slate-400 mt-1">Daftarkan kekayaan intelektual atau paten akademik Anda.</p></div>
                </div>
                <button onClick={() => { setIsAddModalOpen(false); setGlobalBlur(false); }} className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-slate-900"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-8 md:px-12 py-10 custom-scrollbar space-y-12">
                
                <div className="space-y-6">
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center"><ShieldCheck className="w-4 h-4" /></div><h4 className="text-[16px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Informasi Utama HKI</h4></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2 col-span-full">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul HKI *</label>
                      <input required value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Masukkan judul lengkap HKI..." className="w-full h-[52px] px-6 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl outline-none focus:border-primary-600/30 border border-transparent dark:text-white text-[15px] font-normal" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jenis Ciptaan *</label>
                      <div className="relative">
                        <select required value={formJenis} onChange={e => setFormJenis(e.target.value as JenisCiptaan)} className={`w-full h-[52px] appearance-none px-5 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl outline-none border border-transparent dark:text-white text-[14px] font-normal ${!formJenis ? 'text-slate-400' : ''}`}>
                          <option value="" disabled>Pilih Jenis Ciptaan</option>
                          {JENIS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor Permohonan</label>
                      <input value={formNomorPermohonan} onChange={e => setFormNomorPermohonan(e.target.value)} placeholder="Contoh: P00202500123" className="w-full h-[52px] px-6 bg-slate-50 dark:bg-neutral-800/50 border border-transparent rounded-2xl outline-none dark:text-white tabular-nums text-[14px] font-normal" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tempat Diumumkan Pertama Kali</label>
                      <div className="relative">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input value={formTempatDiumumkan} onChange={e => setFormTempatDiumumkan(e.target.value)} placeholder="Masukkan kota/provinsi" className="w-full h-[52px] pl-12 pr-5 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl outline-none border border-transparent dark:text-white text-[14px] font-normal" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal Diumumkan Pertama Kali *</label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input required type="date" value={formTanggalDiumumkan} onChange={e => setFormTanggalDiumumkan(e.target.value)} className="w-full h-[52px] pl-12 pr-5 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl outline-none border border-transparent dark:text-white text-[14px] font-normal" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor Pencatatan</label>
                      <input value={formNomorPencatatan} onChange={e => setFormNomorPencatatan(e.target.value)} placeholder="Nomor pencatatan resmi" className="w-full h-[52px] px-6 bg-slate-50 dark:bg-neutral-800/50 border border-transparent rounded-2xl outline-none dark:text-white tabular-nums text-[14px] font-normal" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4" ref={penciptaRef}>
                  <div className="flex items-center gap-3 mb-2"><div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center"><Users className="w-4 h-4" /></div><h4 className="text-[16px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Pencipta</h4></div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Pencipta</label>
                    <div className="relative">
                      <div className={`h-[52px] w-full bg-slate-50 dark:bg-neutral-800/50 border rounded-2xl flex items-center transition-all ${isPenciptaDropdownOpen ? 'border-primary-600/30 ring-4 ring-primary-500/5' : 'border-transparent'}`}>
                        <Users className="w-5 h-5 ml-5 text-slate-400" />
                        <input type="text" placeholder="Cari pencipta..." value={penciptaSearch} onChange={(e) => { setPenciptaSearch(e.target.value); setIsPenciptaDropdownOpen(true); }} onFocus={() => setIsPenciptaDropdownOpen(true)} className="flex-1 bg-transparent outline-none px-4 text-[14px] font-normal dark:text-white h-full" />
                      </div>
                      {isPenciptaDropdownOpen && (
                        <div className="absolute z-[110] top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-neutral-900 border border-slate-100 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden">
                          <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                            {PEOPLE_SUGGESTIONS.filter(p => p.toLowerCase().includes(penciptaSearch.toLowerCase()) && !selectedPencipta.includes(p)).map(p => (
                              <button key={p} type="button" onClick={() => { setSelectedPencipta([...selectedPencipta, p]); setPenciptaSearch(''); setIsPenciptaDropdownOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400 flex items-center justify-center font-black text-[10px]">{p[0]}</div>
                                  <span className="text-[13px] font-normal text-slate-700 dark:text-neutral-200 group-hover:bg-slate-50/10 transition-colors">{p}</span>
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
                    {selectedPencipta.map(p => (
                      <div key={p} className="h-10 px-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition-all group/chip">
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-neutral-800 text-primary-600 flex items-center justify-center font-black text-[9px]">{p[0]}</div>
                        <span className="text-[13px] font-semibold text-slate-700 dark:text-neutral-200">{p}</span>
                        <button type="button" onClick={() => setSelectedPencipta(selectedPencipta.filter(item => item !== p))} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-md transition-all"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4" ref={pemegangRef}>
                  <div className="flex items-center gap-3 mb-2"><div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center"><Building2 className="w-4 h-4" /></div><h4 className="text-[16px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Pemegang</h4></div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Pemegang Hak</label>
                    <div className="relative">
                      <div className={`h-[52px] w-full bg-slate-50 dark:bg-neutral-800/50 border rounded-2xl flex items-center transition-all ${isPemegangDropdownOpen ? 'border-primary-600/30 ring-4 ring-primary-500/5' : 'border-transparent'}`}>
                        <Building2 className="w-5 h-5 ml-5 text-slate-400" />
                        <input type="text" placeholder="Cari pemegang..." value={pemegangSearch} onChange={(e) => { setPemegangSearch(e.target.value); setIsPemegangDropdownOpen(true); }} onFocus={() => setIsPemegangDropdownOpen(true)} className="flex-1 bg-transparent outline-none px-4 text-[14px] font-normal dark:text-white h-full" />
                      </div>
                      {isPemegangDropdownOpen && (
                        <div className="absolute z-[110] top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-neutral-900 border border-slate-100 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden">
                          <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                            {PEOPLE_SUGGESTIONS.filter(p => p.toLowerCase().includes(pemegangSearch.toLowerCase()) && !selectedPemegang.includes(p)).map(p => (
                              <button key={p} type="button" onClick={() => { setSelectedPemegang([...selectedPemegang, p]); setPemegangSearch(''); setIsPemegangDropdownOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400 flex items-center justify-center font-black text-[10px]">{p[0]}</div>
                                  <span className="text-[13px] font-normal text-slate-700 dark:text-neutral-200 group-hover:bg-slate-50/10 transition-colors">{p}</span>
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
                    {selectedPemegang.map(p => (
                      <div key={p} className="h-10 px-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition-all group/chip">
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-neutral-800 text-amber-600 flex items-center justify-center font-black text-[9px]">{p[0]}</div>
                        <span className="text-[13px] font-semibold text-slate-700 dark:text-neutral-200">{p}</span>
                        <button type="button" onClick={() => setSelectedPemegang(selectedPemegang.filter(item => item !== p))} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-md transition-all"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 flex items-center justify-center"><Layers className="w-4 h-4" /></div><h4 className="text-[16px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Dokumen HKI</h4></div>
                  <DragAndDropUpload 
                    file={hkiFile} 
                    existingFileName={isEditMode ? hkiList.find(i => i.id === editingId)?.hkiFileName : undefined}
                    onFileSelect={setHkiFile} 
                  />
                </div>

                <div className="pt-8 flex gap-4">
                  <button type="button" onClick={() => { setIsAddModalOpen(false); setGlobalBlur(false); }} className="flex-1 h-[56px] border border-slate-200 dark:border-white/10 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all active:scale-[0.98]">Batal</button>
                  <motion.button 
                    {...btnScaleDown}
                    type="submit" 
                    className="flex-[2] h-[56px] bg-primary-600 text-white font-black rounded-2xl shadow-xl shadow-primary-600/20 active:scale-[0.98] transition-all"
                  >
                    {isEditMode ? 'Simpan Perubahan' : 'Simpan HKI'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0 bg-black/45 dark:bg-black/80 backdrop-blur-sm" 
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
              <h3 className="text-[20px] font-black text-slate-900 dark:text-white mb-2 tracking-tight">Hapus HKI?</h3>
              <div className="space-y-4 mb-10">
                <p className="text-slate-500 dark:text-neutral-500 text-[14px] leading-relaxed">
                  Data HKI yang dihapus tidak dapat dikembalikan.
                </p>
                {hkiToDelete && (
                  <p className="text-[12px] font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-widest line-clamp-2 px-4">
                    {hkiToDelete.title}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <motion.button 
                  {...btnScaleDown}
                  onClick={handleDelete} 
                  className="w-full h-[52px] bg-red-500 text-white font-black rounded-2xl shadow-xl shadow-red-500/20 active:scale-[0.98] transition-all hover:bg-red-600"
                >
                  Hapus HKI
                </motion.button>
                <button 
                  onClick={() => { setIsDeleteConfirmOpen(false); setGlobalBlur(false); }} 
                  className="w-full h-[52px] bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-neutral-400 font-bold rounded-2xl active:scale-[0.98] transition-all hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- IMPORT MODAL --- */}
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
                      Silakan gunakan templat resmi yang disediakan untuk memastikan format dan struktur data sesuai dengan sistem.
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
                  <DragAndDropUpload file={selectedImportFile} onFileSelect={setSelectedImportFile} acceptedTypes={['.xlsx', '.csv']} helperText="Format: XLSX atau CSV" />
                </div>
              </div>
              <div className="px-8 py-8 border-t border-slate-50 dark:border-white/5 flex gap-4">
                <button type="button" onClick={() => { setIsImportModalOpen(false); setGlobalBlur(false); setSelectedImportFile(null); }} className="flex-1 h-[52px] bg-white dark:bg-white/5 border border-slate-200 text-slate-600 dark:text-neutral-400 font-bold rounded-2xl active:scale-[0.98]">Batal</button>
                <motion.button 
                  {...btnScaleDown}
                  disabled={!selectedImportFile} 
                  onClick={() => { setIsImportModalOpen(false); setGlobalBlur(false); setSelectedImportFile(null); showToast("Data HKI berhasil diimport.", "success"); }} 
                  className="flex-[2] h-[52px] bg-primary-600 text-white font-black rounded-2xl shadow-xl disabled:opacity-50 active:scale-[0.98] transition-all hover:bg-primary-700"
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

/* --- DETAIL VIEW --- */

const HKIDetailView: React.FC<{ 
  detail: HKIItem; 
  onBack: () => void;
  onPreview: () => void;
  onDownload: () => void;
}> = ({ detail, onBack, onPreview, onDownload }) => {
  const calculateExpiration = () => {
    if (detail.jenisCiptaan === 'Hak Cipta (Umum)') {
      return { 
        duration: 'Seumur Hidup + 70 Tahun',
        endDate: 'Tidak memiliki tanggal kedaluwarsa pasti',
        isUnlimited: true,
        status: 'Active'
      };
    }
    
    if (detail.jenisCiptaan === 'Rahasia Dagang') {
      return {
        duration: 'Berlaku Selamanya',
        endDate: 'Tidak memiliki batas waktu',
        isUnlimited: true,
        status: 'Active'
      };
    }

    const start = new Date(detail.tanggalDiumumkan);
    const years = detail.jenisCiptaan === 'Hak Cipta (Digital/PT)' ? 50 : 
                  detail.jenisCiptaan === 'Paten Biasa' ? 20 : 10;
    
    const end = new Date(start);
    end.setFullYear(start.getFullYear() + years);
    
    const isExpired = new Date() > end;
    
    return {
      duration: `${years} Tahun`,
      endDate: end.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      isUnlimited: false,
      isExpired,
      status: isExpired ? 'Expired' : 'Active'
    };
  };

  const protection = calculateExpiration();

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 md:px-0">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1">
            <span>HKI</span><ChevronRight className="w-3 h-3" /><span className="text-primary-600">Detail HKI</span>
          </div>
          <h1 className="text-[24px] md:text-[28px] font-black text-slate-900 dark:text-white tracking-tight">Detail HKI</h1>
        </div>
        <button onClick={onBack} className="w-fit h-[48px] px-6 bg-white dark:bg-white/5 text-slate-600 dark:text-neutral-300 border border-slate-200 rounded-xl text-[13px] font-bold flex items-center gap-2 shadow-sm hover:bg-slate-50 active:scale-95 transition-all"><ArrowLeft className="w-4 h-4" /> Kembali</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 md:px-0">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Rincian Informasi HKI</h3>
                <p className="text-[12px] text-slate-400 font-medium mt-0.5">Informasi pendaftaran and legalitas hak kekayaan intelektual.</p>
              </div>
            </div>
            <div className="space-y-8">
              <div><label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest block mb-2.5">Judul HKI</label><p className="text-[18px] md:text-[20px] font-bold text-slate-900 dark:text-white leading-snug">{detail.title}</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <DetailField label="Jenis Ciptaan" value={detail.jenisCiptaan} />
                <DetailField label="Nomor Permohonan" value={detail.nomorPermohonan || '-'} />
                <DetailField label="Nomor Pencatatan" value={detail.nomorPencatatan || '-'} />
                <DetailField label="Tempat Diumumkan" value={detail.tempatDiumumkan || '-'} />
              </div>
              
              <div className="pt-4">
                <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest block mb-4">Waktu Perlindungan</label>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-[2rem] border-2 shadow-sm ${protection.isExpired ? 'bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/20' : 'bg-primary-50/30 border-primary-100 dark:bg-primary-900/5 dark:border-primary-900/10'}`}
                >
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${protection.isExpired ? 'bg-red-100 text-red-600' : 'bg-white dark:bg-neutral-800 text-primary-600'}`}>
                          <Clock className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Durasi Perlindungan</p>
                          <p className={`text-[16px] font-black ${protection.isExpired ? 'text-red-700 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>{protection.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${protection.isExpired ? 'bg-red-100 text-red-600' : 'bg-white dark:bg-neutral-800 text-primary-600'}`}>
                          <CalendarIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tanggal Mulai (Referensi)</p>
                          <p className="text-[14px] font-bold text-slate-700 dark:text-neutral-300">
                            {new Date(detail.tanggalDiumumkan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 space-y-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${protection.isExpired ? 'bg-red-100 text-red-600' : 'bg-primary-600 text-white'}`}>
                          <Lock className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tanggal Kedaluwarsa</p>
                          <p className={`text-[16px] font-black ${protection.isExpired ? 'text-red-600' : 'text-primary-600 dark:text-primary-400'}`}>{protection.endDate}</p>
                        </div>
                      </div>
                      <div className="px-4 py-2 bg-white dark:bg-neutral-800/50 rounded-xl border border-slate-100 dark:border-white/5 inline-flex items-center gap-2">
                        {protection.isExpired ? (
                          <><ShieldAlert className="w-3.5 h-3.5 text-red-500" /><span className="text-[10px] font-black uppercase text-red-500 tracking-wider">Telah Kedaluwarsa</span></>
                        ) : (
                          <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /><span className="text-[10px] font-black uppercase text-green-600 tracking-wider">Perlindungan Aktif</span></>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-5 border-t border-slate-200/50 dark:border-white/10">
                    <p className="text-[11px] font-medium text-slate-500 dark:text-neutral-500 leading-relaxed italic">
                      * Berdasarkan UU yang berlaku, {detail.jenisCiptaan} memiliki waktu perlindungan selama {protection.duration} sejak {detail.jenisCiptaan.includes('Hak Cipta') ? 'pertama kali diumumkan' : 'tanggal penerimaan'}.
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="pt-4 space-y-8">
                <div><label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest block mb-4">Pencipta</label><div className="flex flex-wrap gap-2">{detail.pencipta.map(p => <span key={p} className="px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl text-[13px] font-bold dark:text-white">{p}</span>)}</div></div>
                <div><label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest block mb-4">Pemegang Hak</label><div className="flex flex-wrap gap-2">{detail.pemegang.map(p => <span key={p} className="px-4 py-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200/20 rounded-xl text-[13px] font-bold text-amber-700 dark:text-amber-400">{p}</span>)}</div></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Berkas HKI</h3>
                <p className="text-[12px] text-slate-400 font-medium mt-0.5">Kelola dokumen pendaftaran atau sertifikat hak kekayaan intelektual.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DocActionCard 
                title="Dokumen HKI" 
                isUploaded={!!detail.hkiFileName} 
                tooltipPrefix="HKI" 
                onPreview={onPreview} 
                onDownload={onDownload} 
              />
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-50 dark:border-white/5 pb-4">
              <span className="text-slate-400"><Info className="w-4 h-4" /></span>
              <h4 className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Catatan Sistem</h4>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed font-medium">Data perlindungan dihitung secara otomatis berdasarkan tanggal pengumuman/penerimaan referensi yang dimasukkan pada sistem.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DetailFieldProps {
  label: string;
  value: string;
  isHighlighted?: boolean;
}

const DetailField: React.FC<DetailFieldProps> = ({ label, value, isHighlighted }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest block">{label}</label>
    <p className={`text-[15px] font-bold ${isHighlighted ? 'text-primary-600' : 'text-slate-700 dark:text-neutral-200'}`}>{value}</p>
  </div>
);

/* --- SHARED SUBCOMPONENTS --- */

const DocActionCard: React.FC<{ 
  title: string; 
  isUploaded: boolean; 
  tooltipPrefix: string; 
  onPreview?: () => void; 
  onDownload?: () => void 
}> = ({ title, isUploaded, tooltipPrefix, onPreview, onDownload }) => (
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
    <div className="min-w-0">
      <h5 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-wider truncate">{title}</h5>
      <p className="text-[11px] font-medium text-slate-400 mt-1">
        {isUploaded ? 'Dokumen tersedia' : 'Dokumen HKI belum diunggah'}
      </p>
    </div>
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 pt-2">
      {isUploaded ? (
        <>
          <ActionButton icon={<Eye />} tooltip={`Pratinjau ${tooltipPrefix}`} onClick={onPreview} />
          <ActionButton icon={<Download />} tooltip={`Unduh ${tooltipPrefix}`} onClick={onDownload} />
        </>
      ) : (
        <div className="text-[11px] font-bold text-slate-300 uppercase tracking-widest italic py-2">Berkas tidak tersedia</div>
      )}
    </div>
  </div>
);

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
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-primary-600/10 text-primary-600 rounded-xl flex items-center justify-center shrink-0">
              <FileSearch className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[16px] md:text-[19px] font-black text-slate-900 dark:text-white leading-tight truncate max-w-[200px] md:max-w-md">
                {fileName}
              </h3>
              <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-0.5">
                Quick Look Preview
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             {fileUrl && (
               <button 
                 onClick={() => { const a = document.createElement('a'); a.href = fileUrl; a.download = fileName; a.click(); }}
                 className="hidden sm:flex h-11 px-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-neutral-300 font-bold rounded-xl items-center gap-2 hover:bg-slate-100 transition-all active:scale-95"
               >
                 <Download className="w-4 h-4" /> Unduh
               </button>
             )}
             <button 
               onClick={onClose} 
               className="w-11 h-11 flex items-center justify-center bg-slate-100 dark:bg-white/10 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all active:scale-90"
               aria-label="Tutup Pratinjau"
             >
               <X className="w-6 h-6" />
             </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden bg-slate-50 dark:bg-black relative">
          {fileUrl && fileType === 'pdf' ? (
            <div className="w-full h-full p-2 md:p-6 lg:p-8">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-white shadow-2xl border border-black/5">
                <iframe 
                  src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=1`} 
                  className="w-full h-full border-none" 
                  title="PDF Document Viewer" 
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center p-6">
              <div className="max-w-md w-full bg-white dark:bg-neutral-900/60 p-10 md:p-16 rounded-[3rem] text-center shadow-2xl border border-slate-100 dark:border-white/5 space-y-10 animate-in fade-in zoom-in-95 duration-700 backdrop-blur-md">
                <div className="w-24 h-24 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner relative group">
                  <div className="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full scale-50 group-hover:scale-100 transition-transform duration-1000 opacity-0 group-hover:opacity-100"></div>
                  <FileText className="w-12 h-12 relative z-10" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-[22px] md:text-[26px] font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    Pratinjau tidak tersedia
                  </h4>
                  <p className="text-[15px] md:text-[17px] text-slate-500 dark:text-neutral-400 leading-relaxed font-medium">
                    {fileType === 'pdf' 
                      ? 'Berkas demo ini tidak memiliki konten fisik untuk dipratinjau. Silakan unggah berkas PDF baru Anda untuk mengaktifkan fitur penampil dokumen.' 
                      : 'Pratinjau langsung untuk format file .DOCX saat ini tidak didukung. Silakan unduh berkas untuk melihat konten secara lokal.'}
                  </p>
                </div>
                <div className="flex flex-col gap-3 pt-4">
                  {fileUrl && (
                    <button 
                      onClick={() => { const a = document.createElement('a'); a.href = fileUrl; a.download = fileName; a.click(); }} 
                      className="w-full py-5 bg-primary-600 text-white font-black rounded-2xl shadow-xl shadow-primary-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 hover:bg-primary-700"
                    >
                      <Download className="w-5 h-5" /> Unduh Berkas
                    </button>
                  )}
                  <button 
                    onClick={onClose}
                    className="w-full py-5 bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-neutral-400 font-bold rounded-2xl active:scale-[0.98] transition-all"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
};