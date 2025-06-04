const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  userId: { type: String, required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
