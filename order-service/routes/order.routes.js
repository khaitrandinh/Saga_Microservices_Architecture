const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth.middleware')
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/order.controller')
const { updateStatusValidator } = require('../validators/order.validator')
const validateMiddleware = require('../middlewares/validate.middleware')

router.post('/', auth, createOrder)
router.get('/', auth, getOrders)

router.patch(
  '/:id/status',
  auth,
  updateStatusValidator,
  validateMiddleware,
  updateOrderStatus
)

module.exports = router
