import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';

const include = {
  trip: {
    include: {
      category: true,
      user: { select: { id: true, username: true, fullName: true, profilePicture: true } },
      media: true,
      guides: true,
      _count: { select: { comments: true, ratings: true, savedBy: true } },
    },
  },
} as const;

type CreateInput = {
  tripId: number;
  notes?: string;
  priority?: number;
  pinned?: boolean;
  visited?: boolean;
  visitDate?: string | null;
  comment?: string | null;
};

type UpdateInput = Omit<Partial<CreateInput>, 'tripId'>;

const normalize = (input: UpdateInput | CreateInput) => {
  const data: Record<string, unknown> = { ...input };
  if (input.visitDate !== undefined) {
    data.visitDate = input.visitDate ? new Date(input.visitDate) : null;
  }
  return data;
};

export const list = async (userId: number, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.savedTrip.findMany({
      where: { userId },
      orderBy: [{ pinned: 'desc' }, { priority: 'desc' }, { createdAt: 'desc' }],
      skip,
      take: limit,
      include,
    }),
    prisma.savedTrip.count({ where: { userId } }),
  ]);
  return { items, total, page, limit };
};

export const create = async (userId: number, input: CreateInput) => {
  const trip = await prisma.trip.findUnique({ where: { id: input.tripId } });
  if (!trip) throw ApiError.notFound('Trip not found');
  const { tripId: _tripId, ...rest } = normalize(input);
  void _tripId;
  return prisma.savedTrip.upsert({
    where: { userId_tripId: { userId, tripId: input.tripId } },
    create: {
      userId,
      tripId: input.tripId,
      priority: input.priority ?? 0,
      ...rest,
    },
    update: rest,
    include,
  });
};

export const update = async (userId: number, id: number, input: UpdateInput) => {
  const existing = await prisma.savedTrip.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Saved trip not found');
  if (existing.userId !== userId) throw ApiError.forbidden();
  return prisma.savedTrip.update({ where: { id }, data: normalize(input), include });
};

export const updateByTripId = async (userId: number, tripId: number, input: UpdateInput) => {
  const existing = await prisma.savedTrip.findUnique({
    where: { userId_tripId: { userId, tripId } },
  });
  if (!existing) {
    // upsert convenience
    return prisma.savedTrip.upsert({
      where: { userId_tripId: { userId, tripId } },
      create: { userId, tripId, ...normalize(input) },
      update: normalize(input),
      include,
    });
  }
  return prisma.savedTrip.update({ where: { id: existing.id }, data: normalize(input), include });
};

export const removeById = async (userId: number, id: number) => {
  const existing = await prisma.savedTrip.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Saved trip not found');
  if (existing.userId !== userId) throw ApiError.forbidden();
  await prisma.savedTrip.delete({ where: { id } });
};

export const removeByTripId = async (userId: number, tripId: number) => {
  await prisma.savedTrip.deleteMany({ where: { userId, tripId } });
};

export const isSaved = async (userId: number, tripId: number) => {
  const s = await prisma.savedTrip.findUnique({ where: { userId_tripId: { userId, tripId } } });
  return { saved: !!s, savedTrip: s };
};
