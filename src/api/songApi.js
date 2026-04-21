/**
 * Since the backend doesn't allow direct browser requests (CORS error),
 * we use a public proxy to fetch the data.
 */
const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
const TARGET_URL = 'https://songapi-c2c8.onrender.com/lulu/songs';

// Combine them to bypass CORS
const API_URL = `${PROXY_URL}${TARGET_URL}`;

export const fetchSongs = async () => {
  try {
    console.log('📥 Fetching songs via CORS Proxy...');

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest' // Required by the proxy
      }
    });

    /**
     * NOTE: If you get a 403 error, you must visit this link once and click 
     * "Request temporary access to the demo server" to activate it:
     * https://cors-anywhere.herokuapp.com/corsdemo
     */
    if (response.status === 403) {
      throw new Error("Proxy Access Required: Visit https://cors-anywhere.herokuapp.com/corsdemo and click 'Request access'");
    }

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