import { Router } from 'express'
import categoryCtrl from '../controllers/categoryCtrl.js'
import auth from '../middleware/auth.js'
import authAdmin from '../middleware/authAdmin.js'

const router = Router()

router
  .route('/category')
  .get(categoryCtrl.getCategories)
  .post(auth, authAdmin, categoryCtrl.createCategory)
router
  .route('/category/:id')
  .delete(auth, authAdmin, categoryCtrl.deleteCategory)
  .put(auth, authAdmin, categoryCtrl.updateCategory)

export default router
