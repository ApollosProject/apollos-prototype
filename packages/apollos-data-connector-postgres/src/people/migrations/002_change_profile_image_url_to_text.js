import { DataTypes } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.changeColumn('people', 'profileImageUrl', {
    type: DataTypes.TEXT,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.changeColumn('people', 'profileImageUrl', {
    type: DataTypes.STRING,
  });
}

const name = '003-change-profile-image-url-to-text';

module.exports = { up, down, name, order: 3 };
