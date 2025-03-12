import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';
import Permission from './permission.js';
import RolePermission from './RolePermission.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  phoneNumber: {
    type: DataTypes.STRING(255)
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Roles',
      key: 'id'
    }
  }
}, {
  tableName: 'Users',
  timestamps: true
});

// Method to validate password
User.prototype.validatePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Method to check if user has a specific permission
User.prototype.hasPermission = async function(permissionName) {
  const userPermissions = await this.getPermissions();
  const rolePermissions = await this.getRole().then(role => role.getPermissions());
  
  // Check for explicit user permission denials first
  const userDenied = userPermissions.find(p => 
    p.name === permissionName && p.UserPermission.override === false
  );
  if (userDenied) return false;

  // Check for explicit user permission grants
  const userGranted = userPermissions.find(p => 
    p.name === permissionName && p.UserPermission.override === true
  );
  if (userGranted) return true;

  // Fall back to role permissions
  return rolePermissions.some(p => p.name === permissionName);
};

export default User;