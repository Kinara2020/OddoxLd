import express from 'express';
import { searchCitiesController } from '../controllers/citiesController.js';

const router = express.Router();
router.get('/search', searchCitiesController);

export default router;