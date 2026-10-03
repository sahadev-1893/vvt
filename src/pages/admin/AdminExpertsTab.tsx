import React, { useState, useMemo } from 'react';
import { Expert, Wing } from '../../types';
import { storageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  Search,
  Download,
  X,
  Upload,
  UserCheck,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Briefcase,
  ExternalLink,
} from 'lucide-react';

interface AdminExpertsTabProps {
  experts: Expert[];
  wings: Wing[];
  onRefresh: () => void;
  isOpenModalInitial?: boolean;
}

export const AdminExpertsTab: React.FC<AdminExpertsTabProps> = ({
  experts,
  wings,
  onRefresh,
  isOpenModalInitial = false,
}) => {
  const { currentAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedWing, setSelectedWing] = useState('all');
  const [selectedDept, setSelectedDept] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(isOpenModalInitial);
  const [editingExpert, setEditingExpert] = useState<Expert | null>(null);

  const [formData, setFormData] = useState<Partial<Expert>>({
    name: '',
    designation: '',
    department: 'Department of Physics',
    wingId: 'all',
    qualification: '',
    experience: '',
    specialization: '',
    bio: '',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    email: '',
    phone: '',
    status: 'active',
    order: 1,
  });

  const departments = [
    'Department of Physics',
    'Department of Chemistry',
    'Department of Botany & Life Sciences',
    'Department of Zoology',
    'Department of Mathematics',
    'Department of Humanities & Languages',
    'Department of Commerce & Management',
    'Higher Secondary CHSE Faculty',
    'Academic Advisory Board',
    'Vocational & Skill Trainers',
  ];

  const openCreateModal = () => {
    setEditingExpert(null);
    setFormData({
      name: '',
      designation: '',
      department: 'Department of Physics',
      wingId: 'all',
      qualification: '',
      experience: '',
      specialization: '',
      bio: '',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      email: '',
      phone: '',
      status: 'active',
      order: experts.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (exp: Expert) => {
    setEditingExpert(exp);
    setFormData({ ...exp });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Permanently remove faculty/expert "${name}"?`)) return;
    storageService.deleteExpert(id, currentAdmin || undefined);
    onRefresh();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        photo: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.designation?.trim() || !formData.qualification?.trim()) {
      alert('Please fill in Name, Designation, and Qualification.');
      return;
    }

    const expertToSave: Expert = {
      id: editingExpert ? editingExpert.id : `exp-${Date.now()}`,
      name: formData.name.trim(),
      designation: formData.designation.trim(),
      department: formData.department || 'Academic Department',
      wingId: formData.wingId || 'all',
      qualification: formData.qualification.trim(),
      experience: formData.experience?.trim() || 'Senior Academician',
      specialization: formData.specialization?.trim() || 'Undergraduate & Higher Secondary Pedagogy',
      bio: formData.bio?.trim() || '',
      photo:
        formData.photo ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      email: formData.email?.trim() || 'info@vvt.edu.in',
      phone: formData.phone?.trim() || '+91 9437238689',
      status: formData.status || 'active',
      order: Number(formData.order) || 1,
      createdAt: editingExpert ? editingExpert.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageService.saveExpert(expertToSave, currentAdmin || undefined);
    setIsModalOpen(false);
    onRefresh();
  };

  const handleExportCSV = () => {
    const rows = experts.map((e) => ({
      ID: e.id,
      Name: e.name,
      Designation: e.designation,
      Department: e.department,
      Wing: getWingName(e.wingId),
      Qualification: e.qualification,
      Experience: e.experience,
      Specialization: e.specialization,
      Email: e.email,
      Phone: e.phone || '',
      Status: e.status,
    }));
    storageService.exportToCSV('VVT_Faculty_And_Experts_Report', rows);
  };

  const getWingName = (wingId: string) => {
    if (wingId === 'all') return 'All Trust Wings';
    const found = wings.find((w) => w.id === wingId || w.slug === wingId);
    return found ? found.shortName : wingId;
  };

  const filteredExperts = useMemo(() => {
    return experts.filter((exp) => {
      if (selectedWing !== 'all' && exp.wingId !== selectedWing) return false;
      if (selectedDept !== 'all' && exp.department !== selectedDept) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          exp.name.toLowerCase().includes(q) ||
          exp.designation.toLowerCase().includes(q) ||
          exp.department.toLowerCase().includes(q) ||
          exp.specialization.toLowerCase().includes(q) ||
          exp.qualification.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [experts, selectedWing, selectedDept, search]);

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold text-white">Faculty & Academic Experts</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {experts.length} Profiles
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Add, edit, update, upload details, photos, and export faculty and advisory experts across trust wings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
            title="Download / Export Experts Data to CSV"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Download Expert CSV</span>
          </button>

          <button
            onClick={openCreateModal}
            className="cursor-pointer px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Expert</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, subject, or qualification..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <select
          value={selectedWing}
          onChange={(e) => setSelectedWing(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
        >
          <option value="all">Filter by Wing (All Wings)</option>
          {wings.map((w) => (
            <option key={w.id} value={w.id}>
              {w.shortName} - {w.name}
            </option>
          ))}
        </select>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
        >
          <option value="all">Filter by Department (All)</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Experts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExperts.map((exp) => (
          <div
            key={exp.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={exp.photo}
                  alt={exp.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shadow-sm shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20 truncate">
                      {getWingName(exp.wingId)}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        exp.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {exp.status}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-white text-sm truncate mt-1">
                    {exp.name}
                  </h3>
                  <p className="text-xs text-amber-400 truncate">{exp.designation}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 bg-slate-950/40 p-3 rounded-2xl border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{exp.qualification}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{exp.experience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{exp.specialization}</span>
                </div>
              </div>

              {exp.bio && (
                <p className="text-xs text-slate-400 line-clamp-2 italic leading-relaxed">
                  "{exp.bio}"
                </p>
              )}

              <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                  {exp.email}
                </span>
                {exp.phone && (
                  <span className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                    {exp.phone}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-800">
              <button
                onClick={() => openEditModal(exp)}
                className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit / Update</span>
              </button>

              <button
                onClick={() => handleDelete(exp.id, exp.name)}
                className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredExperts.length === 0 && (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <Award className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-slate-400 text-sm font-semibold">No faculty or academic experts found.</p>
          <button
            onClick={openCreateModal}
            className="cursor-pointer px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Expert</span>
          </button>
        </div>
      )}

      {/* Add / Edit Expert Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">
                    {editingExpert ? 'Edit / Update Faculty & Expert' : 'Add New Faculty & Expert'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Profiles synchronize directly to Supabase table (vvt_experts)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Full Name & Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Ramesh Chandra Mahanta"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Designation / Role <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Principal & Professor of Physics"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Affiliated Wing</label>
                  <select
                    value={formData.wingId}
                    onChange={(e) => setFormData({ ...formData, wingId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="all">All Trust Wings / Central</option>
                    {wings.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.shortName} - {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Academic Qualifications <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g. M.Sc. (Physics), Ph.D., CSIR-NET"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Teaching & Research Experience</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g. 18+ Years in CHSE & Degree Pedagogy"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Specialization & Research Interests</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="e.g. Solid State Physics, Organic Synthesis, Ethnobotany, ELT"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Photo Upload & URL */}
              <div className="space-y-2 p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                <label className="block text-slate-300 font-bold mb-1">Profile Photo (Upload or URL)</label>
                <div className="flex items-center gap-3">
                  <img
                    src={formData.photo}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={formData.photo}
                      onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                      placeholder="Image URL..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400 hover:text-amber-300">
                      <Upload className="w-3 h-3" />
                      <span>Upload Photo File from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Official Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. faculty.name@vvt.edu.in"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9437XXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Biographical Profile / Highlights</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Summary of research publications, academic awards, committee memberships..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Profile Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shadow"
                >
                  {editingExpert ? 'Save / Update Expert' : 'Add Expert to Supabase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
