// src/api/songApi.js

const TARGET_URL = 'https://songapi-c2c8.onrender.com/lulu/songs';

export const fetchSongs = async () => {
  try {
    console.log('📥 Attempting to wake up Render and fetch songs...');
    
    // We use a cache-buster (?t=...) to make sure we get fresh data
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(TARGET_URL + '?t=' + Date.now())}`;

    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`Proxy Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.contents) {
      throw new Error("No content received from proxy");
    }

    // AllOrigins returns the data as a string, so we parse it
    const songsArray = JSON.parse(data.contents);

    console.log('✅ Data received successfully!');
    return Array.isArray(songsArray) ? songsArray : [];

  } catch (error) {
    console.error('❌ Fetch error:', error.message);
    
    // If it's a timeout, it's usually just Render waking up.
    // We tell the user it's loading/waking up instead of just "Error"
    throw new Error('Server is waking up. Please refresh in 30 seconds.');
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