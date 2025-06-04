const { Kafka, logLevel } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['localhost:9092'],
  retry: {
    initialRetryTime: 300,  // ms
    retries: 10,             
  },
  logLevel: logLevel.INFO,
    logCreator: (logLevel) => {
      return ({ namespace, level, label, log }) => {
        const { message, ...extra } = log
        console.log(`[${label}] ${message}`, extra)
      }
    }
})

module.exports = kafka
