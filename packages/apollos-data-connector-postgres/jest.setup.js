import { Client } from 'pg';
import { dbName } from './src/postgres/test-connect';

export default async ({ maxWorkers }) => {
  const client = new Client({
    host: 'localhost',
    database: 'postgres',
  });

  try {
    await client.connect();
  } catch (e) {
    console.error('Failed to connect to local postgres instance');
    console.error(e);
  }

  let count = 1;

  while (count <= maxWorkers) {
    const name = dbName(count);

    try {
      // eslint-disable-next-line no-await-in-loop
      await client.query(`DROP DATABASE IF EXISTS ${name};`);
    } catch (e) {
      console.error(`Failed to drop test database ${name}`);
      console.error(e);
    }

    try {
      // eslint-disable-next-line no-await-in-loop
      const create = await client.query(`CREATE DATABASE ${name};`);
      const dbTestClient = new Client({
        host: 'localhost',
        database: dbName(count),
      });
      await dbTestClient.connect();
      const uuid = await dbTestClient.query(
        `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
      );
      await dbTestClient.end();
    } catch (e) {
      console.error(`Failed to create test database ${name}`);
      console.error(e);
    }

    count += 1;
  }

  await client.end();
};
