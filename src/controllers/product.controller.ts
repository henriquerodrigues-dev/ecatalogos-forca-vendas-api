/**
 * product.controller.ts
 * Controlador responsável por receber as requisições de produtos,
 * chamar a camada de serviço e devolver respostas apropriadas.
 */

import { Request, Response } from 'express';
import productService from '../services/product.service';

export class ProductController {

  // Listar produtos com filtros e paginação
  async list(req: Request, res: Response) {
    try {
      const produtos = await productService.list(req.query);
      res.json(produtos);
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      res.status(500).json({ message: 'Erro ao listar produtos', error: error.message || error });
    }
  }

  // Buscar detalhes de um produto pelo id
  async get(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await productService.get(id);
      if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar produto', error });
    }
  }

  // Criar novo produto
  async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const newProduct = await productService.create(data);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar produto', error });
    }
  }

  // Atualizar produto pelo id
  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const updatedProduct = await productService.update(id, data);
      if (!updatedProduct) return res.status(404).json({ message: 'Produto não encontrado' });
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar produto', error });
    }
  }

  // Soft delete do produto (setar deleted_at)
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const deleted = await productService.softDelete(id);
      if (!deleted) return res.status(404).json({ message: 'Produto não encontrado' });
      res.json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar produto', error });
    }
  }

  // Listar produtos soft deleted
  async listDeleted(req: Request, res: Response) {
    try {
      const products = await productService.listDeleted(req.query);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar produtos deletados', error });
    }
  }

  // Buscar produto soft deleted pelo id
  async getDeleted(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await productService.getDeleted(id);
      if (!product) return res.status(404).json({ message: 'Produto deletado não encontrado' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar produto deletado', error });
    }
  }
}
