const supabase = require('./supabaseClient');

async function testAll() {
  const tables = ['users', 'cities', 'castes', 'categories', 'courses', 'schemes'];
  console.log("Testing Supabase tables...");
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table '${table}' error:`, error.message);
    } else {
      console.log(`Table '${table}' exists. Rows:`, data.length);
    }
  }
}
testAll();
