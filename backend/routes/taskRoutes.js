const router = require("express").Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Task = require("../models/Task");

/* ➕ CREATE TASK */
router.post("/", auth, async (req, res) => {
  const task = await Task.create({
    ...req.body,
    user: req.user.id,
  });
  res.json(task);
});

/* 📄 LIST TASKS (🔥 THIS WAS MISSING) */
router.get("/", auth, async (req, res) => {
  const { keyword = "" } = req.query;

  const tasks = await Task.find({
    user: req.user.id,
    title: { $regex: keyword, $options: "i" },
  }).sort({ createdAt: -1 });

  res.json({ tasks });
});

/* ❌ DELETE TASK */
router.delete("/:id", auth, async (req, res) => {
  await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });
  res.json({ message: "Task deleted" });
});

/* 📊 STATUS SUMMARY */
router.get("/summary/status", auth, async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const data = await Task.aggregate([
    { $match: { user: userId } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  res.json(data);
});

/* 🕒 RECENT TASKS */
router.get("/recent", auth, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(5);

  res.json(tasks);
});

module.exports = router;
