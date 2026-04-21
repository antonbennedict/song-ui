import { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Chip,
  Tooltip,
  Paper,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import TuneIcon from '@mui/icons-material/Tune';

const GENRES = ['Rock', 'Pop', 'OPM', 'Jazz', 'Electronic', 'Hip-Hop'];

export default function SearchBar({ onSearch, onClear }) {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value, selectedGenre);
  };

  const handleClear = () => {
    setQuery('');
    setSelectedGenre(null);
    onClear();
  };

  const handleGenreClick = (genre) => {
    const newGenre = selectedGenre === genre ? null : genre;
    setSelectedGenre(newGenre);
    onSearch(query, newGenre);
  };

  return (
    <Paper
      elevation={3}
      className="p-8 rounded-3xl max-w-3xl mx-auto bg-white border-2 border-purple-200 shadow-lg"
    >
      {/* Search Box */}
      <Box className="flex gap-3 mb-6">
        <TextField
          fullWidth
          placeholder="🔍 Search songs, artists, albums..."
          value={query}
          onChange={handleChange}
          variant="outlined"
          size="medium"
          className="rounded-xl"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="text-purple-500 text-2xl" />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <Tooltip title="Clear search">
                  <IconButton
                    size="small"
                    onClick={handleClear}
                    edge="end"
                    className="!text-purple-400 hover:!text-purple-600"
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#1f2937',
              borderRadius: '12px',
              backgroundColor: '#f9fafb',
              border: '2px solid #e5e7eb',
              '&:hover': {
                backgroundColor: '#f3f4f6',
                borderColor: '#d1d5db',
              },
              '&.Mui-focused': {
                borderColor: '#a855f7',
                backgroundColor: '#ffffff',
                boxShadow: '0 0 0 3px rgba(168, 85, 247, 0.1)',
              },
            },
            '& .MuiOutlinedInput-input': {
              fontSize: '16px',
              fontWeight: '500',
              color: '#1f2937',
            },
            '& .MuiOutlinedInput-input::placeholder': {
              opacity: 0.6,
              color: '#9ca3af',
            },
          }}
        />
        <Tooltip title="Toggle filters">
          <IconButton
            onClick={() => setShowFilters(!showFilters)}
            className="!bg-purple-600 !text-white hover:!bg-purple-700 !h-14 !w-14 shadow-md"
          >
            <TuneIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Genre Filters */}
      {showFilters && (
        <Box className="border-t border-gray-200 pt-4">
          <Typography 
            className="text-sm font-bold text-gray-700 mb-3"
            style={{ fontSize: '0.875rem', fontWeight: '700', letterSpacing: '0.05em' }}
          >
            FILTER BY GENRE
          </Typography>
          <Box className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <Chip
                key={genre}
                label={genre}
                onClick={() => handleGenreClick(genre)}
                variant={selectedGenre === genre ? 'filled' : 'outlined'}
                className={`!font-semibold transition-all ${
                  selectedGenre === genre
                    ? '!bg-purple-600 !text-white shadow-md'
                    : '!text-purple-600 !border-purple-300 hover:!bg-purple-50 !border-2'
                }`}
                style={{ fontWeight: '600', fontSize: '0.875rem' }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
}