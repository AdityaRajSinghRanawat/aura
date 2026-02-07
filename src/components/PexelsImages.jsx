import { useEffect, useState } from 'react';
import { fetchPexelsImages } from '../lib/pexels';

export default function PexelsImages({ query = 'house', perPage = 6, onSelect, className = '' }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const imgs = await fetchPexelsImages(query, perPage);
        if (!mounted) return;
        setImages(imgs);
        setSelectedIdx(0);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Failed to fetch images');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [query, perPage]);

  if (loading) return (
    <div className={`w-full h-full flex flex-col items-center justify-center bg-slate-900 ${className}`}>
      <div className="animate-pulse text-slate-400 text-sm">Fetching images...</div>
    </div>
  );

  if (error) return (
    <div className={`w-full h-full flex items-center justify-center bg-slate-900 ${className}`}>
      <div className="text-center p-4">
        <p className="text-red-400 text-sm font-semibold">Failed to load</p>
        <p className="text-slate-500 text-xs mt-1">{error}</p>
      </div>
    </div>
  );

  if (!images || images.length === 0) return (
    <div className={`w-full h-full flex items-center justify-center bg-slate-900 ${className}`}>
      <div className="text-slate-400 text-sm">No images available</div>
    </div>
  );

  // Show main selected image
  const mainImg = images[selectedIdx];

  return (
    <div className={`w-full h-full relative bg-slate-950 ${className}`}>
      <img 
        src={mainImg.src} 
        alt={mainImg.photographer || 'property image'} 
        className="w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      
      {/* Attribution */}
      {mainImg.photographer && (
        <div className="absolute bottom-1 left-2 text-xs text-slate-300 drop-shadow-lg">
          Photo by {mainImg.photographer}
        </div>
      )}

      {/* Thumbnail grid - only show if multiple images */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-2 flex gap-1">
          {images.slice(0, 4).map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedIdx(idx)}
              className={`w-10 h-10 rounded border-2 overflow-hidden transition ${
                selectedIdx === idx ? 'border-blue-400' : 'border-slate-600 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img.src} alt={img.photographer || `thumb-${idx}`} className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

