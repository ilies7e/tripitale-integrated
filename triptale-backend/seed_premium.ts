import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding premium user...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Check if category exists or create one
  let category = await prisma.category.findFirst();
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Adventure',
        slug: 'adventure',
        icon: 'mountain'
      }
    });
  }

  // Create User
  const user = await prisma.user.upsert({
    where: { email: 'youcef@triptale.app' },
    update: {
      isPremium: true,
      isVerifiedPremium: true,
      password: hashedPassword,
    },
    create: {
      username: `youcef_${Date.now()}`,
      email: 'youcef@triptale.app',
      password: hashedPassword,
      fullName: 'Youcef Premium',
      bio: 'Professional traveler and content creator.',
      profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      isPremium: true,
      isVerifiedPremium: true,
    }
  });

  console.log(`Created user: ${user.username} (${user.email})`);

  // Delete old trips for this user if any to start fresh
  await prisma.trip.deleteMany({ where: { userId: user.id } });

  // Create Trips
  const trip1 = await prisma.trip.create({
    data: {
      userId: user.id,
      categoryId: category.id,
      title: 'Hidden Gems of Kyoto',
      description: 'A premium guide to the less explored temples and shrines in Kyoto.',
      location: 'Kyoto, Japan',
      country: 'Japan',
      coverPhoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      budget: 1500,
    }
  });

  const trip2 = await prisma.trip.create({
    data: {
      userId: user.id,
      categoryId: category.id,
      title: 'Backpacking the Alps',
      description: 'Everything you need to know about traversing the Swiss Alps on a budget.',
      location: 'Swiss Alps',
      country: 'Switzerland',
      coverPhoto: 'https://images.unsplash.com/photo-1522206090980-52fb97992765?auto=format&fit=crop&w=800&q=80',
      budget: 800,
    }
  });

  console.log(`Created trips: [${trip1.id}] ${trip1.title}, [${trip2.id}] ${trip2.title}`);

  // Create some fake saves/ratings for analytics to look good
  // We need a dummy user to be the one saving/rating, or just create one inline
  const fan = await prisma.user.upsert({
    where: { email: 'fan@triptale.app' },
    update: {},
    create: {
      username: 'fanboy',
      email: 'fan@triptale.app',
      password: hashedPassword,
      fullName: 'Biggest Fan',
    }
  });

  await prisma.savedTrip.createMany({
    data: [
      { userId: fan.id, tripId: trip1.id },
      { userId: fan.id, tripId: trip2.id },
    ],
    skipDuplicates: true,
  });

  await prisma.rating.createMany({
    data: [
      { userId: fan.id, tripId: trip1.id, value: 5 },
      { userId: fan.id, tripId: trip2.id, value: 4 },
    ],
    skipDuplicates: true,
  });

  await prisma.comment.createMany({
    data: [
      { userId: fan.id, tripId: trip1.id, content: 'This is amazing!' },
      { userId: fan.id, tripId: trip1.id, content: 'Thanks for sharing.' },
      { userId: fan.id, tripId: trip2.id, content: 'Can I do this in winter?' },
    ],
  });

  console.log('Added dummy engagement data for analytics.');
  console.log('Seeding complete! You can now login with youcef@triptale.app / password123');
}

main()
  .catch((e) => {
    console.error(e);

    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
