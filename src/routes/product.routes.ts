import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { validateDTO } from '../middlewares/validation.middleware';
import { ProductDTO } from '../models/ProductDTO';

const router = Router();
const productController = new ProductController();

// Rotas de consultas específicas
router.get('/count', productController.count);         // Contagem total de produtos
router.get('/filters', productController.filters);     // Filtros disponíveis com contadores

// Rotas para produtos deletados (soft delete)
router.get('/deleted', productController.listDeleted); // Lista paginada de deletados
router.get('/deleted/:id', productController.getDeleted); // Busca deletado por ID

// Rotas principais CRUD
router.get('/', productController.list);               // Listagem geral
router.get('/:id', productController.get);             // Busca por ID
router.post('/', validateDTO(ProductDTO), productController.create); // Criação
router.put('/:id', validateDTO(ProductDTO), productController.update); // Atualização
router.delete('/:id', productController.delete);       // Exclusão (soft delete)

export default router;