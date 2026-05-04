import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';

const PUBLIC_USER = {
  id: true,
  username: true,
  fullName: true,
  profilePicture: true,
  bio: true,
} as const;

export const follow = async (followerId: number, followingId: number) => {
  if (followerId === followingId) throw ApiError.badRequest('Cannot follow yourself');
  const target = await prisma.user.findUnique({ where: { id: followingId } });
  if (!target) throw ApiError.notFound('User not found');
  return prisma.follow.upsert({
    where: { followerId_followingId: { followerId, followingId } },
    create: { followerId, followingId },
    update: {},
  });
};

export const unfollow = async (followerId: number, followingId: number) => {
  await prisma.follow.deleteMany({ where: { followerId, followingId } });
};

export const followers = async (userId: number, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [rows, total] = await Promise.all([
    prisma.follow.findMany({
      where: { followingId: userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { follower: { select: PUBLIC_USER } },
    }),
    prisma.follow.count({ where: { followingId: userId } }),
  ]);
  return { items: rows.map((r) => r.follower), total, page, limit };
};

export const following = async (userId: number, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [rows, total] = await Promise.all([
    prisma.follow.findMany({
      where: { followerId: userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { following: { select: PUBLIC_USER } },
    }),
    prisma.follow.count({ where: { followerId: userId } }),
  ]);
  return { items: rows.map((r) => r.following), total, page, limit };
};

export const status = async (followerId: number, followingId: number) => {
  const f = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });
  return { following: !!f };
};
