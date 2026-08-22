import { getActivitiesForCity, getCityCoordinates } from '../services/geoapifyService.js';

export const getActivitiesController = async (req, res) => {
  const { cityId, lat, lon } = req.query; 
  
  try {
    let finalLat, finalLon;
    
    if (lat && lon) {
      finalLat = parseFloat(lat);
      finalLon = parseFloat(lon);
    } else if (cityId) {
      const coords = await getCityCoordinates(cityId);
      finalLat = coords.lat;
      finalLon = coords.lon;
    } else {
      return res.status(400).json({ error: 'Either lat/lon or cityId is required' });
    }

    const results = await getActivitiesForCity(finalLat, finalLon);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};