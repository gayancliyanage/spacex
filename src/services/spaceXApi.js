import axios from 'axios';

const API_URL = 'https://api.spacexdata.com/v4';
const NASA_API_BASE_URL = 'https://api.nasa.gov';
const NASA_API_KEY = 'DEMO_KEY'; // Replace with your NASA API key

export const fetchNASAAstronautData = async (name) => {
  try {
    const response = await fetch(
      `${NASA_API_BASE_URL}/planetary/apod?api_key=${NASA_API_KEY}&count=1`
    );
    if (!response.ok) throw new Error('NASA API request failed');
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error('Error fetching NASA astronaut data:', error);
    return null;
  }
};

export const fetchCrewMember = async (crewId) => {
  try {
    const response = await axios.get(`${API_URL}/crew/${crewId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching crew member:', error);
    return null;
  }
};

export const fetchLaunches = async () => {
  try {
    const response = await axios.get(`${API_URL}/launches`);
    return response.data.map(launch => ({
      ...launch,
      links: {
        ...launch.links,
        patch: launch.links?.patch || {},
        flickr: {
          ...launch.links?.flickr,
          original: launch.links?.flickr?.original || [],
          small: launch.links?.flickr?.small || []
        }
      }
    }));
  } catch (error) {
    console.error('Error fetching launches:', error);
    return [];
  }
};