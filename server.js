const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 3001

app.use('/', router);
app.use(express.static(path.join(__dirname, '../public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
