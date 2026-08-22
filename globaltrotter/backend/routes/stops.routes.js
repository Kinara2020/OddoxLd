import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { addStop, updateStop, deleteStop, addActivityToStop } from '../controllers/stopsController.js';

const router = express.Router();

router.use(requireAuth);
router.post('/', addStop);
router.patch('/:id', updateStop);
router.delete('/:id', deleteStop);
router.post('/:id/activities', addActivityToStop);

export default router;