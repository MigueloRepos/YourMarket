import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://jeataizdssesnzssrvgy.supabase.co/rest/v1/Usuarios', process.env.VITE_SUPABASE_ANON_KEY || 'test');
async function test() {
  const { data, error } = await supabase.from('Usuarios').select('*').limit(1);
  console.log(error);
}
test();
