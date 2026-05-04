import { Request, Response } from 'express';
import * as service from './categories.service';

export const list = async (_req: Request, res: Response) => {
  res.json(await service.list());
};

export const getById = async (req: Request, res: Response) => {
  res.json(await service.getById(Number(req.params.id)));
};

export const create = async (req: Request, res: Response) => {
  const cat = await service.create(req.body);
  res.status(201).json(cat);
};

export const update = async (req: Request, res: Response) => {
  res.json(await service.update(Number(req.params.id), req.body));
};

export const remove = async (req: Request, res: Response) => {
  await service.remove(Number(req.params.id));
  res.status(204).send();
};
