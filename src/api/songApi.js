const TARGET_URL = 'https://songapi-c2c8.onrender.com/lulu/songs';

export const fetchSongs = async () => {
  try {
    console.log('📥 Attempting fetch via AllOrigins bridge...');

    // We wrap the URL in AllOrigins. 
    // We add a random 'cache-buster' parameter (?v=...) to try and bypass 403 filters.
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(TARGET_URL + '?v=' + Date.now())}`;

    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`Proxy Error: ${response.status}`);
    }

    const data = await response.json();

    // AllOrigins returns data inside a 'contents' string.
    // We must parse that string into a real JavaScript object/array.
    if (!data.contents) {
      throw new Error("Received empty response from proxy.");
    }

    const songsArray = JSON.parse(data.contents);

    console.log('✅ Data successfully retrieved:', songsArray);
    return Array.isArray(songsArray) ? songsArray : [];

  } catch (error) {
    console.error('❌ Fetch error:', error);
    
    // Friendly error for the UI
    throw new Error('The API is blocking the connection. Please try again in a few moments.');
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