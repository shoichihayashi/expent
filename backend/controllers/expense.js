const ExpenseSchema = require("../models/ExpenseModel");

exports.addExpense = async (req, res) => {
    const { title, amount, category, description, date } = req.body;
    const user = req.user;

    const expense = new ExpenseSchema({
        user: user._id,
        title,
        amount,
        category,
        description,
        date
    });

    try {
        // Validations
        if (!title || !category || !description || !date) {
            return res.status(400).json({ message: 'All fields are required!' });
        }
        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number!' });
        }
        await expense.save();
        res.status(200).json({ message: 'Expense Added' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getExpense = async (req, res) => {
    const user = req.user;
    try {
        const expenses = await ExpenseSchema.find({ user: user._id }).sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    try {
        await ExpenseSchema.findByIdAndDelete(id);
        res.status(200).json({ message: 'Expense Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
