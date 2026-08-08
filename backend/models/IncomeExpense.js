const mongoose = require('mongoose');

const incomeExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
  },
  cost: {
    type: Number,
    required: [true, 'Please add a cost or income amount'],
  },
  addedOn: {
    type: Date,
    default: Date.now,
  },
  isIncome: {
    type: Boolean,
    required: true,
    default: false, // false for expense, true for income
  },
  note: {
    type: String,
    default: ''
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true,
});

// Helpful indexes for common filters and aggregations
// Queries often filter by user, isIncome, isDeleted, date, and group by category
incomeExpenseSchema.index({ user: 1, isDeleted: 1, isIncome: 1, addedOn: -1 });
incomeExpenseSchema.index({ user: 1, isDeleted: 1, category: 1 });
incomeExpenseSchema.index({ user: 1, isDeleted: 1, addedOn: -1 });

module.exports = mongoose.model('IncomeExpense', incomeExpenseSchema);