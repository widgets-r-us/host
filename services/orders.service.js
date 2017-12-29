var ApiResponse = require('api-response').ApiResponse
var OrdersDao = require('../daos/orders.dao')
var BaseService = require('base.service')
var BaseDao = require('../daos/base.dao')
var WidgetsRUsModel = require('@widgets-r-us/model')
var OrderXProduct = WidgetsRUsModel.OrderXProduct
var OrderValidator = WidgetsRUsModel.Validators.OrderValidator
var Order = WidgetsRUsModel.Order
var Product = WidgetsRUsModel.Product

// validator validates that these are mongoIds
let OrderXProductValidator = {validate: function(model) {}, validateSubset: function() {}}

exports.getOrders = async function() {
  try {
    let orders = await OrdersDao.readOrders()
    return new ApiResponse(200, orders)
  } catch(e) {
    return new ApiResponse(500, e.message)
  }
}

exports.getMyOrder = async function(widgetsRUsUserId) {
  let validation = OrderValidator.validateSubset({widgetsRUsUserId: widgetsRUsUserId})
  if (validation !== 'pass')
    return new ApiResponse(400, validation)

  try {
    let order = await Order.where({widgetsRUsUserId: widgetsRUsUserId})
    let orderXProducts = await OrderXProduct.where({orderId: order._id})
    let products = []
    for (const orderXProduct of orderXProducts) {
      products.push(await Product.findById(orderXProduct.productId))
    }
    return new ApiResponse(200, {products: products})
  } catch(e) {
    return new ApiResponse(500, e.message)
  }
}

exports.createOrder = async function(order) {
  return await BaseService.baseCreate(order, OrderValidator)
}

exports.updateOrder = async function(orderId, widgetsRUsUserId) {
  let validation = OrderValidator.validateSubset({widgetsRUsUserId: widgetsRUsUserId})
  if (validation !== 'pass')
    return new ApiResponse(400, validation)

  try {
    await Order.update({_id: orderId}, {$set: {widgetsRUsUserId: widgetsRUsUserId}})
    return new ApiResponse(204, {})
  } catch(e) {
    return new ApiResponse(500, e.message)
  }
}

exports.clearOrder = async function(orderId) {
  return await BaseService.baseDeleteByWhereClause(OrderXProduct, {orderId: orderId}, OrderXProductValidator)
}

exports.associateOrderAndProduct = async function(orderId, productId) {
  return await BaseService.baseCreate(new OrderXProduct({orderId: orderId, productId: productId, quantity: 1}), OrderXProductValidator)
}

exports.dissociateOrderAndProduct = async function(orderId, productId) {
  return await BaseService.baseDeleteByWhereClause(OrderXProduct, {orderId: orderId, productId: productId}, OrderXProductValidator)
}

exports.setQuantity = async function(orderId, productId, quantity) {
  try {
    await OrderXProduct.update({orderId: orderId, productId: productId}, {$set: {quantity: quantity}})
    return new ApiResponse(204, {})
  } catch(e) {
    return new ApiResponse(500, e.message)
  }
}
