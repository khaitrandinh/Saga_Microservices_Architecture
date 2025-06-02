const Order = require('../models/Order')
const axios = require('axios')
const mongoose = require('mongoose')

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL
// exports.createOrder = async (req, res) => {
//   const { productId, quantity } = req.body
//   const userId = req.user.userId

//   const headers = { Authorization: req.headers.authorization }

//   let order = null

//   try {
//     // 1. Lấy thông tin sản phẩm
//     const { data: product } = await axios.get(`${PRODUCT_SERVICE_URL}/${productId}`, { headers })

//     if (!product || product.quantity < quantity) {
//       return res.status(400).json({ message: 'Sản phẩm không đủ hàng' })
//     }

//     // 2. Tạo đơn hàng ban đầu
//     order = new Order({ productId, quantity, userId, status: 'PENDING' })
//     await order.save()

//     // 3. Gọi sang ProductService để trừ tồn kho
//     await axios.patch(`${PRODUCT_SERVICE_URL}/${productId}/decrease`, { quantity }, { headers })

//     // 4. Cập nhật trạng thái đơn hàng → CONFIRMED
//     order.status = 'CONFIRMED'
//     await order.save()

//     res.status(201).json({
//       message: 'Đặt hàng thành công',
//       order,
//       product
//     })
//   } catch (err) {
//     console.error('[OrderService] Lỗi tạo đơn hàng:', {
//       message: err.message,
//       response: err.response?.data,
//       url: err.config?.url
//     })
//     res.status(500).json({
//       message: 'Lỗi khi tạo đơn hàng',
//       error: err.response?.data || err.message
//     })
//   }
// }

exports.createOrder = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.userId;

  try {
    // B1. Kiểm tra tồn kho
    const { data: product } = await axios.get(`${PRODUCT_SERVICE_URL}/${productId}`);
    if (!product || product.quantity < quantity) {
      return res.status(400).json({ message: 'Sản phẩm không đủ hàng' });
    }

    // B2. Trừ tồn kho
    await axios.patch(`${PRODUCT_SERVICE_URL}/${productId}/decrease`, { quantity });

    // B3. Tạo đơn hàng (status = PENDING)
    const order = new Order({ productId, quantity, userId });
    await order.save();

    // B4. Gửi yêu cầu thanh toán tới Payment Service
    await axios.post(`${PAYMENT_SERVICE_URL}`, {
      orderId: order._id,
      amount: product.price * quantity,
      userId
    });

    res.status(201).json({ message: 'Đơn hàng đang xử lý thanh toán', order });
  } catch (err) {
    console.error('[OrderService] Lỗi tạo đơn hàng:', {
      message: err.message,
      response: err.response?.data,
      url: err.config?.url
    })
    res.status(500).json({
      message: 'Lỗi khi tạo đơn hàng',
      error: err.response?.data || err.message
    })
  }
};



exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
    res.json(orders)
  } catch (err) {
    console.error('[OrderService] Lỗi lấy đơn hàng:', err.message)
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng' })
  }
}

exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật trạng thái đơn hàng' });
  }
};
