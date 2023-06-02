const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const CONFIG = require('./config.json')
const path = require('path');
const taskRouter = require('./routes/task')
const session = require('express-session');

app.set('view engine', 'ejs');

app.use(
    session({
      secret: process.env.TOKEN_KEY,
      resave: false,
      saveUninitialized: false
    })
  );

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/tasks', taskRouter);

app.get('/', (req, res, next) => {
    res.send('Hello World')
});

app.listen(CONFIG.PORT, () => {
    console.log(`Server is now running at port ${CONFIG.PORT}`)
});