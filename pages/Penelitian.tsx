import React, { useState, useMemo } from 'react';
import { PreviewModal } from '../components/shared/PreviewModal';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  FileUp, 
  FileDown, 
  X,
  AlertCircle,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  FileSearch,
  FileText
} from 'lucide-react';
import { useLayout } from '../components/layout/AppLayout';
import { AddPenelitianModal } from '../components/penelitian/AddPenelitianModal';
import { EditPenelitianModal } from '../components/penelitian/EditPenelitianModal';
import { DetailPenelitianModal } from '../components/penelitian/DetailPenelitianModal';
import { PenelitianTable } from '../components/penelitian/PenelitianTable';
import { PenelitianFilter } from '../components/penelitian/PenelitianFilter';
import { ResearchItem, backdropVariants, modalVariants, modalTransition, btnScaleDown } from '../components/penelitian/shared';
import { DragAndDropUpload } from '../components/penelitian/DragAndDropUpload';

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

const calculateStatus = (item: Partial<ResearchItem>) => {
  if (item.proposalFileName && item.progressReport && item.finalReport) return 'Lengkap';
  if (item.proposalFileName && item.progressReport) return 'Sedang Berjalan';
  if (item.proposalFileName) return 'Proposal';
  return 'Ditolak';
};

export const Penelitian: React.FC = () => {
  const { setGlobalBlur, showToast } = useLayout();
  const [researchList, setResearchList] = useState<ResearchItem[]>(
    MOCK_RESEARCH.map(r => ({ ...r, status: calculateStatus(r) }))
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [schemeFilter, setSchemeFilter] = useState('Semua Skema');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [yearFilter, setYearFilter] = useState('Semua Tahun');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResearchDetail, setSelectedResearchDetail] = useState<ResearchItem | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ResearchItem | null>(null);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [researchToDelete, setResearchToDelete] = useState<ResearchItem | null>(null);
  const [previewData, setPreviewData] = useState<{ name: string; url: string; type: string } | null>(null);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedImportFile, setSelectedImportFile] = useState<File | null>(null);

  const [uploadModalState, setUploadModalState] = useState<{
    isOpen: boolean;
    researchId: string;
    type: 'proposal' | 'progress' | 'final';
  }>({
    isOpen: false,
    researchId: '',
    type: 'proposal'
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);

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

  const totalPages = Math.max(1, Math.ceil(filteredResearch.length / rowsPerPage));

  const handleResetFilters = () => {
    setSearchQuery('');
    setSchemeFilter('Semua Skema');
    setStatusFilter('Semua Status');
    setYearFilter('Semua Tahun');
    setCurrentPage(1);
    showToast('Filter telah direset.', 'info');
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setGlobalBlur(true);
  };

  const openEditModal = (item: ResearchItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
    setGlobalBlur(true);
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingItem(null);
    setGlobalBlur(false);
  };

  const handleAddSave = (newItem: ResearchItem) => {
    setResearchList([{ ...newItem, status: calculateStatus(newItem) }, ...researchList]);
    showToast('Data Penelitian ditambahkan', 'success');
  };

  const handleEditSave = (updatedItem: ResearchItem) => {
    setResearchList(prev => prev.map(item => item.id === updatedItem.id ? { ...updatedItem, status: calculateStatus(updatedItem) } : item));
    showToast('Data Penelitian diperbarui', 'info');
  };

  const openDeleteConfirm = (item: ResearchItem) => {
    setResearchToDelete(item);
    setIsDeleteConfirmOpen(true);
    setGlobalBlur(true);
  };

  const handleDelete = () => {
    if (researchToDelete) {
      setResearchList(prev => prev.filter(item => item.id !== researchToDelete.id));
      showToast('Penelitian berhasil dihapus.', 'delete');
      setIsDeleteConfirmOpen(false);
      setResearchToDelete(null);
      setGlobalBlur(false);
    }
  };

  const handleDownload = (item: ResearchItem, type: 'proposal' | 'progress' | 'final') => {
    let fileName = '';
    let fileObj: File | undefined = undefined;

    if (type === 'proposal') { fileName = item.proposalFileName || ''; fileObj = item.proposalFile; }
    else if (type === 'progress') { fileName = item.progressReport || ''; fileObj = item.progressFile; }
    else if (type === 'final') { fileName = item.finalReport || ''; fileObj = item.finalFile; }

    if (!fileName) return;

    if (fileObj) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(fileObj);
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(a.href);
    } else {
      const blob = new Blob([`Demo ${type} document`], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(a.href);
    }
    showToast(`Mengunduh ${fileName}`, 'info');
  };

  const openPreview = (item: ResearchItem, type: 'proposal' | 'progress' | 'final') => {
    let fileName = '';
    let fileObj: File | undefined = undefined;

    if (type === 'proposal') { fileName = item.proposalFileName || ''; fileObj = item.proposalFile; }
    else if (type === 'progress') { fileName = item.progressReport || ''; fileObj = item.progressFile; }
    else if (type === 'final') { fileName = item.finalReport || ''; fileObj = item.finalFile; }

    if (!fileName) return;

    const isPdf = fileName.toLowerCase().endsWith('.pdf');
    const url = fileObj ? URL.createObjectURL(fileObj) : '';
    setPreviewData({ name: fileName, url, type: isPdf ? 'pdf' : 'docx' });
    setGlobalBlur(true);
  };

  const closePreview = () => {
    if (previewData?.url) URL.revokeObjectURL(previewData.url);
    setPreviewData(null);
    if (!selectedResearchDetail) setGlobalBlur(false); 
  };

  const handleTriggerReportUpload = (id: string, type: 'proposal' | 'progress' | 'final') => {
    setUploadModalState({ isOpen: true, researchId: id, type });
    setUploadFile(null);
    setGlobalBlur(true);
  };

  const handleUploadReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      showToast('Silakan pilih berkas terlebih dahulu', 'error');
      return;
    }

    setResearchList(prev => prev.map(item => {
      if (item.id === uploadModalState.researchId) {
        const title = item.title;
        const nidn = "1-402022-048";
        const cleanTitle = title.replace(/[\/\\:*?"<>|]/g, '').trim();
        const cleanNidn = nidn.replace(/-/g, '');
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const extension = uploadFile.name.split('.').pop() || 'pdf';

        const updated = { ...item };
        let newFileName = '';

        if (uploadModalState.type === 'progress') {
          newFileName = `${cleanTitle}_Progress_${cleanNidn}_${dateStr}.${extension}`;
          updated.progressReport = newFileName;
          updated.progressFile = uploadFile;
        } else if (uploadModalState.type === 'final') {
          newFileName = `${cleanTitle}_Final_${cleanNidn}_${dateStr}.${extension}`;
          updated.finalReport = newFileName;
          updated.finalFile = uploadFile;
        } else if (uploadModalState.type === 'proposal') {
          newFileName = `${cleanTitle}_${cleanNidn}_${dateStr}.${extension}`;
          updated.proposalFileName = newFileName;
          updated.proposalFile = uploadFile;
        }
        updated.status = calculateStatus(updated);
        return updated;
      }
      return item;
    }));

    showToast(`Laporan berhasil diunggah`, 'success');
    setUploadModalState({ isOpen: false, researchId: '', type: 'proposal' });
    setUploadFile(null);
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
        {selectedResearchDetail ? (
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={modalTransition}
          >
            <DetailPenelitianModal 
              detail={selectedResearchDetail} 
              onBack={() => { setSelectedResearchDetail(null); setGlobalBlur(false); }} 
              onPreview={openPreview}
              onDownload={handleDownload}
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
                <p className="text-[13px] md:text-[14px] text-slate-400 dark:text-neutral-500 font-medium tracking-tight">Kelola data penelitian akademik, hibah, dan laporan kemajuan Anda.</p>
              </div>
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                <motion.button {...btnScaleDown} onClick={openAddModal} className="h-[48px] px-8 bg-primary-600 text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-primary-700 transition-all active:scale-95"><Plus className="w-4 h-4" /> Tambah Penelitian</motion.button>
                <button onClick={() => { setIsImportModalOpen(true); setGlobalBlur(true); }} className="h-[48px] px-6 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"><FileUp className="w-4 h-4" /> Import Excel</button>
                <button className="h-[48px] px-6 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"><FileDown className="w-4 h-4" /> Export Excel</button>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0D0D0D] border md:rounded-[2.5rem] shadow-sm flex flex-col overflow-hidden mx-4 md:mx-0">
              <PenelitianFilter 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                schemeFilter={schemeFilter}
                setSchemeFilter={setSchemeFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                yearFilter={yearFilter}
                setYearFilter={setYearFilter}
                onReset={handleResetFilters}
              />

              <PenelitianTable 
                paginatedResearch={paginatedResearch}
                filteredResearchLength={filteredResearch.length}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                setSelectedResearchDetail={setSelectedResearchDetail}
                openEditModal={openEditModal}
                openDeleteConfirm={openDeleteConfirm}
                handleDownload={handleDownload}
                openPreview={openPreview}
                handleTriggerReportUpload={handleTriggerReportUpload}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AddPenelitianModal 
        isOpen={isAddModalOpen} 
        onClose={closeModals} 
        onSave={handleAddSave} 
      />

      <EditPenelitianModal 
        isOpen={isEditModalOpen} 
        onClose={closeModals} 
        onSave={handleEditSave} 
        initialData={editingItem} 
      />

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
              <h3 className="text-[20px] font-black text-slate-900 dark:text-white mb-2 tracking-tight">Hapus Penelitian?</h3>
              <div className="space-y-4 mb-10">
                <p className="text-slate-500 dark:text-neutral-500 text-[14px] leading-relaxed">
                  Data penelitian yang dihapus tidak dapat dikembalikan.
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
                  onClick={handleDelete} 
                  className="w-full h-[52px] bg-red-500 text-white font-black rounded-2xl shadow-xl shadow-red-500/20 active:scale-[0.98] transition-all hover:bg-red-600"
                >
                  Hapus Penelitian
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
                  onClick={() => { setIsImportModalOpen(false); setGlobalBlur(false); setSelectedImportFile(null); showToast("Data Penelitian berhasil diimport.", "success"); }} 
                  className="flex-[2] h-[52px] bg-primary-600 text-white font-black rounded-2xl shadow-xl disabled:opacity-50 active:scale-[0.98] transition-all hover:bg-primary-700"
                >
                  Mulai Import
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {uploadModalState.isOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0 bg-black/45 dark:bg-black/80 backdrop-blur-md" 
              onClick={() => { setUploadModalState({ isOpen: false, researchId: '', type: 'proposal' }); setUploadFile(null); setGlobalBlur(false); }} 
            />
            <motion.div 
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={modalTransition}
              className="relative bg-white dark:bg-[#0D0D0D] w-full max-w-[450px] rounded-[2.5rem] shadow-2xl p-10 text-center border border-slate-100 dark:border-white/10"
            >
              <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8">
                <FileUp className="w-8 h-8" />
              </div>
              <h3 className="text-[20px] font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                Unggah {uploadModalState.type === 'progress' ? 'Laporan Kemajuan' : uploadModalState.type === 'final' ? 'Laporan Akhir' : 'Proposal'}
              </h3>
              <p className="text-[13px] text-slate-500 dark:text-neutral-400 mb-8 font-medium">
                Pilih berkas laporan untuk memperbarui progress penelitian. Format yang didukung: PDF.
              </p>
              
              <form onSubmit={handleUploadReport} className="text-left space-y-6">
                <DragAndDropUpload 
                  file={uploadFile} 
                  onFileSelect={setUploadFile} 
                  onError={(msg) => showToast(msg, 'error')}
                />
                
                <div className="flex gap-3 pt-6 border-t border-slate-100 dark:border-white/10">
                  <button 
                    type="button" 
                    onClick={() => { setUploadModalState({ isOpen: false, researchId: '', type: 'proposal' }); setUploadFile(null); setGlobalBlur(false); }} 
                    className="flex-1 h-[52px] bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-neutral-400 font-bold rounded-2xl active:scale-[0.98] transition-all hover:bg-slate-100 dark:hover:bg-white/10"
                  >
                    Batal
                  </button>
                  <motion.button 
                    {...btnScaleDown}
                    type="submit" 
                    disabled={!uploadFile}
                    className="flex-[2] h-[52px] bg-primary-600 text-white font-black rounded-2xl shadow-xl shadow-primary-600/20 active:scale-[0.98] transition-all disabled:opacity-50 hover:bg-primary-700"
                  >
                    Unggah Laporan
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
