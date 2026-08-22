import { searchCitiesGeoapify } from '../services/geoapifyService.js';

export const searchCitiesController = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query param q is required' });

  try {
    const results = await searchCitiesGeoapify(q);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};