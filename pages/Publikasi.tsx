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
import { 
  PublicationItem, 
  backdropVariants, 
  modalVariants, 
  modalTransition, 
  btnScaleDown,
  generateFileName
} from '../components/publikasi/shared';
import { PublikasiFilter } from '../components/publikasi/PublikasiFilter';
import { PublikasiTable } from '../components/publikasi/PublikasiTable';
import { DetailPublikasiModal } from '../components/publikasi/DetailPublikasiModal';
import { AddPublikasiModal } from '../components/publikasi/AddPublikasiModal';
import { EditPublikasiModal } from '../components/publikasi/EditPublikasiModal';
import { DragAndDropUpload } from '../components/publikasi/DragAndDropUpload';

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PublicationItem | null>(null);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [pubToDelete, setPubToDelete] = useState<PublicationItem | null>(null);
  const [previewData, setPreviewData] = useState<{ name: string; url: string; type: string } | null>(null);
  const [selectedImportFile, setSelectedImportFile] = useState<File | null>(null);

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
    showToast('Filter telah direset.', 'info');
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setGlobalBlur(true);
  };

  const openEditModal = (item: PublicationItem) => {
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

  const handleAddSave = (newItem: PublicationItem) => {
    setPublicationList([newItem, ...publicationList]);
    showToast('Publikasi ditambahkan.', 'success');
    closeModals();
  };

  const handleEditSave = (updatedItem: PublicationItem) => {
    setPublicationList(prev => prev.map(p => p.id === updatedItem.id ? updatedItem : p));
    showToast('Publikasi diperbarui.', 'info');
    closeModals();
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
    input.accept = '.pdf';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (extension !== '.pdf') {
          showToast('Hanya file format PDF yang diperbolehkan.', 'error');
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          showToast('File terlalu besar. Maksimal 10 MB.', 'error');
          return;
        }
        const nidn = "1-402022-048";
        setPublicationList(prev => prev.map(p => {
          if (p.id === id) {
            return { ...p, manuscriptFile: file, manuscriptFileName: generateFileName(p.title, nidn, file), status: 'Lengkap' };
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
            <DetailPublikasiModal 
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
              <PublikasiFilter 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                yearFilter={yearFilter}
                setYearFilter={setYearFilter}
                onReset={handleResetFilters}
              />

              <PublikasiTable 
                paginatedPubs={paginatedPubs}
                filteredPublicationsLength={filteredPublications.length}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                openPreview={openPreview}
                handleDownloadFile={handleDownloadFile}
                handleTriggerFileUpload={handleTriggerFileUpload}
                setSelectedPubDetail={setSelectedPubDetail}
                openEditModal={openEditModal}
                onDeleteConfirm={(item) => { setPubToDelete(item); setIsDeleteConfirmOpen(true); setGlobalBlur(true); }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AddPublikasiModal 
        isOpen={isAddModalOpen} 
        onClose={closeModals} 
        onSave={handleAddSave} 
      />

      <EditPublikasiModal 
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


