const ProductSnapshot = require('../models/productSnapshot');
const kafka = require('./kafkaClient'); 
const consumer = kafka.consumer({ groupId: 'order-product-group' });

const startProductConsumer = async () => {
  
  await consumer.connect();
  await consumer.subscribe({ topic: 'product-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const { eventType, data } = JSON.parse(message.value.toString());

      if (!data?.productId) return;

      try {
        if (eventType === 'product-created' || eventType === 'product-updated') {
          await ProductSnapshot.findOneAndUpdate(
            { productId: data.productId },
            {
              name: data.name,
              price: data.price,
              quantity: data.quantity
            },
            { upsert: true, new: true }
          );

          console.log(`Synced product snapshot: ${data.productId}`);
        }
      } catch (err) {
        console.error('Lỗi sync product:', err.message);
      }
    }
  });
};

module.exports = startProductConsumer;
