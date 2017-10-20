const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static('dist'));

app.get('/config', (request, response) => {
    response.json({
        foo: 'foo',
    });
});

app.get('/data', (request, response) => {
    response.sendFile(path.join(__dirname, 'data/data.json'));
});
app.get('/*', (request, response) => {
    response.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port);
console.log(`server started on port ${port}`);
