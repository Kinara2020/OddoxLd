import dotenv from 'dotenv';
dotenv.config({ override: true });
import { supabase } from './config/supabase.js';

async function checkItineraries() {
  const { data: trips, error: tripsError } = await supabase
    .from('trips')
    .select(`
      id, name,
      trip_stops (
        id, cities (name, country),
        trip_activities (
          id, day_number, start_time,
          activities (name, category, cost)
        )
      )
    `);

  if (tripsError) {
    console.error('Error fetching trips:', tripsError);
    return;
  }

  trips.forEach(trip => {
    let activityCount = 0;
    trip.trip_stops.forEach(stop => {
      activityCount += stop.trip_activities.length;
    });
    console.log(`Trip: ${trip.name} - Stops: ${trip.trip_stops.length} - Activities: ${activityCount}`);
    if (activityCount > 0) {
      trip.trip_stops.forEach(stop => {
        if (stop.trip_activities.length > 0) {
          console.log(`  Stop: ${stop.cities.name}, ${stop.cities.country}`);
          stop.trip_activities.forEach(act => {
             console.log(`    Day ${act.day_number} at ${act.start_time}: ${act.activities.name} (${act.activities.category})`);
          });
        }
      });
    }
  });
}

checkItineraries();
