const Payment = require('../models/Payment');
const { sendPaymentEvent } = require('./producer');
const kafka = require('./kafkaClient');

const consumer = kafka.consumer({ groupId: 'payment-group' });

const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'inventory-topic', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const { eventType, data } = JSON.parse(message.value.toString());

      if (eventType !== 'inventory-confirmed') return;

      const { orderId, productId, quantity, userId } = data;
      const amount = 1000 * quantity; // ❗Giả định giá cố định, hoặc fetch từ DB nếu cần

      try {
        await Payment.create({
          orderId,
          userId,
          amount,
          status: 'PAID'
        });

        console.log(`✅ Payment success for order ${orderId}`);
        await sendPaymentEvent('payment-success', { orderId, userId });
      } catch (err) {
        console.error('❌ Lỗi thanh toán:', err.message);
        await sendPaymentEvent('payment-failed', { orderId, userId });
      }
    }
  });
};

module.exports = startConsumer;
