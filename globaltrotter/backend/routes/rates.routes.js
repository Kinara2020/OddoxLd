import express from 'express';
import { getRateMultiplier } from '../controllers/ratesController.js';

const router = express.Router();

router.get('/', getRateMultiplier);

export default router;
