import { Router } from 'express'
import productCtrl from '../controllers/productCtrl.js'

const router = Router()

router
  .route('/products')
  .get(productCtrl.getProducts)
  .post(productCtrl.createProduct)
router
  .route('/products/:id')
  .delete(productCtrl.deleteProduct)
  .put(productCtrl.updateProduct)

export default router
