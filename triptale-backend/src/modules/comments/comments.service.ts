import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';

const include = {
  user: { select: { id: true, username: true, profilePicture: true } },
} as const;

export const listForTrip = async (tripId: number, page = 1, limit = 50) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.comment.findMany({
      where: { tripId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include,
    }),
    prisma.comment.count({ where: { tripId } }),
  ]);
  return { items, total, page, limit };
};

export const create = async (userId: number, tripId: number, content: string) => {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) throw ApiError.notFound('Trip not found');
  return prisma.comment.create({ data: { userId, tripId, content }, include });
};

export const update = async (userId: number, id: number, content: string) => {
  const existing = await prisma.comment.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Comment not found');
  if (existing.userId !== userId) throw ApiError.forbidden('You do not own this comment');
  return prisma.comment.update({ where: { id }, data: { content }, include });
};

export const remove = async (userId: number, id: number) => {
  const existing = await prisma.comment.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Comment not found');
  if (existing.userId !== userId) throw ApiError.forbidden('You do not own this comment');
  await prisma.comment.delete({ where: { id } });
};
