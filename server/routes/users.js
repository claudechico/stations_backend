import express from 'express';
import {
  getUsers,
  getCurrentUser,
  createUser,
  updateUser,
  deleteUser,
  getUserPermissions,
  updateUserPermissions,
  register,
  login
} from '../controllers/UserController.js';
import { authenticateToken, authorizePermission } from './../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.use(authenticateToken);

// Get current user
router.get('/me', getCurrentUser);

// Get all users (requires users:read permission)
router.get('/', authorizePermission('users', 'read'), getUsers);

// Create new user (requires users:create permission)
router.post('/', authorizePermission('users', 'create'), createUser);

// Update user (requires users:update permission)
router.put('/:id', authorizePermission('users', 'update'), updateUser);

// Delete user (requires users:delete permission)
router.delete('/:id', authorizePermission('users', 'delete'), deleteUser);

// Get user permissions (requires permissions:read permission)
router.get('/:id/permissions', authorizePermission('permissions', 'read'), getUserPermissions);

// Update user permissions (requires permissions:update permission)
router.put('/:id/permissions', authorizePermission('permissions', 'update'), updateUserPermissions);

export default router;