const supabase = require('./supabaseClient');

async function test() {
  const { data, error } = await supabase.from('schemes').select('*').limit(1);
  console.log('Test schemes query result:', data, error);
}

test();
