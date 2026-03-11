import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, User, Info, Users, Building2, GraduationCap, FileText, ChevronDown, Globe, Hash, Layers } from 'lucide-react';
import { PublicationItem, MEMBER_SUGGESTIONS, backdropVariants, modalVariants, modalTransition, btnScaleDown, generateFileName, formatISBN } from './shared';
import { DragAndDropUpload } from './DragAndDropUpload';

interface AddPublikasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: PublicationItem) => void;
}

export const AddPublikasiModal: React.FC<AddPublikasiModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
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
  const [manuscriptFile, setManuscriptFile] = useState<File | null>(null);

  const authorContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (authorContainerRef.current && !authorContainerRef.current.contains(event.target as Node)) {
        setIsAuthorDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCategory || !formType) return;
    
    if (formIsbn.replace(/\D/g, '').length !== 13) {
      alert('ISBN harus tepat 13 digit.');
      return;
    }

    const nidn = "1-402022-048";
    const finalStatus = manuscriptFile ? 'Lengkap' : 'Sedang Berjalan';

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
      year: formYear,
      status: finalStatus,
      manuscriptFile: manuscriptFile || undefined,
      manuscriptFileName: manuscriptFile ? generateFileName(formTitle, nidn, manuscriptFile) : undefined
    };
    onSave(newItem);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center">
      <motion.div 
        variants={backdropVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="absolute inset-0 bg-black/45 dark:bg-black/80 backdrop-blur-md" 
        onClick={onClose}
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
            <div className="w-12 h-12 bg-primary-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-xl">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[20px] md:text-[24px] font-black text-slate-900 dark:text-white tracking-tight">Tambah Publikasi Baru</h3>
              <p className="text-[12px] text-slate-400 mt-1">Daftarkan karya ilmiah atau buku akademik Anda.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-slate-900"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 md:px-12 py-10 custom-scrollbar space-y-12">
          
          <div className="space-y-6">
            <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center"><User className="w-4 h-4" /></div><h4 className="text-[16px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Informasi Penulis Utama</h4></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 p-8 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-[2.5rem] opacity-60 pointer-events-none">
              <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Full Name</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><User className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">Dr. Jane Doe, M.T.</span></div></div>
              <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">NIDN</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><Info className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">1-402022-048</span></div></div>
              <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">NIP</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><Info className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">14020220-488888-88-88</span></div></div>
              <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Academic Rank</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><Users className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">Dosen Tetap</span></div></div>
              <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">University</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><Building2 className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">Universitas YARSI</span></div></div>
              <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Faculty</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><Building2 className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">Fakultas Teknologi Informasi</span></div></div>
              <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Study Program</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><GraduationCap className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">Teknik Informatika</span></div></div>
              <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Email</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><FileText className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">jane.doe@fti.yarsi.ac.id</span></div></div>
              <div className="col-span-full pt-4 flex items-center gap-3 text-[12px] font-bold text-amber-600 bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10"><Info className="w-4 h-4 shrink-0" />Data bersifat baca-saja dan diambil otomatis dari profil Ketua Penulis.</div>
            </div>
          </div>

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
            <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center"><Layers className="w-4 h-4" /></div><h4 className="text-[16px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Deskripsi / Abstrak</h4></div>
            <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Abstrak (Opsional)</label><textarea value={formAbstract} onChange={e => setFormAbstract(e.target.value)} placeholder="Tuliskan ringkasan publikasi..." className="w-full px-6 py-4 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl outline-none focus:border-primary-600/30 border border-transparent dark:text-white min-h-[150px] text-[14px] font-normal" /></div>
          </div>

          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center"><Layers className="w-4 h-4" /></div><h4 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Manuskrip Utama</h4></div>
              <DragAndDropUpload 
                file={manuscriptFile} 
                onFileSelect={setManuscriptFile} 
                acceptedTypes={['.pdf']} 
                helperText="Hanya PDF (Max 10MB)" 
              />
            </div>
          </div>

          <div className="pt-8 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 h-[56px] border border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-colors">
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
  );
};
