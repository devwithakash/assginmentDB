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

/* ALL USERS */
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password") // Don't send passwords!
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments();

    res.json({
      users,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* 💰 USER EXPENSES (POPULATED) */
exports.getExpenses = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const expenses = await Expense.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Expense.countDocuments();

    res.json({
      expenses,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
/*  USER TASKS (POPULATED) */
exports.getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const tasks = await Task.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments();

    res.json({
      tasks,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};