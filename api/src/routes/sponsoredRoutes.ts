import { Router } from 'express';
import { createSponsoredPost, getSponsoredPosts } from '../controllers/sponsoredController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createSponsoredPost);
router.get('/', getSponsoredPosts);

export default router;
