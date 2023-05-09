const {knex} = require('./db');

module.exports = {
    createTask,
    getAll,
    deleteTask
}

async function getAll(){
    return knex.select().from('List');
}

async function createTask(Task){
    return knex('List').insert(Task); 
}

async function deleteTask(Task){
    return knex('List').delete(Task)
}