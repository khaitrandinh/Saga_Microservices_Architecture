const Product = require('../models/Product');
const { sendInventoryEvent } = require('./producer');
const kafka = require('./kafkaClient');
const axios = require('axios');

const consumer = kafka.consumer({ groupId: 'product-group' });

const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-topic', fromBeginning: false });
  await consumer.subscribe({ topic: 'payment-topic', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const { eventType, data } = JSON.parse(message.value.toString());
      console.log(`Nhận message: ${eventType}`, data);
      
      if (topic === 'order-topic' && eventType === 'order-created') {
        const { orderId, productId, quantity, userId, amount } = data;

        try {
          const product = await Product.findById(productId);
          if (!product || product.quantity < quantity) {
            console.log('Không đủ hàng cho đơn hàng:', orderId);
            await sendInventoryEvent('inventory-failed', { orderId });
            return;
          }

          // đủ hàng → trừ kho
          product.quantity -= quantity;
          await product.save();

          console.log(`Đã trừ ${quantity} sản phẩm cho đơn hàng ${orderId}`);
          await sendInventoryEvent('inventory-confirmed', { orderId, productId, quantity, userId, amount });

        } catch (err) {
          console.error('Lỗi xử lý order-created:', err.message);
          await sendInventoryEvent('inventory-failed', { orderId });
        }
      }

      // Xử lý event từ payment-topic
      if (topic === 'payment-topic' && eventType === 'payment-failed') {
        const { orderId, productId, quantity } = data;

        try {
          await Product.findByIdAndUpdate(productId, {
            $inc: { quantity }
          });

          console.log(`Đã rollback tồn kho cho sản phẩm ${productId} (Đơn hàng ${orderId})`);
        } catch (err) {
          console.error('Lỗi rollback không dùng axios:', err.message);
        }
      }
    }
  });
};

module.exports = startConsumer;
