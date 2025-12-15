const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },

    category: {
      type: String,
      enum: ["Food", "Bills", "Travel", "Shopping", "Other"],
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Bank Transfer"],
      required: true,
    },

    date: { type: Date, required: true },
    description: String,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
