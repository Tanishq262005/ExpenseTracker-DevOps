const mongoose = require('mongoose');
const { Schema } = mongoose;

const expenseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
    category: {
        type: String,
        required: true,
        enum: [
            'Food',
            'Transport',
            'Entertainment',
            'Utilities',
            'Health',
            'Other'
        ],
    },
  notes: {
    type: String,
  },
});

// The expenseSchema defines the structure of the expense documents in the MongoDB database.

const Expense = mongoose.model('Expense', expenseSchema);
// The Expense model is created from the expenseSchema and is used to interact with the expenses collection in the database.

module.exports = Expense;
// This code defines a Mongoose schema for an expense model in a Node.js application.