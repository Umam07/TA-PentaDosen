import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  X,
  Pencil,
  AlertCircle
} from 'lucide-react';
import { useLayout } from '../components/layout/AppLayout';

interface UserItem {
  id: number;
  nama: string;
  email: string;
  nidn: string;
  role: 'super_admin' | 'admin' | 'dosen';
}

const MOCK_USERS: UserItem[] = [
  {
    id: 1,
    nama: "Ahmad Fauzi",
    email: "ahmad@kampus.ac.id",
    nidn: "1987654321",
    role: "dosen"
  },
  {
    id: 2,
    nama: "Siti Nurhaliza",
    email: "siti@kampus.ac.id",
    nidn: "1981234567",
    role: "admin"
  },
  {
    id: 3,
    nama: "Budi Santoso",
    email: "budi@kampus.ac.id",
    nidn: "1989988776",
    role: "super_admin"
  }
];

const getRoleStyles = (role: UserItem['role']) => {
  switch (role) {
    case 'super_admin':
      return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30';
    case 'admin':
      return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30';
    case 'dosen':
      return 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-neutral-400 border-slate-100 dark:border-white/10';
    default:
      return 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-neutral-400 border-slate-100 dark:border-white/10';
  }
};

const getRoleLabel = (role: UserItem['role']) => {
  switch (role) {
    case 'super_admin': return 'Super Admin';
    case 'admin': return 'Admin';
    case 'dosen': return 'Dosen';
    default: return role;
  }
};

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
  ease: [0.22, 1, 0.36, 1]
};

const btnScaleDown = {
  whileTap: { scale: 0.96 },
  transition: { duration: 0.12, ease: "easeOut" as any }
};

const ActionButton: React.FC<{
  icon: React.ReactNode;
  tooltip?: string;
  variant?: 'primary' | 'ghost' | 'danger';
  onClick?: () => void;
  children?: React.ReactNode;
}> = ({ icon, tooltip, variant = 'primary', onClick, children }) => {
  const baseStyles = "h-10 md:h-9 flex items-center justify-center rounded-xl transition-all active:scale-90 group/btn relative";
  const variantStyles = {
    primary: "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-neutral-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/30 border border-slate-200 dark:border-white/10 shadow-sm",
    ghost: "text-slate-400 dark:text-neutral-600 hover:text-primary-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5",
    danger: "text-slate-400 dark:text-neutral-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
  };
  return (
    <motion.button 
      {...btnScaleDown}
      type="button" 
      className={`${baseStyles} ${variantStyles[variant]} ${children ? 'px-4 gap-2' : 'w-10 md:w-9'}`} 
      onClick={onClick}
    >
      {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-[18px] h-[18px]' })}
      {children && <span className="text-[12px] font-bold">{children}</span>}
      {tooltip && !children && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-all duration-300 whitespace-nowrap z-[100] shadow-xl border border-white/10 hidden md:block">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-slate-900 dark:border-t-white"></div>
        </div>
      )}
    </motion.button>
  );
};

export const ManajemenPengguna: React.FC = () => {
  const { setGlobalBlur, showToast } = useLayout();
  const [users, setUsers] = useState<UserItem[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Semua Role');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [formRole, setFormRole] = useState<UserItem['role']>('dosen');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesRole = true;
      if (roleFilter !== 'Semua Role') {
        if (roleFilter === 'Super Admin') matchesRole = user.role === 'super_admin';
        else if (roleFilter === 'Admin') matchesRole = user.role === 'admin';
        else if (roleFilter === 'Dosen') matchesRole = user.role === 'dosen';
      }
      
      return matchesSearch && matchesRole;
    });
  }, [searchQuery, roleFilter, users]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage));

  const handleResetFilters = () => {
    setSearchQuery('');
    setRoleFilter('Semua Role');
    setCurrentPage(1);
    showToast('Filter telah direset.', 'info');
  };

  const openEditModal = (user: UserItem) => {
    setSelectedUser(user);
    setFormRole(user.role);
    setIsEditModalOpen(true);
    setGlobalBlur(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    setGlobalBlur(false);
  };

  const handleSaveClick = () => {
    if (selectedUser?.role === formRole) {
      closeEditModal();
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    if (selectedUser) {
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, role: formRole } : u));
      showToast('Role pengguna berhasil diperbarui', 'success');
    }
    setIsConfirmOpen(false);
    closeEditModal();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="space-y-8">
        <div className="space-y-6 px-4 md:px-0">
          <div className="space-y-1.5">
            <h1 className="text-[20px] md:text-[24px] font-bold text-slate-900 dark:text-white tracking-tight">Manajemen Pengguna</h1>
            <p className="text-[13px] md:text-[14px] text-slate-400 dark:text-neutral-500 font-medium tracking-tight">Kelola daftar pengguna dan hak akses role pada sistem.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0D0D0D] border md:rounded-[2.5rem] shadow-sm flex flex-col overflow-hidden mx-4 md:mx-0">
          <div className="px-6 md:px-10 py-6 md:py-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01]">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Cari Pengguna</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Cari nama atau email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-11 pl-11 pr-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-medium outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Role</label>
                  <div className="relative">
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-full h-11 appearance-none pl-4 pr-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-semibold outline-none cursor-pointer text-slate-700 dark:text-neutral-200">
                      <option>Semua Role</option>
                      <option>Super Admin</option>
                      <option>Admin</option>
                      <option>Dosen</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <button onClick={handleResetFilters} className="h-11 px-6 bg-white dark:bg-white/5 text-slate-500 dark:text-neutral-400 font-bold rounded-xl border border-slate-200 dark:border-white/10 hover:text-primary-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm shrink-0"><RotateCcw className="w-4 h-4" /> Reset Filter</button>
            </div>
          </div>

          <div className="hidden md:block overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/30 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/10">
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Nama</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Email</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">NIDN</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Role</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {paginatedUsers.length > 0 ? paginatedUsers.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6"><span className="text-[14px] font-bold text-slate-900 dark:text-white leading-snug">{item.nama}</span></td>
                    <td className="px-6 py-6"><span className="text-[13px] font-medium text-slate-600 dark:text-neutral-400">{item.email}</span></td>
                    <td className="px-6 py-6"><span className="text-[13px] font-medium text-slate-600 dark:text-neutral-400 tabular-nums">{item.nidn}</span></td>
                    <td className="px-6 py-6 text-center"><span className={`inline-block px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap text-center leading-none ${getRoleStyles(item.role)}`}>{getRoleLabel(item.role)}</span></td>
                    <td className="px-8 py-6"><div className="flex items-center justify-end gap-2.5"><ActionButton icon={<Pencil />} variant="ghost" onClick={() => openEditModal(item)}>Ubah Role</ActionButton></div></td>
                  </tr>
                )) : <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-medium">Tidak ada data pengguna ditemukan.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-white/5">
            {paginatedUsers.length > 0 ? paginatedUsers.map((item) => (
              <div key={item.id} className="p-6 space-y-5 bg-white dark:bg-transparent">
                <h4 className="text-[16px] font-bold text-slate-900 dark:text-white leading-relaxed">{item.nama}</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p><p className="text-[13px] font-medium text-slate-700 dark:text-neutral-200">{item.email}</p></div>
                  <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NIDN</p><p className="text-[13px] font-medium text-slate-700 dark:text-neutral-200">{item.nidn}</p></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-block px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap text-center leading-none ${getRoleStyles(item.role)}`}>{getRoleLabel(item.role)}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                  <div className="flex gap-1.5">
                    <ActionButton icon={<Pencil />} variant="ghost" onClick={() => openEditModal(item)}>Ubah Role</ActionButton>
                  </div>
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
              <p className="text-[13px] font-semibold text-slate-400">Menampilkan {paginatedUsers.length} dari {filteredUsers.length} pengguna</p>
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
      </div>

      <AnimatePresence>
        {isEditModalOpen && selectedUser && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center">
            <motion.div 
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0 bg-black/45 dark:bg-black/80 backdrop-blur-md" 
              onClick={closeEditModal} 
            />
            <motion.div 
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={modalTransition}
              className="relative bg-white dark:bg-[#0A0A0A] w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-white/5 flex flex-col m-4"
            >
              <div className="px-8 py-6 flex justify-between items-center border-b border-slate-50 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-[1.25rem] flex items-center justify-center shadow-sm">
                    <Pencil className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-black text-slate-900 dark:text-white tracking-tight">Ubah Role Pengguna</h3>
                  </div>
                </div>
                <button onClick={closeEditModal} className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-slate-900"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-8 space-y-6">
                <div className="p-5 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl border border-slate-100 dark:border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Nama</span>
                    <span className="text-[13px] font-bold text-slate-900 dark:text-white">{selectedUser.nama}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Email</span>
                    <span className="text-[13px] font-medium text-slate-600 dark:text-neutral-300">{selectedUser.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">NIDN</span>
                    <span className="text-[13px] font-medium text-slate-600 dark:text-neutral-300">{selectedUser.nidn}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pilih Role Baru</label>
                  <div className="relative">
                    <select 
                      value={formRole} 
                      onChange={e => setFormRole(e.target.value as UserItem['role'])} 
                      className="w-full h-[52px] appearance-none px-5 bg-white dark:bg-neutral-900 rounded-2xl outline-none border border-slate-200 dark:border-white/10 focus:border-primary-600/50 dark:text-white text-[14px] font-semibold transition-all cursor-pointer"
                    >
                      <option value="dosen">Dosen</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="px-8 py-6 border-t border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex justify-end gap-3">
                <button onClick={closeEditModal} className="h-12 px-6 bg-white dark:bg-white/5 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm">Batal</button>
                <button onClick={handleSaveClick} className="h-12 px-8 bg-primary-600 text-white rounded-xl text-[13px] font-bold hover:bg-primary-700 transition-all active:scale-95 shadow-lg">Simpan Perubahan</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isConfirmOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center">
            <motion.div 
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 bg-black/45 dark:bg-black/80 backdrop-blur-md" 
              onClick={() => setIsConfirmOpen(false)} 
            />
            <motion.div 
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative bg-white dark:bg-[#0A0A0A] w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-white/5 p-8 text-center m-4"
            >
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-[20px] font-black text-slate-900 dark:text-white mb-2">Konfirmasi Perubahan</h3>
              <p className="text-[14px] text-slate-500 dark:text-neutral-400 mb-8 leading-relaxed">
                Apakah Anda yakin ingin mengubah role pengguna ini menjadi <span className="font-bold text-slate-900 dark:text-white">{getRoleLabel(formRole)}</span>?
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setIsConfirmOpen(false)} className="h-12 px-6 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-300 rounded-xl text-[13px] font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-95">Batal</button>
                <button onClick={handleConfirmSave} className="h-12 px-8 bg-amber-500 text-white rounded-xl text-[13px] font-bold hover:bg-amber-600 transition-all active:scale-95 shadow-lg shadow-amber-500/25">Ya, Ubah Role</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
