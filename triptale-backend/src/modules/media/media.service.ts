import fs from 'node:fs/promises';
import path from 'node:path';
import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';
import { env } from '../../config/env';
import { inferMediaType } from '../../middleware/upload';

export const listForTrip = async (tripId: number) =>
  prisma.tripMedia.findMany({ where: { tripId }, orderBy: { uploadedAt: 'desc' } });

export const attach = async (
  userId: number,
  tripId: number,
  files: Express.Multer.File[],
  caption?: string,
) => {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) throw ApiError.notFound('Trip not found');
  if (trip.userId !== userId) throw ApiError.forbidden('You do not own this trip');
  if (!files?.length) throw ApiError.badRequest('No files uploaded');

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.isPremium) {
    const currentMediaCount = await prisma.tripMedia.count({ where: { tripId } });
    if (currentMediaCount + files.length > 10) {
      throw ApiError.forbidden('FREE_LIMIT_REACHED: Upgrade to Premium for unlimited uploads');
    }
  }

  const created = await prisma.$transaction(
    files.map((file) =>
      prisma.tripMedia.create({
        data: {
          tripId,
          mediaUrl: `/uploads/${path.basename(file.path)}`,
          mediaType: inferMediaType(file.mimetype),
          caption,
        },
      }),
    ),
  );
  return created;
};

export const remove = async (userId: number, id: number) => {
  const media = await prisma.tripMedia.findUnique({
    where: { id },
    include: { trip: true },
  });
  if (!media) throw ApiError.notFound('Media not found');
  if (media.trip.userId !== userId) throw ApiError.forbidden('You do not own this trip');

  // best-effort local file cleanup if served from local uploads
  try {
    const filename = media.mediaUrl.split('/uploads/')[1];
    if (filename) {
      const filePath = path.join(path.resolve(env.UPLOAD_DIR), filename);
      await fs.unlink(filePath).catch(() => undefined);
    }
  } catch {
    /* ignore */
  }

  await prisma.tripMedia.delete({ where: { id } });
};
