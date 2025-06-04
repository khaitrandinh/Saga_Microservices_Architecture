// const { Kafka } = require('kafkajs');
const kafka = require('./kafkaClient'); 
const producer = kafka.producer();

const sendInventoryEvent = async (eventType, data) => {
  await producer.connect();
  await producer.send({
    topic: 'inventory-topic',
    messages: [{
      key: eventType,
      value: JSON.stringify({ eventType, data })
    }]
  });
  await producer.disconnect();
};

module.exports = { sendInventoryEvent };
