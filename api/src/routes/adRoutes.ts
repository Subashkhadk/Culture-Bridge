import { Router } from 'express';
import { createAd, getActiveAds, trackAdClick, getMyAds } from '../controllers/adController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createAd);
router.get('/active', getActiveAds);
router.post('/:id/click', trackAdClick);
router.get('/my-ads', authenticate, getMyAds);

export default router;
