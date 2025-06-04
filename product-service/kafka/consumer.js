// const { Kafka } = require('kafkajs');
const Product = require('../models/Product');
const { sendInventoryEvent } = require('./producer');
const kafka = require('./kafkaClient'); 

const consumer = kafka.consumer({ groupId: 'product-group' });

const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-topic', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const { eventType, data } = JSON.parse(message.value.toString());

      if (eventType !== 'order-created') return;
      const { orderId, productId, quantity } = data;

      try {
        const product = await Product.findById(productId);
        if (!product || product.quantity < quantity) {
          console.log(' Không đủ hàng cho đơn hàng:', orderId);
          await sendInventoryEvent('inventory-failed', { orderId });
          return;
        }

        // đủ hàng → trừ kho
        product.quantity -= quantity;
        await product.save();

        console.log(`Đã trừ ${quantity} sản phẩm cho đơn hàng ${orderId}`);
        await sendInventoryEvent('inventory-confirmed', { orderId, productId, quantity });

      } catch (err) {
        console.error('❌ Lỗi xử lý order-created:', err.message);
        await sendInventoryEvent('inventory-failed', { orderId });
      }
    }
  });
};

module.exports = startConsumer;
