import { Router } from 'express';
import {
  getOrCreateConversation,
  sendMessage,
  getConversations,
} from '../controllers/messageController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/conversations', authenticate, getConversations);
router.get('/conversations/:otherUserId', authenticate, getOrCreateConversation);
router.post('/conversations/:conversationId/messages', authenticate, sendMessage);

export default router;
