require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const paymentRoutes = require('./routes/payment.routes')
const app = express()

app.use(express.json())
app.use('/api/payments', paymentRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Payment Service running on port', process.env.PORT)
    app.listen(process.env.PORT)
  })
  .catch(err => console.error('MongoDB connection error:', err))