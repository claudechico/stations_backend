// routes/locationRoutes.js
import express from 'express';
import { 
  getAllCountries, 
  getCountryById, 
  createCountry, 
  updateCountry, 
  deleteCountry 
} from '../controllers/CountryController.js';
import { 
  getAllRegions, 
  getRegionById, 
  createRegion, 
  updateRegion, 
  deleteRegion 
} from '../controllers/RegionController.js';
import { 
  getAllCities, 
  getCityById, 
  createCity, 
  updateCity, 
  deleteCity 
} from '../controllers/CityController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Country Endpoints ---
router.get('/countries',getAllCountries);
router.get('/countries/:id',getCountryById);
router.post('/countries',createCountry);
router.put('/countries/:id',  updateCountry);
router.delete('/countries/:id', deleteCountry);

// --- Region Endpoints ---
router.get('/regions', getAllRegions);
router.get('/regions/:id',getRegionById);
router.post('/regions', createRegion);
router.put('/regions/:id', updateRegion);
router.delete('/regions/:id', deleteRegion);

// --- City Endpoints ---
router.get('/cities', getAllCities);
router.get('/cities/:id', getCityById);
router.post('/cities', createCity);
router.put('/cities/:id',  updateCity);
router.delete('/cities/:id', deleteCity);

export default router;
