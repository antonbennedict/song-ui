import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoIcon from '@mui/icons-material/Info';
import { useState } from 'react';

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar
      position="sticky"
      elevation={4}
      className="!bg-gradient-to-r !from-gray-900 !via-purple-900 !to-gray-900 !border-b !border-purple-500/30"
    >
      <Toolbar className="flex items-center justify-between py-5">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Box className="p-3 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg shadow-lg">
            <MusicNoteIcon className="text-3xl text-white" />
          </Box>
          <div>
            <Typography variant="h5" component="h1" className="font-black text-white tracking-wider">
              🎵 SONG PLAYER
            </Typography>
            <Typography variant="caption" className="text-purple-300 font-semibold">
              MUSIC STREAMING PLATFORM
            </Typography>
          </div>
        </div>

        {/* Menu */}
        <IconButton
          onClick={handleMenuOpen}
          className="!text-purple-400 hover:!text-purple-300 hover:!bg-purple-900/50"
        >
          <MoreVertIcon fontSize="large" />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            style: {
              borderRadius: '12px',
              background: 'rgba(17, 24, 39, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
            },
          }}
        >
          <MenuItem
            onClick={handleMenuClose}
            className="!text-gray-300 hover:!text-purple-400 hover:!bg-purple-900/50"
          >
            <InfoIcon fontSize="small" className="mr-2" />
            About
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}