import { Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError';
import * as service from './ratings.service';

export const summary = async (req: Request, res: Response) => {
  res.json(await service.summary(Number(req.params.tripId), req.user?.id));
};

export const upsert = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const tripId = Number(req.params.tripId);
  const rating = await service.upsert(req.user.id, tripId, Number(req.body.value));
  res.status(201).json(rating);
};

export const remove = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  await service.remove(req.user.id, Number(req.params.tripId));
  res.status(204).send();
};

export const myRating = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const r = await service.myRating(req.user.id, Number(req.params.tripId));
  res.json(r);
};
