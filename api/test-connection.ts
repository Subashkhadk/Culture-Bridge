import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected!');
    
    // Try to count users
    const count = await prisma.user.count();
    console.log(`✅ Users count: ${count}`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Connection error:', error);
  }
}

test();
