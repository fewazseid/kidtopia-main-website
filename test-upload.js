import axios from 'axios';
async function test() {
  try {
    const res = await axios.post('http://localhost:3000/api/upload');
    console.log('Status:', res.status);
    console.log('Data:', res.data);
  } catch (err) {
    console.log('Error Status:', err.response?.status);
    console.log('Error Data:', err.response?.data);
  }
}
test();
