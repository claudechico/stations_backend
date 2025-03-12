import User from './User.js';
import Company from './Company.js';
import Station from './Station.js';
import Permission from './permission.js';
import UserPermission from './userPermission.js';
import Role from './Role.js';
import RolePermission from './RolePermission.js';
import { Country, Region, City } from './Location.js';

// Location relationships
Country.hasMany(Region, { 
  foreignKey: 'countryId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Region.belongsTo(Country, { foreignKey: 'countryId' });

Region.hasMany(City, { 
  foreignKey: 'regionId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
City.belongsTo(Region, { foreignKey: 'regionId' });

// Company relationships
Company.belongsTo(User, { 
  as: 'director',
  foreignKey: 'directorId',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
Company.belongsTo(Country, { 
  foreignKey: 'countryId',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

// Station relationships
Station.belongsTo(Company, { 
  foreignKey: 'companyId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Station.belongsTo(User, { 
  as: 'manager',
  foreignKey: 'managerId',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
Station.belongsTo(City, { 
  foreignKey: 'cityId',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

// Role relationships
User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

// Permission relationships
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'roleId',
  otherKey: 'permissionId'
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permissionId',
  otherKey: 'roleId'
});

User.belongsToMany(Permission, { 
  through: UserPermission,
  foreignKey: 'userId',
  otherKey: 'permissionId'
});
Permission.belongsToMany(User, { 
  through: UserPermission,
  foreignKey: 'permissionId',
  otherKey: 'userId'
});

export {
  User,
  Company,
  Station,
  Country,
  Region,
  City,
  Permission,
  UserPermission,
  Role,
  RolePermission
};