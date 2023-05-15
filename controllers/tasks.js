const {knex} = require('./db');

module.exports = {
    createTask,
    getAll,
    deleteTask,
    updateTask,
    getID
}

async function getAll(){
    return knex.select().from('List');
}

async function createTask(Task){
    return knex('List').insert(Task); 
}

async function deleteTask(id){
      return knex('List').where('ListID', id).del();
  }

  async function updateTask(Task) {
    const { ListID, Subject, Description, Date, Time } = Task;
    return knex('List').where('ListID', ListID).update({ Subject, Description, Date, Time });
  }

  async function getID(ListID){
    return knex.select().from('List').where('ListID', ListID);
}