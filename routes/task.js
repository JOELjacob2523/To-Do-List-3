const Router = require('express').Router();
const Controller = require('../controllers/tasks');

// Route handler for GET '/create'
Router.get('/create', async (req, res, next) => {
    res.render('tasks-form');
  });
  
  // Route handler for POST '/create'
  Router.post('/create', async (req, res, next) => {
    // Create the task using data from the form
    await Controller.createTask(req.body);
  
    // Redirect to the '/view' route
    res.redirect('/tasks/view');
  });
  
  // Route handler for GET '/view'
  Router.get('/view', async (req, res, next) => {
    let tasks = await Controller.getAll();
    for (let task of tasks){
      task.done = task.done ? true : false;
    }
    res.render('tasks-view', { tasks: tasks });
  });
  
  Router.post('/delete/:taskId', async (req, res, next) => {
    try{
      await Controller.deleteTask(req.params.taskId);
      res.redirect('/tasks/view');
    }catch(e){
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  Router.get('/edit/:taskId', async(req, res, next) => {
    try {
      let tasks = await Controller.getID(req.params.taskId);
      res.render('update-task', { tasks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  Router.post('/update', async(req, res, next) => {
    try{
    await Controller.updateTask(req.body);
    res.redirect('/tasks/view');
    }catch(e){
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

module.exports = Router;