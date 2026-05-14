import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const requirePremium = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      next(ApiError.unauthorized('User not authenticated'));
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { isPremium: true }
    });

    if (!user || !user.isPremium) {
      next(ApiError.forbidden('This feature requires a TripTale Premium subscription.'));
      return;
    }

    next();
  } catch (error) {
    next(ApiError.internal('Failed to verify premium status'));
  }
};
