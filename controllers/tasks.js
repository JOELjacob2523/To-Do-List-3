const {knex} = require('./db');
const bcrypt = require('bcrypt');
const { text } = require('body-parser');
const moment = require('moment-timezone');

module.exports = {
    createTask,
    getAll,
    deleteTask,
    updateTask,
    getID,
    createUser,
    confirmUser,
    getUserPassID
}

/*async function getAll(){
    return knex.select().from('List');
}*/

async function getAll(){
  return knex.select().from('List').join('users', {'users.userID': 'List.userID'});
}

async function getUserPassID(){
  return knex.select('userID').from('users');
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

const saltRounds = 10;

async function createUser(userpass) {
    const { username, password } = userpass;
    // Retrieve the user with the provided username from the database
    const user = await knex('users').where('username', username).first();  
    if (user) {
      // User with the provided username exists
      if (user.password !== password) {
        throw new Error('Invalid username or password');
      } else {
        throw new Error('Username already exists');
      }
    }  
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the user credentials into the `users` table
    await knex('users').insert({ username, password: hashedPassword });
  }

  async function confirmUser(userpass) {
    const { username, password } = userpass;
    const user = await knex('users').where('username', username).first();    
    if (!user) {
      throw new Error('Invalid username or password');
    }  
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid username or password');
    }
    return user;
  }