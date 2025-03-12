import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  resource: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'The resource this permission applies to (e.g., "users", "companies")'
  },
  action: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'The action allowed (e.g., "create", "read", "update", "delete")'
  }
}, {
  tableName: 'Permissions',
  timestamps: true
});

export default Permission;