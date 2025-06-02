import getConnection from "../database/connection.sqlserver.js"
import { variablesDB } from "../utils/params/const.database.js";

// Seleccionar
export const getExpenseRecords = async (req, res) => {
    try {
        const conn = await getConnection();
        const db = variablesDB.name_db;
        const query = `SELECT * FROM ${db}.GastoEncabezado`;
        const select = await conn.query(query);

        return res.json(select.recordset);
    } catch (error) {
        console.error('Error en getExpenseRecords:', error);

        return res.status(500).json({
            status: 500,
            message: 'Error obteniendo los datos',
            error: error.message
        });
    }
};

// Crear
export const insertExpenseRecords = async (req, res) => {
    try {
        const { Fecha, FondoID, Observaciones, Comercio, TipoDocumento, UsuarioID } = req.body;
        const conn = await getConnection();
        const db = variablesDB.name_db;

        const query = `
        INSERT INTO ${db}.GastoEncabezado
        (Fecha, FondoID, Observaciones, Comercio, TipoDocumento, UsuarioID)
        VALUES(@Fecha, @FondoID, @Observaciones, @Comercio, @TipoDocumento, @UsuarioID);`;

        const result = await conn.request()
            .input('Fecha', Fecha)
            .input('FondoID', FondoID)
            .input('Observaciones', Observaciones)
            .input('Comercio', Comercio)
            .input('TipoDocumento', TipoDocumento)
            .input('UsuarioID', UsuarioID)
            .query(query + " SELECT SCOPE_IDENTITY() AS gastoID;");

        return res.status(201).json({
            status: 201,
            message: 'Registro de gastos creado correctamente',
            gastoID: result.recordset[0].gastoID
        });
    } catch (error) {
        console.error('Error en createExpenseRecords:', error);
        return res.status(500).json({
            status: 500,
            message: 'Error al crear el Registro de gastos',
            error: error.message
        });
    }
};

// Eliminar
export const deleteExpenseRecords = async (req, res) => {
    try {
        const { GastoID } = req.params;
        const conn = await getConnection();
        const db = variablesDB.name_db;

        const query = `
        DELETE FROM ${db}.GastoEncabezado
        WHERE GastoID = @GastoID;`;

        await conn.request()
            .input('GastoID', GastoID)
            .query(query);

        return res.status(200).json({
            status: 200,
            message: 'Registro de gastos eliminado correctamente'
        });
    } catch (error) {
        console.error('Error en deleteExpenseRecords:', error);
        return res.status(500).json({
            status: 500,
            message: 'Error al eliminar el Registro de gastos',
            error: error.message
        });
    }
};

// Seleccionar detalles
export const getExpenseRecordsDetails = async (req, res) => {
    try {
        const conn = await getConnection();
        const db = variablesDB.name_db;
        const query = `SELECT * FROM ${db}.GastoDetalle`;
        const select = await conn.query(query);

        return res.json(select.recordset);
    } catch (error) {
        console.error('Error en getExpenseRecordsDetails:', error);

        return res.status(500).json({
            status: 500,
            message: 'Error obteniendo los datos',
            error: error.message
        });
    }
};

// Crear detalles
export const insertExpenseRecordsDetails = async (req, res) => {
    try {
        const { GastoID, TipoGastoID, Monto } = req.body;
        const conn = await getConnection();
        const db = variablesDB.name_db;

        const query = `
        INSERT INTO ${db}.GastoDetalle
        (GastoID, TipoGastoID, Monto)
        VALUES(@GastoID, @TipoGastoID, @Monto);`;

        await conn.request()
            .input('GastoID', GastoID)
            .input('TipoGastoID', TipoGastoID)
            .input('Monto', Monto)
            .query(query);

        return res.status(201).json({
            status: 201,
            message: 'Detalles de registro de gastos creado correctamente'
        });
    } catch (error) {
        console.error('Error en createExpenseRecordsDetails:', error);
        return res.status(500).json({
            status: 500,
            message: 'Error al crear el Detalles de registro de gastos',
            error: error.message
        });
    }
};

