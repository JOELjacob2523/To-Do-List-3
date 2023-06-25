const { knex } = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const CONFIG = require('../config.json')

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
  getAllFromUsers,
  taskReminder
};

async function getIDFromList() {
  return knex.select("userID").from("List");
}

async function getAll(userId) {
  const tasks = await knex("List").select().where({ userID: userId });
  return tasks;
}

async function getUserPass() {
  return knex.select().from("users");
}

async function getAllFromUsers(Username, Password) {
  return knex
    .select()
    .from("users")
    .where({ username: Username, password: Password });
}

async function createTask(Task) {
  return knex("List").insert(Task).returning("*");
}

async function deleteTask(id) {
  return knex("List").where("ListID", id).del();
}

async function updateTask(Task) {
  const { ListID, Subject, Description, Date, Time } = Task;
  return knex("List")
    .where("ListID", ListID)
    .update({ Subject, Description, Date, Time });
}

async function getID(ListID) {
  return knex.select().from("List").where("ListID", ListID);
}

// get config vars
dotenv.config();
// access config var
process.env.TOKEN_KEY;
async function createUser(username, password) {
  const user = await knex("users").where("username", username).first();
  if (user) {
    throw new Error("Username already exists");
  }
  
  const hashedPassword = await bcrypt.hash(password, 8);

  const payload = {
    username: username,
    password: hashedPassword,
  };
  const token = jwt.sign(payload, process.env.TOKEN_KEY);
  await knex("users").insert({ username, password: hashedPassword, token });
}

async function confirmUser(username, password) {
  const user = await knex("users").where("username", username).first();
  if (!user) {
    throw new Error("Invalid username or password");
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid username or password");
  }
  const hashedPassword = await bcrypt.hash(password, 8);
  const id = user.userID;
  const payload = {
    userID: id,
    username: username,
    password: hashedPassword,
  };
  const token = jwt.sign(payload, process.env.TOKEN_KEY);
  await knex("users").where("userID", id).update({ token });
  
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  const userId = decodedToken.userID;
  
  return { user, userId };
}

    async function taskReminder(userId, taskId) {
      try {
        let user = await knex.select("username").from("users").where({ userID: userId }).first();
        let tasks = await knex.select().from("List").where({ userID: userId, ListID: taskId });
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "jsjprog4119@gmail.com",
            pass: CONFIG.EMAIL_PASS,
          },
        });
    
        if (Array.isArray(tasks)) {
          for (const task of tasks) {
            const mailOptions = {
              from: "jsjprog4119@gmail.com",
              to: user.username,
              subject: `Task Reminder`,
              text: `This is a reminder of your task
                Subject: ${task.Subject}
                Description: ${task.Description}
                Date: ${new Date(task.Date.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString()}
                Time: ${new Date(task.Time.getTime() + 5 * 60 * 60 * 1000).toLocaleTimeString('en-US', 
                { hour: '2-digit', minute: '2-digit' })}`,
            };
    
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent: " + info.response);
              }
            });
          }
        } else {
          console.log("No tasks found for the user.");
        }
      } catch (err) {
        console.error(err);
      }
    }
    
