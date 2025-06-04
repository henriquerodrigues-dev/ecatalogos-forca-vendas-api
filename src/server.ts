/**
 * @file server.ts
 * @description Arquivo principal para iniciar o servidor HTTP usando Express.
 * Escuta a porta definida no ambiente ou a 3000 por padrão.
 */

import 'reflect-metadata'; // Necessário para decorators (class-validator/class-transformer)
import dotenv from 'dotenv';
import app from './app';

// Carrega variáveis de ambiente
dotenv.config();

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`✅ Servidor iniciado com sucesso!`);
  console.log(`🌐 Ambiente: ${ENV}`);
  console.log(`🚀 API disponível em: http://localhost:${PORT}`);
});

// Tratamento básico de erro ao iniciar servidor
process.on('uncaughtException', (err) => {
  console.error('🔥 Erro não tratado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Promessa rejeitada sem tratamento:', reason);
});