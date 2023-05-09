const express = require('express');
const app = express();
const CONFIG = require('./config.json')
const path = require('path');
const taskRouter = require('./routes/task')

app.set('view engine', 'ejs');

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(express.json());
app.use(express.urlencoded());

app.use('/tasks', taskRouter);

app.get('/', (req, res, next) => {
    res.send('Hello World')
});

app.listen(CONFIG.PORT, () => {
    console.log(`Server is now running at port ${CONFIG.PORT}`)
});