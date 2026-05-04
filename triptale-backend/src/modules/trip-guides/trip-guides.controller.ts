import { Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError';
import * as service from './trip-guides.service';

export const list = async (req: Request, res: Response) => {
  res.json(await service.list(Number(req.params.tripId)));
};

export const upsert = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const guide = await service.upsert(req.user.id, Number(req.params.tripId), req.body);
  res.status(201).json(guide);
};

export const replaceAll = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const guides = await service.replaceAll(
    req.user.id,
    Number(req.params.tripId),
    req.body.guides ?? [],
  );
  res.json(guides);
};

export const updateOne = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const guide = await service.updateOne(
    req.user.id,
    Number(req.params.tripId),
    Number(req.params.guideId),
    req.body,
  );
  res.json(guide);
};

export const removeOne = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  await service.removeOne(
    req.user.id,
    Number(req.params.tripId),
    Number(req.params.guideId),
  );
  res.status(204).send();
};
