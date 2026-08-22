import dotenv from 'dotenv';
dotenv.config({ override: true });
import { supabase } from './config/supabase.js';

async function test() {
  const { data, error } = await supabase
    .from('cities')
    .insert([{ name: 'TestCity1234', country: 'TestCountry1234' }])
    .select('id')
    .single();

  console.log('Result:', { data, error });
}
test();
