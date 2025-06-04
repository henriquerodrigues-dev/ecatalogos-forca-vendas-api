import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { validateDTO } from '../middlewares/validation.middleware';
import { ProductDTO } from '../models/productDTO';

const router = Router();
const productController = new ProductController();

// Rotas para contagem e filtros de produtos
router.get('/count', productController.count);            // Retorna total de produtos ativos
router.get('/filters', productController.filters);        // Retorna filtros e contadores para UI

// Rotas para produtos soft deletados
router.get('/deleted', productController.listDeleted);    // Lista produtos deletados (soft delete) com paginação
router.get('/deleted/:id', productController.getDeleted); // Busca produto deletado por ID

// Rotas CRUD principais
router.get('/', productController.list);                  // Lista produtos ativos com filtros e paginação
router.get('/:id', productController.get);                // Busca produto ativo por ID
router.post('/', validateDTO(ProductDTO), productController.create);  // Cria novo produto com validação
router.put('/:id', validateDTO(ProductDTO), productController.update); // Atualiza produto por ID com validação
router.delete('/:id', productController.delete);          // Soft delete de produto por ID

export default router;
