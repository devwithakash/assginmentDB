// controllers/taskController.js
const Task = require("../models/Task");

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
    const { status, priority, keyword, page = 1, limit = 5 } = req.query;

    const filter = { user: req.user.id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (keyword) filter.title = { $regex: keyword, $options: "i" };

    const tasks = await Task.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Task.countDocuments(filter);

    res.json({ tasks, total });
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
  const data = await Task.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  res.json(data);
};
