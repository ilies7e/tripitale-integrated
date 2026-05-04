import { Prisma } from '@prisma/client';
import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';
import type { ListTripsQuery } from './trips.schema';

const tripInclude = {
  category: true,
  user: { select: { id: true, username: true, fullName: true, profilePicture: true } },
  media: true,
  guides: true,
  _count: { select: { comments: true, ratings: true, savedBy: true } },
} as const;

// guides.locations is stored as a JSON-encoded string in SQLite. Parse it back
// to a real array before sending to the client.
const parseGuideLocations = (g: { locations: string }) => {
  let locations: string[] = [];
  try {
    const parsed = JSON.parse(g.locations);
    if (Array.isArray(parsed)) locations = parsed.filter((x): x is string => typeof x === 'string');
  } catch {
    /* keep [] */
  }
  return { ...g, locations };
};

const decorateTrip = <T extends { guides?: { locations: string }[] }>(trip: T) => ({
  ...trip,
  guides: (trip.guides ?? []).map(parseGuideLocations),
});

type TripCreateInput = {
  title: string;
  description: string;
  location: string;
  region?: string;
  country?: string;
  coverPhoto?: string;
  budget?: number;
  categoryId: number;
};

const computeRating = async (tripId: number) => {
  const agg = await prisma.rating.aggregate({
    where: { tripId },
    _avg: { value: true },
    _count: { _all: true },
  });
  return { average: agg._avg.value ?? 0, count: agg._count._all };
};

export const create = async (userId: number, input: TripCreateInput) => {
  const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
  if (!category) throw ApiError.badRequest('Invalid categoryId');
  const trip = await prisma.trip.create({
    data: { ...input, userId },
    include: tripInclude,
  });
  return { ...decorateTrip(trip), rating: { average: 0, count: 0 } };
};

export const list = async (query: ListTripsQuery) => {
  const where: Prisma.TripWhereInput = {};

  if (query.q) {
    where.OR = [
      { title: { contains: query.q } },
      { description: { contains: query.q } },
      { location: { contains: query.q } },
      { region: { contains: query.q } },
      { country: { contains: query.q } },
    ];
  }
  if (query.location) where.location = { contains: query.location };
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.categorySlug) where.category = { slug: query.categorySlug };
  if (query.userId) where.userId = query.userId;
  if (query.username) where.user = { username: query.username };
  if (query.minBudget !== undefined || query.maxBudget !== undefined) {
    where.budget = {
      gte: query.minBudget,
      lte: query.maxBudget,
    };
  }

  const orderBy: Prisma.TripOrderByWithRelationInput | Prisma.TripOrderByWithRelationInput[] =
    query.sort === 'popular'
      ? [{ savedBy: { _count: 'desc' } }, { createdAt: 'desc' }]
      : query.sort === 'budgetAsc'
        ? { budget: 'asc' }
        : query.sort === 'budgetDesc'
          ? { budget: 'desc' }
          : { createdAt: 'desc' };

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    prisma.trip.findMany({
      where,
      orderBy,
      skip,
      take: query.limit,
      include: tripInclude,
    }),
    prisma.trip.count({ where }),
  ]);

  const enriched = await Promise.all(
    items.map(async (t) => ({ ...decorateTrip(t), rating: await computeRating(t.id) })),
  );

  let result = enriched;
  if (query.minRating !== undefined) {
    result = enriched.filter((t) => t.rating.average >= query.minRating!);
  }
  if (query.sort === 'rating') {
    result = [...result].sort((a, b) => b.rating.average - a.rating.average);
  }

  return { items: result, total, page: query.page, limit: query.limit };
};

export const getById = async (id: number) => {
  const trip = await prisma.trip.findUnique({ where: { id }, include: tripInclude });
  if (!trip) throw ApiError.notFound('Trip not found');
  const rating = await computeRating(id);
  return { ...decorateTrip(trip), rating };
};

export const update = async (
  userId: number,
  id: number,
  input: Partial<TripCreateInput>,
) => {
  const existing = await prisma.trip.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Trip not found');
  if (existing.userId !== userId) throw ApiError.forbidden('You do not own this trip');
  if (input.categoryId) {
    const cat = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!cat) throw ApiError.badRequest('Invalid categoryId');
  }
  const trip = await prisma.trip.update({ where: { id }, data: input, include: tripInclude });
  const rating = await computeRating(id);
  return { ...decorateTrip(trip), rating };
};

export const remove = async (userId: number, id: number) => {
  const existing = await prisma.trip.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Trip not found');
  if (existing.userId !== userId) throw ApiError.forbidden('You do not own this trip');
  await prisma.trip.delete({ where: { id } });
};
