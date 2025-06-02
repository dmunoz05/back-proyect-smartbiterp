import getConnection from "../database/connection.sqlserver.js"
import { variablesDB } from "../utils/params/const.database.js";

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


export const getComparisonByDate = async (req, res) => {
    try {
        const conn = await getConnection();
        const db = variablesDB.name_db;
        const { startDate, endDate } = req.body;
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
        WHERE ge.Fecha BETWEEN '${startDate}' AND '${endDate}'
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

export const getTotalComparison = async (req, res) => {
    try {
        const conn = await getConnection();
        const db = variablesDB.name_db;
        const query = `
        SELECT
            (SELECT SUM(Monto) FROM ${db}.Presupuesto) AS Monto_Presupuesto,
            (SELECT SUM(Monto) FROM ${db}.Deposito) AS Monto_Deposito;
        `;
        const select = await conn.query(query);

        return res.status(200).json(select.recordset);
    } catch (error) {
        console.error('Error en getTotalComparisonByMonth:', error);

        return res.status(500).json({
            status: 500,
            message: 'Error obteniendo los datos',
            error: error.message
        });
    }
}