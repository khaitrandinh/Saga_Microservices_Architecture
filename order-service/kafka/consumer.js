const kafka = require('./kafkaClient')
const { sendCreatedOrder } = require('./producer')
const Order = require('../models/Order');

const consumer = kafka.consumer({ groupId: 'order-group' })


const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'inventory-topic', fromBeginning: false });
  await consumer.subscribe({ topic: 'payment-topic', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const { eventType, data } = JSON.parse(message.value.toString());
      console.log(`Nhận message: ${eventType}`, data);

      try {
        if (!data.orderId) return;

        if (eventType === 'inventory-confirmed') {
          await Order.findByIdAndUpdate(data.orderId, { status: 'CONFIRMED' });
        }

        if (eventType === 'inventory-failed') {
          await Order.findByIdAndUpdate(data.orderId, { status: 'FAILED' });
        }

        if (eventType === 'payment-success') {
          await Order.findByIdAndUpdate(data.orderId, { status: 'COMPLETED' });
        }

        if (eventType === 'payment-failed') {
          await Order.findByIdAndUpdate(data.orderId, { status: 'FAILED' });
        }
      } catch (err) {
        console.error('Lỗi xử lý message:', err.message);
      }
    }
  });
};

module.exports = startConsumer
