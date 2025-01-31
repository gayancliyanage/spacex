import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Drawer, Stepper, Step, StepLabel, StepButton } from '@mui/material';
import LaunchGrid from './LaunchGrid';
import LaunchDetail from './LaunchDetail';
import NavBar from './NavBar';
import { fetchLaunches } from '../services/spaceXApi';
import { useSearchParams } from 'react-router-dom';

function LaunchDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [launches, setLaunches] = useState([]);
  const [selectedLaunch, setSelectedLaunch] = useState(null);
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') ? parseInt(searchParams.get('year')) : null);
  const [years, setYears] = useState([]);
  const [successFilter, setSuccessFilter] = useState(searchParams.get('filter') || 'all');

  const updateUrlParams = (year, filter) => {
    const params = new URLSearchParams();
    if (year) params.set('year', year.toString());
    if (filter && filter !== 'all') params.set('filter', filter);
    setSearchParams(params);
  };

  const [yearSuccessRates, setYearSuccessRates] = useState({});
  const [yearLaunchCounts, setYearLaunchCounts] = useState({});

  useEffect(() => {
    const getLaunches = async () => {
      const data = await fetchLaunches();
      setLaunches(data);
      if (data.length > 0) {
        setSelectedLaunch(data[0]);
        
        // Extract unique years and count launches per year
        const yearCounts = {};
        const uniqueYears = [...new Set(data.map(launch => {
          const year = new Date(launch.date_utc).getFullYear();
          yearCounts[year] = (yearCounts[year] || 0) + 1;
          return year;
        }))].sort((a, b) => b - a);
        
        setYears(uniqueYears);
        setYearLaunchCounts(yearCounts);

        // Calculate success rates for each year
        const successRates = {};
        uniqueYears.forEach(year => {
          const yearLaunches = data.filter(launch => 
            new Date(launch.date_utc).getFullYear() === year
          );
          const successfulLaunches = yearLaunches.filter(launch => launch.success);
          successRates[year] = yearLaunches.length > 0 
            ? (successfulLaunches.length / yearLaunches.length)
            : 0;
        });
        setYearSuccessRates(successRates);
      }
    };
    getLaunches();
  }, []);

  const filteredLaunches = launches.filter(launch => {
    const yearMatch = selectedYear === null || 
      new Date(launch.date_utc).getFullYear() === selectedYear;
    const successMatch = successFilter === 'all' || 
      (successFilter === 'success' && launch.success === true) ||
      (successFilter === 'crewed' && launch.crew?.length > 0);
    return yearMatch && successMatch;
  });

  // Update selected launch when year or filter changes
  useEffect(() => {
    if (filteredLaunches.length > 0) {
      // Sort launches by date (newest first)
      const sortedLaunches = [...filteredLaunches].sort((a, b) => 
        new Date(b.date_utc) - new Date(a.date_utc)
      );
      
      // Check if current selection exists in filtered results
      const currentSelectionExists = selectedLaunch && 
        filteredLaunches.some(launch => launch.id === selectedLaunch.id);

      // Only update selection if current selection is not in filtered results
      if (!currentSelectionExists) {
        setSelectedLaunch(sortedLaunches[0]);
      }
      setIsDrawerOpen(true);
    }
  }, [selectedYear, successFilter, filteredLaunches]);

  const [drawerWidth, setDrawerWidth] = useState(window.innerWidth * 0.6);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isGridMinimized, setIsGridMinimized] = useState(false);

  const handleMouseDown = (e) => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= 300 && newWidth <= window.innerWidth * 0.7) {
      setDrawerWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', overflow: 'hidden' }}>
      <NavBar 
        years={years}
        selectedYear={selectedYear}
        onYearChange={(year) => {
          setSelectedYear(year);
          updateUrlParams(year, successFilter);
        }}
        successFilter={successFilter}
        onSuccessFilterChange={(filter) => {
          setSuccessFilter(filter);
          updateUrlParams(selectedYear, filter);
        }}
      />
      <Box sx={{ px: 4, py: 2, background: 'transparent', mb: 0 }}>
        <Stepper 
          nonLinear 
          alternativeLabel
          connector={null}
          sx={{
            py: 0.5,
            minHeight: '48px',
            '& .MuiStepLabel-label': {
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.9rem',
              marginTop: 0,
              '&.Mui-active': { 
                color: '#00f5ff',
                fontWeight: 600,
                textShadow: '0 0 8px rgba(0,245,255,0.4)'
              }
            },
            '& .MuiStepIcon-root': {
              display: 'none'
            },
            '& .MuiStepButton-root': {
              padding: '6px 12px',
              borderRadius: 1,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.05)'
              },
              '&.Mui-active': {
                backgroundColor: 'rgba(0,245,255,0.1)'
              }
            }
          }}
        >
          {years.map((year) => (
            <Step 
              key={year} 
              completed={false}
              active={selectedYear === year}
            >
              <StepButton onClick={() => {
                setSelectedYear(year);
                updateUrlParams(year, successFilter);
              }}>
                {year}
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Box sx={{ display: 'flex', height: 'calc(100% - 160px)', position: 'relative', '&::before': { content: '""', position: 'absolute', top: 0, left: '5%', right: '5%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.1), transparent)' } }}>
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'hidden',
          transition: 'width 0.3s ease-in-out',
          width: isGridMinimized ? '120px' : 'auto',
          position: 'relative'
        }}>
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10,
              display: 'flex',
              gap: 1,
              background: 'rgba(26, 44, 78, 0.9)',
              padding: '4px',
              borderRadius: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <Box
              onClick={() => setIsGridMinimized(true)}
              sx={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: '50%',
                backgroundColor: isGridMinimized ? 'rgba(0,245,255,0.2)' : 'transparent',
                color: isGridMinimized ? '#00f5ff' : 'rgba(255,255,255,0.7)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(0,245,255,0.1)',
                  transform: 'scale(1.1)'
                },
                '&::before': {
                  content: '"⋮"',
                  fontSize: '20px',
                  lineHeight: 1
                }
              }}
            />
            <Box
              onClick={() => setIsGridMinimized(false)}
              sx={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: '50%',
                backgroundColor: !isGridMinimized ? 'rgba(0,245,255,0.2)' : 'transparent',
                color: !isGridMinimized ? '#00f5ff' : 'rgba(255,255,255,0.7)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(0,245,255,0.1)',
                  transform: 'scale(1.1)'
                },
                '&::before': {
                  content: '"▦"',
                  fontSize: '18px',
                  lineHeight: 1
                }
              }}
            />
          </Box>
          <LaunchGrid 
            launches={filteredLaunches}
            selectedLaunch={selectedLaunch}
            onSelectLaunch={(launch) => {
              setSelectedLaunch(launch);
              setIsDrawerOpen(true);
            }}
            isGridMinimized={isGridMinimized}
          />
        </Box>
        <Drawer
          variant="persistent"
          anchor="right"
          open={isDrawerOpen}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              position: 'relative',
              background: 'rgba(26, 44, 78, 0.8)',
              backdropFilter: 'blur(10px)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.12)'
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              cursor: 'ew-resize',
              '&:hover': {
                backgroundColor: 'primary.main',
              },
            }}
            onMouseDown={handleMouseDown}
          />
          {selectedLaunch && <LaunchDetail launch={selectedLaunch} />}
        </Drawer>
      </Box>
    </Box>
  );
}

export default LaunchDashboard;