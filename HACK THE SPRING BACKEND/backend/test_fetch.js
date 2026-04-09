const axios = require('axios');
axios.get('http://localhost:3000/schemes/category/Education')
  .then(res => console.log(JSON.stringify(res.data, null, 2)))
  .catch(err => console.log(err.message));
