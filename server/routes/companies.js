import express from 'express';
import multer from 'multer';
import { authenticateToken, authorizePermission } from '../middleware/auth.js';
import {
  getAllCompanies,
  getCompanyLogo,
  createCompany,
  updateCompany,
  deleteCompany,
  updateCompanyLogo,
  getCompanyById
} from '../controllers/CompanyController.js';
import { getCityById } from '../controllers/CityController.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all companies (requires companies:read permission)
router.get('/', authorizePermission('companies', 'read'), getAllCompanies);

// Get company by ID (requires companies:read permission)
router.get('/:id', authorizePermission('companies', 'read'),getCompanyById);

// Get company logo (requires companies:read permission)
router.get('/:id/logo', authorizePermission('companies', 'read'), getCompanyLogo);

// Create new company (requires companies:create permission)
router.post(
  '/',
  authorizePermission('companies', 'create'),
  upload.single('logo'),
  createCompany
);

// Update company (requires companies:update permission)
router.put(
  '/:id',
  authorizePermission('companies', 'update'),
  upload.single('logo'),
  updateCompany
);

// Delete company (requires companies:delete permission)
router.delete(
  '/:id',
  authorizePermission('companies', 'delete'),
  deleteCompany
);

// Update company logo (requires companies:update permission)
router.put(
  '/:id/logo',
  authorizePermission('companies', 'update'),
  upload.single('logo'),
  updateCompanyLogo
);

export default router;