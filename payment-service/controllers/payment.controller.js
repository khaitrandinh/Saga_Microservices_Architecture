const Payment = require('../models/Payment')
const axios = require('axios');
const mongoose = require('mongoose')

exports.createPayment = async (req, res) => {
  const { orderId, amount, userId } = req.body

  console.log('[DEBUG] Dữ liệu nhận được từ ProductService:', req.body)
  console.log('[DEBUG] typeof amount:', typeof amount)

  // Kiểm tra định dạng ObjectId
  if (
    !mongoose.Types.ObjectId.isValid(orderId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return res.status(400).json({ message: 'orderId hoặc userId không hợp lệ' })
  }

  // Kiểm tra amount
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'amount không hợp lệ' })
  }

  try {
    // Tạo bản ghi Payment
    await Payment.create({
      orderId,
      amount,
      userId,
      status: 'PAID'
    })

    // Gửi event cập nhật trạng thái đơn hàng
    await axios.patch(`http://order-service:3003/api/orders/${orderId}/status`,
      { status: 'COMPLETED' },
      {
        headers: {
          Authorization: req.headers['authorization']
        }
      }
    )

    res.json({ message: 'Thanh toán thành công' })
  } catch (err) {
    console.error(' Lỗi khi thanh toán:', err.message)

    // Nếu lỗi → cập nhật đơn hàng FAILED
    try {
      await axios.patch(`http://order-service:3003/api/orders/${orderId}/status`,
        { status: 'FAILED' },
        {
          headers: {
            Authorization: req.headers['authorization']
          }
        }
      )
    } catch (patchErr) {
      console.error(' Lỗi rollback trạng thái đơn hàng:', patchErr.message)
    }

    res.status(400).json({
      message: 'Lỗi tạo payment',
      error: err.message || 'Request failed'
    })
  }
}



exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.userId })
    res.json(payments)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách thanh toán' })
  }
}