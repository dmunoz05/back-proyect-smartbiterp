import express from 'express';

// Database
import { getConnect } from '../database/conection.controller.js';
// import { getVersion } from '../controllers/users.js';
import { ConexionVerify } from '../middlewares/connection.js';
import { getMoneyTotal, getMoneyMonth, getExpenseMonth, getBudgetTotal, getRecentTransactions, getComparisonAll } from '../controllers/dashboard.controller.js';
import { getExpenseTypes, insertExpenseType, updateExpenseType, deleteExpenseType } from '../controllers/expense-types.controller.js';
import { getMonetaryFunds, insertMonetaryFunds, updateMonetaryFunds, deleteMonetaryFunds } from '../controllers/monetary-funds.controller.js';
import { getBudget, insertBudget, deleteBudget } from '../controllers/budget.controller.js';
import { getComparisonByDate, getTotalComparison } from '../controllers/comparison.controller.js';
import { sesionUser, validateToken } from '../controllers/users.js';
import { getExpenseRecords, insertExpenseRecords, deleteExpenseRecords, getExpenseRecordsDetails, insertExpenseRecordsDetails } from '../controllers/expense-records.controller.js';
import { getDepositRecords, insertDepositRecords, deleteDepositRecords } from '../controllers/deposit-records.controller.js';
import { getMovementReports } from '../controllers/movement-reports.controller.js';

const router = express.Router();

export const routes = () => {
    // Database
    router.get('/conect/', ConexionVerify, getConnect);

    // Dashboard

    router.get('/g/dashboard-money-total', getMoneyTotal);
    router.get('/g/dashboard-money-month', getMoneyMonth);
    router.get('/g/dashboard-expense-month', getExpenseMonth);
    router.get('/g/dashboard-budget-total', getBudgetTotal);
    router.get('/g/dashboard-recent-transactions', getRecentTransactions);
    router.get('/g/dashboard/comparison/all', getComparisonAll);

    // Expense Types
    router.get('/g/expense-types', getExpenseTypes);
    router.post('/i/expense-types', insertExpenseType);
    router.put('/u/expense-types/:TipoGastoID', updateExpenseType);
    router.delete('/d/expense-types/:TipoGastoID', deleteExpenseType);

    // Monetary Funds
    router.get('/g/monetary-funds', getMonetaryFunds);
    router.post('/i/monetary-funds', insertMonetaryFunds);
    router.put('/u/monetary-funds/:FondoID', updateMonetaryFunds);
    router.delete('/d/monetary-funds/:FondoID', deleteMonetaryFunds);

    // Budget
    router.get('/g/budget', getBudget);
    router.post('/i/budget', insertBudget);
    // router.put('/u/budget/:PresupuestoID', updateBudget);
    router.delete('/d/budget/:PresupuestoID', deleteBudget);

    // Expense Records

    router.get('/g/expense-records', getExpenseRecords);
    router.post('/i/expense-records', insertExpenseRecords);
    router.delete('/d/expense-records/:GastoID', deleteExpenseRecords);
    router.get('/g/expense-records-details', getExpenseRecordsDetails);
    router.post('/i/expense-records-details', insertExpenseRecordsDetails);

    // Deposit Records
    router.get('/g/deposit-records', getDepositRecords);
    router.post('/i/deposit-records', insertDepositRecords);
    router.delete('/d/deposit-records/:DepositoID', deleteDepositRecords);

    // Movement Reports

    router.get('/g/movement-reports', getMovementReports);

    // Comparison
    router.post('/g/comparison', getComparisonByDate);
    router.get('/g/total/comparison', getTotalComparison);

    // Users
    router.post('/auth/login', sesionUser);
    router.get('/auth/validate-token', validateToken);

    return router;
}