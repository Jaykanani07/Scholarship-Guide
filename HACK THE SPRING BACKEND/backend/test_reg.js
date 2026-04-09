const axios = require('axios');

async function testRegistration() {
  console.log('Testing registration...');
  const testUser = {
    name: 'Test User ' + Date.now(),
    email: 'test' + Date.now() + '@example.com',
    password: 'password123',
    dob: '2000-01-01',
    gender: 'male',
    caste: 'General',
    city: 'Surat',
    income: 'below one lakh',
    religion: 'Hindu',
    address: '123 Test St',
    presentClass: '12th',
    course: 'Science'
  };

  try {
    const response = await axios.post('http://localhost:3000/register', testUser);
    console.log('Registration Response:', response.status, response.data);
  } catch (error) {
    if (error.response) {
      console.error('Registration Failed:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testRegistration();
