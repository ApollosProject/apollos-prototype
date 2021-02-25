import { Client } from 'pg';
import { dbName } from './src/postgres/test-connect';

export default async ({ maxWorkers }) => {
  let count = 1;

  const client = new Client({
    host: 'localhost',
    database: 'postgres',
  });

  await client.connect();

  while (count <= maxWorkers) {
    // eslint-disable-next-line no-await-in-loop
    await client.query(
      `DROP DATABASE IF EXISTS ${dbName(count)} WITH (FORCE);`
    );

    count += 1;
  }
  await client.end();

  return true;
};
