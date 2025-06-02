import getConnection from "../database/connection.sqlserver.js"
import { variablesDB } from "../utils/params/const.database.js";


export const getMoneyTotal = async (req, res) => {
    try {
        const conn = await getConnection();
        const db = variablesDB.name_db;
        const query = `
        SELECT SUM(d.Monto) as TotalIngresos FROM ${db}.Deposito d 
        `;
        const select = await conn.query(query);

        return res.json(select.recordset);
    } catch (error) {
        console.error('Error en getMoneyTotal:', error);

        return res.status(500).json({
            status: 500,
            message: 'Error obteniendo los datos',
            error: error.message
        });
    }
};

// Dinero total por mes

export const getMoneyMonth = async (req, res) => {
    try {
        const conn = await getConnection();
        const db = variablesDB.name_db;
        const query = `
        SELECT SUM(d.Monto) AS TotalIngresosDelMes
        FROM ${db}.Deposito d
        WHERE YEAR(d.Fecha) = YEAR(GETDATE()) AND MONTH(d.Fecha) = MONTH(GETDATE());
        `;
        const select = await conn.query(query);

        return res.json(select.recordset);
    } catch (error) {
        console.error('Error en getMoneyMonth:', error);

        return res.status(500).json({
            status: 500,
            message: 'Error obteniendo los datos',
            error: error.message
        });
    }
};

// Dinero gastado por mes

export const getExpenseMonth = async (req, res) => {
    try {
        const conn = await getConnection();
        const db = variablesDB.name_db;
        const query = `
        SELECT SUM(gd.Monto) as TotalGastos FROM ${db}.GastoDetalle gd
        `;
        const select = await conn.query(query);

        return res.json(select.recordset);
    } catch (error) {
        console.error('Error en getExpenseMonth:', error);

        return res.status(500).json({
            status: 500,
            message: 'Error obteniendo los datos',
            error: error.message
        });
    }
};

// Dinero total presupuestado

export const getBudgetTotal = async (req, res) => {
    try {
        const conn = await getConnection();
        const db = variablesDB.name_db;
        const query = `
        SELECT SUM(p.Monto) AS TotalPresupuestado FROM ${db}.Presupuesto p
        `;
        const select = await conn.query(query);

        return res.json(select.recordset);
    } catch (error) {
        console.error('Error en getBudgetTotal:', error);

        return res.status(500).json({
            status: 500,
            message: 'Error obteniendo los datos',
            error: error.message
        });
    }
};

// Transacciones recientes 

export const getRecentTransactions = async (req, res) => {
    try {
        const conn = await getConnection();
        const db = variablesDB.name_db;
        const query = `
        SELECT TOP 3 *
        FROM (
        SELECT 
            FORMAT(d.Fecha, 'yyyy-MM-dd') AS Fecha,
            fm.Nombre AS NombreFondo,
            fm.Tipo AS TipoFondo,
            NULL AS NombreGasto,
            NULL AS Comercio,
            d.Monto,
            'Ingreso' AS TipoTransaccion
        FROM ${db}.Deposito d
        INNER JOIN ${db}.FondoMonetario fm ON d.FondoID = fm.FondoID
        UNION ALL
        SELECT 
            FORMAT(ge.Fecha, 'yyyy-MM-dd') AS Fecha,
            NULL AS NombreFondo,
            NULL AS TipoFondo,
            tg.Nombre AS NombreGasto,
            ge.Comercio,
            gd.Monto,
            'Gasto' AS TipoTransaccion
        FROM ${db}.GastoDetalle gd
        INNER JOIN ${db}.GastoEncabezado ge ON gd.GastoID = ge.GastoID
        INNER JOIN ${db}.TipoGasto tg ON gd.TipoGastoID = tg.TipoGastoID
        ) AS Movimientos
        ORDER BY Movimientos.Fecha DESC;
        `;
        const select = await conn.query(query);

        return res.json(select.recordset);
    } catch (error) {
        console.error('Error en getRecentTransactions:', error);

        return res.status(500).json({
            status: 500,
            message: 'Error obteniendo los datos',
            error: error.message
        });
    }
};


