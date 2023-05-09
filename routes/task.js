const Router = require('express').Router();
const Controller = require('../controllers/tasks');

Router.get('/create', (req, res, next) => {
    res.render('tasks-form');
});

Router.get('/view', async (req, res, next) => {
    let tasks = await Controller.getAll();
    res.render('tasks-view', {tasks});
});

Router.post('/create', async (req, res, next) => {
    try{
        let data = await Controller.createTask(req.body);
        res.send(data);
    }catch(e){
        console.error(e);
        res.status(500).render('error', {error : e.toString()});
    }
    
});

module.exports = Router;