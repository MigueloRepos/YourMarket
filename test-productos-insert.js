import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://jeataizdssesnzssrvgy.supabase.co', process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { error } = await supabase.from('Productos').insert([{ 
    Product_name: 'test', 
    Product_descrip: 'test',
    Precio: 10,
    Categoria: 'test',
    Cantidad_dispon: 1,
    Vendedor: 'test',
    "No Telefono": '123',
    Cant_vendida: 0
  }]);
  console.log(error);
}
test();
