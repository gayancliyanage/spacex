import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Chip,
  Divider,
  Paper,
  Grid 
} from '@mui/material';
import { fetchCrewMember, fetchNASAAstronautData } from '../services/spaceXApi';

function LaunchDetail({ launch }) {
  const [crewDetails, setCrewDetails] = useState([]);

  useEffect(() => {
    const fetchCrewDetails = async () => {
      if (launch.crew?.length > 0) {
        const crewPromises = launch.crew.map(async crew => {
          const crewMember = await fetchCrewMember(crew.id);
          if (crewMember) {
            const nasaData = await fetchNASAAstronautData(crewMember.name);
            return { ...crewMember, nasaData };
          }
          return null;
        });
        const crewData = await Promise.all(crewPromises);
        setCrewDetails(crewData.filter(crew => crew !== null));
      }
    };
    fetchCrewDetails();
  }, [launch]);

  return (
    <Box sx={{ 
      p: 3, 
      height: '100vh',
      overflow: 'auto',
      '&::-webkit-scrollbar': {
        width: '8px'
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '4px',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.3)'
        }
      },
      '& > .MuiTypography-h4': {
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -8,
          left: 0,
          width: '60px',
          height: '3px',
          background: 'linear-gradient(90deg, #00f5ff, transparent)',
          borderRadius: '2px'
        }
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>        <Box sx={{ flex: 1 }}>          <Typography variant="h4" sx={{ mb: 2 }}>            {launch.name}          </Typography>          <Chip             label={launch.success ? 'Success' : 'Failed'}             color={launch.success ? 'success' : 'error'}           />        </Box>        <Box          component="img"          src={launch.links?.patch?.small || launch.links?.flickr?.original?.[0] || launch.links?.flickr?.small?.[0] || `data:image/svg+xml,${encodeURIComponent('<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23001F3F"/><stop offset="100%" style="stop-color:%234A90E2"/></linearGradient></defs><rect width="200" height="200" fill="url(%23grad)"/><text x="50%" y="50%" font-family="Arial" font-size="48" text-anchor="middle" dy=".3em" fill="white">🚀</text></svg>')}`}          alt={launch.name}          sx={{            width: '80px',            height: '80px',            objectFit: 'contain',            borderRadius: 2,            bgcolor: 'background.paper',            p: 1.5,            ml: 2,            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',            border: '1px solid rgba(255,255,255,0.1)'          }}        />      </Box>      
      {launch.links?.webcast && (
        <Box sx={{ mb: 3 }}>
          <Paper sx={{ 
              p: 2, 
              background: 'rgba(26, 44, 78, 0.6)',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 20px rgba(0,245,255,0.15)'
              }
            }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#00f5ff' }}>
              Watch Launch
            </Typography>
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${launch.links.webcast.split('v=')[1]}`}
              title="Launch Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Paper>
        </Box>
      )}

      <Typography variant="subtitle1" gutterBottom>
        Launch Date: {new Date(launch.date_utc).toLocaleString()}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ 
              p: 2, 
              background: 'rgba(26, 44, 78, 0.6)',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 20px rgba(0,245,255,0.15)'
              }
            }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#00f5ff' }}>
              Launch Site Map
            </Typography>
            {launch.launchpad_lat && launch.launchpad_long ? (
              <Box sx={{ width: '100%', height: '300px', borderRadius: 1, overflow: 'hidden' }}>
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${launch.launchpad_lat},${launch.launchpad_long}&zoom=12`}
                />
              </Box>
            ) : (
              <Typography variant="body1">
                Launch site coordinates not available
              </Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ 
              p: 2, 
              background: 'rgba(26, 44, 78, 0.6)',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 20px rgba(0,245,255,0.15)'
              }
            }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#00f5ff' }}>
              Mission Overview
                {launch.links?.wikipedia && (
                  <Box component="a" 
                    href={launch.links.wikipedia}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      ml: 2,
                      color: '#00f5ff',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Wikipedia 📚
                  </Box>
                )}
              </Typography>
              <Typography variant="body1" paragraph>
                {launch.details || 'No details available'}
              </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ 
              p: 2, 
              background: 'rgba(26, 44, 78, 0.6)',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 20px rgba(0,245,255,0.15)'
              }
            }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#00f5ff' }}>
              Scientific Achievements
            </Typography>
            <Typography variant="body1" paragraph>
              {launch.payloads?.length ? 
                `This mission carried ${launch.payloads.length} payload(s) to space, ` +
                `contributing to ${launch.payloads.map(p => p.type).join(', ')} research.` :
                'No payload information available'}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ 
              p: 2, 
              background: 'rgba(26, 44, 78, 0.6)',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 20px rgba(0,245,255,0.15)'
              }
            }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#00f5ff' }}>
              Mission Statistics
            </Typography>
            <Typography variant="body1" component="div">
              <Box sx={{ mb: 1 }}>
                🚀 Flight Number: #{launch.flight_number}
              </Box>
              <Box sx={{ mb: 1 }}>
                🛰️ Orbit: {launch.payloads?.[0]?.orbit || 'Not specified'}
              </Box>
              <Box>
                📍 Launch Site: {launch.launchpad || 'Not specified'}
              </Box>
            </Typography>
          </Paper>
        </Grid>

        {launch.crew?.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 2, 
              background: 'rgba(26, 44, 78, 0.6)',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 20px rgba(0,245,255,0.15)'
              }
            }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#00f5ff' }}>
                Crew Members
              </Typography>
              <Grid container spacing={2}>
                {crewDetails.map((crewMember) => (
                  <Grid item xs={12} sm={6} md={4} key={crewMember.id}>
                    <Paper 
                      sx={{ 
                        p: 2, 
                        background: 'rgba(26, 44, 78, 0.8)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                      }}
                    >
                      {crewMember.image && (
                        <Box
                          component="img"
                          src={crewMember.image}
                          alt={crewMember.name}
                          sx={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            mb: 2,
                            border: '2px solid #00f5ff',
                            objectFit: 'cover'
                          }}
                        />
                      )}
                      <Typography variant="h6" sx={{ color: '#00f5ff', mb: 1 }}>
                        {crewMember.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        {crewMember.role || 'Crew Member'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                        {crewMember.status}
                      </Typography>
                      {crewMember.nasaData && (
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, fontSize: '0.9rem' }}>
                          {crewMember.nasaData.explanation}
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, fontSize: '0.9rem' }}>
                        {crewMember.wikipedia ? (
                          <a 
                            href={crewMember.wikipedia}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#00f5ff', textDecoration: 'none' }}
                          >
                            View Biography
                          </a>
                        ) : null}
                      </Typography>
                      {crewMember.agency && (
                        <Chip 
                          label={crewMember.agency}
                          size="small"
                          sx={{ 
                            bgcolor: 'rgba(0,245,255,0.1)', 
                            color: '#00f5ff',
                            '& .MuiChip-label': { px: 1 }
                          }}
                        />
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}

        <Grid item xs={12}>
          <Paper sx={{ 
              p: 2, 
              background: 'rgba(26, 44, 78, 0.6)',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 20px rgba(0,245,255,0.15)'
              }
            }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#00f5ff' }}>
              Educational Resources
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ color: '#00f5ff', mb: 1 }}>
                  Technical Insights
                </Typography>
                <Typography variant="body1" paragraph>
                  {launch.rocket ? 
                    `This mission utilized the ${launch.rocket} rocket, showcasing advancements in reusable rocket technology. ` +
                    `The launch trajectory and orbital mechanics demonstrate key principles of spaceflight dynamics.` :
                    'Technical information not available for this launch.'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ color: '#00f5ff', mb: 1 }}>
                  Historical Context
                </Typography>
                <Typography variant="body1" paragraph>
                  {`This launch represents SpaceX's ongoing commitment to space exploration and technological innovation. ` +
                   `Launch #${launch.flight_number} contributes to the growing commercial space industry and advances in space technology.`}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ color: '#00f5ff', mb: 1 }}>
                  Scientific Impact
                </Typography>
                <Typography variant="body1" paragraph>
                  {launch.payloads?.length ?
                    `This mission's ${launch.payloads.length} payload(s) contribute to various fields including ${launch.payloads.map(p => p.type).join(', ')}. ` +
                    `These experiments and deployments help advance our understanding of space science and practical applications of space technology.` :
                    'No specific scientific payload information available for this mission.'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ color: '#00f5ff', mb: 1 }}>
                  Key Learning Points
                </Typography>
                <Typography variant="body1" component="div">
                  <Box sx={{ mb: 1 }}>• Understanding orbital mechanics and launch windows</Box>
                  <Box sx={{ mb: 1 }}>• Importance of payload integration and mission planning</Box>
                  <Box sx={{ mb: 1 }}>• Advances in reusable rocket technology</Box>
                  <Box>• Commercial space industry developments</Box>
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LaunchDetail;