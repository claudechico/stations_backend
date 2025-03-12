import express from 'express';
import { authenticateToken, authorizePermission } from '../middleware/auth.js';
import { Role, Permission, RolePermission } from '../models/index.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all roles
router.get('/', async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [{
        model: Permission,
        through: { attributes: [] }
      }]
    });
    res.json(roles);
    console.log('Roles:', roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get role by ID
router.get('/:id', async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id, {
      include: [{
        model: Permission,
        through: { attributes: [] }
      }]
    });
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update role permissions
router.put('/:id/permissions', authorizePermission('permissions', 'update'), async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ message: 'Role not found' });

    await role.setPermissions(permissions);
    
    const updatedRole = await Role.findByPk(id, {
      include: [{
        model: Permission,
        through: { attributes: [] }
      }]
    });

    res.json(updatedRole);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;