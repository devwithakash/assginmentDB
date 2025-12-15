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
  try {
    const { 
      page = 1, 
      limit = 10, 
      keyword, 
      category, 
      type, 
      paymentMethod, 
      startDate, 
      endDate, 
      minAmount,     
      maxAmount      
    } = req.query;

    const skip = (page - 1) * limit;
    const filter = { user: req.user.id };

    // 1. Keyword Search (Title or Description)
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // 2. Exact Filters
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    // 3. Date Range
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate); // Fixed typo $jhte -> $gte
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // 4. Amount Range
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }

    const expenses = await Expense.find(filter)
      .sort({ date: -1 }) // Sort by newest first
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

exports.getCategorySummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const data = await Expense.aggregate([
      { $match: { user: userId, type: "expense" } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.getRecentExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};