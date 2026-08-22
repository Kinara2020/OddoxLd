import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

router.get('/:slug', async (req, res) => {
  const { data, error } = await supabase
    .from('trips')
    .select(`*, trip_stops (*, activities (*))`)
    .eq('share_slug', req.params.slug)
    .eq('is_public', true)
    .single();

  if (error) return res.status(404).json({ error: 'Trip not found' });
  res.json(data);
});

export default router;