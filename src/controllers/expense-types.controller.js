import getConnection from "../database/connection.sqlserver.js"
import { variablesDB } from "../utils/params/const.database.js";

// Seleccionar
export const getExpenseTypes = async (req, res) => {
  try {
    const conn = await getConnection();
    const db = variablesDB.name_db;
    const query = `SELECT * FROM ${db}.TipoGasto`;
    const select = await conn.query(query);

    return res.json(select.recordset);
  } catch (error) {
    console.error('Error en getDataExpenseTypes:', error);

    return res.status(500).json({
      status: 500,
      message: 'Error obteniendo los datos',
      error: error.message
    });
  }
};

// Crear
export const insertExpenseType = async (req, res) => {
  try {
    const { Nombre, Descripcion } = req.body;
    const conn = await getConnection();
    const db = variablesDB.name_db;

    const query = `
      INSERT INTO ${db}.TipoGasto (Nombre, Descripcion)
      VALUES (@Nombre, @Descripcion)
    `;

    await conn.request()
      .input('Nombre', Nombre)
      .input('Descripcion', Descripcion)
      .query(query);

    return res.status(201).json({
      status: 201,
      message: 'Tipo de gasto creado correctamente'
    });
  } catch (error) {
    console.error('Error en createExpenseType:', error);
    return res.status(500).json({
      status: 500,
      message: 'Error al crear el tipo de gasto',
      error: error.message
    });
  }
};



// Actualizar
export const updateExpenseType = async (req, res) => {
  try {
    const { TipoGastoID } = req.params;
    const { Nombre, Descripcion } = req.body;
    const conn = await getConnection();
    const db = variablesDB.name_db;

    const query = `
      UPDATE ${db}.TipoGasto
      SET Nombre = @Nombre, Descripcion = @Descripcion
      WHERE TipoGastoID = @TipoGastoID
    `;

    await conn.request()
      .input('Nombre', Nombre)
      .input('Descripcion', Descripcion)
      .input('TipoGastoID', TipoGastoID)
      .query(query);

    return res.status(200).json({
      status: 200,
      message: 'Tipo de gasto actualizado correctamente'
    });
  } catch (error) {
    console.error('Error en updateExpenseType:', error);
    return res.status(500).json({
      status: 500,
      message: 'Error al actualizar el tipo de gasto',
      error: error.message
    });
  }
};


// Eliminar
export const deleteExpenseType = async (req, res) => {
  try {
    const { TipoGastoID } = req.params;
    const conn = await getConnection();
    const db = variablesDB.name_db;

    const query = `
      DELETE FROM ${db}.TipoGasto
      WHERE TipoGastoID = @TipoGastoID
    `;

    await conn.request()
      .input('TipoGastoID', TipoGastoID)
      .query(query);

    return res.status(200).json({
      status: 200,
      message: 'Tipo de gasto eliminado correctamente'
    });
  } catch (error) {
    console.error('Error en deleteExpenseType:', error);
    return res.status(500).json({
      status: 500,
      message: 'Error al eliminar el tipo de gasto',
      error: error.message
    });
  }
};

