const express = require('express');
const app = express();
const CONFIG = require('./config.json')
const path = require('path');

app.set('view engine', 'ejs');

app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', (req, res, next) => {
    res.send('Hello World')
});

app.get('/todo', (req, res, next) => {
    res.render('tasks')
});

app.listen(CONFIG.PORT, () => {
    console.log(`Server is now running at port ${CONFIG.PORT}`)
});