import { useEffect, useState } from 'react';
import {
  Container,
  CircularProgress,
  Box,
  Alert,
  Button,
  Typography,
  Snackbar,
} from '@mui/material';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import SongList from './components/SongList';
import { fetchSongs } from './api/songApi';
import './index.css';

function App() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const loadSongs = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📥 Loading songs...');

      const data = await fetchSongs();
      console.log(`✅ Loaded ${data.length} songs:`, data);

      setSongs(data);
      setFilteredSongs(data);
      setSnackbar({ open: true, message: `✓ Loaded ${data.length} songs!` });
    } catch (error) {
      console.error('❌ Error loading songs:', error);
      setError(`Failed to load songs: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  const handleSearch = (query, genre) => {
    console.log(`🔍 Searching - Query: "${query}", Genre: ${genre || 'All'}`);

    if (!query.trim() && !genre) {
      setFilteredSongs(songs);
      setSearching(false);
      return;
    }

    setSearching(true);

    let results = songs;

    if (query.trim()) {
      results = results.filter(
        (song) =>
          song.title.toLowerCase().includes(query.toLowerCase()) ||
          song.artist.toLowerCase().includes(query.toLowerCase()) ||
          song.album.toLowerCase().includes(query.toLowerCase())
      );
      console.log(`Found ${results.length} songs matching text`);
    }

    if (genre) {
      results = results.filter((song) => song.genre === genre);
      console.log(`Found ${results.length} songs in ${genre}`);
    }

    setFilteredSongs(results);
    setSearching(false);

    if (results.length > 0) {
      setSnackbar({ open: true, message: `✓ Found ${results.length} song(s)` });
    } else {
      setSnackbar({ open: true, message: '⚠ No songs found' });
    }
  };

  const handleClear = () => {
    console.log('🔄 Clearing filters');
    setFilteredSongs(songs);
    setSearching(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <Header />

      <Container maxWidth="lg" className="py-12">
        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            className="mb-6 rounded-2xl !bg-red-50 !border-red-300 !text-red-800"
            action={
              <Button color="inherit" size="small" onClick={loadSongs}>
                RETRY
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Search Bar */}
        <Box className="mb-10">
          <SearchBar onSearch={handleSearch} onClear={handleClear} />
        </Box>

        {/* Stats */}
        {!loading && songs.length > 0 && (
          <Box className="mb-8 text-center">
            <Typography 
              variant="body2" 
              className="text-gray-600 font-bold tracking-widest"
              style={{ fontSize: '0.875rem', fontWeight: '700' }}
            >
              TOTAL: <span className="text-purple-600 text-lg font-black">{songs.length}</span> SONGS
              {filteredSongs.length < songs.length && (
                <>
                  {' '} | SHOWING: <span className="text-purple-600 text-lg font-black">{filteredSongs.length}</span>
                </>
              )}
            </Typography>
          </Box>
        )}

        {/* Song List */}
        {loading ? (
          <Box className="flex justify-center items-center h-96">
            <div className="text-center">
              <CircularProgress size={80} className="!text-purple-600" />
              <Typography 
                variant="h6" 
                className="text-purple-600 mt-6 font-black tracking-wider"
                style={{ fontSize: '1.25rem', fontWeight: '900' }}
              >
                🎵 LOADING MUSIC...
              </Typography>
            </div>
          </Box>
        ) : songs.length === 0 ? (
          <Box className="flex justify-center items-center h-64">
            <div className="text-center bg-white/80 backdrop-blur-lg p-12 rounded-3xl border-2 border-purple-200 shadow-lg">
              <Typography 
                variant="h5" 
                className="text-gray-700 mb-3 font-black"
                style={{ fontSize: '1.5rem', fontWeight: '900' }}
              >
                📭 NO SONGS AVAILABLE
              </Typography>
              <Button
                variant="contained"
                onClick={loadSongs}
                className="mt-4 !bg-purple-600 hover:!bg-purple-700 !text-white !font-bold !px-8"
                style={{ fontWeight: '700' }}
              >
                TRY AGAIN
              </Button>
            </div>
          </Box>
        ) : (
          <SongList songs={filteredSongs} loading={searching} />
        )}
      </Container>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        ContentProps={{
          sx: {
            background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            color: '#fff',
            fontWeight: 'bold',
            boxShadow: '0 10px 25px rgba(168, 85, 247, 0.3)',
          },
        }}
      />
    </div>
  );
}

export default App;