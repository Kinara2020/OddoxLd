import dotenv from 'dotenv';
dotenv.config({ override: true });
import express from 'express';
import cors from 'cors';

import tripsRoutes from './routes/trips.routes.js';
import stopsRoutes from './routes/stops.routes.js';
import citiesRoutes from './routes/cities.routes.js';
import activitiesRoutes from './routes/activities.routes.js';
import budgetRoutes from './routes/budget.routes.js';
import authRoutes from './routes/auth.routes.js';
import publicRoutes from './routes/public.routes.js';
import ratesRoutes from './routes/rates.routes.js';

const app = express();
app.use(cors()); // Allow all origins to prevent CORS errors during local development
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/stops', stopsRoutes);

app.get('/api/env-check', (req, res) => {
  const payload = process.env.SUPABASE_SERVICE_KEY?.split('.')[1] || 'missing';
  res.json({ payload });
});

import { supabase } from './config/supabase.js';
app.get('/api/debug', async (req, res) => {
  const { data, error } = await supabase.from('cities').insert([{ name: 'DebugCity' + Date.now(), country: 'DebugCountry' }]).select();
  res.json({ data, error });
});

app.use('/api/cities', citiesRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/rates', ratesRoutes);

app.get('/', (req, res) => res.json({ status: 'GlobeTrotter API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`)); 