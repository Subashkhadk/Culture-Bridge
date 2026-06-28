import { Router } from 'express';
import { getReports, updateReportStatus, createReport } from '../../controllers/admin/reportController';
import { authenticate } from '../../middleware/auth';
import { isAdmin } from '../../middleware/adminAuth';

const router = Router();

// Public (for users)
router.post('/', authenticate, createReport);

// Admin only
router.get('/', authenticate, isAdmin, getReports);
router.put('/:id', authenticate, isAdmin, updateReportStatus);

export default router;
