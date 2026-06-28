import { Router } from 'express';
import { toggleBookmark, getBookmarks } from '../controllers/bookmarkController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/:postId', authenticate, toggleBookmark);
router.get('/', authenticate, getBookmarks);

export default router;
