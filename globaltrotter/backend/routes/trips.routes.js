import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { createTrip, getTrips, getTripById, updateTrip, deleteTrip, shareTrip, copyTrip, getPackingList } from '../controllers/tripsController.js';

const router = express.Router();

router.use(requireAuth);
router.post('/', createTrip);
router.get('/', getTrips);
router.get('/:id', getTripById);
router.get('/:id/packing-list', getPackingList);
router.patch('/:id', updateTrip);
router.delete('/:id', deleteTrip);
router.post('/:id/share', shareTrip);
router.post('/:id/copy', copyTrip);

export default router;