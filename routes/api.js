var express = require('express')
var router = express.Router()
var users = require('./api/widgets-r-us-users')
var orders = require('./api/orders')
var widgets = require('./api/widgets')
var products = require('./api/products')

router.use('/users', users)
router.use('/widgets', widgets)
router.use('/orders', orders)
router.use('/products', products)

module.exports = router
