const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth.middleware')
const {
  createOrder,
  getOrders,
  updateOrderStatus,
  getOrderById
} = require('../controllers/order.controller')
const { updateStatusValidator } = require('../validators/order.validator')
const validateMiddleware = require('../middlewares/validate.middleware')

// Tạo đơn hàng mới
router.post('/', auth, createOrder)

// Lấy danh sách đơn hàng của người dùng
router.get('/', auth, getOrders)

// Lấy thông tin chi tiết 1 đơn hàng (phục vụ rollback tồn kho)
router.get('/:id', auth, getOrderById)

// Cập nhật trạng thái đơn hàng
router.patch(
  '/:id/status',
  auth,
  updateStatusValidator,
  validateMiddleware,
  updateOrderStatus
)

module.exports = router
