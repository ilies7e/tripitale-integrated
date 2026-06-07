import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Upgrading 3 random users to premium...');

  // Get all users
  const users = await prisma.user.findMany({
    where: { isPremium: false }
  });

  if (users.length < 3) {
    console.log('Not enough non-premium users found. Seed the database first.');
    return;
  }

  // Shuffle and pick 3 users
  const shuffled = users.sort(() => 0.5 - Math.random());
  const selectedUsers = shuffled.slice(0, 3);

  // Upgrade them
  for (const user of selectedUsers) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isPremium: true,
        isVerifiedPremium: true,
        premiumSince: new Date(),
        premiumPlan: 'pro'
      }
    });
    console.log(`✅ Upgraded ${user.username} to Premium!`);
  }

  console.log('Done upgrading users.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
