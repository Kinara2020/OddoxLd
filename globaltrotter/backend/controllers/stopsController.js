import { supabase } from '../config/supabase.js';

export const addStop = async (req, res) => {
  const { trip_id, city_name, country, order_index, start_date, end_date } = req.body;
  
  console.log('--- addStop called ---');
  console.log('Payload:', { trip_id, city_name, country, order_index, start_date, end_date });

  // 1. Find or create city in the 'cities' table
  let { data: cityData, error: cityFindError } = await supabase
    .from('cities')
    .select('id')
    .eq('name', city_name)
    .eq('country', country)
    .limit(1)
    .single();

  console.log('City Find:', { cityData, cityFindError });

  let dbCityId;
  if (!cityData) {
    console.log('City not found, inserting...');
    const { data: newCity, error: cityInsertError } = await supabase
      .from('cities')
      .insert([{ name: city_name, country: country }])
      .select('id')
      .single();
      
    console.log('City Insert:', { newCity, cityInsertError });
    if (cityInsertError) return res.status(400).json({ error: cityInsertError.message });
    dbCityId = newCity.id;
  } else {
    dbCityId = cityData.id;
  }

  console.log('dbCityId:', dbCityId);

  // 2. Insert the trip_stop using the integer dbCityId
  const { data, error } = await supabase
    .from('trip_stops')
    .insert([{ trip_id, city_id: dbCityId, order_index, start_date, end_date }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

export const updateStop = async (req, res) => {
  const { data, error } = await supabase
    .from('trip_stops')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

export const deleteStop = async (req, res) => {
  const { error } = await supabase.from('trip_stops').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
};

export const addActivityToStop = async (req, res) => {
  const { trip_stop_id, activity_id, day_number, start_time, cost, title, category, duration_minutes } = req.body;
  
  // 1. Find or create the activity in the 'activities' table
  let { data: activityData } = await supabase
    .from('activities')
    .select('id')
    .eq('name', title)
    .single();

  let dbActivityId;
  if (!activityData) {
    const { data: newActivity, error: activityInsertError } = await supabase
      .from('activities')
      .insert([{ 
        name: title, 
        category: category || 'General', 
        cost: cost || 0,
        duration_minutes: duration_minutes || 60 
      }])
      .select('id')
      .single();
      
    if (activityInsertError) return res.status(400).json({ error: activityInsertError.message });
    dbActivityId = newActivity.id;
  } else {
    dbActivityId = activityData.id;
  }

  // 2. Insert into the join table 'trip_activities'
  const { data, error } = await supabase
    .from('trip_activities')
    .insert([{ 
      trip_stop_id, 
      activity_id: dbActivityId, 
      day_number: day_number || 1, 
      start_time: start_time || '09:00',
      cost: cost || 0 
    }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};