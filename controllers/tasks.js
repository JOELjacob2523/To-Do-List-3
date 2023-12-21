const { knex } = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const CONFIG = require('../config.json');
const ejs = require ('ejs');
const schedule = require('node-schedule');

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
  return knex("List").insert(Task);
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

    let taskTime = tasks[0].Date;
    let currentTime = new Date();
    let reminderTime = new Date(taskTime);
    let timeDifference = reminderTime.getTime() - currentTime.getTime();

    if (timeDifference > 0) {
      console.log(`Task reminder scheduled in ${timeDifference} milliseconds`);

      schedule.scheduleJob(reminderTime, async function() {
        try {
          ejs.renderFile('views/email.ejs', { tasks }, function(err, data) {
            if (err) {
              console.log(err);
            } else {
              const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: "jsjprog4119@gmail.com",
                  pass: CONFIG.EMAIL_PASS,
                },
              });

              const mailOptions = {
                from: "jsjprog4119@gmail.com",
                to: user.username,
                subject: `Task Reminder`,
                html: data,
              };

              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  console.error("Error sending email:", error);
                } else {
                  console.log("Email sent for task reminder!");
                }
              });
            }
          });
        } catch (error) {
          console.error("Error sending email:", error);
        }
      });
    } else {
      console.log("Task time has already passed.");
    }
  } catch (err) {
    console.error(err);
  }
}
