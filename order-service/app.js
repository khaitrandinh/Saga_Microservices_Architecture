require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const orderRoutes = require('./routes/order.routes')
const startConsumer = require('./kafka/consumer');
const startProductConsumer = require('./kafka/productConsumer');
import { connectDLTProducer } from './kafka/deadLetterProducer';  
const app = express()

app.use(express.json())
app.use('/api/orders', orderRoutes)

// Initialize Kafka
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    startProductConsumer();
    startConsumer();
    connectDLTProducer();
  })
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Product Service running on port ${process.env.PORT}`)
    )
  })
  .catch(err => console.error(err))
