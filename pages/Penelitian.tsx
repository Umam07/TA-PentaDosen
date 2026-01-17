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
  History,
  AlertTriangle,
  FileSearch
} from 'lucide-react';
import { useLayout } from '../components/layout/AppLayout';

interface ResearchItem {
  id: string;
  title: string;
  leadResearcher: string;
  members: string[];
  scheme: 'Hibah Internal' | 'Hibah External' | 'Mandiri';
  amount: string;
  year: string;
  progressReport?: string; 
  progressFile?: File; 
  finalReport?: string;    
  finalFile?: File;    
  proposedAmount?: string; 
  sourceOfFunds?: string;  
  status?: string;
  proposalFileName?: string;
  proposalFile?: File; 
}

const MOCK_RESEARCH: ResearchItem[] = [
  {
    id: '1',
    title: 'Pengembangan Sistem Deteksi Dini Kanker Payudara Berbasis Deep Learning',
    leadResearcher: 'Dr. Jane Doe, M.T.',
    members: ['Prof. Ahmad Fauzi', 'Rafly Eryan'],
    scheme: 'Hibah Internal',
    amount: 'Rp 45.000.000',
    proposedAmount: 'Rp 50.000.000',
    sourceOfFunds: 'Universitas YARSI',
    year: '2025',
    progressReport: 'progress_report_01.pdf',
    proposalFileName: 'proposal_final_v1.pdf'
  },
  {
    id: '2',
    title: 'Analisis Keamanan Jaringan IoT pada Infrastruktur Smart City di Jakarta',
    leadResearcher: 'Dr. Sarah Putri, S.T., M.Kom.',
    members: ['Hendra Wijaya', 'Siti Aminah'],
    scheme: 'Hibah External',
    amount: 'Rp 30.000.000',
    proposedAmount: 'Rp 35.000.000',
    sourceOfFunds: 'KEMENDIKBUDRISTEK',
    year: '2024',
    progressReport: 'progress.pdf',
    proposalFileName: 'prop.docx',
    finalReport: 'final.pdf'
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

const calculateStatus = (item: Partial<ResearchItem>) => {
  if (item.proposalFileName && item.progressReport && item.finalReport) return 'Lengkap';
  if (item.proposalFileName && item.progressReport) return 'Sedang Berjalan';
  if (item.proposalFileName) return 'Proposal';
  return 'Ditolak';
};

const getStatusStyles = (status?: string) => {
  switch (status) {
    case 'Proposal':
      return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30';
    case 'Sedang Berjalan':
      return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
    case 'Lengkap':
      return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30';
    case 'Ditolak':
      return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30';
    default:
      return 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-neutral-400 border-slate-100 dark:border-white/10';
  }
};

const terbilangRupiah = (amountStr: string): string => {
  const amount = parseInt(amountStr.replace(/\D/g, ''), 10);
  if (isNaN(amount) || amount === 0) return '';
  const units = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
  const helper = (n: number): string => {
    if (n < 12) return units[n];
    if (n < 20) return helper(n - 10) + ' belas';
    if (n < 100) return helper(Math.floor(n / 10)) + ' puluh ' + helper(n % 10);
    if (n < 200) return 'seratus ' + helper(n - 100);
    if (n < 1000) return helper(Math.floor(n / 100)) + ' ratus ' + helper(n % 100);
    if (n < 2000) return 'seribu ' + helper(n - 1000);
    if (n < 1000000) return helper(Math.floor(n / 1000)) + ' ribu ' + helper(n % 1000);
    if (n < 1000000000) return helper(Math.floor(n / 1000000)) + ' juta ' + helper(n % 1000000);
    if (n < 1000000000000) return helper(Math.floor(n / 1000000000)) + ' miliar ' + helper(n % 1000000000);
    if (n < 1000000000000000) return helper(Math.floor(n / 1000000000000)) + ' triliun ' + helper(n % 1000000000000);
    return '';
  };
  const result = helper(amount).replace(/\s+/g, ' ').trim();
  return result ? `${result} rupiah` : '';
};

/* --- REUSABLE DRAG AND DROP COMPONENT --- */

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

export const Penelitian: React.FC = () => {
  const { setGlobalBlur, showToast } = useLayout();
  const [researchList, setResearchList] = useState<ResearchItem[]>(MOCK_RESEARCH.map(r => ({ ...r, status: calculateStatus(r) })));
  const [searchQuery, setSearchQuery] = useState('');
  const [schemeFilter, setSchemeFilter] = useState('Semua Skema');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [yearFilter, setYearFilter] = useState('Semua Tahun');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResearchDetail, setSelectedResearchDetail] = useState<ResearchItem | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [researchToDelete, setResearchToDelete] = useState<ResearchItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{ name: string; url: string; type: string } | null>(null);
  const [selectedImportFile, setSelectedImportFile] = useState<File | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formScheme, setFormScheme] = useState(''); 
  const [formSumberDana, setFormSumberDana] = useState(''); 
  const [formOtherSumberDana, setFormOtherSumberDana] = useState('');
  const [budgetProposed, setBudgetProposed] = useState('');
  const [budgetFunded, setBudgetFunded] = useState('');
  const [formYear, setFormYear] = useState('2026'); 
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [proposalFile, setProposalFile] = useState<File | null>(null);
  const [progressFile, setProgressFile] = useState<File | null>(null);
  const [finalFile, setFinalFile] = useState<File | null>(null);
  const [existingFiles, setExistingFiles] = useState<{proposal?: string, progress?: string, final?: string}>({});
  const [memberSearch, setMemberSearch] = useState('');
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const [reportUploadTarget, setReportUploadTarget] = useState<{ id: string; type: 'progress' | 'final' | 'proposal' } | null>(null);
  const reportInputRef = useRef<HTMLInputElement>(null);
  const memberContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (memberContainerRef.current && !memberContainerRef.current.contains(event.target as Node)) {
        setIsMemberDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSchemeFilter('Semua Skema');
    setStatusFilter('Semua Status');
    setYearFilter('Semua Tahun');
    setRowsPerPage(10);
    setCurrentPage(1);
  };

  const filteredResearch = useMemo(() => {
    return researchList.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.leadResearcher.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesScheme = schemeFilter === 'Semua Skema' || item.scheme === schemeFilter;
      const matchesStatus = statusFilter === 'Semua Status' || item.status === statusFilter;
      const matchesYear = yearFilter === 'Semua Tahun' || item.year === yearFilter;
      return matchesSearch && matchesScheme && matchesStatus && matchesYear;
    });
  }, [searchQuery, schemeFilter, statusFilter, yearFilter, researchList]);

  const paginatedResearch = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredResearch.slice(start, start + rowsPerPage);
  }, [filteredResearch, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredResearch.length / rowsPerPage);

  const openAddModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormTitle('');
    setFormScheme('');
    setFormSumberDana('');
    setFormOtherSumberDana('');
    setBudgetProposed('');
    setBudgetFunded('');
    setFormYear('2026'); 
    setProposalFile(null);
    setProgressFile(null);
    setFinalFile(null);
    setExistingFiles({});
    setSelectedMembers([]);
    setMemberSearch('');
    setIsAddModalOpen(true);
    setGlobalBlur(true);
  };

  const openEditModal = (item: ResearchItem) => {
    setIsEditMode(true);
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormScheme(item.scheme);
    const isStandardSource = item.sourceOfFunds === 'Universitas YARSI';
    setFormSumberDana(isStandardSource ? 'Universitas YARSI' : 'Lainnya');
    setFormOtherSumberDana(isStandardSource ? '' : (item.sourceOfFunds || ''));
    setBudgetProposed(item.proposedAmount?.replace(/\D/g, '') || '');
    setBudgetFunded(item.amount?.replace(/\D/g, '') || '');
    setFormYear(item.year);
    setSelectedMembers(item.members);
    setExistingFiles({
      proposal: item.proposalFileName,
      progress: item.progressReport,
      final: item.finalReport
    });
    setIsAddModalOpen(true);
    setGlobalBlur(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setGlobalBlur(false);
    setFormTitle('');
    setFormScheme('');
    setFormSumberDana('');
    setFormOtherSumberDana('');
    setBudgetProposed('');
    setBudgetFunded('');
    setFormYear('2026'); 
    setProposalFile(null);
    setProgressFile(null);
    setFinalFile(null);
    setExistingFiles({});
    setSelectedMembers([]);
    setMemberSearch('');
    setIsEditMode(false);
    setEditingId(null);
  };

  const openDeleteConfirm = (item: ResearchItem) => {
    setResearchToDelete(item);
    setIsDeleteConfirmOpen(true);
    setGlobalBlur(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setResearchToDelete(null);
    setGlobalBlur(false);
  };

  const handleDeleteResearch = () => {
    if (researchToDelete) {
      setResearchList(prev => prev.filter(r => r.id !== researchToDelete.id));
      showToast('Penelitian berhasil dihapus.', 'delete');
      closeDeleteConfirm();
    }
  };

  const handleMemberAdd = (member: string) => {
    if (!selectedMembers.includes(member)) setSelectedMembers([...selectedMembers, member]);
    setMemberSearch('');
    setIsMemberDropdownOpen(false);
  };

  const handleMemberRemove = (member: string) => {
    setSelectedMembers(selectedMembers.filter(m => m !== member));
  };

  const formatIndonesianCurrency = (value: string) => {
    if (!value) return '';
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleBudgetChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setter(rawValue);
  };

  const handleSaveResearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) { showToast('Judul penelitian wajib diisi.', 'error'); return; }
    if (!formScheme) { showToast('Mohon pilih skema penelitian.', 'error'); return; }
    if (!formSumberDana) { showToast('Mohon pilih sumber dana.', 'error'); return; }
    if (selectedMembers.length === 0) { showToast('Anggota peneliti wajib diisi minimal 1 orang.', 'error'); return; }
    
    const cleanBudgetFunded = budgetFunded.replace(/\D/g, '');
    const cleanBudgetProposed = budgetProposed.replace(/\D/g, '');

    if (isEditMode && editingId) {
      setResearchList(prev => prev.map(item => {
        if (item.id === editingId) {
          const updated: Partial<ResearchItem> = {
            ...item,
            title: formTitle,
            members: selectedMembers,
            scheme: formScheme as any,
            amount: `Rp ${formatIndonesianCurrency(cleanBudgetFunded) || '0'}`,
            proposedAmount: `Rp ${formatIndonesianCurrency(cleanBudgetProposed) || '0'}`,
            sourceOfFunds: formSumberDana === 'Lainnya' ? formOtherSumberDana : formSumberDana,
            year: formYear,
            proposalFileName: proposalFile ? proposalFile.name : item.proposalFileName,
            proposalFile: proposalFile || item.proposalFile,
            progressReport: progressFile ? progressFile.name : item.progressReport,
            progressFile: progressFile || item.progressFile,
            finalReport: finalFile ? finalFile.name : item.finalReport,
            finalFile: finalFile || item.finalFile
          };
          return { ...updated, status: calculateStatus(updated) } as ResearchItem;
        }
        return item;
      }));
      showToast('Perubahan berhasil disimpan!', 'info');
    } else {
      const newItemPart: Partial<ResearchItem> = {
        id: Math.random().toString(36).substring(7),
        title: formTitle,
        leadResearcher: 'Dr. Jane Doe, M.T.',
        members: selectedMembers,
        scheme: formScheme as any,
        amount: `Rp ${formatIndonesianCurrency(cleanBudgetFunded) || '0'}`,
        proposedAmount: `Rp ${formatIndonesianCurrency(cleanBudgetProposed) || '0'}`,
        sourceOfFunds: formSumberDana === 'Lainnya' ? formOtherSumberDana : formSumberDana,
        year: new Date().getFullYear().toString(),
        proposalFileName: proposalFile?.name,
        proposalFile: proposalFile || undefined,
        progressReport: undefined,
        finalReport: undefined
      };
      const newItem = { ...newItemPart, status: calculateStatus(newItemPart) } as ResearchItem;
      setResearchList([newItem, ...researchList]);
      showToast('Data penelitian berhasil disimpan!', 'success');
    }
    closeAddModal();
  };

  const handleTriggerReportUpload = (id: string, type: 'progress' | 'final' | 'proposal') => {
    setReportUploadTarget({ id, type });
    setTimeout(() => reportInputRef.current?.click(), 0);
  };

  const handleReportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && reportUploadTarget) {
      const allowedTypes = ['.pdf', '.docx'];
      const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowedTypes.includes(extension)) {
        showToast('Format file tidak didukung. Gunakan PDF or DOCX.', 'error');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        showToast('Ukuran file terlalu besar. Maksimal 10 MB.', 'error');
        return;
      }
      setResearchList(prev => prev.map(item => {
        if (item.id === reportUploadTarget.id) {
          let updated = { ...item };
          if(reportUploadTarget.type === 'progress') {
             updated.progressReport = file.name;
             updated.progressFile = file;
          } else if(reportUploadTarget.type === 'final') {
             updated.finalReport = file.name;
             updated.finalFile = file;
          } else if(reportUploadTarget.type === 'proposal') {
             updated.proposalFileName = file.name;
             updated.proposalFile = file;
          }
          const finalItem = { ...updated, status: calculateStatus(updated) };
          if (selectedResearchDetail?.id === item.id) setSelectedResearchDetail(finalItem as ResearchItem);
          return finalItem as ResearchItem;
        }
        return item;
      }));
      showToast(`Berhasil mengunggah berkas.`, 'success');
      setReportUploadTarget(null);
      e.target.value = ''; 
    }
  };

  const handleDownload = (item: ResearchItem, type: 'proposal' | 'progress' | 'final') => {
    let file: File | undefined;
    let fileName: string | undefined;

    if (type === 'proposal') { file = item.proposalFile; fileName = item.proposalFileName; }
    else if (type === 'progress') { file = item.progressFile; fileName = item.progressReport; }
    else if (type === 'final') { file = item.finalFile; fileName = item.finalReport; }

    if (file) {
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || 'file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (fileName) {
      const blob = new Blob(["Demo content for " + fileName], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    showToast(`Berhasil mengunduh ${fileName}`, 'info');
  };

  const openPreview = (item: ResearchItem, type: 'proposal' | 'progress' | 'final') => {
    let file: File | undefined;
    let fileName: string | undefined;

    if (type === 'proposal') { file = item.proposalFile; fileName = item.proposalFileName; }
    else if (type === 'progress') { file = item.progressFile; fileName = item.progressReport; }
    else if (type === 'final') { file = item.finalFile; fileName = item.finalReport; }

    if (!fileName) return;

    const isPdf = fileName.toLowerCase().endsWith('.pdf');
    const fileType = isPdf ? 'pdf' : 'docx';
    const previewUrl = file ? URL.createObjectURL(file) : '';

    setPreviewData({ name: fileName, url: previewUrl, type: fileType });
    setGlobalBlur(true);
  };

  const closePreview = () => {
    if (previewData?.url) {
      URL.revokeObjectURL(previewData.url);
    }
    setPreviewData(null);
    setGlobalBlur(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <input type="file" ref={reportInputRef} onChange={handleReportFileChange} accept=".pdf, .docx" className="hidden" />
      
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
        {selectedResearchDetail ? (
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={modalTransition}
          >
            <ResearchDetailView 
              detail={selectedResearchDetail} 
              onBack={() => setSelectedResearchDetail(null)} 
              onPreview={(type) => openPreview(selectedResearchDetail, type)} 
              onDownload={(type) => handleDownload(selectedResearchDetail, type)} 
              onUploadReport={handleTriggerReportUpload} 
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
                <h1 className="text-[20px] md:text-[24px] font-bold text-slate-900 dark:text-white tracking-tight">Penelitian</h1>
                <p className="text-[13px] md:text-[14px] text-slate-400 dark:text-neutral-500 font-medium tracking-tight">Kelola dan lacak proyek dan proposal penelitian akademis Anda.</p>
              </div>
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                <motion.button {...btnScaleDown} onClick={openAddModal} className="h-[48px] px-8 bg-primary-600 text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all"><Plus className="w-4 h-4" /> Tambah Penelitian</motion.button>
                <button onClick={() => { setIsImportModalOpen(true); setGlobalBlur(true); }} className="h-[48px] px-6 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"><FileUp className="w-4 h-4" /> Import Excel</button>
                <button className="h-[48px] px-6 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"><FileDown className="w-4 h-4" /> Export Excel</button>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0D0D0D] border md:rounded-[2.5rem] shadow-sm flex flex-col min-h-0 overflow-hidden">
              <div className="px-6 md:px-10 py-6 md:py-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01]">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Cari Penelitian</label>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Cari judul..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-11 pl-11 pr-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-medium dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 transition-all" />
                      </div>
                    </div>
                    <div className="lg:col-span-1 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Skema</label>
                      <div className="relative group">
                        <select value={schemeFilter} onChange={(e) => setSchemeFilter(e.target.value)} className="w-full h-11 appearance-none pl-4 pr-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-normal text-slate-700 dark:text-neutral-200 outline-none cursor-pointer"><option>Semua Skema</option><option>Hibah Internal</option><option>Hibah External</option><option>Mandiri</option></select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="lg:col-span-1 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Status</label>
                      <div className="relative group">
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full h-11 appearance-none pl-4 pr-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-normal text-slate-700 dark:text-neutral-200 outline-none cursor-pointer"><option>Semua Status</option><option>Proposal</option><option>Sedang Berjalan</option><option>Lengkap</option><option>Ditolak</option></select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="lg:col-span-1 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Tahun</label>
                      <div className="relative group">
                        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="w-full h-11 appearance-none pl-4 pr-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-normal text-slate-700 dark:text-neutral-200 outline-none cursor-pointer"><option>Semua Tahun</option><option>2024</option><option>2025</option><option>2026</option></select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <button onClick={handleResetFilters} className="h-11 px-6 bg-white dark:bg-white/5 text-slate-500 dark:text-neutral-400 font-bold rounded-xl border border-slate-200 dark:border-white/10 hover:text-primary-600 dark:hover:text-white hover:border-primary-500/40 transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0 shadow-sm"><RotateCcw className="w-4 h-4" /> Reset Filter</button>
                </div>
              </div>
              <div className="hidden md:block overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[1200px]">
                  <thead>
                    <tr className="bg-slate-50/30 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/10">
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Judul Penelitian</th>
                      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Ketua Peneliti</th>
                      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400" style={{ minWidth: '160px' }}>Skema</th>
                      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400" style={{ minWidth: '160px' }}>Status</th>
                      <th className="px-4 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Tahun</th>
                      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Progress</th>
                      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Final</th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {paginatedResearch.length > 0 ? paginatedResearch.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-6 max-sm"><p className="text-[14px] font-medium text-slate-900 dark:text-white leading-snug group-hover:text-primary-600 transition-colors">{item.title}</p></td>
                        <td className="px-6 py-6"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center text-[10px] font-black">{item.leadResearcher.split(' ').filter(n => !n.includes('.')).map(n => n[0]).join('').substring(0, 2)}</div><span className="text-[13px] font-bold text-slate-800 dark:text-neutral-200">{item.leadResearcher}</span></div></td>
                        <td className="px-6 py-6"><span className="inline-block px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-wider rounded-lg whitespace-nowrap text-center leading-none">{item.scheme}</span></td>
                        <td className="px-6 py-6"><span className={`inline-block px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap text-center leading-none ${getStatusStyles(item.status)}`}>{item.status || 'Aktif'}</span></td>
                        <td className="px-4 py-6"><span className="text-[13px] font-medium text-slate-500 dark:text-neutral-400">{item.year}</span></td>
                        <td className="px-6 py-6 text-center"><div className="flex items-center justify-center gap-2">{item.progressReport ? <><ActionButton icon={<Eye />} tooltip="Pratinjau File" onClick={() => openPreview(item, 'progress')} /><ActionButton icon={<Download />} tooltip="Unduh File" onClick={() => handleDownload(item, 'progress')} /></> : <ActionButton icon={<Upload />} tooltip="Unggah Laporan Kemajuan" onClick={() => handleTriggerReportUpload(item.id, 'progress')} />}</div></td>
                        <td className="px-6 py-6 text-center"><div className="flex items-center justify-center gap-2">{item.finalReport ? <><ActionButton icon={<Eye />} tooltip="Pratinjau File" onClick={() => openPreview(item, 'final')} /><ActionButton icon={<Download />} tooltip="Unduh File" onClick={() => handleDownload(item, 'final')} /></> : <ActionButton icon={<Upload />} tooltip="Unggah Laporan Akhir" onClick={() => handleTriggerReportUpload(item.id, 'final')} />}</div></td>
                        <td className="px-8 py-6"><div className="flex items-center justify-end gap-2.5"><ActionButton icon={<Eye />} tooltip="Detail Penelitian" variant="ghost" onClick={() => setSelectedResearchDetail(item)} /><ActionButton icon={<Pencil />} tooltip="Edit Data" variant="ghost" onClick={() => openEditModal(item)} /><ActionButton icon={<Trash2 />} tooltip="Hapus Data" variant="danger" onClick={() => openDeleteConfirm(item)} /></div></td>
                      </tr>
                    )) : <tr><td colSpan={8} className="py-20 text-center text-slate-400">Tidak ada data.</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-white/5">
                {paginatedResearch.length > 0 ? paginatedResearch.map((item) => (
                  <div key={item.id} className="p-6 space-y-5 bg-white dark:bg-transparent">
                    <h4 className="text-[16px] font-medium text-slate-900 dark:text-white leading-relaxed">{item.title}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ketua Peneliti</p><p className="text-[13px] font-bold text-slate-700 dark:text-neutral-200">{item.leadResearcher}</p></div>
                      <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tahun</p><p className="text-[13px] font-bold text-slate-700 dark:text-neutral-200">{item.year}</p></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-wider rounded-lg border border-primary-100 dark:border-primary-900/30 whitespace-nowrap text-center leading-none">{item.scheme}</span>
                      <span className={`px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap text-center leading-none ${getStatusStyles(item.status)}`}>{item.status || 'Aktif'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mb-3 text-center">Progress</p>
                        <div className="flex justify-center gap-2">{item.progressReport ? (<><ActionButton icon={<Eye />} onClick={() => openPreview(item, 'progress')} /><ActionButton icon={<Download />} onClick={() => handleDownload(item, 'progress')} /></>) : (<ActionButton icon={<Upload />} onClick={() => handleTriggerReportUpload(item.id, 'progress')} />)}</div>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mb-3 text-center">Final</p>
                        <div className="flex justify-center gap-2">{item.finalReport ? (<><ActionButton icon={<Eye />} onClick={() => openPreview(item, 'final')} /><ActionButton icon={<Download />} onClick={() => handleDownload(item, 'final')} /></>) : (<ActionButton icon={<Upload />} onClick={() => handleTriggerReportUpload(item.id, 'final')} />)}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                      <div className="flex gap-1.5"><ActionButton icon={<Eye />} variant="ghost" onClick={() => setSelectedResearchDetail(item)} /><ActionButton icon={<Pencil />} variant="ghost" onClick={() => openEditModal(item)} /><ActionButton icon={<Trash2 />} variant="danger" onClick={() => openDeleteConfirm(item)} /></div>
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
                  <p className="text-[13px] font-semibold text-slate-400">Menampilkan {paginatedResearch.length} dari {filteredResearch.length} penelitian</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto justify-center">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                    disabled={currentPage === 1} 
                    className={`w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-primary-600 dark:hover:text-white hover:border-primary-500 disabled:opacity-30 disabled:cursor-default transition-all shadow-sm active:scale-90`}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 flex items-center justify-center rounded-xl text-[13px] font-bold transition-all active:scale-95 ${currentPage === i + 1 ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>{i + 1}</button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                    disabled={currentPage === totalPages} 
                    className={`w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-primary-600 dark:hover:text-white hover:border-primary-500 disabled:opacity-30 disabled:cursor-default transition-all shadow-sm active:scale-90`}
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
                <div className="flex items-center gap-4"><div className="w-12 h-12 bg-primary-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-primary-500/20">{isEditMode ? <Pencil className="w-6 h-6" /> : <Plus className="w-6 h-6" />}</div><div><h3 className="text-[20px] md:text-[24px] font-black text-slate-900 dark:text-white tracking-tight">{isEditMode ? 'Edit Penelitian' : 'Tambah Penelitian Baru'}</h3><p className="text-[12px] text-slate-400 mt-1">Lengkapi data untuk mendaftarkan proposal atau proyek riset.</p></div></div>
                <button type="button" onClick={closeAddModal} className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-slate-900"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSaveResearch} className="flex-1 overflow-y-auto px-8 md:px-12 py-10 custom-scrollbar flex flex-col">
                <div className="space-y-12 flex-1">
                  <div className="space-y-6"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center"><User className="w-4 h-4" /></div><h4 className="text-[16px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Informasi Peneliti Utama</h4></div><div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 p-8 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-[2.5rem] opacity-60">
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Full Name</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><User className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">Dr. Jane Doe, M.T.</span></div></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">NIDN</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><Info className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">1-402022-048</span></div></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">NIP</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><Info className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">14020220-488888-88-88</span></div></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Academic Rank</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><Users className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">Dosen Tetap</span></div></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">University</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><Building2 className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">Universitas YARSI</span></div></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Faculty</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><Building2 className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">Fakultas Teknologi Informasi</span></div></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Study Program</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><GraduationCap className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">Teknik Informatika</span></div></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Email</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><FileText className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">jane.doe@fti.yarsi.ac.id</span></div></div>
                  <div className="col-span-full pt-4 flex items-center gap-3 text-[12px] font-bold text-amber-600 bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10"><Info className="w-4 h-4 shrink-0" />Data bersifat baca-saja dan diambil otomatis dari profil Ketua Peneliti.</div></div></div>
                  <div className="space-y-8"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center"><FileText className="w-4 h-4" /></div><h4 className="text-[16px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Rincian Proposal Penelitian</h4></div><div className="space-y-8">
                    <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul Penelitian <span className="text-red-500">*</span></label><textarea required value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Masukkan judul lengkap..." className="w-full px-6 py-4 bg-slate-50 dark:bg-neutral-800/50 border border-transparent focus:border-primary-600/30 rounded-2xl outline-none text-[15px] font-normal min-h-[100px] dark:text-white" /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Skema <span className="text-red-500">*</span></label><div className="relative">
                        <select required value={formScheme} onChange={(e) => setFormScheme(e.target.value)} className={`w-full h-[52px] appearance-none px-5 bg-slate-50 dark:bg-neutral-800/50 border border-transparent rounded-2xl text-[14px] font-normal outline-none ${!formScheme ? 'text-slate-400 dark:text-neutral-500' : 'dark:text-white'}`}>
                          <option value="" disabled>Pilih skema</option>
                          <option value="Hibah Internal">Hibah Internal</option>
                          <option value="Hibah External">Hibah External</option>
                          <option value="Mandiri">Mandiri</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div></div>
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sumber Dana <span className="text-red-500">*</span></label><div className="relative">
                        <select required value={formSumberDana} onChange={(e) => setFormSumberDana(e.target.value)} className={`w-full h-[52px] appearance-none px-5 bg-slate-50 dark:bg-neutral-800/50 border border-transparent rounded-2xl text-[14px] font-normal outline-none ${!formSumberDana ? 'text-slate-400 dark:text-neutral-500' : 'dark:text-white'}`}>
                          <option value="" disabled>Pilih sumber dana</option>
                          <option value="Universitas YARSI">Universitas YARSI</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div></div>
                    </div>
                    <div className={`grid transition-all duration-500 ${formSumberDana === 'Lainnya' ? 'grid-rows-[1fr] opacity-100 mb-2' : 'grid-rows-[0fr] opacity-0 mb-0'}`}><div className="overflow-hidden"><div className="space-y-2 pt-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Sumber Dana Lainnya</label><input type="text" value={formOtherSumberDana} onChange={(e) => setFormOtherSumberDana(e.target.value)} placeholder="Contoh: KEMENDIKBUDRISTEK" className="w-full h-[52px] px-6 bg-slate-50 dark:bg-neutral-800/50 border border-transparent rounded-2xl outline-none text-[15px] font-normal dark:text-white" /></div></div></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Anggaran Diusulkan (Rp) <span className="text-red-500">*</span></label><div className="relative"><div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[13px]">Rp</div><input type="text" required placeholder="0" value={formatIndonesianCurrency(budgetProposed)} onChange={handleBudgetChange(setBudgetProposed)} className="w-full h-[52px] pl-12 pr-5 bg-slate-50 dark:bg-neutral-800/50 border border-transparent rounded-2xl outline-none text-[15px] font-normal dark:text-white tabular-nums" /></div></div>
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Anggaran Didanai (Rp) <span className="text-red-500">*</span></label><div className="relative"><div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[13px]">Rp</div><input type="text" required placeholder="0" value={formatIndonesianCurrency(budgetFunded)} onChange={handleBudgetChange(setBudgetFunded)} className="w-full h-[52px] pl-12 pr-5 bg-slate-50 dark:bg-neutral-800/50 border border-transparent rounded-2xl outline-none text-[15px] font-normal dark:text-white tabular-nums" /></div></div>
                    </div>
                    {isEditMode && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tahun <span className="text-red-500">*</span></label><div className="relative"><select value={formYear} onChange={(e) => setFormYear(e.target.value)} className="w-full h-[52px] appearance-none px-5 bg-slate-50 dark:bg-neutral-800/50 border border-transparent rounded-2xl text-[14px] font-normal dark:text-white outline-none"><option>2024</option><option>2025</option><option>2026</option></select><ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" /></div></div>
                      </div>
                    )}
                    <div className="space-y-4" ref={memberContainerRef}><div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Anggota Peneliti *</label><div className="relative"><div className={`h-[52px] w-full bg-slate-50 dark:bg-neutral-800/50 border rounded-2xl flex items-center ${isMemberDropdownOpen ? 'border-primary-600/30 ring-4 ring-primary-500/5' : 'border-transparent'}`}><Users className="w-5 h-5 ml-5 text-slate-400" /><input type="text" placeholder="Cari anggota..." value={memberSearch} onChange={(e) => { setMemberSearch(e.target.value); setIsMemberDropdownOpen(true); }} onFocus={() => setIsMemberDropdownOpen(true)} className="flex-1 bg-transparent outline-none px-4 text-[14px] font-normal dark:text-white h-full" /></div>{isMemberDropdownOpen && (<div className="absolute z-[110] top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-neutral-900 border border-slate-100 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden"><div className="max-h-60 overflow-y-auto p-2 space-y-1">{MEMBER_SUGGESTIONS.filter(m => m.toLowerCase().includes(memberSearch.toLowerCase()) && !selectedMembers.includes(m)).map(member => (<button key={member} type="button" onClick={() => handleMemberAdd(member)} className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center justify-between group"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400 flex items-center justify-center font-black text-[10px]">{member[0]}</div><span className="text-[13px] font-normal text-slate-700 dark:text-neutral-200 group-hover:bg-slate-50/10 transition-colors">{member}</span></div><Plus className="w-4 h-4 text-slate-300 group-hover:text-primary-600" /></button>))}</div></div>)}</div></div><div className="flex flex-wrap gap-2.5 pt-1">
                      <div className="h-10 px-4 bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/20 rounded-xl flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary-600 text-[10px] font-black text-white flex items-center justify-center shadow-sm">JD</div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold text-primary-700 dark:text-primary-300">Dr. Jane Doe, M.T.</span>
                          <span className="px-2 py-0.5 bg-primary-600/10 text-primary-600 dark:text-primary-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-primary-600/10 whitespace-nowrap">Ketua Peneliti</span>
                        </div>
                      </div>
                      {selectedMembers.map(member => (<div key={member} className="h-10 px-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition-all group/chip"><div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-neutral-800 text-primary-600 flex items-center justify-center text-[9px] font-black">{member[0]}</div><span className="text-[13px] font-semibold text-slate-700 dark:text-neutral-200">{member}</span><button type="button" onClick={() => handleMemberRemove(member)} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-md transition-all"><X className="w-3.5 h-3.5" /></button></div>))}
                    </div><p className="text-[11px] font-bold text-primary-600/70 ml-1">Anggota yang ditambahkan akan otomatis menjadi anggota penelitian.</p></div>
                    <div className="space-y-10 pt-4">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center"><Layers className="w-4 h-4" /></div>
                          <h4 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Berkas Proposal</h4>
                        </div>
                        <DragAndDropUpload 
                          file={proposalFile} 
                          existingFileName={existingFiles.proposal}
                          onFileSelect={setProposalFile} 
                          acceptedTypes={['.pdf', '.docx']} 
                          helperText="PDF atau DOCX (Max 10MB)" 
                          onPreview={() => {
                            if (proposalFile) {
                              const url = URL.createObjectURL(proposalFile);
                              setPreviewData({ name: proposalFile.name, url, type: proposalFile.name.endsWith('.pdf') ? 'pdf' : 'docx' });
                              setGlobalBlur(true);
                            } else if (existingFiles.proposal) {
                              setPreviewData({ name: existingFiles.proposal, url: '', type: existingFiles.proposal.endsWith('.pdf') ? 'pdf' : 'docx' });
                              setGlobalBlur(true);
                            }
                          }}
                          onDownload={() => {
                            if (proposalFile) {
                              const url = URL.createObjectURL(proposalFile);
                              const a = document.createElement('a'); a.href = url; a.download = proposalFile.name; a.click();
                            }
                          }}
                        />
                      </div>
                      {isEditMode && (
                        <>
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center"><History className="w-4 h-4" /></div>
                              <h4 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Laporan Kemajuan</h4>
                            </div>
                            <DragAndDropUpload 
                              file={progressFile} 
                              existingFileName={existingFiles.progress}
                              onFileSelect={setProgressFile} 
                              acceptedTypes={['.pdf', '.docx']} 
                              helperText="PDF atau DOCX (Max 10MB)" 
                              onPreview={() => {
                                if (progressFile) {
                                  const url = URL.createObjectURL(progressFile);
                                  setPreviewData({ name: progressFile.name, url, type: progressFile.name.endsWith('.pdf') ? 'pdf' : 'docx' });
                                  setGlobalBlur(true);
                                } else if (existingFiles.progress) {
                                  setPreviewData({ name: existingFiles.progress, url: '', type: existingFiles.progress.endsWith('.pdf') ? 'pdf' : 'docx' });
                                  setGlobalBlur(true);
                                }
                              }}
                            />
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></div>
                              <h4 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Laporan Akhir</h4>
                            </div>
                            <DragAndDropUpload 
                              file={finalFile} 
                              existingFileName={existingFiles.final}
                              onFileSelect={setFinalFile} 
                              acceptedTypes={['.pdf', '.docx']} 
                              helperText="PDF atau DOCX (Max 10MB)" 
                              onPreview={() => {
                                if (finalFile) {
                                  const url = URL.createObjectURL(finalFile);
                                  setPreviewData({ name: finalFile.name, url, type: finalFile.name.endsWith('.pdf') ? 'pdf' : 'docx' });
                                  setGlobalBlur(true);
                                } else if (existingFiles.final) {
                                  setPreviewData({ name: existingFiles.final, url: '', type: existingFiles.final.endsWith('.pdf') ? 'pdf' : 'docx' });
                                  setGlobalBlur(true);
                                }
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div></div>
                </div>
                <div className="mt-12 -mx-8 md:-mx-12 px-8 py-8 md:px-12 border-t border-slate-50 dark:border-white/5 flex gap-4 shrink-0"><button type="button" onClick={closeAddModal} className="flex-1 h-[56px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-neutral-400 font-bold rounded-2xl active:scale-[0.98]">Batal</button><motion.button {...btnScaleDown} type="submit" className="flex-[2] h-[56px] bg-primary-600 text-white font-black rounded-2xl shadow-xl active:scale-[0.98]">{isEditMode ? 'Simpan Perubahan' : 'Simpan Penelitian'}</motion.button></div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Standardized Delete Modal */}
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
              onClick={closeDeleteConfirm} 
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
              <h3 className="text-[20px] font-black text-slate-900 dark:text-white mb-2 tracking-tight">Hapus Penelitian?</h3>
              <div className="space-y-4 mb-10">
                <p className="text-slate-500 dark:text-neutral-500 text-[14px] leading-relaxed">
                  Penelitian yang dihapus tidak dapat dikembalikan.
                </p>
                {researchToDelete && (
                  <p className="text-[12px] font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-widest line-clamp-2 px-4">
                    {researchToDelete.title}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <motion.button 
                  {...btnScaleDown}
                  onClick={handleDeleteResearch} 
                  className="w-full h-[52px] bg-red-500 text-white font-black rounded-2xl shadow-xl shadow-red-500/20 active:scale-[0.98] transition-all hover:bg-red-600"
                >
                  Hapus Penelitian
                </motion.button>
                <button 
                  onClick={closeDeleteConfirm} 
                  className="w-full h-[52px] bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-neutral-400 font-bold rounded-2xl active:scale-[0.98] transition-all hover:bg-slate-100 dark:hover:bg-white/10"
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
                <div className="space-y-3"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Persiapan</label><button type="button" className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-white/5 border border-slate-100 rounded-2xl group transition-all"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-green-500/10 text-green-600 rounded-xl flex items-center justify-center"><FileSpreadsheet className="w-5 h-5" /></div><div className="text-left"><p className="text-[14px] font-bold text-slate-900 dark:text-white">Unduh Template</p></div></div><Download className="w-5 h-5 text-slate-300" /></button></div>
                <div className="space-y-3"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pilih Berkas</label><DragAndDropUpload file={selectedImportFile} onFileSelect={setSelectedImportFile} acceptedTypes={['.xlsx', '.xls', '.csv']} helperText="Format: XLSX, XLS, CSV" /></div>
              </div>
              <div className="px-8 py-8 border-t border-slate-50 dark:border-white/5 flex gap-4"><button type="button" onClick={() => { setIsImportModalOpen(false); setGlobalBlur(false); setSelectedImportFile(null); }} className="flex-1 h-[52px] bg-white dark:bg-white/5 border border-slate-200 text-slate-600 font-bold rounded-2xl active:scale-[0.98]">Batal</button><motion.button {...btnScaleDown} disabled={!selectedImportFile} onClick={() => { setIsImportModalOpen(false); setGlobalBlur(false); setSelectedImportFile(null); showToast("Data berhasil diimport.", "success"); }} className="flex-[2] h-[52px] bg-primary-600 text-white font-black rounded-2xl shadow-xl disabled:opacity-50">Mulai Import</motion.button></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* --- SUBCOMPONENTS --- */

interface ResearchDetailViewProps {
  detail: ResearchItem;
  onBack: () => void;
  onPreview: (type: 'proposal' | 'progress' | 'final') => void;
  onDownload: (type: 'proposal' | 'progress' | 'final') => void;
  onUploadReport: (id: string, type: 'progress' | 'final' | 'proposal') => void;
}

const ResearchDetailView: React.FC<ResearchDetailViewProps> = ({ detail, onBack, onPreview, onDownload, onUploadReport }) => (
  <div className="space-y-10">
    <div className="space-y-6 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1"><span>Penelitian</span><ChevronRight className="w-3 h-3" /><span className="text-primary-600">Detail Penelitian</span></div>
          <h1 className="text-[24px] md:text-[28px] font-black text-slate-900 dark:text-white tracking-tight">Detail Penelitian</h1>
        </div>
        <button onClick={onBack} className="w-fit h-[48px] px-6 bg-white dark:bg-white/5 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"><ArrowLeft className="w-4 h-4" /> Kembali</button>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 md:px-0">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-10">
          <div className="flex items-center gap-4"><div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-2xl flex items-center justify-center"><FileText className="w-6 h-6" /></div><div><h3 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Rincian Proposal Penelitian</h3><p className="text-[12px] text-slate-400 font-medium mt-0.5">Informasi lengkap terkait proposal riset yang diajukan.</p></div></div>
          <div className="space-y-8">
            <div><label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest block mb-2.5">Judul Penelitian</label><p className="text-[18px] md:text-[20px] font-bold text-slate-900 dark:text-white leading-snug">{detail.title}</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <DetailField label="Skema" value={detail.scheme} />
              <DetailField label="Sumber Dana" value={detail.sourceOfFunds || 'Universitas YARSI'} />
              <DetailField label="Anggaran Diusulkan" value={detail.proposedAmount || detail.amount} terbilang={terbilangRupiah(detail.proposedAmount || detail.amount)} />
              <DetailField label="Anggaran Didanai" value={detail.amount} terbilang={terbilangRupiah(detail.amount)} />
              <DetailField label="Tahun" value={detail.year} />
              <DetailField label="Status" value={detail.status || 'Aktif'} badgeStyles={getStatusStyles(detail.status)} />
            </div>
            <div className="pt-4">
              <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest block mb-4">Anggota Peneliti (Project Members)</label>
              <div className="flex flex-wrap gap-2.5">
                <div className="h-10 px-4 bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/20 rounded-xl flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-600 text-[10px] font-black text-white flex items-center justify-center shadow-sm">
                    {detail.leadResearcher[0]}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-primary-700 dark:text-primary-300">{detail.leadResearcher}</span>
                    <span className="px-2 py-0.5 bg-primary-600/10 text-primary-600 dark:text-primary-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-primary-600/10">Ketua Peneliti</span>
                  </div>
                </div>
                {detail.members.map((member, idx) => (
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
        <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-8">
          <div className="flex items-center gap-4"><div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl flex items-center justify-center"><Layers className="w-6 h-6" /></div><div><h3 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Dokumen Penelitian</h3><p className="text-[12px] text-slate-400 font-medium mt-0.5">Kelola berkas proposal, laporan kemajuan, dan laporan akhir.</p></div></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DocActionCard title="Berkas Proposal" isUploaded={!!detail.proposalFileName} tooltipPrefix="Proposal" onUpload={() => onUploadReport(detail.id, 'proposal')} onPreview={() => onPreview('proposal')} onDownload={() => onDownload('proposal')} />
            <DocActionCard title="Laporan Kemajuan" isUploaded={!!detail.progressReport} tooltipPrefix="Laporan Kemajuan" onUpload={() => onUploadReport(detail.id, 'progress')} onPreview={() => onPreview('progress')} onDownload={() => onDownload('progress')} />
            <DocActionCard title="Laporan Akhir" isUploaded={!!detail.finalReport} tooltipPrefix="Laporan Akhir" onUpload={() => onUploadReport(detail.id, 'final')} onPreview={() => onPreview('final')} onDownload={() => onDownload('final')} />
          </div>
        </div>
      </div>
      <div className="space-y-8">
        <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm space-y-8 sticky top-10">
          <div className="flex items-center gap-3 border-b border-slate-50 dark:border-white/5 pb-6"><div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center"><User className="w-5 h-5" /></div><h4 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Ketua Peneliti</h4></div>
          <div className="space-y-6">
            <div className="flex flex-col items-center py-4"><div className="w-20 h-20 bg-primary-600 text-white rounded-[2rem] flex items-center justify-center text-2xl font-black shadow-xl shadow-primary-500/20 mb-4">JD</div><h5 className="text-[18px] font-black text-slate-900 dark:text-white text-center leading-tight">{detail.leadResearcher}</h5><p className="text-[12px] font-bold text-primary-600 uppercase tracking-widest mt-2">Dosen Tetap</p></div>
            <div className="space-y-5 pt-4">
              <SidebarField label="NIDN" value="1-402022-048" icon={<Info className="w-3.5 h-3.5" />} />
              <SidebarField label="NIP" value="14020220-488888-88-88" icon={<Info className="w-3.5 h-3.5" />} />
              <SidebarField label="Universitas" value="Universitas YARSI" icon={<Building2 className="w-3.5 h-3.5" />} />
              <SidebarField label="Fakultas" value="Teknologi Informasi" icon={<Briefcase className="w-3.5 h-3.5" />} />
              <SidebarField label="Program Studi" value="Teknik Informatika" icon={<GraduationCap className="w-3.5 h-3.5" />} />
              <SidebarField label="Email" value="jane.doe@fti.yarsi.ac.id" icon={<FileText className="w-3.5 h-3.5" />} />
            </div>
          </div>
        </div>
      </div>
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

const DetailField: React.FC<{ label: string; value: string; badgeStyles?: string; terbilang?: string }> = ({ label, value, badgeStyles, terbilang }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest block">{label}</label>
    {badgeStyles ? (<span className={`inline-block px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider ${badgeStyles}`}>{value}</span>) : (<div className="flex flex-col gap-1"><p className="text-[15px] font-bold text-slate-700 dark:text-neutral-200">{value}</p>{terbilang && (<p className="text-[12px] text-slate-400 dark:text-neutral-500 italic font-medium">({terbilang})</p>)}</div>)}
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
    <div className="flex items-center justify-between"><div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${isUploaded ? 'bg-primary-600 text-white' : 'bg-white dark:bg-neutral-800 text-slate-300'}`}><FileText className="w-5 h-5" /></div>{isUploaded && (<div className="px-2.5 py-1 bg-green-50 dark:bg-green-900/20 rounded-md"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /></div>)}</div>
    <div><h5 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-wider">{title}</h5><p className="text-[11px] font-medium text-slate-400 mt-1">{isUploaded ? 'Dokumen tersedia' : 'Belum diunggah'}</p></div>
    <div className="flex items-center gap-2 pt-2">{isUploaded ? (<><ActionButton icon={<Eye />} tooltip={`Pratinjau ${tooltipPrefix}`} onClick={onPreview} /><ActionButton icon={<Download />} tooltip={`Unduh ${tooltipPrefix}`} onClick={onDownload} /></>) : (<ActionButton icon={<Upload />} tooltip={`Unggah ${tooltipPrefix}`} onClick={onUpload} />)}</div>
  </div>
);

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
    <motion.button type="button" {...btnScaleDown} className={`${baseStyles} ${variantStyles[variant]}`} onClick={onClick}>
      {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-[18px] h-[18px]' })}
      {tooltip && (<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-all duration-300 whitespace-nowrap z-[100] shadow-xl border border-white/10 hidden md:block">{tooltip}<div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-slate-900 dark:border-t-white"></div></div>)}
    </motion.button>
  );
};