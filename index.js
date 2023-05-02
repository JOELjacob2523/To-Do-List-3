const express = require('express');
const app = express();
const CONFIG = require('./config.json')

app.set('view engine', 'ejs');

app.get('/', (req, res, next) => {
    res.send('Hello World')
});

app.get('/todo', (req, res, next) => {
    res.render('tasks')
});

app.listen(CONFIG.PORT, () => {
    console.log(`Server is now running at port ${CONFIG.PORT}`)
});