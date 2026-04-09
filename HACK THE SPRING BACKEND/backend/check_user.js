const supabase = require('./supabaseClient');

async function checkUser(email) {
  console.log(`Checking user: ${email}`);
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email);
  
  if (error) {
    console.error('Error fetching user:', error);
    return;
  }
  
  if (data && data.length > 0) {
    console.log('User found:', JSON.stringify(data[0], null, 2));
  } else {
    console.log('User not found.');
  }
}

// Replace with the "old login id" if provided by user, or common test accounts
const emailToCheck = process.argv[2] || 'test@example.com';
checkUser(emailToCheck);
