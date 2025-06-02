const Product = require('../models/Product')
const axios = require('axios');

exports.getAllProducts = async (req, res) => {
  const products = await Product.find()
  res.json(products)
}

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' })
  }
}

exports.createProduct = async (req, res) => {
  const { name, price, quantity } = req.body
  const product = new Product({ name, price, quantity })
  await product.save()
  res.status(201).json(product)
}

exports.decreaseQuantity = async (req, res) => {
  const { orderId, quantity } = req.body;
  const productId = req.params.id;
  const userId = req.user.userId;

  let product; 

  try {
    product = await Product.findById(productId);
    if (!product || product.quantity < quantity) {
      await axios.patch(`http://order-service:3003/api/orders/${orderId}/status`, {
        status: 'FAILED'
      }, {
        headers: { Authorization: req.headers['authorization'] }
      });
      return res.status(400).json({ message: 'Sản phẩm không đủ hàng' });
    }

    // Trừ tồn kho
    await Product.findByIdAndUpdate(productId, { $inc: { quantity: -quantity } });

    // Gửi yêu cầu thanh toán
    await axios.post('http://payment-service:3004/api/payments', {
      orderId,
      amount: product.price * quantity,
      userId
    }, {
      headers: { Authorization: req.headers['authorization'] }
    });

    res.json({ message: 'Đã xử lý tồn kho và gửi yêu cầu thanh toán' });
  } catch (err) {
    console.error('[ProductService] Lỗi xử lý tồn kho:', err.message);

   
    if (product) {
      await Product.findByIdAndUpdate(productId, { $inc: { quantity } });
    }

    await axios.patch(`http://order-service:3003/api/orders/${orderId}/status`, {
      status: 'FAILED'
    }, {
      headers: { Authorization: req.headers['authorization'] }
    });

    console.log('[DEBUG] Gửi sang payment:', {
      orderId,
      amount: product ? product.price * quantity : 'n/a',
      userId
    });

    res.status(400).json({
      message: 'Lỗi tạo payment',
      error: err.message,
      details: err.response?.data
    });
  }
};


exports.rollbackQuantity = async (req, res) => {
  const { orderId } = req.body;

  try {
    // Gọi OrderService để lấy chi tiết order
    const { data: order } = await axios.get(`http://order-service:3003/api/orders/${orderId}`, {
      headers: { Authorization: req.headers['authorization'] }
    });

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng để rollback' });
    }

    // Tăng lại tồn kho
    await Product.findByIdAndUpdate(order.productId, { $inc: { quantity: order.quantity } });

    res.json({ message: 'Đã rollback số lượng sản phẩm' });
  } catch (err) {
    console.error('[ProductService] Lỗi rollback tồn kho:', err.message);
    res.status(500).json({ message: 'Rollback tồn kho thất bại', error: err.message });
  }
};
