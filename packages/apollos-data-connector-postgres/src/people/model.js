import { DataTypes } from 'sequelize';
import { defineModel } from '../postgres';

const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  UNKNOWN: 'UNKNOWN',
};

const createModel = defineModel({
  modelName: 'people',
  resolveType: () => 'Person',
  external: true,
  attributes: {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    birthDate: DataTypes.DATE,
    profileImageUrl: DataTypes.STRING,
    gender: DataTypes.ENUM(Object.values(Gender)),
  },
});

export { createModel };
