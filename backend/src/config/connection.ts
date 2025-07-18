import mongoose from 'mongoose';
import { databaseConfig } from './database.config.ts';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(
      databaseConfig.mongodb.uri,
      databaseConfig.mongodb.options
    );

    mongoose.connection.on('error', (error) => {});

    mongoose.connection.on('disconnected', () => {});

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
