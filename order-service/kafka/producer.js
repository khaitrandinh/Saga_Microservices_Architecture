const kafka = require('./kafkaClient'); 
const producer = kafka.producer();


const sendOrderCreated = async (order) => {
  await producer.connect();
  await producer.send({
    topic: 'order-topic',
    messages: [{
      key: 'order-created',
      value: JSON.stringify({
        eventType: 'order-created',
        data: order
      })
    }]
  });
  await producer.disconnect();
};

module.exports = { sendOrderCreated };
