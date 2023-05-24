const Router = require('express').Router();
const Controller = require('../controllers/tasks');

Router.get('/signup', async(req, res, next) => {
  res.render('signup');
});

Router.get('/wrong-signup-msg', (req, res, next) => {
  res.render('wrong-signup-msg', {wrongSignupMsg: 'Usermane already exists'})
});

Router.post('/signup', async(req, res, next) => {
  try{
    await Controller.createUser(req.body);
    res.redirect('/tasks/login')
  } catch(error){
    console.error('Error inserting user credentials:', error);    
    res.redirect('wrong-signup-msg')
  }
});

Router.get('/login', async (req, res, next) => {
    res.render('login');
});

Router.get('/incorrect-login', (req, res, next) => {
  res.render('incorrect-login', {loginMsg: 'Invalid username or password'})
});

Router.post('/login', async(req, res, next) => {
  try{
    await Controller.confirmUser(req.body)
    res.redirect('/tasks/view')
  } catch(error){
    console.error('Error inserting user credentials:', error);
    res.redirect('incorrect-login')
  }
});

  Router.get('/create', async (req, res, next) => {  
    const tasks = await Controller.getUserPassID(); 
    res.render('tasks-form', { tasks });
  });

  Router.post('/create', async (req, res, next) => {
    const parsedUserID = parseInt(req.body.userID, 10); // Parse userID to integer    
    // Create the task using data from the form
    const task = {
      Subject: req.body.Subject,
      Description: req.body.Description,
      Date: req.body.Date,
      Time: req.body.Time,
      userID: parsedUserID // Use the parsed userID
    };  
    await Controller.createTask(task);    
    // Redirect to the '/view' route
    res.redirect('/tasks/view');
  });
  
  // Route handler for GET '/view'
  Router.get('/view', async (req, res, next) => {
    if (Controller.confirmUser){
    let tasks = await Controller.getAll();
    for (let task of tasks){
      task.done = task.done ? true : false;
    }
    res.render('tasks-view', { tasks: tasks });
  }
  });

  Router.get('/popup-msg', async (req, res, next) => {
    res.render('popup-msg', { deleteMsg: 'Task Successfully Deleted'});
  });
  
  Router.post('/delete/:taskId', async (req, res, next) => {
    try{
      await Controller.deleteTask(req.params.taskId);
      res.redirect('/tasks/popup-msg');
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

  Router.get('/update-msg', async (req, res, next) => {
    res.render('update-msg', {updateMsg: 'Task successfully Updated'})
  })
  
  Router.post('/update', async(req, res, next) => {
    try{
    await Controller.updateTask(req.body);
    res.redirect('/tasks/update-msg');
    }catch(e){
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

module.exports = Router;