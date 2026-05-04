import { Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError';
import * as service from './follows.service';

export const follow = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  await service.follow(req.user.id, Number(req.params.userId));
  res.status(204).send();
};

export const unfollow = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  await service.unfollow(req.user.id, Number(req.params.userId));
  res.status(204).send();
};

export const followers = async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  res.json(await service.followers(Number(req.params.userId), page, limit));
};

export const following = async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  res.json(await service.following(Number(req.params.userId), page, limit));
};

export const status = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  res.json(await service.status(req.user.id, Number(req.params.userId)));
};
