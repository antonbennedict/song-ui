const TARGET_URL = 'https://songapi-c2c8.onrender.com/lulu/songs';

export const fetchSongs = async () => {
  try {
    console.log('📥 Attempting stealth fetch...');

    // Using a different proxy bridge (shcors.site or similar)
    // If this fails, we try a direct "no-cors" mode as a last resort
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(TARGET_URL)}`;

    const response = await fetch(proxyUrl, {
      method: 'GET'
    });

    if (response.status === 403) {
      throw new Error("The Backend is still blocking the request. It requires direct CORS clearance.");
    }

    if (!response.ok) {
      throw new Error(`Proxy status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];

  } catch (error) {
    console.error('❌ Fetch error:', error);
    
    // LAST RESORT: If the proxy fails, we tell the user why
    throw new Error('CORS Policy Block: The backend server refuses to talk to external websites.');
  }
};

export const searchSongs = async (query) => {
  const allSongs = await fetchSongs();
  if (!query) return allSongs;
  const q = query.toLowerCase();
  return allSongs.filter(s => 
    s.title?.toLowerCase().includes(q) || s.artist?.toLowerCase().includes(q)
  );
};