import { Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError';
import * as service from './auth.service';

export const register = async (req: Request, res: Response) => {
  const result = await service.register(req.body);
  res.status(201).json(result);
};

export const login = async (req: Request, res: Response) => {
  const result = await service.login(req.body);
  res.json(result);
};

export const refresh = async (req: Request, res: Response) => {
  const result = await service.refresh(req.body.refreshToken);
  res.json(result);
};

export const logout = async (req: Request, res: Response) => {
  await service.logout(req.body.refreshToken);
  res.status(204).send();
};

export const me = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const user = await service.me(req.user.id);
  res.json(user);
};
