const fs = require('fs');
const axios = require('axios');
axios.get('http://localhost:3000/schemes/category/Education')
  .then(res => fs.writeFileSync('out.json', JSON.stringify(res.data, null, 2)))
  .catch(err => console.log(err.message));
