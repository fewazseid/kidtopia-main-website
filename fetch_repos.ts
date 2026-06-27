import https from 'https';

https.get('https://api.github.com/users/fewazseid/repos', { headers: { 'User-Agent': 'node.js' } }, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(JSON.parse(data).map(r => r.name));
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
