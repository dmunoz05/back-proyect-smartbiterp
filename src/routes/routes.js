import express from 'express';

// Database
import { getConnect } from '../database/conection.controller.js';
// import { getVersion } from '../controllers/users.js';
import { ConexionVerify } from '../middlewares/connection.js';
import { getExpenseTypes, insertExpenseType, updateExpenseType, deleteExpenseType } from '../controllers/expense-types.controller.js';
import { getMonetaryFunds, insertMonetaryFunds, updateMonetaryFunds, deleteMonetaryFunds } from '../controllers/monetary-funds.controller.js';
// import { getBudget, insertBudget, updateBudget, deleteBudget } from '../controllers/budget.controller.js';
import { getBudget, insertBudget, deleteBudget } from '../controllers/budget.controller.js';

import { getDepositRecords, insertDepositRecords } from '../controllers/deposit-records.controller.js';

const router = express.Router();

export const routes = () => {
    // Database
    // router.get('/version', getVersion);
    router.get('/conect/', ConexionVerify, getConnect);

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

    // Deposit Records

    router.get('/g/deposit-records', getDepositRecords);
    router.post('/i/deposit-records', insertDepositRecords);

    return router;
}