import React, { useState } from 'react';
import { GalleryAlbum, GalleryCategory, GalleryPhoto, Wing } from '../../types';
import { storageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import {
  Image,
  Plus,
  Trash2,
  Edit2,
  Upload,
  X,
  CheckCircle,
  Eye,
} from 'lucide-react';

interface AdminGalleryTabProps {
  albums: GalleryAlbum[];
  wings: Wing[];
  onRefresh: () => void;
}

export const AdminGalleryTab: React.FC<AdminGalleryTabProps> = ({
  albums,
  wings,
  onRefresh,
}) => {
  const { currentAdmin, isSuperAdmin } = useAuth();
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // New Album Form
  const [albumFormData, setAlbumFormData] = useState({
    title: '',
    category: 'Campus' as GalleryCategory,
    wingId: 'all',
    coverPhoto: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    description: '',
  });

  // New Photo Form
  const [photoFormData, setPhotoFormData] = useState({
    url: '',
    caption: '',
    category: 'Campus' as GalleryCategory,
  });

  const categories: GalleryCategory[] = [
    'All',
    'Campus',
    'VVDC',
    'VVHSS',
    'Trust',
    'Events',
    'Students',
    'Achievements',
    'Functions',
    'Other',
  ];

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumFormData.title) return;

    const newAlbum: GalleryAlbum = {
      id: `alb-${Date.now()}`,
      title: albumFormData.title.trim(),
      category: albumFormData.category,
      wingId: albumFormData.wingId,
      coverPhoto: albumFormData.coverPhoto,
      description: albumFormData.description,
      photos: [
        {
          id: `p-${Date.now()}`,
          url: albumFormData.coverPhoto,
          caption: albumFormData.title,
          category: albumFormData.category,
        },
      ],
      isPublished: true,
      createdAt: new Date().toISOString(),
    };

    storageService.saveAlbum(newAlbum, currentAdmin || undefined);
    setIsAlbumModalOpen(false);
    onRefresh();
  };

  const handleDeleteAlbum = (id: string, title: string) => {
    if (!window.confirm(`Delete album "${title}" and all its photos?`)) return;
    storageService.deleteAlbum(id, currentAdmin || undefined);
    onRefresh();
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlbum || !photoFormData.url) return;

    const newPhoto: GalleryPhoto = {
      id: `p-${Date.now()}`,
      url: photoFormData.url.trim(),
      caption: photoFormData.caption.trim() || selectedAlbum.title,
      category: photoFormData.category,
      wingId: selectedAlbum.wingId,
    };

    const updatedAlbum: GalleryAlbum = {
      ...selectedAlbum,
      photos: [...selectedAlbum.photos, newPhoto],
    };

    storageService.saveAlbum(updatedAlbum, currentAdmin || undefined);
    setSelectedAlbum(updatedAlbum);
    setPhotoFormData({ url: '', caption: '', category: 'Campus' });
    setIsPhotoModalOpen(false);
    onRefresh();
  };

  const handleDeletePhoto = (photoId: string) => {
    if (!selectedAlbum) return;
    const updatedAlbum: GalleryAlbum = {
      ...selectedAlbum,
      photos: selectedAlbum.photos.filter((p) => p.id !== photoId),
    };
    storageService.saveAlbum(updatedAlbum, currentAdmin || undefined);
    setSelectedAlbum(updatedAlbum);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white">Photo Gallery Management</h2>
          <p className="text-xs text-slate-400">
            Create albums, upload high-resolution campus photos, and organize by academic category
          </p>
        </div>

        <button
          onClick={() => {
            setAlbumFormData({
              title: '',
              category: 'Campus',
              wingId: 'all',
              coverPhoto: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
              description: '',
            });
            setIsAlbumModalOpen(true);
          }}
          className="cursor-pointer px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Album</span>
        </button>
      </div>

      {/* Albums Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {albums.map((album) => (
          <div
            key={album.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between group"
          >
            <div className="relative h-44 bg-slate-950">
              <img
                src={album.coverPhoto}
                alt={album.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-900/80 text-amber-300 border border-white/20">
                  {album.category}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-heading text-sm font-bold line-clamp-1">{album.title}</h3>
                <span className="text-[11px] text-slate-300 font-medium">
                  {album.photos.length} Photos
                </span>
              </div>
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <button
                onClick={() => setSelectedAlbum(album)}
                className="cursor-pointer text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Manage Photos</span>
              </button>

              {isSuperAdmin && (
                <button
                  onClick={() => handleDeleteAlbum(album.id, album.title)}
                  className="cursor-pointer p-1.5 rounded-lg text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Album Photos Drawer / Modal */}
      {selectedAlbum && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto text-slate-200 shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <div>
                <span className="text-xs text-amber-400 uppercase font-bold">Album Manager</span>
                <h3 className="font-heading text-lg font-bold text-white">
                  {selectedAlbum.title} ({selectedAlbum.photos.length} Photos)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Photo</span>
                </button>
                <button
                  onClick={() => setSelectedAlbum(null)}
                  className="p-1.5 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Photos inside album */}
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {selectedAlbum.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative group rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-square"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                      <p className="text-[11px] font-semibold text-white line-clamp-2">
                        {photo.caption}
                      </p>
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="mt-1 text-red-400 hover:text-red-300 text-[10px] font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Album Modal */}
      {isAlbumModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-200 space-y-4">
            <h3 className="font-heading text-lg font-bold text-white">Create Photo Album</h3>
            <form onSubmit={handleCreateAlbum} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Album Title *</label>
                <input
                  type="text"
                  required
                  value={albumFormData.title}
                  onChange={(e) => setAlbumFormData({ ...albumFormData, title: e.target.value })}
                  placeholder="e.g. Science Day 2026"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={albumFormData.category}
                  onChange={(e) =>
                    setAlbumFormData({
                      ...albumFormData,
                      category: e.target.value as GalleryCategory,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Cover Image URL *</label>
                <input
                  type="text"
                  required
                  value={albumFormData.coverPhoto}
                  onChange={(e) =>
                    setAlbumFormData({ ...albumFormData, coverPhoto: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAlbumModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold"
                >
                  Save Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Photo to Album Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-200 space-y-4">
            <h3 className="font-heading text-lg font-bold text-white">Add Photo to Album</h3>
            <form onSubmit={handleAddPhoto} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Image URL *</label>
                <input
                  type="text"
                  required
                  value={photoFormData.url}
                  onChange={(e) => setPhotoFormData({ ...photoFormData, url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Caption / Description</label>
                <input
                  type="text"
                  value={photoFormData.caption}
                  onChange={(e) => setPhotoFormData({ ...photoFormData, caption: e.target.value })}
                  placeholder="e.g. Physics practical demonstration"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold"
                >
                  Add Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
