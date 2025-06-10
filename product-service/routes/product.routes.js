const express = require('express')
const router = express.Router()

const productCtrl = require('../controllers/product.controller')
const validate = require('../middlewares/validate.middleware')
const auth = require('../middlewares/auth.middleware')

const { createProductValidator } = require('../validators/product.validator')

// [GET] Lấy danh sách tất cả sản phẩm
router.get('/', productCtrl.getAllProducts)
//comparation with route above
router.get('/all', productCtrl.getAllProductsTest)

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


module.exports = router 
