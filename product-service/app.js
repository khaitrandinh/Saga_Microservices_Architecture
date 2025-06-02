require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const axios = require('axios');
const productRoutes = require('./routes/product.routes')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/products', productRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Product Service running on port ${process.env.PORT}`)
    )
  })
  .catch(err => console.error(err))
