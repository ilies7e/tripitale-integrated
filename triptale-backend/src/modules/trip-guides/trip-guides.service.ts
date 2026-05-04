import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';

type GuideInput = {
  type: 'budget' | 'mustvisit' | 'food' | 'warnings' | 'extra';
  label: string;
  icon?: string;
  text?: string;
  locations?: string[];
};

const serialize = (g: { locations: string; [k: string]: unknown }) => {
  let parsed: string[] = [];
  try {
    parsed = JSON.parse(g.locations);
    if (!Array.isArray(parsed)) parsed = [];
  } catch {
    parsed = [];
  }
  return { ...g, locations: parsed };
};

const assertOwnership = async (userId: number, tripId: number) => {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) throw ApiError.notFound('Trip not found');
  if (trip.userId !== userId) throw ApiError.forbidden('You do not own this trip');
};

export const list = async (tripId: number) => {
  const guides = await prisma.tripGuide.findMany({
    where: { tripId },
    orderBy: { id: 'asc' },
  });
  return guides.map(serialize);
};

export const upsert = async (userId: number, tripId: number, input: GuideInput) => {
  await assertOwnership(userId, tripId);
  const guide = await prisma.tripGuide.upsert({
    where: { tripId_type: { tripId, type: input.type } },
    create: {
      tripId,
      type: input.type,
      label: input.label,
      icon: input.icon,
      text: input.text ?? '',
      locations: JSON.stringify(input.locations ?? []),
    },
    update: {
      label: input.label,
      icon: input.icon,
      text: input.text ?? '',
      locations: JSON.stringify(input.locations ?? []),
    },
  });
  return serialize(guide);
};

export const replaceAll = async (userId: number, tripId: number, guides: GuideInput[]) => {
  await assertOwnership(userId, tripId);
  await prisma.$transaction([
    prisma.tripGuide.deleteMany({ where: { tripId } }),
    ...guides.map((g) =>
      prisma.tripGuide.create({
        data: {
          tripId,
          type: g.type,
          label: g.label,
          icon: g.icon,
          text: g.text ?? '',
          locations: JSON.stringify(g.locations ?? []),
        },
      }),
    ),
  ]);
  return list(tripId);
};

export const updateOne = async (
  userId: number,
  tripId: number,
  guideId: number,
  input: Partial<Omit<GuideInput, 'type'>>,
) => {
  await assertOwnership(userId, tripId);
  const data: Record<string, unknown> = { ...input };
  if (input.locations) data.locations = JSON.stringify(input.locations);
  const guide = await prisma.tripGuide.update({ where: { id: guideId }, data });
  return serialize(guide);
};

export const removeOne = async (userId: number, tripId: number, guideId: number) => {
  await assertOwnership(userId, tripId);
  await prisma.tripGuide.delete({ where: { id: guideId } });
};
