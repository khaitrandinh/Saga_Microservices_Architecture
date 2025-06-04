require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const paymentRoutes = require('./routes/payment.routes')
const app = express()
const startConsumer = require('./kafka/consumer');


app.use(express.json())
app.use('/api/payments', paymentRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    startConsumer();
  })
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Product Service running on port ${process.env.PORT}`)
    )
  })
  .catch(err => console.error(err))
