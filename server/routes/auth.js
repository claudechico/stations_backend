import express from 'express';
 import { getProfile } from '../controllers/authController.js';
 import { login } from '../controllers/UserController.js';

import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/profile', authenticate, getProfile);

export default router;
