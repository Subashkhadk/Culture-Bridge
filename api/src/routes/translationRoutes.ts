import { Router } from 'express';
import { translateTextHandler, getTranslationHistory, translatePost } from '../controllers/translationController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/translate', authenticate, translateTextHandler);
router.post('/post/:id/translate', authenticate, translatePost);
router.get('/history', authenticate, getTranslationHistory);

export default router;
