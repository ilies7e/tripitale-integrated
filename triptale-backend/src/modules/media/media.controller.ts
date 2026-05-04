import { Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError';
import * as service from './media.service';

export const listForTrip = async (req: Request, res: Response) => {
  res.json(await service.listForTrip(Number(req.params.tripId)));
};

export const attach = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const tripId = Number(req.params.tripId);
  const files = (req.files as Express.Multer.File[]) ?? [];
  const caption = typeof req.body?.caption === 'string' ? req.body.caption : undefined;
  const created = await service.attach(req.user.id, tripId, files, caption);
  res.status(201).json(created);
};

export const remove = async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  await service.remove(req.user.id, Number(req.params.id));
  res.status(204).send();
};
