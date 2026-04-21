const TARGET_URL = 'https://songapi-c2c8.onrender.com/lulu/songs';

export const fetchSongs = async () => {
  try {
    console.log('📥 Requesting songs through fallback proxy...');

    // We use corsproxy.io - it is simple and doesn't require special headers
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(TARGET_URL)}`;

    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    
    console.log('✅ Data received successfully');
    // Most proxies return the data directly; if it's an array, return it
    return Array.isArray(data) ? data : [];

  } catch (error) {
    console.error('❌ Fetch error:', error);
    
    // If this still fails, the Render backend is likely totally asleep 
    // or has blocked the proxy IP.
    throw new Error('API is currently unreachable. Please try again in a minute.');
  }
};

export const searchSongs = async (query) => {
  try {
    const allSongs = await fetchSongs();
    if (!query) return allSongs;

    const lowerQuery = query.toLowerCase();
    return allSongs.filter((song) =>
      song.title?.toLowerCase().includes(lowerQuery) ||
      song.artist?.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('❌ Search error:', error);
    throw error;
  }
};