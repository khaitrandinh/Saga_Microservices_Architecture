const mongoose = require('mongoose');

const snapshotSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  name: String,
  price: Number,
  quantity: Number
}, { timestamps: true });

module.exports = mongoose.model('ProductSnapshot', snapshotSchema);
