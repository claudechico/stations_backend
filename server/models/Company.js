import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Company = sequelize.define('Company', {
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
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  ogo: {
    type: DataTypes.STRING(1000),
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  countryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  directorId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'Companies',
  timestamps: true
});

export default Company;