const express = require('express')
const { register, login, getMe } = require('../controllers/auth.controller')
const { registerValidator, loginValidator } = require('../validators/auth.validator')
const validate = require('../middlewares/validate.middleware')
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router()

router.post('/register', registerValidator, validate, register)
router.post('/login', loginValidator, validate, login)
router.get('/me',authMiddleware, getMe)

module.exports = router