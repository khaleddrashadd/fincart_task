import { Router } from 'express';
import { AuthService } from '../services/auth.service.ts';
import { AuthController } from '../controllers/auth.controller.ts';

const authRouter = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);

export default authRouter;
