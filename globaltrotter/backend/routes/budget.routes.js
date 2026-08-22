import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { getBudget } from '../controllers/budgetController.js';

const router = express.Router();
router.use(requireAuth);
router.get('/:id', getBudget);

export default router;