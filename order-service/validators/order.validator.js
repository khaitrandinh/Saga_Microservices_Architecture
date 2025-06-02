const { body } = require('express-validator')

exports.createOrderValidator = [
  body('productId').isMongoId().withMessage('ID sản phẩm không hợp lệ'),
  body('quantity').isInt({ min: 1 }).withMessage('Số lượng phải ≥ 1'),
]

exports.updateStatusValidator = [
  body('status')
    .notEmpty().withMessage('Trạng thái là bắt buộc')
    .isIn(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'FAILED'])
    .withMessage('Trạng thái không hợp lệ')
]
