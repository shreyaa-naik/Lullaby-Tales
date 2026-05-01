const http = require('http');
http.get('http://localhost:5000/api/stories/user/69f43bec78cc7e7bf4b1006b', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('USER:', data));
});
http.get('http://localhost:5000/api/stories/liked/69f43bec78cc7e7bf4b1006b', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('LIKED:', data));
});
