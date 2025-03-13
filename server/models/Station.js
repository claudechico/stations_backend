import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Station = sequelize.define('Station', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Companies',
      key: 'id'
    }
  },
  managerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  tin: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false
  },
  domainUrl: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  street: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  cityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Cities',
      key: 'id'
    }
  }
}, {
  tableName: 'Stations',
  timestamps: true
});

export default Station;