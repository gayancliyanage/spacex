import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import spacexLogo from '../assets/spacex-logo.svg';

function NavBar({ successFilter, onSuccessFilterChange }) {
  return (
    <AppBar position="static" sx={{ 
      background: 'rgba(26, 44, 78, 0.8)',
      backdropFilter: 'blur(10px)'
     }}>
      <Toolbar sx={{ minHeight: '56px' }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          flexGrow: 1 
        }}>
          <Box
            component="img"
            src={spacexLogo}
            alt="SpaceX"
            sx={{
              height: '20px',
              width: 'auto',
              mr: 2,
              filter: 'brightness(1)',
              transition: 'filter 0.3s ease-in-out',
              '&:hover': {
                filter: 'brightness(1.2)'
              }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={successFilter}
            exclusive
            onChange={(e, value) => onSuccessFilterChange(value)}
            size="small"
            sx={{
              height: '32px',
              '& .MuiToggleButton-root': {
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.23)',
                padding: '4px 12px',
                fontSize: '0.8125rem',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(0, 245, 255, 0.2)',
                  color: '#00f5ff'
                }
              }
            }}
          >
            <ToggleButton value="all">
              All
            </ToggleButton>
            <ToggleButton value="success">
              Success Only
            </ToggleButton>
            <ToggleButton value="crewed">
              Crewed Missions
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;