import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import Role from '../models/Role.js';
import Permission from '../models/permission.js';
import UserPermission from '../models/userPermission.js';
import { Op } from 'sequelize';
import Company from '../models/Company.js';


export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, role });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const login = async (req, res) => {
  try {
    console.log("Incoming request:", req.body);

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Fetch user with role, permissions, and associated companies
    const user = await User.findOne({
      where: { username },
      include: [
        {
          model: Role,
          attributes: ['id', 'name', 'description']
        },
        {
          model: Company, // Include the companies associated with the user
          as: 'companies',
          attributes: ['id', 'name', 'email', 'logo', 'logoType'] // Updated attributes to match the Company model
        }
      ]
    });

    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Fetch role permissions
    const rolePermissions = await Permission.findAll({
      include: [{
        model: Role,
        where: { id: user.roleId },
        through: { attributes: [] }
      }],
      attributes: ['id', 'name', 'resource', 'action', 'description']
    });

    // Fetch user-specific permissions
    const userPermissions = await Permission.findAll({
      include: [{
        model: User,
        where: { id: user.id },
        through: { attributes: ['override'] }
      }],
      attributes: ['id', 'name', 'resource', 'action', 'description']
    });

    // Create a map to store the final permissions
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
      if (permission.Users[0].UserPermission.override) {
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

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        roleId: user.roleId,
        role: user.Role.name 
      }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    console.log('Login successful for:', username);
    console.log('Role:', user.Role.name);
    console.log('Permissions count:', finalPermissions.length);

    // Return user data with permissions and associated companies
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: {
          id: user.Role.id,
          name: user.Role.name,
          description: user.Role.description
        },
        permissions: finalPermissions,
        companies: user.companies || [] // Use the alias "companies"
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          attributes: ['id', 'name', 'description']
        },
        {
          model: Permission,
          through: { attributes: ['override'] },
          attributes: ['id', 'name', 'resource', 'action', 'description']
        },
        {
          model: Company,
          as: 'companies',
          attributes: ['id', 'name', 'email', 'logo', 'logoType']
        }
      ]
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
};


export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
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
        },
        {
          model: Company,
          as: 'companies',
          attributes: ['id', 'name', 'email', 'logo', 'logoType']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Combine role permissions and user-specific permissions
    const permissions = [...user.role.permissions];
    
    // Add user-specific permissions that override role permissions
    user.permissions.forEach(permission => {
      const index = permissions.findIndex(p => p.id === permission.id);
      if (index === -1) {
        permissions.push(permission);
      } else if (permission.UserPermission.override) {
        permissions[index] = permission;
      }
    });

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: {
        id: user.role.id,
        name: user.role.name,
        description: user.role.description
      },
      companies: user.companies, // include companies in current user data
      permissions: permissions
    };

    res.json(userData);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, email, password, phoneNumber, roleId, permissions } = req.body;

    // Validate required fields
    if (!username || !email || !password || !roleId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      roleId
    });

    // Assign permissions if provided
    if (permissions && permissions.length > 0) {
      const userPermissions = permissions.map(p => ({
        userId: user.id,
        permissionId: p.permissionId,
        override: p.override
      }));
      await UserPermission.bulkCreate(userPermissions);
    }

    // Fetch complete user data with associations
    const completeUser = await User.findByPk(user.id, {
      include: [
        {
          model: Role,
          attributes: ['name', 'description']
        },
        {
          model: Permission,
          through: { attributes: ['override'] },
          attributes: ['name', 'resource', 'action']
        }
      ]
    });

    res.status(201).json(completeUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, phoneNumber, roleId } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields
    const updates = {
      username,
      email,
      phoneNumber,
      roleId
    };

    // Only hash and update password if provided
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    await user.update(updates);

    // Fetch updated user with associations
    const updatedUser = await User.findByPk(id, {
      include: [
        {
          model: Role,
          attributes: ['name', 'description']
        },
        {
          model: Permission,
          through: { attributes: ['override'] },
          attributes: ['name', 'resource', 'action']
        }
      ]
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is the last admin
    if (user.roleId === 1) { // Assuming 1 is admin role ID
      const adminCount = await User.count({
        where: { roleId: 1 }
      });
      if (adminCount <= 1) {
        return res.status(400).json({ error: 'Cannot delete the last admin user' });
      }
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getUserPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const permissions = await Permission.findAll({
      include: [{
        model: User,
        where: { id },
        through: { attributes: ['override'] }
      }]
    });
    res.json(permissions);
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateUserPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove existing permissions
    await UserPermission.destroy({
      where: { userId: id }
    });

    // Add new permissions
    if (permissions && permissions.length > 0) {
      await UserPermission.bulkCreate(
        permissions.map(permissionId => ({
          userId: id,
          permissionId,
          override: true
        }))
      );
    }

    // Fetch updated permissions
    const updatedPermissions = await Permission.findAll({
      include: [{
        model: User,
        where: { id },
        through: { attributes: ['override'] }
      }]
    });

    res.json(updatedPermissions);
  } catch (error) {
    console.error('Error updating user permissions:', error);
    res.status(500).json({ error: error.message });
  }
};