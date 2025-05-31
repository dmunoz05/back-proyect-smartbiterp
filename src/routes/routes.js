import express from 'express';

// Database
import { getConnect } from '../database/conection.controller.js';
// import { getVersion } from '../controllers/users.js';
import { ConexionVerify } from '../middlewares/connection.js';

const router = express();

export const routes = () => {
    // Database
    // router.get('/version', getVersion);
    router.get('/conect/', ConexionVerify, getConnect);
    return router;
}