import dotenv from 'dotenv';
dotenv.config({ override: true });
import { supabase } from './config/supabase.js';

async function test() {
  const { data, error } = await supabase.rpc('get_triggers'); // won't work
}
