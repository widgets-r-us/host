var express = require('express')
var router = express.Router()
var OrderService = require('../../services/orders.service')

router.get('/getOrders', async function(req, res, next) {
  let apiResponse = await OrderService.getOrders()
  return res.status(apiResponse).json(apiResponse)
})

router.get('/getMyOrder', async function(req, res, next) {
  let widgetsRUsUserId = req.query.widgetsRUsUserId
  let apiResponse = await OrderService.getMyOrder(widgetsRUsUserId)
  return res.status(apiResponse).json(apiResponse)
})

router.post('/createOrder', async function(req, res, next) {
  let orderId = req.body.orderId
  let productId = req.body.productId
  let apiResponse = await OrderService.createOrder(orderId, productId)
  return res.status(apiResponse.status).json(apiResponse)
})

router.post('/clearOrder', async function(req, res, next) {
  let orderId = req.body.orderId
  let productId = req.body.productId
  let apiResponse = await OrderService.clearOrder(orderId, productId)
  return res.status(apiResponse.status).json(apiResponse)
})

router.post('/createProduct', async function(req, res, next) {
  let orderId = req.body.orderId
  let productId = req.body.productId
  let apiResponse = await OrderService.associateOrderAndProduct(orderId, productId)
  return res.status(apiResponse.status).json(apiResponse)
})

router.post('/removeProduct', async function(req, res, next) {
  let orderId = req.body.orderId
  let productId = req.body.productId
  let apiResponse = await OrderService.dissociateOrderAndProduct(orderId, productId)
  return res.status(apiResponse.status).json(apiResponse)
})

router.post('/setQuantity', async function(req, res, next) {
  let orderId = req.body.orderId
  let productId = req.body.productId
  let quantity = req.body.quantity
  let apiResponse = await OrderService.setQuantity(orderId, productId, quantity)
  return res.status(apiResponse.status).json(apiResponse)
})

module.exports = router
