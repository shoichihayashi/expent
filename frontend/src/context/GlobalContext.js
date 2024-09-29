import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext"; // Import the useAuth hook

const BASE_URL = "http://localhost:5000/api/v1/";
const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const { auth } = useAuth(); // Get the auth object
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    const config = auth && auth.token ? {
        headers: {
            Authorization: `Bearer ${auth.token}`
        }
    } : null;

    const addIncome = async (income) => {
        if(!config) {
            setError("No authentication token found 1");
            return;
        }
        try {
            await axios.post(`${BASE_URL}add-income`, income, config);
            getIncomes();
        } catch (err) {
            setError(err.response?.data?.message || "Error adding income");
        }
    };

    const getIncomes = async () => {
        if (!config) {
            setError("No authentication token found 2");
            return;
        }
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`, config);
            setIncomes(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Error fetching incomes");
        }
    };

    const deleteIncome = async (id) => {
        if (!config) {
            setError("No authentication token found 3");
            return;
        }
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`, config);
            getIncomes();
        } catch (err) {
            setError(err.response?.data?.message || "Error deleting income");
        }
    };

    const totalIncome = () => {
        let totalIncome = 0;
        incomes.forEach((income) => {
            totalIncome += income.amount;
        });
        return totalIncome;
    };

    const addExpense = async (expense) => {
        if (!config) {
            setError("No authentication token found 4");
            return;
        }
        try {
            await axios.post(`${BASE_URL}add-expense`, expense, config);
            getExpenses();
        } catch (err) {
            setError(err.response?.data?.message || "Error adding expense");
        }
    };

    const getExpenses = async () => {
        if (!config) {
            setError("No authentication token found 5");
            return;
        }
        try {
            const response = await axios.get(`${BASE_URL}get-expenses`, config);
            setExpenses(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Error fetching expenses");
        }
    };

    const deleteExpense = async (id) => {
        if (!config) {
            setError("No authentication token found 6");
            return;
        }
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`, config);
            getExpenses();
        } catch (err) {
            setError(err.response?.data?.message || "Error deleting expense");
        }
    };

    const totalExpense = () => {
        let totalExpense = 0;
        expenses.forEach((expense) => {
            totalExpense += expense.amount;
        });
        return totalExpense;
    };

    const totalBalance = () => {
        return totalIncome() - totalExpense();
    };

    const transactionHistory = () => {
        const reversedTransactions = transactions().history;
        reversedTransactions.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        return reversedTransactions.slice(0, 3);
    };

    const transactions = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });
        return { history };
    };

    const netWorthGraph = () => {
        const today = new Date();
        const transactionsArr = JSON.parse(JSON.stringify(transactions().history));
        const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const netWorthMap = {};
        if (transactionsArr.length > 0) {
            const firstRecordedTransaction = transactionsArr[0];
            const firstRecordedDate = new Date(firstRecordedTransaction.date);
            const timeDifference = currentDate.getTime() - firstRecordedDate.getTime();
            const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

            let arr = new Array(transactionsArr.length);
            for (let i = 0; i < transactionsArr.length; i++) {
                if (transactionsArr[i].type === 'expense') {
                    transactionsArr[i].amount = -transactionsArr[i].amount;
                }
                arr[i] = transactionsArr[i];
            }

            let netWorthCumulative = 0;
            for (let i = daysDifference; i >= 0; i--) {
                const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
                netWorthMap[date.toISOString()] = 0;
                for (let j = 0; j < arr.length; j++) {
                    const arrDate = new Date(arr[j].date);
                    if (date.toDateString() === arrDate.toDateString()) {
                        netWorthCumulative += arr[j].amount;
                    }
                }
                netWorthMap[date.toISOString()] = netWorthCumulative;
            }
        }
        return { netWorthMap };
    };

    useEffect(() => {
        if (auth && auth.token) {
            console.log('Auth in GlobalContext:', auth);
            getIncomes();
            getExpenses();
        } else {
            console.log('Auth is not defined or has no token:', auth);
        }
    }, [auth]);

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            deleteIncome,
            totalIncome,
            incomes,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpense,
            expenses,
            totalBalance,
            transactionHistory,
            transactions,
            error,
            netWorthGraph,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
