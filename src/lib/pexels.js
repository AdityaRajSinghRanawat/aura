// Lightweight helper to fetch images from Pexels API
export async function fetchPexelsImages(query, per_page = 8) {
  const key = import.meta.env.VITE_PEXELS_API_KEY;
  if (!key) {
    console.warn('VITE_PEXELS_API_KEY not set; returning empty image list');
    return [];
  }

  const encoded = encodeURIComponent(query || 'house');
  const url = `https://api.pexels.com/v1/search?query=${encoded}&per_page=${per_page}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: key }
    });

    if (!res.ok) {
      console.error('Pexels API error', res.status, res.statusText);
      return [];
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.photos)) {
      console.warn('No photos in Pexels response');
      return [];
    }

    const images = data.photos.map(p => {
      const src = p.src?.large || p.src?.medium || p.src?.small || p.src?.original;
      return {
        id: p.id,
        width: p.width,
        height: p.height,
        photographer: p.photographer,
        url: p.url,
        src: src || '' // Ensure src is a string (URL)
      };
    }).filter(img => img.src); // Only include images with valid URLs

    console.log(`✓ Fetched ${images.length} images for query: "${query}"`);
    return images;
  } catch (err) {
    console.error('Failed to fetch from Pexels', err);
    return [];
  }
}
