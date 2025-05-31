import sql from 'mssql';

let pool = null;

const getSQLConnection = async () => {
  if (pool) return pool;

  const config = {
    user: process.env.SQLSERVER_USER,
    password: process.env.SQLSERVER_PASSWORD,
    port: parseInt(process.env.SQLSERVER_PORT, 10),
    server: process.env.SQLSERVER_HOST,
    database: process.env.SQLSERVER_DATABASE,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  };
  console.log('');
  console.log('🔗 Conectando a SQL Server...');
  console.log('');
  try {
    pool = await sql.connect(config);
    console.log('✅ Conexión exitosa a SQL Server');
    console.log('');
    return pool;
  } catch (err) {
    console.error('❌ Error de conexión a SQL Server:', err);
    return null;
  }
};

export { sql, getSQLConnection };