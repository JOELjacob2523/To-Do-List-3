const {knex} = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

module.exports = {
    createTask,
    getAll,
    deleteTask,
    updateTask,
    getID,
    createUser,
    confirmUser,
    getUserPass,
    getIDFromList,
    getAllFromUsers
}

async function getIDFromList(){
    return knex.select('userID').from('List');
}

async function getAll(userId) {
  const tasks = await knex('List').select().where({userID: userId});
  return tasks;
}

async function getUserPass(){
  return knex.select().from('users');
}

async function getAllFromUsers(Username, Password){
  return knex.select().from('users').where({username: Username, password: Password})
}

async function createTask(Task){
    return knex('List').insert(Task).returning('*'); 
}

async function deleteTask(id){
      return knex('List').where('ListID', id).del();
}

async function updateTask(Task) {
  const { ListID, Subject, Description, Date, Time} = Task;
  return knex('List').where('ListID', ListID).update({ Subject, Description, Date, Time});
}

async function getID(ListID){
    return knex.select().from('List').where('ListID', ListID);
}

// get config vars
dotenv.config();
// access config var
process.env.TOKEN_KEY;
async function createUser(username, password) {
    const user = await knex('users').where('username', username).first();  
    if (user) {
      if (user.password !== password) {
        throw new Error('Invalid username or password');
      } else {
        throw new Error('Username already exists');
      }  
    }
    const hashedPassword = await bcrypt.hash(password, 8);

    const payload = {
      username: username,
      password: hashedPassword
    };
      const token = jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: '1h' });
      await knex('users').insert({ username, password: hashedPassword, token});
  }

  async function confirmUser(username, password) {
    const user = await knex('users').where('username', username).first();    
    if (!user) {
      throw new Error('Invalid username or password');
    }  
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid username or password');
    }      
    const hashedPassword = await bcrypt.hash(password, 8);
    const id = user.userID
    const payload = {
      userID: id,
      username: username,
      password: hashedPassword
    };
    const token = jwt.sign(payload, process.env.TOKEN_KEY);
    await knex('users').where('userID', id).update({token})
    const decodedToken = jwt.verify(user.token, process.env.TOKEN_KEY);
    const userId = decodedToken.userID;

    return {user, userId};
  }