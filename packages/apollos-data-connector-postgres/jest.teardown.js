import { Client } from 'pg';
import { dbName } from './test-connect';

const JEST_WORKER_COUNT = 2;

export default async () => {
  let count = 1;

  const client = new Client({
    host: 'localhost',
    database: 'postgres',
  });

  await client.connect();

  while (count <= JEST_WORKER_COUNT) {
    // eslint-disable-next-line no-await-in-loop
    await client.query(
      `DROP DATABASE IF EXISTS ${dbName(count)} WITH (FORCE);`
    );

    count += 1;
  }
  await client.end();

  return true;
};
