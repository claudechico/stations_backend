import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const Country = sequelize.define('Country', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(2),
    unique: true,
    allowNull: false
  }
}, {
  tableName: 'Countries',
  timestamps: true
});

export const Region = sequelize.define('Region', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  countryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Regions',
  timestamps: true
});

export const City = sequelize.define('City', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  regionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Cities',
  timestamps: true
});