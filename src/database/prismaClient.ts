/**
 * prismaClient.ts
 * Inicializa e exporta a instância do Prisma Client para uso global na aplicação.
 * Evita múltiplas instâncias em ambiente de desenvolvimento.
 */

import { PrismaClient } from '../../generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;