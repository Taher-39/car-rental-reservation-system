import { Server } from 'http';
import mongoose from 'mongoose';
import config from './app/config';
import app from '.';

let server: Server;

async function main() {
  try {
    console.log('Attempting to connect to MongoDB...');
    const connection = await mongoose.connect(config.DB_URL as string);

    console.log(`MongoDB Connected: ${connection.connection.host}`);
    server = app.listen(config.PORT, () => {
      console.log(`App is listening on PORT ${config.PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}

main();

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
  process.exit(1);
});
