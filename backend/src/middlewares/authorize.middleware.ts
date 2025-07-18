import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@/models/user.model.ts';

export interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.slice(7);
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer') ||
      !token
    ) {
      res.status(401).json({ message: 'Unauthorized you are not logged in' });
      return;
    }

    //2) verify token
    const secret = process.env.JWT_SECRET || '123';
    const decoded = jwt.verify(token, secret) as JwtPayload;

    //3) check if user still exist in db
    const freshUser = await User.findById(decoded.id).select('+password');
    if (!freshUser) {
      res
        .status(401)
        .json({ message: 'The user belongs to token is no longer exist' });
      return;
    }

    (req as any).user = freshUser;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
};
