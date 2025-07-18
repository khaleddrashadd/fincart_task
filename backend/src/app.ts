import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import servicesRouter from './routes/service.routes.js';
import slotRouter from './routes/slot.routes.js';
import bookingsRouter from './routes/booking.routes.js';
import adminRouter from './routes/admin.routes.js';

const app: Express = express();

app.use(
  cors({
    origin: 'http://localhost:3000', // Your frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', servicesRouter);
app.use('/', slotRouter);
app.use('/', bookingsRouter);
app.use('/', adminRouter);

export default app;
