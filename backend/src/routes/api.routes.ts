import { Router } from 'express';
import { getBuses, getBusById } from '../controllers/busController';
import { lockSeats, confirmBooking } from '../controllers/bookingController';

const router = Router();

router.get('/buses', getBuses);
router.get('/buses/:busId', getBusById);
router.post('/bookings/lock', lockSeats);
router.post('/bookings', confirmBooking);

export default router;
