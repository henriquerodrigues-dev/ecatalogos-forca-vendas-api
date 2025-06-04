/**
 * app.ts
 * Configuração principal do Express App
 * Define middlewares globais e importa as rotas principais.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/product.routes"; // Importa rotas de produtos

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();

// Middlewares globais

// Habilita CORS para permitir requisições de outras origens
app.use(cors());

// Middleware para interpretar requisições com JSON no corpo
app.use(express.json());

// Rota básica de saúde para verificar se a API está online
app.get("/", (req, res) => {
  res.status(200).send("API está funcionando!");
});

// Registra as rotas de produto com o prefixo '/products'
app.use("/products", productRoutes);

// Exporta o app para ser usado no servidor principal
export default app;
