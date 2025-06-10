const Payment = require('../models/Payment')
const mongoose = require('mongoose')
const { sendPaymentEvent } = require('../kafka/producer');

exports.createPayment = async (req, res) => {
  const { orderId, amount, userId } = req.body;

  
  if (
    !mongoose.Types.ObjectId.isValid(orderId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return res.status(400).json({ message: 'orderId hoặc userId không hợp lệ' });
  }

  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'amount không hợp lệ' });
  }

  try {
    
    await Payment.create({
      orderId,
      amount,
      userId,
      status: 'PAID'
    });

    // Gửi Kafka event
    await sendPaymentEvent('payment-success', { orderId, userId });

    res.json({ message: 'Thanh toán thành công' });
  } catch (err) {
    console.error('Lỗi khi thanh toán:', err.message);

    // Gửi Kafka event thất bại
    await sendPaymentEvent('payment-failed', { orderId, userId });

    res.status(400).json({
      message: 'Lỗi tạo payment',
      error: err.message || 'Request failed'
    });
  }
};


exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.userId })
    res.json(payments)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách thanh toán' })
  }
}