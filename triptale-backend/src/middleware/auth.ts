import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { verifyAccessToken } from '../utils/jwt';

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(ApiError.unauthorized('Missing or invalid Authorization header'));
    return;
  }
  const token = header.slice(7).trim();
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, username: payload.username, email: payload.email };
    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired access token'));
  }
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next();
    return;
  }
  try {
    const payload = verifyAccessToken(header.slice(7).trim());
    req.user = { id: payload.sub, username: payload.username, email: payload.email };
  } catch {
    // ignore – behaves as anonymous request
  }
  next();
};
