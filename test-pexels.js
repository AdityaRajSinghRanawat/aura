// Quick test of Pexels API
const apiKey = 'gM9cnmGk9gUfU6ktCavyNTnsbYUfqXL7qyT3yR0KGeS7iigQoldbirmM';
const query = 'house';
const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=4`;

console.log('Testing Pexels API with URL:', url);
console.log('API Key:', apiKey.substring(0, 10) + '...');

fetch(url, {
  headers: { Authorization: apiKey }
})
  .then(res => {
    console.log('Response status:', res.status, res.statusText);
    return res.json();
  })
  .then(data => {
    console.log('Response data:', data);
    if (data.photos && data.photos.length > 0) {
      console.log('✓ First photo:', {
        id: data.photos[0].id,
        photographer: data.photos[0].photographer,
        src: {
          large: data.photos[0].src?.large?.substring(0, 50) + '...',
          medium: data.photos[0].src?.medium?.substring(0, 50) + '...'
        }
      });
    }
  })
  .catch(err => console.error('❌ Error:', err));
