const User = require("../models/User");
const Expense = require("../models/Expense");
const Task = require("../models/Task");

/* 📊 OPTIONAL DASHBOARD COUNT */
exports.getDashboard = async (req, res) => {
  const users = await User.countDocuments();
  const expenses = await Expense.countDocuments();
  const tasks = await Task.countDocuments();

  res.json({ users, expenses, tasks });
};

/* 👥 ALL USERS */
exports.getUsers = async (req, res) => {
  const users = await User.find().select("name email role");
  res.json(users);
};

/* 💰 USER EXPENSES (POPULATED) */
exports.getExpenses = async (req, res) => {
  const expenses = await Expense.find()
    .populate("user", "name email");

  res.json(expenses);
};

/* ✅ USER TASKS (POPULATED) */
exports.getTasks = async (req, res) => {
  const tasks = await Task.find()
    .populate("user", "name email");

  res.json(tasks);
};
