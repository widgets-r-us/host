var express = require('express')
var router = express.Router()
var user = require('./api/widgets-r-us-user')
var order = require('./api/order')
var widget = require('./api/widget')
var product = require('./api/product')

router.use('/user', user)
router.use('/widget', widget)
router.use('/order', order)
router.use('/product', product)

module.exports = router
