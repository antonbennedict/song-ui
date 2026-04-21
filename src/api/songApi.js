const API_BASE_URL = 'https://songapi-c2c8.onrender.com/lulu';

export const fetchSongs = async () => {
  try {
    console.log('📥 Fetching from:', `${API_BASE_URL}/songs`);

    const response = await fetch(`${API_BASE_URL}/songs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Data received:', data);

    if (!Array.isArray(data)) {
      console.error('Data is not an array:', data);
      return [];
    }

    // Log each song to verify structure
    data.forEach((song, index) => {
      console.log(`Song ${index + 1}:`, {
        id: song.id,
        title: song.title,
        artist: song.artist,
        url: song.url,
        album: song.album,
        genre: song.genre,
      });
    });

    return data;
  } catch (error) {
    console.error('❌ Fetch error:', error);
    throw new Error(error.message || 'Failed to fetch songs');
  }
};

export const searchSongs = async (query) => {
  try {
    const allSongs = await fetchSongs();

    const filtered = allSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase()) ||
        song.album.toLowerCase().includes(query.toLowerCase())
    );

    return filtered;
  } catch (error) {
    console.error('❌ Search error:', error);
    throw error;
  }
};