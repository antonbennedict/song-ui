// Use Vercel proxy para maiwasan ang CORS issue
const API_BASE_URL = '/api';

export const fetchSongs = async () => {
  try {
    console.log('📥 Fetching via Vercel proxy...');

    const response = await fetch(`${API_BASE_URL}/songs`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Data received:', data);

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('❌ Fetch error:', error);
    throw error;
  }
};

export const searchSongs = async (query) => {
  try {
    const allSongs = await fetchSongs();

    if (!query) return allSongs;

    const lowerQuery = query.toLowerCase();

    return allSongs.filter((song) =>
      song.title?.toLowerCase().includes(lowerQuery) ||
      song.artist?.toLowerCase().includes(lowerQuery) ||
      song.album?.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('❌ Search error:', error);
    throw error;
  }
};