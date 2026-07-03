import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://jeataizdssesnzssrvgy.supabase.co', process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('Usuarios').insert([{ 
    "Usuario": "test_register", 
    "Contraseña": "test_password",
    "No Tel": "1234567890",
    "Fecha_Regis": new Date().toISOString()
  }]);
  console.log(error);
}
test();
