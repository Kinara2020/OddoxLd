import { supabase } from '../config/supabase.js';

export const createTrip = async (req, res) => {
  const { title, start_date, end_date, description, cover_photo_url } = req.body;
  const { data, error } = await supabase
    .from('trips')
    .insert([{ 
      user_id: req.userId, 
      name: title, 
      start_date, 
      end_date, 
      description, 
      cover_photo_url
    }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ ...data, title: data.name });
};

export const getTrips = async (req, res) => {
  const { data, error } = await supabase
    .from('trips')
    .select('*, trip_stops(count)')
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data.map(trip => ({ ...trip, title: trip.name })));
};

export const getTripById = async (req, res) => {
  const { data, error } = await supabase
    .from('trips')
    .select(`*, trip_stops (*, cities (name, country), trip_activities (*, activities (*)))`)
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: error.message });
  
  // Basic ownership check
  if (data.user_id !== req.userId && !data.is_public) {
      return res.status(403).json({ error: 'Access denied' });
  }

  // Map the nested db structure back to the flat structure the frontend expects
  const mappedStops = (data.trip_stops || []).map(stop => ({
    ...stop,
    city_name: stop.cities?.name,
    country: stop.cities?.country,
    activities: (stop.trip_activities || []).map(ta => ({
      ...ta.activities, // name, category, cost, etc
      title: ta.activities?.name, // frontend expects title
      day_number: ta.day_number,
      start_time: ta.start_time
    }))
  }));

  res.json({ ...data, title: data.name, trip_stops: mappedStops });
};

export const updateTrip = async (req, res) => {
  const updates = { ...req.body };
  if (updates.title) {
    updates.name = updates.title;
    delete updates.title;
  }
  delete updates.total_budget; // Not in DB schema

  const { data, error } = await supabase
    .from('trips')
    .update(updates)
    .eq('id', req.params.id)
    .eq('user_id', req.userId)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ ...data, title: data.name });
};

export const deleteTrip = async (req, res) => {
  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.userId);

  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
};

export const shareTrip = async (req, res) => {
  const slug = `${req.params.id.slice(0, 8)}-${Date.now().toString(36)}`;
  const { data, error } = await supabase
    .from('trips')
    .update({ is_public: true, public_slug: slug })
    .eq('id', req.params.id)
    .eq('user_id', req.userId)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ ...data, title: data.name });
};

export const copyTrip = async (req, res) => {
  // 1. Fetch original trip
  const { data: original, error: fetchError } = await supabase
    .from('trips')
    .select(`*, trip_stops (*, cities(name, country), trip_activities (*, activities (*)))`)
    .eq('id', req.params.id)
    .single();

  if (fetchError || !original) return res.status(404).json({ error: 'Trip not found' });

  // 2. Insert new trip
  const { data: newTrip, error: tripError } = await supabase
    .from('trips')
    .insert([{
      user_id: req.userId,
      name: `${original.name} (Copy)`,
      start_date: original.start_date,
      end_date: original.end_date,
      description: original.description,
      cover_photo_url: original.cover_photo_url
    }])
    .select()
    .single();

  if (tripError) return res.status(400).json({ error: tripError.message });

  // 3. Insert stops and activities
  for (const stop of original.trip_stops) {
    const { data: newStop } = await supabase
      .from('trip_stops')
      .insert([{
        trip_id: newTrip.id,
        city_id: stop.city_id,
        order_index: stop.order_index,
        start_date: stop.start_date,
        end_date: stop.end_date
      }])
      .select()
      .single();

    if (!stop.trip_activities) continue;
    const activityRows = stop.trip_activities.map((ta) => ({
      trip_stop_id: newStop.id,
      activity_id: ta.activity_id,
      day_number: ta.day_number,
      start_time: ta.start_time,
      cost: ta.cost
    }));
    if (activityRows.length) await supabase.from('trip_activities').insert(activityRows);
  }

  res.status(201).json({ ...newTrip, title: newTrip.name });
};

export const getPackingList = async (req, res) => {
  try {
    const { data: trip, error } = await supabase
      .from('trips')
      .select(`
        id,
        name,
        trip_stops (
          cities ( name, country ),
          trip_activities ( activities ( category ) )
        )
      `)
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (error) return res.status(404).json({ error: 'Trip not found' });

    let isBeach = false;
    let isEurope = false;
    let isIndia = false;
    let hasTourism = false;
    let hasDining = false;

    // Analyze trip data
    (trip.trip_stops || []).forEach(stop => {
      const city = stop.cities?.name?.toLowerCase() || '';
      const country = stop.cities?.country?.toLowerCase() || '';
      
      if (['hawaii', 'miami', 'goa', 'bali', 'maldives', 'cancun', 'phuket', 'bora bora'].includes(city) || ['bahamas', 'fiji'].includes(country)) {
        isBeach = true;
      }
      if (['france', 'italy', 'uk', 'germany', 'spain', 'netherlands', 'switzerland', 'greece', 'portugal', 'united kingdom'].includes(country)) {
        isEurope = true;
      }
      if (country === 'india') {
        isIndia = true;
      }

      (stop.trip_activities || []).forEach(ta => {
        const cat = ta.activities?.category?.toLowerCase() || '';
        if (cat.includes('tourism') || cat.includes('memorial') || cat.includes('building')) hasTourism = true;
        if (cat.includes('catering') || cat.includes('entertainment')) hasDining = true;
      });
    });

    const packingList = {
      Essentials: [
        { id: 'p1', item: 'Passport / ID', packed: false },
        { id: 'p2', item: 'Phone & Charger', packed: false },
        { id: 'p3', item: 'Travel Insurance', packed: false },
        { id: 'p4', item: 'Medications', packed: false },
        { id: 'p5', item: 'Toothbrush & Toiletries', packed: false }
      ],
      Clothing: [
        { id: 'c1', item: 'Undergarments & Socks', packed: false },
        { id: 'c2', item: 'Comfortable T-Shirts', packed: false },
        { id: 'c3', item: 'Pants / Shorts', packed: false },
        { id: 'c4', item: 'Light Jacket / Sweater', packed: false }
      ]
    };

    if (isBeach) {
      packingList['Beach Gear'] = [
        { id: 'b1', item: 'Swimwear', packed: false },
        { id: 'b2', item: 'Sunscreen (SPF 50+)', packed: false },
        { id: 'b3', item: 'Flip-flops / Sandals', packed: false },
        { id: 'b4', item: 'Beach Towel', packed: false },
        { id: 'b5', item: 'Sunglasses', packed: false }
      ];
    }

    if (hasTourism) {
      packingList.Clothing.push({ id: 'c5', item: 'Comfortable Walking Shoes', packed: false });
      if (!packingList['Tech & Gadgets']) packingList['Tech & Gadgets'] = [];
      packingList['Tech & Gadgets'].push({ id: 't1', item: 'Camera / GoPro', packed: false });
      packingList['Tech & Gadgets'].push({ id: 't2', item: 'Power Bank', packed: false });
      packingList.Essentials.push({ id: 'p6', item: 'Daypack / Small Backpack', packed: false });
    }

    if (hasDining) {
      packingList.Clothing.push({ id: 'c6', item: 'Smart Casual Outfit (Evening)', packed: false });
    }

    if (isEurope) {
      if (!packingList['Tech & Gadgets']) packingList['Tech & Gadgets'] = [];
      packingList['Tech & Gadgets'].push({ id: 't3', item: 'Universal Adapter (Type C/G)', packed: false });
      packingList.Essentials.push({ id: 'p7', item: 'Euro/Pound Currency', packed: false });
    }

    if (isIndia) {
      if (!packingList['Tech & Gadgets']) packingList['Tech & Gadgets'] = [];
      packingList['Tech & Gadgets'].push({ id: 't4', item: 'Universal Adapter (Type C/D)', packed: false });
      if (!packingList['Health']) packingList['Health'] = [];
      packingList['Health'].push({ id: 'h1', item: 'Mosquito Repellent', packed: false });
      packingList['Health'].push({ id: 'h2', item: 'Hand Sanitizer & Wipes', packed: false });
      packingList['Health'].push({ id: 'h3', item: 'Digestive Meds (Probiotics)', packed: false });
    }

    res.json(packingList);
  } catch (err) {
    console.error('Packing List Error:', err);
    res.status(500).json({ error: 'Failed to generate packing list' });
  }
};