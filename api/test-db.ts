import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    const users = await prisma.user.findMany();
    console.log(`✅ Found ${users.length} users:`);
    users.forEach(u => console.log(`  - ${u.email} (${u.username})`));
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

test();
