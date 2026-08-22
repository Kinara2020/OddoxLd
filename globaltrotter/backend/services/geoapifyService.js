import axios from 'axios';

const CATEGORIES = 'tourism.sights,catering.restaurant,entertainment,leisure.park';

export const getCityCoordinates = async (cityName) => {
  const res = await axios.get('https://api.geoapify.com/v1/geocode/search', {
    params: { text: cityName, limit: 1, lang: 'en', apiKey: process.env.GEOAPIFY_KEY }
  });

  const feature = res.data.features?.[0];
  if (!feature) throw new Error(`City "${cityName}" not found`);

  return {
    lat: feature.properties.lat,
    lon: feature.properties.lon
  };
};

export const getActivitiesForCity = async (lat, lon) => {
  const res = await axios.get('https://api.geoapify.com/v2/places', {
    params: {
      categories: CATEGORIES,
      filter: `circle:${lon},${lat},5000`,
      bias: `proximity:${lon},${lat}`,
      limit: 20,
      lang: 'en',
      apiKey: process.env.GEOAPIFY_KEY
    }
  });

  return res.data.features.map((f) => ({
    id: f.properties.place_id || Math.random().toString(36).substr(2, 9),
    name: f.properties.name || 'Unnamed spot',
    category: (f.properties.categories?.[0] || 'general').split('.')[0],
    lat: f.properties.lat,
    lon: f.properties.lon,
    cost: 0,
    duration_minutes: 60
  }));
};

export const searchCitiesGeoapify = async (query) => {
  const res = await axios.get('https://api.geoapify.com/v1/geocode/autocomplete', {
    params: { text: query, type: 'city', limit: 10, lang: 'en', apiKey: process.env.GEOAPIFY_KEY }
  });

  return res.data.features.map((f) => ({
    id: f.properties.place_id || query,
    name: f.properties.city || f.properties.name || query,
    country: f.properties.country || 'Unknown',
    region: f.properties.state || f.properties.county || '',
    lat: f.properties.lat,
    lon: f.properties.lon,
    popularity_score: 50,
    cost_index: 50
  }));
};