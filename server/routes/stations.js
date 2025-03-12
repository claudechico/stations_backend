import express from 'express';
import { 
  getAllStations, 
  getStationById, 
  createStation, 
  updateStation, 
  deleteStation 
} from '../controllers/StationController.js';
import { authenticateToken, authorizePermission } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all stations (requires stations:read permission)
router.get('/', authorizePermission('stations', 'read'), getAllStations);

// Get a single station by ID (requires stations:read permission)
router.get('/:id', authorizePermission('stations', 'read'), getStationById);

// Create a new station (requires stations:create permission)
router.post('/', authorizePermission('stations', 'create'), createStation);

// Update an existing station (requires stations:update permission)
router.put('/:id', authorizePermission('stations', 'update'), updateStation);

// Delete a station (requires stations:delete permission)
router.delete('/:id', authorizePermission('stations', 'delete'), deleteStation);

export default router;