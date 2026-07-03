import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://jeataizdssesnzssrvgy.supabase.co', process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('Usuarios').insert([{ "Usuario": "test_user", "Contraseña": "test_password" }]);
  console.log(error);
}
test();
