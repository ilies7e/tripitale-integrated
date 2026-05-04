import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';

const slugify = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const list = async () =>
  prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { trips: true } } },
  });

export const getById = async (id: number) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { trips: true } } },
  });
  if (!category) throw ApiError.notFound('Category not found');
  return category;
};

type CategoryWriteInput = {
  name: string;
  slug?: string;
  icon?: string;
  description?: string;
  coverImage?: string;
};

export const create = async (input: CategoryWriteInput) =>
  prisma.category.create({
    data: {
      name: input.name,
      slug: input.slug ?? slugify(input.name),
      icon: input.icon,
      description: input.description,
      coverImage: input.coverImage,
    },
  });

export const update = async (id: number, input: Partial<CategoryWriteInput>) =>
  prisma.category.update({ where: { id }, data: input });

export const remove = async (id: number) => {
  await prisma.category.delete({ where: { id } });
};
