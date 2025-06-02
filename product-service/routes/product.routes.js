const express = require('express')
const router = express.Router()
const productCtrl = require('../controllers/product.controller')
const validate = require('../middlewares/validate.middleware')
const { createProductValidator, decreaseQuantityValidator } = require('../validators/product.validator')
const auth = require('../middlewares/auth.middleware')

// Lấy tất cả sản phẩm
router.get('/', productCtrl.getAllProducts)

// Lấy sản phẩm theo ID
router.get('/:id', productCtrl.getProductById)

// Tạo sản phẩm mới
router.post(
  '/',
  auth,
  createProductValidator,
  validate,
  productCtrl.createProduct
)

// Trừ tồn kho
router.patch(
  '/:id/decrease',
  auth,
  decreaseQuantityValidator,
  validate,
  productCtrl.decreaseQuantity
)

module.exports = router
