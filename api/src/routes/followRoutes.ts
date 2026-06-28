import { Router } from 'express';
import { followUser, getFollowers, getFollowing, checkFollowing } from '../controllers/followController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Route: POST /api/follow/:userId - Follow/unfollow a user
router.post('/:userId', authenticate, followUser);

// Route: GET /api/follow/followers/:userId - Get followers of a user
router.get('/followers/:userId', getFollowers);

// Route: GET /api/follow/following/:userId - Get users that a user is following
router.get('/following/:userId', getFollowing);

// Route: GET /api/follow/check/:userId - Check if current user is following a user
router.get('/check/:userId', authenticate, checkFollowing);

export default router;
