const kafka = require('./kafkaClient'); 
const producer = kafka.producer();
// import {producer} from `kafka.producer()`; // Assuming you have a producer instance exported from kafkaClient.js
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
