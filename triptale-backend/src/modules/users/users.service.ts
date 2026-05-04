import bcrypt from 'bcryptjs';
import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';
import type { UpdateProfileInput } from './users.schema';

const PUBLIC_USER = {
  id: true,
  username: true,
  email: true,
  fullName: true,
  profilePicture: true,
  bio: true,
  createdAt: true,
} as const;

export const getById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      ...PUBLIC_USER,
      _count: {
        select: {
          trips: true,
          comments: true,
          ratings: true,
          followers: true,
          following: true,
        },
      },
    },
  });
  if (!user) throw ApiError.notFound('User not found');
  return user;
};

export const updateProfile = async (id: number, input: UpdateProfileInput) => {
  const data: Record<string, unknown> = { ...input };
  if (input.password) {
    data.password = await bcrypt.hash(input.password, 10);
  }
  const user = await prisma.user.update({
    where: { id },
    data,
    select: PUBLIC_USER,
  });
  return user;
};

export const deleteAccount = async (id: number) => {
  await prisma.user.delete({ where: { id } });
};

export const tripsByUser = async (id: number, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.trip.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        category: true,
        media: true,
        _count: { select: { comments: true, ratings: true, savedBy: true } },
      },
    }),
    prisma.trip.count({ where: { userId: id } }),
  ]);
  return { items, total, page, limit };
};
