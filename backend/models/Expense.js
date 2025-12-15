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

    categoryOther: {
      type: String,
      // Only require this if category is set to 'Other'
      required: function() { return this.category === 'Other'; }
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Bank Transfer","Other"],
      required: true,
    },
    paymentMethodOther: {
        type: String,
         required: function() { return this.paymentMethod === 'Other'; }
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
