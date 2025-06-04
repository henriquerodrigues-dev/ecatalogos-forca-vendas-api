import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { validateDTO } from '../middlewares/validation.middleware';
import { ProductDTO } from '../models/ProductDTO';

const router = Router();
const productController = new ProductController();

// 📊 Extras - rotas específicas primeiro
router.get('/count', productController.count);         // 🔢 Contagem total
router.get('/filters', productController.filters);     // 🔍 Filtros com contadores

// 🗑️ Soft Deleted
router.get('/deleted', productController.listDeleted);
router.get('/deleted/:id', productController.getDeleted);

// 📦 CRUD Principal
router.get('/', productController.list);
router.get('/:id', productController.get);
router.post('/', validateDTO(ProductDTO), productController.create);
router.put('/:id', validateDTO(ProductDTO), productController.update);
router.delete('/:id', productController.delete);

export default router;
