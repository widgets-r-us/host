var OrdersDao = require('../daos/orders.dao')
var WidgetsRUsModel = require('@widgets-r-us/model')
var OrderProduct = WidgetsRUsModel.OrderProduct

exports.getOrders = async function(req, res, next) {
  try {
    var orders = await OrdersDao.readOrders()
    return res.status(200).json({status: 200, data: orders})
  } catch(e) {
    return res.status(400).json({status: 400, message: e.message})
  }
}

exports.getMyOrder = async function(req, res, next) {
  var widgetsRUsUserId = req.query.widgetsRUsUserId
  // TODO(ajmed): validate order, for now do some poor man validation
  if (!req.body.widgetsRUsUserId)
    return res.status(400).json({status: 400, message: "No widgetsRUsUserId was specified"})

  var page = req.query.page ? req.query.page : 1
  var limit = req.query.limit ? req.query.limit : 1

  try {
    var orders = await OrdersDao.readOrders({}, page, limit)
    return res.status(200).json({status: 200, data: orders})
  } catch(e) {
    return res.status(400).json({status: 400, message: e.message})
  }
}

exports.createOrder = async function(req, res, next) {
  // TODO(ajmed): validate order, for now do some poor man validation
  if (!req.body.widgetsRUsUserId)
    return res.status(400).json({status: 400, message: "No widgetsRUsUserId was specified"})

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
exports.addProduct = async function (req, res, next) {
  // pass in orderId
  // pass in productId
  // find entry with orderId = inOrderId and productId = inProductId
  // if exists
  //    increment quantity
  // else
  //    save entry to OrderProduct
}
exports.removeProduct = async function (req, res, next) {
  // pass in orderId
  // pass in productId
}
exports.setQuantity = async function (req, res, next) {
  // pass in orderId
  // pass in productId
}
