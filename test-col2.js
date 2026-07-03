import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://jeataizdssesnzssrvgy.supabase.co', process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('Productos').select('id, Cant_vistas, Cant_vendida');
  console.log(data);
}
test();
