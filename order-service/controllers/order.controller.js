const Order = require('../models/Order');
const { sendOrderCreated } = require('../kafka/producer');
const ProductSnapshot = require('../models/productSnapshot');
// exports.createOrder = async (req, res) => {
//   const { productId, quantity } = req.body;
//   const userId = req.user.userId;

//   try {
//     // B1. Lấy thông tin sản phẩm để tính giá
//     const { data: product } = await axios.get(`${PRODUCT_SERVICE_URL}/${productId}`, {
//       headers: { Authorization: req.headers['authorization'] }
//     });

//     if (!product || product.quantity < quantity) {
//       return res.status(400).json({ message: 'Sản phẩm không đủ hàng' });
//     }

//     const amount = Number(product.price) * Number(quantity);

//     // B2. Tạo đơn hàng 
//     const order = new Order({
//       productId,
//       quantity,
//       userId,
//       amount 
//     });

//     await order.save();

//     // B3. Gửi yêu cầu giảm tồn kho
//     await axios.patch(`${PRODUCT_SERVICE_URL}/${productId}/decrease`, {
//       orderId: order._id,
//       quantity
//     }, {
//       headers: { Authorization: req.headers['authorization'] }
//     });

//     res.status(201).json({ message: 'Đơn hàng đã tạo thành công', order });
//   } catch (err) {
//     console.error('Lỗi tạo đơn hàng:', err.message);
//     res.status(500).json({ message: 'Lỗi tạo đơn hàng', error: err.message });
//   }
// };

exports.createOrder = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user?.userId || 'default-user';
  const product = await ProductSnapshot.findOne({ productId });
  const amount = product.price * quantity; 
  try {
    const order = await Order.create({
      productId,
      quantity,
      amount,
      userId,
      status: 'PENDING'
    });

    // gửi event Kafka
    await sendOrderCreated({
      orderId: order._id.toString(),
      productId,
      quantity,
      amount,
      userId
    });

    res.status(201).json({ message: 'Đã tạo đơn hàng', order });
  } catch (err) {
    console.error('Lỗi tạo order:', err);
    res.status(500).json({ message: 'Tạo đơn hàng thất bại', error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật trạng thái đơn hàng' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy đơn hàng', error: err.message });
  }
};
