require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const orderRoutes = require('./routes/order.routes')
const app = express()

app.use(express.json())
app.use('/api/orders', orderRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(process.env.PORT, () => {
      console.log(`Order Service running on port ${process.env.PORT}`)
    })
  })
  .catch(err => console.error('MongoDB connection error:', err))