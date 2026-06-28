import { Router } from 'express';
import { toggleLike, getLikeCount } from '../controllers/likeController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/:postId', authenticate, toggleLike);
router.get('/:postId/count', getLikeCount);

export default router;
