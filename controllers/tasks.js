const {knex} = require('./db');

module.exports = {
    createTask,
    getAll
}

async function getAll(){
    return knex.select().from('ToDoList');
}

async function createTask(Task){
    return knex('Categories').insert(Task); 
}