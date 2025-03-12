import jwt from 'jsonwebtoken';
import { User, Role, Permission } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch user with permissions
    const user = await User.findByPk(decoded.id, {
      include: [
        {
          model: Role,
          attributes: ['id', 'name', 'description'],
          include: [{
            model: Permission,
            through: { attributes: [] },
            attributes: ['id', 'name', 'resource', 'action', 'description']
          }]
        },
        {
          model: Permission,
          through: { attributes: ['override'] },
          attributes: ['id', 'name', 'resource', 'action', 'description']
        }
      ]
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Combine role permissions and user-specific permissions
    const rolePermissions = user.Role?.Permissions || [];
    const userPermissions = user.Permissions || [];
    
    const permissionsMap = new Map();
    
    // Add role permissions first
    rolePermissions.forEach(permission => {
      permissionsMap.set(permission.id, {
        id: permission.id,
        name: permission.name,
        resource: permission.resource,
        action: permission.action,
        description: permission.description
      });
    });
    
    // Add or override with user-specific permissions
    userPermissions.forEach(permission => {
      if (permission.UserPermission?.override) {
        permissionsMap.set(permission.id, {
          id: permission.id,
          name: permission.name,
          resource: permission.resource,
          action: permission.action,
          description: permission.description
        });
      }
    });

    // Convert map values back to array
    const finalPermissions = Array.from(permissionsMap.values());

    // Add finalPermissions to user object
    const userJson = user.toJSON();
    userJson.finalPermissions = finalPermissions;
    req.user = userJson;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorizePermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      
      // Check if user has the required permission
      const hasPermission = user.finalPermissions.some(permission => 
        (permission.resource === resource && (permission.action === action || permission.action === 'manage')) ||
        (permission.resource === 'admin' && permission.action === 'manage')
      );

      if (!hasPermission) {
        console.log('Permission denied:', {
          user: user.username,
          required: { resource, action },
          userPermissions: user.finalPermissions
        });
        return res.status(403).json({ error: 'Permission denied' });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(403).json({ error: 'Permission denied' });
    }
  };
};