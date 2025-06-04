/**
 * app.ts
 * Configuração central do Express App.
 * Define middlewares globais e registra as rotas principais da aplicação.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();

// Middlewares globais

// Permite requisições CORS de qualquer origem
app.use(cors());

// Habilita parsing automático do JSON no corpo das requisições
app.use(express.json());

// Rota simples para verificar se a API está ativa
app.get('/', (_req, res) => {
  res.status(200).send('API está funcionando!');
});

// Registra rotas relacionadas a produtos com o prefixo '/products'
app.use('/products', productRoutes);

export default app;