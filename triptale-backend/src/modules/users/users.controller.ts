import { Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError';
import * as service from './users.service';

export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await service.getById(id);
  res.json(user);
};

export const me = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const user = await service.getById(req.user.id);
  res.json(user);
};

export const updateMe = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const user = await service.updateProfile(req.user.id, req.body);
  res.json(user);
};

export const deleteMe = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  await service.deleteAccount(req.user.id);
  res.status(204).send();
};

export const tripsByUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const result = await service.tripsByUser(id, page, limit);
  res.json(result);
};
