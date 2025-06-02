const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'Order'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Số tiền không hợp lệ']
  },
  status: {
    type: String,
    enum: ['PAID', 'FAILED'],
    default: 'PAID'
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
