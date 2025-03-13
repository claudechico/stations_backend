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
  logo: {
    type: DataTypes.BLOB,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('logo');
      return rawValue ? Buffer.from(rawValue) : null;
    },
    set(value) {
      if (value) {
        this.setDataValue('logo', Buffer.from(value));
      }
    }
  },
  logoType: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  countryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Countries',
      key: 'id'
    }
  },
  directorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  tableName: 'Companies',
  timestamps: true
});

export default Company;