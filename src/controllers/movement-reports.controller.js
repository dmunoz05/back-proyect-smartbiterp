import getConnection from "../database/connection.sqlserver.js"
import { variablesDB } from "../utils/params/const.database.js";
import sql from 'mssql';

// Seleccionar

export const getMovementReports = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        const conn = await getConnection();
        const db = variablesDB.name_db;

        let depositCondition = "";
        let expenseCondition = "";

        if (startDate && endDate) {
            depositCondition = "WHERE d.Fecha BETWEEN @startDate AND @endDate";
            expenseCondition = "WHERE ge.Fecha BETWEEN @startDate AND @endDate";
        }

        const query = `
        SELECT 
            CAST(d.DepositoID AS varchar) AS id,
            FORMAT(d.Fecha, 'yyyy-MM-dd') AS date,
            'deposit' AS type,
            'Salary Deposit' AS description,
            fm.Nombre AS monetaryFund,
            d.Monto AS amount,
            NULL AS expenseType
        FROM ${db}.Deposito d
        INNER JOIN ${db}.FondoMonetario fm ON d.FondoID = fm.FondoID
        ${depositCondition}
        UNION ALL
        SELECT 
            CAST(gd.DetalleID AS varchar) AS id,
            FORMAT(ge.Fecha, 'yyyy-MM-dd') AS date,
            'expense' AS type,
            ge.Comercio AS description,
            fm.Nombre AS monetaryFund,
            gd.Monto AS amount,
            tg.Nombre AS expenseType
        FROM ${db}.GastoDetalle gd
        INNER JOIN ${db}.GastoEncabezado ge ON gd.GastoID = ge.GastoID
        INNER JOIN ${db}.FondoMonetario fm ON ge.FondoID = fm.FondoID
        INNER JOIN ${db}.TipoGasto tg ON gd.TipoGastoID = tg.TipoGastoID
        ${expenseCondition}
        `;

        const request = conn.request();

        if (startDate && endDate) {
            request.input("startDate", sql.Date, startDate);
            request.input("endDate", sql.Date, endDate);
        }

        const result = await request.query(query);
        return res.json(result.recordset);
    } catch (error) {
        console.error('Error en getMovementReports:', error);
        return res.status(500).json({
            status: 500,
            message: 'Error al crear el tipo de gasto',
            error: error.message
        });
    }
};
