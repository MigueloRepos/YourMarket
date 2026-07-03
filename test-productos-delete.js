import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://jeataizdssesnzssrvgy.supabase.co', process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { error } = await supabase.from('Productos').delete().eq('id', 1);
  console.log('Delete:', error);
}
test();
