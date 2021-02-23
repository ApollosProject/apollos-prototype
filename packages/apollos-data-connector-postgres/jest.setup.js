import { Client } from 'pg';
import { dbName } from './test-connect';

const JEST_WORKER_COUNT = 2;

export default async () => {
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

  while (count <= JEST_WORKER_COUNT) {
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
      await client.query(`CREATE DATABASE ${name};`);
    } catch (e) {
      console.error(`Failed to create test database ${name}`);
      console.error(e);
    }

    count += 1;
  }

  await client.end();
};
