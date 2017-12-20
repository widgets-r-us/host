var express = require('express')
var router = express.Router()
var OrdersService = require('../../services/orders.service')

router.post('/createOrder', OrdersService.createOrder)
router.post('/clearOrder', OrdersService.clearOrder)
router.post('/addProduct', OrdersService.addProduct)
router.post('/removeProduct', OrdersService.removeProduct)
router.post('/setQuantity', OrdersService.setQuantity)
module.exports = router
