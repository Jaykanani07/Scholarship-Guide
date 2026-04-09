const supabase = require('./supabaseClient');

async function listUsers() {
  console.log('Listing first 5 users:');
  const { data, error } = await supabase
    .from('users')
    .select('email, name, created_at')
    .limit(5);
  
  if (error) {
    console.error('Error fetching users:', error);
    return;
  }
  
  if (data && data.length > 0) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log('No users found in table.');
  }
}

listUsers();
