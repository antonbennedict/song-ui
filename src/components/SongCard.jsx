import { useState } from 'react';
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Chip,
  Dialog,
  DialogContent,
  Box,
  Tooltip,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const SongCard = ({ song }) => {
  const [openModal, setOpenModal] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0);

  const songUrl = song?.url || '';

  // Enhanced video ID extraction
  const getVideoId = () => {
    if (!songUrl) return '';
    try {
      const urlStr = songUrl.trim();
      let videoId = '';

      if (urlStr.includes('youtu.be/')) {
        const matches = urlStr.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
        videoId = matches ? matches[1] : '';
      } else if (urlStr.includes('youtube.com/watch')) {
        const urlObj = new URL(urlStr);
        videoId = urlObj.searchParams.get('v');
      } else if (urlStr.includes('youtube.com/embed/')) {
        const matches = urlStr.match(/embed\/([a-zA-Z0-9_-]{11})/);
        videoId = matches ? matches[1] : '';
      } else if (/^[a-zA-Z0-9_-]{11}$/.test(urlStr)) {
        videoId = urlStr;
      }
      return videoId;
    } catch (error) {
      return '';
    }
  };

  const videoId = getVideoId();

  // Thumbnail URLs prioritized by quality
  const getThumbnailUrls = () => {
    if (!videoId) return [];
    return [
      `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    ];
  };

  const thumbnailUrls = getThumbnailUrls();
  const currentThumbnailUrl = thumbnailUrls[currentThumbnailIndex] || '';

  // IMPORTANT: Fix for "White/Blank" thumbnails
  // YouTube returns a 120px wide "placeholder" image if a specific resolution doesn't exist.
  // We check the natural width; if it's 120 or less, we skip to the next available quality.
  const handleImageLoad = (e) => {
    if (e.target.naturalWidth <= 120 && currentThumbnailIndex < thumbnailUrls.length - 1) {
      setCurrentThumbnailIndex((prev) => prev + 1);
    }
  };

  const handleImageError = () => {
    if (currentThumbnailIndex < thumbnailUrls.length - 1) {
      setCurrentThumbnailIndex((prev) => prev + 1);
    } else {
      setImageError(true);
    }
  };

  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : '';

  const getGenreEmoji = () => {
    const emojis = {
      Rock: '🎸',
      Pop: '🎤',
      OPM: '🎶',
      Jazz: '🎷',
      Electronic: '🎧',
      'Hip-Hop': '🎙️',
    };
    return emojis[song?.genre] || '🎵';
  };

  const getGenreGradient = () => {
    const gradients = {
      Rock: 'from-red-500 to-red-600',
      Pop: 'from-pink-500 to-pink-600',
      OPM: 'from-blue-500 to-blue-600',
      Jazz: 'from-yellow-500 to-yellow-600',
      Electronic: 'from-purple-500 to-purple-600',
      'Hip-Hop': 'from-indigo-500 to-indigo-600',
    };
    return gradients[song?.genre] || 'from-purple-500 to-purple-600';
  };

  const handlePlayClick = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleYouTubeClick = (e) => {
    e.stopPropagation();
    window.open(songUrl, '_blank');
  };

  return (
    <>
      <Card
        className="song-card h-full flex flex-col overflow-hidden transform transition-all duration-300 hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div
          className={`relative w-full h-64 flex items-center justify-center flex-col overflow-hidden group cursor-pointer bg-gradient-to-br ${
            imageError ? getGenreGradient() : 'bg-gray-200'
          }`}
          onClick={handlePlayClick}
        >
          {!imageError && currentThumbnailUrl && (
            <img
              src={currentThumbnailUrl}
              alt={song?.title}
              className="w-full h-full object-cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ transition: 'all 0.3s ease' }}
              loading="lazy"
            />
          )}

          {imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Typography variant="h2" className="text-white mb-3 drop-shadow-lg">
                {getGenreEmoji()}
              </Typography>
              <Typography variant="h5" className="text-white font-bold drop-shadow-md line-clamp-2 px-4 text-center">
                {song?.title}
              </Typography>
            </div>
          )}

          <div className={`absolute inset-0 transition-all duration-300 ${isHovered ? 'bg-black/40' : 'bg-black/20'}`} />

          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-lg z-20">
            <Typography variant="caption" className="font-bold text-gray-900">
              {getGenreEmoji()}
            </Typography>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <IconButton
              onClick={handlePlayClick}
              className={`transition-all duration-300 !shadow-lg ${
                isHovered ? '!bg-white !text-purple-600 !p-6 !scale-110' : '!bg-white/90 !text-purple-600 !p-5 !scale-90'
              }`}
              size="large"
            >
              <PlayArrowIcon sx={{ fontSize: 50 }} />
            </IconButton>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="flex-grow flex flex-col justify-between bg-white px-5 py-4">
          <div className="mb-3">
            <Typography variant="h6" className="font-bold text-gray-900 mb-2 line-clamp-2" style={{ fontSize: '1rem' }}>
              {song?.title}
            </Typography>
            <Typography variant="body2" className="mb-2 line-clamp-1 text-purple-600 font-semibold" style={{ fontSize: '0.9rem' }}>
              ★ {song?.artist}
            </Typography>
            <Typography variant="body2" className="mb-3 line-clamp-1 text-gray-500" style={{ fontSize: '0.8rem' }}>
              📀 {song?.album}
            </Typography>
            <div className="mb-4">
              <Chip
                label={`${getGenreEmoji()} ${song?.genre}`}
                size="small"
                className="!bg-purple-100 !text-purple-700 !font-semibold !text-xs"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-between items-center pt-3 border-t border-gray-200">
            <Tooltip title={isFavorited ? 'Remove favorite' : 'Add to favorites'}>
              <IconButton
                size="small"
                onClick={handleFavoriteClick}
                className={`transition-all ${isFavorited ? '!text-red-500' : '!text-gray-400 hover:!text-red-500'}`}
              >
                {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Tooltip>
            <Typography variant="caption" className="text-gray-500 font-bold">
              #{song?.id}
            </Typography>
            <Tooltip title="Open on YouTube">
              <IconButton size="small" onClick={handleYouTubeClick} className="!text-red-500 hover:!text-red-600">
                <OpenInNewIcon />
              </IconButton>
            </Tooltip>
          </div>
        </CardContent>
      </Card>

      {/* Video Player Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: { borderRadius: '20px', overflow: 'hidden' },
        }}
      >
        <DialogContent className="relative p-0 bg-black overflow-hidden">
          <IconButton
            onClick={handleCloseModal}
            className="absolute top-4 right-4 !bg-white !text-purple-600 hover:!bg-purple-100 z-10 shadow-lg"
          >
            <CloseIcon />
          </IconButton>

          {embedUrl ? (
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={embedUrl}
                title={song?.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="w-full h-96 flex flex-col items-center justify-center bg-gray-100">
              <PlayArrowIcon sx={{ fontSize: 100, color: '#ccc' }} />
              <Typography variant="h6">No Playback Available</Typography>
            </div>
          )}

          <Box className="bg-white p-6 border-t border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <Typography variant="h6" className="font-bold text-gray-900">{song?.title}</Typography>
                <Typography variant="body2" className="text-purple-600 font-semibold">★ {song?.artist}</Typography>
                <Typography variant="caption" className="text-gray-500">📀 Album: {song?.album}</Typography>
              </div>
              <IconButton onClick={handleYouTubeClick} className="!text-red-500"><OpenInNewIcon /></IconButton>
            </div>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SongCard;