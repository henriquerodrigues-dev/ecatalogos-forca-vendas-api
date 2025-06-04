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

  console.log('\n🔧 Para testar a API, recomendamos usar o Postman: https://www.postman.com/downloads/');
  
  console.log('\n📚 Rotas disponíveis:\n');

  console.table([
    { Método: 'GET', Rota: '/products', Descrição: 'Listar produtos com filtros, query params e paginação' },
    { Método: 'GET', Rota: '/products/:id', Descrição: 'Buscar detalhes de um produto' },
    { Método: 'POST', Rota: '/products', Descrição: 'Criar novo produto e suas variantes/skus' },
    { Método: 'PUT', Rota: '/products/:id', Descrição: 'Atualizar produto (inclusive variantes/skus)' },
    { Método: 'DELETE', Rota: '/products/:id', Descrição: 'Soft delete → setar campo deleted_at com a data atual' },
    { Método: 'GET', Rota: '/products/deleted', Descrição: 'Listagem de produtos deletados (soft deleted)' },
    { Método: 'GET', Rota: '/products/deleted/:id', Descrição: 'Buscar um único produto deletado pelo ID (soft deleted)' },
  ]);
});

// Tratamento básico de erro ao iniciar servidor
process.on('uncaughtException', (err) => {
  console.error('🔥 Erro não tratado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Promessa rejeitada sem tratamento:', reason);
});
