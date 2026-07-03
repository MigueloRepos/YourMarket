import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://jeataizdssesnzssrvgy.supabase.co', process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  await supabase.from('Productos').update({ Cant_vistas: 10, Cant_vendida: 5 }).eq('id', 1);
  await supabase.from('Productos').update({ Cant_vistas: 5, Cant_vendida: 20 }).eq('id', 2);
  console.log('done');
}
test();
