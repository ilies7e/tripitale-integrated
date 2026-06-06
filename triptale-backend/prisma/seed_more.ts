import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const FIRST_NAMES = ['Adam', 'Sarah', 'Mohammed', 'Lina', 'Omar', 'Amina', 'Tariq', 'Fatima', 'Karim', 'Nour', 'Yousef', 'Rania', 'Walid', 'Lila', 'Sami'];
const LAST_NAMES = ['Benali', 'Saidi', 'Mansouri', 'Kacemi', 'Haddad', 'Brahimi', 'Toumi', 'Zerrouk', 'Meziane', 'Amir', 'Tahar', 'Bouzid', 'Cherif'];
const LOCATIONS = ['Algiers', 'Oran', 'Constantine', 'Annaba', 'Tlemcen', 'Bejaia', 'Ghardaia', 'Tamanrasset', 'Djanet', 'Setif', 'Jijel', 'Tipaza', 'Biskra'];
const TRIP_ADJECTIVES = ['Amazing', 'Beautiful', 'Hidden', 'Spectacular', 'Unforgettable', 'Sunny', 'Historic', 'Peaceful', 'Vibrant', 'Magical', 'Incredible'];
const TRIP_NOUNS = ['Getaway', 'Adventure', 'Experience', 'Journey', 'Escape', 'Tour', 'Trek', 'Weekend', 'Trip', 'Holiday', 'Expedition'];

const PICS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
];

const TRIP_PICS = [
  'https://images.unsplash.com/photo-1504280390267-3310452f19d2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1628025378093-96b9479032b6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1631995872935-d964797502e0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1714313164992-4c33788bd6f7?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1631995390084-cb82295cd2c0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1664490283761-ee8376af809b?auto=format&fit=crop&w=1200&q=80',
];

const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

async function main() {
  console.log('Generating 20 random users and 50 random trips...');
  
  const password = await bcrypt.hash('password123', 10);
  
  const categories = await prisma.category.findMany();
  if (categories.length === 0) {
    console.error('No categories found. Run main seed script first.');
    return;
  }

  // Create 20 new users
  const newUsers = [];
  for (let i = 0; i < 20; i++) {
    const fn = randomElement(FIRST_NAMES);
    const ln = randomElement(LAST_NAMES);
    const username = `${fn.toLowerCase()}_${ln.toLowerCase()}_${randomInt(100, 9999)}`;
    
    // Check if username exists
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) continue;

    const user = await prisma.user.create({
      data: {
        username,
        email: `${username}@example.com`,
        password,
        fullName: `${fn} ${ln}`,
        bio: `Travel enthusiast from ${randomElement(LOCATIONS)}. Always looking for the next adventure.`,
        profilePicture: randomElement(PICS),
      }
    });
    newUsers.push(user);
    process.stdout.write('.');
  }
  console.log(`\nCreated ${newUsers.length} new users.`);

  // Create 50 new trips
  let tripsCreated = 0;
  for (let i = 0; i < 50; i++) {
    const user = randomElement(newUsers);
    const category = randomElement(categories);
    const loc = randomElement(LOCATIONS);
    
    await prisma.trip.create({
      data: {
        title: `${randomElement(TRIP_ADJECTIVES)} ${randomElement(TRIP_NOUNS)} in ${loc}`,
        description: `This was an incredible trip to ${loc}. The scenery was breathtaking and the local culture was amazing. Highly recommend visiting this area!`,
        location: loc,
        country: 'Algeria',
        coverPhoto: randomElement(TRIP_PICS),
        budget: randomInt(100, 1500),
        categoryId: category.id,
        userId: user.id,
      }
    });
    tripsCreated++;
    process.stdout.write('.');
  }
  
  console.log(`\nCreated ${tripsCreated} new trips.`);
  console.log('Done adding fake data!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
