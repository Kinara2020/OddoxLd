import axios from 'axios';

export const searchCities = async (query) => {
  const response = await axios.get(
    'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
    {
      params: { namePrefix: query, limit: 10, sort: '-population' },
      headers: {
        'X-RapidAPI-Key': process.env.GEODB_RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      }
    }
  );

  return response.data.data.map((c) => ({
    name: c.city,
    country: c.country,
    region: c.region,
    popularity_score: c.population || 0,
    cost_index: 50 // GeoDB has no cost index; placeholder, refine later if time allows
  }));
};