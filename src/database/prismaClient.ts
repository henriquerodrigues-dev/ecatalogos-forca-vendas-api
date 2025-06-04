/**
 * @file prismaClient.ts
 * @description Configuração e exportação da instância do Prisma Client
 * para ser utilizada em toda a aplicação para acesso ao banco de dados.
 */

import { PrismaClient } from '../../generated/prisma';

// Cria uma instância única do Prisma Client.
// Isso evita múltiplas conexões com o banco durante o hot reload (em dev).
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Loga queries para facilitar debug
});

export default prisma;