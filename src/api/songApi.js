const TARGET_URL = 'https://songapi-c2c8.onrender.com/lulu/songs';

export const fetchSongs = async () => {
  try {
    console.log('📥 Fetching songs...');

    // We use a different proxy that is more stable for Render-to-Render
    // This one doesn't wrap the data in a "contents" string, making it easier to use.
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(TARGET_URL)}`;

    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        // Keeping headers minimal to avoid triggering CORS preflight blocks
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      // If we get a 403 or 404 here, the proxy is being blocked.
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    
    // Ensure we are returning an array so the .filter() doesn't crash later
    const songsArray = Array.isArray(data) ? data : [];
    
    console.log('✅ Songs loaded:', songsArray.length);
    return songsArray;

  } catch (error) {
    console.error('❌ Fetch error:', error.message);
    
    // This is the specific error that will show in your UI
    throw new Error('Unable to load songs. The server might be waking up or blocking the connection.');
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