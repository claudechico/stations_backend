import Permission from '../models/permission.js';

// Get all permissions
export const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    
    return res.status(200).json(permissions);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching permissions', error });
  }
};

// Get a permission by ID
export const getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (permission) {
      return res.status(200).json(permission);
    } else {
      return res.status(404).json({ message: 'Permission not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching permission', error });
  }
};

// Create a new permission
export const createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;
    const permission = await Permission.create({ name, description });
    return res.status(201).json(permission);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating permission', error });
  }
};

// Update permission by ID
export const updatePermission = async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    const { name, description } = req.body;
    permission.name = name || permission.name;
    permission.description = description || permission.description;
    await permission.save();

    return res.status(200).json(permission);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating permission', error });
  }
};

// Delete permission by ID
export const deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    await permission.destroy();
    return res.status(200).json({ message: 'Permission deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting permission', error });
  }
};
