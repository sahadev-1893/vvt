import React, { useState } from 'react';
import { Wing, Course } from '../../types';
import { storageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Search,
  Download,
  X,
  Upload,
  BookOpen,
} from 'lucide-react';

interface AdminWingsTabProps {
  wings: Wing[];
  onRefresh: () => void;
  onNavigatePublic: (path: string) => void;
  isOpenModalInitial?: boolean;
}

export const AdminWingsTab: React.FC<AdminWingsTabProps> = ({
  wings,
  onRefresh,
  onNavigatePublic,
  isOpenModalInitial = false,
}) => {
  const { currentAdmin, isSuperAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedWing, setSelectedWing] = useState<Wing | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<Wing>>({
    name: '',
    shortName: '',
    slug: '',
    tagline: '',
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    description: '',
    aboutText: '',
    address: 'At/Po-Khireitangiri, Dist-Kendujhar, State-Odisha, PIN-758046',
    phone: '+91 9437238689',
    email: 'info@vvt.edu.in',
    website: 'https://vvt.edu.in',
    principalName: '',
    principalQualification: '',
    principalMessage: '',
    establishedYear: new Date().getFullYear(),
    affiliation: 'Recognized by Department of Higher Education, Govt. of Odisha',
    campusArea: 'Vishwa Vinayak Central Campus',
    studentCount: 150,
    facultyCount: 12,
    facilities: [
      'Digital Library',
      'Modern Computer Lab',
      'Science Practical Laboratories',
      'Student Hostel Facility',
      'Bus Transport Service',
    ],
    courses: [
      {
        id: 'c1',
        name: 'Bachelor of Science (B.Sc.)',
        duration: '3 Years',
        eligibility: '+2 Science',
        seats: 64,
        description: 'Comprehensive undergraduate degree with practical training.',
      },
    ],
    admissionInfo: 'Admissions conducted via merit list and e-Admission portal.',
    status: 'active',
  });

  const [courseInput, setCourseInput] = useState({
    name: '',
    duration: '',
    eligibility: '',
    seats: 64,
    description: '',
  });

  const [newFacility, setNewFacility] = useState('');

  const openCreateModal = () => {
    setSelectedWing(null);
    setFormData({
      name: '',
      shortName: '',
      slug: '',
      tagline: '',
      coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
      description: '',
      aboutText: '',
      address: 'At/Po-Khireitangiri, Dist-Kendujhar, State-Odisha, PIN-758046',
      phone: '+91 9437238689',
      email: 'info@vvt.edu.in',
      website: 'https://vvt.edu.in',
      principalName: '',
      principalQualification: '',
      principalMessage: '',
      establishedYear: new Date().getFullYear(),
      affiliation: 'Recognized by Govt. of Odisha',
      campusArea: 'Vishwa Vinayak Campus',
      studentCount: 200,
      facultyCount: 15,
      facilities: ['Digital Library', 'Hostel Facility', 'Bus Transport'],
      courses: [],
      admissionInfo: 'Direct campus admission helpdesk available.',
      status: 'active',
    });
    setIsEditing(true);
  };

  const openEditModal = (wing: Wing) => {
    setSelectedWing(wing);
    setFormData({ ...wing });
    setIsEditing(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the wing "${name}"? This will remove its public profile.`)) {
      return;
    }
    storageService.deleteWing(id, currentAdmin || undefined);
    onRefresh();
  };

  const handleAddCourse = () => {
    if (!courseInput.name.trim()) return;
    const newCourse: Course = {
      id: `c-${Date.now()}`,
      name: courseInput.name.trim(),
      duration: courseInput.duration.trim() || '3 Years',
      eligibility: courseInput.eligibility.trim() || 'Passed Qualifying Exam',
      seats: Number(courseInput.seats) || 60,
      description: courseInput.description.trim() || 'Academic course offered under the curriculum.',
    };
    setFormData({
      ...formData,
      courses: [...(formData.courses || []), newCourse],
    });
    setCourseInput({
      name: '',
      duration: '',
      eligibility: '',
      seats: 64,
      description: '',
    });
  };

  const handleRemoveCourse = (courseId: string) => {
    setFormData({
      ...formData,
      courses: (formData.courses || []).filter((c) => c.id !== courseId),
    });
  };

  const handleAddFacility = () => {
    if (!newFacility.trim()) return;
    setFormData({
      ...formData,
      facilities: [...(formData.facilities || []), newFacility.trim()],
    });
    setNewFacility('');
  };

  const handleRemoveFacility = (index: number) => {
    setFormData({
      ...formData,
      facilities: (formData.facilities || []).filter((_, i) => i !== index),
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.shortName) {
      alert('Please fill in Wing Name and Short Name.');
      return;
    }

    const slug =
      formData.slug ||
      formData.shortName.toLowerCase().replace(/[^a-z0-9]/g, '-') ||
      `wing-${Date.now()}`;

    const wingToSave: Wing = {
      id: selectedWing ? selectedWing.id : `wing-${Date.now()}`,
      slug,
      name: formData.name.trim(),
      shortName: formData.shortName.trim().toUpperCase(),
      tagline: formData.tagline || '',
      coverImage:
        formData.coverImage ||
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
      description: formData.description || '',
      aboutText: formData.aboutText || formData.description || '',
      address: formData.address || 'At/Po-Khireitangiri, Dist-Kendujhar, Odisha - 758046',
      phone: formData.phone || '+91 9437238689',
      email: formData.email || 'info@vvt.edu.in',
      website: formData.website || '',
      principalName: formData.principalName || 'Principal',
      principalQualification: formData.principalQualification || '',
      principalMessage: formData.principalMessage || '',
      establishedYear: Number(formData.establishedYear) || 2024,
      affiliation: formData.affiliation || '',
      campusArea: formData.campusArea || '',
      studentCount: Number(formData.studentCount) || 0,
      facultyCount: Number(formData.facultyCount) || 0,
      facilities: formData.facilities || [],
      courses: formData.courses || [],
      admissionInfo: formData.admissionInfo || '',
      status: formData.status || 'active',
      createdAt: selectedWing ? selectedWing.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageService.saveWing(wingToSave, currentAdmin || undefined);
    setIsEditing(false);
    onRefresh();
  };

  const handleExportCSV = () => {
    const rows = wings.map((w) => ({
      ID: w.id,
      Name: w.name,
      ShortName: w.shortName,
      Slug: w.slug,
      Status: w.status,
      Principal: w.principalName,
      Phone: w.phone,
      Email: w.email,
      EstablishedYear: w.establishedYear,
      TotalCourses: w.courses.length,
      StudentCount: w.studentCount,
    }));
    storageService.exportToCSV('VVT_Wings_Report', rows);
  };

  const filteredWings = wings.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.shortName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white">Wings Management</h2>
          <p className="text-xs text-slate-400">
            Create and maintain unlimited academic wings (Degree College, Higher Secondary, Nursing,
            etc.)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={openCreateModal}
            className="cursor-pointer px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Wing</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search wings by name or code..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
      </div>

      {/* Wings Data Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredWings.map((wing) => (
          <div
            key={wing.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between"
          >
            {/* Header banner */}
            <div className="relative h-40">
              <img
                src={wing.coverImage}
                alt={wing.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-red-700 text-white font-extrabold text-xs">
                  {wing.shortName}
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-slate-900/80 text-amber-300 text-[10px] font-bold">
                  Est. {wing.establishedYear}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    wing.status === 'active'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {wing.status}
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h3 className="font-heading text-base font-bold leading-tight drop-shadow">
                  {wing.name}
                </h3>
                <p className="text-[11px] text-slate-300 truncate mt-0.5">
                  /wings/{wing.slug}
                </p>
              </div>
            </div>

            {/* Content summary */}
            <div className="p-5 space-y-3 text-xs text-slate-300 flex-1">
              <p className="line-clamp-2 text-slate-400">{wing.description}</p>
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Head / Principal</span>
                  <span className="font-bold text-white truncate block">{wing.principalName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Total Courses</span>
                  <span className="font-bold text-amber-400">{wing.courses.length} Programs</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
              <button
                onClick={() => onNavigatePublic(`/wings/${wing.slug}`)}
                className="cursor-pointer text-xs font-semibold text-slate-400 hover:text-amber-400 flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live View</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(wing)}
                  className="cursor-pointer p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
                  title="Edit Wing"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {isSuperAdmin && (
                  <button
                    onClick={() => handleDelete(wing.id, wing.name)}
                    className="cursor-pointer p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-red-400 transition-colors"
                    title="Delete Wing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Wing Edit / Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto text-slate-200 shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <h3 className="font-heading text-lg font-bold text-white">
                {selectedWing ? `Edit Wing: ${selectedWing.shortName}` : 'Add New Academic Wing'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-6 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Wing Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. VISHWA VINAYAK DEGREE COLLEGE"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Short Name / Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shortName || ''}
                    onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                    placeholder="e.g. VVDC"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. vvdc or public-school"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Established Year
                  </label>
                  <input
                    type="number"
                    value={formData.establishedYear || 2024}
                    onChange={(e) =>
                      setFormData({ ...formData, establishedYear: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status || 'active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="active">Active (Visible Publicly)</option>
                    <option value="inactive">Inactive / Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Tagline / Motto
                </label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Empowering Higher Education & Leadership"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={formData.coverImage || ''}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Full About Institution Text
                </label>
                <textarea
                  rows={3}
                  value={formData.aboutText || ''}
                  onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Head / Principal details */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Principal / Academic Head Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Principal Name</label>
                    <input
                      type="text"
                      value={formData.principalName || ''}
                      onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                      placeholder="e.g. Dr. Ramesh Chandra Mahanta"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Qualification</label>
                    <input
                      type="text"
                      value={formData.principalQualification || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, principalQualification: e.target.value })
                      }
                      placeholder="e.g. M.Sc., Ph.D. in Physics"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Principal Message</label>
                  <textarea
                    rows={2}
                    value={formData.principalMessage || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, principalMessage: e.target.value })
                    }
                    placeholder="Message to students and parents..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              {/* Courses Sub-Manager */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Courses & Degree Programs Offered
                </span>

                {/* Existing list */}
                <div className="space-y-2">
                  {(formData.courses || []).map((course) => (
                    <div
                      key={course.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <strong className="text-white">{course.name}</strong>
                        <span className="text-slate-400 ml-2">({course.duration})</span>
                        <p className="text-[11px] text-slate-500">{course.eligibility}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCourse(course.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new course inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    placeholder="Course Name (e.g. +3 B.Com)"
                    value={courseInput.name}
                    onChange={(e) => setCourseInput({ ...courseInput, name: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g. 3 Years)"
                    value={courseInput.duration}
                    onChange={(e) => setCourseInput({ ...courseInput, duration: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Eligibility (e.g. +2 Passed)"
                    value={courseInput.eligibility}
                    onChange={(e) => setCourseInput({ ...courseInput, eligibility: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCourse}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold"
                >
                  + Add Course to Wing
                </button>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider"
                >
                  Save Wing Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
