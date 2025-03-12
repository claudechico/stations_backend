import express from 'express';
import { createPermission, getPermissions, getPermissionById, updatePermission, deletePermission } from "../controllers/permissionController.js";

const router = express.Router();

// Get all permissions
router.get('/', getPermissions);

// Get a single permission by id
router.get('/:id', getPermissionById);

// Create a new permission
router.post('/', createPermission);

// Update permission by id
router.put('/:id', updatePermission);

// Delete permission by id
router.delete('/:id', deletePermission);

export default router;
