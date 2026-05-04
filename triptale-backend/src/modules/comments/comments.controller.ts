import { Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError';
import * as service from './comments.service';

export const listForTrip = async (req: Request, res: Response) => {
  const tripId = Number(req.params.tripId);
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 50);
  res.json(await service.listForTrip(tripId, page, limit));
};

export const create = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const tripId = Number(req.params.tripId);
  const comment = await service.create(req.user.id, tripId, req.body.content);
  res.status(201).json(comment);
};

export const update = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const id = Number(req.params.id);
  const comment = await service.update(req.user.id, id, req.body.content);
  res.json(comment);
};

export const remove = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  await service.remove(req.user.id, Number(req.params.id));
  res.status(204).send();
};
