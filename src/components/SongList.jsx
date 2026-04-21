import { Box, Typography } from '@mui/material';
import SongCard from './SongCard';

export default function SongList({ songs, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl px-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="animate-shimmer h-64 rounded-2xl mb-4" />
              <div className="animate-shimmer h-4 rounded mb-3" />
              <div className="animate-shimmer h-4 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <Box className="flex justify-center items-center h-80">
        <div className="text-center">
          <Typography 
            variant="h4" 
            className="text-gray-600 mb-2 font-black"
            style={{ fontSize: '1.875rem', fontWeight: '900' }}
          >
            🎵 NO SONGS FOUND
          </Typography>
          <Typography 
            variant="body1" 
            className="text-gray-500"
            style={{ fontSize: '1rem', fontWeight: '500' }}
          >
            Try adjusting your search or filters
          </Typography>
        </div>
      </Box>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl px-4 animate-fade-in">
        {songs.map((song, index) => (
          <div key={song.id} style={{ animationDelay: `${index * 0.05}s` }} className="animate-fade-in">
            <SongCard song={song} />
          </div>
        ))}
      </div>
    </div>
  );
}