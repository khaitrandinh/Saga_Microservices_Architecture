const express = require('express');
const router = express.Router();
const { createPayment, getMyPayments } = require('../controllers/payment.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/', auth, createPayment);       
router.get('/', auth, getMyPayments);

module.exports = router;
