var express = require('express')
var router = express.Router()
var OrdersService = require('../../services/orders.service')

router.post('/createOrder', async function(req, res, next) {
  let orderId = req.body.orderId
  let productId = req.body.productId
  let apiResponse = await OrdersService.createOrder(orderId, productId)
  return res.status(apiResponse.status).json(apiResponse)
})

router.post('/clearOrder', async function(req, res, next) {
  let orderId = req.body.orderId
  let productId = req.body.productId
  let apiResponse = await OrdersService.clearOrder(orderId, productId)
  return res.status(apiResponse.status).json(apiResponse)
})

router.post('/addProduct', async function(req, res, next) {
  let orderId = req.body.orderId
  let productId = req.body.productId
  let apiResponse = await OrdersService.addProduct(orderId, productId)
  return res.status(apiResponse.status).json(apiResponse)
})

router.post('/removeProduct', async function(req, res, next) {
  let orderId = req.body.orderId
  let productId = req.body.productId
  let apiResponse = await OrdersService.removeProduct(orderId, productId)
  return res.status(apiResponse.status).json(apiResponse)
})

router.post('/setQuantity', async function(req, res, next) {
  let orderId = req.body.orderId
  let productId = req.body.productId
  let quantity = req.body.quantity
  let apiResponse = await OrdersService.setQuantity(orderId, productId, quantity)
  return res.status(apiResponse.status).json(apiResponse)
})

module.exports = router
