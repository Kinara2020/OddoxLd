const jwt = require('jsonwebtoken');
const axios = require('axios');

async function test() {
  const token = jwt.sign({ id: '0a688d62-053e-4dcf-a1c5-3b1e23a0965a' }, 'local-dev-secret-globetrotter-2026', { expiresIn: '1h' });
  
  try {
    const res = await axios.post('http://localhost:5000/api/stops', {
      trip_id: 'ebb95efa-f94c-44d8-a756-92fc8b5de5c6',
      city_name: 'TestCityCurl' + Date.now(),
      country: 'Canada',
      order_index: 0,
      start_date: '2026-10-09',
      end_date: '2026-10-13'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.log('Error:', err.response?.data || err.message);
  }
}
test();
