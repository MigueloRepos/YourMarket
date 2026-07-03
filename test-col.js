import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://jeataizdssesnzssrvgy.supabase.co', process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('Productos').select('Cant_vistas').limit(1);
  console.log(data, error);
}
test();
