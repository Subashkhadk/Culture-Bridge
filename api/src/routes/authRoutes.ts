import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', (req, res, next) => {
  // Log the request body
  console.log('📥 Registration request body:', req.body);
  next();
}, register);

router.post('/login', login);
router.get('/me', authenticate, getMe);

export default router;
