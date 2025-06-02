const express = require('express')
const router = express.Router()

const productCtrl = require('../controllers/product.controller')
const validate = require('../middlewares/validate.middleware')
const auth = require('../middlewares/auth.middleware')

const {
  createProductValidator,
  decreaseQuantityValidator
} = require('../validators/product.validator')

// [GET] Lấy danh sách tất cả sản phẩm
router.get('/', productCtrl.getAllProducts)

// [GET] Lấy thông tin 1 sản phẩm theo ID
router.get('/:id', productCtrl.getProductById)

// [POST] Tạo sản phẩm mới (cần xác thực và kiểm tra dữ liệu)
router.post(
  '/',
  auth,
  createProductValidator,
  validate,
  productCtrl.createProduct
)

// [PATCH] Trừ số lượng tồn kho khi tạo order (gọi từ OrderService)
router.patch(
  '/:id/decrease',
  auth,
  decreaseQuantityValidator,
  validate,
  productCtrl.decreaseQuantity
)

// [PATCH] Rollback tồn kho nếu payment thất bại
router.patch(
  '/rollback-quantity',
  auth,
  productCtrl.rollbackQuantity
)

module.exports = router
