import { Router } from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  registerForEvent,
  cancelRegistration,
  getMyEvents,
} from '../controllers/eventController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createEvent);
router.get('/', getEvents);
router.get('/my-events', authenticate, getMyEvents);
router.get('/:id', getEventById);
router.post('/:id/register', authenticate, registerForEvent);
router.delete('/:id/register', authenticate, cancelRegistration);

export default router;
