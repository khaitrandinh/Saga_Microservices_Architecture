const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization']
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'Token không hợp lệ',
      error: 'MISSING_TOKEN' 
    })
  }

  const token = authHeader.split(' ')[1]
  
  // Kiểm tra token có tồn tại không
  if (!token) {
    return res.status(401).json({ 
      message: 'Token không hợp lệ',
      error: 'INVALID_TOKEN_FORMAT' 
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Có thể thêm validation cho payload
    if (!decoded.userId) {
      return res.status(401).json({ 
        message: 'Token không hợp lệ',
        error: 'INVALID_PAYLOAD' 
      })
    }

    
    req.user = decoded
    next()
  } catch (err) {
    // Phân biệt các loại lỗi
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token đã hết hạn',
        error: 'TOKEN_EXPIRED' 
      })
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Token không hợp lệ',
        error: 'INVALID_TOKEN' 
      })
    }
    
    return res.status(500).json({ 
      message: 'Lỗi server',
      error: 'SERVER_ERROR' 
    })
  }
}