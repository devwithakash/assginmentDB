// controllers/expenseController.js
const Expense = require("../models/Expense");

// CREATE
exports.addExpense = async (req, res) => {
  const expense = await Expense.create({
    ...req.body,
    user: req.user.id,
  });
  res.json(expense);
};

// LIST
exports.getExpenses = async (req, res) => {
  const expenses = await Expense.find({ user: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(expenses);
};

// DETAIL
exports.getExpenseById = async (req, res) => {
  const expense = await Expense.findOne({
    _id: req.params.id,
    user: req.user.id,
  });
  res.json(expense);
};

// UPDATE
exports.updateExpense = async (req, res) => {
  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );
  res.json(expense);
};

// DELETE
exports.deleteExpense = async (req, res) => {
  await Expense.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });
  res.json({ msg: "Deleted" });
};

// SUMMARY
exports.getExpenseSummary = async (req, res) => {
  const data = await Expense.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: "$type", total: { $sum: "$amount" } } },
  ]);

  let income = 0,
    expense = 0;
  data.forEach((d) =>
    d._id === "income" ? (income = d.total) : (expense = d.total)
  );

  res.json({
    totalIncome: income,
    totalExpense: expense,
    netBalance: income - expense,
  });
};
