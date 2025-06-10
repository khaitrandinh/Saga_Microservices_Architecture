require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const productRoutes = require('./routes/product.routes')
const startConsumer = require('./kafka/consumer');


const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/products', productRoutes)

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
