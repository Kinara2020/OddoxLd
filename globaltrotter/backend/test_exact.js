import dotenv from 'dotenv';
dotenv.config({ override: true });
import { supabase } from './config/supabase.js';

async function test() {
  const city_name = 'TestCity' + Date.now();
  const country = 'Canada';
  
  let { data: cityData, error: cityFindError } = await supabase
    .from('cities')
    .select('id')
    .eq('name', city_name)
    .eq('country', country)
    .limit(1)
    .single();

  console.log('City Find:', { cityData, cityFindError });

  if (!cityData) {
    const { data: newCity, error: cityInsertError } = await supabase
      .from('cities')
      .insert([{ name: city_name, country: country }])
      .select('id')
      .single();
      
    console.log('City Insert:', { newCity, cityInsertError });
  }
}
test();
