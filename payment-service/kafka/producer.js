const kafka = require('./kafkaClient.js')
const producer = kafka.producer();

const sendPaymentEvent = async (eventType, data) => {
  await producer.connect();
  await producer.send({
    topic: 'payment-topic',
    messages: [{
      key: eventType,
      value: JSON.stringify({ eventType, data })
    }]
  });
  await producer.disconnect();
};

module.exports = { sendPaymentEvent };
