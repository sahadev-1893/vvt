import React, { useState } from 'react';
import { GalleryAlbum, GalleryCategory, GalleryPhoto } from '../types';
import { LazyImage } from '../components/LazyImage';
import {
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Calendar,
  Layers,
} from 'lucide-react';

interface GalleryPageProps {
  albums: GalleryAlbum[];
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ albums }) => {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | 'All'>('All');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const categories: (GalleryCategory | 'All')[] = [
    'All',
    'Campus',
    'VVDC',
    'VVHSS',
    'Trust',
    'Events',
    'Achievements',
    'Functions',
  ];

  // Flatten all photos across published albums
  const allPhotos: GalleryPhoto[] = albums
    .filter((a) => a.isPublished)
    .flatMap((a) => a.photos);

  const filteredPhotos = allPhotos.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const nextLightboxPhoto = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => ((prev ?? 0) + 1) % filteredPhotos.length);
  };

  const prevLightboxPhoto = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex(
      (prev) => ((prev ?? 0) - 1 + filteredPhotos.length) % filteredPhotos.length
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Banner Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3.5 py-1 rounded-full">
            Campus Life & Memories
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            PHOTO GALLERY
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed font-light">
            Glimpses into student life, laboratories, library facilities, annual sports, Vinayakotsav
            celebrations, and academic milestones across Vishwa Vinayak Trust.
          </p>
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-red-700 text-white shadow-md scale-105'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id || index}
              onClick={() => openLightbox(index)}
              className="cursor-pointer group relative bg-slate-900 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 aspect-[4/3]"
            >
              <LazyImage
                src={photo.url}
                alt={photo.caption}
                wrapperClassName="w-full h-full"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  {photo.category}
                </span>
                <p className="text-xs font-semibold text-white line-clamp-2 mt-0.5">
                  {photo.caption}
                </p>
              </div>

              {/* View Icon Badge */}
              <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="py-20 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
            <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700">No photos found in this category</p>
            <p className="text-xs text-slate-400 mt-1">Select "All" to browse the entire collection.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activePhotoIndex !== null && filteredPhotos[activePhotoIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 select-none">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="cursor-pointer absolute top-5 right-5 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow */}
          <button
            onClick={prevLightboxPhoto}
            className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextLightboxPhoto}
            className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* Photo & Caption */}
          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center">
            <LazyImage
              src={filteredPhotos[activePhotoIndex].url}
              alt={filteredPhotos[activePhotoIndex].caption}
              wrapperClassName="max-h-[72vh] max-w-full rounded-xl shadow-2xl"
              className="max-h-[72vh] max-w-full object-contain rounded-xl"
            />
            <div className="mt-4 text-center text-white space-y-1 px-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-white/10 px-2.5 py-0.5 rounded-full">
                {filteredPhotos[activePhotoIndex].category}
              </span>
              <p className="text-sm md:text-base font-medium max-w-2xl mt-1">
                {filteredPhotos[activePhotoIndex].caption}
              </p>
              <p className="text-xs text-slate-400">
                {activePhotoIndex + 1} of {filteredPhotos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
