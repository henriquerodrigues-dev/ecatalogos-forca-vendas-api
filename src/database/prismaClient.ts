/**
 * @file prismaClient.ts
 * @description Configuração e exportação da instância do Prisma Client
 * para ser utilizada em toda a aplicação para acesso ao banco de dados.
 */

import { PrismaClient } from '../../generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;