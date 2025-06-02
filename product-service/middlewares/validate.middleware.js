const { validationResult } = require('express-validator')

module.exports = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return next({
      statusCode: 400,
      type: 'ValidationError',
      message: 'Dữ liệu không hợp lệ',
      details: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    })
  }

  next()
}
