import { Router } from 'express';
import { 
  getUserProfile, 
  updateUserProfile, 
  updateAvatar,
  updateCoverPhoto,
  searchUsers,
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/search', authenticate, searchUsers);
router.get('/:id', getUserProfile);
router.put('/profile', authenticate, updateUserProfile);
router.put('/avatar', authenticate, updateAvatar);
router.put('/cover', authenticate, updateCoverPhoto);

export default router;
