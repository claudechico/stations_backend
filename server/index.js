import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import * as models from './models/index.js';
import userRoutes from './routes/users.js';
import companyRoutes from './routes/companies.js';
import stationRoutes from './routes/stations.js';
import locationRoutes from './routes/locations.js';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/auth.js';
import { defaultPermissions, defaultPermissionDefinitions } from './models/defaultPermissions.js';
import roleRoutes from './routes/roles.js';
import permissionRoutes from './routes/permissions.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/stations', stationRoutes);
app.use('/location/location', locationRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);

// Initialize database and default data
async function initializeDatabase() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Sync database without dropping existing tables (data persists)
    await sequelize.sync();
    console.log('Database synced successfully');

    // Create default roles, permissions, and associations if they don't exist
    const roles = await models.Role.findAll();
    if (roles.length === 0) {
      console.log('Creating default roles...');
      const roles = await models.Role.bulkCreate([
        { name: 'admin', description: 'System Administrator with full access' },
        { name: 'director', description: 'Company Director with company-level access' },
        { name: 'manager', description: 'Station Manager with station-level access' }
      ], { returning: true });

      console.log('Creating default permissions...');
      const createdPermissions = await models.Permission.bulkCreate(
        defaultPermissionDefinitions,
        { 
          returning: true,
          ignoreDuplicates: true
        }
      );

      console.log('Assigning permissions to roles...');
      for (const [roleName, permissions] of Object.entries(defaultPermissions)) {
        const role = roles.find(r => r.name === roleName);
        if (!role) continue;

        const rolePermissions = permissions.map(permission => {
          const permissionRecord = createdPermissions.find(
            p => p.resource === permission.resource && p.action === permission.action
          );
          return {
            roleId: role.id,
            permissionId: permissionRecord.id
          };
        }).filter(rp => rp.permissionId); // Filter out any undefined permissions

        await models.RolePermission.bulkCreate(rolePermissions, {
          ignoreDuplicates: true
        });
      }

      // Check if admin user exists and create if not
      const adminRole = roles.find(role => role.name === 'admin');
      const adminExists = await models.User.findOne({
        where: { username: 'admin' }
      });

      if (!adminExists && adminRole) {
        console.log('Creating default admin user...');
        const hashedPassword = await bcrypt.hash('12345678', 10);
        const adminUser = await models.User.create({
          email: 'admin@example.com',
          username: 'admin',
          roleId: adminRole.id,
          phoneNumber: '+1234567890',
          password: hashedPassword
        });

        const userPermissions = createdPermissions.map(permission => ({
          userId: adminUser.id,
          permissionId: permission.id,
          override: true // Explicitly grant all permissions
        }));

        await models.UserPermission.bulkCreate(userPermissions, {
          ignoreDuplicates: true
        });

        console.log('Default admin user created successfully with all permissions');
      } else {
        console.log('Admin user already exists, skipping creation');
      }
    } else {
      console.log('Default roles already exist, skipping creation of default data');
    }

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Initialize database and start server
initializeDatabase()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  });

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;
