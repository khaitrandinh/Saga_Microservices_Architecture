const kafka = require('./kafkaClient')
const { sendCreatedOrder } = require('./producer')
const { sendToDLT } = require('./deadLetterProducer') 
const Order = require('../models/Order');


const consumer = kafka.consumer({ groupId: 'order-group' })

// const runConsumer = async () => {
//   await consumer.connect()
//   console.log('Consumer connected (order)')

//   await consumer.subscribe({ topic: 'order-events', fromBeginning: true })

//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       try {
//         //  const { type, data } = JSON.parse(message.value.toString())

//         // if (parsed.eventType !== 'order-created') {
//         //   console.warn('Bỏ qua sự kiện không hợp lệ:', parsed.eventType)
//         //   return
//         // }

//         // const payment = parsed.data

        
//         // if (!order.orderId || !order.userId) {
//         //   throw new Error('Thiếu orderId hoặc userId')
//         // }

//         console.log(`📥 [Partition ${partition}] Order received:`, order)

//         const order = {
//           paymentId: Date.now(),
//           orderId: order.orderId,
//           userId: order.userId,
//           status: 'success',
//           amount: order.amount
//         }

//         await sendCreatedOrder(order)
//       } catch (err) {
//         console.error('Error xử lý message, chuyển vào Dead Letter Topic')
//         console.error(err.message)
//         await sendToDLT(topic, message, err)
//       }
//     }
//   })
// }

const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'inventory-topic', fromBeginning: false });
  await consumer.subscribe({ topic: 'payment-topic', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const { eventType, data } = JSON.parse(message.value.toString());
      console.log(`📥 Nhận message: ${eventType}`, data);

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
        console.error('❌ Lỗi xử lý message:', err.message);
      }
    }
  });
};

module.exports = startConsumer
