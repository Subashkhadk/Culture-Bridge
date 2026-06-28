import { Router } from 'express';
import { createComment, getComments, deleteComment } from '../controllers/commentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/:postId', authenticate, createComment);
router.get('/:postId', getComments);
router.delete('/:id', authenticate, deleteComment);

export default router;
