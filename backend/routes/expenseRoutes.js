// const router = require("express").Router();
// const mongoose = require("mongoose");
// const auth = require("../middleware/auth");
// const Expense = require("../models/Expense");
// console.log("✅ expenseRoutes loaded");

// /* ➕ CREATE EXPENSE */
// router.post("/", auth, async (req, res) => {
//   const expense = await Expense.create({
//     ...req.body,
//     user: req.user.id,
//   });
//   res.json(expense);
// });

// /* 📄 LIST EXPENSES (✅ REQUIRED FOR FRONTEND) */
// router.get("/", auth, async (req, res) => {
//   const { keyword = "" } = req.query;

//   const expenses = await Expense.find({
//     user: req.user.id,
//     $or: [
//       { title: { $regex: keyword, $options: "i" } },
//       { category: { $regex: keyword, $options: "i" } },
//     ],
//   }).sort({ createdAt: -1 });

//   res.json({ expenses });
// });

// /* 📊 TOTALS SUMMARY */
// router.get("/summary/totals", auth, async (req, res) => {
//   const userId = new mongoose.Types.ObjectId(req.user.id);

//   const data = await Expense.aggregate([
//     { $match: { user: userId } },
//     { $group: { _id: "$type", total: { $sum: "$amount" } } },
//   ]);

//   let income = 0, expense = 0;
//   data.forEach(d => {
//     if (d._id === "income") income = d.total;
//     if (d._id === "expense") expense = d.total;
//   });

//   res.json({
//     totalIncome: income,
//     totalExpense: expense,
//     netBalance: income - expense,
//   });
// });

// /* 📊 CATEGORY SUMMARY */
// router.get("/summary/category", auth, async (req, res) => {
//   const userId = new mongoose.Types.ObjectId(req.user.id);

//   const data = await Expense.aggregate([
//     { $match: { user: userId, type: "expense" } },
//     { $group: { _id: "$category", total: { $sum: "$amount" } } },
//   ]);

//   res.json(data);
// });

// /* 🕒 RECENT EXPENSES */
// router.get("/recent", auth, async (req, res) => {
//   const expenses = await Expense.find({ user: req.user.id })
//     .sort({ createdAt: -1 })
//     .limit(5);

//   res.json(expenses);
// });

// module.exports = router;


const router = require("express").Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Expense = require("../models/Expense");

/* ➕ CREATE EXPENSE */
router.post("/", auth, async (req, res) => {
  const expense = await Expense.create({
    ...req.body,
    user: req.user.id,
  });
  res.json(expense);
});

/* 📄 LIST EXPENSES (🔥 THIS WAS MISSING) */
router.get("/", auth, async (req, res) => {
  const { keyword = "" } = req.query;

  const expenses = await Expense.find({
    user: req.user.id,
    title: { $regex: keyword, $options: "i" },
  }).sort({ createdAt: -1 });

  res.json({ expenses });
});

/* ❌ DELETE EXPENSE */
router.delete("/:id", auth, async (req, res) => {
  await Expense.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });
  res.json({ message: "Expense deleted" });
});

/* 📊 TOTALS SUMMARY */
router.get("/summary/totals", auth, async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const data = await Expense.aggregate([
    { $match: { user: userId } },
    { $group: { _id: "$type", total: { $sum: "$amount" } } },
  ]);

  let income = 0, expense = 0;
  data.forEach(d => {
    if (d._id === "income") income = d.total;
    if (d._id === "expense") expense = d.total;
  });

  res.json({
    totalIncome: income,
    totalExpense: expense,
    netBalance: income - expense,
  });
});

/* 📊 CATEGORY SUMMARY */
router.get("/summary/category", auth, async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const data = await Expense.aggregate([
    { $match: { user: userId, type: "expense" } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
  ]);

  res.json(data);
});

/* 🕒 RECENT EXPENSES */
router.get("/recent", auth, async (req, res) => {
  const expenses = await Expense.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(5);

  res.json(expenses);
});

module.exports = router;
