import getConnection from "../database/connection.sqlserver.js"
import { variablesDB } from "../utils/params/const.database.js";

// Seleccionar
export const getMonetaryFunds = async (req, res) => {
    try {
        const conn = await getConnection();
        const db = variablesDB.name_db;
        const query = `SELECT * FROM ${db}.FondoMonetario`;
        const select = await conn.query(query);

        return res.json(select.recordset);
    } catch (error) {
        console.error('Error en getMonetaryFunds:', error);

        return res.status(500).json({
            status: 500,
            message: 'Error obteniendo los datos',
            error: error.message
        });
    }
};

// Crear
export const insertMonetaryFunds = async (req, res) => {
    try {
        const { Nombre, Descripcion, Tipo } = req.body;
        const conn = await getConnection();
        const db = variablesDB.name_db;

        const query = `
      INSERT INTO ${db}.FondoMonetario (Nombre, Descripcion, Tipo)
      VALUES (@Nombre, @Descripcion, @Tipo)
    `;

        await conn.request()
            .input('Nombre', Nombre)
            .input('Descripcion', Descripcion)
            .input('Tipo', Tipo)
            .query(query);

        return res.status(201).json({
            status: 201,
            message: 'Fondo monetario creado correctamente'
        });
    } catch (error) {
        console.error('Error en createMonetaryFunds:', error);
        return res.status(500).json({
            status: 500,
            message: 'Error al crear el Fondo monetario',
            error: error.message
        });
    }
};



// Actualizar
export const updateMonetaryFunds = async (req, res) => {
    try {
        const { FondoID } = req.params;
        const { Nombre, Descripcion, Tipo } = req.body;
        const conn = await getConnection();
        const db = variablesDB.name_db;

        const query = `
      UPDATE ${db}.FondoMonetario
      SET Nombre = @Nombre, Descripcion = @Descripcion, Tipo = @Tipo
      WHERE FondoID = @FondoID
    `;

        await conn.request()
            .input('Nombre', Nombre)
            .input('Descripcion', Descripcion)
            .input('Tipo', Tipo)
            .input('FondoID', FondoID)
            .query(query);

        return res.status(200).json({
            status: 200,
            message: 'Fondo monetario actualizado correctamente'
        });
    } catch (error) {
        console.error('Error en updateMonetaryFunds:', error);
        return res.status(500).json({
            status: 500,
            message: 'Error al actualizar el Fondo monetario',
            error: error.message
        });
    }
};


// Eliminar
export const deleteMonetaryFunds = async (req, res) => {
    try {
        const { FondoID } = req.params;
        const conn = await getConnection();
        const db = variablesDB.name_db;

        const query = `
      DELETE FROM ${db}.FondoMonetario
      WHERE FondoID = @FondoID
    `;

        await conn.request()
            .input('FondoID', FondoID)
            .query(query);

        return res.status(200).json({
            status: 200,
            message: 'Fondo monetario eliminado correctamente'
        });
    } catch (error) {
        console.error('Error en deleteMonetaryFunds:', error);
        return res.status(500).json({
            status: 500,
            message: 'Error al eliminar el Fondo monetario',
            error: error.message
        });
    }
};

