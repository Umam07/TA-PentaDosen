import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, User, Info, Users, Building2, GraduationCap, FileText, ChevronDown, Layers } from 'lucide-react';
import { backdropVariants, modalVariants, modalTransition, btnScaleDown, MEMBER_SUGGESTIONS, generateResearchFileName, ResearchItem } from './shared';
import { DragAndDropUpload } from './DragAndDropUpload';
import { formatIndonesianCurrency } from './utils';
import { useLayout } from '../../components/layout/AppLayout';

interface AddPenelitianModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newItem: ResearchItem) => void;
}

export const AddPenelitianModal: React.FC<AddPenelitianModalProps> = ({ isOpen, onClose, onSave }) => {
  const { showToast, setGlobalBlur } = useLayout();
  const nidn = "1-402022-048";

  const [formTitle, setFormTitle] = useState('');
  const [formScheme, setFormScheme] = useState(''); 
  const [formSumberDana, setFormSumberDana] = useState(''); 
  const [formOtherSumberDana, setFormOtherSumberDana] = useState('');
  const [budgetProposed, setBudgetProposed] = useState('');
  const [budgetFunded, setBudgetFunded] = useState('');
  const [formYear, setFormYear] = useState('2026'); 
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [proposalFile, setProposalFile] = useState<File | null>(null);
  
  const [memberSearch, setMemberSearch] = useState('');
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const memberContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setGlobalBlur(true);
    } else {
      setGlobalBlur(false);
    }
  }, [isOpen, setGlobalBlur]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (memberContainerRef.current && !memberContainerRef.current.contains(event.target as Node)) {
        setIsMemberDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMemberAdd = (member: string) => {
    if (!selectedMembers.includes(member)) setSelectedMembers([...selectedMembers, member]);
    setMemberSearch('');
    setIsMemberDropdownOpen(false);
  };

  const handleMemberRemove = (member: string) => {
    setSelectedMembers(selectedMembers.filter(m => m !== member));
  };

  const handleBudgetChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setter(rawValue);
  };

  const calculateStatus = (item: Partial<ResearchItem>) => {
    if (item.proposalFileName && item.progressReport && item.finalReport) return 'Lengkap';
    if (item.proposalFileName && item.progressReport) return 'Sedang Berjalan';
    if (item.proposalFileName) return 'Proposal';
    return 'Ditolak';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) { showToast('Judul penelitian wajib diisi.', 'error'); return; }
    if (!formScheme) { showToast('Mohon pilih skema penelitian.', 'error'); return; }
    if (!formSumberDana) { showToast('Mohon pilih sumber dana.', 'error'); return; }
    if (selectedMembers.length === 0) { showToast('Anggota peneliti wajib diisi minimal 1 orang.', 'error'); return; }
    
    const cleanBudgetFunded = budgetFunded.replace(/\D/g, '');
    const cleanBudgetProposed = budgetProposed.replace(/\D/g, '');

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
      proposalFileName: proposalFile ? generateResearchFileName(formTitle, nidn, proposalFile, 'proposal') : undefined,
      proposalFile: proposalFile || undefined
    };
    
    const newItem = { ...newItemPart, status: calculateStatus(newItemPart) } as ResearchItem;
    onSave(newItem);
    showToast('Data penelitian berhasil disimpan!', 'success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center">
      <motion.div 
        variants={backdropVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25, ease: "easeOut" }}
        className="absolute inset-0 bg-black/45 dark:bg-black/80 backdrop-blur-md" 
        onClick={onClose}
      />
      <motion.div 
        variants={modalVariants} initial="initial" animate="animate" exit="exit" transition={modalTransition}
        className="relative bg-white dark:bg-[#0A0A0A] w-full max-w-5xl h-full md:h-auto md:max-h-[95vh] rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-white/5 flex flex-col"
      >
        <div className="px-8 py-6 md:px-12 md:py-8 flex justify-between items-center border-b border-slate-50 dark:border-white/5">
          <div className="flex items-center gap-4"><div className="w-12 h-12 bg-primary-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-primary-500/20"><Plus className="w-6 h-6" /></div><div><h3 className="text-[20px] md:text-[24px] font-black text-slate-900 dark:text-white tracking-tight">Tambah Penelitian Baru</h3><p className="text-[12px] text-slate-400 mt-1">Lengkapi data untuk mendaftarkan proposal atau proyek riset.</p></div></div>
          <button type="button" onClick={onClose} className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-slate-900"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 md:px-12 py-10 custom-scrollbar flex flex-col">
          <div className="space-y-12 flex-1">
            <div className="space-y-6">
              <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center"><User className="w-4 h-4" /></div><h4 className="text-[16px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Informasi Peneliti Utama</h4></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 p-8 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-[2.5rem] opacity-60">
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Full Name</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><User className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">Dr. Jane Doe, M.T.</span></div></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">NIDN</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><Info className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">1-402022-048</span></div></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">NIP</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><Info className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">14020220-488888-88-88</span></div></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Academic Rank</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><Users className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">Dosen Tetap</span></div></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">University</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><Building2 className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">Universitas YARSI</span></div></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Faculty</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><Building2 className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">Fakultas Teknologi Informasi</span></div></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Study Program</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><GraduationCap className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">Teknik Informatika</span></div></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Email</label><div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"><span className="text-slate-300"><FileText className="w-4 h-4" /></span><span className="text-[13px] font-normal text-slate-600 dark:text-neutral-400">jane.doe@fti.yarsi.ac.id</span></div></div>
                <div className="col-span-full pt-4 flex items-center gap-3 text-[12px] font-bold text-amber-600 bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10"><Info className="w-4 h-4 shrink-0" />Data bersifat baca-saja dan diambil otomatis dari profil Ketua Peneliti.</div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center"><FileText className="w-4 h-4" /></div><h4 className="text-[16px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Rincian Proposal Penelitian</h4></div>
              <div className="space-y-8">
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul Penelitian <span className="text-red-500">*</span></label><textarea required value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Masukkan judul lengkap..." className="w-full px-6 py-4 bg-slate-50 dark:bg-neutral-800/50 border border-transparent focus:border-primary-600/30 rounded-2xl outline-none text-[15px] font-normal min-h-[100px] dark:text-white" /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Skema <span className="text-red-500">*</span></label><div className="relative">
                    <select required value={formScheme} onChange={(e) => setFormScheme(e.target.value)} className={`w-full h-[52px] appearance-none px-5 bg-slate-50 dark:bg-neutral-800/50 border border-transparent rounded-2xl text-[14px] font-normal outline-none ${!formScheme ? 'text-slate-400 dark:text-neutral-500' : 'dark:text-white'}`}>
                      <option value="" disabled>Pilih skema</option><option value="Hibah Internal">Hibah Internal</option><option value="Hibah External">Hibah External</option><option value="Mandiri">Mandiri</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sumber Dana <span className="text-red-500">*</span></label><div className="relative">
                    <select required value={formSumberDana} onChange={(e) => setFormSumberDana(e.target.value)} className={`w-full h-[52px] appearance-none px-5 bg-slate-50 dark:bg-neutral-800/50 border border-transparent rounded-2xl text-[14px] font-normal outline-none ${!formSumberDana ? 'text-slate-400 dark:text-neutral-500' : 'dark:text-white'}`}>
                      <option value="" disabled>Pilih sumber dana</option><option value="Universitas YARSI">Universitas YARSI</option><option value="Lainnya">Lainnya</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div></div>
                </div>
                <div className={`grid transition-all duration-500 ${formSumberDana === 'Lainnya' ? 'grid-rows-[1fr] opacity-100 mb-2' : 'grid-rows-[0fr] opacity-0 mb-0'}`}><div className="overflow-hidden"><div className="space-y-2 pt-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Sumber Dana Lainnya</label><input type="text" value={formOtherSumberDana} onChange={(e) => setFormOtherSumberDana(e.target.value)} placeholder="Contoh: KEMENDIKBUDRISTEK" className="w-full h-[52px] px-6 bg-slate-50 dark:bg-neutral-800/50 border border-transparent rounded-2xl outline-none text-[15px] font-normal dark:text-white" /></div></div></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Anggaran Diusulkan (Rp) <span className="text-red-500">*</span></label><div className="relative"><div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[13px]">Rp</div><input type="text" required placeholder="0" value={formatIndonesianCurrency(budgetProposed)} onChange={handleBudgetChange(setBudgetProposed)} className="w-full h-[52px] pl-12 pr-5 bg-slate-50 dark:bg-neutral-800/50 border border-transparent rounded-2xl outline-none text-[15px] font-normal dark:text-white tabular-nums" /></div></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Anggaran Didanai (Rp) <span className="text-red-500">*</span></label><div className="relative"><div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[13px]">Rp</div><input type="text" required placeholder="0" value={formatIndonesianCurrency(budgetFunded)} onChange={handleBudgetChange(setBudgetFunded)} className="w-full h-[52px] pl-12 pr-5 bg-slate-50 dark:bg-neutral-800/50 border border-transparent rounded-2xl outline-none text-[15px] font-normal dark:text-white tabular-nums" /></div></div>
                </div>
                <div className="space-y-4" ref={memberContainerRef}><div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Anggota Peneliti *</label><div className="relative"><div className={`h-[52px] w-full bg-slate-50 dark:bg-neutral-800/50 border rounded-2xl flex items-center ${isMemberDropdownOpen ? 'border-primary-600/30 ring-4 ring-primary-500/5' : 'border-transparent'}`}><Users className="w-5 h-5 ml-5 text-slate-400" /><input type="text" placeholder="Cari anggota..." value={memberSearch} onChange={(e) => { setMemberSearch(e.target.value); setIsMemberDropdownOpen(true); }} onFocus={() => setIsMemberDropdownOpen(true)} className="flex-1 bg-transparent outline-none px-4 text-[14px] font-normal dark:text-white h-full" /></div>{isMemberDropdownOpen && (<div className="absolute z-[110] top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-neutral-900 border border-slate-100 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden"><div className="max-h-60 overflow-y-auto p-2 space-y-1">{MEMBER_SUGGESTIONS.filter(m => m.toLowerCase().includes(memberSearch.toLowerCase()) && !selectedMembers.includes(m)).map(member => (<button key={member} type="button" onClick={() => handleMemberAdd(member)} className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center justify-between group"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400 flex items-center justify-center font-black text-[10px]">{member[0]}</div><span className="text-[13px] font-normal text-slate-700 dark:text-neutral-200 group-hover:bg-slate-50/10 transition-colors">{member}</span></div><Plus className="w-4 h-4 text-slate-300 group-hover:text-primary-600" /></button>))}</div></div>)}</div></div><div className="flex flex-wrap gap-2.5 pt-1">
                  <div className="h-10 px-4 bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/20 rounded-xl flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-primary-600 text-[10px] font-black text-white flex items-center justify-center shadow-sm">JD</div><div className="flex items-center gap-2"><span className="text-[13px] font-semibold text-primary-700 dark:text-primary-300">Dr. Jane Doe, M.T.</span><span className="px-2 py-0.5 bg-primary-600/10 text-primary-600 dark:text-primary-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-primary-600/10 whitespace-nowrap">Ketua Peneliti</span></div></div>
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
                      onFileSelect={setProposalFile} 
                      acceptedTypes={['.pdf']} 
                      helperText="Hanya PDF (Max 10MB)" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 -mx-8 md:-mx-12 px-8 py-8 md:px-12 border-t border-slate-50 dark:border-white/5 flex gap-4 shrink-0"><button type="button" onClick={onClose} className="flex-1 h-[56px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-neutral-400 font-bold rounded-2xl active:scale-[0.98]">Batal</button><motion.button {...btnScaleDown} type="submit" className="flex-[2] h-[56px] bg-primary-600 text-white font-black rounded-2xl shadow-xl active:scale-[0.98]">Simpan Penelitian</motion.button></div>
        </form>
      </motion.div>
    </div>
  );
};
