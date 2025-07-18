import { User } from '@/models/user.model.ts';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}
export const restrictTo = (userRole: 'user' | 'provider') => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.slice(7);
    if (!authHeader || !authHeader.startsWith('Bearer') || !token) {
      res.status(401).json({ message: 'Unauthorized you are not logged in' });
      return;
    }
    const decoded = jwt.decode(token) as JwtPayload;
    if (!decoded || !decoded.id) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    const { id } = decoded;
    const user = await User.findById(id).select('role');

    if (!user || user.role !== userRole) {
      res
        .status(403)
        .json({ message: 'You do not have permission to perform this action' });
      return;
    }
    next();
  };
};
