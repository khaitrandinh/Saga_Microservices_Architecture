const Payment = require('../models/Payment')

exports.createPayment = async (req, res) => {
  const { orderId, amount, userId } = req.body;

  try {
    // Giả lập thanh toán thành công
    const payment = new Payment({ orderId, amount, userId, status: 'PAID' });
    await payment.save();

    // Gọi lại Order Service để cập nhật trạng thái đơn hàng
    await axios.patch(`${ORDER_SERVICE_URL}/${orderId}/status`, { status: 'COMPLETED' });

    res.status(201).json(payment);
  } catch (err) {
    console.error('[PaymentService] Lỗi xử lý thanh toán:', err.message);
    res.status(500).json({ message: 'Lỗi thanh toán' });
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