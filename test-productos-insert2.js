import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://jeataizdssesnzssrvgy.supabase.co', process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { error } = await supabase.from('Productos').insert([{ 
    Product_name: 'test2', 
    Precio: '10 USD'
  }]);
  console.log(error);
}
test();
