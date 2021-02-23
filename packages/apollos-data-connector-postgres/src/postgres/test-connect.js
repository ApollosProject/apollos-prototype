import './pgEnum-fix';
import { Sequelize } from 'sequelize';
import ApollosConfig from '@apollosproject/config';

export const dbName = (id) => `${process.env.NODE_ENV || 'development'}_${id}`;

const connectJest = () => {
  const name = dbName(process.env.JEST_WORKER_ID);
  return new Sequelize(`postgres:localhost/${name}`, {
    logging: false,
    ...(ApollosConfig?.DATABASE?.OPTIONS || {}),
  });
};

export default connectJest;
