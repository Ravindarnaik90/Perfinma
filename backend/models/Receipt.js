const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  fileUrl: {
    type: String,
    required: true,
  },
  extractedData: {
    amount: Number,
    category: String,
    date: Date,
    merchant: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Receipt', receiptSchema);