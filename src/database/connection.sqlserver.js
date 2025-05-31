import { getSQLConnection } from '../config/database.js';

let pool = null;

const getConnection = async () => {
  try {
    if (pool) return pool;

    pool = await getSQLConnection();
    if (!pool) {
      console.error("❌ No se pudo establecer la conexión con SQL Server.");
      return false;
    }

    await pool.request().query('SELECT 1');

    return pool;
  } catch (error) {
    console.error("\n*****************************");
    console.error("Error conectando la base de datos");
    console.error("*****************************\n");
    console.error(error);
    pool = null;
    return false;
  }
};

export default getConnection;
