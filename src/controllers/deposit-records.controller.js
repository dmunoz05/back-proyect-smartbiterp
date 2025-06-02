import getConnection from "../database/connection.sqlserver.js"
import { variablesDB } from "../utils/params/const.database.js";

// Seleccionar
export const getDepositRecords = async (req, res) => {
    try {
        const conn = await getConnection();
        const db = variablesDB.name_db;
        const query = `
        SELECT d.DepositoID, FORMAT(d.Fecha, 'yyyy-MM-dd') AS Fecha, fm.Nombre, d.Monto
        FROM ${db}.Deposito d 
        INNER JOIN ${db}.FondoMonetario fm 
        ON d.FondoID = fm.FondoID;
        `;
        const select = await conn.query(query);

        return res.json(select.recordset);
    } catch (error) {
        console.error('Error en getDepositRecords:', error);

        return res.status(500).json({
            status: 500,
            message: 'Error obteniendo los datos',
            error: error.message
        });
    }
};

// Crear
export const insertDepositRecords = async (req, res) => {
    try {
        const { Fecha, FondoID, Monto, UsuarioID } = req.body;
        const conn = await getConnection();
        const db = variablesDB.name_db;

        const query = `
        INSERT INTO ${db}.Deposito
        (Fecha, FondoID, Monto, UsuarioID)
        VALUES (@Fecha, @FondoID, @Monto, @UsuarioID);
        `;

        await conn.request()
            .input('Fecha', Fecha)
            .input('FondoID', FondoID)
            .input('Monto', Monto)
            .input('UsuarioID', UsuarioID)
            .query(query);

        return res.status(201).json({
            status: 201,
            message: 'Presupuesto creado correctamente'
        });
    } catch (error) {
        console.error('Error en createDepositRecords:', error);
        return res.status(500).json({
            status: 500,
            message: 'Error al crear el Presupuesto',
            error: error.message
        });
    }
};

// Eliminar
export const deleteDepositRecords = async (req, res) => {
    try {
        const { DepositoID } = req.params;
        const conn = await getConnection();
        const db = variablesDB.name_db;

        const query = `
        DELETE FROM ${db}.Deposito
        WHERE DepositoID = @DepositoID;
        `;

        await conn.request()
            .input('DepositoID', DepositoID)
            .query(query);

        return res.status(200).json({
            status: 200,
            message: 'Presupuesto eliminado correctamente'
        });
    } catch (error) {
        console.error('Error en deleteDepositRecords:', error);
        return res.status(500).json({
            status: 500,
            message: 'Error al eliminar el Presupuesto',
            error: error.message
        });
    }
};