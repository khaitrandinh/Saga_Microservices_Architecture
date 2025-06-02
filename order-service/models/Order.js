const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Số lượng phải lớn hơn 0']
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Tổng tiền không hợp lệ']
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    default: 'PENDING'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
