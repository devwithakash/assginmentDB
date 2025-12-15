// controllers/taskController.js
const Task = require("../models/Task");
const mongoose = require("mongoose");
// CREATE
exports.addTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.user.id,
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// LIST + FILTER + PAGINATION
exports.getTasks = async (req, res) => {
  try {
    const { 
      status, 
      priority, 
      keyword, 
      startDate,   
      endDate,
      sortBy = "dueDate", 
      order = "asc",      
      page = 1, 
      limit = 10 
    } = req.query;

    const filter = { user: req.user.id };

    // 1. Exact Filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    
    // 2. Keyword Search
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ];
    }

    // 3. Date Range Filter
    if (startDate || endDate) {
      filter.dueDate = {};
      if (startDate) filter.dueDate.$gte = new Date(startDate);
      if (endDate) filter.dueDate.$lte = new Date(endDate);
    }

    // 4. Sorting Logic (Dynamic)
    const sortOptions = {};
    sortOptions[sortBy] = order === "desc" ? -1 : 1;

    // 5. Query
    const tasks = await Task.find(filter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

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

// DETAIL
exports.getTaskById = async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user.id,
  });
  res.json(task);
};

// UPDATE
exports.updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );
  res.json(task);
};

// DELETE
exports.deleteTask = async (req, res) => {
  await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });
  res.json({ msg: "Task deleted" });
};

// SUMMARY (Dashboard)
exports.getTaskSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const data = await Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getRecentTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};