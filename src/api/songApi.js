export const fetchSongs = async () => {
  try {
    // We use allorigins.win to wrap the request. 
    // This server fetches the data for us and adds the CORS headers.
    const targetUrl = 'https://songapi-c2c8.onrender.com/lulu/songs';
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    console.log('📥 Fetching songs via AllOrigins Proxy...');

    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`Proxy Error: ${response.status}`);
    }

    const data = await response.json();
    
    // AllOrigins wraps the result in a "contents" string
    // We need to parse that string back into an actual Array
    const songsArray = JSON.parse(data.contents);

    console.log('✅ Data received:', songsArray);
    return Array.isArray(songsArray) ? songsArray : [];

  } catch (error) {
    console.error('❌ Fetch error:', error);
    throw new Error('Failed to fetch songs. The API might be down or blocked.');
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