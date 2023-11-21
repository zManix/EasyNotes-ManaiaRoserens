import { createConnection } from 'mysql2/promise';

/**
 * connect to the Database
 *
 * @param string dbHost
 * @param string dbPort
 * @param string dbName
 * @param string dbUser
 * @param string dbPassword
 *
 * @return Connection connection
 *
 * @version 1.0.0
 */
async function connectDB(dbHost: string, dbPort: string, dbName: string, dbUser: string, dbPassword: string) {
  const connection = await createConnection({
    host: dbHost,
    port: Number(dbPort),
    database: dbName,
    user: dbUser,
    password: dbPassword,
    connectTimeout: 30000, // 30 Sekunden
  });

  return connection;
}

/**
 * Queries the Database
 *
 * @param string sql
 * @param string params
 *
 *
 * @version 1.0.0
 */
async function queryDB(sql: string, params: any) {
  const dbConfig = getDBConfig();

  const connection = await connectDB(dbConfig.host, dbConfig.port, dbConfig.name, dbConfig.user, dbConfig.password);

  try {
    const [rows, fields] = await connection.execute(sql, params);
    connection.end();
    return { rows: rows, fields: fields };
  } catch (err) {
    connection.end();
    return { err: err };
  }
}

/**
 * Get DB Config
 *
 * return object dbConfig
 * @version 1.0.0
 */
function getDBConfig() {
  const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || '3306',
    name: process.env.DB_NAME || 'easynotes',
    user: process.env.DB_USER || 'easynotes',
    password: process.env.DB_PASS || 'easynotes',
  };

  return dbConfig;
}

export const db = { connectDB, queryDB, getDBConfig };
