import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';

export const summary = async (tripId: number, currentUserId?: number) => {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) throw ApiError.notFound('Trip not found');
  const agg = await prisma.rating.aggregate({
    where: { tripId },
    _avg: { value: true },
    _count: { _all: true },
  });
  const distribution = await prisma.rating.groupBy({
    by: ['value'],
    where: { tripId },
    _count: { _all: true },
  });
  let userRating = 0;
  if (currentUserId) {
    const mine = await prisma.rating.findUnique({
      where: { userId_tripId: { userId: currentUserId, tripId } },
    });
    userRating = mine?.value ?? 0;
  }
  return {
    average: agg._avg.value ?? 0,
    count: agg._count._all,
    userRating,
    distribution: [1, 2, 3, 4, 5].map((v) => ({
      value: v,
      count: distribution.find((d) => d.value === v)?._count._all ?? 0,
    })),
  };
};

export const upsert = async (userId: number, tripId: number, value: number) => {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) throw ApiError.notFound('Trip not found');
  return prisma.rating.upsert({
    where: { userId_tripId: { userId, tripId } },
    create: { userId, tripId, value },
    update: { value },
  });
};

export const remove = async (userId: number, tripId: number) => {
  await prisma.rating.deleteMany({ where: { userId, tripId } });
};

export const myRating = async (userId: number, tripId: number) => {
  return prisma.rating.findUnique({ where: { userId_tripId: { userId, tripId } } });
};
