import { PrismaClient } from '@prisma/client';

// Singleton Prisma client to avoid exhausting connections in dev
export const prisma = new PrismaClient();
