const express = require('express')
const router = express.Router()

const productCtrl = require('../controllers/product.controller')
const validate = require('../middlewares/validate.middleware')
const auth = require('../middlewares/auth.middleware')

const { createProductValidator } = require('../validators/product.validator')

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

// Các route dưới đây đã được thay thế bằng Kafka nên sẽ bỏ:
// router.patch('/:id/decrease', ...)
// router.patch('/rollback-quantity', ...)

module.exports = router // ✅ dòng này cần giữ lại để app.js dùng
