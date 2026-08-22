import { supabase } from '../config/supabase.js';

export const getBudget = async (req, res) => {
  try {
    const { data: trip, error } = await supabase
      .from('trips')
      .select(`
        id,
        trip_stops (
          cities ( country ),
          trip_activities ( cost, activities ( category ) )
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error) {
      console.error("Supabase Error in getBudget:", error);
      return res.status(404).json({ error: 'Trip not found', details: error });
    }

    let totalActivityCost = 0;
    const byCategory = {};

    trip.trip_stops.forEach(stop => {
      stop.trip_activities?.forEach(act => {
        const cost = parseFloat(act.cost) || 0;
        totalActivityCost += cost;
        const cat = act.activities?.category || 'general';
        byCategory[cat] = (byCategory[cat] || 0) + cost;
      });
    });

    let primary_country = 'USA';
    if (trip.trip_stops && trip.trip_stops.length > 0) {
      primary_country = trip.trip_stops[0].cities?.country || 'USA';
    }

    res.json({
      trip_id: trip.id,
      total_budget: 0,
      total_activity_cost: totalActivityCost,
      by_category: byCategory,
      primary_country
    });
  } catch (err) {
    console.error("Budget Error:", err);
    res.status(500).json({ error: err.message });
  }
};