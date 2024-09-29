const { addExpense, getExpense, deleteExpense } = require('../controllers/expense');
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income');
const authenticateUser = require('../middlewares/authenticateUser');

const router = require('express').Router();


router.post('/add-income', authenticateUser, addIncome)
    .get('/get-incomes', authenticateUser, getIncomes)
    .delete('/delete-income/:id', authenticateUser, deleteIncome)
    .post('/add-expense', authenticateUser, addExpense)
    .get('/get-expenses', authenticateUser, getExpense)
    .delete('/delete-expense/:id', authenticateUser, deleteExpense)

module.exports = router