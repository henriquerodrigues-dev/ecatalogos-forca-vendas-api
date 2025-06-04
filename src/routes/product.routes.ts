import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router = Router();
const productController = new ProductController();

// Rotas obrigatórias
router.get('/', productController.list);
router.get('/:id', productController.get);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);

// Rotas opcionais (soft deleted)
router.get('/deleted', productController.listDeleted);
router.get('/deleted/:id', productController.getDeleted);

export default router;