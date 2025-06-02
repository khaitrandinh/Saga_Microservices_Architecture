const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ email, password: hashedPassword })
    await user.save()
    res.status(201).json({ message: 'Đăng ký thành công' })
  } catch (err) {
    next(err)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return next({ statusCode: 400, message: 'Sai email hoặc mật khẩu' })
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return next({ statusCode: 400, message: 'Sai email hoặc mật khẩu' })
    if (!process.env.JWT_SECRET) {
      return next({ statusCode: 500, message: 'JWT_SECRET is not defined in environment variables' })
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
    res.json({ token })
  } catch (err) {
    next(err)
  }
}
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' })
    res.json(user)
  } catch (err) {
    next(err)
  }
}
