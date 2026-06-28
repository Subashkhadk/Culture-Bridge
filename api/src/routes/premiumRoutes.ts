import { Router } from 'express';
import { getPlans, checkPremiumStatus, createSubscription, cancelSubscription } from '../controllers/premiumController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/plans', getPlans);
router.get('/status', authenticate, checkPremiumStatus);
router.post('/subscribe', authenticate, createSubscription);
router.post('/cancel', authenticate, cancelSubscription);

export default router;
