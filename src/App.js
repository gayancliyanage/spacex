import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import LaunchDashboard from './components/LaunchDashboard';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00f5ff',
    },
    secondary: {
      main: '#7b1fa2',
    },
    background: {
      default: '#0a192f',
      paper: '#1a2c4e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      background: 'linear-gradient(45deg, #00f5ff 30%, #7b1fa2 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
          backdropFilter: 'blur(20px)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LaunchDashboard />
    </ThemeProvider>
  );
}

export default App;