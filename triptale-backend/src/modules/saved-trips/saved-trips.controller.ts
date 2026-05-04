import { Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError';
import * as service from './saved-trips.service';

export const list = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  res.json(await service.list(req.user.id, page, limit));
};

export const create = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const saved = await service.create(req.user.id, req.body);
  res.status(201).json(saved);
};

export const update = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const saved = await service.update(req.user.id, Number(req.params.id), req.body);
  res.json(saved);
};

export const updateByTripId = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const saved = await service.updateByTripId(req.user.id, Number(req.params.tripId), req.body);
  res.json(saved);
};

export const remove = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  await service.removeById(req.user.id, Number(req.params.id));
  res.status(204).send();
};

export const removeByTripId = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  await service.removeByTripId(req.user.id, Number(req.params.tripId));
  res.status(204).send();
};

export const isSaved = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  res.json(await service.isSaved(req.user.id, Number(req.params.tripId)));
};
