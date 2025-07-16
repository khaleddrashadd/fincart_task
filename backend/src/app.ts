import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import authRoutes from './features/auth/routes/auth.routes.ts';

const app: Express = express();

app.use(
  cors({
    credential: true,
  })
);

app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', authRoutes);

export default app;
