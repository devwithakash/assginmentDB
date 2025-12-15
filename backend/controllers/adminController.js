const User = require("../models/User");
const Expense = require("../models/Expense");
const Task = require("../models/Task");

/* 📊 DASHBOARD COUNT */
exports.getDashboard = async (req, res) => {
  const users = await User.countDocuments();
  const expenses = await Expense.countDocuments();
  const tasks = await Task.countDocuments();

  res.json({ users, expenses, tasks });
};

/* ALL USERS + SEARCH */
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, keyword } = req.query; // <--- 1. Get keyword
    const skip = (page - 1) * limit;

    // 2. Build Filter
    const filter = {};
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } }
      ];
    }

    const users = await User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter); // <--- Count filtered docs

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

/* 💰 ALL EXPENSES + SEARCH */
exports.getExpenses = async (req, res) => {
  try {
    const { page = 1, limit = 10, keyword } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (keyword) {
      filter.title = { $regex: keyword, $options: "i" }; // Search by title
    }

    const expenses = await Expense.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Expense.countDocuments(filter);

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

/* 📋 ALL TASKS + SEARCH */
exports.getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, keyword } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (keyword) {
      filter.title = { $regex: keyword, $options: "i" }; // Search by title
    }

    const tasks = await Task.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(filter);

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