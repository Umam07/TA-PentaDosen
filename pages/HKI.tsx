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
  HKIItem, 
  backdropVariants, 
  modalVariants, 
  modalTransition, 
  btnScaleDown,
} from '../components/hki/shared';
import { HKIFilter } from '../components/hki/HKIFilter';
import { HKITable } from '../components/hki/HKITable';
import { DetailHKIModal } from '../components/hki/DetailHKIModal';
import { AddHKIModal } from '../components/hki/AddHKIModal';
import { EditHKIModal } from '../components/hki/EditHKIModal';
import { DragAndDropUpload } from '../components/hki/DragAndDropUpload';

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
    year: '2025',
    status: 'Lengkap'
  }
];

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HKIItem | null>(null);
  
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedImportFile, setSelectedImportFile] = useState<File | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [hkiToDelete, setHkiToDelete] = useState<HKIItem | null>(null);
  const [previewData, setPreviewData] = useState<{ name: string; url: string; type: string } | null>(null);

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
    showToast('Filter telah direset.', 'info');
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setGlobalBlur(true);
  };

  const openEditModal = (item: HKIItem) => {
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

  const handleAddSave = (newItem: HKIItem) => {
    setHkiList([newItem, ...hkiList]);
    showToast('Data HKI berhasil ditambahkan', 'success');
    closeModals();
  };

  const handleEditSave = (updatedItem: HKIItem) => {
    setHkiList(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    showToast('Data HKI diperbarui', 'info');
    closeModals();
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
            <DetailHKIModal 
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
                <motion.button {...btnScaleDown} onClick={openAddModal} className="h-[48px] px-8 bg-primary-600 text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-primary-700 transition-all active:scale-95"><Plus className="w-4 h-4" /> Tambah HKI</motion.button>
                <button onClick={() => { setIsImportModalOpen(true); setGlobalBlur(true); }} className="h-[48px] px-6 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"><FileUp className="w-4 h-4" /> Import Excel</button>
                <button className="h-[48px] px-6 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"><FileDown className="w-4 h-4" /> Export Excel</button>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0D0D0D] border md:rounded-[2.5rem] shadow-sm flex flex-col overflow-hidden mx-4 md:mx-0">
              <HKIFilter 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                yearFilter={yearFilter}
                setYearFilter={setYearFilter}
                onReset={handleResetFilters}
              />

              <HKITable 
                paginatedHKI={paginatedHKI}
                filteredHKILength={filteredHKI.length}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                openPreview={openPreview}
                handleDownload={handleDownload}
                setSelectedHkiDetail={setSelectedHkiDetail}
                openEditModal={openEditModal}
                onDeleteConfirm={(item) => { setHkiToDelete(item); setIsDeleteConfirmOpen(true); setGlobalBlur(true); }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AddHKIModal 
        isOpen={isAddModalOpen} 
        onClose={closeModals} 
        onSave={handleAddSave} 
        showToast={showToast} 
      />

      <EditHKIModal 
        isOpen={isEditModalOpen} 
        onClose={closeModals} 
        onSave={handleEditSave} 
        showToast={showToast} 
        initialData={editingItem} 
      />

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
