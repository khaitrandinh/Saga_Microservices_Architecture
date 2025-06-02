const { body, param } = require('express-validator')

exports.createProductValidator = [
  body('name').isString().withMessage('Tên sản phẩm phải là chuỗi'),
  body('price').isNumeric().withMessage('Giá phải là số'),
  body('quantity').isInt({ min: 0 }).withMessage('Số lượng phải là số nguyên ≥ 0'),
]

exports.decreaseQuantityValidator = [
  param('id').isMongoId().withMessage('ID không hợp lệ'),
  body('quantity').isInt({ min: 1 }).withMessage('Số lượng trừ phải ≥ 1')
]
