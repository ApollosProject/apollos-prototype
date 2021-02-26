export {
  defineModel,
  configureModel,
  sequelize,
  sync,
  PostgresDataSource,
  isApollosId,
} from './postgres';

export * as Comment from './comments';
export * as UserFlag from './user-flags';
export * as Person from './people';
export * as Campus from './campus';
