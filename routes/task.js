const Router = require('express').Router();
const Controller = require('../controllers/tasks');

Router.get('/signup', async(req, res, next) => {
  res.render('signup');
});

Router.get('/wrong-signup-msg', (req, res, next) => {
  res.render('wrong-signup-msg', {wrongSignupMsg: 'Username Already Exists'})
});

Router.post('/signup', async(req, res, next) => {
  try{
    await Controller.createUser(req.body.username, req.body.password);
    res.redirect('/tasks/login')
  } catch(error){
    console.error('Error inserting user credentials:', error);    
    res.redirect('wrong-signup-msg')
  }
});

Router.get('/login', async (req, res, next) => {
  res.render('login');
});

Router.post('/login', async (req, res, next) => {
  try {
    const { user, userId } = await Controller.confirmUser(req.body.username, req.body.password);
    req.session.token = user.token;
    req.session.userID = userId;
    res.redirect('/tasks/view');
  } catch (error) {
    console.error('Error inserting user credentials:', error);
    res.redirect('incorrect-login');
  }
});

Router.get('/incorrect-login', (req, res, next) => {
  res.render('incorrect-login', {loginMsg: 'Invalid Username or Password'})
});

  Router.get('/create', async (req, res, next) => {  
    const tasks = await Controller.getUserPass();
    res.render('tasks-form', { tasks });
  });

  Router.post('/create', async (req, res, next) => {
    const task = {
      Subject: req.body.Subject,
      Description: req.body.Description,
      Date: req.body.Date || new Date().toISOString().split('T')[0],
      Time: req.body.Time,
      userID: req.session.userID,
    };
    await Controller.createTask(task);
    res.redirect('/tasks/view');
  });

  Router.get('/view', async (req, res, next) => {
    try{      
    let tasks = await Controller.getAll(req.session.userID);
    for (let task of tasks) {
      task.done = task.done ? true : false;
    }
    res.render('tasks-view', { tasks: tasks });
  }catch(err){
    console.error(err);
    res.redirect('/tasks/login');
  }});

  Router.post('/email/:taskId', async (req, res, next) => {
    try {
      let user = await Controller.taskReminder(req.session.userID, req.params.taskId);
      res.redirect('email-send');
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });  

  Router.get('/email/email-send', (req, res, next) => {
    res.render('email-send', {emailSend: 'Email Sent Successfully'});
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

  Router.get('/popup-msg', async (req, res, next) => {
    res.render('popup-msg', { deleteMsg: 'Task Successfully Deleted'});
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
    res.render('update-msg', {updateMsg: 'Task Successfully Updated'})
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

  Router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
      if (err){
        res.status(400).send('Unable to logout');
      } else {
        res.redirect('/tasks/login');
      }
    });
  });

module.exports = Router;