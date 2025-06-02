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

export const getComparisonAll = async (req, res) => {
    try {
        const conn = await getConnection();
        const db = variablesDB.name_db;
        const query = `
        SELECT
            tg.Nombre AS TipoGasto,
            ISNULL(SUM(p.Monto), 0) AS Presupuesto,
            ISNULL(SUM(gd.Monto), 0) AS GastoActual,
            (ISNULL(SUM(p.Monto), 0) - ISNULL(SUM(gd.Monto), 0)) AS Diferencia,
            CASE
                WHEN ISNULL(SUM(p.Monto), 0) = 0 AND ISNULL(SUM(gd.Monto), 0) > 0 THEN -100.0
                WHEN ISNULL(SUM(p.Monto), 0) = 0 THEN 0
                ELSE ROUND(((ISNULL(SUM(p.Monto), 0) - ISNULL(SUM(gd.Monto), 0)) * 100.0) / ISNULL(SUM(p.Monto), 0), 1)
            END AS Porcentaje
        FROM ${db}.TipoGasto tg
        LEFT JOIN ${db}.Presupuesto p ON p.TipoGastoID = tg.TipoGastoID
        LEFT JOIN ${db}.GastoDetalle gd ON gd.TipoGastoID = tg.TipoGastoID
        LEFT JOIN ${db}.GastoEncabezado ge ON ge.GastoID = gd.GastoID
            GROUP BY tg.Nombre
            ORDER BY tg.Nombre;
        `;
        const select = await conn.query(query);

        return res.status(200).json(select.recordset);
    } catch (error) {
        console.error('Error en getComparison:', error);

        return res.status(500).json({
            status: 500,
            message: 'Error obteniendo los datos',
            error: error.message
        });
    }
}
