import axios from 'axios';

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/stops', {
      trip_id: 'ebb95efa-f94c-44d8-a756-92fc8b5de5c6',
      city_id: 'dummy',
      city_name: 'Udaipur',
      country: 'India',
      order_index: 0,
      start_date: '2026-10-09',
      end_date: '2026-10-13'
    });
    console.log(res.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}
test();
