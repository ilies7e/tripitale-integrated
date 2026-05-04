import { Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError';
import * as service from './trips.service';

export const create = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const trip = await service.create(req.user.id, req.body);
  res.status(201).json(trip);
};

export const list = async (req: Request, res: Response) => {
  const result = await service.list(req.query as never);
  res.json(result);
};

export const getById = async (req: Request, res: Response) => {
  res.json(await service.getById(Number(req.params.id)));
};

export const update = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const trip = await service.update(req.user.id, Number(req.params.id), req.body);
  res.json(trip);
};

export const remove = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  await service.remove(req.user.id, Number(req.params.id));
  res.status(204).send();
};
