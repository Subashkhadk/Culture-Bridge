import { Router } from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getCategories,
} from '../controllers/postController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createPost);
router.get('/', getPosts);
router.get('/categories', getCategories);
router.get('/:id', getPostById);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

export default router;
