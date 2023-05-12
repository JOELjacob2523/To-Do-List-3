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
    res.render('tasks-view', { tasks });
  });
  
  Router.post('/delete', async (req, res, next) => {
    try{
      await Controller.deleteTask(req.body.ListID);
      res.redirect('/tasks/view');
    }catch(e){
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  Router.get('/update', async(req, res, next) => {
        let tasks = await Controller.getAll();
        res.render('update-task', { tasks });
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