const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth.middleware')
const paymentCtrl = require('../controllers/payment.controller')

router.post('/', auth, paymentCtrl.createPayment)
router.get('/', auth, paymentCtrl.getMyPayments)

module.exports = router