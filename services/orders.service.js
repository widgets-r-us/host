var ApiResponse = require('api-response').ApiResponse
var OrdersDao = require('../daos/orders.dao')
var WidgetsRUsModel = require('@widgets-r-us/model')
var OrderXProduct = WidgetsRUsModel.OrderXProduct
var OrderValidator = WidgetsRUsModel.Validators.OrderValidator
var Order = WidgetsRUsModel.Order
var Product = WidgetsRUsModel.Product

exports.getOrders = async function() {
  try {
    let orders = await OrdersDao.readOrders()
    return new ApiResponse(200, orders)
  } catch(e) {
    return new ApiResponse(400, e.message)
  }
}

exports.getMyOrder = async function(widgetsRUsUserId) {
  if (!widgetsRUsUserId)
    return new ApiResponse(400, 'The specified widgetsRUsUserId was invalid.')

  try {
    let orders = await OrdersDao.readOrders()
    return new ApiResponse(200, orders)
  } catch(e) {
    return new ApiResponse(400, e.message)
  }
}

exports.createOrder = async function(order) {
  if (!req.body.widgetsRUsUserId)
    return new ApiResponse(400, 'No widgetsRUsUserId was specified')
  let validation = OrderValidator.validate(order)
  if (validation !== 'pass')
    return new ApiResponse(400, new validation)

  var order = {
    widgetsRUsUserId: req.body.widgetsRUsUserId
  }
  try {
    var createdOrder = await OrdersDao.createOrder(order)
    return res.status(201).json({status: 201, data: createdOrder})
  } catch(e) {
    return res.status(400).json({status: 400, message: e.message})
  }
}

exports.updateOrder = async function(req, res, next) {
  // TODO(ajmed): validate order, for now do some poor man validation
  if (!req.body._id)
    return res.status(400).json({status: 400, message: "No _id was specified"})
  else if (!req.body.widgetsRUsUserId)
    return res.status(400).json({status: 400, message: "No widgetsRUsUserId was specified"})

  var order = {
    _id: req.body._id,
    widgetsRUsUserId: req.body.widgetsRUsUserId
  }
  try {
    var createdOrder = await OrdersDao.createOrder(order)
    return res.status(201).json({status: 201, data: createdOrder})
  } catch(e) {
    return res.status(400).json({status: 400, message: e.message})
  }
}

exports.clearOrder = async function (req, res, next) {
  // if we're clearing an order we need to remove all the productIds associated
  // with this orderId
  // find and remove all OrderProduct entries where orderId = inOrderId

}

exports.associateOrderAndProduct = async function (req, res, next) {
  // pass in orderId
  // pass in productId
  // find entry with orderId = inOrderId and productId = inProductId
  // if exists
  //    increment quantity
  // else
  //    save entry to OrderProduct
}

exports.dissociateOrderAndProduct = async function (req, res, next) {
  // pass in orderId
  // pass in productId
}

exports.setQuantity = async function (orderId, productId, quantity) {
  // validate orderId, productId, and quantity
  // find entry with specified orderId and productId
  // change quantity to specfied quantity
  // save entry to OrderProduct
}
