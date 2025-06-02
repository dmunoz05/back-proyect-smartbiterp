import getConnection from "../database/connection.sqlserver.js"
import { variablesDB } from "../utils/params/const.database.js";

// Seleccionar
export const getBudget = async (req, res) => {
    try {
        const conn = await getConnection();
        const db = variablesDB.name_db;
        const query = `
        SELECT p.PresupuestoID, tg.Nombre, p.Mes, p.Anio, p.Monto 
        FROM ${db}.Presupuesto p 
        INNER JOIN ${db}.TipoGasto tg
        ON p.TipoGastoID = tg.TipoGastoID
        `;
        const select = await conn.query(query);

        return res.json(select.recordset);
    } catch (error) {
        console.error('Error en getBudget:', error);

        return res.status(500).json({
            status: 500,
            message: 'Error obteniendo los datos',
            error: error.message
        });
    }
};

// Crear
export const insertBudget = async (req, res) => {
    try {
        const { UsuarioID, TipoGastoID, Mes, Anio, Monto } = req.body;
        const conn = await getConnection();
        const db = variablesDB.name_db;

        const query = `
      INSERT INTO ${db}.Presupuesto (UsuarioID, TipoGastoID, Mes, Anio, Monto)
      VALUES (@UsuarioID, @TipoGastoID, @Mes, @Anio, @Monto)`;

        await conn.request()
            .input('UsuarioID', UsuarioID)
            .input('TipoGastoID', TipoGastoID)
            .input('Mes', Mes)
            .input('Anio', Anio)
            .input('Monto', Monto)
            .query(query);

        return res.status(201).json({
            status: 201,
            message: 'Presupuesto creado correctamente'
        });
    } catch (error) {
        console.error('Error en createBudget:', error);
        return res.status(500).json({
            status: 500,
            message: 'Error al crear el Presupuesto',
            error: error.message
        });
    }
};

// Eliminar
export const deleteBudget = async (req, res) => {
    try {
        const { PresupuestoID } = req.params;
        const conn = await getConnection();
        const db = variablesDB.name_db;

        const query = `
      DELETE FROM ${db}.Presupuesto
      WHERE PresupuestoID = @PresupuestoID
    `;

        await conn.request()
            .input('PresupuestoID', PresupuestoID)
            .query(query);

        return res.status(200).json({
            status: 200,
            message: 'Presupuesto eliminado correctamente'
        });
    } catch (error) {
        console.error('Error en deleteBudget:', error);
        return res.status(500).json({
            status: 500,
            message: 'Error al eliminar el Presupuesto',
            error: error.message
        });
    }
};

