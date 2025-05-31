// import getConnection from "../database/connection.sqlserver";

// export const getVersion = async (req, res) => {
//   try {
//     const pool = await getConnection();
//     const result = await pool.request().query('SELECT @@VERSION AS version');
//     res.json(result.recordset[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error al conectar con SQL Server');
//   }
// };