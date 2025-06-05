const kafka = require('./kafkaClient')
const producer = kafka.producer()

const connectDLTProducer = async () => {
  await producer.connect()
  console.log('DLT Producer connected')
}

const sendToDLT = async (originTopic, rawMessage, errorInfo) => {
  await producer.send({
    topic: 'dead-letter-topic',
    messages: [
      {
        value: JSON.stringify({
          originTopic,
          error: errorInfo.message,
          timestamp: Date.now(),
          rawMessage: rawMessage.value.toString()
        })
      }
    ]
  })

  console.log('Message sent to DLT:', rawMessage.value.toString())
}

module.exports = { connectDLTProducer, sendToDLT }
