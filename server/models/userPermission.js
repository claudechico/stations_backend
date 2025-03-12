import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserPermission = sequelize.define('UserPermission', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  permissionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  // Override role permission (true = grant, false = deny)
  override: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'If true, grants the permission. If false, explicitly denies it.'
  }
}, {
  tableName: 'UserPermissions',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'permissionId']
    }
  ]
});

export default UserPermission;