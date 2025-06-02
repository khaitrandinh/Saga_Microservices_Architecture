const Product = require('../models/Product')

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
  const { quantity } = req.body
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    { $inc: { quantity: -quantity } },
    { new: true }
  )
  if (!updated) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
  res.json(updated)
}

exports.increaseQuantity = async (req, res) => {
  const { quantity } = req.body;
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    { $inc: { quantity } },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  res.json(updated);
};
