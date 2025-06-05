/**
 * product.controller.ts
 * Controlador para rotas de produtos.
 * Encaminha requisições para o serviço e trata respostas HTTP.
 */

import { Request, Response } from 'express';
import productService from '../services/product.service';

export class ProductController {
  // Lista produtos ativos com filtros e paginação
  async list(req: Request, res: Response) {
    try {
      const produtos = await productService.list(req.query);
      res.json(produtos);
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      res.status(500).json({ message: 'Erro ao listar produtos', error: error.message || error });
    }
  }

  // Retorna produto ativo pelo ID, ou 404 se não existir
  async get(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const product = await productService.get(id);
      if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
      res.json(product);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      res.status(500).json({ message: 'Erro ao buscar produto', error });
    }
  }

  // Cria novo produto
  async create(req: Request, res: Response) {
    try {
      const newProduct = await productService.create(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      res.status(500).json({ message: 'Erro ao criar produto', error: error.message || 'Erro interno' });
    }
  }

  // Atualiza produto pelo ID, retorna 404 se não encontrado
  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const updatedProduct = await productService.update(id, req.body);
      if (!updatedProduct) return res.status(404).json({ message: 'Produto não encontrado' });
      res.json(updatedProduct);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      res.status(500).json({ message: 'Erro ao atualizar produto', error });
    }
  }

  // Soft delete de produto pelo ID (marca como deletado)
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const deleted = await productService.softDelete(id);
      if (!deleted) return res.status(404).json({ message: 'Produto não encontrado' });
      res.json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      res.status(500).json({ message: 'Erro ao deletar produto', error });
    }
  }

  // Lista produtos soft deletados com paginação
  async listDeleted(req: Request, res: Response) {
    try {
      const products = await productService.listDeleted(req.query);
      res.json(products);
    } catch (error) {
      console.error('Erro ao listar produtos deletados:', error);
      res.status(500).json({ message: 'Erro ao listar produtos deletados', error });
    }
  }

  // Busca produto soft deletado pelo ID
  async getDeleted(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await productService.getDeleted(id);
      if (!product) return res.status(404).json({ message: 'Produto deletado não encontrado' });
      res.json(product);
    } catch (error) {
      console.error('Erro ao buscar produto deletado:', error);
      res.status(500).json({ message: 'Erro ao buscar produto deletado', error });
    }
  }

  // Retorna total de produtos ativos
  async count(req: Request, res: Response) {
    try {
      const count = await productService.count(req.query);
      res.json({ count });
    } catch (error) {
      console.error('Erro ao contar produtos:', error);
      res.status(500).json({ message: 'Erro ao contar produtos', error });
    }
  }

  // Retorna dados agregados para filtros na UI
  async filters(req: Request, res: Response) {
    try {
      const filtros = await productService.filters();
      res.json(filtros);
    } catch (error) {
      console.error('Erro ao obter filtros:', error);
      res.status(500).json({ message: 'Erro ao obter filtros', error });
    }
  }
}
