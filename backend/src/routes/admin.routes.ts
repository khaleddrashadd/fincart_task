import express from 'express';
import { reminderService } from '../services/expiration.service.js';
import { restrictTo } from '../middlewares/restrict.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';

const router = express.Router();

// Admin endpoint to manually trigger reminder check
router.post(
  '/admin/trigger-reminders',
  authorize,
  restrictTo('provider'), // Only providers can trigger this
  async (req, res) => {
    try {
      await reminderService.triggerReminderCheck();
      res.json({
        success: true,
        message: 'Reminder check triggered successfully',
      });
    } catch (error) {
      console.error('Error triggering reminder check:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to trigger reminder check',
      });
    }
  }
);

// Admin endpoint to test email service
router.post(
  '/admin/test-email',
  authorize,
  restrictTo('provider'), // Only providers can test this
  async (req, res) => {
    try {
      const isReady = await reminderService.testEmailService();
      res.json({
        success: true,
        emailServiceReady: isReady,
        message: isReady
          ? 'Email service is configured correctly'
          : 'Email service configuration issue',
      });
    } catch (error) {
      console.error('Error testing email service:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to test email service',
      });
    }
  }
);

export default router;
