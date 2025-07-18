import app from './app.ts';
import { connectDatabase } from './config/connection.ts';
import { reminderService } from './services/expiration.service.js';

const startServer = async () => {
  //connect to database or perform other startup tasks here
  await connectDatabase();

  // Test email service configuration on startup
  await reminderService.testEmailService();

  const server = app.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
  });

  process.on('SIGTERM', () => {
    try {
      //logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        //logger.info('Process terminated');
        process.exit(0);
      });
    } catch (error) {
      //logger.error('Failed to start server:', error);
      process.exit(1);
    }
  });
};

startServer();
