import { Client } from "pg";
import { ServiceError } from "./erros.js";

async function query(queryObject) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    const serviceError = new ServiceError({
      message: "Error connecting to the database or querying",
      cause: error,
    });
    throw serviceError;
  } finally {
    await client?.end();
  }
}

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    // eslint-disable-next-line no-unused-labels
    ca: process.env.POSTGRES_CA;
  }
  return process.env.NODE_ENV === "production" ? true : false;
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  await client.connect();
  return client;
}
const database = {
  query,
  getNewClient,
};
export default database;
