/* eslint-disable no-param-reassign */
/* eslint-disable no-console */

import './pgEnum-fix';
import { Sequelize, DataTypes } from 'sequelize';
import { Client } from 'pg';
import ApollosConfig from '@apollosproject/config';
import connectJest from './test-connect';
import { ensureLocalDb } from './local-db';

const sequelizeConfigOptions =
  process.env.NODE_ENV === 'test' ? { logging: false } : {};

const name = `${process.env.NODE_ENV || 'development'}`;

// Create a local database if it doesn't exist
// FIXME: Because the main thread here doesn't wait for this process to complete,
// the database doesn't exist on first run, and the sequelize instance below is undefined
// until you quit and restart.
if (!ApollosConfig?.DATABASE?.URL && process.env.NODE_ENV !== 'test') {
  const client = new Client({
    host: 'localhost',
    database: 'postgres',
  });

  console.log('creating db');
  (async () => {
    try {
      await client.connect();
    } catch (e) {
      console.error('Failed to connect to local postgres instance');
      console.error(e);
    }

    try {
      await ensureLocalDb(client, name);
    } catch (e) {
      console.error('Failed to ensure local database');
      console.error(e);
    }

    await client.end();
  })();
  console.log('created!');
}

const connectDev = () => {
  return new Sequelize(`postgres:localhost/${name}`, {
    ...(ApollosConfig?.DATABASE?.OPTIONS || {}),
    dialectOptions: {},
  });
};

const localConnect = () =>
  process.env.NODE_ENV === 'test' ? connectJest() : connectDev();

// Use the DB url from the apollos config if provided.
// Otherwise, connect to the proper test database
const sequelize = ApollosConfig?.DATABASE?.URL
  ? new Sequelize(ApollosConfig?.DATABASE?.URL, {
      ...sequelizeConfigOptions,
      ...(ApollosConfig?.DATABASE?.OPTIONS || {}),
    })
  : localConnect();

class PostgresDataSource {
  initialize(config) {
    this.context = config.context;
    this.sequelize = sequelize;
    this.model = sequelize.models[this.modelName];
  }

  getFromId(id, encodedId, { originType = null } = {}) {
    if (originType) {
      return this.model.findOne({
        where: { originId: String(id), originType },
      });
    }
    return this.model.findByPk(id);
  }
}

const UUID_V4_REGEXP = new RegExp(
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
);

export const assertUuid = (uuid, caller = '') => {
  if (uuid && !UUID_V4_REGEXP.test(uuid)) {
    throw new Error(
      `ID ${uuid} is not a valid UUID. You are probably passing a Rock (or other) id to ${caller} when it expects a Postgres UUID.`
    );
  }
};

// Define model is used to define the base attributes of a model
// as well as any pre/post hooks.
const defineModel = ({
  modelName,
  attributes,
  resolveType,
  sequelizeOptions = {},
  external = false,
}) => () => {
  if (attributes.originId || attributes.originType) {
    console.error(
      `originId and originType are reserved attribute names. Use 'external = true' or pick other attributes.`
    );
  }
  const model = sequelize.define(
    modelName,
    {
      ...attributes,
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      apollosId: {
        type: DataTypes.STRING,
        allowNull: true, // we set this value with an "afterCreate" hook if not set.
        unique: true,
      },
      apollosType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ...(external
        ? {
            originId: { type: DataTypes.STRING, allowNull: false },
            originType: { type: DataTypes.STRING, allowNull: false },
          }
        : {}),
    },
    {
      ...sequelizeOptions,
      hooks: {
        ...(sequelizeOptions?.hooks || {}),
        beforeValidate: (instance) => {
          if (resolveType && !instance.apollosType) {
            instance.apollosType = resolveType(instance);
          }
        },
        afterCreate: async (instance, options) => {
          if (!instance.apollosId) {
            instance.apollosId = `${instance.apollosType}:${instance.id}`;
            await instance.save({
              transaction: options.transaction,
            });
          }
        },
      },
      indexes: [
        { unique: true, fields: ['apollosId'] },
        ...(external
          ? [{ unique: true, fields: ['originId', 'originType'] }]
          : []),
        ...(sequelizeOptions?.indexes || []),
      ],
    }
  );

  return model;
};

/**
 * @callback ConfigureModelCallback
 * @param {Object} args
 * @param {import('sequelize').Sequelize} args.sequelize
 */

/**
 * Creates a function that returns a function that can be called with sequelize as an argument.
 * Used to configure relationships between models.
 *
 * @param {ConfigureModelCallback} callback
 */
const configureModel = (callback) => () => callback({ sequelize });

// Replaces DB migrations - alters the tables so they match the structure defined in code.
// Potentially harmful - will clober columns and tables that no longer exist - so use with caution.
const sync = async (options) => sequelize.sync({ ...options, alter: true });

export { defineModel, configureModel, sequelize, sync, PostgresDataSource };
