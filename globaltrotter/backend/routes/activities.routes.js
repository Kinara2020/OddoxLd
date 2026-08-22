import express from 'express';
import { getActivitiesController } from '../controllers/activitiesController.js';

const router = express.Router();
router.get('/', getActivitiesController);

export default router;