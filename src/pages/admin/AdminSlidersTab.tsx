import React, { useState } from 'react';
import { Slider } from '../../types';
import { storageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  X,
  ExternalLink,
} from 'lucide-react';

interface AdminSlidersTabProps {
  sliders: Slider[];
  onRefresh: () => void;
}

export const AdminSlidersTab: React.FC<AdminSlidersTabProps> = ({ sliders, onRefresh }) => {
  const { currentAdmin, isSuperAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);

  const [formData, setFormData] = useState<Partial<Slider>>({
    heading: '',
    subheading: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=85',
    buttonText: 'Explore More',
    buttonUrl: '/wings',
    order: 1,
    status: 'active',
  });

  const openCreateModal = () => {
    setEditingSlider(null);
    setFormData({
      heading: '',
      subheading: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=85',
      buttonText: 'Explore More',
      buttonUrl: '/wings',
      order: sliders.length + 1,
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (slider: Slider) => {
    setEditingSlider(slider);
    setFormData({ ...slider });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, heading: string) => {
    if (!window.confirm(`Delete slide "${heading}"?`)) return;
    storageService.deleteSlider(id, currentAdmin || undefined);
    onRefresh();
  };

  const toggleStatus = (slider: Slider) => {
    const updated: Slider = {
      ...slider,
      status: slider.status === 'active' ? 'inactive' : 'active',
    };
    storageService.saveSlider(updated, currentAdmin || undefined);
    onRefresh();
  };

  const handleMove = (slider: Slider, direction: 'up' | 'down') => {
    const sorted = [...sliders].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((s) => s.id === slider.id);
    if (idx < 0) return;

    if (direction === 'up' && idx > 0) {
      const prev = sorted[idx - 1];
      const tempOrder = prev.order;
      prev.order = slider.order;
      slider.order = tempOrder;
      storageService.saveSlider(prev, currentAdmin || undefined);
      storageService.saveSlider(slider, currentAdmin || undefined);
      onRefresh();
    } else if (direction === 'down' && idx < sorted.length - 1) {
      const next = sorted[idx + 1];
      const tempOrder = next.order;
      next.order = slider.order;
      slider.order = tempOrder;
      storageService.saveSlider(next, currentAdmin || undefined);
      storageService.saveSlider(slider, currentAdmin || undefined);
      onRefresh();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.heading) {
      alert('Please fill in Slide Heading.');
      return;
    }

    const sliderToSave: Slider = {
      id: editingSlider ? editingSlider.id : `slider-${Date.now()}`,
      heading: formData.heading.trim(),
      subheading: formData.subheading || '',
      description: formData.description || '',
      image:
        formData.image ||
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=85',
      buttonText: formData.buttonText || 'Learn More',
      buttonUrl: formData.buttonUrl || '/wings',
      order: Number(formData.order) || 1,
      status: formData.status || 'active',
      createdAt: editingSlider ? editingSlider.createdAt : new Date().toISOString(),
    };

    storageService.saveSlider(sliderToSave, currentAdmin || undefined);
    setIsModalOpen(false);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white">Hero Sliders Management</h2>
          <p className="text-xs text-slate-400">
            Customize the main banner slides, headings, calls to action, and display sequence on the
            homepage
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="cursor-pointer px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Slide</span>
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="space-y-4">
        {sliders.map((slide, index) => (
          <div
            key={slide.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            {/* Image Preview & Order Indicator */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex flex-col items-center gap-1 text-slate-500">
                <button
                  onClick={() => handleMove(slide, 'up')}
                  disabled={index === 0}
                  className="p-1 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-xs font-bold text-amber-400">{slide.order}</span>
                <button
                  onClick={() => handleMove(slide, 'down')}
                  disabled={index === sliders.length - 1}
                  className="p-1 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <img
                src={slide.image}
                alt={slide.heading}
                className="w-28 h-20 rounded-2xl object-cover border border-slate-800 shrink-0"
              />

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      slide.status === 'active'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {slide.status}
                  </span>
                  {slide.subheading && (
                    <span className="text-[11px] text-amber-400 font-semibold truncate max-w-xs">
                      {slide.subheading}
                    </span>
                  )}
                </div>
                <h3 className="font-heading text-sm font-bold text-white line-clamp-1">
                  {slide.heading}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1">{slide.description}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
              <button
                onClick={() => toggleStatus(slide)}
                className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                  slide.status === 'active'
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                }`}
              >
                {slide.status === 'active' ? 'Disable' : 'Enable'}
              </button>

              <button
                onClick={() => openEditModal(slide)}
                className="cursor-pointer p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              {isSuperAdmin && (
                <button
                  onClick={() => handleDelete(slide.id, slide.heading)}
                  className="cursor-pointer p-2 rounded-lg bg-slate-800 hover:bg-red-950 text-red-400"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full text-slate-200 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-white">
                {editingSlider ? 'Edit Slide' : 'Add New Hero Slide'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Slide Heading *
                </label>
                <input
                  type="text"
                  required
                  value={formData.heading || ''}
                  onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                  placeholder="e.g. VISHWA VINAYAK DEGREE COLLEGE"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Subheading / Pill Text
                </label>
                <input
                  type="text"
                  value={formData.subheading || ''}
                  onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
                  placeholder="e.g. Nurturing Academic Brilliance"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Background Image URL *
                </label>
                <input
                  type="text"
                  required
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={formData.buttonText || ''}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Button URL</label>
                  <input
                    type="text"
                    value={formData.buttonUrl || ''}
                    onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order || 1}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status || 'active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
