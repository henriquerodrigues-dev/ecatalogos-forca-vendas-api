/**
 * app.ts
 * Configuração principal do Express App
 * Aqui definimos middlewares globais e importamos rotas.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/product.routes";// Importação das rotas de produtos

dotenv.config();

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota de saúde
app.get("/", (req, res) => {
  res.status(200).send("API está funcionando!");
});

// Rotas principais
app.use("/products", productRoutes); // Define prefixo '/products' para as rotas de produto

export default app;
