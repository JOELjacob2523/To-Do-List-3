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
    // Get all tasks from the database
    let tasks = await Controller.getAll();
  
    // Render the 'tasks-view' template with the tasks data
    res.render('tasks-view', { tasks });
  });

module.exports = Router;